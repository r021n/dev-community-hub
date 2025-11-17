import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Send, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

const CommentForm = ({
  parentId = null,
  onCommentSubmitted,
  isReply = false,
}) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { auth } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onCommentSubmitted({ content, parentId });
      setContent("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!auth.token)
    return (
      <Alert className="border-dashed">
        <LogIn className="w-4 h-4" />
        <AlertDescription>
          <Link to="/login" className="font-medium underline">
            Login
          </Link>{" "}
          untuk ikut berdiskusi
        </AlertDescription>
      </Alert>
    );

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={isReply ? "Tulis balasan..." : "Tulis komentar..."}
          required
          disabled={isSubmitting}
          className="min-h-[100px] resize-none pr-16"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.ctrlKey) {
              handleSubmit(e);
            }
          }}
        />

        {/* Character Counter */}
        <span className="absolute text-xs bottom-2 right-2 text-muted-foreground">
          {content.length}/500
        </span>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Ctrl + Enter untuk kirim
        </p>

        <Button
          type="submit"
          size="sm"
          disabled={!content.trim() || isSubmitting || content.length > 500}
        >
          <Send className="w-4 h-4 mr-2" />
          {isSubmitting ? "Mengirim..." : "Kirim"}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
