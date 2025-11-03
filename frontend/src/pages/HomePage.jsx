import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import { transformCloudinaryUrl } from "../utils/cloudinaryHelper";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const observer = useRef();
  const lastPostElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const currentSearch = searchParams.get("search") || "";
      const currentTag = searchParams.get("tag") || "";

      const response = await axios.get("http://localhost:3001/api/posts", {
        params: { search: currentSearch, tag: currentTag, page },
      });

      setPosts((prevPosts) => {
        const newPosts = response.data.posts.filter(
          (p) => !prevPosts.some((pp) => pp.id === p.id)
        );
        return [...prevPosts, ...newPosts];
      });

      setHasMore(
        posts.length + response.data.posts.length < response.data.totalPosts
      );
    } catch (error) {
      setError("Gagal memuat postingan");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, searchParams]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
  }, [searchParams]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm.trim() === "") {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete("search");
        setSearchParams(newParams);
      } else {
        setSearchParams({
          ...Object.fromEntries(searchParams),
          search: searchTerm,
        });
      }
    }, 1200);

    return () => clearTimeout(handler);
  }, [searchTerm, setSearchParams, searchParams]);

  useEffect(() => {
    const initial = searchParams.get("search") || "";
    setSearchTerm(initial);
  }, []);

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="search post"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          style={{ padding: "0.5rem", width: "300px" }}
        />
      </div>
      <h2>Recent Posts</h2>
      {posts.length > 0
        ? posts.map((post, index) => {
            const isLastElement = posts.length === index + 1;
            return (
              <div
                ref={isLastElement ? lastPostElementRef : null}
                key={`${post.id}-${index}`}
                style={{
                  border: "1px solid #ccc",
                  padding: "1rem",
                  margin: "1rem 0",
                  borderRadius: "8px",
                }}
              >
                {post.image_url && (
                  <Link to={`/post/${post.id}/${post.slug}`}>
                    <img
                      src={transformCloudinaryUrl(post.image_url, "thumbnail")}
                      alt={post.title}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "8px 8px 0 0",
                        marginBottom: "1rem",
                      }}
                    />
                  </Link>
                )}
                <div style={{ padding: "0 0.5rem" }}>
                  <Link
                    to={`/post/${post.id}/${post.slug}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <h3>{post.title}</h3>
                  </Link>
                  <p>
                    by {post.author} - 👍{post.like_count}
                  </p>
                  <div>
                    {post.tags &&
                      post.tags
                        .filter((t) => t)
                        .map((tag) => (
                          <Link
                            to={`/?tag=${tag}`}
                            key={tag}
                            style={{ marginRight: "0.5rem" }}
                          >
                            #{tag}{" "}
                          </Link>
                        ))}
                  </div>
                </div>
              </div>
            );
          })
        : !loading && <p>Belum ada post yang cocok.</p>}
      {loading && <p>Loading...</p>}
      {!hasMore && !loading && posts.length > 0 && (
        <p>Anda telah mencapai akhir daftar.</p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default HomePage;
