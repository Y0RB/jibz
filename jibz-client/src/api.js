// Small helpers for talking to jibz.api (proxied by Vite at /api)

export function getToken() {
  return localStorage.getItem('token');
}

// Reads the logged-in user out of the JWT the API issues ({ id, username }), or null
export function getCurrentUser() {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    const id = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    const username = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return { id: Number(id), username };
  } catch {
    return null;
  }
}

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = { ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(path, { ...options, headers });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || `Request failed (${res.status})`);
  return data;
}

// Local dev only (npm run dev): if nobody is logged in, sign in as the shared
// "devrider" test account so features like Post can be tried without registering.
export async function devAutoLogin() {
  if (!import.meta.env.DEV || getCurrentUser()) return;
  try {
    const data = await apiFetch('/api/auth/dev-login', { method: 'POST' });
    localStorage.setItem('token', data.token);
  } catch {
    // API not running or not in Development; stay logged out
  }
}

// API sport enum: 0 = Snowboarder, 1 = Skier
export const SPORT_EMOJI = { 0: '🏂', 1: '⛷️' };
