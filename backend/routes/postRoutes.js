const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { authenticateToken } = require("../middleware/authMiddleware");

const commentRoutes = require("./commentRoutes");
const likeController = require("../controllers/likeController");
const uploadController = require("../controllers/uploadController");
const { upload } = require("../config/cloudinaryConfig");

// posts route
router.get("/", postController.getPosts);
router.post("/", authenticateToken, postController.createPost);
router.get("/:id", postController.getPost);
router.put("/:id", authenticateToken, postController.editPost);
router.delete("/:id", authenticateToken, postController.removePost);

// upload asset route
router.post(
  "/upload-image",
  authenticateToken,
  upload.single("image"),
  uploadController.uploadImage
);
router.post(
  "/upload-video",
  authenticateToken,
  upload.single("video"),
  uploadController.uploadVideo
);

// like route
router.post("/:id/like", authenticateToken, likeController.togglePostLike);

// comment route
router.use("/:postId/comments", commentRoutes);

module.exports = router;
