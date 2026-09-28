import { Test } from '@nestjs/testing';
import { HealthResponse } from '@storyforge/shared';
import { DatabaseService } from '../database/database.service.js';
import { HealthController } from './health.controller.js';

async function controllerWithDatabase(status: 'up' | 'down' | 'not_configured') {
  const moduleRef = await Test.createTestingModule({
    controllers: [HealthController],
    providers: [{ provide: DatabaseService, useValue: { ping: async () => status } }],
  }).compile();
  return moduleRef.get(HealthController);
}

describe('HealthController', () => {
  it('reports ok and a valid payload when the database is up', async () => {
    const body = await (await controllerWithDatabase('up')).check();
    expect(HealthResponse.parse(body)).toMatchObject({ status: 'ok', checks: { database: 'up' } });
  });

  it('reports ok when the database is not configured', async () => {
    const body = await (await controllerWithDatabase('not_configured')).check();
    expect(body.status).toBe('ok');
  });

  it('reports degraded when the database is down', async () => {
    const body = await (await controllerWithDatabase('down')).check();
    expect(body).toMatchObject({ status: 'degraded', checks: { database: 'down' } });
  });
});
