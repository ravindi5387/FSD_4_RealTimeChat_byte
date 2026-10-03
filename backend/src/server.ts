import http from "node:http";
import { Server } from "socket.io";

import { app } from "./app";
import { socketCors, registerChatSocket } from "./sockets/chatSocket";

const server = http.createServer(app);

const io = new Server(server, {
  cors: socketCors,
  transports: ["websocket", "polling"],
});

registerChatSocket(io);

export default server;
