const db = require("../db/db");

const getUserById = async (userId) => {
  const user = await db("users")
    .select("id", "username", "created_at")
    .where({ id: userId })
    .first();

  return user;
};

const getUserProfileByUsername = async (username, page = 1, limit = 5) => {
  const user = await db("users")
    .select("id", "username", "created_at")
    .where({ username })
    .first();

  if (!user) return null;

  const offset = (page - 1) * limit;

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
    .orderBy("p.created_at", "desc")
    .limit(limit)
    .offset(offset);

  const [{ total }] = await db("posts")
    .where("user_id", user.id)
    .count("* as total");

  return {
    ...user,
    posts,
    pagination: {
      page,
      limit,
      total: parseInt(total),
      hasMore: offset + posts.length < parseInt(total),
    },
  };
};

module.exports = { getUserById, getUserProfileByUsername };
