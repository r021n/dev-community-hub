import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
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

  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    imageFile,
    imagePreview,
    handleImageChange,
    uploadAsync,
    isUploading,
    uploadError,
  } = useImageUpload();

  const createPostMutation = useMutation({
    mutationFn: (newPostData) => createPost(newPostData, auth.token),
    onSuccess: () => {
      navigate("/");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.token) {
      return;
    }

    try {
      const uploadedImageUrl = imageFile ? await uploadAsync(auth.token) : null;
      const newPostData = {
        title: postData.title,
        content: postData.content,
        tags: parseTags(postData.tags),
        imageUrl: uploadedImageUrl,
      };
      createPostMutation.mutate(newPostData);
    } catch (error) {
      console.error(error);
    }
  };

  const error = createPostMutation.error?.message || uploadError?.message;
  const isSubmitting = isUploading || createPostMutation.isPending;

  return (
    <div>
      <h2>Buat Postingan Baru</h2>
      <PostForm
        postData={postData}
        setPostData={setPostData}
        handleSubmit={handleSubmit}
        handleImageChange={handleImageChange}
        imagePreview={imagePreview}
        isSubmitting={isSubmitting}
        error={!auth.token ? "Silahkan login untuk membuat postingan" : error}
        submitText="Publikasikan"
        loadingText="Mempublikasikan"
        showTags={true}
      />
    </div>
  );
};

export default CreatePostPage;
