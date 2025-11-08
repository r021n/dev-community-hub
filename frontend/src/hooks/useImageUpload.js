import { useEffect, useState } from "react";
import imageCompression from "browser-image-compression";
import { uploadImage } from "../api/api";

export default function useImageUpload() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

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
    setError(null);
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (!file) setImagePreview("");
  };

  const upload = async (token) => {
    if (!imageFile) return null;
    setIsUploading(true);
    setError(null);

    try {
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
    } catch (error) {
      setError(error?.message || "Uploading image failed");
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    imageFile,
    imagePreview,
    isUploading,
    error,
    handleImageChange,
    upload,
    setImagePreview,
    setImageFile,
  };
}
