import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import useImageUpload from "../hooks/useImageUpload";
import { createPost } from "../api/api";
import parseTags from "../utils/parseTags";

const CreatePostPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");

  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    imagePreview,
    isUploading,
    error: imageError,
    handleImageChange,
    upload,
  } = useImageUpload();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.token) {
      setError("Silahkan login untuk membuat postingan");
      return;
    }

    setError("");
    try {
      const uploadedImageUrl = await upload(auth.token);
      const postData = {
        title,
        content,
        tags: parseTags(tags),
        imageUrl: uploadedImageUrl,
      };
      await createPost(postData, auth.token);
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
        {/* Title */}
        <div>
          <label>Judul:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Content */}
        <div>
          <label>Konten:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows="10"
          ></textarea>
        </div>

        {/* Image upload */}
        <div>
          <label>Gambar (opsional) :</label>
          <input
            type="file"
            accept="image/png, image/jpeg, image/gif"
            onChange={handleImageChange}
          />
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div style={{ marginTop: "1rem" }}>
            <p>Preview</p>
            <img
              src={imagePreview}
              alt="Preview"
              style={{ maxWidth: "300px", height: "auto" }}
            />
          </div>
        )}

        {/* Tags */}
        <div>
          <label>Tags (Pisahkan dengan tanda koma)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="react, express, laravel"
          />
        </div>

        {(error || imageError) && (
          <p style={{ color: "red" }}>{error || imageError}</p>
        )}

        <button type="submit" disabled={isUploading}>
          {isUploading ? "Mempublikasikan..." : "Publikasikan"}
        </button>
      </form>
    </div>
  );
};

export default CreatePostPage;
