// app/clanky/page.tsx

import {
  getFilteredPosts,
  getAllTags,
  getAllCategories,
} from "@/lib/content";
import PaginationComponent from "@/components/ui/pagination-component";

import { Section, Container } from "@/components/craft";
import PostCard from "@/components/posts/post-card";
import FilterPosts from "./filter";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { tag, category, page: pageParam } = searchParams;

  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const postsPerPage = 9;
  const [allPosts, tagsList, categoriesList] = await Promise.all([
    getFilteredPosts({ tag, category }),
    getAllTags(),
    getAllCategories(),
  ]);
  const totalPages = Math.max(1, Math.ceil(allPosts.length / postsPerPage));
  const page = Math.min(currentPage, totalPages);
  const posts = allPosts.slice((page - 1) * postsPerPage, page * postsPerPage);

  return (
    <Section>
      <Container>
        <h1>Najnovšie články</h1>
        <FilterPosts
          tags={tagsList}
          categories={categoriesList}
          selectedTag={tag}
          selectedCategory={category}
        />

        {posts.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-4 z-0">
            {posts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="h-24 w-full border rounded-lg bg-accent/25 flex items-center justify-center">
            <p>Žiadny výsledok</p>
          </div>
        )}

        {/* Paginácia */}
        <div className="mt-8 not-prose">
          <PaginationComponent
            currentPage={page}
            totalPages={totalPages}
            category={category}
            tag={tag}
          />
        </div>
      </Container>
    </Section>
  );
}
