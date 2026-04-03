import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section, Container } from "@/components/craft";
import PostCard from "@/components/posts/post-card";
import BackButton from "@/components/back";
import { getAllCategories, getFilteredPosts } from "@/lib/content";

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const categories = await getAllCategories();
  const category = categories.find((item) => item.slug === params.slug);

  if (!category) {
    return { title: "Kategória nenájdená" };
  }

  return {
    title: `Kategória: ${category.name}`,
    description: `Články v kategórii ${category.name}.`,
  };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const categories = await getAllCategories();
  const category = categories.find((item) => item.slug === params.slug);

  if (!category) {
    notFound();
  }

  const posts = await getFilteredPosts({ category: params.slug });

  return (
    <Section>
      <Container>
        <BackButton />
        <h1>Kategória: {category.name}</h1>
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
