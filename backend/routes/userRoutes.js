import express from 'express';
import * as userService from '../services/userService.js';
import * as postService from '../services/postService.js';
import * as albumService from '../services/albumService.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

// GET /api/users/:id - public profile
router.get('/:id', async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message || 'Invalid user id.' });
  }
});

// GET /api/users/:id/posts
router.get('/:id/posts', async (req, res) => {
  try {
    const posts = await postService.getPostsByAuthor(req.params.id);
    return res.status(200).json({ posts });
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message || 'Invalid user id.' });
  }
});

// GET /api/users/:id/albums
router.get('/:id/albums', async (req, res) => {
  try {
    const albums = await albumService.getAlbumsByOwner(req.params.id);
    return res.status(200).json({ albums });
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message || 'Invalid user id.' });
  }
});

// GET /api/users/:id/friends
router.get('/:id/friends', async (req, res) => {
  try {
    const friends = await userService.getFriends(req.params.id);
    return res.status(200).json({ friends });
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message || 'Invalid user id.' });
  }
});

// PUT /api/users/:id -edit own profile only
router.put('/:id', requireAuth, async (req, res) => {
  if (req.session.userId !== req.params.id) {
    return res.status(403).json({ message: 'You can only edit your own profile.' });
  }

  try {
    const user = await userService.updateUser(req.params.id, req.body || {});
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message || 'Could not update profile.' });
  }
});

// DELETE /api/users/:id - delete own account only
router.delete('/:id', requireAuth, async (req, res) => {
  if (req.session.userId !== req.params.id) {
    return res.status(403).json({ message: 'You can only delete your own account.' });
  }

  try {
    await userService.deleteUser(req.params.id);
    req.session.destroy(() => {});
    return res.status(200).json({ message: 'Account deleted.' });
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message || 'Could not delete account.' });
  }
});

// POST /api/users/:id/friend-requests -- send a friend request to :id
router.post('/:id/friend-requests', requireAuth, async (req, res) => {
  const targetId = req.params.id;
  const selfId = req.session.userId;

  if (targetId === selfId) {
    return res.status(400).json({ message: "You can't friend yourself." });
  }

  try {
    await userService.sendFriendRequest(targetId, selfId);
    return res.status(200).json({ message: 'Friend request sent.' });
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message || 'Could not send friend request.' });
  }
});

// POST /api/users/:id/friend-requests/accept - accept a request FROM :id
router.post('/:id/friend-requests/accept', requireAuth, async (req, res) => {
  try {
    await userService.acceptFriendRequest(req.session.userId, req.params.id);
    return res.status(200).json({ message: 'Friend request accepted.' });
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message || 'Could not accept friend request.' });
  }
});

// POST /api/users/:id/friend-requests/decline - decline a request FROM :id
router.post('/:id/friend-requests/decline', requireAuth, async (req, res) => {
  try {
    await userService.declineFriendRequest(req.session.userId, req.params.id);
    return res.status(200).json({ message: 'Friend request declined.' });
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message || 'Could not decline friend request.' });
  }
});

// DELETE /api/users/:id/friend - unfriend :id
router.delete('/:id/friend', requireAuth, async (req, res) => {
  try {
    await userService.removeFriend(req.session.userId, req.params.id);
    return res.status(200).json({ message: 'Unfriended.' });
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message || 'Could not unfriend.' });
  }
});

export default router;
