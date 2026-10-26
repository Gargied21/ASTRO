import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const memoryStore = new Map<string, RateLimitRecord>();

export const rateLimiter = (options?: { windowMs?: number; max?: number; message?: string }) => {
  const windowMs = options?.windowMs || env.RATE_LIMIT_WINDOW_MS;
  const max = options?.max || env.RATE_LIMIT_MAX_REQUESTS;
  const message = options?.message || 'Too many requests from this IP. Please try again after 15 minutes.';

  return (req: Request, res: Response, next: NextFunction) => {
    // In test environment, skip rate limiting
    if (env.NODE_ENV === 'test') {
      return next();
    }

    const ip = req.ip || req.socket.remoteAddress || 'unknown-client';
    const key = `${req.baseUrl || req.path}:${ip}`;
    const now = Date.now();

    const record = memoryStore.get(key);

    if (!record || now > record.resetTime) {
      memoryStore.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (record.count >= max) {
      return res.status(429).json({
        error: {
          code: 'TOO_MANY_REQUESTS',
          message,
          retryAfterSeconds: Math.ceil((record.resetTime - now) / 1000),
        },
      });
    }

    record.count += 1;
    next();
  };
};
