const likeService = require("../services/likeService");

const togglePostLike = async (req, res) => {
  const userId = req.user.id;
  const { id: postId } = req.params;

  try {
    const result = await likeService.toggleLike(userId, postId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Gagal memproses like" });
  }
};

module.exports = { togglePostLike };
