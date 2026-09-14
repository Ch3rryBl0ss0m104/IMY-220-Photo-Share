import { apiRequest } from './client.js';

export const getComments = (postId) => apiRequest(`/api/posts/${postId}/comments`);
export const addComment = (postId, text) => apiRequest(`/api/posts/${postId}/comments`, { method: 'POST', body: { text } });
export const updateComment = (id, text) => apiRequest(`/api/comments/${id}`, { method: 'PUT', body: { text } });
export const deleteComment = (id) => apiRequest(`/api/comments/${id}`, { method: 'DELETE' });
