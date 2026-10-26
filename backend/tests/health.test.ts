import test from 'node:test';
import assert from 'node:assert/strict';
import request from './testClient.js';
import { createApp } from '../src/app.js';

test('Health and Readiness Endpoints', async (t) => {
  const app = createApp();

  await t.test('GET /health returns 200 and healthy status', async () => {
    const res = await request(app).get('/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'healthy');
    assert.equal(typeof res.body.uptimeSeconds, 'number');
  });

  await t.test('GET /ready returns 200 and database connected', async () => {
    const res = await request(app).get('/ready');
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'ready');
    assert.equal(res.body.database, 'connected');
  });

  await t.test('GET / non-existent route returns 404', async () => {
    const res = await request(app).get('/api/v1/non-existent-route-999');
    assert.equal(res.status, 404);
    assert.equal(res.body.error.code, 'NOT_FOUND');
  });
});
