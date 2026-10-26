import { Router } from 'express';
import * as poojasController from './poojas.controller.js';

export const poojasRouter = Router();

poojasRouter.get('/', poojasController.handleGetPoojas);
poojasRouter.get('/:id', poojasController.handleGetPoojaById);
