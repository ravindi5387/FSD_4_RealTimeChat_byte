import { useState } from 'react';
import { ArrowRight, LockKeyhole, Mail, MessageCircle, UserRound } from 'lucide-react';
import { AuthShell } from '../components/AuthShell';
import { loginUser, registerUser } from '../services/api';
import type { User } from '../types';

interface AuthPageProps {
  onAuthenticated: (token: string, user: User) => void;
}

export function AuthPage({ onAuthenticated }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  async function submit() {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      if (mode === 'register') {
        await registerUser({ name, email, password });
        setNotice('Account created. You can sign in now.');
        setMode('login');
        setPassword('');
      } else {
        const result = await loginUser({ email, password });
        onAuthenticated(result.token, result.user);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell>
      <div className="auth-heading-row">
        <div>
          <p className="eyebrow">SECURE USER ACCESS</p>
          <h1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
          <p className="auth-copy">
            {mode === 'login'
              ? 'Sign in to continue to your real-time workspace.'
              : 'Create an account to join live conversations.'}
          </p>
        </div>
        <div className="auth-icon"><MessageCircle size={20} /></div>
      </div>

      {mode === 'register' && (
        <label className="field">
          <span>Full name</span>
          <div className="input-wrap"><UserRound size={17} /><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ravindi Perera" /></div>
        </label>
      )}

      <label className="field">
        <span>Email address</span>
        <div className="input-wrap"><Mail size={17} /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></div>
      </label>

      <label className="field">
        <span>Password</span>
        <div className="input-wrap"><LockKeyhole size={17} /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" /></div>
      </label>

      {error && <div className="alert alert-error">{error}</div>}
      {notice && <div className="alert alert-success">{notice}</div>}

      <button className="primary-button" onClick={submit} disabled={busy || !email || !password || (mode === 'register' && !name.trim())}>
        {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
        <ArrowRight size={17} />
      </button>

      <button className="text-button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setNotice(''); }}>
        {mode === 'login' ? 'New here? Create an account' : 'Already have an account? Sign in'}
      </button>
    </AuthShell>
  );
}
