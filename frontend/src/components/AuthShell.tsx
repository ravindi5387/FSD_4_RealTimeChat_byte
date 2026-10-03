import type { ReactNode } from 'react';

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="auth-shell">
      <div className="auth-brand-mark">P</div>
      <div className="auth-brand">PulseChat</div>
      <div className="auth-tagline">Secure conversations. Delivered instantly.</div>
      <div className="auth-card">{children}</div>
      <div className="auth-footer">AVIP 2026 • Real-Time Chat Application</div>
    </div>
  );
}
