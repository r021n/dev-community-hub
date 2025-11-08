import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import useImageUpload from "../hooks/useImageUpload";
import { getPost, updatePost } from "../api/api";
import PostForm from "../components/PostForm";

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  const [postData, setPostData] = useState({
    title: "",
    content: "",
  });
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
        setPostData({
          title: response.data.title,
          content: response.data.content,
        });
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
  }, [auth.user.id, id, navigate, auth.token, setImagePreview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const uploadedImageUrl = await upload(auth.token);
      const uploadedPostData = {
        title: postData.title,
        content: postData.content,
        imageUrl: uploadedImageUrl !== null ? uploadedImageUrl : imagePreview,
      };
      const resp = await updatePost(id, uploadedPostData, auth.token);
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
      <PostForm
        postData={postData}
        setPostData={setPostData}
        handleSubmit={handleSubmit}
        handleImageChange={handleImageChange}
        imagePreview={imagePreview}
        isSubmitting={isUploading}
        error={error || imageError}
        submitText="Simpan Perubahan"
        loadingText="Menyimpan..."
      />
    </div>
  );
};

export default EditPostPage;
