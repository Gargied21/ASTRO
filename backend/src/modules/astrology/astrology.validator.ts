import { z } from 'zod';

export const submitQuestionSchema = z.object({
  category: z.string().min(2, 'Question category is required'),
  question: z.string().min(5, 'Question text must be at least 5 characters'),
  refBhav: z.string().min(2, 'Reference Bhav is required'),
});
