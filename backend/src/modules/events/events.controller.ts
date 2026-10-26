import { Request, Response, NextFunction } from 'express';
import * as eventsService from './events.service.js';

export const handleGetEvents = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const events = await eventsService.getEvents();
    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (err) {
    next(err);
  }
};

export const handleGetEventById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const event = await eventsService.getEventById(id);
    res.status(200).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

export const handleRegisterForEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const { name, phone, attendees } = req.body;
    const result = await eventsService.registerForEvent(id, {
      name,
      phone,
      attendees: attendees ? Number(attendees) : 1,
    });
    res.status(201).json({
      success: true,
      message: `Your E-Pass for (${result.event.title}) has been reserved successfully! SMS confirmation sent.`,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
