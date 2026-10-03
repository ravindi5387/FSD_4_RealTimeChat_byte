export interface ChatRoom {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export interface ChatMessage {
  id: number;
  room_id: number;
  sender_id: number;
  sender_name: string;
  message: string;
  created_at: string;
}
