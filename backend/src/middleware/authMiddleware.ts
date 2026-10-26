import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../database/prisma.js';
import { createError } from './errorHandler.js';

export interface AuthUser {
  id: string;
  phone: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export const signToken = (payload: AuthUser): string => {
  const options: SignOptions = {
    expiresIn: (env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, env.JWT_SECRET, options);
};

export const requireAuth = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(createError('Authentication required. Missing Bearer token.', 401, 'UNAUTHORIZED'));
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthUser;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, phone: true, role: true },
    });

    if (!user) {
      return next(createError('User account associated with token not found', 401, 'UNAUTHORIZED'));
    }

    req.user = user;
    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return next(createError('Invalid or expired authentication token', 401, 'INVALID_TOKEN'));
    }
    next(err);
  }
};

export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(createError('Authentication required. Missing Bearer token.', 401, 'UNAUTHORIZED'));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(createError('Insufficient role permissions for this resource', 403, 'FORBIDDEN'));
    }
    next();
  };
};

export const optionalAuth = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, env.JWT_SECRET) as AuthUser;
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, phone: true, role: true },
      });
      if (user) {
        req.user = user;
      }
    }
    next();
  } catch {
    next();
  }
};
