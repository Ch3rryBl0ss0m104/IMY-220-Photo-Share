import express from 'express';
import * as albumService from '../services/albumService.js';
import * as postService from '../services/postService.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

// GET /api/albums/:id - with posts joined in
router.get('/:id', async (req, res) => {
  try {
    const album = await albumService.getAlbumById(req.params.id);
    if (!album) return res.status(404).json({ message: 'Album not found.' });
    return res.status(200).json({ album });
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message || 'Invalid album id.' });
  }
});

// POST /api/albums - create a new album
router.post('/', requireAuth, async (req, res) => {
  const { name, description, hashtags } = req.body || {};
  if (!name) return res.status(400).json({ message: 'An album name is required.' });

  try {
    const album = await albumService.createAlbum({ ownerId: req.session.userId, name, description, hashtags });
    return res.status(201).json({ album });
  } catch (error) {
    return res.status(500).json({ message: 'Could not create album.' });
  }
});

// PUT /api/albums/:id- owner can edit name/description/hashtags
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const existing = await albumService.getRawAlbumById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Album not found.' });
    if (existing.ownerId.toString() !== req.session.userId) {
      return res.status(403).json({ message: 'You can only edit your own albums.' });
    }

    const album = await albumService.updateAlbum(req.params.id, req.body || {});
    return res.status(200).json({ album });
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message || 'Could not update album.' });
  }
});

// DELETE /api/albums/:id - owner only, does NOT delete the posts inside
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const existing = await albumService.getRawAlbumById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Album not found.' });
    if (existing.ownerId.toString() !== req.session.userId) {
      return res.status(403).json({ message: 'You can only delete your own albums.' });
    }

    await albumService.deleteAlbum(req.params.id);
    return res.status(200).json({ message: 'Album deleted.' });
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message || 'Could not delete album.' });
  }
});

// POST /api/albums/:id/posts- add an existing (own) post to this album
router.post('/:id/posts', requireAuth, async (req, res) => {
  const { postId } = req.body || {};
  if (!postId) return res.status(400).json({ message: 'A postId is required.' });

  try {
    const existingAlbum = await albumService.getRawAlbumById(req.params.id);
    if (!existingAlbum) return res.status(404).json({ message: 'Album not found.' });
    if (existingAlbum.ownerId.toString() !== req.session.userId) {
      return res.status(403).json({ message: 'You can only edit your own albums.' });
    }

    const post = await postService.getRawPostById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found.' });
    if (post.authorId.toString() !== req.session.userId) {
      return res.status(403).json({ message: 'You can only add your own posts to an album.' });
    }

    const album = await albumService.addPostToAlbum(req.params.id, postId);
    return res.status(200).json({ album });
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message || 'Could not add post to album.' });
  }
});

// DELETE /api/albums/:id/posts/:postId - remove a post from this album
router.delete('/:id/posts/:postId', requireAuth, async (req, res) => {
  try {
    const existingAlbum = await albumService.getRawAlbumById(req.params.id);
    if (!existingAlbum) return res.status(404).json({ message: 'Album not found.' });
    if (existingAlbum.ownerId.toString() !== req.session.userId) {
      return res.status(403).json({ message: 'You can only edit your own albums.' });
    }

    const album = await albumService.removePostFromAlbum(req.params.id, req.params.postId);
    return res.status(200).json({ album });
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message || 'Could not remove post from album.' });
  }
});

export default router;
