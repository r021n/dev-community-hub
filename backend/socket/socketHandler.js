const { Server } = require("socket.io");
const {
  setSocketInstance,
  getOnlineUsers,
} = require("../middleware/attachSocketMiddleware");

function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  setSocketInstance(io);

  let onlineUsers = getOnlineUsers();

  io.on("connection", (socket) => {
    console.log("Seseorang terhubung:", socket.id);

    socket.on("addUser", (userId) => {
      onlineUsers[userId] = socket.id;
      console.log(`User ${userId} online dengan socket ${socket.id}`);
    });

    socket.on("disconnect", () => {
      for (const userId in onlineUsers) {
        if (onlineUsers[userId] === socket.id) {
          delete onlineUsers[userId];
          break;
        }
      }
      console.log(`Socket ${socket.id} terputus`);
    });
  });
}

module.exports = { initSocket };
