import { prisma } from '../../database/prisma.js';
import { createError } from '../../middleware/errorHandler.js';

export const getNotifications = async (userId: string) => {
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  return notifications;
};

export const markAsRead = async (userId: string, id: string) => {
  const notification = await prisma.notification.findUnique({ where: { id } });
  if (!notification || notification.userId !== userId) {
    throw createError('Notification not found', 404, 'NOT_FOUND');
  }
  const updated = await prisma.notification.update({
    where: { id },
    data: { unread: false },
  });
  return updated;
};

export const markAllAsRead = async (userId: string) => {
  await prisma.notification.updateMany({
    where: { userId, unread: true },
    data: { unread: false },
  });
  return { success: true };
};
