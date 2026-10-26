import { Request, Response, NextFunction } from 'express';
import * as astrologyService from './astrology.service.js';

export const handleGetConsultation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const consultation = await astrologyService.getConsultation(req.user!.id);
    res.status(200).json({ success: true, data: consultation });
  } catch (err) {
    next(err);
  }
};

export const handleGetQuestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const questions = await astrologyService.getQuestions(req.user!.id);
    res.status(200).json({ success: true, data: questions });
  } catch (err) {
    next(err);
  }
};

export const handleSubmitQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const question = await astrologyService.submitQuestion(req.user!.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Question submitted to Acharya Shastriji for Janmapatrika deliberation',
      data: question,
    });
  } catch (err) {
    next(err);
  }
};
