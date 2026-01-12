import express, { type Request, type Response, type NextFunction } from 'express';
import gatewayRouter from './routes/gateway';
import leaderboardRouter from './routes/leaderboard';
import { errorHandler } from './middleware/errors/errorHandler';

const app = express();

// If you ever POST later; harmless now
app.use(express.json());

// Basic CORS (so Svelte dev server can call :3002 easily)
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Routes
app.use('/', gatewayRouter);
app.use('/api/leaderboard', leaderboardRouter);

// Error handler last
app.use(errorHandler);

export default app;
