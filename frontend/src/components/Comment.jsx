import React, { useState } from "react";
import CommentForm from "./CommentForm";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { MessageSquare, User } from "lucide-react";

const Comment = ({ comment, onReplySubmitted, depth = 0 }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReply = (replyData) => {
    onReplySubmitted(replyData);
    setShowReplyForm(false);
  };

  // Limit nesting depth untuk mobile
  const maxDepth = 3;
  const isNested = depth > 0;
  const canReply = depth < maxDepth;
  return (
    <div className={`${isNested ? "ml-4 md:ml-12" : ""}`}>
      <Card className={`${isNested ? "border-l-2 border-l-muted" : ""}`}>
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="text-xs">
                {comment.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold">{comment.username}</span>
                <span className="text-muted-foreground">•</span>
                <time className="text-muted-foreground">
                  {new Date(comment.created_at).toLocaleDateString("id-ID")}
                </time>
              </div>

              {/* Comment Content */}
              <p className="text-sm whitespace-pre-wrap">{comment.content}</p>

              {/* Reply Button */}
              {canReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="h-8 px-2 text-xs"
                >
                  <MessageSquare className="w-3 h-3 mr-1" />
                  {showReplyForm ? "Batal" : "Balas"}
                </Button>
              )}
            </div>
          </div>
          {showReplyForm && (
            <div className="mt-4 ml-11">
              <CommentForm
                parentId={comment.id}
                onCommentSubmitted={handleReply}
                isReply
              />
            </div>
          )}
        </CardContent>
      </Card>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2 space-y-2">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onReplySubmitted={onReplySubmitted}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
