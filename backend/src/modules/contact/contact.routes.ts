import { Router } from 'express';
import * as contactController from './contact.controller.js';
import { z } from 'zod';
import { validate } from '../../middleware/validate.js';
import { rateLimiter } from '../../middleware/rateLimiter.js';
import { requireAuth, requireRole } from '../../middleware/authMiddleware.js';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email().optional().or(z.literal('')),
  subject: z.string().optional(),
  message: z.string().min(5, 'Message must be at least 5 characters'),
});

export const contactRouter = Router();

contactRouter.post(
  '/',
  rateLimiter({ max: 10, windowMs: 15 * 60 * 1000 }),
  validate({ body: contactSchema }),
  contactController.handleCreateInquiry
);
contactRouter.get('/', requireAuth, requireRole('ADMIN', 'ACHARYA'), contactController.handleGetInquiries);
