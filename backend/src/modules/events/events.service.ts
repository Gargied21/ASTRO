import crypto from 'crypto';
import { prisma } from '../../database/prisma.js';
import { createError } from '../../middleware/errorHandler.js';

export const getEvents = async () => {
  const events = await prisma.event.findMany({
    orderBy: { createdAt: 'asc' },
  });
  return events;
};

export const getEventById = async (id: string) => {
  const event = await prisma.event.findUnique({
    where: { id },
  });
  if (!event) {
    throw createError(`Event #${id} not found`, 404, 'NOT_FOUND');
  }
  return event;
};

export const registerForEvent = async (eventId: string, data: { name: string; phone: string; attendees?: number }) => {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) {
    throw createError(`Event #${eventId} not found`, 404, 'NOT_FOUND');
  }
  const registration = await prisma.eventRegistration.create({
    data: {
      eventId,
      name: data.name.trim(),
      phone: data.phone.trim(),
      attendees: data.attendees || 1,
      status: 'confirmed',
    },
  });
  const suffix = crypto.randomBytes(2).toString('hex').toUpperCase();
  const passNumber = `UTSAV-2026-${registration.id.slice(-4).toUpperCase()}-${suffix}`;
  return {
    passNumber,
    registration,
    event,
  };
};
