import React from "react";

const PostForm = ({
  postData,
  setPostData,
  handleSubmit,
  handleImageChange,
  imagePreview,
  isSubmitting,
  error,
  submitText,
  loadingText,
  showTags = false,
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
        />
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div style={{ marginTop: "1rem" }}>
          <p>Preview</p>
          <img
            src={imagePreview}
            alt="Preview"
            style={{ maxWidth: "300px", height: "auto" }}
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

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? loadingText : submitText}
      </button>
    </form>
  );
};

export default PostForm;
