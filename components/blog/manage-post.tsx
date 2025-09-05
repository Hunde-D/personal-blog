"use client";

import { Edit, Globe, MoreVertical, Plus, Trash2, Tag } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingButton } from "@/components/ui/loading-states";
import { ClassicLoader } from "@/components/ui/classic-loader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useEditorActions } from "@/hooks/use-editor-actions";
import { useAllPosts } from "@/hooks/use-posts";
import { BlogStatusBadge } from "./blog-status-badge";
import { FilterBar } from "./filter-bar";

export const ManagePost = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");
  const [selectedTags, setSelectedTags] = useState<
    Array<{ id?: string; name: string }>
  >(() => {
    const tagsParam = searchParams.get("tags");
    if (!tagsParam) return [];
    try {
      const names: string[] = JSON.parse(tagsParam);
      return names.map((name) => ({ name }));
    } catch {
      return [];
    }
  });
  const [status, setStatus] = useState<"all" | "published" | "draft">(
    (searchParams.get("status") as any) || "all"
  );

  const {
    posts,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    fetchNextPage,
    isError,
    error,
  } = useAllPosts(10, searchTerm, selectedTags, status);

  // Sync URL with local filter state
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) params.set("query", searchTerm);
    else params.delete("query");

    if (selectedTags.length > 0)
      params.set("tags", JSON.stringify(selectedTags.map((t) => t.name)));
    else params.delete("tags");

    if (status && status !== "all") params.set("status", status);
    else params.delete("status");

    router.replace(`${pathname}?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, JSON.stringify(selectedTags), status]);

  const { publishPost, deletePost } = useEditorActions();

  if (isError) {
    return (
      <Card className="">
        <CardContent className="text-center py-12">
          <p className="text-destructive mb-4">
            Failed to load posts: {error?.message}
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Filter Bar */}
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        status={status}
        onStatusChange={setStatus}
        className="mb-6"
      />

      <div className="space-y-4">
        {isLoading ? (
          <ClassicLoader />
        ) : posts.length === 0 ? (
          <Card className="">
            <CardContent className="text-center py-12">
              <p className="text-gray-400 mb-4">No blog posts found</p>
              <Link href="/editor">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Post
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.slug} className="">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-card-foreground text-xl gap-2 mb-2 flex items-center">
                      <BlogStatusBadge published={post.published} />
                      {post.title}
                    </CardTitle>
                    <p className="text-muted-foreground/70 text-xs mb-2 flex flex-wrap gap-2">
                      <span>
                        Created •{" "}
                        {new Date(post.createdAt).toLocaleDateString(
                          undefined,
                          { year: "numeric", month: "short", day: "2-digit" }
                        )}
                      </span>
                      {post.published && (
                        <span>
                          • Published •{" "}
                          {post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString(
                                undefined,
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "2-digit",
                                }
                              )
                            : ""}
                        </span>
                      )}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {post.excerpt}
                    </p>
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
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
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-gray-700 hover:bg-gray-800"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-40">
                      {/* Edit */}
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/editor/${post.slug}`}
                          className="flex items-center"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      {/* Delete */}
                      <DropdownMenuItem
                        onClick={() => deletePost.mutate({ id: post.id })}
                        disabled={deletePost.isPending}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>

                      {/* Publish / Unpublish */}
                      <DropdownMenuItem
                        onClick={() =>
                          publishPost.mutate({
                            id: post.id,
                            title: post.title,
                            published: !post.published,
                          })
                        }
                        disabled={
                          publishPost.isPending &&
                          publishPost.variables.id === post.id
                        }
                      >
                        <Globe className="mr-2 h-4 w-4" />
                        {post.published ? "Unpublish" : "Publish"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
        <div className="mt-12 text-center">
          {hasNextPage && (
            <LoadingButton
              onClick={() => fetchNextPage()}
              loading={isFetchingNextPage}
              className="transition-colors underline underline-offset-4"
            >
              Load more
            </LoadingButton>
          )}
        </div>
      </div>
    </>
  );
};

export const ManagePostHeader = () => {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Manage Blog Posts</h1>
        <p className="text-gray-400">Edit, delete, or create new blog posts</p>
      </div>
      <div className="flex gap-3">
        <Button
          onClick={() => router.push("/editor")}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Post
        </Button>
      </div>
    </div>
  );
};
