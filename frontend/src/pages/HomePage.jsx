import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const currentSearch = searchParams.get("search") || "";
        const currentTag = searchParams.get("tag") || "";

        const response = await axios.get("http://localhost:3001/api/posts", {
          params: { search: currentSearch, tag: currentTag },
        });
        setPosts(response.data);
      } catch (error) {
        setError("Gagal memuat postingan");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [searchParams]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm.trim() === "") {
        setSearchParams({});
      } else {
        setSearchParams({ search: searchTerm });
      }
    }, 1200);

    return () => clearTimeout(handler);
  }, [searchTerm, setSearchParams]);

  useEffect(() => {
    const initial = searchParams.get("search") || "";
    if (initial && searchTerm === "") {
      setSearchTerm(initial);
    }
  }, [searchParams]);

  useEffect(() => {
    if (hasInteracted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [posts, hasInteracted]);

  if (loading) return <p>loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <input
          ref={inputRef}
          type="text"
          placeholder="search post"
          value={searchTerm}
          onChange={(e) => {
            setHasInteracted(true);
            setSearchTerm(e.target.value);
          }}
          onFocus={() => setHasInteracted(true)}
          style={{ padding: "0.5rem", width: "300px" }}
        />
      </div>
      <h2>Recent Posts</h2>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post.id}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              margin: "1rem 0",
            }}
          >
            <Link
              to={`/post/${post.id}`}
              key={post.id}
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
        ))
      ) : (
        <p>Belum ada post</p>
      )}
    </div>
  );
};

export default HomePage;
