const http = require("http");
const app = require("./app");
const { initSocket } = require("./socket/socketHandler");
const { port } = require("./config/serverConfig");

const server = http.createServer(app);

initSocket(server);

server.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
