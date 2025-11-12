import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AuthContext } from "../context/AuthContext";
import useImageUpload from "../hooks/useImageUpload";
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
    uploadAsync,
    isUploading,
    uploadError,
    setImagePreview,
  } = useImageUpload();

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
      // Cek authorization
      if (auth.user?.id !== post.user_id) {
        navigate("/");
      }
    }
  }, [post, auth.user?.id, navigate, setImagePreview]);

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
        ? await uploadAsync(auth.token)
        : imagePreview;
      const updatedPostData = {
        title: postData.title,
        content: postData.content,
        imageUrl: uploadedImageUrl,
      };
      updatePostMutation.mutate(updatedPostData);
    } catch (error) {
      console.error(error);
    }
  };

  if (isAuthLoading || isLoadingPost) return <p>Loading...</p>;

  const error =
    updatePostMutation.error?.message ||
    uploadError?.message ||
    fetchError?.message;

  return (
    <div>
      <h2>Edit Postingan</h2>
      <PostForm
        postData={postData}
        setPostData={setPostData}
        handleSubmit={handleSubmit}
        handleImageChange={handleImageChange}
        imagePreview={imagePreview}
        isSubmitting={isUploading || updatePostMutation.isPending}
        error={error}
        submitText="Simpan Perubahan"
        loadingText="Menyimpan..."
      />
    </div>
  );
};

export default EditPostPage;
