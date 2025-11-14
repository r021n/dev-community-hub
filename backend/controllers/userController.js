const userService = require("../services/userService");

const getProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const profile = await userService.getUserById(userId);

    if (!profile) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.status(200).json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error saat mengambil profil" });
  }
};

const getPublicProfile = async (req, res) => {
  const { username } = req.params;
  const page = parseInt(req.query.page) || 1;

  try {
    const profile = await userService.getUserProfileByUsername(username, page);

    if (!profile) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error saat mengambil profile" });
  }
};

module.exports = { getProfile, getPublicProfile };
