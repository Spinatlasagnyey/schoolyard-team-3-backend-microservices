import type { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = Number(err?.status) || 500;

  res.status(status).json({
    ok: false,
    error: {
      message: err?.message || 'Unknown error',
      status,
    },
  });
}
