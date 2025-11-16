const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = "dev_community_hub";
    let resource_type = "image";
    let allowed_formats;
    let transformation;

    if (file.mimetype.startsWith("video/")) {
      resource_type = "video";
      allowed_formats = ["mp4", "webm", "ogg"];
      transformation = [
        { duration: "120", flags: "splice" },
        { quality: "auto:good" },
      ];
    } else {
      allowed_formats = ["jpeg", "png", "jpg", "gif"];
      transformation = [{ width: 1200, height: 1200, crop: "limit" }];
    }

    return {
      folder: folder,
      resource_type: resource_type,
      allowed_formats: allowed_formats,
      transformation: transformation,
      max_bytes: 10485760,
    };
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = { upload };
