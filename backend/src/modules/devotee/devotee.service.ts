import { prisma } from '../../database/prisma.js';
import { createError } from '../../middleware/errorHandler.js';

export const getProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      familyMembers: true,
      settings: true,
    },
  });
  if (!user) {
    throw createError('Devotee profile not found', 404, 'NOT_FOUND');
  }
  return user;
};

export const updateProfile = async (userId: string, data: Record<string, any>) => {
  const allowedFields = [
    'name',
    'email',
    'gotra',
    'nakshatra',
    'charan',
    'rashi',
    'address',
    'dob',
    'tob',
    'pob',
    'kuladaivat',
    'panNumber',
  ];
  const updateData: Record<string, any> = {};
  for (const key of allowedFields) {
    if (data[key] !== undefined) {
      updateData[key] = data[key];
    }
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    include: {
      familyMembers: true,
      settings: true,
    },
  });
  return updated;
};

export const addFamilyMember = async (userId: string, data: { name: string; relation: string; nakshatra: string }) => {
  const member = await prisma.familyMember.create({
    data: {
      userId,
      name: data.name,
      relation: data.relation,
      nakshatra: data.nakshatra,
    },
  });
  return member;
};

export const deleteFamilyMember = async (userId: string, memberId: string) => {
  const member = await prisma.familyMember.findUnique({ where: { id: memberId } });
  if (!member || member.userId !== userId) {
    throw createError('Family member record not found or not owned by user', 404, 'NOT_FOUND');
  }
  await prisma.familyMember.delete({ where: { id: memberId } });
  return { success: true };
};

export const getSettings = async (userId: string) => {
  let settings = await prisma.devoteeSettings.findUnique({ where: { userId } });
  if (!settings) {
    settings = await prisma.devoteeSettings.create({
      data: {
        userId,
        language: 'mr',
        whatsappAlerts: true,
        emailDigest: true,
        panchangReminders: true,
      },
    });
  }
  return settings;
};

export const updateSettings = async (userId: string, data: Record<string, any>) => {
  const settings = await prisma.devoteeSettings.upsert({
    where: { userId },
    update: data,
    create: {
      userId,
      ...data,
    },
  });
  return settings;
};

export const getDashboardSummary = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      familyMembers: true,
      settings: true,
    },
  });
  if (!user) {
    throw createError('Devotee profile not found', 404, 'NOT_FOUND');
  }
  const [activeRitualsCount, upcomingAppointmentsCount, donationsAggregate, unreadNotificationsCount] = await Promise.all([
    prisma.ritual.count({
      where: {
        userId,
        status: 'active',
      },
    }),
    prisma.appointment.count({
      where: {
        userId,
        status: { in: ['confirmed', 'pending'] },
      },
    }),
    prisma.donation.aggregate({
      where: { userId },
      _sum: { amount: true },
      _count: { id: true },
    }),
    prisma.notification.count({
      where: {
        userId,
        unread: true,
      },
    }),
  ]);
  return {
    profile: user,
    stats: {
      activeRituals: activeRitualsCount,
      upcomingAppointments: upcomingAppointmentsCount,
      totalDonationsAmount: donationsAggregate._sum.amount || 0,
      totalDonationsCount: donationsAggregate._count.id || 0,
      unreadNotifications: unreadNotificationsCount,
    },
  };
};
