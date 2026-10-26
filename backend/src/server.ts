import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './database/prisma.js';

const startServer = async () => {
  try {
    await connectDatabase();

    const app = createApp();

    const server = app.listen(env.PORT, '0.0.0.0', () => {
      console.log(`
=====================================================
🕉️  CHAITANYA VED PRATISHTHAN (ASTRO) BACKEND API
=====================================================
📡  Environment : ${env.NODE_ENV}
🚀  Server      : http://localhost:${env.PORT}
🩺  Health Check: http://localhost:${env.PORT}/health
📚  API Base    : http://localhost:${env.PORT}/api/v1
=====================================================
      `);
    });

    const shutdown = async (signal: string) => {
      console.log(`\n[${signal}] Initiating graceful shutdown...`);
      server.close(async () => {
        console.log('HTTP server closed.');
        await disconnectDatabase();
        console.log('Database disconnected. Exiting cleanly.');
        process.exit(0);
      });

      // Force close if graceful shutdown hangs
      setTimeout(() => {
        console.error('Graceful shutdown timed out. Forcing termination.');
        process.exit(1);
      }, 5000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err) {
    console.error('Failed to start ASTRO backend server:', err);
    process.exit(1);
  }
};

startServer();
