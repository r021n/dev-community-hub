import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/posts/${id}`
        );
        setTitle(response.data.title);
        setContent(response.data.content);

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
    try {
      await axios.put(
        `http://localhost:3001/api/posts/${id}`,
        { title, content },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
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
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Simpan Perubahan</button>
      </form>
    </div>
  );
};

export default EditPostPage;
