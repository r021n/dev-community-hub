export const transformCloudinaryUrl = (originalUrl, type = "full") => {
  if (!originalUrl) return null;

  const uploadIndex = originalUrl.indexOf("/upload/");
  if (uploadIndex === -1) return originalUrl;

  const baseUrl = originalUrl.substring(0, uploadIndex);
  const imageUrl = originalUrl.substring(uploadIndex + "/upload/".length);

  let transformation = "";
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

  return `${baseUrl}/upload/${transformation}${imageUrl}`;
};
