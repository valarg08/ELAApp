import { describe, expect, it } from 'vitest';
import { HealthResponse, overallStatus } from './health.js';

describe('HealthResponse', () => {
  const valid = {
    status: 'ok',
    service: 'api',
    version: '0.0.0',
    timestamp: '2026-09-28T10:00:00.000Z',
    uptimeSeconds: 12.5,
    checks: { database: 'not_configured' },
  };

  it('accepts a valid payload', () => {
    expect(HealthResponse.parse(valid)).toEqual(valid);
  });

  it('rejects an unknown dependency status', () => {
    const result = HealthResponse.safeParse({ ...valid, checks: { database: 'maybe' } });
    expect(result.success).toBe(false);
  });

  it('rejects a non-ISO timestamp', () => {
    const result = HealthResponse.safeParse({ ...valid, timestamp: 'yesterday' });
    expect(result.success).toBe(false);
  });
});

describe('overallStatus', () => {
  it('is ok when nothing is down', () => {
    expect(overallStatus({ database: 'up' })).toBe('ok');
    expect(overallStatus({ database: 'not_configured' })).toBe('ok');
  });

  it('is degraded when a dependency is down', () => {
    expect(overallStatus({ database: 'down' })).toBe('degraded');
  });
});
