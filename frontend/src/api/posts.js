import { apiRequest } from './client.js';

export const getAllPosts = () => apiRequest('/api/posts');
export const getPost = (id) => apiRequest(`/api/posts/${id}`);
export const createPost = (data) => apiRequest('/api/posts', { method: 'POST', body: data });
export const updatePost = (id, data) => apiRequest(`/api/posts/${id}`, { method: 'PUT', body: data });
export const deletePost = (id) => apiRequest(`/api/posts/${id}`, { method: 'DELETE' });
export const reportPost = (id, reason) => apiRequest(`/api/posts/${id}/report`, { method: 'POST', body: { reason } });
