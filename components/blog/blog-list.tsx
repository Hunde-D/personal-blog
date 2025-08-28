"use client";
import Link from "next/link";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { usePublishedPost } from "@/hooks/use-published-post";
import { ClassicLoader } from "@/components/ui/classic-loader";
import { Suspense } from "react";

export const BlogList = () => {
  const {
    publishedPosts,
    hasNextPage,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
  } = usePublishedPost();

  return isLoading ? (
    <div className="w-56 h-20 flex flex-col justify-center items-center gap-4">
      <ClassicLoader />
    </div>
  ) : (
    <>
      <div className="space-y-8">
        {publishedPosts.map((post) => (
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
    </>
  );
};
