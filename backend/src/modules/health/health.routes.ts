import { Router, Request, Response } from 'express';
import { prisma } from '../../database/prisma.js';

export const healthRouter = Router();

healthRouter.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    service: 'Chaitanya Ved Pratishthan API',
  });
});

healthRouter.get('/ready', async (_req: Request, res: Response) => {
  try {
    // Ping database
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'ready',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(503).json({
      status: 'unavailable',
      database: 'disconnected',
      error: err?.message || 'Database readiness check failed',
    });
  }
});
