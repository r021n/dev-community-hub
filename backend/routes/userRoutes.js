const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.get("/profile", authenticateToken, userController.getProfile);

// Route untuk mendapatkan profil user lain (public)
router.get(
  "/profile/:username",
  authenticateToken,
  userController.getPublicProfile
);

module.exports = router;
