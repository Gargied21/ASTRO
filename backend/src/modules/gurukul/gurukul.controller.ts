import { Request, Response, NextFunction } from 'express';
import * as gurukulService from './gurukul.service.js';

export const handleGetCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category } = req.query;
    const courses = await gurukulService.getCourses(category ? String(category) : undefined);
    res.status(200).json({ success: true, count: courses.length, data: courses });
  } catch (err) {
    next(err);
  }
};

export const handleGetCourseById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const course = await gurukulService.getCourseById(id);
    res.status(200).json({ success: true, data: course });
  } catch (err) {
    next(err);
  }
};

export const handleSubmitAudio = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mantraTitle, durationSeconds } = req.body;
    const submission = await gurukulService.submitAudioRecording(req.user!.id, {
      mantraTitle: mantraTitle || 'Mantra Recitation',
      durationSeconds: Number(durationSeconds) || 30,
    });
    res.status(201).json({
      success: true,
      message: `Your Vedic mantra audio recording has been submitted for Acharya pronunciation review! Ref: ${submission.refNo}`,
      data: submission,
    });
  } catch (err) {
    next(err);
  }
};

export const handleGetMySubmissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const submissions = await gurukulService.getMySubmissions(req.user!.id);
    res.status(200).json({ success: true, data: submissions });
  } catch (err) {
    next(err);
  }
};
