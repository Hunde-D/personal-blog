import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { formatError, logError } from "@/lib/error-utils";
import { api } from "@/trpc/react";

export const useEditorActions = () => {
  const router = useRouter();
  const utils = api.useUtils();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("query") || undefined;

  const createPost = api.post.admin.create.useMutation({
    onSuccess: (post) => {
      // Invalidate and refetch to ensure consistency
      utils.post.list.invalidate();
      utils.post.listPublished.invalidate();

      toast.success("Blog created successfully");
      router.push(`/blog/${post.slug}`);
    },
    onError: (error) => {
      const message = formatError(error).includes("CONFLICT") || formatError(error).toLowerCase().includes("slug")
        ? "Slug already in use. Please edit the slug."
        : formatError(error);
      toast.error(message);
      logError(error, { action: "createPost" });
    },
  });

  const mutatePost = api.post.admin.mutate.useMutation({
    onSuccess: (post) => {
      // Invalidate and refetch to ensure consistency
      utils.post.list.invalidate();
      utils.post.listPublished.invalidate();
      utils.post.find.invalidate({ slug: post.slug });

      toast.success("Blog updated successfully");
      router.push(`/blog/${post.slug}`);
    },
    onError: (error) => {
      const message = formatError(error).includes("CONFLICT") || formatError(error).toLowerCase().includes("slug")
        ? "Slug already in use. Please edit the slug."
        : formatError(error);
      toast.error(message);
      logError(error, { action: "mutatePost" });
    },
  });
  const publishPost = api.post.admin.mutate.useMutation({
    onSuccess: (post) => {
      // Invalidate and refetch to ensure consistency
      utils.post.list.invalidate();
      utils.post.listPublished.invalidate();
      utils.post.find.invalidate({ slug: post.slug });

      toast.success("Blog published successfully");
    },
    onError: (error) => {
      const message = formatError(error);
      toast.error(message);
      logError(error, { action: "publishPost" });
    },
  });
  const deletePost = api.post.admin.delete.useMutation({
    onSuccess: () => {
      // Invalidate and refetch to ensure consistency
      utils.post.list.invalidate();
      utils.post.listPublished.invalidate();

      toast.success("Post deleted successfully");
    },
    onError: (error) => {
      const message = formatError(error);
      toast.error(message);
      logError(error, { action: "deletePost" });
    },
  });
  return { createPost, mutatePost, publishPost, deletePost };
};
