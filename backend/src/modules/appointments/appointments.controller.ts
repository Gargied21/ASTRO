import { Request, Response, NextFunction } from 'express';
import * as appointmentsService from './appointments.service.js';

export const handleCreateAppointment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const appointment = await appointmentsService.createAppointment(req.body, userId);
    res.status(201).json({
      success: true,
      message: 'Appointment booking confirmed successfully and slip issued',
      data: appointment,
    });
  } catch (err) {
    next(err);
  }
};

export const handleGetMyAppointments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const appointments = await appointmentsService.getMyAppointments(req.user!.id);
    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (err) {
    next(err);
  }
};

export const handleGetAppointmentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const appointment = await appointmentsService.getAppointmentById(id);
    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (err) {
    next(err);
  }
};
