import { Router } from 'express';
import { z } from 'zod';
import * as eventsController from './events.controller.js';
import { validate } from '../../middleware/validate.js';

export const eventsRouter = Router();

const registerEventSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  attendees: z.number().int().min(1).max(20).optional(),
});

eventsRouter.get('/', eventsController.handleGetEvents);
eventsRouter.get('/:id', eventsController.handleGetEventById);
eventsRouter.post('/:id/register', validate({ body: registerEventSchema }), eventsController.handleRegisterForEvent);
