import { apiRequest } from './client.js';

export const signup = (data) => apiRequest('/api/auth/signup', { method: 'POST', body: data });
export const signin = (data) => apiRequest('/api/auth/signin', { method: 'POST', body: data });
export const signout = () => apiRequest('/api/auth/signout', { method: 'POST' });
export const fetchMe = () => apiRequest('/api/auth/me');
