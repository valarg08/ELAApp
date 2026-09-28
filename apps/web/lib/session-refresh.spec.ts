import { describe, expect, it } from 'vitest';
import { applySetCookies, needsRefresh, serializeCookies } from './session-refresh';

const jwtWithExp = (exp: number) =>
  `h.${Buffer.from(JSON.stringify({ exp })).toString('base64url')}.sig`;

describe('needsRefresh', () => {
  const now = 1_800_000_000_000;

  it('refreshes when there is no token or it is unreadable', () => {
    expect(needsRefresh(undefined, 60, now)).toBe(true);
    expect(needsRefresh('garbage', 60, now)).toBe(true);
  });

  it('refreshes when the token expires within the margin', () => {
    expect(needsRefresh(jwtWithExp(now / 1000 + 30), 60, now)).toBe(true);
  });

  it('keeps a token with plenty of time left', () => {
    expect(needsRefresh(jwtWithExp(now / 1000 + 600), 60, now)).toBe(false);
  });
});

describe('applySetCookies', () => {
  it('replaces updated cookies and removes cleared ones', () => {
    const current = new Map([
      ['sf_access', 'old'],
      ['sf_refresh', 'r1'],
      ['theme', 'dark'],
    ]);
    const next = applySetCookies(current, [
      'sf_access=new; Path=/; HttpOnly',
      'sf_refresh=r2; Path=/; HttpOnly',
      'sf_csrf=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    ]);
    expect(Object.fromEntries(next)).toEqual({ sf_access: 'new', sf_refresh: 'r2', theme: 'dark' });
    expect(serializeCookies(next)).toBe('sf_access=new; sf_refresh=r2; theme=dark');
  });
});
