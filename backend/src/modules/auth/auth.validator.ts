import { z } from 'zod';

export const requestOtpSchema = z.object({
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number too long')
    .regex(/^[0-9+\s-]+$/, 'Invalid phone number characters'),
});

export const verifyOtpSchema = z.object({
  phone: z.string().min(10),
  otp: z.string().length(6, 'OTP must be exactly 6 digits').regex(/^[0-9]{6}$/, 'OTP must be 6 digits'),
  name: z.string().optional(),
});

export const adminSetupSchema = z.object({
  setupToken: z.string().min(1, 'Setup token required'),
  phone: z.string().min(10),
  name: z.string().min(2),
  email: z.string().email().optional(),
});
