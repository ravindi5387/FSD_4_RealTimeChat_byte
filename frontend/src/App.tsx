import { useState } from 'react';
import { AuthPage } from './pages/AuthPage';
import { ChatPage } from './pages/ChatPage';
import type { User } from './types';
import './styles.css';

const TOKEN_KEY = 'pulsechat_token';
const USER_KEY = 'pulsechat_user';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) as User : null;
  });

  function authenticated(nextToken: string, nextUser: User) {
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken('');
    setUser(null);
  }

  return token && user
    ? <ChatPage token={token} user={user} onLogout={logout} />
    : <AuthPage onAuthenticated={authenticated} />;
}

export default App;
