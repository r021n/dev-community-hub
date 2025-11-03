import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import imageCompression from "browser-image-compression";

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/posts/${id}`
        );
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setError("");
    let uploadedImageUrl = null;

    try {
      // Jika ada file gambar baru yang dipilih
      if (imageFile) {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(imageFile, options);

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

      const postData = {
        title,
        content,
        imageUrl: uploadedImageUrl !== null ? uploadedImageUrl : imagePreview, // Kirim URL baru atau URL lama
      };

      await axios.put(`http://localhost:3001/api/posts/${id}`, postData, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      navigate(`/post/${id}`);
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

        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={isUploading}>
          {isUploading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
};

export default EditPostPage;
