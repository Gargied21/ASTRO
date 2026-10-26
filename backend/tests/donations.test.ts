import test from 'node:test';
import assert from 'node:assert/strict';
import request from './testClient.js';
import { createApp } from '../src/app.js';
import { prisma } from '../src/database/prisma.js';
import { signToken } from '../src/middleware/authMiddleware.js';

test('Donations and 80G Tax Receipts Tests', async (t) => {
  const app = createApp();

  await prisma.user.deleteMany({ where: { phone: '9888123456' } });
  const user = await prisma.user.create({
    data: {
      phone: '9888123456',
      name: 'Vikas Deshmukh',
      code: '#CVP-TEST-88',
    },
  });
  const token = signToken({ id: user.id, phone: user.phone, role: user.role });

  let receiptNo = '';

  await t.test('GET /api/v1/donations/receipts and /form10be/:fy reject unauthenticated access (401)', async () => {
    const receiptsRes = await request(app).get('/api/v1/donations/receipts');
    assert.equal(receiptsRes.status, 401);

    const formRes = await request(app).get('/api/v1/donations/form10be/2025-26');
    assert.equal(formRes.status, 401);
  });

  await t.test('POST /api/v1/donations creates donation and issues 80G receipt', async () => {
    const res = await request(app)
      .post('/api/v1/donations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        amount: 3000,
        category: 'gurukul',
        purpose: 'Veda Vidyarthi Adoption Scheme',
        donorName: 'Vikas Deshmukh',
        donorPhone: '9888123456',
        donorPan: 'ABCDE1234F',
        mode: 'Razorpay UPI',
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.receiptNo.startsWith('#CVP-'));
    assert.ok(res.body.data.receipt.receiptNo.startsWith('#CVP-'));
    assert.equal(res.body.data.amount, 3000);
    assert.equal(res.body.data.donorPan, 'ABCDE1234F');
    receiptNo = res.body.data.receiptNo;
  });

  await t.test('GET /api/v1/donations/receipts lists user receipts', async () => {
    const res = await request(app)
      .get('/api/v1/donations/receipts')
      .set('Authorization', `Bearer ${token}`);
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.data));
    assert.equal(res.body.data.length >= 1, true);
    assert.equal(res.body.data[0].receiptNo, receiptNo);
  });

  await t.test('GET /api/v1/donations/receipts/:receiptNo retrieves individual receipt', async () => {
    const encodedNo = encodeURIComponent(receiptNo);
    const res = await request(app).get(`/api/v1/donations/receipts/${encodedNo}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.data.receiptNo, receiptNo);
    assert.equal(res.body.data.amount, 3000);
  });

  await t.test('GET /api/v1/donations/form10be/:fy generates Form 10BE certificate with totalAmount and totalEligibleAmount', async () => {
    const res = await request(app)
      .get('/api/v1/donations/form10be/all')
      .set('Authorization', `Bearer ${token}`);
    assert.equal(res.status, 200);
    assert.ok(res.body.data.arn);
    assert.equal(res.body.data.trustPan, 'AAATC8942D');
    assert.equal(res.body.data.totalAmount, 3000);
    assert.equal(res.body.data.totalEligibleAmount, 3000);
  });

  // Cleanup
  await prisma.donation.deleteMany({ where: { userId: user.id } });
  await prisma.notification.deleteMany({ where: { userId: user.id } });
  await prisma.user.delete({ where: { id: user.id } });
});
