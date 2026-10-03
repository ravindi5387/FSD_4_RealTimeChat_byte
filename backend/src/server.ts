import http from "node:http";
import { app } from "./app";
import { Server } from "socket.io";
import { socketCors, registerChatSocket } from "./sockets/chatSocket";

const server = http.createServer(app);

const io = new Server(server, {
  cors: socketCors,
  transports: ["websocket", "polling"],
});

registerChatSocket(io);

const port = Number(process.env.PORT || 5000);

server.listen(port, "0.0.0.0", () => {
  console.log(`Real-time Chat API running on http://localhost:${port}`);
});

export default server;
