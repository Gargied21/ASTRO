import { prisma } from '../../database/prisma.js';

export const createInquiry = async (data: {
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
}) => {
  const inquiry = await prisma.contactInquiry.create({
    data: {
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email?.trim() || null,
      subject: data.subject || 'general',
      message: data.message.trim(),
    },
  });

  return inquiry;
};

export const getInquiries = async () => {
  const inquiries = await prisma.contactInquiry.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return inquiries;
};
