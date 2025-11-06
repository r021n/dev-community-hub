import { useState, useEffect, useRef, useCallback } from "react";
import { getPosts } from "../api/api";

export const useInfinitePosts = (searchParams) => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();

  const lastPostElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((p) => p + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
  }, [searchParams.toString()]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const currentSearch = searchParams.get("search") || "";
        const currentTag = searchParams.get("tag") || "";
        const resp = await getPosts({
          search: currentSearch,
          tag: currentTag,
          page,
        });
        const newPosts = resp.data.posts.filter(
          (p) => !posts.some((pp) => pp.id === p.id)
        );
        setPosts((prev) => [...prev, ...newPosts]);
        setHasMore(
          posts.length + resp.data.posts.length < resp.data.totalPosts
        );
      } catch (error) {
        console.error(error);
        setError("Gagal memuat postingan");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [page, searchParams]);

  return {
    posts,
    loading,
    error,
    hasMore,
    lastPostElementRef,
    setPage,
    setPosts,
  };
};
