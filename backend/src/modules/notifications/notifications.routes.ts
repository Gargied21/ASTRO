import { Router } from 'express';
import * as notificationsController from './notifications.controller.js';
import { requireAuth } from '../../middleware/authMiddleware.js';

export const notificationsRouter = Router();

notificationsRouter.use(requireAuth);

notificationsRouter.get('/', notificationsController.handleGetNotifications);
notificationsRouter.patch('/:id/read', notificationsController.handleMarkAsRead);
notificationsRouter.post('/mark-all-read', notificationsController.handleMarkAllAsRead);
