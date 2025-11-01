import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import imageCompression from "browser-image-compression";

const CreatePostPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.token) {
      setError("Silahkan login untuk membuat postingan");
      return;
    }

    setIsUploading(true);
    setError("");
    let uploadedImageUrl = null;

    try {
      if (imageFile) {
        console.log(
          `Ukuran asli gambar: ${(imageFile.size / 1024 / 1024).toFixed(2)} MB`
        );

        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(imageFile, options);
        console.log(
          `Ukuran gambar setelah kompressi: ${(
            compressedFile.size /
            1024 /
            1024
          ).toFixed(2)} MB`
        );

        const formData = new FormData();
        formData.append("image", compressedFile, compressedFile.name);

        const uploadRes = await axios.post(
          "http://localhost:3001/api/posts/upload-image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );

        uploadedImageUrl = uploadRes.data.imageUrl;
      }
      // SEND POST
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      const postData = {
        title,
        content,
        tags: tagsArray,
        imageUrl: uploadedImageUrl,
      };

      await axios.post("http://localhost:3001/api/posts", postData, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      navigate("/");
    } catch (error) {
      console.error(error);
      setError("Gagal membuat post");
    } finally {
      setIsUploading(false);
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

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={isUploading}>
          {isUploading ? "Mempublikasikan..." : "Publikasikan"}
        </button>
      </form>
    </div>
  );
};

export default CreatePostPage;
