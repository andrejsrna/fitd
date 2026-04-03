import {
  getAllPosts,
  getPostBySlug,
  markdownToHtml,
} from "@/lib/content";

import { Section, Container, Article } from "@/components/craft";
import { Metadata } from "next";
import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import Link from "next/link";
import Balancer from "react-wrap-balancer";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    return {
      title: "Článok nenájdený",
    };
  }

  const description = post.seo?.description || post.excerpt;
  const title = post.seo?.title || post.title;
  const image = post.seo?.ogImage || post.featuredImage?.url;

  return {
    title,
    description,
    openGraph: {
      images: image ? [image] : [],
    },
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    notFound();
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
              href={`/clanky/?category=${category.slug}`}
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
