import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const CreatePostPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.token) {
      setError("Silahkan login untuk membuat postingan");
      return;
    }

    try {
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      await axios.post(
        "http://localhost:3001/api/posts",
        {
          title,
          content,
          tags: tagsArray,
        },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      navigate("/");
    } catch (error) {
      console.error(error);
      setError("Gagal membuat post");
    }
  };

  return (
    <div>
      <h2>Buat Postingan Baru</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Judul:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Konten:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows="10"
          ></textarea>
        </div>
        <div>
          <label>Tags (Pisahkan dengan tanda koma)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="react, express, laravel"
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Publikasikan</button>
      </form>
    </div>
  );
};

export default CreatePostPage;
