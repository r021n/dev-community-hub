const db = require("../db/db");

const getDashboardStats = async () => {
  const [userRes, postRes, commentRes, likeRes] = await Promise.all([
    db("users").count("* as count").first(),
    db("posts").count("* as count").first(),
    db("comments").count("* as count").first(),
    db("likes").count("* as count").first(),
  ]);

  return {
    totalUsers: parseInt(userRes.count, 10),
    totalPosts: parseInt(postRes.count, 10),
    totalComments: parseInt(commentRes.count, 10),
    totalLikes: parseInt(likeRes.count, 10),
  };
};

module.exports = { getDashboardStats };
