import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  const raw = fs.readFileSync(filePath, 'utf8');
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx <= 0) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

const ROOT = process.cwd();
const WORKSPACE = path.resolve(ROOT, '..');
loadDotEnv(path.join(ROOT, '.env'));

const repos = [
  'restoam-dashboard',
  'restoam-asset-fe',
  'restoam-location-fe',
  'restoam-workorders-fe',
  'restoam-asset',
  'restoam-location',
  'restoam-workorders',
];

const ports = [
  { name: 'Dashboard FE', port: 5176 },
  { name: 'Asset FE', port: 5173 },
  { name: 'Location FE', port: 5174 },
  { name: 'Workorders FE', port: 5175 },
  { name: 'Asset API', port: 8080 },
  { name: 'Location API', port: 8081 },
  { name: 'Workorders API', port: 8082 },
];

const envRequired = [
  'VITE_ASSETS_URL',
  'VITE_LOCATIONS_URL',
  'VITE_WORKORDERS_URL',
  'VITE_ADMIN_USER',
  'VITE_ADMIN_PASS',
];

function canConnect(port, host = '127.0.0.1', timeoutMs = 500) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let done = false;

    const finish = (ok) => {
      if (done) return;
      done = true;
      socket.destroy();
      resolve(ok);
    };

    socket.setTimeout(timeoutMs);
    socket.once('connect', () => finish(true));
    socket.once('timeout', () => finish(false));
    socket.once('error', () => finish(false));
    socket.connect(port, host);
  });
}

(async () => {
  let failed = false;

  console.log('== RestoAM stack preflight ==');

  console.log('\n[repos]');
  for (const repo of repos) {
    const p = path.join(WORKSPACE, repo);
    const ok = fs.existsSync(p);
    console.log(`${ok ? '✅' : '❌'} ${repo} ${ok ? '' : '(missing)'}`);
    if (!ok) failed = true;
  }

  console.log('\n[dashboard env]');
  for (const key of envRequired) {
    const ok = Boolean(process.env[key]);
    console.log(`${ok ? '✅' : '⚠️ '} ${key}${ok ? '' : ' (not set; defaults may apply)'}`);
  }

  console.log('\n[port availability]');
  for (const item of ports) {
    const inUse = await canConnect(item.port);
    console.log(`${inUse ? '⚠️ ' : '✅'} ${item.name} :${item.port} ${inUse ? '(already in use)' : '(free)'}`);
  }

  console.log('\n[backend reachability]');
  for (const api of ports.slice(4)) {
    const up = await canConnect(api.port);
    console.log(`${up ? '✅' : '❌'} ${api.name} :${api.port} ${up ? 'reachable' : 'not reachable'}`);
  }

  if (failed) {
    console.error('\nPreflight failed: one or more required repositories are missing.');
    process.exit(1);
  }

  console.log('\nPreflight complete.');
})();
