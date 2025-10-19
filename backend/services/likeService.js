const db = require("../db");

const toggleLike = async (userId, postId) => {
  const existingLike = await db.query(
    "SELECT * FROM likes WHERE user_id = $1 AND post_id = $2",
    [userId, postId]
  );

  if (existingLike.rows.length > 0) {
    await db.query("DELETE FROM likes WHERE user_id = $1 AND post_id = $2", [
      userId,
      postId,
    ]);
    return { liked: false };
  } else {
    await db.query("INSERT INTO likes (user_id, post_id) VALUES ($1, $2)", [
      userId,
      postId,
    ]);
    return { liked: true };
  }
};

module.exports = { toggleLike };
