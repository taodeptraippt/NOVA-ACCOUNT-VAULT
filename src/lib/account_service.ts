import { getAccountsData, getAccountStore, saveAccountsData, nowIso, type AccountRecord } from './db';
import { encryptCredential, decryptCredential } from './security';
import { generateNovaUsername } from './password';

export interface AccountRow extends AccountRecord {}

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

function rowToPublic(row: AccountRecord): AccountPublic {
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

function getAccountsFromStore(): AccountRecord[] {
  return getAccountsData();
}

export function getNextNovaId(): string {
  const accounts = getAccountsFromStore();
  const nextNum = accounts.reduce((max, account) => Math.max(max, Number(account.id) || 0), 0) + 1;
  return `NOVA-${String(nextNum).padStart(4, '0')}`;
}

export function isUsernameExists(username: string, excludeId?: number): boolean {
  return getAccountsFromStore().some((account) => account.username === username && account.id !== excludeId);
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

  const accounts = getAccountsFromStore();
  const novaId = getNextNovaId();
  const enc = encryptCredential(data.password);
  const ts = nowIso();
  const newAccount: AccountRecord = {
    id: accounts.reduce((max, account) => Math.max(max, account.id), 0) + 1,
    nova_id: novaId,
    username: data.username,
    encrypted_password: enc,
    status: (data.status || 'ACTIVE').toUpperCase(),
    tag: 'GENERAL',
    notes: data.notes || '',
    created_at: ts,
    updated_at: ts,
    last_used_at: null,
  };

  accounts.push(newAccount);
  saveAccountsData(accounts);
  return getAccountById(newAccount.id)!;
}

export function getAccounts(opts: {
  query?: string | null;
  status?: string | null;
  sortBy?: string;
}): AccountPublic[] {
  const { query, status, sortBy = 'newest' } = opts;
  const accounts = getAccountsFromStore();

  const filtered = accounts.filter((account) => {
    if (status && status.toUpperCase() !== 'ALL' && account.status !== status.toUpperCase()) {
      return false;
    }
    if (query && query.trim()) {
      const like = query.trim().toLowerCase();
      if (!`${account.nova_id} ${account.username} ${account.notes}`.toLowerCase().includes(like)) {
        return false;
      }
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'oldest') return a.id - b.id;
    if (sortBy === 'username_asc') return a.username.localeCompare(b.username);
    if (sortBy === 'username_desc') return b.username.localeCompare(a.username);
    return b.id - a.id;
  });

  return sorted.map(rowToPublic);
}

export function getAccountById(id: number): AccountPublic | null {
  const account = getAccountsFromStore().find((item) => item.id === id);
  return account ? rowToPublic(account) : null;
}

export function getAccountCredential(id: number): { account: AccountPublic; password: string } {
  const account = getAccountsFromStore().find((item) => item.id === id);
  if (!account) throw new Error('Account not found.');

  const updated = getAccountsFromStore().map((item) => (item.id === id ? { ...item, last_used_at: nowIso() } : item));
  saveAccountsData(updated);
  const password = decryptCredential(account.encrypted_password);
  return { account: rowToPublic(account), password };
}

export function updateAccount(
  id: number,
  data: { username?: string; password?: string; status?: string; notes?: string }
): AccountPublic {
  const existing = getAccountById(id);
  if (!existing) throw new Error('Account not found.');

  if (data.username && data.username !== existing.username && isUsernameExists(data.username, id)) {
    throw new Error(`Username '${data.username}' already exists.`);
  }

  const accounts = getAccountsFromStore();
  const updated = accounts.map((account) => {
    if (account.id !== id) return account;

    const newUsername = data.username ?? account.username;
    const newStatus = data.status ? data.status.toUpperCase() : account.status;
    const newNotes = data.notes !== undefined ? data.notes : account.notes;
    let enc = account.encrypted_password;

    if (data.password) {
      enc = encryptCredential(data.password);
    }

    return {
      ...account,
      username: newUsername,
      encrypted_password: enc,
      status: newStatus,
      notes: newNotes,
      updated_at: nowIso(),
    };
  });

  saveAccountsData(updated);
  return getAccountById(id)!;
}

export function archiveAccount(id: number): AccountPublic {
  const existing = getAccountById(id);
  if (!existing) throw new Error('Account not found.');

  const updated = getAccountsFromStore().map((account) =>
    account.id === id ? { ...account, status: 'ARCHIVED', updated_at: nowIso() } : account
  );
  saveAccountsData(updated);
  return getAccountById(id)!;
}

export function getAccountStats(): { total: number; active: number; paused: number; archived: number } {
  const accounts = getAccountsFromStore();
  return {
    total: accounts.length,
    active: accounts.filter((account) => account.status === 'ACTIVE').length,
    paused: accounts.filter((account) => account.status === 'PAUSED').length,
    archived: accounts.filter((account) => account.status === 'ARCHIVED').length,
  };
}

/** Export all accounts WITH decrypted passwords for backup. */
export function getAllAccountsWithPasswords(): { id: number; nova_id: string; username: string; password: string; status: string; notes: string; created_at: string }[] {
  return getAccountsFromStore().map((account) => ({
    id: Number(account.id),
    nova_id: account.nova_id,
    username: account.username,
    password: decryptCredential(account.encrypted_password),
    status: account.status,
    notes: account.notes || '',
    created_at: account.created_at,
  }));
}
