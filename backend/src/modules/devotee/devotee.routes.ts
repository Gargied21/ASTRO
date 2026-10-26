import { Router } from 'express';
import * as devoteeController from './devotee.controller.js';
import { updateProfileSchema, addFamilyMemberSchema, updateSettingsSchema } from './devotee.validator.js';
import { validate } from '../../middleware/validate.js';
import { requireAuth } from '../../middleware/authMiddleware.js';

export const devoteeRouter = Router();

devoteeRouter.use(requireAuth);

devoteeRouter.get('/profile', devoteeController.handleGetProfile);
devoteeRouter.put('/profile', validate({ body: updateProfileSchema }), devoteeController.handleUpdateProfile);

devoteeRouter.post('/family', validate({ body: addFamilyMemberSchema }), devoteeController.handleAddFamilyMember);
devoteeRouter.delete('/family/:id', devoteeController.handleDeleteFamilyMember);

devoteeRouter.get('/settings', devoteeController.handleGetSettings);
devoteeRouter.put('/settings', validate({ body: updateSettingsSchema }), devoteeController.handleUpdateSettings);

devoteeRouter.get('/dashboard', devoteeController.handleGetDashboard);
