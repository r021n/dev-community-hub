import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import useImageUpload from "../hooks/useImageUpload";
import { getPost, updatePost } from "../api/api";

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const {
    imagePreview,
    isUploading,
    error: imageError,
    handleImageChange,
    upload,
    setImagePreview,
  } = useImageUpload();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getPost(id);
        setTitle(response.data.title);
        setContent(response.data.content);
        if (response.data.image_url) {
          setImagePreview(response.data.image_url);
        }

        if (auth.user.id !== response.data.user_id) {
          navigate("/");
        }
      } catch (error) {
        console.error(error);
        setError("gagal memuat post");
      } finally {
        setLoading(false);
      }
    };

    if (auth.token) {
      fetchPost();
    }
  }, [auth.user.id, id, navigate, auth.token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Jika ada file gambar baru yang dipilih
      const uploadedImageUrl = await upload(auth.token); // null jika tidak ada file baru
      const postData = {
        title,
        content,
        imageUrl: uploadedImageUrl !== null ? uploadedImageUrl : imagePreview,
      };
      const resp = await updatePost(id, postData, auth.token);
      const updatedPost = resp.data;
      navigate(`/post/${updatedPost.id}/${updatedPost.slug}`);
    } catch (error) {
      console.error(error);
      setError("Gagal memperbarui postingan");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Edit Postingan</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Judul</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Konten</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows="10"
          ></textarea>
        </div>
        <div>
          <label>Gambar (opsional) :</label>
          <input
            type="file"
            accept="image/png, image/jpeg, image/gif"
            onChange={handleImageChange}
          />
        </div>

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

        {error ||
          (imageError && <p style={{ color: "red" }}>{error || imageError}</p>)}
        <button type="submit" disabled={isUploading}>
          {isUploading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
};

export default EditPostPage;
