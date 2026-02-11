import net from 'node:net';

const checks = [
  { name: 'Dashboard FE', host: '127.0.0.1', port: 5176 },
  { name: 'Asset FE', host: '127.0.0.1', port: 5173 },
  { name: 'Location FE', host: '127.0.0.1', port: 5174 },
  { name: 'Workorders FE', host: '127.0.0.1', port: 5175 },
  { name: 'Asset API', host: '127.0.0.1', port: 8080 },
  { name: 'Location API', host: '127.0.0.1', port: 8081 },
  { name: 'Workorders API', host: '127.0.0.1', port: 8082 },
  { name: 'Postgres', host: '127.0.0.1', port: 5432 },
];

function canConnect(host, port, timeoutMs = 800) {
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

let failures = 0;
for (const item of checks) {
  const ok = await canConnect(item.host, item.port);
  console.log(`${ok ? '✅' : '❌'} ${item.name} (${item.host}:${item.port})`);
  if (!ok) failures += 1;
}

if (failures > 0) process.exit(1);
