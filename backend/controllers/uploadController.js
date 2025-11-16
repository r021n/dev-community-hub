const uploadImage = (req, res) => {
  if (!req.file)
    return res.status(400).json({ message: "Tidak ada file yang diunggah" });

  return res.status(200).json({ imageUrl: req.file.path });
};

const uploadVideo = (req, res) => {
  if (!req.file)
    return res.status(400).json({ message: "Tidak ada video yang diunggah" });

  return res.status(200).json({ videoUrl: req.file.path });
};

module.exports = { uploadImage, uploadVideo };
