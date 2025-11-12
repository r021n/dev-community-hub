import { useState, useCallback, useEffect } from "react";
import { getPost, getCommentsForPost } from "../api/api";

export const usePostDetail = (postId) => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setError("");
    try {
      const [postRes, commentsRes] = await Promise.all([
        getPost(postId),
        getCommentsForPost(postId),
      ]);
      setPost(postRes.data);
      setComments(commentsRes.data);
    } catch (error) {
      console.error(error);
      setError("Gagal memuat detail post");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { post, setPost, comments, loading, error, refetch: fetchData };
};
