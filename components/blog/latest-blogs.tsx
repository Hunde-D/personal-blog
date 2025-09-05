"use client";
import Link from "next/link";
import { usePublishedPosts } from "@/hooks/use-posts";

export function LatestBlogs() {
  const { posts: publishedPosts } = usePublishedPosts();
  return (
    <>
      <div className="space-y-4 sm:space-y-6">
        {publishedPosts.slice(0, 5).map((post) => (
          <article key={post.slug} className="group">
            <Link href={`/blog/${post.slug}`} className="block">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-blue-400 transition-colors text-balance">
                {post.title}
              </h3>
              <time className="text-sm text-muted-foreground italic">
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    })
                  : ""}
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
  );
}
