import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { HealthResponse } from '@storyforge/shared';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { ENV } from '../src/config/config.module.js';
import { loadEnv } from '../src/config/env.js';
import { configureApp } from '../src/setup.js';

describe('GET /api/v1/health (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      // No DATABASE_URL: the test must not depend on a running Postgres.
      .overrideProvider(ENV)
      .useValue(loadEnv({ NODE_ENV: 'test' }))
      .compile();
    app = moduleRef.createNestApplication();
    configureApp(app, 'http://localhost:3000');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns 200 with a valid health payload', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/health').expect(200);
    const body = HealthResponse.parse(res.body);
    expect(body).toMatchObject({
      status: 'ok',
      service: 'api',
      checks: { database: 'not_configured' },
    });
  });

  it('serves routes only under the /api/v1 prefix', async () => {
    await request(app.getHttpServer()).get('/health').expect(404);
  });
});
