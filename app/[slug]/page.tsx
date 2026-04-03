import type { Metadata } from "next";
import {
  getAllPages,
  getAllPostLegacySlugs,
  getAllPosts,
  getPageBySlug,
  getPostByLegacySlug,
  getPostBySlug,
  markdownToHtml,
} from "@/lib/content";
import { LegacyContentNotice } from "@/components/legacy/legacy-content-notice";
import { Section, Container, Article } from "@/components/craft";
import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Balancer from "react-wrap-balancer";

export async function generateStaticParams() {
  const [posts, pages, legacyPostSlugs] = await Promise.all([
    getAllPosts(),
    getAllPages(),
    getAllPostLegacySlugs(),
  ]);
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

  for (const slug of legacyPostSlugs) {
    if (!reserved.has(slug)) {
      slugs.add(slug);
    }
  }

  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = (await getPostBySlug(params.slug)) ?? (await getPostByLegacySlug(params.slug));
  if (post) {
    return {
      title: post.seo?.title || post.title,
      description: post.seo?.description || post.excerpt,
      robots: { index: false, follow: true },
      openGraph: {
        images: post.seo?.ogImage || post.featuredImage?.url ? [post.seo?.ogImage || post.featuredImage?.url || ""] : [],
      },
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
  const directPost = await getPostBySlug(params.slug);
  const legacyPost = directPost ? null : await getPostByLegacySlug(params.slug);
  const post = directPost ?? legacyPost;
  if (post) {
    if (directPost) {
      return (
        <LegacyContentNotice
          title="Starý článkový odkaz"
          description={`Tento obsah bol presunutý. Nová adresa je /clanky/${params.slug}/.`}
        />
      );
    }

    const html = await markdownToHtml(post.markdown);
    const date = new Date(post.date).toLocaleDateString("sk-SK", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const category = post.categories[0];

    return (
      <Section>
        <Container>
          <h1>
            <Balancer>
              <span>{post.title}</span>
            </Balancer>
          </h1>

          <div className="flex justify-between items-center gap-4 text-sm mb-4">
            <h5>Publikované {date}</h5>
            {category ? (
              <Link
                href={`/clanky/kategorie/${category.slug}`}
                className={cn(badgeVariants({ variant: "outline" }), "not-prose")}
              >
                {category.name}
              </Link>
            ) : null}
          </div>

          {post.featuredImage?.url ? (
            <div className="h-96 my-12 md:h-[560px] overflow-hidden flex items-center justify-center border rounded-lg bg-accent/25">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="w-full" src={post.featuredImage.url} alt={post.featuredImage.alt || post.title} />
            </div>
          ) : null}

          <Article dangerouslySetInnerHTML={{ __html: html }} />
        </Container>
      </Section>
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
