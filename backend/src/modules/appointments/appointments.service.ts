import crypto from 'crypto';
import { prisma } from '../../database/prisma.js';
import { createError } from '../../middleware/errorHandler.js';

export const createAppointment = async (data: any, userId?: string) => {
  const year = new Date().getFullYear();
  const count = await prisma.appointment.count();
  const suffix = crypto.randomBytes(2).toString('hex').toUpperCase();
  const slipId = `CVP-${year}-${String(100 + count + 1).padStart(4, '0')}-${suffix}`;

  const appointment = await prisma.appointment.create({
    data: {
      id: slipId,
      userId: userId || null,
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email?.trim() || null,
      serviceDomain: data.serviceDomain,
      serviceName: data.serviceName,
      consultationMode: data.consultationMode,
      slotDate: data.slotDate,
      slotTime: data.slotTime,
      status: 'confirmed',
      birthDate: data.birthDate?.trim() || null,
      birthTime: data.birthTime?.trim() || null,
      birthPlace: data.birthPlace?.trim() || null,
      notes: data.notes?.trim() || null,
      whatsappOptIn: data.whatsappOptIn !== false,
    },
  });

  if (userId) {
    await prisma.notification.create({
      data: {
        userId,
        titleEn: `Consultation Confirmed: ${appointment.serviceName}`,
        titleMr: `सत्र निश्चित झाले: ${appointment.serviceName}`,
        titleHi: `परामर्श सुनिश्चित: ${appointment.serviceName}`,
        titleGu: `સત્ર સુનિશ્ચિત: ${appointment.serviceName}`,
        timeEn: 'Just now',
        timeMr: 'आत्ताच',
        timeHi: 'अभी',
        timeGu: 'હમણાં જ',
        messageEn: `Provisional slip ${appointment.id} generated for ${appointment.slotDate} (${appointment.slotTime}).`,
        messageMr: `पावती क्र. ${appointment.id} तयार झाली आहे (${appointment.slotDate} • ${appointment.slotTime}).`,
        messageHi: `रसीद क्र. ${appointment.id} उत्पन्न की गई है (${appointment.slotDate} • ${appointment.slotTime})।`,
        messageGu: `પાવતી નં. ${appointment.id} જનરેટ થઈ છે (${appointment.slotDate} • ${appointment.slotTime}).`,
        unread: true,
        actionModule: 'appointments',
        actionTextEn: 'View Appointment',
        actionTextMr: 'अपॉइंटमेंट पहा',
        actionTextHi: 'अपॉइंटमेंट देखें',
        actionTextGu: 'એપોઇન્ટમેન્ટ જુઓ',
        icon: 'calendar_month',
      },
    });

    if (data.serviceDomain === 'jyotish') {
      const existingConsultation = await prisma.astrologyConsultation.findFirst({
        where: { userId },
      });
      if (!existingConsultation) {
        const consultId = `#JY-${String(8800 + count + 1)}-${suffix}`;
        await prisma.astrologyConsultation.create({
          data: {
            id: consultId,
            userId,
            acharyName: 'ज्योतिषाचार्य पं. गजाननशास्त्री पटवर्धन',
            acharyaTitle: 'संहिता व होरा शास्त्र विशारद • २८ वर्षे अनुभव',
            experience: '२८ वर्षे अनुभव',
            date: appointment.slotDate,
            time: appointment.slotTime,
            duration: '४५ मिनिटे (सखोल विश्लेषण)',
            mode: appointment.consultationMode === 'ashram' ? 'प्रत्यक्ष आश्रम भेट' : 'व्हिडिओ कॉल (HD Zoom / Google Meet)',
            location: appointment.consultationMode === 'ashram' ? 'मुख्य ज्योतिष दालन, आश्रम' : 'ऑनलाईन लिंक',
            status: 'confirmed',
            subject: appointment.serviceName,
          },
        });
      }
    }
  }

  return appointment;
};

export const getMyAppointments = async (userId: string) => {
  const appointments = await prisma.appointment.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  return appointments;
};

export const getAppointmentById = async (id: string) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id },
  });
  if (!appointment) {
    throw createError('Appointment slip not found', 404, 'NOT_FOUND');
  }
  return appointment;
};
