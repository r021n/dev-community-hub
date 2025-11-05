const express = require("express");
const corsConfig = require("./config/corsConfig");
const { attachSocket } = require("./middleware/attachSocketMiddleware");

const postRoutes = require("./routes/postRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Middleware
app.use(corsConfig);
app.use(express.json());
app.use(attachSocket);

// Routes
app.get("/", (req, res) => {
  res.send("Halo dari Backend Dev Community Hub!");
});
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

module.exports = app;
