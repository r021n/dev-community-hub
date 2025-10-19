const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { authenticateToken } = require("../middleware/authMiddleware");

const commentRoutes = require("./commentRoutes");
const likeController = require("../controllers/likeController");

// posts route
router.get("/", postController.getPosts);
router.post("/", authenticateToken, postController.createPost);
router.get("/:id", postController.getPost);
router.put("/:id", authenticateToken, postController.editPost);
router.delete("/:id", authenticateToken, postController.removePost);
router.post("/:id/like", authenticateToken, likeController.togglePostLike);

// comment route
router.use("/:postId/comments", commentRoutes);

module.exports = router;
