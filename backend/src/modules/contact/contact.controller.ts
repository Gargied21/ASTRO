import { Request, Response, NextFunction } from 'express';
import * as contactService from './contact.service.js';

export const handleCreateInquiry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inquiry = await contactService.createInquiry(req.body);
    res.status(201).json({
      success: true,
      message: 'Your inquiry has been received by the Ashram coordination desk. We will contact you within 24 hours.',
      data: inquiry,
    });
  } catch (err) {
    next(err);
  }
};

export const handleGetInquiries = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const inquiries = await contactService.getInquiries();
    res.status(200).json({ success: true, count: inquiries.length, data: inquiries });
  } catch (err) {
    next(err);
  }
};
