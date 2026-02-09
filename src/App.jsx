import { useEffect, useState } from 'react'
import './App.css'

const ASSETS_URL = import.meta.env.VITE_ASSETS_URL || 'http://localhost:5173'
const LOCATIONS_URL = import.meta.env.VITE_LOCATIONS_URL || 'http://localhost:5174'
const WORKORDERS_URL = import.meta.env.VITE_WORKORDERS_URL || 'http://localhost:5175'
const ADMIN_USER = import.meta.env.VITE_ADMIN_USER || 'admin'
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS || 'admin'
const SESSION_KEY = 'restoam_session'

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      const session = { user: username, createdAt: Date.now() }
      localStorage.setItem(SESSION_KEY, JSON.stringify(session))
      onLogin(session)
      return
    }
    setError('Invalid credentials')
  }

  return (
    <div className="login-shell">
      <div className="login-card">
        <h1>RestoAM Login</h1>
        <p className="muted">Sign in to access the dashboard.</p>
        <form onSubmit={handleSubmit}>
          <label className="field">
            <span>Username</span>
            <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
          </label>
          <label className="field">
            <span>Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </label>
          {error && <div className="error">{error}</div>}
          <button className="btn primary" type="submit">Sign in</button>
        </form>
      </div>
    </div>
  )
}

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    const raw = localStorage.getItem(SESSION_KEY)
    if (raw) {
      try {
        setSession(JSON.parse(raw))
      } catch {
        localStorage.removeItem(SESSION_KEY)
      }
    }
  }, [])

  if (!session) {
    return <Login onLogin={setSession} />
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">RestoAM Dashboard</div>
        <nav className="nav">
          <a href={ASSETS_URL}>Assets</a>
          <a href={LOCATIONS_URL}>Locations</a>
          <a href={WORKORDERS_URL}>Workorders</a>
          <button className="btn ghost" onClick={() => { localStorage.removeItem(SESSION_KEY); setSession(null) }}>Sign out</button>
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
  )
}

export default App
