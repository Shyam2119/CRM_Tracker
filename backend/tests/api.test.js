import 'dotenv/config';
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/User.js';
import Opportunity from '../src/models/Opportunity.js';

const testUser = {
  name: 'Test User',
  email: `test_${Date.now()}@crm.test`,
  password: 'testpass123',
};

let token = '';
let otherToken = '';
let opportunityId = '';

before(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await User.deleteMany({ email: { $regex: /@crm\.test$/ } });
});

after(async () => {
  await User.deleteMany({ email: { $regex: /@crm\.test$/ } });
  await mongoose.disconnect();
});

describe('Auth API', () => {
  it('registers a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser)
      .expect(201);

    assert.ok(res.body.token);
    assert.equal(res.body.email, testUser.email);
    token = res.body.token;
  });

  it('rejects duplicate email', async () => {
    await request(app).post('/api/auth/register').send(testUser).expect(400);
  });

  it('logs in with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password })
      .expect(200);

    assert.ok(res.body.token);
    token = res.body.token;
  });

  it('rejects invalid credentials', async () => {
    await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'wrong' })
      .expect(401);
  });
});

describe('Opportunity ownership', () => {
  it('creates an opportunity', async () => {
    const res = await request(app)
      .post('/api/opportunities')
      .set('Authorization', `Bearer ${token}`)
      .send({
        customerName: 'Test Corp',
        requirement: 'CRM software',
        estimatedValue: 50000,
        stage: 'New',
        priority: 'High',
      })
      .expect(201);

    opportunityId = res.body._id;
    assert.equal(res.body.customerName, 'Test Corp');
  });

  it('registers second user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Other User',
        email: `other_${Date.now()}@crm.test`,
        password: 'testpass123',
      })
      .expect(201);

    otherToken = res.body.token;
  });

  it('blocks non-owner from updating', async () => {
    await request(app)
      .put(`/api/opportunities/${opportunityId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ stage: 'Won' })
      .expect(403);
  });

  it('blocks non-owner from deleting', async () => {
    await request(app)
      .delete(`/api/opportunities/${opportunityId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(403);
  });

  it('allows owner to update', async () => {
    const res = await request(app)
      .put(`/api/opportunities/${opportunityId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ stage: 'Contacted', activityNote: 'Called the client' })
      .expect(200);

    assert.equal(res.body.stage, 'Contacted');
    assert.ok(res.body.activityLog?.length >= 2);
  });

  it('allows owner to delete', async () => {
    await request(app)
      .delete(`/api/opportunities/${opportunityId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
