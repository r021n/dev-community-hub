const db = require("../db/db");

const getUserById = async (userId) => {
  const user = await db("users")
    .select("id", "username", "created_at")
    .where({ id: userId })
    .first();

  return user;
};

const getUserProfileByUsername = async (username) => {
  const user = await db("users")
    .select("id", "username", "created_at")
    .where({ username })
    .first();

  if (!user) return null;

  const posts = await db("posts")
    .select("id", "slug", "title", "image_url", "content", "created_at")
    .where({ user_id: user.id })
    .orderBy("created_at", "desc");

  return { ...user, posts };
};

module.exports = { getUserById, getUserProfileByUsername };
