import { apiRequest } from './client.js';

export const getUser = (id) => apiRequest(`/api/users/${id}`);
export const updateUser = (id, data) => apiRequest(`/api/users/${id}`, { method: 'PUT', body: data });
export const deleteUser = (id) => apiRequest(`/api/users/${id}`, { method: 'DELETE' });
export const getUserPosts = (id) => apiRequest(`/api/users/${id}/posts`);
export const getUserAlbums = (id) => apiRequest(`/api/users/${id}/albums`);
export const getUserFriends = (id) => apiRequest(`/api/users/${id}/friends`);
export const sendFriendRequest = (id) => apiRequest(`/api/users/${id}/friend-requests`, { method: 'POST' });
export const acceptFriendRequest = (id) => apiRequest(`/api/users/${id}/friend-requests/accept`, { method: 'POST' });
export const declineFriendRequest = (id) => apiRequest(`/api/users/${id}/friend-requests/decline`, { method: 'POST' });
export const unfriend = (id) => apiRequest(`/api/users/${id}/friend`, { method: 'DELETE' });
