import test from 'node:test';
import assert from 'node:assert/strict';
import request from './testClient.js';
import { createApp } from '../src/app.js';
import { prisma } from '../src/database/prisma.js';
import { signToken } from '../src/middleware/authMiddleware.js';

test('Catalog, Events, Contact, Rituals, Gurukul, and Devotee Tests', async (t) => {
  const app = createApp();

  await prisma.user.deleteMany({ where: { phone: { in: ['9877665544', '9877665599'] } } });

  const user = await prisma.user.create({
    data: {
      phone: '9877665544',
      name: 'Madhura Kulkarni',
      code: '#CVP-TEST-77',
      gotra: 'भारद्वाज',
      role: 'DEVOTEE',
    },
  });
  const token = signToken({ id: user.id, phone: user.phone, role: user.role });

  const adminUser = await prisma.user.create({
    data: {
      phone: '9877665599',
      name: 'Acharya Admin',
      code: '#CVP-ADMIN-99',
      gotra: 'काश्यप',
      role: 'ADMIN',
    },
  });
  const adminToken = signToken({ id: adminUser.id, phone: adminUser.phone, role: adminUser.role });

  await t.test('GET /api/v1/poojas returns canonical 8-pooja catalog', async () => {
    const res = await request(app).get('/api/v1/poojas');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.count, 8);
  });

  await t.test('GET /api/v1/poojas/maha-mrityunjaya returns specific pooja details', async () => {
    const res = await request(app).get('/api/v1/poojas/maha-mrityunjaya');
    assert.equal(res.status, 200);
    assert.equal(res.body.data.id, 'maha-mrityunjaya');
    assert.ok(Array.isArray(res.body.data.benefits));
  });

  await t.test('GET /api/v1/gurukul/courses returns canonical 6 courses with categoryLabel', async () => {
    const res = await request(app).get('/api/v1/gurukul/courses');
    assert.equal(res.status, 200);
    assert.equal(res.body.count, 6);
    assert.ok(res.body.data[0].categoryLabel);
  });

  await t.test('POST /api/v1/gurukul/submissions validates payload and returns submissionId & refNo', async () => {
    const badRes = await request(app)
      .post('/api/v1/gurukul/submissions')
      .set('Authorization', `Bearer ${token}`)
      .send({ mantraTitle: '', durationSeconds: 0 });
    assert.equal(badRes.status, 400);

    const res = await request(app)
      .post('/api/v1/gurukul/submissions')
      .set('Authorization', `Bearer ${token}`)
      .send({ mantraTitle: 'गणानां त्वा गणपतिं हवामहे (ऋ. २.२३.१)', durationSeconds: 42 });
    assert.equal(res.status, 201);
    assert.ok(res.body.data.refNo.startsWith('#REC-'));
    assert.equal(res.body.data.submissionId, res.body.data.refNo);
  });

  await t.test('POST /api/v1/contact saves inquiry and GET /api/v1/contact enforces ADMIN/ACHARYA RBAC', async () => {
    const res = await request(app)
      .post('/api/v1/contact')
      .send({
        name: 'Suresh Patil',
        phone: '9822199887',
        email: 'suresh@example.com',
        subject: 'pooja',
        message: 'Inquiring about Shravan Rudrabhishek arrangements.',
      });
    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.name, 'Suresh Patil');

    // Unauthenticated GET /api/v1/contact must return 401
    const unauthRes = await request(app).get('/api/v1/contact');
    assert.equal(unauthRes.status, 401);

    // Regular DEVOTEE GET /api/v1/contact must return 403
    const devoteeRes = await request(app)
      .get('/api/v1/contact')
      .set('Authorization', `Bearer ${token}`);
    assert.equal(devoteeRes.status, 403);

    // ADMIN GET /api/v1/contact succeeds
    const adminRes = await request(app)
      .get('/api/v1/contact')
      .set('Authorization', `Bearer ${adminToken}`);
    assert.equal(adminRes.status, 200);
    assert.ok(Array.isArray(adminRes.body.data));
  });

  await t.test('POST /api/v1/events/event-1/register validates payload and returns passNumber', async () => {
    const badRes = await request(app)
      .post('/api/v1/events/event-1/register')
      .send({ name: '', phone: '123' });
    assert.equal(badRes.status, 400);

    const res = await request(app)
      .post('/api/v1/events/event-1/register')
      .send({
        name: 'Madhura Kulkarni',
        phone: '9877665544',
        attendees: 2,
      });
    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.passNumber.startsWith('UTSAV-2026-'));
    assert.equal(res.body.data.registration.attendees, 2);
  });

  await t.test('PUT /api/v1/devotee/profile and Family Member CRUD persist to SQLite', async () => {
    const res = await request(app)
      .put('/api/v1/devotee/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        gotra: 'काश्यप',
        nakshatra: 'पुष्य',
        panNumber: 'ABCDE1234F',
      });
    assert.equal(res.status, 200);
    assert.equal(res.body.data.gotra, 'काश्यप');
    assert.equal(res.body.data.nakshatra, 'पुष्य');
    assert.equal(res.body.data.panNumber, 'ABCDE1234F');

    const addFamRes = await request(app)
      .post('/api/v1/devotee/family')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Atharva Kulkarni',
        relation: 'Putra (Son)',
        nakshatra: 'रोहिणी',
      });
    assert.equal(addFamRes.status, 201);
    const memberId = addFamRes.body.data.id;

    const delFamRes = await request(app)
      .delete(`/api/v1/devotee/family/${memberId}`)
      .set('Authorization', `Bearer ${token}`);
    assert.equal(delFamRes.status, 200);
  });

  await t.test('GET & POST /api/v1/rituals enforce auth, validation, and prasad tracking', async () => {
    const unauthRes = await request(app).get('/api/v1/rituals');
    assert.equal(unauthRes.status, 401);

    const createRes = await request(app)
      .post('/api/v1/rituals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Laghu Rudra Abhishek',
        sankalpaIntent: 'Kutumba Arogya & Shanti',
        date: '25 May 2025',
        amount: 15000,
      });
    assert.equal(createRes.status, 201);
    assert.ok(createRes.body.data.trackingNumber);

    const trackRes = await request(app).get(`/api/v1/rituals/track/${createRes.body.data.trackingNumber}`);
    assert.equal(trackRes.status, 200);
    assert.ok(trackRes.body.data.status);
    assert.ok(trackRes.body.data.carrier);
  });

  await t.test('POST /api/v1/astrology/questions submits astrology query to Shastriji', async () => {
    const res = await request(app)
      .post('/api/v1/astrology/questions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        category: 'करिअर व उद्योग विस्तार',
        question: 'नवीन व्यवसाय सुरू करण्यासाठी अनुकूल नक्षत्र कोणते?',
        refBhav: 'दशम (कर्म) भाव',
      });
    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.refBhav, 'दशम (कर्म) भाव');
  });

  await t.test('PATCH /api/v1/notifications/:id/read returns 404 for unknown notification ID', async () => {
    const res = await request(app)
      .patch('/api/v1/notifications/non-existent-id-999/read')
      .set('Authorization', `Bearer ${token}`);
    assert.equal(res.status, 404);
  });

  // Cleanup
  await prisma.gurukulSubmission.deleteMany({ where: { userId: user.id } });
  await prisma.ritual.deleteMany({ where: { userId: user.id } });
  await prisma.notification.deleteMany({ where: { userId: user.id } });
  await prisma.eventRegistration.deleteMany({ where: { phone: '9877665544' } });
  await prisma.contactInquiry.deleteMany({ where: { phone: '9822199887' } });
  await prisma.astrologyQuestion.deleteMany({ where: { userId: user.id } });
  await prisma.user.deleteMany({ where: { id: { in: [user.id, adminUser.id] } } });
});
