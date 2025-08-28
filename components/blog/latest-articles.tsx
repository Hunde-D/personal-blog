"use client";
import { usePublishedPost } from "@/hooks/use-published-post";
import { api } from "@/trpc/react";
import Link from "next/link";

export function LatestArticles() {
  const { publishedPosts, isLoading } = usePublishedPost();
  return (
    <section>
      <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold">Latest Articles</h2>
        <div className="h-1 w-8 sm:w-12 bg-primary"></div>
      </div>

      {isLoading ? (
        <div className="text-primary">Loading latest articles...</div>
      ) : (
        <>
          <div className="space-y-4 sm:space-y-6">
            {publishedPosts.map((post) => (
              <article key={post.slug} className="group">
                <Link href={`/blog/${post.slug}`} className="block">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-blue-400 transition-colors text-balance">
                    {post.title}
                  </h3>
                  <time className="text-sm text-muted-foreground italic">
                    {post.createdAt.toDateString()}
                  </time>
                </Link>
              </article>
            ))}
          </div>
          <div className="mt-6 sm:mt-8">
            <Link
              href="/blog"
              className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4"
            >
              View all articles
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
