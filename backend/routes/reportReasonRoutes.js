import express from 'express';
import * as reportReasonService from '../services/reportReasonService.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

// GET /api/report-reasons - any signed-in user can read the list to populate the "report post" dropdown.
// Adding/removing reasons is an admin-only action - see adminRoutes.js.
router.get('/', requireAuth, async (req, res) => {
  try {
    const reasons = await reportReasonService.getAllReasons();
    return res.status(200).json({ reasons });
  } catch (error) {
    return res.status(500).json({ message: 'Could not load report reasons.' });
  }
});

export default router;
