import { z } from 'zod';

export const createAppointmentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email().optional().or(z.literal('')),
  serviceDomain: z.enum(['jyotish', 'pooja', 'vastu']),
  serviceName: z.string().min(2),
  consultationMode: z.enum(['online', 'ashram']),
  slotDate: z.string().min(3),
  slotTime: z.string().min(3),
  birthDate: z.string().optional().or(z.literal('')),
  birthTime: z.string().optional().or(z.literal('')),
  birthPlace: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
  whatsappOptIn: z.boolean().default(true),
});
