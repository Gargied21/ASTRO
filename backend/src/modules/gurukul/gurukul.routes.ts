import { Router } from 'express';
import { z } from 'zod';
import * as gurukulController from './gurukul.controller.js';
import { requireAuth } from '../../middleware/authMiddleware.js';
import { validate } from '../../middleware/validate.js';

export const gurukulRouter = Router();

const submitAudioSchema = z.object({
  mantraTitle: z.string().min(2, 'Mantra title is required'),
  durationSeconds: z.number().int().min(1, 'Duration must be at least 1 second'),
});

gurukulRouter.get('/courses', gurukulController.handleGetCourses);
gurukulRouter.get('/courses/:id', gurukulController.handleGetCourseById);

// Devotee audio submissions
gurukulRouter.post('/submissions', requireAuth, validate({ body: submitAudioSchema }), gurukulController.handleSubmitAudio);
gurukulRouter.get('/submissions/my', requireAuth, gurukulController.handleGetMySubmissions);
