const db = require("../db");

const getDashboardStats = async () => {
  const userCountPromise = db.query("SELECT COUNT(*) FROM users");
  const postCountPromise = db.query("SELECT COUNT(*) FROM posts");
  const commentCountPromise = db.query("SELECT COUNT(*) FROM comments");
  const likeCountPromise = db.query("SELECT COUNT(*) FROM likes");

  const [userRes, postRes, commentRes, likeRes] = await Promise.all([
    userCountPromise,
    postCountPromise,
    commentCountPromise,
    likeCountPromise,
  ]);

  return {
    totalUsers: parseInt(userRes.rows[0].count, 10),
    totalPosts: parseInt(postRes.rows[0].count, 10),
    totalComments: parseInt(commentRes.rows[0].count, 10),
    totalLikes: parseInt(likeRes.rows[0].count, 10),
  };
};

module.exports = { getDashboardStats };
