import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

// Use a persistent SQLite file. On Pterodactyl the working dir is /home/container.
const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const DB_PATH = process.env.DATABASE_PATH || path.join(DATA_DIR, 'nova_vault.db');

// Ensure data directory exists so the DB file persists.
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const db = new DatabaseSync(DB_PATH);

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nova_id TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    encrypted_password TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    tag TEXT NOT NULL DEFAULT 'GENERAL',
    notes TEXT DEFAULT '',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    last_used_at TEXT
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'WORKER',
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
  );
`);

export function nowIso(): string {
  return new Date().toISOString();
}

