import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import dotenv from "dotenv";
import matter from "gray-matter";
import { S3Client, HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config();

function getArgValue(args, name, fallback = undefined) {
  const idx = args.indexOf(name);
  if (idx === -1) return fallback;
  const value = args[idx + 1];
  if (!value || value.startsWith("--")) return fallback;
  return value;
}

function hasFlag(args, name) {
  return args.includes(name);
}

function normalizeBaseUrl(input) {
  if (!input) return input;
  return input.replace(/\/+$/, "");
}

function guessContentTypeFromKey(key) {
  const ext = key.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "avif":
      return "image/avif";
    case "gif":
      return "image/gif";
    case "svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}

function extractUploadSubpath(urlString) {
  try {
    const url = new URL(urlString);
    const pathName = url.pathname;
    const marker = "/wp-content/uploads/";
    const idx = pathName.indexOf(marker);
    if (idx === -1) return null;
    const sub = pathName.slice(idx + marker.length).replace(/^\/+/, "");
    return sub || null;
  } catch {
    return null;
  }
}

function collectUrlsFromText(text) {
  const urls = new Set();
  if (!text) return urls;

  const re = /https?:\/\/[^\s"'<>)]*\/wp-content\/uploads\/[^\s"'<>)]*/g;
  for (const match of text.matchAll(re)) {
    if (match[0]) urls.add(match[0]);
  }

  const imgRe = /<img[^>]*\ssrc=["']([^"']+)["'][^>]*>/g;
  for (const match of text.matchAll(imgRe)) {
    if (match[1] && match[1].includes("/wp-content/uploads/")) {
      urls.add(match[1]);
    }
  }

  return urls;
}

async function listMarkdownFiles(dir) {
  let entries = [];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const files = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listMarkdownFiles(full)));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(full);
    }
  }

  return files;
}

async function headObjectSafe(client, bucket, key) {
  try {
    await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function uploadFromUrl({ client, bucket, key, sourceUrl, dryRun }) {
  if (dryRun) return { uploaded: false, skipped: false, failed: false };

  const exists = await headObjectSafe(client, bucket, key);
  if (exists) return { uploaded: false, skipped: true, failed: false };

  const response = await fetch(sourceUrl);
  if (!response.ok) {
    return { uploaded: false, skipped: false, failed: true, status: response.status, url: sourceUrl };
  }

  const arrayBuffer = await response.arrayBuffer();
  const body = Buffer.from(arrayBuffer);
  const contentType = response.headers.get("content-type") || guessContentTypeFromKey(key);

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return { uploaded: true, skipped: false, failed: false };
}

async function main() {
  const args = process.argv.slice(2);
  const contentDir = path.resolve(process.cwd(), getArgValue(args, "--contentDir", "content/posts"));
  const endpoint = normalizeBaseUrl(getArgValue(args, "--endpoint", process.env.R2_ENDPOINT));
  const bucket = getArgValue(args, "--bucket", process.env.R2_BUCKET || "fitd");
  const publicBaseUrl = normalizeBaseUrl(getArgValue(args, "--publicBaseUrl", process.env.R2_PUBLIC_BASE_URL));
  const prefix = (getArgValue(args, "--prefix", process.env.R2_PREFIX || "uploads") || "")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");
  const dryRun = hasFlag(args, "--dryRun");

  if (!endpoint) throw new Error("Missing R2 endpoint (set R2_ENDPOINT or pass --endpoint).");
  if (!publicBaseUrl) throw new Error("Missing public base URL (set R2_PUBLIC_BASE_URL or pass --publicBaseUrl).");
  if (!process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
    throw new Error("Missing credentials (set R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY).");
  }

  const files = await listMarkdownFiles(contentDir);
  if (files.length === 0) {
    console.log(`No markdown files found in ${contentDir}`);
    return;
  }

  const client = new S3Client({
    region: "auto",
    endpoint,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true,
  });

  const replacements = new Map();

  for (const file of files) {
    const raw = await fs.readFile(file, "utf8");
    const parsed = matter(raw);
    const urls = new Set();

    const featuredUrl = parsed.data?.featuredImage?.url;
    if (typeof featuredUrl === "string" && featuredUrl.includes("/wp-content/uploads/")) {
      urls.add(featuredUrl);
    }

    for (const url of collectUrlsFromText(parsed.content)) {
      urls.add(url);
    }

    for (const sourceUrl of urls) {
      const subPath = extractUploadSubpath(sourceUrl);
      if (!subPath) continue;

      const key = [prefix, subPath].filter(Boolean).join("/");
      const newUrl = `${publicBaseUrl}/${key}`;

      if (!replacements.has(sourceUrl)) {
        const result = await uploadFromUrl({ client, bucket, key, sourceUrl, dryRun });
        if (result.failed) {
          console.error(`[fail] ${sourceUrl} (${result.status})`);
          continue;
        }
        replacements.set(sourceUrl, newUrl);
        console.log(result.uploaded ? `[upload] ${newUrl}` : `[skip] ${newUrl}`);
      }
    }
  }

  for (const file of files) {
    let raw = await fs.readFile(file, "utf8");
    let changed = false;

    for (const [sourceUrl, newUrl] of replacements.entries()) {
      if (raw.includes(sourceUrl)) {
        raw = raw.split(sourceUrl).join(newUrl);
        changed = true;
      }
    }

    if (changed && !dryRun) {
      await fs.writeFile(file, raw, "utf8");
      console.log(`[rewrite] ${file}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
