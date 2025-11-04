const db = require("../db/db");
const slugify = require("../utils/slugify");

const findUniqueSlug = async (baseSlug) => {
  let slug = baseSlug;
  let counter = 1;

  let existing = await db("posts").where({ slug }).first();

  while (existing) {
    const likeSlug = `${baseSlug}-%`;

    const result = await db("posts")
      .select("slug")
      .where("slug", baseSlug)
      .orWhere("slug", "like", likeSlug)
      .orderByRaw("length(slug) DESC, slug DESC")
      .first();

    const lastSlug = result ? result.slug : baseSlug;
    const lastNumMatch = lastSlug.match(/-(\d+)$/);
    counter = lastNumMatch ? parseInt(lastNumMatch[1], 10) + 1 : 1;
    slug = `${baseSlug}-${counter}`;

    existing = await db("posts").where({ slug }).first();
  }
  return slug;
};

const getAllPosts = async (options = {}) => {
  const { searchTerm, tag, page = 1, limit = 10 } = options;
  const offset = (page - 1) * limit;

  // base query
  let query = db("posts as p")
    .join("users as u", "p.user_id", "u.id")
    .leftJoin("likes as l", "l.post_id", "p.id")
    .leftJoin("post_tags as pt", "p.id", "pt.post_id")
    .leftJoin("tags as t", "pt.tag_id", "t.id")
    .select(
      "p.id",
      "p.title",
      "p.content",
      "p.created_at",
      "p.user_id",
      "p.image_url",
      "p.slug",
      db.raw("u.username as author"),
      db.raw("COUNT(DISTINCT l.user_id) as like_count"),
      db.raw(
        "COALESCE(ARRAY_AGG(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL), '{}') as tags"
      )
    )
    .groupBy("p.id", "u.username")
    .orderBy("p.created_at", "desc")
    .limit(limit)
    .offset(offset);

  // filter
  if (searchTerm) {
    query.whereRaw(
      "to_tsvector('english', p.title || ' ' || p.content) @@ websearch_to_tsquery('english', ?)",
      [searchTerm]
    );
  }

  if (tag) {
    query.whereIn("p.id", function () {
      this.select("post_id")
        .from("post_tags")
        .join("tags", "tags.id", "post_tags.tag_id")
        .where("tags.name", tag);
    });
  }

  const posts = await query;

  // count total
  let countQuery = db("posts as p").countDistinct("p.id as count");
  if (searchTerm) {
    countQuery.whereRaw(
      "to_tsvector('english', p.title || ' ' || p.content) @@ websearch_to_tsquery('english', ?)",
      [searchTerm]
    );
  }
  if (tag) {
    countQuery
      .join("post_tags as pt", "p.id", "pt.post_id")
      .join("tags as t", "pt.tag_id", "t.id")
      .where("t.name", tag);
  }

  const totalResult = await countQuery.first();
  const totalPosts = parseInt(totalResult.count, 10);

  return { posts, totalPosts, page, limit };
};

const getPostById = async (postId) => {
  const post = await db("posts as p")
    .join("users as u", "p.user_id", "u.id")
    .leftJoin("post_tags as pt", "p.id", "pt.post_id")
    .leftJoin("tags as t", "pt.tag_id", "t.id")
    .select(
      "p.id",
      "p.title",
      "p.content",
      "p.created_at",
      "p.user_id",
      "p.image_url",
      "p.slug",
      db.raw("u.username as author"),
      db.raw("(SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count"),
      db.raw("ARRAY_AGG(t.name) as tags")
    )
    .where("p.id", postId)
    .groupBy("p.id", "u.username")
    .first();

  return post;
};

const createPost = async (
  userId,
  title,
  content,
  tags = [],
  imageUrl = null
) => {
  return await db.transaction(async (trx) => {
    const baseSlug = slugify(title);
    const uniqueSlug = await findUniqueSlug(baseSlug);

    const [newPost] = await trx("posts")
      .insert({
        user_id: userId,
        title,
        content,
        image_url: imageUrl,
        slug: uniqueSlug,
      })
      .returning("*");

    for (const tagName of tags) {
      const normalized = tagName.trim().toLowerCase();

      let tag = await trx("tags")
        .select("id")
        .where({ name: normalized })
        .first();
      let tagId;

      if (tag) {
        tagId = tag.id;
      } else {
        const [newTag] = await trx("tags")
          .insert({ name: normalized })
          .returning("id");
        tagId = newTag.id;
      }

      await trx("post_tags").insert({ post_id: newPost.id, tag_id: tagId });
    }

    return newPost;
  });
};

const updatePost = async (postId, userId, title, content, imageUrl) => {
  const baseSlug = slugify(title);
  let uniqueSlug = baseSlug;

  const currentPost = await db("posts")
    .select("slug")
    .where({ id: postId })
    .first();
  if (!currentPost || currentPost.slug !== baseSlug) {
    uniqueSlug = await findUniqueSlug(baseSlug);
  }

  const result = await db("posts")
    .where({ id: postId, user_id: userId })
    .update({
      title,
      content,
      image_url: imageUrl,
      slug: uniqueSlug,
    });

  if (result === 0) {
    throw new Error(
      "Post tidak ditemukan atau anda tidak memiliki izin untuk mengedit"
    );
  }

  return await getPostById(postId);
};

const deletePost = async (postId, userId) => {
  const postCheck = await db("posts")
    .select("user_id")
    .where({ id: postId })
    .first();

  if (!postCheck) {
    throw new Error("Post tidak ditemukan");
  }

  if (postCheck.user_id !== userId) {
    throw new Error("Anda tidak memiliki izin untuk menghapus post ini");
  }

  await db("posts").where({ id: postId }).del();

  return { message: "Berhasil menghapus post" };
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
