import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AuthContext } from "../context/AuthContext";
import useImageUpload from "../hooks/useImageUpload";
import useVideoUpload from "../hooks/useVideoUpload";
import { getPost, updatePost } from "../api/api";
import PostForm from "../components/PostForm";
import { Edit, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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

  if (isAuthLoading || isLoadingPost) {
    return (
      <div className="container max-w-3xl px-4 py-10 mx-auto space-y-8">
        <div className="space-y-2">
          <Skeleton className="w-48 h-8" />
          <Skeleton className="w-64 h-4" />
        </div>
        <div className="space-y-6">
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-full h-48" />
          <Skeleton className="w-32 h-10" />
        </div>
      </div>
    );
  }

  const error =
    updatePostMutation.error?.message ||
    uploadImageError?.message ||
    uploadVideoError?.message ||
    fetchError?.message;

  return (
    <div className="container max-w-3xl px-4 py-10 mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-full bg-primary/10">
          <Edit className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Postingan</h1>
          <p className="text-muted-foreground">
            Perbarui konten postingan Anda.
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
