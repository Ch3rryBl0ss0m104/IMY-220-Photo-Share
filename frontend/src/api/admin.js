import { apiRequest } from './client.js';

export const getReportedPosts = () => apiRequest('/api/admin/posts/reported');
export const dismissReports = (postId) => apiRequest(`/api/admin/posts/${postId}/dismiss`, { method: 'POST' });
export const adminDeletePost = (postId) => apiRequest(`/api/admin/posts/${postId}`, { method: 'DELETE' });

export const getAllPostsAdmin = () => apiRequest('/api/admin/posts');
export const getAllAlbumsAdmin = () => apiRequest('/api/admin/albums');
export const adminDeleteAlbum = (albumId) => apiRequest(`/api/admin/albums/${albumId}`, { method: 'DELETE' });

export const getAllUsersAdmin = () => apiRequest('/api/admin/users');
export const adminDeleteUser = (userId) => apiRequest(`/api/admin/users/${userId}`, { method: 'DELETE' });

export const addReportReason = (label) => apiRequest('/api/admin/report-reasons', { method: 'POST', body: { label } });
export const deleteReportReason = (id) => apiRequest(`/api/admin/report-reasons/${id}`, { method: 'DELETE' });
