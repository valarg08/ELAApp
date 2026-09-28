/** Pure helpers for proxy.ts, kept separate so they can be unit tested. */

/** True when a JWT is missing, unreadable, or expires within `marginSeconds`. */
export function needsRefresh(
  accessToken: string | undefined,
  marginSeconds = 60,
  now = Date.now(),
): boolean {
  if (!accessToken) return true;
  try {
    const payload = accessToken.split('.')[1];
    if (!payload) return true;
    const claims: unknown = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    const exp =
      typeof claims === 'object' && claims !== null && 'exp' in claims ? claims.exp : undefined;
    return typeof exp !== 'number' || exp * 1000 - now < marginSeconds * 1000;
  } catch {
    return true;
  }
}

/** Apply Set-Cookie headers to a cookie map (a cleared cookie is removed). */
export function applySetCookies(
  current: Map<string, string>,
  setCookies: string[],
): Map<string, string> {
  const next = new Map(current);
  for (const header of setCookies) {
    const [pair = ''] = header.split(';');
    const eq = pair.indexOf('=');
    if (eq <= 0) continue;
    const name = pair.slice(0, eq).trim();
    const value = pair.slice(eq + 1).trim();
    const cleared =
      value === '' || /expires=thu, 01 jan 1970/i.test(header) || /max-age=0/i.test(header);
    if (cleared) next.delete(name);
    else next.set(name, value);
  }
  return next;
}

export const serializeCookies = (cookies: Map<string, string>) =>
  [...cookies].map(([name, value]) => `${name}=${value}`).join('; ');
