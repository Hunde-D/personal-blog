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
    // Optimistic update: remove the post from cached lists immediately
    onMutate: async (input) => {
      // Cancel outgoing queries to avoid race conditions
      await Promise.all([
        utils.post.list.cancel(),
        utils.post.listPublished.cancel(),
      ]);

      // Snapshot previous cache
      const listInput = { limit: 10, query: queryParam } as const;
      const prevList = utils.post.list.getInfiniteData(listInput);
      const prevPublished = utils.post.listPublished.getInfiniteData(listInput);

      // Helper to remove the deleted id from pages
      const removeFromPages = (data: typeof prevList) => {
        if (!data) return data;
        return {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            posts: page.posts.filter((p: { id: string }) => p.id !== input.id),
          })),
        };
      };

      // Apply optimistic cache update
      utils.post.list.setInfiniteData(listInput, (old) => removeFromPages(old));
      utils.post.listPublished.setInfiniteData(listInput, (old) =>
        removeFromPages(old)
      );

      return { prevList, prevPublished, listInput };
    },
    onSuccess: () => {
      // Invalidate and refetch to ensure consistency
      utils.post.list.invalidate();
      utils.post.listPublished.invalidate();

      toast.success("Post deleted successfully");
    },
    onError: (error, _input, context) => {
      // Rollback to previous cache on error
      if (context?.prevList) {
        utils.post.list.setInfiniteData(context.listInput, context.prevList);
      }
      if (context?.prevPublished) {
        utils.post.listPublished.setInfiniteData(
          context.listInput,
          context.prevPublished
        );
      }

      const message = formatError(error);
      toast.error(message);
      logError(error, { action: "deletePost" });
    },
    onSettled: () => {
      // Ensure cache is in sync with server
      utils.post.list.invalidate();
      utils.post.listPublished.invalidate();
    },
  });
  return { createPost, mutatePost, publishPost, deletePost };
};
