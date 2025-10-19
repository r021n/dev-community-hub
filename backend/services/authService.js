const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (username, password) => {
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // simpan user
  const { rows } = await db.query(
    "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
    [username, passwordHash]
  );
  return rows[0];
};

const loginUser = async (username, password) => {
  const { rows } = await db.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  const user = rows[0];

  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Password tidak valid");
  }

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return token;
};

module.exports = {
  registerUser,
  loginUser,
};
