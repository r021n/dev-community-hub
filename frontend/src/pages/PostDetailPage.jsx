import React, { useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Comment from "../components/Comment";
import CommentForm from "../components/CommentForm";
import { transformCloudinaryUrl } from "../utils/cloudinaryHelper";
import { usePostDetail } from "../hooks/usePostDetail";
import { createCommentApi, deletePostApi, likePost, getPost } from "../api/api";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import {
  ThumbsUp,
  Edit,
  Trash2,
  Calendar,
  User,
  MessageCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { toast } = useToast();
  const { post, setPost, comments, loading, error, refetch } =
    usePostDetail(id);

  const handleCommentSubmit = async (commentData) => {
    try {
      await createCommentApi(id, commentData, auth.token);
      refetch();
      toast({ title: "Komentar berhasil dikirm", duration: 3000 });
    } catch (error) {
      toast({
        title: "Komentar gagal dikirim",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Apakah anda ingin menghapus post ini?")) {
      try {
        await deletePostApi(id, auth.token);
        toast({
          title: "Post berhasil dihapus",
        });
        navigate("/");
      } catch (error) {
        toast({
          title: "Gagal menghapus post",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleLike = async () => {
    if (!auth.token) {
      toast({
        title: "Login diperlukan",
        description: "Silahkan login untuk menyukai pesan ini",
        duration: 3000,
      });
      return;
    }

    try {
      await likePost(id, auth.token);
      const postRes = await getPost(id);
      setPost(postRes.data);
    } catch (error) {
      toast({
        title: "Gagal melakukan like",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const isOwner = auth.user && post && auth.user.id === post.user_id;

  // Loading state
  if (loading)
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-[400px] w-full rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="w-3/4 h-10" />
          <Skeleton className="w-1/2 h-6" />
          <Skeleton className="w-full h-32" />
        </div>
      </div>
    );

  // Error State
  if (error)
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <p>{error}</p>
      </Alert>
    );
  if (!post)
    return <Alert className="max-w-2xl mx-auto">Post tidak ditemukan</Alert>;

  return (
    <div className="max-w-4xl mx-auto">
      <article>
        <Card className="overflow-hidden">
          {post.image_url && (
            <div className="relative overflow-hidden aspect-video bg-muted">
              <img
                src={transformCloudinaryUrl(post.image_url, "full")}
                alt={post.title}
                loading="lazy"
                className="object-contain w-full h-full"
              />
            </div>
          )}
          {post.video_url && (
            <div className="relative overflow-hidden bg-black aspect-video">
              <video src={post.video_url} controls className="w-full h-full">
                Browser anda tidak mendukung video player
              </video>
            </div>
          )}
          <CardHeader>
            <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>

            {/* Meta Information */}
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span className="font-medium">{post.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <time dateTime="">
                  {new Date(post.created_at).toLocaleDateString()}
                </time>
              </div>
            </div>
            {isOwner && (
              <div className="flex gap-2 mt-4">
                <Link to={`/post/${id}/${post.slug}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit post
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Hapus
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus Postingan?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tindakan ini tidak dapat dibatalkan, post komentar akan
                        dihapus secara permanen
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>
                        Hapus
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {/* Post Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap">{post.content}</p>
            </div>
            {post.tags && post.tags.filter((t) => t).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {post.tags
                  .filter((t) => t)
                  .map((tag) => (
                    <Link to={`/?tag=${tag}`} key={tag}>
                      <Badge variant="secondary">#{tag}</Badge>
                    </Link>
                  ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              variant={post.isLiked ? "default" : "outline"}
              size="sm"
              onClick={handleLike}
              className="gap-2"
            >
              <ThumbsUp
                className={`h-4 w-4 ${post.isLiked ? "fill-current" : ""}`}
              />
              {post.like_count}
            </Button>
          </CardFooter>
        </Card>
      </article>

      {/* Comments section */}
      <section className="mt-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-2xl font-semibold">
            <MessageCircle className="w-6 h-6" />
            Komentar ({comments.length})
          </h3>
        </div>
        <Separator />

        {/* Comment Form */}
        <CommentForm onCommentSubmitted={handleCommentSubmit} />

        {/* Comment List */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onReplySubmitted={handleCommentSubmit}
            />
          ))}

          {comments.length === 0 && (
            <p className="py-8 text-center text-muted-foreground">
              Belum ada komentar, jadilah yang pertama
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default PostDetailPage;
