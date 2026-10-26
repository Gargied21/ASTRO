import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

export const connectDatabase = async () => {
  try {
    await prisma.$connect();
    console.log('🕉️ Connected to persistent database via Prisma');
  } catch (err) {
    console.error('❌ Failed to connect to database:', err);
    throw err;
  }
};

export const disconnectDatabase = async () => {
  await prisma.$disconnect();
};
