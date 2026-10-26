import { prisma } from '../../database/prisma.js';
import { createError } from '../../middleware/errorHandler.js';

export const getCourses = async (category?: string) => {
  const where: any = {};
  if (category && category !== 'all') {
    where.category = category;
  }
  const courses = await prisma.gurukulCourse.findMany({
    where,
    orderBy: { createdAt: 'asc' },
  });
  return courses.map((c) => ({
    ...c,
    categoryLabel: c.categoryLabelEn,
    syllabusHighlights: c.syllabusHighlightsJson ? JSON.parse(c.syllabusHighlightsJson) : [],
  }));
};

export const getCourseById = async (id: string) => {
  const course = await prisma.gurukulCourse.findUnique({
    where: { id },
  });
  if (!course) {
    throw createError(`Gurukul course #${id} not found`, 404, 'NOT_FOUND');
  }
  return {
    ...course,
    categoryLabel: course.categoryLabelEn,
    syllabusHighlights: course.syllabusHighlightsJson ? JSON.parse(course.syllabusHighlightsJson) : [],
  };
};

export const submitAudioRecording = async (userId: string, data: { mantraTitle: string; durationSeconds: number }) => {
  const refNo = `#REC-${Math.floor(1000 + Math.random() * 9000)}-${String(Math.floor(1 + Math.random() * 99)).padStart(2, '0')}`;
  const submission = await prisma.gurukulSubmission.create({
    data: {
      userId,
      refNo,
      mantraTitle: data.mantraTitle,
      durationSeconds: data.durationSeconds,
      status: 'pending_review',
    },
  });
  return {
    ...submission,
    submissionId: submission.refNo,
  };
};

export const getMySubmissions = async (userId: string) => {
  const submissions = await prisma.gurukulSubmission.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  return submissions.map((s) => ({
    ...s,
    submissionId: s.refNo,
  }));
};
