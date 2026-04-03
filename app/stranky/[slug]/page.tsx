import { getAllPages, getPageBySlug, markdownToHtml } from "@/lib/content";
import { Section, Container } from "@/components/craft";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import BackButton from "@/components/back";

export async function generateStaticParams() {
  const pages = await getAllPages();
  return pages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const page = await getPageBySlug(params.slug);
  if (!page) {
    return { title: "Stránka nenájdená" };
  }

  return {
    title: page.seo?.title ?? page.title,
    description: page.seo?.description ?? page.excerpt,
    openGraph: {
      images: page.seo?.ogImage ? [page.seo.ogImage] : undefined,
    },
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const page = await getPageBySlug(params.slug);
  if (!page) {
    notFound();
  }
  const html = await markdownToHtml(page.markdown);

  return (
    <Section>
      <Container>
        <BackButton />
        <h1 className="pt-12">{page.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </Container>
    </Section>
  );
}
