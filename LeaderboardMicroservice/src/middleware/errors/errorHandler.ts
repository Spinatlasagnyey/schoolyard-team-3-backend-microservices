import type { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = Number(err?.status) || 500;
  const request_id = err?.request_id || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

 
  const code =
    status === 502 ? 'UPSTREAM_ERROR' :
    status === 400 ? 'BAD_REQUEST' :
    'INTERNAL_ERROR';

  const message =
    err?.message ||
    (status === 502
      ? 'Laravel leaderboard endpoint failed.'
      : status === 400
        ? 'Bad request.'
        : 'Unexpected server error.');

  res.status(status).json({
    meta: { request_id },
    data: null,
    errors: [{ code, message }]
  });
}
