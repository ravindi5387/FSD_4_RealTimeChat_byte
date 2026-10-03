import { Hash, MoreHorizontal, UsersRound } from 'lucide-react';
import type { Room } from '../types';

export function ChatHeader({ room, onlineCount }: { room?: Room; onlineCount: number }) {
  return (
    <header className="chat-header">
      <div>
        <div className="room-title"><Hash size={18} /> {room?.name ?? 'General'}</div>
        <div className="room-description">{room?.description ?? 'Live conversation'}</div>
      </div>
      <div className="header-actions">
        <div className="online-pill"><span className="online-dot" /> <UsersRound size={15} /> {onlineCount} online</div>
        <button className="icon-button" aria-label="More options"><MoreHorizontal size={18} /></button>
      </div>
    </header>
  );
}
