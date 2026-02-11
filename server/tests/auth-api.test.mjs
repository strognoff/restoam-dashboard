import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../index.mjs';

const app = createApp();

test('login failure returns 401', async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ username: 'wrong', password: 'wrong' });

  assert.equal(res.status, 401);
  assert.equal(res.body.error, 'Invalid credentials');
});

test('login success persists session and logout clears it', async () => {
  const agent = request.agent(app);

  const login = await agent
    .post('/api/auth/login')
    .send({ username: 'admin', password: 'admin' });
  assert.equal(login.status, 200);

  const me = await agent.get('/api/auth/me');
  assert.equal(me.status, 200);
  assert.equal(me.body.authenticated, true);
  assert.equal(me.body.username, 'admin');

  const protectedRes = await agent.get('/api/dashboard/summary');
  assert.equal(protectedRes.status, 200);
  assert.equal(protectedRes.body.ok, true);

  const logout = await agent.post('/api/auth/logout');
  assert.equal(logout.status, 200);

  const meAfter = await agent.get('/api/auth/me');
  assert.equal(meAfter.status, 200);
  assert.equal(meAfter.body.authenticated, false);
});
