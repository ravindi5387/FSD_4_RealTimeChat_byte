import { Hash, LogOut, MessageSquareText, Radio } from 'lucide-react';
import type { Room, User } from '../types';

interface ChatSidebarProps {
  user: User;
  rooms: Room[];
  selectedRoomId: number;
  onRoomChange: (id: number) => void;
  onLogout: () => void;
}

export function ChatSidebar({ user, rooms, selectedRoomId, onRoomChange, onLogout }: ChatSidebarProps) {
  return (
    <aside className="chat-sidebar">
      <div className="sidebar-header">
        <div className="brand-lockup">
          <div className="brand-mark">P</div>
          <div><div className="brand-name">PulseChat</div><div className="brand-sub">Real-time workspace</div></div>
        </div>
        <div className="status-pill"><Radio size={13} /> Live</div>
      </div>

      <div className="user-card">
        <div className="avatar">{user.name.slice(0, 1).toUpperCase()}</div>
        <div className="user-meta"><strong>{user.name}</strong><span>{user.email}</span></div>
      </div>

      <div className="sidebar-section-label">CHANNELS</div>
      <div className="room-list">
        {rooms.map((room) => (
          <button key={room.id} className={`room-item ${selectedRoomId === room.id ? 'active' : ''}`} onClick={() => onRoomChange(room.id)}>
            <Hash size={16} />
            <span>{room.name}</span>
          </button>
        ))}
      </div>

      <div className="sidebar-bottom">
        <div className="mini-info"><MessageSquareText size={16} /><span>Messages are persisted securely.</span></div>
        <button className="logout-button" onClick={onLogout}><LogOut size={16} /> Sign out</button>
      </div>
    </aside>
  );
}
