import { Request, Response, NextFunction } from 'express';
import * as poojasService from './poojas.service.js';

export const handleGetPoojas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, mode, search } = req.query;
    const poojas = await poojasService.getPoojas({
      category: category ? String(category) : undefined,
      mode: mode ? String(mode) : undefined,
      search: search ? String(search) : undefined,
    });
    res.status(200).json({ success: true, count: poojas.length, data: poojas });
  } catch (err) {
    next(err);
  }
};

export const handleGetPoojaById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const pooja = await poojasService.getPoojaById(id);
    res.status(200).json({ success: true, data: pooja });
  } catch (err) {
    next(err);
  }
};
