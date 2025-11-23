import React from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Separator } from "./ui/separator";
import {
  Image as ImageIcon,
  Video as VideoIcon,
  Loader2,
  AlertCircle,
  Save,
  Send,
} from "lucide-react";

const PostForm = ({
  postData,
  setPostData,
  handleSubmit,
  handleImageChange,
  handleVideoChange,
  imagePreview,
  videoPreview,
  isSubmitting,
  error,
  submitText,
  loadingText,
  showTags = false,
  isCompressing,
  compressionProgress,
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostData((prevData) => ({ ...prevData, [name]: value }));
  };

  const isImageDisabled = !!videoPreview;
  const isVideoDisabled = !!imagePreview || isCompressing;

  return (
    <Card className="w-full border-none shadow-none sm:border sm:shadow-sm">
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-semibold">
              Judul Postingan <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              type="text"
              name="title"
              placeholder="Berikan judu yang menarik..."
              value={postData.title}
              onChange={handleInputChange}
              required
              className="text-lg font-medium"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-base font-semibold">
              Konten <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Apa yang sedang anda pikirkan?"
              value={postData.content}
              onChange={handleInputChange}
              required
              rows={8}
              className="resize-y min-h-[150px]"
            />
          </div>

          <Separator />

          {/* Media upload */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Media (Opsional)</Label>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Image upload */}
              <div
                className={`space-y-3 ${
                  isImageDisabled ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <Label
                  htmlFor="image-upload"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4 text-blue-500" />
                  <span>Upload Gambar</span>
                </Label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/png, image/jpeg, image/gif"
                  onChange={handleImageChange}
                  disabled={isImageDisabled}
                  className="cursor-pointer file:text-blue-600 file:font-medium"
                />
                <p className="text-xs text-muted-foreground">
                  Format: PNG, JPG, GIF
                </p>
              </div>

              {/* Video Upload */}
              <div
                className={`space-y-3 ${
                  isVideoDisabled ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <Label
                  htmlFor="video-upload"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <VideoIcon className="w-4 h-4 text-purple-500" />
                  <span>Upload Video</span>
                </Label>
                <Input
                  id="video-upload"
                  type="file"
                  accept="video/mp4, video/webp, video/ogg"
                  onChange={handleVideoChange}
                  disabled={isVideoDisabled}
                  className="cursor-pointer file:text-purple-600 file:font-medium"
                />
                <p className="text-xs text-muted-foreground">
                  Max: 2 menit, 10MB
                </p>
              </div>
            </div>
          </div>

          {/* Compression Progress */}
          {isCompressing && (
            <div className="p-4 space-y-2 border rounded-lg bg-muted">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2 font-medium">
                  <Loader2 className="w-3 h-3 animate-spin" /> Mengompresi
                  Video...
                </span>
                <span>{Math.round(compressionProgress)}</span>
              </div>
              <Progress value={compressionProgress} className="h-2" />
            </div>
          )}

          {/* Previews */}
          {(imagePreview || videoPreview) && (
            <div className="p-4 mt-4 border rounded-lg bg-slate-50 dark:bg-slate-900/50">
              <Label className="block mb-2 text-muted-foreground">
                Preview Media:
              </Label>

              {imagePreview && (
                <div className="relative max-w-md mx-auto overflow-hidden border rounded-md shadow-sm">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-auto object-contain max-h-[400px]"
                  />
                </div>
              )}

              {videoPreview && (
                <div className="relative max-w-md mx-auto overflow-hidden border rounded-md shadow-sm">
                  <video
                    src={videoPreview}
                    controls
                    className="w-full h-auto max-h-[400px]"
                  />
                </div>
              )}
            </div>
          )}

          {/* Tags Input (Conditional) */}
          {showTags && (
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-base font-semibold">
                Tags
              </Label>
              <Input
                id="tags"
                type="text"
                name="tags"
                value={postData.tags}
                onChange={handleInputChange}
                placeholder="Contoh: react, javascript, tutorial (pisahkan dengan koma)"
              />
              <p className="text-xs text-muted-foreground">
                Gunakan koma untuk memisahkan tag.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end pt-2 pb-6">
          <Button
            type="submit"
            disabled={isSubmitting || isCompressing}
            size="lg"
            className="w-full sm:w-auto min-w-[150px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {loadingText}
              </>
            ) : (
              <>
                {submitText === "Publikasikan" ? (
                  <Send className="w-4 h-4 mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {submitText}
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PostForm;
