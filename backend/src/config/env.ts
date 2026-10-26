import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('4000').transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().default('file:./dev.db'),
  FRONTEND_ORIGIN: z.string().default('http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters long').default('chaitanya-ved-pratishthan-sacred-jwt-secret-key-32chars-min'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  RATE_LIMIT_WINDOW_MS: z.string().default('900000').transform((val) => parseInt(val, 10)),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100').transform((val) => parseInt(val, 10)),
  ADMIN_SETUP_TOKEN: z.string().default('cvp-shastric-admin-setup-key-2026'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid backend environment variables:', parsed.error.format());
  throw new Error('Invalid backend environment configuration');
}

export const env = parsed.data;

export const allowedOrigins = env.FRONTEND_ORIGIN.split(',').map((o) => o.trim());
