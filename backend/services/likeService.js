const db = require("../db/db");

const toggleLike = async (userId, postId) => {
  const existingLike = await db("likes")
    .where({ user_id: userId, post_id: postId })
    .first();

  if (existingLike) {
    await db("likes").where({ user_id: userId, post_id: postId }).del();
    return { liked: false };
  } else {
    await db("likes").insert({ user_id: userId, post_id: postId });
    return { liked: true };
  }
};

module.exports = { toggleLike };
