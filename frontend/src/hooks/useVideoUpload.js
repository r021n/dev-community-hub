import { useState, useEffect } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { useMutation } from "@tanstack/react-query";
import { uploadVideo } from "../api/api";

export default function useVideoUpload() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [videoDuration, setVideoDuration] = useState(0);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [ffmpeg, setFFmpeg] = useState(null);
  const [ffmpegLoaded, setFFmpegLoaded] = useState(false);

  useEffect(() => {
    const loadFFmpeg = async () => {
      const ffmpegInstance = new FFmpeg();

      ffmpegInstance.on("progress", ({ progress }) => {
        setCompressionProgress(Math.round(progress * 100));
      });

      try {
        const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
        await ffmpegInstance.load({
          coreURL: await toBlobURL(
            `${baseURL}/ffmpeg-core.js`,
            "text/javascript"
          ),
          wasmURL: await toBlobURL(
            `${baseURL}/ffmpeg-core.wasm`,
            "application/wasm"
          ),
        });
        setFFmpeg(ffmpegInstance);
        setFFmpegLoaded(true);
      } catch (error) {
        console.error("Error loading FFmpeg: ", error);
      }
    };

    loadFFmpeg();
  }, []);

  useEffect(() => {
    let url;
    if (videoFile) {
      url = URL.createObjectURL(videoFile);
      setVideoPreview(url);
    }

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [videoFile]);

  const validateVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        const duration = video.duration;
        setVideoDuration(duration);

        if (duration > 120) {
          reject(new Error("Video tidak boleh lebih dari 20 menit"));
        } else {
          resolve(duration);
        }
      };

      video.onerror = () => {
        reject(new Error("File video tidak valid"));
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const compressVideo = async (file) => {
    if (!ffmpeg || !ffmpegLoaded) {
      throw new Error("FFmpeg belum siap");
    }

    setIsCompressing(true);
    setCompressionProgress(0);

    try {
      await ffmpeg.writeFile("input.mp4", await fetchFile(file));
      await ffmpeg.exec([
        "-i",
        "input.mp4",
        "-c:v",
        "libx264",
        "-crf",
        "28",
        "-preset",
        "fast",
        "-c:a",
        "aac",
        "-b:a",
        "128k",
        "-movflags",
        "+faststart",
        "-t",
        "120",
        "output.mp4",
      ]);

      const compressedData = await ffmpeg.readFile("output.mp4");
      const compressedBlob = new Blob([compressedData], { type: "video/mp4" });

      await ffmpeg.deleteFile("input.mp4");
      await ffmpeg.deleteFile("output.mp4");

      setIsCompressing(false);
      setCompressionProgress(100);

      return new File([compressedBlob], file.name, { type: "video/mp4" });
    } catch (error) {
      setIsCompressing(false);
      throw error;
    }
  };

  const handleVideoChange = async (e) => {
    const file = e.target.files?.[0] || null;

    if (!file) {
      setVideoFile(null);
      setVideoPreview("");
      setVideoDuration(0);
      return;
    }

    try {
      await validateVideoDuration(file);

      let finalFile = file;
      if (file.size > 10 * 1024 * 1024) {
        finalFile = await compressVideo(file);
      }

      setVideoFile(finalFile);
    } catch (error) {
      alert(error.message);
      e.target.value = "";
      setVideoFile(null);
      setVideoPreview("");
      setVideoDuration(0);
    }
  };

  const uploadMutation = useMutation({
    mutationFn: async (token) => {
      if (!videoFile) return null;

      const formData = new FormData();
      formData.append("video", videoFile, videoFile.name);
      const res = await uploadVideo(formData, token);
      return res.data.videoUrl || null;
    },
  });

  return {
    videoFile,
    videoPreview,
    videoDuration,
    handleVideoChange,
    setVideoPreview,
    setVideoFile,
    uploadAsync: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    uploadError: uploadMutation.error,
    isCompressing,
    compressionProgress,
    ffmpegLoaded,
  };
}
