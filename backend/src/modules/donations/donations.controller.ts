import { Request, Response, NextFunction } from 'express';
import * as donationsService from './donations.service.js';

export const handleCreateDonation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const donation = await donationsService.createDonation(req.body, userId);
    res.status(201).json({
      success: true,
      message: `Seva contribution recorded successfully. 80-G tax receipt ${donation.receiptNo} issued.`,
      data: {
        ...donation,
        donation,
        receipt: donation,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const handleGetReceipts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { fy, category } = req.query;
    const receipts = await donationsService.getReceipts(
      userId,
      fy ? String(fy) : undefined,
      category ? String(category) : undefined
    );
    res.status(200).json({
      success: true,
      data: receipts,
    });
  } catch (err) {
    next(err);
  }
};

export const handleGetReceiptByNumber = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const receiptNo = String(req.params.receiptNo);
    const receipt = await donationsService.getReceiptByNumber(receiptNo);
    res.status(200).json({
      success: true,
      data: receipt,
    });
  } catch (err) {
    next(err);
  }
};

export const handleGetForm10BE = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const fy = String(req.params.fy);
    const userId = req.user!.id;
    const summary = await donationsService.getForm10BESummary(fy, userId);
    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (err) {
    next(err);
  }
};
