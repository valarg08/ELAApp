import 'server-only';
import { API_PREFIX, MeResponse, StudentLookupResponse } from '@storyforge/shared';
import { cookies } from 'next/headers';
import type { z } from 'zod';

const API_URL = process.env.API_INTERNAL_URL ?? 'http://localhost:4000';

/**
 * Call the API from a Server Component, forwarding the visitor's cookies.
 * Returns null when not logged in (401) or not allowed (403/404).
 */
export async function serverApi<S extends z.ZodType>(
  path: string,
  schema: S,
): Promise<z.infer<S> | null> {
  const cookieHeader = (await cookies()).toString();
  const res = await fetch(`${API_URL}/${API_PREFIX}${path}`, {
    headers: { cookie: cookieHeader },
    cache: 'no-store',
  });
  if (res.status === 401 || res.status === 403 || res.status === 404) return null;
  if (!res.ok) throw new Error(`API ${path} failed with HTTP ${res.status}`);
  return schema.parse(await res.json());
}

export const getMe = () => serverApi('/auth/me', MeResponse);

/** Public roster lookup for the student join flow. Null when the code is unknown. */
export async function lookupClass(joinCode: string): Promise<StudentLookupResponse | null> {
  const res = await fetch(`${API_URL}/${API_PREFIX}/auth/student/lookup`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ joinCode }),
    cache: 'no-store',
  });
  return res.ok ? StudentLookupResponse.parse(await res.json()) : null;
}
