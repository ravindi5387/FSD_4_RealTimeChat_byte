import type { Message } from '../types';

export function MessageBubble({ message, own }: { message: Message; own: boolean }) {
  const time = new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <div className={`message-row ${own ? 'own' : ''}`}>
      {!own && <div className="message-avatar">{message.sender_name.slice(0, 1).toUpperCase()}</div>}
      <div className="message-content">
        {!own && <div className="sender-line"><strong>{message.sender_name}</strong><span>{time}</span></div>}
        <div className="message-bubble">{message.message}</div>
        {own && <div className="message-time">{time}</div>}
      </div>
    </div>
  );
}
