import { Logger } from '@nestjs/common';
import { loadEnv } from '../config/env.js';
import { DatabaseService } from './database.service.js';

describe('DatabaseService.ping', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('is not_configured without DATABASE_URL', async () => {
    const service = new DatabaseService(loadEnv({}));
    expect(service.client).toBeNull();
    expect(await service.ping()).toBe('not_configured');
  });

  it('is down when nothing listens on the database port, and warns only once', async () => {
    const warn = vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
    // Port 1 on loopback refuses connections immediately.
    const service = new DatabaseService(
      loadEnv({ DATABASE_URL: 'postgresql://nobody:nothing@127.0.0.1:1/none' }),
    );
    expect(await service.ping()).toBe('down');
    expect(await service.ping()).toBe('down');
    expect(warn).toHaveBeenCalledTimes(1);
    await service.onModuleDestroy();
  });
});
