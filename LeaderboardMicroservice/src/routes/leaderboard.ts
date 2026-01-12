import { Router } from 'express';
import { getLeaderboard } from '../services/leaderboardService';

const router = Router();

/**
 * GET /api/leaderboard?limit=10
 */
router.get('/', async (req, res, next) => {
  try {
    const limitRaw = req.query.limit;
    const limit =
      typeof limitRaw === 'string' && limitRaw.trim() !== ''
        ? Number(limitRaw)
        : undefined;

    const data = await getLeaderboard({ limit });

    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
