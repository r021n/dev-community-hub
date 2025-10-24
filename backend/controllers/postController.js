const postService = require("../services/postService");

const getPosts = async (req, res) => {
  const { search, tag } = req.query;
  try {
    const post = await postService.getAllPosts({ searchTerm: search, tag });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

const getPost = async (req, res) => {
  try {
    const post = await postService.getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post tidak ditemukan" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error });
  }
};

const createPost = async (req, res) => {
  const { title, content, tags } = req.body;
  const userId = req.user.id;

  if (!title || !content) {
    return res.status(400).json({ message: "Judul dan konten diperlukan" });
  }

  try {
    const newPost = await postService.createPost(userId, title, content, tags);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: "Gagal membuat post" });
  }
};

const editPost = async (req, res) => {
  const { title, content } = req.body;
  const postId = req.params.id;
  const userId = req.user.id;

  try {
    const updatedPost = await postService.updatePost(
      postId,
      userId,
      title,
      content
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

const removePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  try {
    const message = await postService.deletePost(postId, userId);
    res.status(200).json(message);
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

module.exports = {
  getPosts,
  getPost,
  createPost,
  editPost,
  removePost,
};
