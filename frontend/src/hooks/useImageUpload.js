import { useEffect, useState } from "react";
import imageCompression from "browser-image-compression";
import { useMutation } from "@tanstack/react-query";
import { uploadImage } from "../api/api";

export default function useImageUpload() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    let url;
    if (imageFile) {
      url = URL.createObjectURL(imageFile);
      setImagePreview(url);
    }

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [imageFile]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (!file) setImagePreview("");
  };

  const uploadMutation = useMutation({
    mutationFn: async (token) => {
      if (!imageFile) return null;

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressed = await imageCompression(imageFile, options);
      const formData = new FormData();
      formData.append("image", compressed, compressed.name);
      const res = await uploadImage(formData, token);
      return res.data.imageUrl || null;
    },
  });

  return {
    imageFile,
    imagePreview,
    handleImageChange,
    setImagePreview,
    setImageFile,
    uploadAsync: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    uploadError: uploadMutation.error,
  };
}
