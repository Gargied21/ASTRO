import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { allowedOrigins } from './config/env.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Import routers
import { healthRouter } from './modules/health/health.routes.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { devoteeRouter } from './modules/devotee/devotee.routes.js';
import { appointmentsRouter } from './modules/appointments/appointments.routes.js';
import { donationsRouter } from './modules/donations/donations.routes.js';
import { ritualsRouter } from './modules/rituals/rituals.routes.js';
import { astrologyRouter } from './modules/astrology/astrology.routes.js';
import { poojasRouter } from './modules/poojas/poojas.routes.js';
import { gurukulRouter } from './modules/gurukul/gurukul.routes.js';
import { eventsRouter } from './modules/events/events.routes.js';
import { contactRouter } from './modules/contact/contact.routes.js';
import { notificationsRouter } from './modules/notifications/notifications.routes.js';

export const createApp = () => {
  const app = express();

  // Security Headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false, // Managed at frontend layer if needed
    })
  );

  // Cross-Origin Resource Sharing
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        // In local development, permit localhost ports dynamically
        if (/^http:\/\/localhost:\d+$/.test(origin) || /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) {
          return callback(null, true);
        }
        return callback(new Error(`CORS blocked request from origin: ${origin}`));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // Body parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Structured request logging
  app.use(requestLogger);

  // Operational health endpoints
  app.use('/', healthRouter);
  app.use('/api/v1', healthRouter);

  // Feature API v1 Endpoints
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/devotee', devoteeRouter);
  app.use('/api/v1/appointments', appointmentsRouter);
  app.use('/api/v1/donations', donationsRouter);
  app.use('/api/v1/rituals', ritualsRouter);
  app.use('/api/v1/astrology', astrologyRouter);
  app.use('/api/v1/poojas', poojasRouter);
  app.use('/api/v1/gurukul', gurukulRouter);
  app.use('/api/v1/events', eventsRouter);
  app.use('/api/v1/contact', contactRouter);
  app.use('/api/v1/notifications', notificationsRouter);

  // Root welcome route
  app.get('/', (_req, res) => {
    res.status(200).json({
      name: 'Chaitanya Ved Pratishthan REST API',
      version: '1.0.0',
      description: 'Authentic Vedic Research, Jyotish Shastra, Sacred Yadnik Poojas & Devotee Sanctum API',
      documentation: '/api/v1/docs',
      health: '/health',
    });
  });

  // 404 handler
  app.use(notFoundHandler);

  // Centralized Error handler
  app.use(errorHandler);

  return app;
};
