import { prisma } from '../../database/prisma.js';
import { signToken } from '../../middleware/authMiddleware.js';
import { createError } from '../../middleware/errorHandler.js';
import { env } from '../../config/env.js';

export const normalizePhone = (phone: string): string => {
  return phone.replace(/[\s\-()]/g, '');
};

export const requestOtp = async (rawPhone: string) => {
  const phone = normalizePhone(rawPhone);

  // Invalidate any existing active OTP sessions for this phone
  await prisma.otpSession.deleteMany({
    where: { phone },
  });

  // Generate 6-digit OTP
  const code = env.NODE_ENV === 'test' ? '584123' : Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

  await prisma.otpSession.create({
    data: {
      phone,
      code,
      expiresAt,
    },
  });

  console.log(`[AUTH] Sacred OTP generated for ${phone}: ${code} (Expires in 5m)`);

  return {
    phone,
    expiresInSeconds: 300,
    debugOtp: env.NODE_ENV !== 'production' ? code : undefined,
  };
};

export const verifyOtp = async (rawPhone: string, otp: string, name?: string) => {
  const phone = normalizePhone(rawPhone);

  const session = await prisma.otpSession.findFirst({
    where: {
      phone,
      verified: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!session) {
    throw createError('No valid OTP request found for this phone number. Please request a new OTP.', 400, 'OTP_EXPIRED');
  }

  if (session.attempts >= 5) {
    await prisma.otpSession.delete({ where: { id: session.id } });
    throw createError('Too many failed OTP attempts. Please request a new OTP.', 429, 'MAX_ATTEMPTS_EXCEEDED');
  }

  if (session.code !== otp) {
    await prisma.otpSession.update({
      where: { id: session.id },
      data: { attempts: { increment: 1 } },
    });
    throw createError('Invalid verification code entered. Please check and try again.', 400, 'INVALID_OTP');
  }

  await prisma.otpSession.update({
    where: { id: session.id },
    data: { verified: true },
  });

  let user = await prisma.user.findUnique({
    where: { phone },
    include: {
      familyMembers: true,
      settings: true,
    },
  });

  if (!user) {
    const randomCode = `#CVP-${Math.floor(1000 + Math.random() * 9000)}`;
    const devoteeName = name?.trim() || 'Devotee Yajamana';

    user = await prisma.user.create({
      data: {
        phone,
        name: devoteeName,
        code: randomCode,
        gotra: 'भारद्वाज (काश्यप प्रवर)',
        nakshatra: 'रोहिणी (द्वितीय चरण)',
        charan: '२',
        rashi: 'वृषभ (स्वामी: शुक्र)',
        kuladaivat: 'श्री कुलस्वामिनी तुळजाभवानी व खंडेराय',
        panNumber: null,
        settings: {
          create: {
            language: 'mr',
            whatsappAlerts: true,
            emailDigest: true,
            panchangReminders: true,
          },
        },
      },
      include: {
        familyMembers: true,
        settings: true,
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        titleEn: 'Welcome to Chaitanya Ved Pratishthan Devotee Sanctum',
        titleMr: 'चैतन्य वेद प्रतिष्ठान भक्त कक्षामध्ये आपले स्वागत आहे',
        titleHi: 'चैतन्य वेद प्रतिष्ठान भक्त कक्ष में आपका स्वागत है',
        titleGu: 'ચૈતન્ય વેદ પ્રતિષ્ઠાન ભક્ત કક્ષમાં આપનું સ્વાગત છે',
        timeEn: 'Just now',
        timeMr: 'आत्ताच',
        timeHi: 'अभी',
        timeGu: 'હમણાં જ',
        messageEn: 'Your sanctum profile has been initialized with Shastric data protection.',
        messageMr: 'आपले भक्त प्रोफाइल शास्त्रोक्त डेटा संरक्षणासह सक्रिय झाले आहे.',
        messageHi: 'आपका भक्त प्रोफाइल शास्त्रोक्त डेटा संरक्षण के साथ सक्रिय हो गया है।',
        messageGu: 'આપનું ભક્ત પ્રોફાઇલ શાસ્ત્રોક્ત ડેટા સુરક્ષા સાથે સક્રિય થઈ ગયું છે.',
        unread: true,
        actionModule: 'profile',
        actionTextEn: 'Complete Profile',
        actionTextMr: 'माहिती तपासा',
        actionTextHi: 'प्रोफाइल देखें',
        actionTextGu: 'પ્રોફાઇલ જુઓ',
        icon: 'verified_user',
      },
    });
  } else if (name && name.trim() && user.name === 'Devotee Yajamana') {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { name: name.trim() },
      include: {
        familyMembers: true,
        settings: true,
      },
    });
  }

  const token = signToken({
    id: user.id,
    phone: user.phone,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      code: user.code,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      gotra: user.gotra,
      nakshatra: user.nakshatra,
      charan: user.charan,
      rashi: user.rashi,
      address: user.address,
      dob: user.dob,
      tob: user.tob,
      pob: user.pob,
      kuladaivat: user.kuladaivat,
      panNumber: user.panNumber,
      familyMembers: user.familyMembers,
      settings: user.settings,
    },
  };
};

export const adminSetup = async (setupToken: string, phone: string, name: string, email?: string) => {
  if (setupToken !== env.ADMIN_SETUP_TOKEN) {
    throw createError('Invalid administrative bootstrap token', 403, 'FORBIDDEN');
  }

  const normalized = normalizePhone(phone);
  const existing = await prisma.user.findUnique({ where: { phone: normalized } });

  if (existing) {
    const updated = await prisma.user.update({
      where: { id: existing.id },
      data: { role: 'ADMIN', name, email },
    });
    const token = signToken({ id: updated.id, phone: updated.phone, role: updated.role });
    return { token, user: updated };
  }

  const adminUser = await prisma.user.create({
    data: {
      phone: normalized,
      name,
      email,
      role: 'ADMIN',
      code: '#CVP-ADMIN-01',
      gotra: 'कश्यप',
      nakshatra: 'अश्विनी',
      charan: '१',
      rashi: 'मेष',
    },
  });

  const token = signToken({ id: adminUser.id, phone: adminUser.phone, role: adminUser.role });
  return { token, user: adminUser };
};
