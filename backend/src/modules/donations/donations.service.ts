import crypto from 'crypto';
import { prisma } from '../../database/prisma.js';
import { createError } from '../../middleware/errorHandler.js';

export const getCurrentFinancialYear = (): string => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // 1-12
  if (currentMonth >= 4) {
    return `${currentYear}-${String(currentYear + 1).slice(-2)}`;
  } else {
    return `${currentYear - 1}-${String(currentYear).slice(-2)}`;
  }
};

export const createDonation = async (data: any, userId?: string) => {
  const fy = getCurrentFinancialYear();
  const year = new Date().getFullYear();
  const count = await prisma.donation.count();
  const suffix = crypto.randomBytes(2).toString('hex').toUpperCase();
  const receiptNo = `#CVP-${year}-${String(100 + count + 1).padStart(4, '0')}-${suffix}`;
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const donation = await prisma.donation.create({
    data: {
      receiptNo,
      userId: userId || null,
      donorName: data.donorName.trim(),
      donorPhone: data.donorPhone.trim(),
      donorPan: data.donorPan?.trim() || null,
      category: data.category,
      purpose: data.purpose,
      purposeMr: data.purposeMr || data.purpose,
      purposeHi: data.purposeHi || data.purpose,
      purposeGu: data.purposeGu || data.purpose,
      amount: data.amount,
      mode: data.mode || 'Razorpay UPI',
      status: '८०-जी जारी (Verified)',
      fy,
      date: dateFormatted,
      dateIso: now.toISOString(),
    },
  });

  if (userId) {
    if (data.donorPan?.trim()) {
      await prisma.user.update({
        where: { id: userId },
        data: { panNumber: data.donorPan.trim() },
      }).catch(() => {});
    }

    await prisma.notification.create({
      data: {
        userId,
        titleEn: `80G Tax Receipt Issued: ${receiptNo}`,
        titleMr: `८०-जी करसवलत पावती जारी: ${receiptNo}`,
        titleHi: `80G कर छूट रसीद जारी: ${receiptNo}`,
        titleGu: `૮૦G કર મુક્તિ પાવતી જારી: ${receiptNo}`,
        timeEn: 'Just now',
        timeMr: 'आत्ताच',
        timeHi: 'अभी',
        timeGu: 'હમણાં જ',
        messageEn: `Tax deduction receipt for ₹${data.amount} (${data.purpose}) is available for download.`,
        messageMr: `₹${data.amount} साठी करसवलत पावती तयार झाली आहे (${data.purpose}).`,
        messageHi: `₹${data.amount} हेतु कर छूट रसीद तैयार है (${data.purpose})।`,
        messageGu: `₹${data.amount} માટે કર મુક્તિ પાવતી તૈયાર છે (${data.purpose}).`,
        unread: true,
        actionModule: 'donations',
        actionTextEn: 'View Receipt',
        actionTextMr: 'पावती पहा',
        actionTextHi: 'रसीद देखें',
        actionTextGu: 'પાવતી જુઓ',
        icon: 'receipt_long',
      },
    });
  }

  return donation;
};

export const getReceipts = async (userId: string, fy?: string, category?: string) => {
  const where: any = { userId };
  if (fy && fy !== 'all') {
    where.fy = fy;
  }
  if (category && category !== 'all') {
    where.category = category;
  }
  const receipts = await prisma.donation.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
  return receipts;
};

export const getReceiptByNumber = async (receiptNo: string) => {
  const cleanNo = receiptNo.startsWith('#') ? receiptNo : `#${receiptNo}`;
  const receipt = await prisma.donation.findUnique({
    where: { receiptNo: cleanNo },
  });
  if (!receipt) {
    throw createError('Tax receipt not found', 404, 'NOT_FOUND');
  }
  return receipt;
};

export const getForm10BESummary = async (fy: string, userId: string) => {
  const where: any = { userId };
  if (fy && fy !== 'all') {
    where.fy = fy;
  }
  const [receipts, user] = await Promise.all([
    prisma.donation.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    }),
    prisma.user.findUnique({ where: { id: userId } }),
  ]);
  const totalAmount = receipts.reduce((sum, r) => sum + r.amount, 0);
  const latestPan = receipts.find((r) => r.donorPan)?.donorPan || user?.panNumber || '';

  return {
    financialYear: fy,
    fy,
    trustName: 'Chaitanya Ved Pratishthan (Reg. F-18492 Pune)',
    trustPan: 'AAATC8942D',
    trust80GRegNo: 'CIT(E)/PNE/80G/2021-22/A/10048',
    arn: `2425-CVPT-${userId.slice(-4).toUpperCase()}-BE`,
    donorName: user?.name || receipts[0]?.donorName || 'Registered Yajamana',
    panNumber: latestPan,
    donationCount: receipts.length,
    receiptsCount: receipts.length,
    totalEligibleAmount: totalAmount,
    totalAmount,
    receipts,
  };
};
