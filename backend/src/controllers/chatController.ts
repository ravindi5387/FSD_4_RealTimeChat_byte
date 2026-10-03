import { Response } from 'express';
import { pool } from '../config/db';
import { AuthenticatedRequest } from '../types/auth';
import { ChatMessage } from '../types/chat';

export async function listRooms(_req: AuthenticatedRequest, res: Response) {
  try {
    const result = await pool.query(
      'SELECT id, name, description, created_at FROM chat_rooms ORDER BY id ASC'
    );
    return res.status(200).json({ rooms: result.rows });
  } catch (error) {
    console.error('List rooms error:', error);
    return res.status(500).json({ message: 'Unable to load chat rooms' });
  }
}

export async function getMessages(req: AuthenticatedRequest, res: Response) {
  const roomId = Number(req.params.roomId);
  if (!Number.isInteger(roomId) || roomId < 1) {
    return res.status(400).json({ message: 'Invalid room id' });
  }

  try {
    const room = await pool.query('SELECT id FROM chat_rooms WHERE id = $1', [roomId]);
    if (room.rowCount !== 1) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const result = await pool.query<ChatMessage>(
      `SELECT m.id, m.room_id, m.sender_id,
              u.name AS sender_name,
              m.message, m.created_at
       FROM chat_messages m
       INNER JOIN users u ON u.id = m.sender_id
       WHERE m.room_id = $1
       ORDER BY m.created_at ASC
       LIMIT 200`,
      [roomId]
    );

    return res.status(200).json({ messages: result.rows });
  } catch (error) {
    console.error('Get messages error:', error);
    return res.status(500).json({ message: 'Unable to load chat history' });
  }
}
