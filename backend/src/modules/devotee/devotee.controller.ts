import { Request, Response, NextFunction } from 'express';
import * as devoteeService from './devotee.service.js';

export const handleGetProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await devoteeService.getProfile(req.user!.id);
    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
};

export const handleUpdateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await devoteeService.updateProfile(req.user!.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Devotee profile coordinates updated successfully',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

export const handleAddFamilyMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const member = await devoteeService.addFamilyMember(req.user!.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Family member registered for Vedic Sankalpa',
      data: member,
    });
  } catch (err) {
    next(err);
  }
};

export const handleDeleteFamilyMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    await devoteeService.deleteFamilyMember(req.user!.id, id);
    res.status(200).json({
      success: true,
      message: 'Family member removed successfully',
    });
  } catch (err) {
    next(err);
  }
};

export const handleGetSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await devoteeService.getSettings(req.user!.id);
    res.status(200).json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
};

export const handleUpdateSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await devoteeService.updateSettings(req.user!.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Devotee preferences saved successfully',
      data: settings,
    });
  } catch (err) {
    next(err);
  }
};

export const handleGetDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dashboard = await devoteeService.getDashboardSummary(req.user!.id);
    res.status(200).json({ success: true, data: dashboard });
  } catch (err) {
    next(err);
  }
};
