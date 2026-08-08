// NOVA ACCOUNT VAULT — Pterodactyl panel main file
// Builds Next.js (if needed) and starts the production server.
// Panel command uses: node server.js
//
// IMPORTANT: We invoke the Next.js CLI directly via `node` (e.g.
// `node node_modules/next/dist/bin/next`) instead of `npx next`.
// On Pterodactyl the `node_modules/.bin/next` shim may lack the
// executable bit, causing "Permission denied" / exit 127. Calling the
// CLI through `node` avoids relying on that file's permissions.

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// On Pterodactyl the allocated external port is exposed via SERVER_PORT.
// Prefer SERVER_PORT, then PORT, then default 3000.
const PORT = process.env.SERVER_PORT || process.env.PORT || 3000;
const HOST = process.env.SERVER_IP || '0.0.0.0';

// Path to the Next.js CLI entry (present after `npm install`).
const NEXT_BIN = path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next');

// Disable telemetry to reduce noise/overhead.
process.env.NEXT_TELEMETRY_DISABLED = '1';

// Ensure a .next build exists; if not, build it first.
//
// TIP: On low-RAM Pterodactyl containers, `next build` can fail with
// "spawn /usr/local/bin/node EAGAIN" because it forks one worker per CPU.
// The most reliable fix is to BUILD LOCALLY and upload the `.next` folder
// together with the source (and keep it in the archive/File Manager). When
// `.next` exists, this block is skipped entirely, so the panel just starts
// the prebuilt app without doing a heavy build.
const nextDir = path.join(__dirname, '.next');
if (!fs.existsSync(nextDir) || !fs.existsSync(path.join(nextDir, 'BUILD_ID'))) {
  console.log('[server.js] No production build found. Running `next build`...');
  execSync(`node "${NEXT_BIN}" build`, { stdio: 'inherit', cwd: __dirname });
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

