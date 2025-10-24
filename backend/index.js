const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const port = 3001;
const postRoutes = require("./routes/postRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

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

app.use((req, res, next) => {
  req.io = io;
  next();
});

let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("Seseorang telah terhubung: ", socket.id);

  socket.on("addUser", (userId) => {
    onlineUsers[userId] = socket.id;
    console.log(`User ${userId} online dengan id socket ${socket.id}`);
  });

  socket.on("disconnect", () => {
    for (const userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
        break;
      }
    }
    console.log(
      `Seorang pengguna dengan socket id ${socket.id} telah terputus`
    );
  });
});

app.use((req, res, next) => {
  req.getSocketId = (userId) => onlineUsers[userId];
  next();
});

app.get("/", (req, res) => {
  res.send("Halo dari Backend Dev Community Hub!");
});
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

server.listen(port, () => {
  console.log(`Server dengan socket.io berjalan di http://localhost:${port}`);
});
