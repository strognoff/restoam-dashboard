import { spawn } from 'node:child_process';
import path from 'node:path';

const ROOT = process.cwd();
const WORKSPACE = path.resolve(ROOT, '..');

const services = [
  { name: 'dashboard', cwd: path.join(WORKSPACE, 'restoam-dashboard'), cmd: 'npm', args: ['run', 'dev', '--', '--host', '127.0.0.1', '--port', '5176'] },
  { name: 'asset-fe', cwd: path.join(WORKSPACE, 'restoam-asset-fe'), cmd: 'npm', args: ['run', 'dev', '--', '--host', '127.0.0.1', '--port', '5173'] },
  { name: 'location-fe', cwd: path.join(WORKSPACE, 'restoam-location-fe'), cmd: 'npm', args: ['run', 'dev', '--', '--host', '127.0.0.1', '--port', '5174'] },
  { name: 'workorders-fe', cwd: path.join(WORKSPACE, 'restoam-workorders-fe'), cmd: 'npm', args: ['run', 'dev', '--', '--host', '127.0.0.1', '--port', '5175'] },
];

const children = [];

const prefix = (name, data) => {
  const lines = data.toString().split('\n').filter(Boolean);
  for (const line of lines) {
    process.stdout.write(`[${name}] ${line}\n`);
  }
};

for (const svc of services) {
  const child = spawn(svc.cmd, svc.args, {
    cwd: svc.cwd,
    env: { ...process.env },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  child.stdout.on('data', (d) => prefix(svc.name, d));
  child.stderr.on('data', (d) => prefix(svc.name, d));
  child.on('exit', (code) => {
    process.stdout.write(`[${svc.name}] exited with code ${code}\n`);
  });
  children.push(child);
}

process.stdout.write('Started frontend services. Press Ctrl+C to stop all.\n');
process.stdout.write('Dashboard:  http://127.0.0.1:5176\n');
process.stdout.write('Assets:     http://127.0.0.1:5173\n');
process.stdout.write('Locations:  http://127.0.0.1:5174\n');
process.stdout.write('Workorders: http://127.0.0.1:5175\n');
process.stdout.write('Backends expected on 8080/8081/8082\n');

const shutdown = () => {
  for (const c of children) c.kill('SIGTERM');
  setTimeout(() => process.exit(0), 300);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
