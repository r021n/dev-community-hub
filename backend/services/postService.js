const db = require("../db");

const getAllPosts = async (options = {}) => {
  const { searchTerm, tag } = options;
  let query = `
    SELECT
      p.id, p.title, p.content, p.created_at, p.user_id,
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

  const queryParams = [];
  let whereClauses = [];

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
    query += " WHERE " + whereClauses.join(" AND ");
  }

  query += `
    GROUP BY p.id, u.username
    ORDER BY p.created_at DESC
  `;

  const { rows } = await db.query(query, queryParams);
  return rows;
};

const getPostById = async (postId) => {
  const { rows } = await db.query(
    `
    SELECT p.id, p.title, p.content, p.created_at, p.user_id,
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
    await client.query("BEGIN");

    const postResult = await client.query(
      "INSERT INTO posts (user_id, title, content, image_url) VALUES ($1, $2, $3) RETURNING *",
      [userId, title, content, imageUrl]
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

const updatePost = async (postId, userId, title, content) => {
  const result = await db.query(
    "UPDATE posts SET title = $1, content = $2 WHERE id = $3 AND user_id = $4",
    [title, content, postId, userId]
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
