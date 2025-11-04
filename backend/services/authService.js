const db = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (username, password) => {
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // simpan user
  const [user] = await db("users")
    .insert({ username, password: passwordHash })
    .returning(["id", "username"]);

  return user;
};

const loginUser = async (username, password) => {
  const user = await db("users").where({ username }).first();

  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Password tidak valid");
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return token;
};

module.exports = {
  registerUser,
  loginUser,
};
