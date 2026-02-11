import { useEffect, useState } from 'react';
import './App.css';

const ASSETS_URL = import.meta.env.VITE_ASSETS_URL || 'http://localhost:5173';
const LOCATIONS_URL = import.meta.env.VITE_LOCATIONS_URL || 'http://localhost:5174';
const WORKORDERS_URL = import.meta.env.VITE_WORKORDERS_URL || 'http://localhost:5175';

async function api(path, options = {}) {
  const res = await fetch(path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  let body = {};
  try { body = await res.json(); } catch {}
  if (!res.ok) throw new Error(body?.error || `request failed (${res.status})`);
  return body;
}

function Login({ onLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username: username.trim(), password }),
      });
      onLoggedIn();
    } catch {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-shell">
      <div className="login-card">
        <h1>RestoAM Login</h1>
        <p className="muted">Sign in to access the dashboard.</p>
        <form onSubmit={submit}>
          <label className="field">
            <span>Username</span>
            <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
          </label>
          <label className="field">
            <span>Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </label>
          {error && <div className="error">{error}</div>}
          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Dashboard({ onLogout }) {
  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">RestoAM Dashboard</div>
        <nav className="nav">
          <a href={ASSETS_URL}>Assets</a>
          <a href={LOCATIONS_URL}>Locations</a>
          <a href={WORKORDERS_URL}>Workorders</a>
          <button className="btn ghost" onClick={onLogout}>Sign out</button>
        </nav>
      </header>

      <main className="container">
        <section className="hero">
          <h1>Asset Management, simplified.</h1>
          <p>Navigate across Assets, Locations and Workorders — all mobile‑ready.</p>
          <div className="hero-actions">
            <a className="btn primary" href={ASSETS_URL}>Go to Assets</a>
            <a className="btn" href={WORKORDERS_URL}>View Workorders</a>
          </div>
        </section>

        <section className="grid">
          <div className="card">
            <h3>Assets</h3>
            <p>Create and manage assets with location lookup and value tracking.</p>
            <a href={ASSETS_URL}>Open Assets →</a>
          </div>
          <div className="card">
            <h3>Locations</h3>
            <p>Add sites, addresses, and link assets to each location.</p>
            <a href={LOCATIONS_URL}>Open Locations →</a>
          </div>
          <div className="card">
            <h3>Workorders</h3>
            <p>Plan work, assign assets/locations, and track status.</p>
            <a href={WORKORDERS_URL}>Open Workorders →</a>
          </div>
        </section>
      </main>
    </div>
  );
}

function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const checkAuth = async () => {
    try {
      const me = await api('/api/auth/me');
      setAuthenticated(Boolean(me?.authenticated));
    } catch {
      setAuthenticated(false);
    } finally {
      setAuthChecked(true);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!authChecked) return;
    const onLoginRoute = window.location.pathname === '/login';

    if (authenticated && onLoginRoute) {
      window.history.replaceState({}, '', '/');
    }
    if (!authenticated && !onLoginRoute) {
      window.history.replaceState({}, '', '/login');
    }
  }, [authChecked, authenticated]);

  const handleLoggedIn = async () => {
    await checkAuth();
    window.history.replaceState({}, '', '/');
  };

  const handleLogout = async () => {
    try { await api('/api/auth/logout', { method: 'POST' }); } catch {}
    setAuthenticated(false);
    window.history.replaceState({}, '', '/login');
  };

  if (!authChecked) return <div className="login-shell"><div className="login-card">Loading…</div></div>;

  const onLoginRoute = window.location.pathname === '/login';
  if (!authenticated || onLoginRoute) return <Login onLoggedIn={handleLoggedIn} />;

  return <Dashboard onLogout={handleLogout} />;
}

export default App;
