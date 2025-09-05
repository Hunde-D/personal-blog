"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { api } from "@/trpc/react";
import { PostT } from "@/components/blog/types";

export type UsePostsOptions = {
  limit?: number;
  publishedOnly?: boolean;
  suspense?: boolean;
  query?: string;
  tags?: Array<{ id?: string; name: string }>;
  status?: "all" | "published" | "draft";
};

export type UsePostsReturn = {
  posts: PostT[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
};

export const usePosts = (options: UsePostsOptions = {}): UsePostsReturn => {
  const {
    limit = 10,
    publishedOnly = false,
    suspense = true,
    query: queryOption,
    tags,
    status,
  } = options;
  const searchParams = useSearchParams();

  const queryParam = useMemo(() => {
    // Prefer explicit query option, otherwise read from URL params
    if (queryOption !== undefined) {
      return queryOption && queryOption.trim() ? queryOption.trim() : undefined;
    }
    const query = searchParams.get("query");
    return query && query.trim() ? query.trim() : undefined;
  }, [searchParams, queryOption]);

  const queryKey = useMemo(() => {
    return {
      limit,
      query: queryParam,
      status,
      tags: tags?.map((t) => t.name) ?? [],
    };
  }, [limit, queryParam, status, tags]);

  // Choose the appropriate query based on flags and filters
  const query = publishedOnly
    ? api.post.listPublished.useInfiniteQuery(
        { limit: queryKey.limit, query: queryKey.query },
        {
          getNextPageParam: (lastPage) => lastPage.nextCursor,
          staleTime: 5 * 60 * 1000,
          gcTime: 10 * 60 * 1000,
        }
      )
    : (tags && tags.length > 0) || (status && status !== "all")
    ? api.post.listWithFilters.useInfiniteQuery(
        {
          limit: queryKey.limit,
          status: status ?? "all",
          tags: tags ?? [],
        },
        {
          getNextPageParam: (lastPage) => lastPage.nextCursor,
          staleTime: 5 * 60 * 1000,
          gcTime: 10 * 60 * 1000,
        }
      )
    : api.post.list.useInfiniteQuery(
        { limit: queryKey.limit, query: queryKey.query },
        {
          getNextPageParam: (lastPage) => lastPage.nextCursor,
          staleTime: 5 * 60 * 1000,
          gcTime: 10 * 60 * 1000,
        }
      );

  // Normalize posts so downstream components get consistent shapes
  const transformPosts = (posts: any[]) =>
    posts.map((post) => ({
      ...post,
      tags: post.tags || [],
      author: post.author || {
        id: post.authorId,
        name: "Unknown",
        image: null,
      },
    }));

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = query;

  const posts = useMemo(() => {
    if (!data?.pages) return [];
    const allPosts = data.pages.flatMap((page) => page.posts);
    return transformPosts(allPosts);
  }, [data?.pages]);

  return {
    posts,
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
  };
};

// Convenience hooks for specific use cases
export const usePublishedPosts = (
  limit?: number,
  query?: string,
  tags?: Array<{ id?: string; name: string }>
) => usePosts({ limit, publishedOnly: true, query, tags, status: "published" });

export const useAllPosts = (
  limit?: number,
  query?: string,
  tags?: Array<{ id?: string; name: string }>,
  status?: "all" | "published" | "draft"
) => usePosts({ limit, publishedOnly: false, query, tags, status });
