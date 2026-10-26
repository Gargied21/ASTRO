import test from 'node:test';
import assert from 'node:assert/strict';
import request from './testClient.js';
import { createApp } from '../src/app.js';
import { prisma } from '../src/database/prisma.js';

test('Authentication Flow Tests', async (t) => {
  const app = createApp();
  const testPhone = '9822011223';

  // Cleanup any test records
  await prisma.otpSession.deleteMany({ where: { phone: testPhone } });
  await prisma.user.deleteMany({ where: { phone: testPhone } });

  await t.test('POST /api/v1/auth/request-otp validates phone number', async () => {
    const res = await request(app)
      .post('/api/v1/auth/request-otp')
      .send({ phone: '123' }); // Too short
    assert.equal(res.status, 400);
    assert.equal(res.body.error.code, 'VALIDATION_ERROR');
  });

  let activeOtp = '';

  await t.test('POST /api/v1/auth/request-otp succeeds with valid phone', async () => {
    const res = await request(app)
      .post('/api/v1/auth/request-otp')
      .send({ phone: testPhone });
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.expiresInSeconds);
    activeOtp = res.body.data.debugOtp || '584123';
  });

  await t.test('POST /api/v1/auth/verify-otp fails with incorrect OTP', async () => {
    const res = await request(app)
      .post('/api/v1/auth/verify-otp')
      .send({ phone: testPhone, otp: '000000' });
    assert.equal(res.status, 400);
    assert.equal(res.body.error.code, 'INVALID_OTP');
  });

  let authToken = '';

  await t.test('POST /api/v1/auth/verify-otp succeeds with correct OTP', async () => {
    const res = await request(app)
      .post('/api/v1/auth/verify-otp')
      .send({ phone: testPhone, otp: activeOtp, name: 'Shri Parikshit Shastri' });
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.token);
    assert.equal(res.body.data.user.name, 'Shri Parikshit Shastri');
    assert.equal(res.body.data.user.phone, testPhone);
    authToken = res.body.data.token;
  });

  await t.test('GET /api/v1/auth/me returns 401 without Bearer token', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    assert.equal(res.status, 401);
  });

  await t.test('GET /api/v1/auth/me returns user profile with valid token', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${authToken}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.data.phone, testPhone);
    assert.equal(res.body.data.name, 'Shri Parikshit Shastri');
  });

  // Cleanup
  await prisma.otpSession.deleteMany({ where: { phone: testPhone } });
  await prisma.user.deleteMany({ where: { phone: testPhone } });
});
