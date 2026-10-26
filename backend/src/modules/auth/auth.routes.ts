import { Router } from 'express';
import * as authController from './auth.controller.js';
import { requestOtpSchema, verifyOtpSchema, adminSetupSchema } from './auth.validator.js';
import { validate } from '../../middleware/validate.js';
import { requireAuth } from '../../middleware/authMiddleware.js';
import { rateLimiter } from '../../middleware/rateLimiter.js';

export const authRouter = Router();

// Rate limited OTP request: 10 per 15 mins
authRouter.post(
  '/request-otp',
  rateLimiter({ max: 10, windowMs: 15 * 60 * 1000 }),
  validate({ body: requestOtpSchema }),
  authController.handleRequestOtp
);

// Verify OTP
authRouter.post(
  '/verify-otp',
  validate({ body: verifyOtpSchema }),
  authController.handleVerifyOtp
);

// Current user profile
authRouter.get(
  '/me',
  requireAuth,
  authController.handleGetMe
);

// Logout
authRouter.post(
  '/logout',
  authController.handleLogout
);

// Admin bootstrap setup
authRouter.post(
  '/admin-setup',
  validate({ body: adminSetupSchema }),
  authController.handleAdminSetup
);
