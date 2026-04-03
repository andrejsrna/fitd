import type { Metadata } from "next";
import { getAllPages, getAllPosts, getPageBySlug, getPostBySlug } from "@/lib/content";
import { LegacyContentNotice } from "@/components/legacy/legacy-content-notice";

export async function generateStaticParams() {
  const [posts, pages] = await Promise.all([getAllPosts(), getAllPages()]);
  const reserved = new Set([
    "clanky",
    "stranky",
    "obchod",
    "kategoria-produktu",
    "produkt",
    "tag",
    "author",
    "znacka",
  ]);

  const slugs = new Set<string>();

  for (const post of posts) {
    if (!reserved.has(post.slug)) {
      slugs.add(post.slug);
    }
  }

  for (const page of pages) {
    if (!reserved.has(page.slug)) {
      slugs.add(page.slug);
    }
  }

  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (post) {
    return {
      title: `${post.title} | Archivovaný odkaz`,
      robots: { index: false, follow: true },
    };
  }

  const page = await getPageBySlug(params.slug);
  if (page) {
    return {
      title: `${page.title} | Archivovaný odkaz`,
      robots: { index: false, follow: true },
    };
  }

  return {
    title: "Archivovaný odkaz | FitDoplnky",
    robots: { index: false, follow: true },
  };
}

export default async function LegacySlugPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (post) {
    return (
      <LegacyContentNotice
        title="Starý článkový odkaz"
        description={`Tento obsah bol presunutý. Nová adresa je /clanky/${params.slug}/.`}
      />
    );
  }

  const page = await getPageBySlug(params.slug);
  if (page) {
    return (
      <LegacyContentNotice
        title="Starý odkaz na stránku"
        description={`Tento obsah bol presunutý. Nová adresa je /stranky/${params.slug}/.`}
      />
    );
  }

  return (
    <LegacyContentNotice
      title="Archivovaný odkaz"
      description="Narazili ste na starú URL z pôvodného webu. Tento obsah sa už nepodarilo jednoznačne namapovať."
    />
  );
}
