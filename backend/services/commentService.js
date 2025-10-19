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
  const { rows } = await db.query(
    "INSERT INTO comments (post_id, user_id, content, parent_id) VALUES ($1, $2, $3, $4) RETURNING *",
    [postId, userId, content, parentId]
  );
  return rows[0];
};

module.exports = { getCommentsByPostId, createComment };
