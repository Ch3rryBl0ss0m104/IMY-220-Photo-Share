import express from 'express';
import * as searchService from '../services/searchService.js';

const router = express.Router();

// GET /api/search?q=term - searches users, posts, and albums at once. Results stay interactive on the frontend
// (clicking a user/post/album navigates straight to it; clicking a hashtag re-runs this same search).
router.get('/', async (req, res) => {
  const q = req.query.q || '';
  try {
    const results = await searchService.searchAll(q);
    return res.status(200).json(results);
  } catch (error) {
    console.error('Search failed:', error);
    return res.status(500).json({ message: 'Search failed.' });
  }
});

export default router;
