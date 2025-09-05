"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";
import { usePublishedPosts } from "@/hooks/use-posts";
import { Input } from "@/components/ui/input";

export const BlogList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    posts,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isError,
    error,
  } = usePublishedPosts(10, searchTerm);

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">
          Failed to load posts: {error?.message}
        </p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <div className="relative max-w-xl">
          <Input
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-3"
          />
        </div>
      </div>

      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.slug} className="group">
            <Link href={`/blog/${post.slug}`} className="block">
              <h2 className="text-2xl font-semibold mb-3 group-hover:text-blue-400 transition-colors text-balance">
                {post.title}
              </h2>
              <time className="text-sm text-muted-foreground italic mb-4 block">
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    })
                  : ""}
              </time>
              <p className="text-muted-foreground leading-relaxed">
                {post.excerpt}
              </p>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {post.tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      className="text-xs flex items-center gap-1"
                    >
                      <Tag className="h-3 w-3" />
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}
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
