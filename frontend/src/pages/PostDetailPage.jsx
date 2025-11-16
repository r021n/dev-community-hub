import React, { useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Comment from "../components/Comment";
import CommentForm from "../components/CommentForm";
import { transformCloudinaryUrl } from "../utils/cloudinaryHelper";
import { usePostDetail } from "../hooks/usePostDetail";
import { createCommentApi, deletePostApi, likePost, getPost } from "../api/api";

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { post, setPost, comments, loading, error, refetch } =
    usePostDetail(id);

  const handleCommentSubmit = async (commentData) => {
    try {
      await createCommentApi(id, commentData, auth.token);
      refetch();
    } catch (error) {
      alert("gagal mengirim komputer", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Apakah anda ingin menghapus post ini?")) {
      try {
        await deletePostApi(id, auth.token);
        navigate("/");
      } catch (error) {
        alert("Gagala menghapus post", error);
      }
    }
  };

  const handleLike = async () => {
    if (!auth.token) return alert("Silahkan login untuk like postingan ini");

    try {
      await likePost(id, auth.token);
      const postRes = await getPost(id);
      setPost(postRes.data);
    } catch (error) {
      console.error(error);
      alert("Gagal melakukan/membatalkan like");
    }
  };

  const isOwner = auth.user && post && auth.user.id === post.user_id;

  if (loading) return <p>loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!post) return <p>Post tidak ditemukan</p>;

  return (
    <div>
      <article>
        {post.image_url && (
          <img
            src={transformCloudinaryUrl(post.image_url, "full")}
            alt={post.title}
            loading="lazy"
            style={{
              width: "100%",
              maxHeight: "500px",
              objectFit: "cover",
              borderRadius: "8px",
              marginBottom: "1rem",
            }}
          />
        )}
        {post.video_url && (
          <video
            src={post.video_url}
            controls
            style={{
              width: "100%",
              maxHeight: "500px",
              borderRadius: "8px",
              marginBottom: "1rem",
            }}
          >
            Browser anda tidak mendukung video player
          </video>
        )}
        <h1>{post.title}</h1>
        <p>
          by <strong>{post.author}</strong> on{" "}
          {new Date(post.created_at).toLocaleDateString()}
        </p>
        {isOwner && (
          <div>
            <Link to={`/post/${id}/${post.slug}/edit`}>
              <button>Edit post</button>
            </Link>
            <button onClick={handleDelete} style={{ marginLeft: "8px" }}>
              Hapus
            </button>
          </div>
        )}
        <p>{post.content}</p>
        <div>
          {post.tags &&
            post.tags
              .filter((t) => t)
              .map((tag) => (
                <span key={tag} className="tag">
                  #{tag}{" "}
                </span>
              ))}
        </div>
        <button onClick={handleLike}>👍({post.like_count})</button>
      </article>
      <section>
        <h3>Komentar</h3>
        <CommentForm onCommentSubmitted={handleCommentSubmit} />
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            onReplySubmitted={handleCommentSubmit}
          />
        ))}
      </section>
    </div>
  );
};

export default PostDetailPage;
