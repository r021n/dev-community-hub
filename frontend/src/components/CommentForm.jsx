import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const CommentForm = ({ parentId = null, onCommentSubmitted }) => {
  const [content, setContent] = useState("");
  const { auth } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    onCommentSubmitted({ content, parentId });
    setContent("");
  };

  if (!auth.token)
    return (
      <p>
        Silahkan <a href="/login">login</a> untuk memberi komentar
      </p>
    );

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Tulis komentarmu..."
        required
        rows="3"
        style={{ width: "100%", padding: "8px" }}
      ></textarea>
      <button type="submit" style={{ marginTop: "8px" }}>
        Kirim
      </button>
    </form>
  );
};

export default CommentForm;
