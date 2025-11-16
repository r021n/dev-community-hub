import React from "react";

const PostForm = ({
  postData,
  setPostData,
  handleSubmit,
  handleImageChange,
  handleVideoChange,
  imagePreview,
  videoPreview,
  isSubmitting,
  error,
  submitText,
  loadingText,
  showTags = false,
  isCompressing,
  compressionProgress,
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Title */}
      <div>
        <label>Judul:</label>
        <input
          type="text"
          name="title"
          value={postData.title}
          onChange={handleInputChange}
          required
        />
      </div>

      {/* Content */}
      <div>
        <label>Konten:</label>
        <textarea
          name="content"
          value={postData.content}
          onChange={handleInputChange}
          required
          rows="10"
        ></textarea>
      </div>

      {/* Image upload */}
      <div>
        <label>Gambar (opsional):</label>
        <input
          type="file"
          accept="image/png, image/jpeg, image/gif"
          onChange={handleImageChange}
          disabled={videoPreview ? true : false}
        />
      </div>

      {/* Video Upload */}
      <div>
        <label>Video (opsional, max 2 menit, max 10MB):</label>
        <input
          type="file"
          accept="video/mp4, video/webm, video/ogg"
          onChange={handleVideoChange}
          disabled={imagePreview || isCompressing ? true : false}
        />
      </div>

      {/* Compression Progress */}
      {isCompressing && (
        <div style={{ marginTop: "1rem" }}>
          <p>Mengompresi video: {compressionProgress}</p>
          <div
            style={{
              width: "100%",
              backgroundColor: "#f0f0f0",
              borderRadius: "4px",
            }}
          >
            <div
              style={{
                width: `${compressionProgress}%`,
                height: "20px",
                backgroundColor: "#4CAF50",
                borderRadius: "4px",
                transition: "width 0.3s",
              }}
            />
          </div>
        </div>
      )}

      {/* Image Preview */}
      {imagePreview && (
        <div style={{ marginTop: "1rem" }}>
          <p>Preview Gambar</p>
          <img
            src={imagePreview}
            alt="Preview"
            style={{ maxWidth: "300px", height: "auto" }}
          />
        </div>
      )}

      {/* Video Preview */}
      {videoPreview && (
        <div style={{ marginTop: "1rem" }}>
          <p>Preview Video</p>
          <video
            src={videoPreview}
            controls
            style={{ maxWidth: "400px", height: "auto" }}
          />
        </div>
      )}

      {/* Tags (Conditional) */}
      {showTags && (
        <div>
          <label>Tags (Pisahkan dengan tanda koma)</label>
          <input
            type="text"
            name="tags"
            value={postData.tags}
            onChange={handleInputChange}
            placeholder="react, express, laravel"
          />
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit" disabled={isSubmitting || isCompressing}>
        {isSubmitting ? loadingText : submitText}
      </button>
    </form>
  );
};

export default PostForm;
