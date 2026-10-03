import http from 'http';
import { Server } from 'socket.io';
import { app } from './app';
import { env } from './config/env';
import { pool } from './config/db';
import { registerChatSocket, socketCors } from './sockets/chatSocket';

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: socketCors,
  transports: ['websocket', 'polling']
});

registerChatSocket(io);

async function start() {
  await pool.query('SELECT 1');
  httpServer.listen(env.port, '0.0.0.0', () => {
    console.log(`Real-time Chat API running on http://localhost:${env.port}`);
    console.log(`Socket.IO endpoint: ws://localhost:${env.port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

async function shutdown(signal: string) {
  console.log(`${signal} received. Shutting down...`);
  io.close();
  await pool.end();
  process.exit(0);
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
