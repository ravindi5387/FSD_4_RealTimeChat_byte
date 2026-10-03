import { useEffect, useMemo, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ChatHeader } from '../components/ChatHeader';
import { ChatSidebar } from '../components/ChatSidebar';
import { MessageBubble } from '../components/MessageBubble';
import { MessageComposer } from '../components/MessageComposer';
import { getMessages, getRooms, SOCKET_URL } from '../services/api';
import type { Message, Room, User } from '../types';

export function ChatPage({ token, user, onLogout }: { token: string; user: User; onLogout: () => void }) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<number>(1);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineCount, setOnlineCount] = useState(1);
  const [typingUser, setTypingUser] = useState('');
  const [connection, setConnection] = useState<'connecting' | 'connected' | 'offline'>('connecting');
  const [error, setError] = useState('');
  const socketRef = useRef<Socket | null>(null);
  const selectedRoom = useMemo(() => rooms.find((room) => room.id === selectedRoomId), [rooms, selectedRoomId]);

  useEffect(() => {
    let alive = true;
    getRooms(token).then((result) => {
      if (!alive) return;
      setRooms(result.rooms);
      if (result.rooms[0]) setSelectedRoomId(result.rooms[0].id);
    }).catch((err) => setError(err instanceof Error ? err.message : 'Unable to load rooms'));
    return () => { alive = false; };
  }, [token]);

  useEffect(() => {
    let mounted = true;
    getMessages(token, selectedRoomId)
      .then((result) => mounted && setMessages(result.messages))
      .catch((err) => mounted && setError(err instanceof Error ? err.message : 'Unable to load history'));
    return () => { mounted = false; };
  }, [token, selectedRoomId]);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnection('connected');
      setError('');
      socket.emit('join_room', { roomId: selectedRoomId }, (response: { ok: boolean; message?: string }) => {
        if (!response.ok) setError(response.message || 'Could not join room');
      });
    });

    socket.on('connect_error', (err) => {
      setConnection('offline');
      setError(err.message || 'Real-time connection failed');
    });
    socket.on('disconnect', () => setConnection('offline'));
    socket.on('receive_message', (message: Message) => {
      if (message.room_id === selectedRoomId) setMessages((current) => [...current, message]);
    });
    socket.on('presence_update', ({ roomId, onlineCount: count }: { roomId: number; onlineCount: number }) => {
      if (roomId === selectedRoomId) setOnlineCount(count);
    });
    socket.on('typing_start', ({ roomId, userName }: { roomId: number; userName: string }) => {
      if (roomId === selectedRoomId && userName !== user.name) setTypingUser(userName);
    });
    socket.on('typing_stop', ({ roomId, userName }: { roomId: number; userName: string }) => {
      if (roomId === selectedRoomId && userName !== user.name) setTypingUser('');
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, selectedRoomId, user.name]);

  function changeRoom(roomId: number) {
    setTypingUser('');
    setError('');
    setMessages([]);
    setSelectedRoomId(roomId);
  }

  function sendMessage(text: string) {
    if (!socketRef.current || !socketRef.current.connected) {
      setError('Real-time connection is offline. Please wait a moment and try again.');
      return;
    }
    socketRef.current.emit('send_message', { roomId: selectedRoomId, message: text }, (response: { ok: boolean; message?: string }) => {
      if (!response.ok) setError(response.message || 'Message failed');
    });
  }

  function setTyping(typing: boolean) {
    socketRef.current?.emit(typing ? 'typing_start' : 'typing_stop', { roomId: selectedRoomId });
  }

  return (
    <div className="chat-app">
      <ChatSidebar user={user} rooms={rooms} selectedRoomId={selectedRoomId} onRoomChange={changeRoom} onLogout={onLogout} />
      <main className="chat-main">
        <ChatHeader room={selectedRoom} onlineCount={onlineCount} />
        <div className="connection-strip">
          <span className={`connection-dot ${connection}`} />
          {connection === 'connected' ? 'Live connection active' : connection === 'connecting' ? 'Connecting to chat…' : 'Reconnecting…'}
          {error && <span className="connection-error">{error}</span>}
        </div>
        <section className="messages-panel">
          {messages.length === 0 ? (
            <div className="empty-chat"><div className="empty-icon">✦</div><h2>Start the conversation</h2><p>Messages you send here are delivered in real time and stored for chat history.</p></div>
          ) : (
            <div className="messages-list">
              {messages.map((message) => <MessageBubble key={message.id} message={message} own={message.sender_id === user.id} />)}
              {typingUser && <div className="typing-indicator"><span>{typingUser} is typing</span><i /><i /><i /></div>}
            </div>
          )}
        </section>
        <MessageComposer onSend={sendMessage} onTyping={setTyping} />
      </main>
    </div>
  );
}
