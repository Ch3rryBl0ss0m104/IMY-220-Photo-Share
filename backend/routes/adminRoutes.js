import express from 'express';
import * as postService from '../services/postService.js';
import * as albumService from '../services/albumService.js';
import * as userService from '../services/userService.js';
import * as commentService from '../services/commentService.js';
import * as reportReasonService from '../services/reportReasonService.js';
import { requireAuth, requireAdmin } from '../middleware/requireAuth.js';

const router = express.Router();

// Every route below first requires a signed-in user (requireAuth), then requires that user to be flagged isAdmin (requireAdmin).
router.use(requireAuth, requireAdmin);

// Reported posts 

// GET /api/admin/posts/reported - every post with at least 1 report, most-reported first
router.get('/posts/reported', async (req, res) => {
  try {
    const posts = await postService.getReportedPosts();
    return res.status(200).json({ posts });
  } catch (error) {
    return res.status(500).json({ message: 'Could not load reported posts.' });
  }
});

// POST /api/admin/posts/:id/dismiss - clears a post's reports, bringing it back into the normal feed
router.post('/posts/:id/dismiss', async (req, res) => {
  try {
    const post = await postService.dismissReports(req.params.id);
    return res.status(200).json({ post });
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message || 'Could not dismiss reports.' });
  }
});

// Manage any post/album/user

// GET /api/admin/posts - every post, including hidden/reported ones
router.get('/posts', async (req, res) => {
  try {
    const posts = await postService.getAllPosts();
    return res.status(200).json({ posts });
  } catch (error) {
    return res.status(500).json({ message: 'Could not load posts.' });
  }
});

// DELETE /api/admin/posts/:id - admin can delete ANY post (not just their own)
router.delete('/posts/:id', async (req, res) => {
  try {
    await commentService.deleteCommentsByPost(req.params.id);
    await albumService.removePostFromAllAlbums(req.params.id);
    await postService.deletePost(req.params.id);
    return res.status(200).json({ message: 'Post deleted.' });
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message || 'Could not delete post.' });
  }
});

// GET /api/admin/albums - every album across every user
router.get('/albums', async (req, res) => {
  try {
    const albums = await albumService.getAllAlbums();
    return res.status(200).json({ albums });
  } catch (error) {
    return res.status(500).json({ message: 'Could not load albums.' });
  }
});

// DELETE /api/admin/albums/:id - admin can delete ANY album
router.delete('/albums/:id', async (req, res) => {
  try {
    await albumService.deleteAlbum(req.params.id);
    return res.status(200).json({ message: 'Album deleted.' });
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message || 'Could not delete album.' });
  }
});

// GET /api/admin/users - every registered user
router.get('/users', async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: 'Could not load users.' });
  }
});

// DELETE /api/admin/users/:id - admin can delete ANY account
router.delete('/users/:id', async (req, res) => {
  if (req.params.id === req.session.userId) {
    return res.status(400).json({ message: "You can't delete your own admin account from here." });
  }
  try {
    await userService.adminDeleteUser(req.params.id);
    return res.status(200).json({ message: 'Account deleted.' });
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message || 'Could not delete account.' });
  }
});

// Manage report reasons 

// POST /api/admin/report-reasons - add a new reason to the dropdown everyone sees when reporting a post
router.post('/report-reasons', async (req, res) => {
  const { label } = req.body || {};
  if (!label || !label.trim()) return res.status(400).json({ message: 'A reason label is required.' });
  try {
    const reason = await reportReasonService.addReason(label);
    return res.status(201).json({ reason });
  } catch (error) {
    return res.status(500).json({ message: 'Could not add reason.' });
  }
});

// DELETE /api/admin/report-reasons/:id
router.delete('/report-reasons/:id', async (req, res) => {
  try {
    await reportReasonService.deleteReason(req.params.id);
    return res.status(200).json({ message: 'Reason removed.' });
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message || 'Could not remove reason.' });
  }
});

export default router;
