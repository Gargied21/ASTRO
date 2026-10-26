import { Router } from 'express';
import * as astrologyController from './astrology.controller.js';
import { submitQuestionSchema } from './astrology.validator.js';
import { validate } from '../../middleware/validate.js';
import { requireAuth } from '../../middleware/authMiddleware.js';

export const astrologyRouter = Router();

astrologyRouter.use(requireAuth);

astrologyRouter.get('/consultation', astrologyController.handleGetConsultation);
astrologyRouter.get('/questions', astrologyController.handleGetQuestions);
astrologyRouter.post(
  '/questions',
  validate({ body: submitQuestionSchema }),
  astrologyController.handleSubmitQuestion
);
