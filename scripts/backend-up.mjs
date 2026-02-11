import { spawnSync } from 'node:child_process';

const checks = [
  { name: 'docker', cmd: 'docker', args: ['--version'] },
  { name: 'java', cmd: 'java', args: ['-version'] },
  { name: 'gradle-wrapper (asset)', cmd: 'bash', args: ['-lc', 'cd ../restoam-asset && test -x ./gradlew'] },
];

let ok = true;
for (const c of checks) {
  const r = spawnSync(c.cmd, c.args, { encoding: 'utf8' });
  if (r.status === 0) {
    console.log(`✅ ${c.name}`);
  } else {
    ok = false;
    console.log(`❌ ${c.name} not available`);
  }
}

if (!ok) {
  console.log('\nCannot start backends on this host yet. Install Docker or Java 15+ to proceed.');
  process.exit(1);
}

console.log('\nPrereqs OK. Start commands:');
console.log('Asset API:      cd ../restoam-asset && ./gradlew bootRun --args="--server.port=8080"');
console.log('Location API:   cd ../restoam-location && ./gradlew bootRun --args="--server.port=8081"');
console.log('Workorders API: cd ../restoam-workorders && ./gradlew bootRun --args="--server.port=8082"');
