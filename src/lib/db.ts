import fs from 'node:fs';
import path from 'node:path';

export interface AccountRecord {
  id: number;
  nova_id: string;
  username: string;
  encrypted_password: string;
  status: string;
  tag: string;
  notes: string;
  created_at: string;
  updated_at: string;
  last_used_at: string | null;
}

export interface UserRecord {
  id: number;
  email: string;
  hashed_password: string;
  role: string;
  is_active: number;
  created_at: string;
}

interface VaultStore {
  accounts: AccountRecord[];
  users: UserRecord[];
}

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const STORE_PATH = process.env.DATABASE_PATH || path.join(DATA_DIR, 'nova_vault.json');
const SQLITE_PATH = path.join(DATA_DIR, 'nova_vault.db');

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function emptyStore(): VaultStore {
  return { accounts: [], users: [] };
}

let storeCache: VaultStore | null = null;

function loadStore(): VaultStore {
  if (storeCache) return storeCache;

  ensureDataDir();

  if (fs.existsSync(STORE_PATH)) {
    try {
      const raw = fs.readFileSync(STORE_PATH, 'utf8');
      const parsed = JSON.parse(raw) as VaultStore;
      storeCache = {
        accounts: Array.isArray(parsed.accounts) ? parsed.accounts : [],
        users: Array.isArray(parsed.users) ? parsed.users : [],
      };
      return storeCache;
    } catch {
      // Fall back to empty store below.
    }
  }

  // Best-effort migration from legacy SQLite DB if it exists.
  if (fs.existsSync(SQLITE_PATH)) {
    try {
      const sqliteModule = require('node:sqlite');
      const DatabaseSync = sqliteModule.DatabaseSync;
      const db = new DatabaseSync(SQLITE_PATH);
      const accounts = db.prepare('SELECT * FROM accounts ORDER BY id ASC').all() as AccountRecord[];
      const users = db.prepare('SELECT * FROM users ORDER BY id ASC').all() as UserRecord[];
      storeCache = { accounts, users };
      saveStore(storeCache);
      return storeCache;
    } catch {
      // Ignore and continue with empty store.
    }
  }

  storeCache = emptyStore();
  saveStore(storeCache);
  return storeCache;
}

function saveStore(nextStore: VaultStore): void {
  ensureDataDir();
  fs.writeFileSync(STORE_PATH, JSON.stringify(nextStore, null, 2));
  storeCache = nextStore;
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function getAccountStore(): VaultStore {
  return loadStore();
}

export function getAccountsData(): AccountRecord[] {
  return loadStore().accounts.slice();
}

export function getUsersData(): UserRecord[] {
  return loadStore().users.slice();
}

export function saveAccountsData(accounts: AccountRecord[]): void {
  const nextStore = loadStore();
  nextStore.accounts = accounts;
  saveStore(nextStore);
}

export function saveUsersData(users: UserRecord[]): void {
  const nextStore = loadStore();
  nextStore.users = users;
  saveStore(nextStore);
}

