import { z } from 'zod';

export const createDonationSchema = z.object({
  amount: z.number().positive('Donation amount must be greater than zero'),
  category: z.string().default('anushthan'),
  purpose: z.string().min(2, 'Seva purpose description is required'),
  purposeMr: z.string().optional(),
  purposeHi: z.string().optional(),
  purposeGu: z.string().optional(),
  donorName: z.string().min(2, 'Donor name is required'),
  donorPhone: z.string().min(10, 'Valid donor phone number is required'),
  donorPan: z.string().optional().or(z.literal('')),
  mode: z.string().default('Razorpay UPI'),
});
