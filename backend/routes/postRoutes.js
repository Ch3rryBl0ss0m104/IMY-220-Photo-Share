import express from 'express';
import * as postService from '../services/postService.js';
import * as commentService from '../services/commentService.js';
import * as albumService from '../services/albumService.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

// GET /api/posts - global feed, newest first, author info joined in
router.get('/', async (req, res) => {
  try {
    const posts = await postService.getAllPosts();
    return res.status(200).json({ posts });
  } catch (error) {
    console.error('Loading posts failed:', error);
    return res.status(500).json({ message: 'Could not load posts.' });
  }
});

// GET /api/posts/:id
router.get('/:id', async (req, res) => {
  try {
    const post = await postService.getPostById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });
    return res.status(200).json({ post });
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message || 'Invalid post id.' });
  }
});

// POST /api/posts - create a post (creation date is set automatically)
router.post('/', requireAuth, async (req, res) => {
  const { image, caption, hashtags } = req.body || {};

  if (!image || !caption) {
    return res.status(400).json({ message: 'An image and description are required.' });
  }

  try {
    const post = await postService.createPost({ authorId: req.session.userId, image, caption, hashtags });
    return res.status(201).json({ post });
  } catch (error) {
    console.error('Post creation failed:', error);
    return res.status(500).json({ message: 'Could not create post.' });
  }
});

// PUT /api/posts/:id - owner can edit description/hashtags only, never the image
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const existing = await postService.getRawPostById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Post not found.' });
    if (existing.authorId.toString() !== req.session.userId) {
      return res.status(403).json({ message: 'You can only edit your own posts.' });
    }

    const post = await postService.updatePost(req.params.id, req.body || {});
    return res.status(200).json({ post });
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message || 'Could not update post.' });
  }
});

// DELETE /api/posts/:id - owner only, cascades to comments and empty albums
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const existing = await postService.getRawPostById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Post not found.' });
    if (existing.authorId.toString() !== req.session.userId) {
      return res.status(403).json({ message: 'You can only delete your own posts.' });
    }

    await commentService.deleteCommentsByPost(req.params.id);
    await albumService.removePostFromAllAlbums(req.params.id);
    await postService.deletePost(req.params.id);

    return res.status(200).json({ message: 'Post deleted.' });
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message || 'Could not delete post.' });
  }
});

// POST /api/posts/:id/report - anyone but the owner can report, with a reason
router.post('/:id/report', requireAuth, async (req, res) => {
  const { reason } = req.body || {};
  if (!reason) return res.status(400).json({ message: 'A reason is required.' });

  try {
    const existing = await postService.getRawPostById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Post not found.' });
    if (existing.authorId.toString() === req.session.userId) {
      return res.status(403).json({ message: "You can't report your own post." });
    }

    const post = await postService.reportPost(req.params.id, reason);
    return res.status(200).json({ post });
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message || 'Could not report post.' });
  }
});

export default router;
