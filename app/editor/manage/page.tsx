"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2, Plus, LogOut } from "lucide-react";
import { blogPosts, type BlogPost } from "@/lib/blog-data";
import { api } from "@/trpc/react";
import { useInfinitePost } from "@/hooks/use-infinite-post";
import { Input } from "@/components/ui/input";

export default function ManagePostsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { allPosts } = useInfinitePost(5);
  const deletePost = api.post.admin.delete.useMutation();
  const searchParams = useSearchParams();

  const handleDelete = useCallback((id: string) => {
    deletePost.mutate({ id });
  }, []);

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Blog Posts</h1>
          <p className="text-gray-400">
            Edit, delete, or create new blog posts
          </p>
        </div>
        <div className="flex gap-3">
          <Input
            placeholder="Search posts..."
            defaultValue={searchParams.get("query")?.toString() || ""}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && handleSearch(e.currentTarget.value)
            }
          />
          <Button
            onClick={() => router.push("/editor")}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Post
          </Button>
          <Button variant="outline" onClick={() => {}} className="">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        {allPosts.length === 0 ? (
          <Card className="">
            <CardContent className="text-center py-12">
              <p className="text-gray-400 mb-4">No blog posts found</p>
              <Button onClick={() => router.push("/editor")}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Post
              </Button>
            </CardContent>
          </Card>
        ) : (
          allPosts.map((post) => (
            <Card key={post.slug} className="">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-card-foreground text-xl mb-2">
                      {post.title}
                    </CardTitle>
                    <p className="text-muted-foreground/70 text-sm mb-2">
                      {post.createdAt.toISOString()}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/editor?edit=${post.slug}`)}
                      className="border-gray-700  hover:bg-gray-800"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(post.id)}
                      disabled={deletePost.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </>
  );
}
