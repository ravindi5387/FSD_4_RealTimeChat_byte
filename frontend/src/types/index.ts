export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Room {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export interface Message {
  id: number;
  room_id: number;
  sender_id: number;
  sender_name: string;
  message: string;
  created_at: string;
}
