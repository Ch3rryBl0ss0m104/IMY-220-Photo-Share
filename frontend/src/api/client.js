const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Every request needs credentials: 'include' so the session cookie set by the backend is actually sent back on subsequent requests - without this, the browser treats each fetch 
// as a fresh, logged-out visitor.

export async function apiRequest(path, { method = 'GET', body } = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    // Some responses (e.g. a plain 204) have no JSON body
  }

  if (!response.ok) {
    const error = new Error(data?.message || `Request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }

  return data;
}
