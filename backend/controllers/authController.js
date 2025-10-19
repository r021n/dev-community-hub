const authService = require("../services/authService");

const register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username dan password diperlukan" });
  }

  try {
    const user = await authService.registerUser(username, password);
    res.status(201).json({ message: "Register berhasil", user });
  } catch (err) {
    res.status(500).json({
      message: "Username sudah digunakan atau server sedang bermasalah",
    });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const token = await authService.loginUser(username, password);
    res.status(200).json({ token: token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports = { register, login };
