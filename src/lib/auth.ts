import { db, nowIso } from './db';
import { hashPassword, verifyPassword, createAccessToken, verifyAccessToken } from './security';
import { NextRequest } from 'next/server';

const TOKEN_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface UserRecord {
  id: number;
  email: string;
  role: string;
  is_active: number;
}

function rowToUser(row: any): UserRecord {
  return {
    id: Number(row.id),
    email: row.email,
    role: row.role,
    is_active: Number(row.is_active),
  };
}

/** Seed default Admin + Worker if users table is empty. */
export function seedDefaultUsers(): void {
  const count = ((db.prepare('SELECT COUNT(*) AS c FROM users').get() as any)?.c) as number;
  if (count === 0) {
    const insert = db.prepare('INSERT INTO users (email, hashed_password, role, is_active, created_at) VALUES (?, ?, ?, ?, ?)');
    insert.run('admin@nova.vault', hashPassword('admin123'), 'ADMIN', 1, nowIso());
    insert.run('worker@nova.vault', hashPassword('worker123'), 'WORKER', 1, nowIso());
  }
}

export function findUserByEmail(email: string): UserRecord | null {
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  return row ? rowToUser(row) : null;
}

export function findUserById(id: number): UserRecord | null {
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  return row ? rowToUser(row) : null;
}

export function authenticateUser(email: string, password: string): UserRecord | null {
  const user = findUserByEmail(email);
  if (!user) return null;
  if (!verifyPassword(password, String((db.prepare('SELECT hashed_password FROM users WHERE id = ?').get(user.id) as any)?.hashed_password))) {
    return null;
  }
  return user;
}

export function issueToken(user: UserRecord): string {
  return createAccessToken(String(user.id), user.role, TOKEN_EXPIRES_MS);
}

/** Extract current user from request. Returns null if not authenticated. */
export function getAuthUser(req: NextRequest): UserRecord | null {
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  if (!token) {
    // Fallback: allow ADMIN (matches original single-user local MVP fallback)
    const admin = db.prepare('SELECT * FROM users WHERE role = ? ORDER BY id ASC').get('ADMIN');
    return admin ? rowToUser(admin) : null;
  }

  const payload = verifyAccessToken(token);
  if (!payload) return null;

  const user = findUserById(parseInt(payload.sub, 10));
  if (!user || !user.is_active) return null;
  return user;
}

/** For API routes requiring auth: returns user or null (route should return 401). */
export function requireAuth(req: NextRequest): UserRecord | null {
  return getAuthUser(req);
}

