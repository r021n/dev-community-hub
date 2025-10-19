const commentService = require("../services/commentService");

const getComments = async (req, res) => {
  try {
    const comments = await commentService.getCommentsByPostId(
      req.params.postId
    );
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Gagal mendapatkan komentar" });
  }
};

const postComment = async (req, res) => {
  const { content, parentId } = req.body;
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    const newComment = await commentService.createComment(
      postId,
      userId,
      content,
      parentId
    );
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: "Gagal membuat komentar", error });
  }
};

module.exports = { getComments, postComment };
