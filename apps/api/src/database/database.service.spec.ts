import { Logger } from '@nestjs/common';
import type { Env } from '../config/env.js';
import { DatabaseService } from './database.service.js';

const envWith = (DATABASE_URL: string): Env => ({
  NODE_ENV: 'test',
  API_PORT: 4000,
  WEB_ORIGIN: 'http://localhost:3000',
  DATABASE_URL,
  JWT_ACCESS_SECRET: 'x'.repeat(32),
  ACCESS_TOKEN_TTL_MINUTES: 15,
  REFRESH_TOKEN_TTL_DAYS: 7,
  AI_MODEL: 'fake',
});

describe('DatabaseService.ping', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('is up against the test database', async () => {
    const service = new DatabaseService(envWith(process.env.DATABASE_URL!));
    expect(await service.ping()).toBe('up');
    await service.onModuleDestroy();
  });

  it('is down when nothing listens on the database port, and warns only once', async () => {
    const warn = vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
    // Port 1 on loopback refuses connections immediately.
    const service = new DatabaseService(envWith('postgresql://nobody:nothing@127.0.0.1:1/none'));
    expect(await service.ping()).toBe('down');
    expect(await service.ping()).toBe('down');
    expect(warn).toHaveBeenCalledTimes(1);
    await service.onModuleDestroy();
  });
});
