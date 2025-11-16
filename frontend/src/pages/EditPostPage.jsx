import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AuthContext } from "../context/AuthContext";
import useImageUpload from "../hooks/useImageUpload";
import useVideoUpload from "../hooks/useVideoUpload";
import { getPost, updatePost } from "../api/api";
import PostForm from "../components/PostForm";

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth, isAuthLoading } = useContext(AuthContext);

  const [postData, setPostData] = useState({
    title: "",
    content: "",
  });

  const {
    imageFile,
    imagePreview,
    handleImageChange,
    uploadAsync: uploadImageAsync,
    isUploading: isUploadingImage,
    uploadError: uploadImageError,
    setImagePreview,
  } = useImageUpload();

  const {
    videoFile,
    videoPreview,
    handleVideoChange,
    uploadAsync: uploadVideoAsync,
    isUploading: isUploadingVideo,
    uploadError: uploadVideoError,
    setVideoPreview,
    isCompressing,
    compressionProgress,
  } = useVideoUpload();

  const {
    data: post,
    isLoading: isLoadingPost,
    error: fetchError,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPost(id).then((res) => res.data),
    enabled: !!auth.token,
  });

  useEffect(() => {
    if (post) {
      setPostData({
        title: post.title,
        content: post.content,
      });
      if (post.image_url) {
        setImagePreview(post.image_url);
      }
      if (post.video_url) {
        setVideoPreview(post.video_url);
      }
      if (auth.user?.id !== post.user_id) {
        navigate("/");
      }
    }
  }, [post, auth.user?.id, navigate, setImagePreview, setVideoPreview]);

  const updatePostMutation = useMutation({
    mutationFn: (updatePostData) => updatePost(id, updatePostData, auth.token),
    onSuccess: (resp) => {
      const updatedPost = resp.data;
      navigate(`/post/${updatedPost.id}/${updatePost.slug}`);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const uploadedImageUrl = imageFile
        ? await uploadImageAsync(auth.token)
        : imagePreview;
      const uploadedVideoUrl = videoFile
        ? await uploadVideoAsync(auth.token)
        : videoPreview;
      const updatedPostData = {
        title: postData.title,
        content: postData.content,
        imageUrl: uploadedImageUrl,
        videoUrl: uploadedVideoUrl,
      };
      updatePostMutation.mutate(updatedPostData);
    } catch (error) {
      console.error(error);
    }
  };

  if (isAuthLoading || isLoadingPost) return <p>Loading...</p>;

  const error =
    updatePostMutation.error?.message ||
    uploadImageError?.message ||
    uploadVideoError?.message ||
    fetchError?.message;

  return (
    <div>
      <h2>Edit Postingan</h2>
      <PostForm
        postData={postData}
        setPostData={setPostData}
        handleSubmit={handleSubmit}
        handleImageChange={handleImageChange}
        handleVideoChange={handleVideoChange}
        imagePreview={imagePreview}
        videoPreview={videoPreview}
        isSubmitting={
          isUploadingImage || isUploadingVideo || updatePostMutation.isPending
        }
        error={error}
        submitText="Simpan Perubahan"
        loadingText="Menyimpan..."
        isCompressing={isCompressing}
        compressionProgress={compressionProgress}
      />
    </div>
  );
};

export default EditPostPage;
