import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { getPosts } from "../api/api";

export const useInfinitePosts = (searchParams) => {
  const search = searchParams.get("search") || "";
  const tag = searchParams.get("tag") || "";

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts", { search, tag }],
    queryFn: ({ pageParam = 1 }) => getPosts({ search, tag, page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      const totalPosts = lastPage.data.totalPosts;
      const loadedPosts = allPages.reduce(
        (acc, page) => acc + page.data.posts.length,
        0
      );
      if (loadedPosts < totalPosts) {
        return allPages.length + 1;
      }
      return undefined;
    },
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  const posts = data?.pages.flatMap((page) => page.data.posts) ?? [];

  return {
    posts,
    loading: isFetching,
    error: error ? "Gagal memuat postingan" : null,
    hasMore: hasNextPage,
    lastPostElementRef: ref,
  };
};
