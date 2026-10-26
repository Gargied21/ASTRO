import test from 'node:test';
import assert from 'node:assert/strict';
import request from './testClient.js';
import { createApp } from '../src/app.js';
import { prisma } from '../src/database/prisma.js';
import { signToken } from '../src/middleware/authMiddleware.js';

test('Appointments API Tests', async (t) => {
  const app = createApp();

  await prisma.user.deleteMany({ where: { phone: '9899012345' } });
  const user = await prisma.user.create({
    data: {
      phone: '9899012345',
      name: 'Aditi Joshi',
      code: '#CVP-TEST-99',
    },
  });
  const token = signToken({ id: user.id, phone: user.phone, role: user.role });

  let createdSlipId = '';

  await t.test('POST /api/v1/appointments rejects missing required fields', async () => {
    const res = await request(app)
      .post('/api/v1/appointments')
      .send({ name: '' });
    assert.equal(res.status, 400);
    assert.equal(res.body.error.code, 'VALIDATION_ERROR');
  });

  await t.test('POST /api/v1/appointments creates real appointment and initializes Jyotish consultation', async () => {
    const res = await request(app)
      .post('/api/v1/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Aditi Joshi',
        phone: '9899012345',
        email: 'aditi@example.com',
        serviceDomain: 'jyotish',
        serviceName: 'Vedic Jyotish Consultation',
        consultationMode: 'online',
        slotDate: 'Tue, 20 May 2025',
        slotTime: '10:45 AM - 11:30 AM',
        birthDate: '1992-06-12',
        birthTime: '08:30 AM',
        birthPlace: 'Pune',
        notes: 'Career guidance',
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.id.startsWith('CVP-'));
    assert.equal(res.body.data.serviceName, 'Vedic Jyotish Consultation');
    assert.equal(res.body.data.userId, user.id);
    createdSlipId = res.body.data.id;

    // Verify AstrologyConsultation was auto-created for Jyotish booking
    const consultRes = await request(app)
      .get('/api/v1/astrology/consultation')
      .set('Authorization', `Bearer ${token}`);
    assert.equal(consultRes.status, 200);
    assert.ok(consultRes.body.data);
    assert.equal(consultRes.body.data.subject, 'Vedic Jyotish Consultation');
  });

  await t.test('GET /api/v1/appointments/:id returns the created appointment slip', async () => {
    const res = await request(app).get(`/api/v1/appointments/${createdSlipId}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.data.id, createdSlipId);
    assert.equal(res.body.data.name, 'Aditi Joshi');
  });

  await t.test('GET /api/v1/appointments/my returns devotee appointments list', async () => {
    const res = await request(app)
      .get('/api/v1/appointments/my')
      .set('Authorization', `Bearer ${token}`);
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.data));
    assert.equal(res.body.data.length >= 1, true);
    assert.equal(res.body.data[0].id, createdSlipId);
  });

  // Cleanup
  await prisma.astrologyConsultation.deleteMany({ where: { userId: user.id } });
  await prisma.appointment.deleteMany({ where: { userId: user.id } });
  await prisma.notification.deleteMany({ where: { userId: user.id } });
  await prisma.user.delete({ where: { id: user.id } });
});
