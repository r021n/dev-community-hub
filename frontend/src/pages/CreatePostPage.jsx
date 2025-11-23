import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AuthContext } from "../context/AuthContext";
import useImageUpload from "../hooks/useImageUpload";
import useVideoUpload from "../hooks/useVideoUpload";
import { createPost } from "../api/api";
import parseTags from "../utils/parseTags";
import PostForm from "../components/PostForm";
import { PenSquare } from "lucide-react";

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
    uploadAsync: uploadImageAsync,
    isUploading: isUploadingImage,
    uploadError: uploadImageError,
  } = useImageUpload();

  const {
    videoFile,
    videoPreview,
    handleVideoChange,
    uploadAsync: uploadVideoAsync,
    isUploading: isUploadingVideo,
    uploadError: uploadVideoError,
    isCompressing,
    compressionProgress,
  } = useVideoUpload();

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
      const uploadedImageUrl = imageFile
        ? await uploadImageAsync(auth.token)
        : null;
      const uploadVideoUrl = videoFile
        ? await uploadVideoAsync(auth.token)
        : null;
      const newPostData = {
        title: postData.title,
        content: postData.content,
        tags: parseTags(postData.tags),
        imageUrl: uploadedImageUrl,
        videoUrl: uploadVideoUrl,
      };
      createPostMutation.mutate(newPostData);
    } catch (error) {
      console.error(error);
    }
  };

  const error =
    createPostMutation.error?.message ||
    uploadImageError?.message ||
    uploadVideoError?.message;
  const isSubmitting =
    isUploadingImage || isUploadingVideo || createPostMutation.isPending;

  return (
    <div className="container max-w-3xl px-4 py-10 mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-full bg-primary/10">
          <PenSquare className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Buat Postingan</h1>
          <p className="text-muted-foreground">
            Bagikan ide atau momen Anda kepada komunitas.
          </p>
        </div>
      </div>
      <PostForm
        postData={postData}
        setPostData={setPostData}
        handleSubmit={handleSubmit}
        handleImageChange={handleImageChange}
        handleVideoChange={handleVideoChange}
        imagePreview={imagePreview}
        videoPreview={videoPreview}
        isSubmitting={isSubmitting}
        error={!auth.token ? "Silahkan login untuk membuat postingan" : error}
        submitText="Publikasikan"
        loadingText="Mempublikasikan"
        showTags={true}
        isCompressing={isCompressing}
        compressionProgress={compressionProgress}
      />
    </div>
  );
};

export default CreatePostPage;
