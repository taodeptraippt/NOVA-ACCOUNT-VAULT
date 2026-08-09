// NOVA ACCOUNT VAULT — Pterodactyl panel main file
// Builds Next.js (if needed) and starts the production server.
// Panel command uses: node server.js

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// AUTO-SYNC FROM GITHUB (Pterodactyl/Pikamc panel)
// Skip auto-sync when the container is not a git checkout.
if (process.env.AUTO_SYNC !== '0') {
  const gitDir = path.join(__dirname, '.git');
  if (fs.existsSync(gitDir)) {
    try {
      console.log('[server.js] Syncing code from GitHub (git fetch + reset --hard)...');
      execSync('git fetch origin', { stdio: 'inherit', cwd: __dirname });
      execSync('git reset --hard origin/main', { stdio: 'inherit', cwd: __dirname });
      console.log('[server.js] Code synced to origin/main.');
    } catch (err) {
      console.warn('[server.js] Git sync failed (continuing anyway):', err.message);
    }
  } else {
    console.warn('[server.js] No .git directory found; skipping Git auto-sync.');
  }
}

const PORT = process.env.SERVER_PORT || process.env.PORT || 3000;
const HOST = process.env.SERVER_IP || '0.0.0.0';
const NEXT_BIN = path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next');

process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.CI = process.env.CI || '1';
process.env.NEXT_PRIVATE_BUILD_WORKER = process.env.NEXT_PRIVATE_BUILD_WORKER || '1';
process.env.NEXT_DISABLE_ESLINT = process.env.NEXT_DISABLE_ESLINT || '1';

const nextDir = path.join(__dirname, '.next');
if (!fs.existsSync(nextDir) || !fs.existsSync(path.join(nextDir, 'BUILD_ID'))) {
  console.log('[server.js] No production build found. Running `next build` with reduced concurrency...');
  const buildEnv = {
    ...process.env,
    CI: '1',
    NEXT_PRIVATE_BUILD_WORKER: '1',
    NEXT_DISABLE_ESLINT: '1',
    NEXT_TELEMETRY_DISABLED: '1',
  };
  execSync(`node "${NEXT_BIN}" build`, { stdio: 'inherit', cwd: __dirname, env: buildEnv });
}

console.log(`[server.js] Starting Next.js on ${HOST}:${PORT}`);
const child = spawn(
  'node',
  [NEXT_BIN, 'start', '-H', HOST, '-p', String(PORT)],
  { stdio: 'inherit', cwd: __dirname }
);

child.on('exit', (code) => {
  console.log(`[server.js] Next.js exited with code ${code}`);
  process.exit(code || 0);
});

process.on('SIGINT', () => child.kill('SIGINT'));
process.on('SIGTERM', () => child.kill('SIGTERM'));
