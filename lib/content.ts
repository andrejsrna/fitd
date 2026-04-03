import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";

export interface TaxonomyEntry {
  slug: string;
  name: string;
}

export interface FeaturedImage {
  url: string;
  alt?: string;
}

export interface PostFrontmatter {
  title: string;
  slug: string;
  date: string;
  modified?: string;
  excerpt?: string;
  categories?: TaxonomyEntry[];
  tags?: TaxonomyEntry[];
  featuredImage?: FeaturedImage | null;
  author?: {
    name?: string;
    slug?: string;
  };
  wordpressId?: number;
  wordpressLink?: string;
  seo?: {
    title?: string;
    description?: string;
    ogImage?: string;
  };
}

export interface PostSummary {
  title: string;
  slug: string;
  date: string;
  modified?: string;
  excerpt: string;
  categories: TaxonomyEntry[];
  tags: TaxonomyEntry[];
  featuredImage: FeaturedImage | null;
  author?: {
    name?: string;
    slug?: string;
  };
  seo?: {
    title?: string;
    description?: string;
    ogImage?: string;
  };
}

export interface Post extends PostSummary {
  markdown: string;
  wordpressId?: number;
  wordpressLink?: string;
}

export interface PageSummary {
  title: string;
  slug: string;
  date: string;
  modified?: string;
  excerpt: string;
  seo?: {
    title?: string;
    description?: string;
    ogImage?: string;
  };
}

export interface Page extends PageSummary {
  markdown: string;
  wordpressId?: number;
  wordpressLink?: string;
}

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const PAGES_DIR = path.join(process.cwd(), "content", "pages");

function normalizeTaxonomyEntries(value: unknown): TaxonomyEntry[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const record = entry as Record<string, unknown>;
      const slug = typeof record.slug === "string" ? record.slug : "";
      const name = typeof record.name === "string" ? record.name : slug;

      if (!slug) return null;

      return { slug, name };
    })
    .filter((entry): entry is TaxonomyEntry => Boolean(entry));
}

function normalizeFeaturedImage(value: unknown): FeaturedImage | null {
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  const url = typeof record.url === "string" ? record.url : "";
  if (!url) return null;

  return {
    url,
    alt: typeof record.alt === "string" ? record.alt : undefined,
  };
}

function normalizeFrontmatter(data: unknown): PostFrontmatter {
  const fm = (data ?? {}) as Record<string, unknown>;

  const seo =
    typeof fm.seo === "object" && fm.seo
      ? {
          title:
            typeof (fm.seo as Record<string, unknown>).title === "string"
              ? ((fm.seo as Record<string, unknown>).title as string)
              : undefined,
          description:
            typeof (fm.seo as Record<string, unknown>).description === "string"
              ? ((fm.seo as Record<string, unknown>).description as string)
              : undefined,
          ogImage:
            typeof (fm.seo as Record<string, unknown>).ogImage === "string"
              ? ((fm.seo as Record<string, unknown>).ogImage as string)
              : undefined,
        }
      : undefined;

  const author =
    typeof fm.author === "object" && fm.author
      ? {
          name:
            typeof (fm.author as Record<string, unknown>).name === "string"
              ? ((fm.author as Record<string, unknown>).name as string)
              : undefined,
          slug:
            typeof (fm.author as Record<string, unknown>).slug === "string"
              ? ((fm.author as Record<string, unknown>).slug as string)
              : undefined,
        }
      : undefined;

  return {
    title: typeof fm.title === "string" ? fm.title : "",
    slug: typeof fm.slug === "string" ? fm.slug : "",
    date: typeof fm.date === "string" ? fm.date : "",
    modified: typeof fm.modified === "string" ? fm.modified : undefined,
    excerpt: typeof fm.excerpt === "string" ? fm.excerpt : undefined,
    categories: normalizeTaxonomyEntries(fm.categories),
    tags: normalizeTaxonomyEntries(fm.tags),
    featuredImage: normalizeFeaturedImage(fm.featuredImage),
    author,
    wordpressId: typeof fm.wordpressId === "number" ? fm.wordpressId : undefined,
    wordpressLink: typeof fm.wordpressLink === "string" ? fm.wordpressLink : undefined,
    seo,
  };
}

function compareByDateDesc(a: { date: string }, b: { date: string }) {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

function excerptFromMarkdown(markdown: string) {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[[^\]]+\]\([^)]+\)/g, "$1")
    .replace(/[#>*_`-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);
}

function toSummary(post: Post): PostSummary {
  return {
    title: post.title,
    slug: post.slug,
    date: post.date,
    modified: post.modified,
    excerpt: post.excerpt,
    categories: post.categories,
    tags: post.tags,
    featuredImage: post.featuredImage,
    author: post.author,
    seo: post.seo,
  };
}

export const getAllPosts = cache(async (): Promise<Post[]> => {
  let entries: string[] = [];

  try {
    entries = await fs.readdir(POSTS_DIR);
  } catch {
    return [];
  }

  const markdownFiles = entries.filter((entry) => entry.endsWith(".md"));

  const posts = await Promise.all(
    markdownFiles.map(async (filename) => {
      const fullPath = path.join(POSTS_DIR, filename);
      const raw = await fs.readFile(fullPath, "utf8");
      const parsed = matter(raw);
      const frontmatter = normalizeFrontmatter(parsed.data);
      const slug = frontmatter.slug || filename.replace(/\.md$/, "");

      return {
        title: frontmatter.title || slug,
        slug,
        date: frontmatter.date || "",
        modified: frontmatter.modified,
        excerpt: (frontmatter.excerpt || "").trim() || excerptFromMarkdown(parsed.content),
        categories: frontmatter.categories || [],
        tags: frontmatter.tags || [],
        featuredImage: frontmatter.featuredImage || null,
        author: frontmatter.author,
        seo: frontmatter.seo,
        markdown: parsed.content,
        wordpressId: frontmatter.wordpressId,
        wordpressLink: frontmatter.wordpressLink,
      } satisfies Post;
    }),
  );

  return posts.filter((post) => post.slug && post.date).sort(compareByDateDesc);
});

export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  const posts = await getAllPosts();
  return posts.find((post) => post.slug === slug) ?? null;
});

export const getAllCategories = cache(async (): Promise<TaxonomyEntry[]> => {
  const posts = await getAllPosts();
  const seen = new Map<string, TaxonomyEntry>();

  for (const post of posts) {
    for (const category of post.categories) {
      if (!seen.has(category.slug)) {
        seen.set(category.slug, category);
      }
    }
  }

  return Array.from(seen.values()).sort((a, b) => a.name.localeCompare(b.name, "sk"));
});

export const getAllTags = cache(async (): Promise<TaxonomyEntry[]> => {
  const posts = await getAllPosts();
  const seen = new Map<string, TaxonomyEntry>();

  for (const post of posts) {
    for (const tag of post.tags) {
      if (!seen.has(tag.slug)) {
        seen.set(tag.slug, tag);
      }
    }
  }

  return Array.from(seen.values()).sort((a, b) => a.name.localeCompare(b.name, "sk"));
});

export async function markdownToHtml(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(markdown);

  return String(file);
}

export async function getFilteredPosts({
  category,
  tag,
}: {
  category?: string;
  tag?: string;
}): Promise<PostSummary[]> {
  const posts = await getAllPosts();

  return posts
    .filter((post) => {
      if (category && !post.categories.some((item) => item.slug === category)) {
        return false;
      }

      if (tag && !post.tags.some((item) => item.slug === tag)) {
        return false;
      }

      return true;
    })
    .map(toSummary);
}

function toPageSummary(page: Page): PageSummary {
  return {
    title: page.title,
    slug: page.slug,
    date: page.date,
    modified: page.modified,
    excerpt: page.excerpt,
    seo: page.seo,
  };
}

export const getAllPages = cache(async (): Promise<Page[]> => {
  let entries: string[] = [];

  try {
    entries = await fs.readdir(PAGES_DIR);
  } catch {
    return [];
  }

  const markdownFiles = entries.filter((entry) => entry.endsWith(".md"));

  const pages = await Promise.all(
    markdownFiles.map(async (filename) => {
      const fullPath = path.join(PAGES_DIR, filename);
      const raw = await fs.readFile(fullPath, "utf8");
      const parsed = matter(raw);
      const frontmatter = normalizeFrontmatter(parsed.data);
      const slug = frontmatter.slug || filename.replace(/\.md$/, "");

      return {
        title: frontmatter.title || slug,
        slug,
        date: frontmatter.date || "",
        modified: frontmatter.modified,
        excerpt: (frontmatter.excerpt || "").trim() || excerptFromMarkdown(parsed.content),
        seo: frontmatter.seo,
        markdown: parsed.content,
        wordpressId: frontmatter.wordpressId,
        wordpressLink: frontmatter.wordpressLink,
      } satisfies Page;
    }),
  );

  return pages.filter((page) => page.slug).sort(compareByDateDesc);
});

export const getPageBySlug = cache(async (slug: string): Promise<Page | null> => {
  const pages = await getAllPages();
  return pages.find((page) => page.slug === slug) ?? null;
});

export const getPagesSummary = cache(async (): Promise<PageSummary[]> => {
  const pages = await getAllPages();
  return pages.map(toPageSummary);
});
