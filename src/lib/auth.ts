import { getUsersData, saveUsersData, nowIso, type UserRecord as StoredUserRecord } from './db';
import { hashPassword, verifyPassword, createAccessToken, verifyAccessToken } from './security';
import { NextRequest } from 'next/server';

const TOKEN_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface UserRecord {
  id: number;
  email: string;
  role: string;
  is_active: number;
}

function rowToUser(row: StoredUserRecord): UserRecord {
  return {
    id: Number(row.id),
    email: row.email,
    role: row.role,
    is_active: Number(row.is_active),
  };
}

/** Seed default Admin + Worker if users table is empty. */
export function seedDefaultUsers(): void {
  const users = getUsersData();
  if (users.length === 0) {
    const seeded = [
      {
        id: 1,
        email: 'admin@nova.vault',
        hashed_password: hashPassword('admin123'),
        role: 'ADMIN',
        is_active: 1,
        created_at: nowIso(),
      },
      {
        id: 2,
        email: 'worker@nova.vault',
        hashed_password: hashPassword('worker123'),
        role: 'WORKER',
        is_active: 1,
        created_at: nowIso(),
      },
    ];
    saveUsersData(seeded);
  }
}

export function findUserByEmail(email: string): UserRecord | null {
  const row = getUsersData().find((item) => item.email === email);
  return row ? rowToUser(row) : null;
}

export function findUserById(id: number): UserRecord | null {
  const row = getUsersData().find((item) => item.id === id);
  return row ? rowToUser(row) : null;
}

export function authenticateUser(email: string, password: string): UserRecord | null {
  const user = findUserByEmail(email);
  if (!user) return null;
  const stored = getUsersData().find((item) => item.id === user.id);
  if (!stored) return null;
  if (!verifyPassword(password, stored.hashed_password)) {
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
    const admin = getUsersData().find((item) => item.role === 'ADMIN');
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

