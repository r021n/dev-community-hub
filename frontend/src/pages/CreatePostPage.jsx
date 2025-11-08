import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import useImageUpload from "../hooks/useImageUpload";
import { createPost } from "../api/api";
import parseTags from "../utils/parseTags";
import PostForm from "../components/PostForm";

const CreatePostPage = () => {
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    tags: "",
  });
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
      const newPostData = {
        title: postData.title,
        content: postData.content,
        tags: parseTags(postData.tags),
        imageUrl: uploadedImageUrl,
      };
      await createPost(newPostData, auth.token);
      navigate("/");
    } catch (error) {
      console.error(error);
      setError("Gagal membuat post");
    }
  };

  return (
    <div>
      <h2>Buat Postingan Baru</h2>
      <PostForm
        postData={postData}
        setPostData={setPostData}
        handleSubmit={handleSubmit}
        handleImageChange={handleImageChange}
        imagePreview={imagePreview}
        isSubmitting={isUploading}
        error={error || imageError}
        submitText="Publikasikan"
        loadingText="Mempublikasikan"
        showTags={true}
      />
    </div>
  );
};

export default CreatePostPage;
