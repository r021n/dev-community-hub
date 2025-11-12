import React, { useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useInfinitePosts } from "../hooks/usePosts";
import { useDebouncedSearch } from "../hooks/useDebouncedSearch";
import { AuthContext } from "../context/AuthContext";
import PostCard from "../components/PostCard";

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useDebouncedSearch("search", 1200);
  const { auth } = useContext(AuthContext);

  const { posts, loading, error, hasMore, lastPostElementRef } =
    useInfinitePosts(searchParams);

  const displayedPosts = auth.token ? posts : posts.slice(0, 5);

  return (
    <div>
      {auth.token && (
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
      )}{" "}
      <h2>Recent Posts</h2>
      {displayedPosts.map((post, index) => {
        if (auth.token && displayedPosts.length === index + 1) {
          return (
            <div ref={lastPostElementRef} key={post.id}>
              <PostCard post={post} />
            </div>
          );
        }

        return (
          <div key={post.id}>
            <PostCard post={post} />
          </div>
        );
      })}
      {posts.length === 0 && !loading && <p>Belum ada post yang cocok.</p>}
      {loading && <p>Loading...</p>}
      {!hasMore && !loading && posts.length > 0 && (
        <p>Anda telah mencapai akhir daftar.</p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default HomePage;
