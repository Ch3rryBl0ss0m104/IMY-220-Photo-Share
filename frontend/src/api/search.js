import { apiRequest } from './client.js';

export const search = (query) => apiRequest(`/api/search?q=${encodeURIComponent(query)}`);
