import { Paperclip, Send, Smile } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function MessageComposer({ onSend, onTyping }: { onSend: (text: string) => void; onTyping: (typing: boolean) => void }) {
  const [value, setValue] = useState('');
  const typingTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(typingTimer.current), []);

  function change(next: string) {
    setValue(next);
    onTyping(Boolean(next.trim()));
    window.clearTimeout(typingTimer.current);
    typingTimer.current = window.setTimeout(() => onTyping(false), 1200);
  }

  function send() {
    const text = value.trim();
    if (!text) return;
    onSend(text);
    setValue('');
    onTyping(false);
  }

  return (
    <div className="composer-wrap">
      <div className="composer">
        <button className="composer-icon" aria-label="Attachment"><Paperclip size={18} /></button>
        <input value={value} maxLength={1000} onChange={(e) => change(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder="Write a message…" />
        <button className="composer-icon" aria-label="Emoji"><Smile size={18} /></button>
        <button className="send-button" onClick={send} aria-label="Send message"><Send size={17} /></button>
      </div>
      <div className="composer-hint">Enter to send • Messages are limited to 1,000 characters</div>
    </div>
  );
}
