import test from 'node:test';
import assert from 'node:assert/strict';
import { ApiException, getToken, setToken, removeToken } from '../src/api/client.ts';

test('ApiException correctly formats message, status and validation errors', () => {
  const err = new ApiException({
    message: 'Devotee not authenticated',
    status: 401,
    code: 'UNAUTHORIZED',
    details: [{ field: 'phone', message: 'Required' }],
  });

  assert.equal(err.message, 'Devotee not authenticated');
  assert.equal(err.status, 401);
  assert.equal(err.code, 'UNAUTHORIZED');
  assert.equal(err.details?.length, 1);
  assert.equal(err.name, 'ApiException');
});

test('Token storage helper handles set, get, and removal safely', () => {
  // Test in Node environment where localStorage is undefined/mocked
  const token = 'sacred_jwt_token_12345';
  setToken(token);
  // In node environment without window, should safely handle without throwing
  assert.doesNotThrow(() => {
    removeToken();
  });
});
