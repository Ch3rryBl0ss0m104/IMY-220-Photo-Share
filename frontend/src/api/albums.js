import { apiRequest } from './client.js';

export const getAlbum = (id) => apiRequest(`/api/albums/${id}`);
export const createAlbum = (data) => apiRequest('/api/albums', { method: 'POST', body: data });
export const updateAlbum = (id, data) => apiRequest(`/api/albums/${id}`, { method: 'PUT', body: data });
export const deleteAlbum = (id) => apiRequest(`/api/albums/${id}`, { method: 'DELETE' });
export const addPostToAlbum = (albumId, postId) => apiRequest(`/api/albums/${albumId}/posts`, { method: 'POST', body: { postId } });
export const removePostFromAlbum = (albumId, postId) => apiRequest(`/api/albums/${albumId}/posts/${postId}`, { method: 'DELETE' });
