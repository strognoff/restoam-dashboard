import './App.css'

const ASSETS_URL = import.meta.env.VITE_ASSETS_URL || 'http://localhost:3000'
const LOCATIONS_URL = import.meta.env.VITE_LOCATIONS_URL || 'http://localhost:3001'
const WORKORDERS_URL = import.meta.env.VITE_WORKORDERS_URL || 'http://localhost:3002'

function App() {
  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">RestoAM Dashboard</div>
        <nav className="nav">
          <a href={ASSETS_URL}>Assets</a>
          <a href={LOCATIONS_URL}>Locations</a>
          <a href={WORKORDERS_URL}>Workorders</a>
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
