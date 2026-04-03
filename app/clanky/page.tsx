import { getAllPosts } from "@/lib/content";
import { Section, Container } from "@/components/craft";
import PostCard from "@/components/posts/post-card";

export default async function Page() {
  const posts = await getAllPosts();

  return (
    <Section>
      <Container>
        <h1>Najnovšie články</h1>

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
