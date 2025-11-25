import { getPageBySlug } from "@/lib/wordpress";
import { Section, Container, Main } from "@/components/craft";
import { Metadata } from "next";

import BackButton from "@/components/back";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const page = await getPageBySlug(params.slug);
  const cleanDescription = page.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, "").trim();
  const yoastTitle = page.yoast_head_json?.title;
  const yoastDescription = page.yoast_head_json?.description;
  const yoastOgImage = page.yoast_head_json?.og_image?.[0]?.url;

  return {
    title: yoastTitle ?? page.title.rendered,
    description: yoastDescription ?? cleanDescription,
    openGraph: {
      images: yoastOgImage ? [yoastOgImage] : undefined,
    },
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const page = await getPageBySlug(params.slug);

  return (
    <Section>
      <Container>
        <BackButton />
        <h1 className="pt-12">{page.title.rendered}</h1>
        <div dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
      </Container>
    </Section>
  );
}
