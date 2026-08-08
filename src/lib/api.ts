export interface Account {
  id: number;
  nova_id: string;
  username: string;
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
  notes: string;
  created_at: string;
  updated_at: string;
  last_used_at?: string;
}

export interface Credential {
  id: number;
  nova_id: string;
  username: string;
  password: string;
}

export interface Stats {
  total: number;
  active: number;
  paused: number;
  archived: number;
}

export interface User {
  id: number;
  email: string;
  role: 'ADMIN' | 'WORKER';
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('nova_token');
}

export function setAuthToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('nova_token', token);
  } else {
    localStorage.removeItem('nova_token');
  }
}

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Network request failed' }));
    throw new Error(errorData.detail || `Error ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Auth
  login: async (email: string, password: string) => {
    const res = await fetchAPI<{ access_token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAuthToken(res.access_token);
    return res;
  },
  logout: async () => {
    await fetchAPI('/auth/logout', { method: 'POST' }).catch(() => {});
    setAuthToken(null);
  },
  getMe: () => fetchAPI<User>('/auth/me'),

  // Accounts
  getAccounts: (query = '', status = 'ALL', sortBy = 'newest') => {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (status) params.append('status', status);
    if (sortBy) params.append('sort_by', sortBy);
    return fetchAPI<Account[]>(`/accounts?${params.toString()}`);
  },
  getStats: () => fetchAPI<Stats>('/accounts/stats'),
  generateUsername: () => fetchAPI<{ username: string }>('/accounts/generate-username', { method: 'POST' }),
  generatePassword: () => fetchAPI<{ password: string }>('/accounts/generate-password', { method: 'POST' }),
  createAccount: (data: { username: string; password: string; status: string; notes?: string }) =>
    fetchAPI<Account>('/accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getAccount: (id: number) => fetchAPI<Account>(`/accounts/${id}`),
  getCredential: (id: number) => fetchAPI<Credential>(`/accounts/${id}/credential`),
  updateAccount: (id: number, data: Partial<{ username: string; password: string; status: string; notes: string }>) =>
    fetchAPI<Account>(`/accounts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  archiveAccount: (id: number) => fetchAPI<Account>(`/accounts/${id}`, { method: 'DELETE' }),

  // Export / Backup (download .txt file)
  exportTxt: async () => {
    const token = getAuthToken();
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/accounts/export`, { headers });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Export failed' }));
      throw new Error(err.detail || `Error ${res.status}`);
    }
    const text = await res.text();
    const filename = `nova_vault_backup_${new Date().toISOString().slice(0, 10)}.txt`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};
