import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service.js';
import { prisma } from '../../database/prisma.js';
import { createError } from '../../middleware/errorHandler.js';

export const handleRequestOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone } = req.body;
    const result = await authService.requestOtp(phone);
    res.status(200).json({
      success: true,
      message: 'Sacred OTP generated and dispatched via SMS & WhatsApp',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const handleVerifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone, otp, name } = req.body;
    const result = await authService.verifyOtp(phone, otp, name);
    res.status(200).json({
      success: true,
      message: 'Authentication successful. Welcome to Devotee Sanctum.',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const handleGetMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(createError('Not authenticated', 401, 'UNAUTHORIZED'));
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        familyMembers: true,
        settings: true,
      },
    });

    if (!user) {
      return next(createError('User not found', 404, 'NOT_FOUND'));
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

export const handleLogout = async (_req: Request, res: Response) => {
  // In JWT stateless auth, logout is handled client-side by clearing stored token.
  res.status(200).json({
    success: true,
    message: 'Signed out of Devotee Sanctum successfully.',
  });
};

export const handleAdminSetup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { setupToken, phone, name, email } = req.body;
    const result = await authService.adminSetup(setupToken, phone, name, email);
    res.status(200).json({
      success: true,
      message: 'Admin account initialized successfully',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
