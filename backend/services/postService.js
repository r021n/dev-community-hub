const db = require("../db");
const slugify = require("../utils/slugify");

const findUniqueSlug = async (baseSlug) => {
  let slug = baseSlug;
  let counter = 1;

  let existing = await db.query("SELECT 1 FROM posts WHERE slug = $1", [slug]);

  while (existing.rows.length > 0) {
    const likeSlug = `${baseSlug}-%`;
    const result = await db.query(
      "SELECT slug FROM posts WHERE slug = $1 OR slug LIKE $2 ORDER BY length(slug) DESC, slug DESC LIMIT 1",
      [baseSlug, likeSlug]
    );

    const lastSlug = result.rows.length > 0 ? result.rows[0].slug : baseSlug;
    const lastNumMatch = lastSlug.match(/-(\d+)$/);
    counter = lastNumMatch ? parseInt(lastNumMatch[1], 10) + 1 : 1;
    slug = `${baseSlug}-${counter}`;
    existing = await db.query("SELECT 1 FROM posts WHERE slug = $1", [slug]);
  }
  return slug;
};

const getAllPosts = async (options = {}) => {
  const { searchTerm, tag, page = 1, limit = 10 } = options;
  const offset = (page - 1) * limit;

  let selectQuery = `
    SELECT
      p.id, p.title, p.content, p.created_at, p.user_id, p.image_url, p.slug,
      u.username AS author,
      COUNT(DISTINCT l.user_id) as like_count,
      COALESCE(
        ARRAY_AGG(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL),
        '{}'
      ) AS tags
    FROM posts p
    JOIN users u ON p.user_id = u.id
    LEFT JOIN likes l ON l.post_id = p.id
    LEFT JOIN post_tags pt ON p.id = pt.post_id
    LEFT JOIN tags t ON pt.tag_id = t.id
    `;

  let countQuery = `SELECT COUNT(DISTINCT p.id) FROM posts p`;

  const queryParams = [];
  const whereClauses = [];

  if (searchTerm) {
    queryParams.push(searchTerm);
    whereClauses.push(
      `to_tsvector('english', p.title || ' ' || p.content) @@ websearch_to_tsquery('english', $${queryParams.length})`
    );
  }

  if (tag) {
    queryParams.push(tag);
    whereClauses.push(
      `p.id IN (SELECT post_id FROM post_tags JOIN tags ON tags.id = post_tags.tag_id WHERE tags.name = $${queryParams.length})`
    );
  }

  if (whereClauses.length > 0) {
    const whereString = " WHERE " + whereClauses.join(" AND ");
    selectQuery += whereString;

    if (tag) {
      countQuery += `
        LEFT JOIN post_tags pt ON p.id = pt.post_id
        LEFT JOIN tags t ON pt.tag_id = t.id
      `;
    }
    countQuery += whereString;
  }

  selectQuery += `
    GROUP BY p.id, u.username
    ORDER BY p.created_at DESC
    LIMIT $${queryParams.length + 1}
    OFFSET $${queryParams.length + 2}
  `;

  const postsResult = await db.query(selectQuery, [
    ...queryParams,
    limit,
    offset,
  ]);
  const totalResult = await db.query(countQuery, queryParams);

  const totalPosts = parseInt(totalResult.rows[0].count, 10);
  return { posts: postsResult.rows, totalPosts, page, limit };
};

const getPostById = async (postId) => {
  const { rows } = await db.query(
    `
    SELECT p.id, p.title, p.content, p.created_at, p.user_id, p.image_url, p.slug,
      u.username AS author,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS like_count,
      ARRAY_AGG(t.name) AS tags
    FROM posts p
    JOIN users u ON p.user_id = u.id
    LEFT JOIN post_tags pt ON p.id = pt.post_id
    LEFT JOIN tags t ON pt.tag_id = t.id
    WHERE p.id = $1
    GROUP BY p.id, u.username
    `,
    [postId]
  );
  return rows[0];
};

const createPost = async (
  userId,
  title,
  content,
  tags = [],
  imageUrl = null
) => {
  const client = await db.getClient();
  try {
    const baseSlug = slugify(title);
    const uniqueSlug = await findUniqueSlug(baseSlug);
    await client.query("BEGIN");

    const postResult = await client.query(
      "INSERT INTO posts (user_id, title, content, image_url, slug) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [userId, title, content, imageUrl, uniqueSlug]
    );
    const newPost = postResult.rows[0];

    for (const tagName of tags) {
      let tagResult = await client.query(
        "SELECT id FROM tags WHERE name = $1",
        [tagName.trim().toLowerCase()]
      );
      let tagId;

      if (tagResult.rows.length > 0) {
        tagId = tagResult.rows[0].id;
      } else {
        const newTagResult = await client.query(
          "INSERT INTO tags (name) VALUES ($1) RETURNING id",
          [tagName.trim().toLowerCase()]
        );
        tagId = newTagResult.rows[0].id;
      }

      await client.query(
        "INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2)",
        [newPost.id, tagId]
      );
    }

    await client.query("COMMIT");
    return newPost;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const updatePost = async (postId, userId, title, content, imageUrl) => {
  const baseSlug = slugify(title);
  let uniqueSlug = baseSlug;

  // Cek apakah slug perlu diubah dan unik
  const currentPost = await db.query("SELECT slug FROM posts WHERE id = $1", [
    postId,
  ]);
  if (!currentPost.rows[0] || currentPost.rows[0].slug !== baseSlug) {
    uniqueSlug = await findUniqueSlug(baseSlug);
  }

  const result = await db.query(
    "UPDATE posts SET title = $1, content = $2, image_url = $3, slug = $4 WHERE id = $5 AND user_id = $6",
    [title, content, imageUrl, uniqueSlug, postId, userId]
  );

  if (result.rowCount === 0) {
    throw new Error(
      "Post tidak ditemukan atau anda tidak memiliki izin untuk mengedit"
    );
  }

  // Setelah berhasil update, panggil getPostById untuk mendapatkan data yang lengkap dan konsisten
  const updatedPost = await getPostById(postId);
  return updatedPost;
};

const deletePost = async (postId, userId) => {
  // Pertama, periksa apakah post ada dan siapa pemiliknya
  const postCheck = await db.query("SELECT user_id FROM posts WHERE id = $1", [
    postId,
  ]);

  if (postCheck.rows.length === 0) {
    throw new Error("Post tidak ditemukan");
  }

  if (postCheck.rows[0].user_id !== userId) {
    throw new Error("Anda tidak memiliki izin untuk menghapus post ini");
  }

  // Jika post ada dan user adalah pemiliknya, baru hapus
  await db.query("DELETE FROM posts WHERE id = $1", [postId]);

  return { message: "Berhasil menghapus post" };
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
