import { HealthResponse } from '@storyforge/shared';
import request from 'supertest';
import { type TestContext, createTestApp } from './helpers.js';

describe('GET /api/v1/health (e2e)', () => {
  let ctx: TestContext;

  beforeAll(async () => {
    ctx = await createTestApp();
  });

  afterAll(async () => {
    await ctx.app.close();
  });

  it('returns 200 without logging in, with the database up', async () => {
    const res = await request(ctx.app.getHttpServer()).get('/api/v1/health').expect(200);
    expect(HealthResponse.parse(res.body)).toMatchObject({
      status: 'ok',
      service: 'api',
      checks: { database: 'up' },
    });
  });

  it('serves routes only under the /api/v1 prefix', async () => {
    await request(ctx.app.getHttpServer()).get('/health').expect(404);
  });
});
