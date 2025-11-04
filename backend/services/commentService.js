const db = require("../db/db");

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
  const comments = await db("comments as c")
    .join("users as u", "c.user_id", "u.id")
    .select("c.*", "u.username")
    .where("c.post_id", postId)
    .orderBy("c.created_at", "asc");

  return buildCommentTree(comments);
};

const createComment = async (postId, userId, content, parentId = null) => {
  // gunakan transaksi knex
  return await db.transaction(async (trx) => {
    // insert comment
    const [newComment] = await trx("comments")
      .insert({
        post_id: postId,
        user_id: userId,
        content,
        parent_id: parentId,
      })
      .returning("*");

    // ambil owner post
    const postOwner = await trx("posts")
      .select("user_id")
      .where({ id: postId })
      .first();

    // ambil username commenter
    const commenter = await trx("users")
      .select("username")
      .where({ id: userId })
      .first();

    return {
      newComment,
      postOwnerId: postOwner.user_id,
      commenterUsername: commenter.username,
    };
  });
};

module.exports = { getCommentsByPostId, createComment, buildCommentTree };
