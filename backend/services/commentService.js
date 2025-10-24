const db = require("../db");

const buildCommentTree = (comments) => {
  const commentMap = [];
  const commentTree = [];

  comments.forEach((comment) => {
    commentMap[comment.id] = { ...comment, replies: [] };
  });

  comments.forEach((comment) => {
    if (comment.parent_id != null) {
      if (commentMap[comment.parent_id]) {
        commentMap[comment.parent_id].replies.push(commentMap[comment.id]);
      }
    } else {
      commentTree.push(commentMap[comment.id]);
    }
  });

  return commentTree;
};

const getCommentsByPostId = async (postId) => {
  const { rows } = await db.query(
    `
    SELECT c.*, u.username
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.post_id = $1
    ORDER BY c.created_at ASC
    `,
    [postId]
  );
  return buildCommentTree(rows);
};

const createComment = async (postId, userId, content, parentId = null) => {
  // const { rows } = await db.query(
  //   "INSERT INTO comments (post_id, user_id, content, parent_id) VALUES ($1, $2, $3, $4) RETURNING *",
  //   [postId, userId, content, parentId]
  // );
  // return rows[0];

  const client = await db.getClient(); // Pastikan client diawait
  try {
    await client.query("BEGIN");
    const commentResult = await client.query(
      "INSERT INTO comments (post_id, user_id, content, parent_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [postId, userId, content, parentId]
    );
    const newComment = commentResult.rows[0]; // Komentar baru yang berhasil dibuat

    const postOwnerResult = await client.query(
      "SELECT user_id FROM posts WHERE id = $1",
      [postId]
    );
    const postOwnerId = postOwnerResult.rows[0].user_id;

    const commenterResult = await client.query(
      "SELECT username FROM users WHERE id = $1",
      [userId]
    );
    const commenterUsername = commenterResult.rows[0].username;

    await client.query("COMMIT");
    return { newComment, postOwnerId, commenterUsername };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { getCommentsByPostId, createComment, buildCommentTree };
