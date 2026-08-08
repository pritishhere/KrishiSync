/**
 * KrishiSync API Configuration & Auth Helper
 * Centralizes the backend base URL and provides a JWT-aware fetch helper
 * so every protected endpoint automatically attaches the Bearer token.
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const TOKEN_KEY = 'krishi_sync_token';
const USER_KEY = 'krishi_sync_user';

/**
 * Return the stored JWT token (or null).
 */
export const getToken = () => localStorage.getItem(TOKEN_KEY);

/**
 * Persist the auth session (token + user) to localStorage.
 */
export const setSession = ({ token, user }) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Read the stored user object.
 */
export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/**
 * Clear the stored session.
 */
export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem('krishi_sync_demo_auth');
};

/**
 * Universal fetch wrapper that:
 *  - Attaches Authorization: Bearer <token> when a token exists
 *  - Sets JSON content-type when a body is provided
 *  - Optionally sends raw body (e.g. FormData / URLSearchParams / text)
 *  - Throws a descriptive error on non-2xx responses
 */
export async function apiFetch(endpoint, { method = 'GET', body, headers = {}, rawBody = false, formUrlEncoded = false } = {}) {
  const token = getToken();
  const finalHeaders = {
    ...(formUrlEncoded
      ? { 'Content-Type': 'application/x-www-form-urlencoded' }
      : body && !rawBody
        ? { 'Content-Type': 'application/json' }
        : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  let payload;
  if (formUrlEncoded && body) {
    payload = new URLSearchParams(body).toString();
  } else if (body && !rawBody) {
    payload = JSON.stringify(body);
  } else {
    payload = body;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: finalHeaders,
    body: payload || undefined,
  });

  // Attempt to parse JSON, fall back to raw text for XML/Twilio responses
  const contentType = res.headers.get('content-type') || '';
  let data;
  try {
    data = contentType.includes('json') ? await res.json() : await res.text();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message =
      (typeof data === 'object' && (data.message || (data.success === false ? data.error : null))) ||
      (typeof data === 'string' ? data : null) ||
      `Request failed with status ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export default {
  API_BASE_URL,
  apiFetch,
  getToken,
  setSession,
  getStoredUser,
  clearSession,
};
