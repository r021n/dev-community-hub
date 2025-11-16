import React from "react";
import { Link } from "react-router-dom";
import {
  transformCloudinaryUrl,
  getVideoThumbnail,
} from "../utils/cloudinaryHelper";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, Play } from "lucide-react";

const PostCard = ({ post, showAuthor = true }) => {
  const hasMedia = post.image_url || post.video_url;
  const thumbnailUrl = post.video_url
    ? getVideoThumbnail(post.video_url)
    : post.image_url
    ? transformCloudinaryUrl(post.image_url, "thumbnail")
    : null;
  return (
    <Card
      key={post.id}
      className="overflow-hidden transition-shadow duration-200 hover:shadow-lg"
    >
      {/* Media Section */}
      {hasMedia && thumbnailUrl && (
        <Link to={`/post/${post.id}/${post.slug}`}>
          <div className="relative overflow-hidden aspect-video bg-muted">
            <img
              src={thumbnailUrl}
              alt={post.title}
              loading="lazy"
              className="object-cover w-full h-full transition-transform duration-200 hover:scale-105"
            />
            {post.video_url && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-4 transition-colors rounded-full bg-black/70 dark:bg-black/80 backdrop-blur-sm hover:bg-black/80 dark:hover:bg-black/90">
                  <Play className="w-8 h-8 text-white fill-white" />
                </div>
              </div>
            )}
          </div>
        </Link>
      )}

      {/* Content Section */}
      <CardHeader className="pb-3">
        <Link to={`/post/${post.id}/${post.slug}`} className="hover:underline">
          <h3 className="text-xl font-semibold leading-tight line-clamp-2">
            {post.title}
          </h3>
        </Link>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {showAuthor && (
            <>
              <span>oleh {post.author}</span>
              <span>•</span>
            </>
          )}
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-3 h-3" />
            <span>{post.like_count}</span>
          </div>
        </div>
      </CardContent>
      {/* Tags Section */}
      {post.tags && post.tags.filter((t) => t).length > 0 && (
        <CardFooter className="flex flex-wrap gap-2 pt-0">
          {post.tags
            .filter((t) => t)
            .map((tag) => (
              <Link to={`/?tag=${tag}`} key={tag}>
                <Badge
                  variant="secondary"
                  className="transition-colors hover:bg-secondary/80"
                >
                  #{tag}
                </Badge>
              </Link>
            ))}
        </CardFooter>
      )}
    </Card>
  );
};

export default PostCard;
