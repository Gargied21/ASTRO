import { Router } from 'express';
import * as appointmentsController from './appointments.controller.js';
import { createAppointmentSchema } from './appointments.validator.js';
import { validate } from '../../middleware/validate.js';
import { requireAuth, optionalAuth } from '../../middleware/authMiddleware.js';

export const appointmentsRouter = Router();

// Create appointment (supports guest booking or authenticated booking)
appointmentsRouter.post(
  '/',
  optionalAuth,
  validate({ body: createAppointmentSchema }),
  appointmentsController.handleCreateAppointment
);

// Get my appointments (authenticated)
appointmentsRouter.get(
  '/my',
  requireAuth,
  appointmentsController.handleGetMyAppointments
);

// Get single appointment by slip ID
appointmentsRouter.get(
  '/:id',
  appointmentsController.handleGetAppointmentById
);
