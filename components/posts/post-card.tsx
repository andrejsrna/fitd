import Image from "next/image";
import Link from "next/link";

import { PostSummary } from "@/lib/content";
import { cn } from "@/lib/utils";

export default function PostCard({ post }: { post: PostSummary }) {
  const date = new Date(post.date).toLocaleDateString("sk-SK", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const category = post.categories[0];

  return (
    <Link
      href={`/clanky/${post.slug}`}
      className={cn(
        "border p-4 bg-accent/30 rounded-lg group flex justify-between flex-col not-prose gap-8",
        "hover:bg-accent/75 transition-all"
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="h-48 w-full overflow-hidden relative rounded-md border flex items-center justify-center">
          {post.featuredImage?.url ? (
            <Image
              className="h-full w-full object-cover"
              src={post.featuredImage.url}
              alt={post.featuredImage.alt || post.title}
              width={400}
              height={200}
            />
          ) : null}
        </div>
        <div className="text-xl text-primary font-medium group-hover:underline decoration-muted-foreground underline-offset-4 decoration-dotted transition-all">
          {post.title}
        </div>
        <div className="text-sm">{post.excerpt.split(" ").slice(0, 20).join(" ").trim()}...</div>
      </div>

      <div className="flex flex-col gap-4">
        <hr />
        <div className="flex justify-between items-center text-xs">
          <p>{category?.name || "Článok"}</p>
          <p>{date}</p>
        </div>
      </div>
    </Link>
  );
}
