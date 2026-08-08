import { db, nowIso } from './db';
import { encryptCredential, decryptCredential } from './security';
import { generateNovaUsername } from './password';

export interface AccountRow {
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

export interface AccountPublic {
  id: number;
  nova_id: string;
  username: string;
  status: string;
  tag: string;
  notes: string;
  created_at: string;
  updated_at: string;
  last_used_at?: string | null;
}

function rowToPublic(row: any): AccountPublic {
  return {
    id: Number(row.id),
    nova_id: row.nova_id,
    username: row.username,
    status: row.status,
    tag: row.tag,
    notes: row.notes || '',
    created_at: row.created_at,
    updated_at: row.updated_at,
    last_used_at: row.last_used_at ?? null,
  };
}

export function getNextNovaId(): string {
  const row = db.prepare('SELECT MAX(id) AS m FROM accounts').get() as any;
  const nextNum = row?.m ? Number(row.m) + 1 : 1;
  return `NOVA-${String(nextNum).padStart(4, '0')}`;
}

export function isUsernameExists(username: string, excludeId?: number): boolean {
  if (excludeId) {
    const row = db.prepare('SELECT id FROM accounts WHERE username = ? AND id != ?').get(username, excludeId);
    return !!row;
  }
  const row = db.prepare('SELECT id FROM accounts WHERE username = ?').get(username);
  return !!row;
}

export function generateUniqueNovaUsername(): string {
  for (let i = 0; i < 50; i++) {
    const uname = generateNovaUsername();
    if (!isUsernameExists(uname)) return uname;
  }
  return `NovaSky${Date.now() % 10000}`;
}

export function createAccount(data: {
  username: string;
  password: string;
  status: string;
  notes?: string;
}): AccountPublic {
  if (isUsernameExists(data.username)) {
    throw new Error(`Username '${data.username}' already exists.`);
  }
  const novaId = getNextNovaId();
  const enc = encryptCredential(data.password);
  const ts = nowIso();
  const res = db
    .prepare(
      'INSERT INTO accounts (nova_id, username, encrypted_password, status, tag, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    )
    .run(novaId, data.username, enc, data.status || 'ACTIVE', 'GENERAL', data.notes || '', ts, ts);
  const id = Number(res.lastInsertRowid);
  return getAccountById(id)!;
}

export function getAccounts(opts: {
  query?: string | null;
  status?: string | null;
  sortBy?: string;
}): AccountPublic[] {
  const { query, status, sortBy = 'newest' } = opts;

  let sql = 'SELECT * FROM accounts';
  const params: any[] = [];
  const conds: string[] = [];

  if (status && status.toUpperCase() !== 'ALL') {
    conds.push('status = ?');
    params.push(status.toUpperCase());
  }
  if (query && query.trim()) {
    const like = `%${query.trim()}%`;
    conds.push('(nova_id LIKE ? OR username LIKE ? OR notes LIKE ?)');
    params.push(like, like, like);
  }
  if (conds.length) {
    sql += ' WHERE ' + conds.join(' AND ');
  }

  if (sortBy === 'oldest') sql += ' ORDER BY id ASC ';
  else if (sortBy === 'username_asc') sql += ' ORDER BY username ASC ';
  else if (sortBy === 'username_desc') sql += ' ORDER BY username DESC ';
  else sql += ' ORDER BY id DESC ';

  const rows = db.prepare(sql).all(...params);
  return rows.map((r: any) => rowToPublic(r));
}

export function getAccountById(id: number): AccountPublic | null {
  const row = db.prepare('SELECT * FROM accounts WHERE id = ?').get(id);
  return row ? rowToPublic(row) : null;
}

export function getAccountCredential(id: number): { account: AccountPublic; password: string } {
  const row = db.prepare('SELECT * FROM accounts WHERE id = ?').get(id);
  if (!row) throw new Error('Account not found.');
  db.prepare('UPDATE accounts SET last_used_at = ? WHERE id = ?').run(nowIso(), id);
  const password = decryptCredential(row.encrypted_password);
  return { account: rowToPublic(row), password };
}

export function updateAccount(
  id: number,
  data: { username?: string; password?: string; status?: string; notes?: string }
): AccountPublic {
  const existing = getAccountById(id);
  if (!existing) throw new Error('Account not found.');

  if (data.username && data.username !== existing.username) {
    if (isUsernameExists(data.username, id)) {
      throw new Error(`Username '${data.username}' already exists.`);
    }
  }

  const newUsername = data.username ?? existing.username;
  const newStatus = data.status ?? existing.status;
  const newNotes = data.notes !== undefined ? data.notes : existing.notes;

  let enc = (db.prepare('SELECT encrypted_password FROM accounts WHERE id = ?').get(id) as any)?.encrypted_password;
  if (data.password) {
    enc = encryptCredential(data.password);
  }

  db.prepare(
    'UPDATE accounts SET username = ?, encrypted_password = ?, status = ?, notes = ?, updated_at = ? WHERE id = ?'
  ).run(newUsername, enc, newStatus, newNotes, nowIso(), id);

  return getAccountById(id)!;
}

export function archiveAccount(id: number): AccountPublic {
  const existing = getAccountById(id);
  if (!existing) throw new Error('Account not found.');
  db.prepare('UPDATE accounts SET status = ?, updated_at = ? WHERE id = ?').run('ARCHIVED', nowIso(), id);
  return getAccountById(id)!;
}

export function getAccountStats(): { total: number; active: number; paused: number; archived: number } {
  const total = Number((db.prepare('SELECT COUNT(*) AS c FROM accounts').get() as any)?.c || 0);
  const active = Number((db.prepare("SELECT COUNT(*) AS c FROM accounts WHERE status = 'ACTIVE'").get() as any)?.c || 0);
  const paused = Number((db.prepare("SELECT COUNT(*) AS c FROM accounts WHERE status = 'PAUSED'").get() as any)?.c || 0);
  const archived = Number((db.prepare("SELECT COUNT(*) AS c FROM accounts WHERE status = 'ARCHIVED'").get() as any)?.c || 0);
  return { total, active, paused, archived };
}

/** Export all accounts WITH decrypted passwords for backup. */
export function getAllAccountsWithPasswords(): { id: number; nova_id: string; username: string; password: string; status: string; notes: string; created_at: string }[] {
  const rows = db.prepare('SELECT * FROM accounts ORDER BY id ASC').all() as any[];
  return rows.map((r) => ({
    id: Number(r.id),
    nova_id: r.nova_id,
    username: r.username,
    password: decryptCredential(r.encrypted_password),
    status: r.status,
    notes: r.notes || '',
    created_at: r.created_at,
  }));
}
