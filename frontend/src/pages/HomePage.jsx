import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/posts");
        setPosts(response.data);
      } catch (error) {
        setError("Gagal memuat postingan");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p>loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Recent Posts</h2>
      {posts.length > 0 ? (
        posts.map((post) => (
          <Link
            to={`/post/${post.id}`}
            key={post.id}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              key={post.id}
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                margin: "1rem 0",
              }}
            >
              <h3>{post.title}</h3>
              <p>
                by {post.author} - 👍{post.like_count}
              </p>
              <div>
                {post.tags &&
                  post.tags
                    .filter((t) => t)
                    .map((tag) => <span key={tag}>#{tag} </span>)}
              </div>
            </div>
          </Link>
        ))
      ) : (
        <p>Belum ada post</p>
      )}
    </div>
  );
};

export default HomePage;
