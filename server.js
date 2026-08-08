// NOVA ACCOUNT VAULT — Pterodactyl panel main file
// Builds Next.js (if needed) and starts the production server.
// Panel command uses: node server.js

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// Ensure a .next build exists; if not, build it first.
const nextDir = path.join(__dirname, '.next');
if (!fs.existsSync(nextDir) || !fs.existsSync(path.join(nextDir, 'BUILD_ID'))) {
  console.log('[server.js] No production build found. Running `next build`...');
  execSync('npx next build', { stdio: 'inherit', cwd: __dirname });
}

console.log(`[server.js] Starting Next.js on ${HOST}:${PORT}`);
const child = spawn(
  'npx',
  ['next', 'start', '-H', HOST, '-p', String(PORT)],
  { stdio: 'inherit', cwd: __dirname }
);

child.on('exit', (code) => {
  console.log(`[server.js] Next.js exited with code ${code}`);
  process.exit(code || 0);
});

process.on('SIGINT', () => child.kill('SIGINT'));
process.on('SIGTERM', () => child.kill('SIGTERM'));
