export const transformCloudinaryUrl = (originalUrl, type = "full") => {
  if (!originalUrl) return null;

  const uploadIndex = originalUrl.indexOf("/upload/");
  if (uploadIndex === -1) return originalUrl;

  const baseUrl = originalUrl.substring(0, uploadIndex);
  const resourceUrl = originalUrl.substring(uploadIndex + "/upload/".length);

  const isVideo =
    resourceUrl.includes("/video/upload/") ||
    resourceUrl.match(/\.(mp4|webm|ogg)$/i);

  let transformation = "";
  if (isVideo) {
    switch (type) {
      case "thumbnail":
        transformation = "w_400,h_300,c_fill,q_auto,so_1,f_jpg/";
        break;
      case "full":
        transformation = "w_1200,q_auto/";
        break;
      default:
        return originalUrl;
    }
  } else {
    switch (type) {
      case "thumbnail":
        transformation = "w_400,h_300,c_fill,q_auto,f_auto/";
        break;
      case "full":
        transformation = "w_1200,q_auto,f_auto/";
        break;
      default:
        return originalUrl;
    }
  }

  return `${baseUrl}/upload/${transformation}${resourceUrl}`;
};

export const getVideoThumbnail = (videoUrl) => {
  if (!videoUrl) return null;

  const uploadIndex = videoUrl.indexOf("/upload/");
  if (uploadIndex === 1) return videoUrl;

  const baseUrl = videoUrl.substring(0, uploadIndex);
  const resourceUrl = videoUrl.substring(uploadIndex + "/upload/".length);

  return `${baseUrl}/upload/w_400,h_300,c_fill,q_auto,so_1,f_jpg/${resourceUrl}`;
};
