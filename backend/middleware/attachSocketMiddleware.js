let io;
let onlineUsers = {};

function attachSocket(req, res, next) {
  req.io = io;
  req.getSocketId = (userId) => onlineUsers[userId];
  next();
}

function setSocketInstance(socketIo) {
  io = socketIo;
}

function getOnlineUsers() {
  return onlineUsers;
}

module.exports = { attachSocket, setSocketInstance, getOnlineUsers };
