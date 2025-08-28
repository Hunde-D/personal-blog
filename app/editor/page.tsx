"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Save, ArrowLeft } from "lucide-react";
import type { BlogPostType } from "@/components/blog/types";
import { Preview } from "@/components/blog/preview";
import { api } from "@/trpc/react";

export default function EditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [postData, setPostData] = useState<BlogPostType>({
    title: "Untitled Post",
    content: "",
    excerpt: "",
  });
  const [isPreview, setIsPreview] = useState<boolean>(false);

  const slug = searchParams.get("edit");
  const { data: foundPost, isLoading } = api.post.find.useQuery(
    { slug: slug! },
    {
      enabled: !!slug,
    }
  );

  useEffect(() => {
    if (foundPost) {
      setPostData({
        title: foundPost.title,
        content: foundPost.content,
        excerpt: foundPost.excerpt ?? "",
      });
    }
  }, [foundPost]);

  const createPost = api.post.admin.create.useMutation({
    onSuccess: () => {
      router.push("/editor/manage");
    },
    onError: (error) => {
      console.error("Error creating post:", error);
      alert("Failed to create post");
    },
  });

  const updatePost = api.post.admin.update.useMutation({
    onSuccess: () => {
      router.push("/editor/manage");
    },
    onError: (error) => {
      console.error("Error updating post:", error);
      alert("Failed to update post");
    },
  });

  const handleSubmit = useCallback(() => {
    createPost.mutate(postData);
  }, [createPost, postData]);

  const handleUpdate = useCallback(() => {
    if (!foundPost?.id) {
      alert("Post not found for updating.");
      return;
    }
    updatePost.mutate({ ...foundPost, ...postData });
  }, [updatePost, postData, foundPost]);

  if (isLoading) {
    return <div>Loading post data...</div>;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {slug ? "Edit Blog Post" : "Create New Blog Post"}
          </h1>
          <p className="text-muted-foreground">
            {slug ? "Edit" : "Create and publish"} your blog posts
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.push("/editor/manage")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Manage Posts
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="space-y-6">
          <div className="space-y-4 p-5">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Title
              </label>
              <Input
                id="title"
                value={postData.title}
                onChange={(e) =>
                  setPostData({ ...postData, title: e.target.value })
                }
                placeholder="Enter your blog post title..."
                className=""
              />
            </div>

            <div>
              <label
                htmlFor="excerpt"
                className="block text-sm font-medium mb-2"
              >
                Excerpt
              </label>
              <Textarea
                id="excerpt"
                value={postData.excerpt}
                onChange={(e) =>
                  setPostData({ ...postData, excerpt: e.target.value })
                }
                placeholder="Write a brief excerpt or summary..."
                rows={3}
                className=" resize-none"
              />
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium mb-2"
              >
                Content
                <span className="text-muted-foreground/80 text-xs ml-2">
                  ( Supports markdown: ## headings, **bold**, &gt; quotes, •
                  bullets )
                </span>
              </label>
              <Textarea
                id="content"
                value={postData.content}
                onChange={(e) =>
                  setPostData({ ...postData, content: e.target.value })
                }
                placeholder="Write your blog post content here..."
                rows={20}
                className=" resize-none font-mono text-sm"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={slug ? handleUpdate : handleSubmit}
                className="flex items-center gap-2"
                disabled={slug ? updatePost.isPending : createPost.isPending}
              >
                <Save className="w-4 h-4" />
                {slug
                  ? updatePost.isPending
                    ? "Updating..."
                    : "Update Post"
                  : createPost.isPending
                  ? "Saving..."
                  : "Save Post"}
              </Button>
              <Button
                // variant="outline"
                onClick={() => setIsPreview(!isPreview)}
                className="flex items-center gap-2 bg-secondary text-secondary-foreground"
              >
                <Eye className="w-4 h-4" />
                {isPreview ? "Hide Preview" : "Show Preview"}
              </Button>
              {/* {editingSlug && (
                  <Button
                    variant="outline"
                    // onClick={handleNewPost}
                    className="flex items-center gap-2 border-gray-700 text-white hover:bg-gray-800 bg-transparent"
                  >
                    New Post
                  </Button>
                )} */}
            </div>
          </div>
        </div>

        <div className="">{isPreview && <Preview post={postData} />}</div>
      </div>
    </>
  );
}
