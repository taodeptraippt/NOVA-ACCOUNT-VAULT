// Security (crypto built-in — no native deps like bcrypt/fernet needed)
// - Password hashing  : scrypt (from node:crypto)
// - Vault encryption  : AES-256-GCM
// - JWT (session)     : HMAC-SHA256 signed token (opaque to API consumers)

import {
  scryptSync,
  randomBytes,
  createCipheriv,
  createDecipheriv,
  createHmac,
  timingSafeEqual,
} from 'node:crypto';

// ---------------------------------------------------------------------------
// Config (can be overridden via env on the panel)
// ---------------------------------------------------------------------------
const JWT_SECRET = process.env.SECRET_KEY || 'nova_vault_super_secret_jwt_key_2026_change_in_production';
const ENC_KEY = process.env.CREDENTIAL_ENCRYPTION_KEY || 'nova_vault_encryption_master_key_2026_fallback';

function getEncKey32(): Buffer {
  // Derive a 32-byte key deterministically from the provided secret.
  return scryptSync(ENC_KEY, 'nova-vault-salt', 32);
}

const ALGORITHM = 'aes-256-gcm';
const JWT_ALG = 'HS256';

// ---------------------------------------------------------------------------
// Password hashing (scrypt)
// ---------------------------------------------------------------------------
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const derived = scryptSync(password, salt, 64).toString('hex');
  return `scrypt$${salt}$${derived}`;
}

export function verifyPassword(plain: string, stored: string): boolean {
  try {
    const [scheme, salt, hash] = stored.split('$');
    if (scheme !== 'scrypt') return false;
    const derived = scryptSync(plain, salt, 64).toString('hex');
    const a = Buffer.from(derived, 'hex');
    const b = Buffer.from(hash, 'hex');
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Vault credential encryption (AES-256-GCM)
// ---------------------------------------------------------------------------
export function encryptCredential(plain: string): string {
  if (!plain) return '';
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, getEncKey32(), iv);
  const enc = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `v1:${iv.toString('base64')}:${authTag.toString('base64')}:${enc.toString('base64')}`;
}

export function decryptCredential(stored: string): string {
  if (!stored) return '';
  try {
    const [v, ivB64, tagB64, dataB64] = stored.split(':');
    if (v !== 'v1') return '';
    const iv = Buffer.from(ivB64, 'base64');
    const authTag = Buffer.from(tagB64, 'base64');
    const data = Buffer.from(dataB64, 'base64');
    const decipher = createDecipheriv(ALGORITHM, getEncKey32(), iv);
    decipher.setAuthTag(authTag);
    return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
  } catch {
    return '';
  }
}

// ---------------------------------------------------------------------------
// JWT-like session token (HMAC-SHA256)
// ---------------------------------------------------------------------------
function base64url(buf: Buffer): string {
  return buf.toString('base64url');
}

export function createAccessToken(subject: string, role: string, expiresMs: number): string {
  const iat = Date.now();
  const header = { alg: JWT_ALG, typ: 'JWT' };
  const payload = {
    sub: subject,
    role,
    iat,
    exp: iat + expiresMs,
  };
  const signingInput = `${base64url(Buffer.from(JSON.stringify(header)))}.${base64url(
    Buffer.from(JSON.stringify(payload))
  )}`;
  const sig = base64url(createHmac('sha256', JWT_SECRET).update(signingInput).digest());
  return `${signingInput}.${sig}`;
}

export function verifyAccessToken(token: string): { sub: string; role: string; iat: number; exp: number } | null {
  try {
    const [h, p, s] = token.split('.');
    if (!h || !p || !s) return null;
    const expectedSig = base64url(createHmac('sha256', JWT_SECRET).update(`${h}.${p}`).digest());
    const a = Buffer.from(s, 'base64url');
    const b = Buffer.from(expectedSig, 'base64url');
    if (!(a.length === b.length && timingSafeEqual(a, b))) return null;
    const payload = JSON.parse(Buffer.from(p, 'base64url').toString('utf8'));
    if (typeof payload.exp === 'number' && payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

