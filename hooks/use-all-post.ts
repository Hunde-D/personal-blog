import { api } from "@/trpc/react";
import { useSearchParams } from "next/navigation";

export const useAllPost = (limit: number = 10) => {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("query") || undefined;
  const query = api.post.listAll.useInfiniteQuery(
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
