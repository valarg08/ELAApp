import { describe, expect, it } from 'vitest';
import { fetchApiHealth } from './api-health';

const healthy = {
  status: 'ok',
  service: 'api',
  version: '0.0.0',
  timestamp: '2026-09-28T10:00:00.000Z',
  uptimeSeconds: 3,
  checks: { database: 'up' },
};

const respond =
  (body: unknown, status = 200): typeof fetch =>
  async () =>
    new Response(JSON.stringify(body), { status });

const failing: typeof fetch = async () => {
  throw new TypeError('fetch failed');
};

const urlOf = (input: Parameters<typeof fetch>[0]): string =>
  input instanceof Request ? input.url : input.toString();

describe('fetchApiHealth', () => {
  it('returns the parsed report when the API is healthy', async () => {
    const result = await fetchApiHealth('http://api', respond(healthy));
    expect(result).toEqual({ reachable: true, health: healthy });
  });

  it('calls the prefixed health route', async () => {
    let calledUrl = '';
    const spy: typeof fetch = async (input) => {
      calledUrl = urlOf(input);
      return new Response(JSON.stringify(healthy));
    };
    await fetchApiHealth('http://api', spy);
    expect(calledUrl).toBe('http://api/api/v1/health');
  });

  it('reports an HTTP error status', async () => {
    const result = await fetchApiHealth('http://api', respond({}, 503));
    expect(result).toEqual({ reachable: false, reason: 'API answered HTTP 503' });
  });

  it('rejects a malformed payload', async () => {
    const result = await fetchApiHealth('http://api', respond({ status: 'fine' }));
    expect(result.reachable).toBe(false);
  });

  it('handles a network failure', async () => {
    expect(await fetchApiHealth('http://api', failing)).toEqual({
      reachable: false,
      reason: 'API is not running',
    });
  });
});
