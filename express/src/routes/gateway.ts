import Express, { NextFunction, Request, Response, Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import type { Filter, Options, RequestHandler } from 'http-proxy-middleware';
const router: Router = Express.Router();


// create a proxy for each microservice
const assetProxyMiddleware = createProxyMiddleware<Request, Response>({
  target: 'http://localhost:3012/',
  changeOrigin: true
});
const designProxyMiddleware = createProxyMiddleware<Request, Response>({
  target: 'http://msappointments:3011/',
  changeOrigin: true
});
const laravelProxyMiddleware = createProxyMiddleware<Request, Response>({
  target: 'http://msappointments:5173/',
  changeOrigin: true
});


// router.get('/', (req: Request, res: Response, next: NextFunction) => {
//   res.json('hi');
// });
router.use('/', laravelProxyMiddleware);
router.use('/designs', designProxyMiddleware);
router.use('/assets', assetProxyMiddleware);

export default router;
