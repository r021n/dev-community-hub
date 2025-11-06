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

  const posts = await db("posts as p")
    .leftJoin("likes as l", "l.post_id", "p.id")
    .select(
      "p.id",
      "p.slug",
      "p.title",
      "p.image_url",
      "p.content",
      "p.created_at",
      db.raw("COUNT(DISTINCT l.user_id) as like_count")
    )
    .where("p.user_id", user.id)
    .groupBy("p.id")
    .orderBy("p.created_at", "desc");

  return { ...user, posts };
};

module.exports = { getUserById, getUserProfileByUsername };
