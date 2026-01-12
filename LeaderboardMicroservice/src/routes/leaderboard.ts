import { Router } from 'express';
import { getLeaderboard } from '../services/leaderboardService';

const router = Router();

function makeRequestId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

router.get('/', async (req, res, next) => {
  const request_id = makeRequestId();

  try {
    const limitRaw = req.query.limit;

    let limit: number | undefined = undefined;
    if (typeof limitRaw === 'string' && limitRaw.trim() !== '') {
      limit = Number(limitRaw);
      if (!Number.isFinite(limit) || limit < 1 || limit > 100) {
        return res.status(400).json({
          meta: { request_id },
          data: null,
          errors: [
            {
              code: 'INVALID_LIMIT',
              message: "Query parameter 'limit' must be a number between 1 and 100."
            }
          ]
        });
      }
    }

    const rows = await getLeaderboard({ limit });

    // Step 4 wrapper (meta + data)
    return res.json({
      meta: {
        request_id,
        limit: limit ?? Number(process.env.DEFAULT_LIMIT || 10),
        count: rows.length,
        source: 'LeaderboardMicroservice'
      },
      data: rows.map((r) => ({
        ...r,
        links: {
          self: `/api/leaderboard?limit=${limit ?? Number(process.env.DEFAULT_LIMIT || 10)}`,
          design: `/api/designs/${r.id}`
        }
      })),
      errors: []
    });
  } catch (err) {
    (err as any).request_id = request_id;
    next(err);
  }
});

export default router;
