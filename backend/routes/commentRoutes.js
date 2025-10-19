const express = require("express");
const router = express.Router({ mergeParams: true });
const commentController = require("../controllers/commentController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.get("/", commentController.getComments);
router.post("/", authenticateToken, commentController.postComment);

module.exports = router;
