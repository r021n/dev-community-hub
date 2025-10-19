const express = require("express");
const app = express();
const port = 3001;
const postRoutes = require("./routes/postRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

// Middleware untuk mengatasi CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Izinkan semua asal
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

// Middleware agar bisa baca JSON
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Halo dari Backend Dev Community Hub!");
});

app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
