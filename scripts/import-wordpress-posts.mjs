import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import dotenv from "dotenv";
import TurndownService from "turndown";
import turndownPluginGfm from "turndown-plugin-gfm";

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

function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeBasicEntities(text) {
  if (!text) return "";
  return text
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&hellip;", "...")
    .replaceAll("&#8211;", "-")
    .replaceAll("&#8212;", "--");
}

function yamlEscapeString(value) {
  const s = String(value ?? "");
  const escaped = s.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
  return `"${escaped}"`;
}

function yamlTaxonomyArray(values) {
  if (!values || values.length === 0) return null;
  return values
    .map((value) => `  - slug: ${yamlEscapeString(value.slug)}\n    name: ${yamlEscapeString(value.name)}`)
    .join("\n");
}

function safeFilename(slug) {
  const cleaned = slug
    .trim()
    .toLowerCase()
    .replaceAll("/", "-")
    .replaceAll("\\", "-")
    .replaceAll("..", "-")
    .replace(/[^a-z0-9\-_.]/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-+|-+$)/g, "");

  return cleaned || "post";
}

async function fetchWpPage({ baseUrl, type, page, perPage, status }) {
  const url = new URL(`${baseUrl}/wp-json/wp/v2/${type}`);
  url.searchParams.set("_embed", "1");
  url.searchParams.set("per_page", String(perPage));
  url.searchParams.set("page", String(page));
  if (status) url.searchParams.set("status", status);

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`WP API ${res.status} for ${url.toString()}\n${body}`);
  }

  const total = Number(res.headers.get("X-WP-Total") || 0);
  const totalPages = Number(res.headers.get("X-WP-TotalPages") || 0);
  const data = await res.json();
  return { data, total, totalPages };
}

function extractTerms(post) {
  const termGroups = post?._embedded?.["wp:term"];
  const categories = [];
  const tags = [];

  if (!Array.isArray(termGroups)) return { categories, tags };

  for (const group of termGroups) {
    if (!Array.isArray(group)) continue;

    for (const term of group) {
      if (!term || typeof term !== "object") continue;
      if (term.taxonomy === "category") {
        categories.push({ name: term.name, slug: term.slug });
      }
      if (term.taxonomy === "post_tag") {
        tags.push({ name: term.name, slug: term.slug });
      }
    }
  }

  return {
    categories: categories.filter((item) => item.name && item.slug),
    tags: tags.filter((item) => item.name && item.slug),
  };
}

function getFeaturedImage(post) {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];
  if (!media || typeof media !== "object") return null;
  const url = media.source_url || media.media_details?.sizes?.full?.source_url;
  if (!url) return null;

  return {
    url,
    alt: media.alt_text || "",
  };
}

function getAuthor(post) {
  const author = post?._embedded?.author?.[0];
  if (!author || typeof author !== "object") return null;

  return {
    name: author.name || "",
    slug: author.slug || "",
  };
}

function getSeo(post, featuredImage) {
  return {
    title: post?.yoast_head_json?.title || "",
    description: post?.yoast_head_json?.description || "",
    ogImage: post?.yoast_head_json?.og_image?.[0]?.url || featuredImage?.url || "",
  };
}

function createTurndown() {
  const turndown = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    emDelimiter: "_",
    bulletListMarker: "-",
  });

  const { gfm, gfmFlavors } = turndownPluginGfm;
  if (gfm) turndown.use(gfm);
  if (gfmFlavors) turndown.use(gfmFlavors);

  turndown.addRule("removeScriptStyle", {
    filter: ["script", "style"],
    replacement: () => "",
  });

  turndown.addRule("wpFigure", {
    filter: (node) => node.nodeName === "FIGURE",
    replacement: (content) => `\n\n${content}\n\n`,
  });

  turndown.addRule("preserveIframes", {
    filter: "iframe",
    replacement: (_content, node) => {
      const src = node.getAttribute("src");
      if (!src) return "";
      return `\n\n<iframe src="${src}"></iframe>\n\n`;
    },
  });

  return turndown;
}

function buildFrontmatter({ post, terms, featuredImage, author, seo, type }) {
  const title = decodeBasicEntities(stripHtml(post?.title?.rendered || ""));
  const excerpt = decodeBasicEntities(stripHtml(post?.excerpt?.rendered || ""));
  const categoriesYaml = yamlTaxonomyArray(terms.categories);
  const tagsYaml = yamlTaxonomyArray(terms.tags);

  return [
    "---",
    `title: ${yamlEscapeString(title)}`,
    `slug: ${yamlEscapeString(post.slug)}`,
    `date: ${yamlEscapeString(post.date)}`,
    `modified: ${yamlEscapeString(post.modified || post.date)}`,
    `excerpt: ${yamlEscapeString(excerpt)}`,
    `wordpressId: ${post.id}`,
    `wordpressLink: ${yamlEscapeString(post.link || "")}`,
    ...(type === "posts"
      ? [
          ...(categoriesYaml ? ["categories:", categoriesYaml] : ["categories: []"]),
          ...(tagsYaml ? ["tags:", tagsYaml] : ["tags: []"]),
        ]
      : []),
    ...(featuredImage
      ? [
          "featuredImage:",
          `  url: ${yamlEscapeString(featuredImage.url)}`,
          `  alt: ${yamlEscapeString(featuredImage.alt || "")}`,
        ]
      : ["featuredImage: null"]),
    ...(author
      ? [
          "author:",
          `  name: ${yamlEscapeString(author.name || "")}`,
          `  slug: ${yamlEscapeString(author.slug || "")}`,
        ]
      : []),
    "seo:",
    `  title: ${yamlEscapeString(seo.title || "")}`,
    `  description: ${yamlEscapeString(seo.description || "")}`,
    `  ogImage: ${yamlEscapeString(seo.ogImage || "")}`,
    "---",
    "",
  ].join("\n");
}

async function main() {
  const args = process.argv.slice(2);
  const baseUrl = normalizeBaseUrl(
    getArgValue(args, "--baseUrl", process.env.WORDPRESS_URL || process.env.WORDPRESS_API_URL),
  );
  const outDir = getArgValue(args, "--outDir", "content/posts");
  const perPage = Number(getArgValue(args, "--perPage", "100"));
  const status = getArgValue(args, "--status", "publish");
  const type = getArgValue(args, "--type", "posts");
  const limit = Number(getArgValue(args, "--limit", "0")) || 0;
  const dryRun = hasFlag(args, "--dryRun");
  const overwrite = !hasFlag(args, "--noOverwrite");

  if (!baseUrl) {
    throw new Error("Missing WordPress base URL (set WORDPRESS_URL or pass --baseUrl).");
  }

  const turndown = createTurndown();
  const resolvedOutDir = path.resolve(process.cwd(), outDir);

  if (!dryRun) {
    await fs.mkdir(resolvedOutDir, { recursive: true });
  }

  let page = 1;
  let totalPages = 0;
  let imported = 0;

  while (true) {
    const result = await fetchWpPage({ baseUrl, type, page, perPage, status });
    if (page === 1) {
      totalPages = result.totalPages || 0;
      console.log(`WordPress: total=${result.total} totalPages=${totalPages} perPage=${perPage}`);
    }

    const posts = Array.isArray(result.data) ? result.data : [];
    if (posts.length === 0) break;

    for (const post of posts) {
      if (!post?.slug) continue;

      const terms = type === "posts" ? extractTerms(post) : { categories: [], tags: [] };
      const featuredImage = getFeaturedImage(post);
      const author = type === "posts" ? getAuthor(post) : null;
      const seo = getSeo(post, featuredImage);
      const bodyHtml = post?.content?.rendered || "";
      const markdownBody = `${turndown.turndown(bodyHtml).trim()}\n`;
      const frontmatter = buildFrontmatter({ post, terms, featuredImage, author, seo, type });
      const filename = `${safeFilename(post.slug)}.md`;
      const outPath = path.join(resolvedOutDir, filename);

      if (dryRun) {
        console.log(`[dryRun] ${outPath}`);
      } else {
        try {
          if (!overwrite) {
            await fs.access(outPath);
            console.log(`[skip] exists ${outPath}`);
            continue;
          }
        } catch {
          // file does not exist
        }

        await fs.writeFile(outPath, frontmatter + markdownBody, "utf8");
        console.log(`[write] ${outPath}`);
      }

      imported += 1;
      if (limit > 0 && imported >= limit) {
        console.log(`Done (limit=${limit}).`);
        return;
      }
    }

    page += 1;
    if (totalPages && page > totalPages) break;
  }

  console.log(`Done. Imported ${imported} ${type} to ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
