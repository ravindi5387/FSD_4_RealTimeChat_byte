import type { Message, Room, User } from '../types';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
export const SOCKET_URL = API_URL.replace(/\/api$/, '');

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data as T;
}

export async function registerUser(payload: { name: string; email: string; password: string }) {
  return request<{ message: string; user: User }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function loginUser(payload: { email: string; password: string }) {
  return request<{ message: string; token: string; user: User }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function getMe(token: string) {
  return request<{ user: User }>('/auth/me', {}, token);
}

export async function getRooms(token: string) {
  return request<{ rooms: Room[] }>('/chat/rooms', {}, token);
}

export async function getMessages(token: string, roomId: number) {
  return request<{ messages: Message[] }>(`/chat/rooms/${roomId}/messages`, {}, token);
}
