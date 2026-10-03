import { Server, Socket } from 'socket.io';
import { z } from 'zod';
import { pool } from '../config/db';
import { env } from '../config/env';
import { verifyToken } from '../utils/jwt';

interface SocketUser {
  id: number;
  name: string;
  email: string;
}

interface AuthenticatedSocket extends Socket {
  user?: SocketUser;
}

const roomSchema = z.object({ roomId: z.coerce.number().int().positive() });
const sendMessageSchema = z.object({
  roomId: z.coerce.number().int().positive(),
  message: z.string().trim().min(1).max(1000)
});

async function roomExists(roomId: number) {
  const result = await pool.query('SELECT id FROM chat_rooms WHERE id = $1', [roomId]);
  return result.rowCount === 1;
}

export function registerChatSocket(io: Server) {
  io.use((socket: AuthenticatedSocket, next) => {
    try {
      const authToken = typeof socket.handshake.auth?.token === 'string'
        ? socket.handshake.auth.token
        : '';
      const header = socket.handshake.headers.authorization ?? '';
      const token = authToken || (header.startsWith('Bearer ') ? header.slice(7) : '');

      if (!token) return next(new Error('Authentication required'));
      const payload = verifyToken(token);
      const id = Number(payload.sub);
      if (!Number.isInteger(id)) return next(new Error('Invalid token'));

      socket.user = { id, name: payload.name, email: payload.email };
      next();
    } catch {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (rawSocket) => {
    const socket = rawSocket as AuthenticatedSocket;
    const user = socket.user!;

    socket.emit('connected', {
      userId: user.id,
      message: 'Connected to real-time chat'
    });

    socket.on('join_room', async (payload, ack) => {
      const parsed = roomSchema.safeParse(payload);
      if (!parsed.success || !(await roomExists(parsed.data.roomId))) {
        return ack?.({ ok: false, message: 'Invalid or unknown room' });
      }

      const roomId = parsed.data.roomId;
      socket.join(`room:${roomId}`);
      socket.to(`room:${roomId}`).emit('user_joined', {
        userId: user.id,
        userName: user.name,
        roomId
      });

      const socketsInRoom = await io.in(`room:${roomId}`).fetchSockets();
      io.to(`room:${roomId}`).emit('presence_update', {
        roomId,
        onlineCount: socketsInRoom.length
      });

      ack?.({ ok: true, roomId });
    });

    socket.on('send_message', async (payload, ack) => {
      const parsed = sendMessageSchema.safeParse(payload);
      if (!parsed.success) {
        return ack?.({ ok: false, message: 'Message must be 1-1000 characters and include a valid room id' });
      }

      const { roomId, message } = parsed.data;
      if (!(await roomExists(roomId))) {
        return ack?.({ ok: false, message: 'Room not found' });
      }

      try {
        const result = await pool.query(
          `INSERT INTO chat_messages (room_id, sender_id, message)
           VALUES ($1, $2, $3)
           RETURNING id, room_id, sender_id, message, created_at`,
          [roomId, user.id, message]
        );

        const saved = {
          ...result.rows[0],
          sender_name: user.name
        };
        io.to(`room:${roomId}`).emit('receive_message', saved);
        ack?.({ ok: true, message: saved });
      } catch (error) {
        console.error('Socket message persistence error:', error);
        ack?.({ ok: false, message: 'Message could not be saved' });
      }
    });

    socket.on('typing_start', (payload) => {
      const parsed = roomSchema.safeParse(payload);
      if (parsed.success) {
        socket.to(`room:${parsed.data.roomId}`).emit('typing_start', {
          roomId: parsed.data.roomId,
          userId: user.id,
          userName: user.name
        });
      }
    });

    socket.on('typing_stop', (payload) => {
      const parsed = roomSchema.safeParse(payload);
      if (parsed.success) {
        socket.to(`room:${parsed.data.roomId}`).emit('typing_stop', {
          roomId: parsed.data.roomId,
          userId: user.id,
          userName: user.name
        });
      }
    });

    socket.on('leave_room', async (payload, ack) => {
      const parsed = roomSchema.safeParse(payload);
      if (!parsed.success) return ack?.({ ok: false, message: 'Invalid room id' });
      const roomId = parsed.data.roomId;
      socket.leave(`room:${roomId}`);
      socket.to(`room:${roomId}`).emit('user_left', {
        userId: user.id,
        userName: user.name,
        roomId
      });
      const socketsInRoom = await io.in(`room:${roomId}`).fetchSockets();
      io.to(`room:${roomId}`).emit('presence_update', {
        roomId,
        onlineCount: socketsInRoom.length
      });
      ack?.({ ok: true });
    });

    socket.on('disconnecting', async () => {
      const rooms = Array.from(socket.rooms).filter((room) => room.startsWith('room:'));
      for (const room of rooms) {
        socket.to(room).emit('user_left', {
          userId: user.id,
          userName: user.name
        });
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${user.email}`);
    });
  });
}

export const socketCors = {
  origin: env.clientUrl,
  methods: ['GET', 'POST'],
  credentials: true
};
