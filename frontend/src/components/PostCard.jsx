import React from "react";
import { Link } from "react-router-dom";
import { transformCloudinaryUrl } from "../utils/cloudinaryHelper";

const PostCard = ({ post, showAuthor = true }) => {
  return (
    <div
      key={post.id}
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
          {post.title}
        </Link>
        <p>
          {showAuthor ? (
            <>
              by {post.author} - 👍{post.like_count}
            </>
          ) : (
            <>👍{post.like_count}</>
          )}
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
};

export default PostCard;
