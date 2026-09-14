import express from 'express';
import * as commentService from '../services/commentService.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

// GET /api/posts/:postId/comments
router.get('/posts/:postId/comments', async (req, res) => {
  try {
    const comments = await commentService.getCommentsByPost(req.params.postId);
    return res.status(200).json({ comments });
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message || 'Invalid post id.' });
  }
});

// POST /api/posts/:postId/comments
router.post('/posts/:postId/comments', requireAuth, async (req, res) => {
  const { text } = req.body || {};
  if (!text) return res.status(400).json({ message: 'Comment text is required.' });

  try {
    const comment = await commentService.createComment({
      postId: req.params.postId,
      authorId: req.session.userId,
      text,
    });
    return res.status(201).json({ comment });
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message || 'Could not add comment.' });
  }
});

// PUT /api/comments/:id - author only
router.put('/comments/:id', requireAuth, async (req, res) => {
  try {
    const existing = await commentService.getRawCommentById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Comment not found.' });
    if (existing.authorId.toString() !== req.session.userId) {
      return res.status(403).json({ message: 'You can only edit your own comments.' });
    }

    const comment = await commentService.updateComment(req.params.id, req.body?.text);
    return res.status(200).json({ comment });
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message || 'Could not update comment.' });
  }
});

// DELETE /api/comments/:id - author only
router.delete('/comments/:id', requireAuth, async (req, res) => {
  try {
    const existing = await commentService.getRawCommentById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Comment not found.' });
    if (existing.authorId.toString() !== req.session.userId) {
      return res.status(403).json({ message: 'You can only delete your own comments.' });
    }

    await commentService.deleteComment(req.params.id);
    return res.status(200).json({ message: 'Comment deleted.' });
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message || 'Could not delete comment.' });
  }
});

export default router;
