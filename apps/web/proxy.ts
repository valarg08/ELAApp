import { ACCESS_COOKIE, API_PREFIX, REFRESH_COOKIE } from '@storyforge/shared';
import { type NextRequest, NextResponse } from 'next/server';
import { applySetCookies, needsRefresh, serializeCookies } from './lib/session-refresh';

const API_URL = process.env.API_INTERNAL_URL ?? 'http://localhost:4000';

/**
 * Before a page renders: if the access token is missing or about to expire but a refresh token
 * exists, rotate the session so Server Components see a valid login (DESIGN.md §2.5).
 */
export async function proxy(request: NextRequest) {
  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;
  if (!refresh || !needsRefresh(request.cookies.get(ACCESS_COOKIE)?.value)) {
    return NextResponse.next();
  }

  let setCookies: string[] = [];
  try {
    const res = await fetch(`${API_URL}/${API_PREFIX}/auth/refresh`, {
      method: 'POST',
      headers: { cookie: request.headers.get('cookie') ?? '' },
      cache: 'no-store',
    });
    setCookies = res.headers.getSetCookie();
  } catch {
    return NextResponse.next(); // API down: let the page handle it.
  }

  const current = new Map(request.cookies.getAll().map((c) => [c.name, c.value] as const));
  const headers = new Headers(request.headers);
  headers.set('cookie', serializeCookies(applySetCookies(current, setCookies)));

  const response = NextResponse.next({ request: { headers } });
  for (const cookie of setCookies) response.headers.append('set-cookie', cookie);
  return response;
}

export const config = {
  // Pages only: not the API proxy, static files or images.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|svg|ico|jpg)$).*)'],
};
