const db = require("../db");

const getUserById = async (userId) => {
  const { rows } = await db.query(
    "SELECT id, username, created_at FROM users WHERE id = $1",
    [userId]
  );

  return rows[0];
};

const getUserProfileByUsername = async (username) => {
  const { rows: userRows } = await db.query(
    "SELECT id, username, created_at FROM users WHERE username = $1",
    [username]
  );

  const user = userRows[0];
  if (!user) return null;

  const { rows: posts } = await db.query(
    "SELECT id, slug, title, content, created_at FROM posts WHERE user_id = $1 ORDER BY created_at DESC",
    [user.id]
  );

  return { ...user, posts };
};

module.exports = { getUserById, getUserProfileByUsername };
