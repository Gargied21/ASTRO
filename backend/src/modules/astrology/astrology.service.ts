import { prisma } from '../../database/prisma.js';

export const getConsultation = async (userId: string) => {
  let consultation = await prisma.astrologyConsultation.findFirst({
    where: { userId },
    include: {
      questions: {
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return consultation;
};

export const getQuestions = async (userId: string) => {
  const questions = await prisma.astrologyQuestion.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  return questions;
};

export const submitQuestion = async (
  userId: string,
  data: { category: string; question: string; refBhav: string }
) => {
  // Find active consultation if any
  const consultation = await prisma.astrologyConsultation.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  const question = await prisma.astrologyQuestion.create({
    data: {
      userId,
      consultationId: consultation?.id || null,
      category: data.category,
      question: data.question,
      refBhav: data.refBhav,
      status: 'Reviewed by Shastriji',
    },
  });

  return question;
};
