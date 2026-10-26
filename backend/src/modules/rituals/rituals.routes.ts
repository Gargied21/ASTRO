import { Router } from 'express';
import { z } from 'zod';
import * as ritualsController from './rituals.controller.js';
import { requireAuth } from '../../middleware/authMiddleware.js';
import { validate } from '../../middleware/validate.js';

export const ritualsRouter = Router();

const createRitualSchema = z.object({
  title: z.string().min(2, 'Ritual title is required'),
  titleMr: z.string().optional(),
  type: z.string().optional(),
  status: z.enum(['active', 'upcoming', 'completed']).optional(),
  statusLabel: z.string().optional(),
  dayProgress: z.string().optional().nullable(),
  japaCompleted: z.number().min(0).optional(),
  japaTotal: z.number().min(0).optional(),
  chiefHotri: z.string().optional(),
  assistantPandits: z.string().optional(),
  sankalpaIntent: z.string().min(2, 'Sankalpa intent is required'),
  todaySession: z.string().optional(),
  liveStreamAvailable: z.boolean().optional(),
  trackingNumber: z.string().optional().nullable(),
  trackingStatus: z.string().optional().nullable(),
  trackingSteps: z.array(z.any()).optional(),
  date: z.string().min(2, 'Ritual date is required'),
  amount: z.number().min(0, 'Amount must be non-negative'),
  recordingDuration: z.string().optional().nullable(),
  shlokaBlessing: z.string().optional().nullable(),
});

ritualsRouter.get('/', requireAuth, ritualsController.handleGetRituals);
ritualsRouter.get('/track/:trackingNumber', ritualsController.handleTrackPrasad);
ritualsRouter.get('/:id', requireAuth, ritualsController.handleGetRitualById);
ritualsRouter.post('/', requireAuth, validate({ body: createRitualSchema }), ritualsController.handleCreateRitual);
