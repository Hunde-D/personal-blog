import { api } from "@/trpc/react";
import { useSearchParams } from "next/navigation";

export const useInfinitePost = (limit: number = 5) => {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("query") || undefined;
  const query = api.post.infinitePosts.useInfiniteQuery(
    {
      limit,
      query: queryParam,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  const allPosts = query.data?.pages.flatMap((p) => p.posts) ?? [];
  return { ...query, allPosts };
};
