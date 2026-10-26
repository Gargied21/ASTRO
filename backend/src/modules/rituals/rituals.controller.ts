import { Request, Response, NextFunction } from 'express';
import * as ritualsService from './rituals.service.js';

export const handleGetRituals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { status } = req.query;
    const rituals = await ritualsService.getRituals(userId, status ? String(status) : undefined);
    res.status(200).json({ success: true, data: rituals });
  } catch (err) {
    next(err);
  }
};

export const handleGetRitualById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const ritual = await ritualsService.getRitualById(id, req.user?.id);
    res.status(200).json({ success: true, data: ritual });
  } catch (err) {
    next(err);
  }
};

export const handleCreateRitual = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const ritual = await ritualsService.createRitual(req.body, userId);
    res.status(201).json({
      success: true,
      message: 'Vedic ritual booked successfully',
      data: ritual,
    });
  } catch (err) {
    next(err);
  }
};

export const handleTrackPrasad = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const trackingNumber = String(req.params.trackingNumber);
    const status = await ritualsService.trackPrasad(trackingNumber);
    res.status(200).json({ success: true, data: status });
  } catch (err) {
    next(err);
  }
};
