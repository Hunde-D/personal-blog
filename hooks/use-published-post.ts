import { api } from "@/trpc/react";
import { useSearchParams } from "next/navigation";

export const usePublishedPost = (limit: number = 5) => {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("query") || undefined;
  const query = api.post.listPublished.useInfiniteQuery(
    {
      limit,
      query: queryParam,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  const publishedPosts = query.data?.pages.flatMap((p) => p.posts) ?? [];
  return { ...query, publishedPosts };
};
