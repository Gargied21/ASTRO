import crypto from 'crypto';
import { prisma } from '../../database/prisma.js';
import { createError } from '../../middleware/errorHandler.js';

export const getRituals = async (userId: string, status?: string) => {
  const where: any = { userId };
  if (status && status !== 'all') {
    where.status = status;
  }
  const rituals = await prisma.ritual.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
  return rituals.map((r) => ({
    ...r,
    trackingSteps: r.trackingStepsJson ? JSON.parse(r.trackingStepsJson) : [],
  }));
};

export const getRitualById = async (id: string, userId?: string) => {
  const ritual = await prisma.ritual.findUnique({
    where: { id },
  });
  if (!ritual || (userId && ritual.userId && ritual.userId !== userId)) {
    throw createError('Ritual record not found', 404, 'NOT_FOUND');
  }
  return {
    ...ritual,
    trackingSteps: ritual.trackingStepsJson ? JSON.parse(ritual.trackingStepsJson) : [],
  };
};

export const createRitual = async (data: any, userId: string) => {
  const suffix = crypto.randomBytes(3).toString('hex').toUpperCase();
  const trackingNumber = data.trackingNumber || `IP${suffix}IN`;
  const defaultTrackingSteps = [
    { label: 'संकल्प व विधी नोंदणी (Sankalpa Registered)', date: data.date, done: true },
    { label: 'यज्ञ भस्म व सिद्ध रक्षासूत्र पॅकिंग (Prasad Consecration)', date: data.date, done: false },
    { label: 'भारतीय डाक स्पीड पोस्ट रवाना (Speed Post Dispatch)', date: 'Pending Purnahuti', done: false },
  ];

  const ritual = await prisma.ritual.create({
    data: {
      userId,
      title: data.title,
      titleMr: data.titleMr || data.title,
      type: data.type || 'महायज्ञ व अनुष्ठान',
      status: data.status || 'upcoming',
      statusLabel: data.statusLabel || 'आगामी विधी • Scheduled & Confirmed',
      dayProgress: data.dayProgress || 'Day 1 • Sankalpa Scheduled',
      japaCompleted: data.japaCompleted ?? 0,
      japaTotal: data.japaTotal ?? 100000,
      chiefHotri: data.chiefHotri || 'वे. मू. डॉ. श्रीपाद भट (घनापाठी)',
      assistantPandits: data.assistantPandits || '४ वेद ब्रह्मवृंद',
      sankalpaIntent: data.sankalpaIntent,
      todaySession: data.todaySession || 'सकाळी ०८:०० ते १२:००',
      liveStreamAvailable: data.liveStreamAvailable ?? true,
      trackingNumber,
      trackingStatus: data.trackingStatus || 'Pending Purnahuti Dispatch',
      trackingStepsJson: JSON.stringify(data.trackingSteps || defaultTrackingSteps),
      date: data.date,
      amount: data.amount,
      recordingDuration: data.recordingDuration || null,
      shlokaBlessing: data.shlokaBlessing || null,
    },
  });

  await prisma.notification.create({
    data: {
      userId,
      titleEn: `Ritual Scheduled: ${ritual.title}`,
      titleMr: `अनुष्ठान निश्चित झाले: ${ritual.titleMr}`,
      titleHi: `अनुष्ठान सुनिश्चित: ${ritual.title}`,
      titleGu: `અનુષ્ઠાન સુનિશ્ચિત: ${ritual.title}`,
      timeEn: 'Just now',
      timeMr: 'आत्ताच',
      timeHi: 'अभी',
      timeGu: 'હમણાં જ',
      messageEn: `Your Sankalpa for ${ritual.title} on ${ritual.date} is confirmed. Tracking ID: ${trackingNumber}.`,
      messageMr: `${ritual.date} रोजी ${ritual.titleMr} संकल्प निश्चित झाला आहे. ट्रॅकिंग क्र.: ${trackingNumber}.`,
      messageHi: `${ritual.date} को ${ritual.title} संकल्प सुनिश्चित हुआ। ट्रैकिंग क्र.: ${trackingNumber}।`,
      messageGu: `${ritual.date} ના રોજ ${ritual.title} સંકલ્પ સુનિશ્ચિત થયો. ટ્રેકિંગ नं.: ${trackingNumber}.`,
      unread: true,
      actionModule: 'rituals',
      actionTextEn: 'View Ritual',
      actionTextMr: 'विधी पहा',
      actionTextHi: 'अनुष्ठान देखें',
      actionTextGu: 'વિધિ જુઓ',
      icon: 'local_fire_department',
    },
  });

  return {
    ...ritual,
    trackingSteps: ritual.trackingStepsJson ? JSON.parse(ritual.trackingStepsJson) : [],
  };
};

export const trackPrasad = async (trackingNumber: string) => {
  const ritual = await prisma.ritual.findFirst({
    where: { trackingNumber },
  });
  if (!ritual) {
    throw createError(`Consignment #${trackingNumber} not found in Ashram dispatch registry`, 404, 'NOT_FOUND');
  }
  const statusLabel = ritual.trackingStatus || 'In Transit • Speed Post';
  return {
    trackingNumber: ritual.trackingNumber,
    trackingStatus: statusLabel,
    status: statusLabel,
    carrier: 'India Post Speed Post (Bharatiya Dak)',
    ritualTitle: ritual.titleMr || ritual.title,
    steps: ritual.trackingStepsJson ? JSON.parse(ritual.trackingStepsJson) : [],
  };
};
