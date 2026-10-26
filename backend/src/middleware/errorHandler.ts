import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { env } from '../config/env.js';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: unknown;
}

export const createError = (message: string, statusCode = 400, code = 'BAD_REQUEST', details?: unknown): AppError => {
  const err: AppError = new Error(message);
  err.statusCode = statusCode;
  err.code = code;
  err.details = details;
  return err;
};

export const errorHandler = (err: AppError, _req: Request, res: Response, _next: NextFunction) => {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const formatted = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request payload validation failed',
        details: formatted,
      },
    });
  }

  const statusCode = err.statusCode || 500;
  const code = err.code || (statusCode >= 500 ? 'INTERNAL_SERVER_ERROR' : 'ERROR');
  const message = statusCode >= 500 && env.NODE_ENV === 'production'
    ? 'An unexpected error occurred. Please contact the Ashram Seva Desk.'
    : err.message || 'Internal server error';

  if (statusCode >= 500) {
    console.error('Unhandled Server Error:', err);
  }

  res.status(statusCode).json({
    error: {
      code,
      message,
      ...(err.details ? { details: err.details } : {}),
      ...(env.NODE_ENV !== 'production' && err.stack ? { stack: err.stack } : {}),
    },
  });
};

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  next(createError(`Route ${req.method} ${req.originalUrl} not found`, 404, 'NOT_FOUND'));
};
