import { ACCESS_COOKIE, CSRF_COOKIE, REFRESH_COOKIE } from '@storyforge/shared';
import type { CookieOptions, Response } from 'express';
import type { IssuedSession } from './auth.types.js';

interface CookieSettings {
  secure: boolean;
  accessTtlSeconds: number;
  refreshTtlSeconds: number;
}

const base = (secure: boolean): CookieOptions => ({ secure, sameSite: 'lax', path: '/' });

/** Set the session cookies. Access and refresh are httpOnly; the CSRF cookie is readable by the web app. */
export function setSessionCookies(res: Response, session: IssuedSession, s: CookieSettings): void {
  res.cookie(ACCESS_COOKIE, session.accessToken, {
    ...base(s.secure),
    httpOnly: true,
    maxAge: s.accessTtlSeconds * 1000,
  });
  res.cookie(REFRESH_COOKIE, session.refreshToken, {
    ...base(s.secure),
    httpOnly: true,
    maxAge: s.refreshTtlSeconds * 1000,
  });
  res.cookie(CSRF_COOKIE, session.csrfToken, {
    ...base(s.secure),
    httpOnly: false,
    maxAge: s.refreshTtlSeconds * 1000,
  });
}

export function clearSessionCookies(res: Response, secure: boolean): void {
  for (const name of [ACCESS_COOKIE, REFRESH_COOKIE, CSRF_COOKIE]) {
    res.clearCookie(name, base(secure));
  }
}
