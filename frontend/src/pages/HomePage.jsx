import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useInfinitePosts } from "../hooks/usePosts";
import { useDebouncedSearch } from "../hooks/useDebouncedSearch";
import PostCard from "../components/PostCard";

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useDebouncedSearch("search", 1200);

  const { posts, loading, error, hasMore, lastPostElementRef } =
    useInfinitePosts(searchParams);

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
              >
                <PostCard post={post} />
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
