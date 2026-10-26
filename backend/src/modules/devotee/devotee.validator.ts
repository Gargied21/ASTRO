import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional().nullable().or(z.literal('')),
  gotra: z.string().min(2).optional(),
  nakshatra: z.string().min(2).optional(),
  charan: z.string().optional(),
  rashi: z.string().optional(),
  address: z.string().optional().nullable(),
  dob: z.string().optional().nullable(),
  tob: z.string().optional().nullable(),
  pob: z.string().optional().nullable(),
  kuladaivat: z.string().optional().nullable(),
  panNumber: z.string().optional().nullable(),
});

export const addFamilyMemberSchema = z.object({
  name: z.string().min(2, 'Member name is required'),
  relation: z.string().min(2, 'Relation is required'),
  nakshatra: z.string().min(2, 'Nakshatra is required'),
});

export const updateSettingsSchema = z.object({
  language: z.enum(['mr', 'en', 'hi', 'gu']).optional(),
  whatsappAlerts: z.boolean().optional(),
  emailDigest: z.boolean().optional(),
  panchangReminders: z.boolean().optional(),
});
