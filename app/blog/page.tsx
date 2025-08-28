"use client";
import Link from "next/link";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { useInfinitePost } from "@/hooks/use-infinite-post";

export default function BlogPage() {
  const { allPosts, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfinitePost(2);
  return (
    <div className="">
      <div className="flex items-center gap-4 mb-12">
        <h1 className="text-3xl font-bold">Latest Articles</h1>
        <div className="h-1 w-12 bg-blue-500"></div>
      </div>

      <div className="space-y-8">
        {allPosts.map((post) => (
          <article key={post.slug} className="group">
            <Link href={`/blog/${post.slug}`} className="block">
              <h2 className="text-2xl font-semibold mb-3 group-hover:text-blue-400 transition-colors text-balance">
                {post.title}
              </h2>
              <time className="text-sm text-muted-foreground italic mb-4 block">
                {post.createdAt.toDateString()}
              </time>
              <p className="text-muted-foreground leading-relaxed">
                {post.excerpt}
              </p>
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-12 text-center">
        {hasNextPage && (
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="transition-colors underline underline-offset-4"
          >
            {isFetchingNextPage ? "fetching" : "load more"}{" "}
          </Button>
        )}
      </div>
    </div>
  );
}
