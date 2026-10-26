import { Request, Response, NextFunction } from 'express';
import * as notificationsService from './notifications.service.js';

export const handleGetNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notifications = await notificationsService.getNotifications(req.user!.id);
    res.status(200).json({ success: true, count: notifications.length, data: notifications });
  } catch (err) {
    next(err);
  }
};

export const handleMarkAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const updated = await notificationsService.markAsRead(req.user!.id, id);
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

export const handleMarkAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await notificationsService.markAllAsRead(req.user!.id);
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
};
