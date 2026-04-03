import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section, Container } from "@/components/craft";
import PostCard from "@/components/posts/post-card";
import BackButton from "@/components/back";
import { getAllTags, getFilteredPosts } from "@/lib/content";

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({ slug: tag.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const tags = await getAllTags();
  const tag = tags.find((item) => item.slug === params.slug);

  if (!tag) {
    return { title: "Značka nenájdená" };
  }

  return {
    title: `Značka: ${tag.name}`,
    description: `Články so značkou ${tag.name}.`,
  };
}

export default async function TagPage({ params }: { params: { slug: string } }) {
  const tags = await getAllTags();
  const tag = tags.find((item) => item.slug === params.slug);

  if (!tag) {
    notFound();
  }

  const posts = await getFilteredPosts({ tag: params.slug });

  return (
    <Section>
      <Container>
        <BackButton />
        <h1>Značka: {tag.name}</h1>
        {posts.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-4 z-0">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="h-24 w-full border rounded-lg bg-accent/25 flex items-center justify-center">
            <p>Žiadny výsledok</p>
          </div>
        )}
      </Container>
    </Section>
  );
}
