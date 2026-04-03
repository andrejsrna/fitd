import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const SITE_URL = "https://www.fitdoplnky.sk";
const ADMIN_URL_RE = /https?:\/\/admin\.fitdoplnky\.sk(\/[^)\s"'<>]*)?/g;
const HTTP_CDN_RE = /http:\/\/cdn\.fitdoplnky\.sk\//g;
const ADMIN_MAIL_RE = /mailto:info@admin\.fitdoplnky\.sk/g;

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

function getSlugSet(files) {
  return new Set(files.map((file) => path.basename(file, ".md")));
}

function rewriteAdminUrl(url, postSlugs, pageSlugs) {
  let pathname = "/";

  try {
    pathname = new URL(url).pathname;
  } catch {
    return url;
  }

  const trimmed = pathname.replace(/^\/+|\/+$/g, "");
  if (!trimmed) return url;

  const [firstSegment, secondSegment] = trimmed.split("/");
  if (!firstSegment) return url;

  if (firstSegment === "wp-content") {
    const uploadsMarker = "/wp-content/uploads/";
    if (pathname.startsWith(uploadsMarker)) {
      return `https://cdn.fitdoplnky.sk/${pathname.slice(uploadsMarker.length)}`;
    }
    return SITE_URL;
  }

  if (
    firstSegment === "obchod" ||
    firstSegment === "kategoria-produktu" ||
    firstSegment === "produkt" ||
    firstSegment === "tag" ||
    firstSegment === "author"
  ) {
    return `${SITE_URL}${pathname}`;
  }

  if (firstSegment === "wp-admin" || firstSegment === "wp-login.php" || firstSegment === "xmlrpc.php") {
    return SITE_URL;
  }

  const slug = firstSegment;
  if (postSlugs.has(slug)) {
    return `${SITE_URL}/clanky/${slug}`;
  }

  if (pageSlugs.has(slug)) {
    return `${SITE_URL}/stranky/${slug}`;
  }

  if (secondSegment && postSlugs.has(secondSegment)) {
    return `${SITE_URL}/clanky/${secondSegment}`;
  }

  if (secondSegment && pageSlugs.has(secondSegment)) {
    return `${SITE_URL}/stranky/${secondSegment}`;
  }

  return url;
}

async function rewriteFile(file, postSlugs, pageSlugs) {
  const raw = await fs.readFile(file, "utf8");
  let next = raw
    .replace(HTTP_CDN_RE, "https://cdn.fitdoplnky.sk/")
    .replace(ADMIN_MAIL_RE, "mailto:info@fitdoplnky.sk");

  next = next.replace(ADMIN_URL_RE, (match) => rewriteAdminUrl(match, postSlugs, pageSlugs));

  if (next !== raw) {
    await fs.writeFile(file, next, "utf8");
    return true;
  }

  return false;
}

async function main() {
  const root = process.cwd();
  const postsDir = path.join(root, "content", "posts");
  const pagesDir = path.join(root, "content", "pages");

  const [postFiles, pageFiles] = await Promise.all([
    listMarkdownFiles(postsDir),
    listMarkdownFiles(pagesDir),
  ]);

  const postSlugs = getSlugSet(postFiles);
  const pageSlugs = getSlugSet(pageFiles);
  const files = [...postFiles, ...pageFiles];

  let changed = 0;

  for (const file of files) {
    if (await rewriteFile(file, postSlugs, pageSlugs)) {
      changed += 1;
      console.log(`[rewrite] ${file}`);
    }
  }

  console.log(`Done. Rewrote ${changed} markdown files.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
