import React, { useState } from "react";
import CommentForm from "./CommentForm";

const Comment = ({ comment, onReplySubmitted }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReply = (replyData) => {
    onReplySubmitted(replyData);
    setShowReplyForm(false);
  };
  return (
    <div
      style={{
        marginLeft: "20px",
        marginTop: "10px",
        borderLeft: "solid 2px #eee",
        paddingLeft: "10px",
      }}
    >
      <p>
        <strong>{comment.username}</strong>
        <br />
        {comment.content}
      </p>
      <button onClick={() => setShowReplyForm(!showReplyForm)}>
        {showReplyForm ? "batal" : "balas"}
      </button>

      {showReplyForm && (
        <CommentForm parentId={comment.id} onCommentSubmitted={handleReply} />
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div>
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onReplySubmitted={onReplySubmitted}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
