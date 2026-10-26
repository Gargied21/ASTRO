import { Router } from 'express';
import * as donationsController from './donations.controller.js';
import { createDonationSchema } from './donations.validator.js';
import { validate } from '../../middleware/validate.js';
import { optionalAuth, requireAuth } from '../../middleware/authMiddleware.js';

export const donationsRouter = Router();

// Create donation (guest or authenticated)
donationsRouter.post('/', optionalAuth, validate({ body: createDonationSchema }), donationsController.handleCreateDonation);

// Get my receipts / filtered receipts (authenticated only — prevents cross-user data leak)
donationsRouter.get('/receipts', requireAuth, donationsController.handleGetReceipts);

// Get single receipt by receipt number
donationsRouter.get('/receipts/:receiptNo', donationsController.handleGetReceiptByNumber);

// Get Form 10BE annual statement (authenticated only — prevents cross-user data leak)
donationsRouter.get('/form10be/:fy', requireAuth, donationsController.handleGetForm10BE);
