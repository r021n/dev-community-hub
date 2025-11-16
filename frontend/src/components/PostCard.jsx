import React from "react";
import { Link } from "react-router-dom";
import {
  transformCloudinaryUrl,
  getVideoThumbnail,
} from "../utils/cloudinaryHelper";

const PostCard = ({ post, showAuthor = true }) => {
  const hasMedia = post.image_url || post.video_url;
  const thumbnailUrl = post.video_url
    ? getVideoThumbnail(post.video_url)
    : post.image_url
    ? transformCloudinaryUrl(post.image_url, "thumbnail")
    : null;
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
      {hasMedia && thumbnailUrl && (
        <Link to={`/post/${post.id}/${post.slug}`}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <img
              src={thumbnailUrl}
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
            {post.video_url && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "60px",
                  height: "60px",
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "24px",
                  cursor: "pointer",
                }}
              >
                ▶
              </div>
            )}
          </div>
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
