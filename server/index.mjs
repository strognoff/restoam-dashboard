import express from 'express';
import session from 'express-session';
import { config, validateConfig } from './config.mjs';

validateConfig();

const app = express();
app.use(express.json());

function isAuthenticated(req) {
  return Boolean(req.session?.authenticated && req.session?.username);
}

function requireApiAuth(req, res, next) {
  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return next();
}

function requirePageAuth(req, res, next) {
  if (!isAuthenticated(req)) {
    return res.redirect(`${config.dashboardWebUrl}/login`);
  }
  return next();
}

app.use(
  session({
    name: 'restoam.sid',
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: config.isProd,
      maxAge: 8 * 60 * 60 * 1000,
    },
  })
);

app.get('/api/auth/me', (req, res) => {
  if (req.session?.authenticated && req.session?.username) {
    return res.json({ authenticated: true, username: req.session.username });
  }
  return res.json({ authenticated: false });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }

  if (username !== config.adminUsername || password !== config.adminPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  req.session.authenticated = true;
  req.session.username = username;
  return res.status(200).json({ ok: true });
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('restoam.sid');
    res.status(200).json({ ok: true });
  });
});

app.get('/api/dashboard/summary', requireApiAuth, (req, res) => {
  return res.json({ ok: true, username: req.session.username });
});

app.get('/app', requirePageAuth, (_req, res) => {
  return res.redirect(`${config.dashboardWebUrl}/`);
});

app.get('/login', (req, res) => {
  if (isAuthenticated(req)) {
    return res.redirect(`${config.dashboardWebUrl}/`);
  }
  return res.redirect(`${config.dashboardWebUrl}/login`);
});

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'restoam-dashboard-auth', env: config.nodeEnv });
});

app.listen(3001, () => {
  console.log('Dashboard auth API listening on http://127.0.0.1:3001');
});
