'use client';

import { API_PREFIX, CSRF_COOKIE, CSRF_HEADER, ProblemDetails } from '@storyforge/shared';
import type { z } from 'zod';

/** An API error with RFC 9457 details, ready to show to the user. */
export class ApiError extends Error {
  constructor(readonly problem: ProblemDetails) {
    super(problem.detail ?? problem.title);
  }

  /** Friendly single message: the detail, or the first validation error, or the title. */
  get userMessage(): string {
    return (
      this.problem.errors?.[0]?.replace(/^[^:]+: /, '') ?? this.problem.detail ?? this.problem.title
    );
  }
}

function readCookie(name: string): string | undefined {
  const match = document.cookie.split('; ').find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}

async function send(path: string, init: RequestInit): Promise<Response> {
  const headers = new Headers(init.headers);
  if (init.body !== undefined) headers.set('content-type', 'application/json');
  const csrf = readCookie(CSRF_COOKIE);
  if (csrf) headers.set(CSRF_HEADER, csrf);
  return fetch(`/${API_PREFIX}${path}`, { ...init, headers, credentials: 'same-origin' });
}

async function toError(res: Response): Promise<ApiError> {
  const parsed = ProblemDetails.safeParse(await res.json().catch(() => null));
  return new ApiError(
    parsed.success
      ? parsed.data
      : {
          type: 'about:blank',
          title: 'Something went wrong',
          status: res.status,
          code: 'INTERNAL',
        },
  );
}

/**
 * Call the API from the browser (same origin, via the Next.js /api proxy).
 * On 401 it refreshes the session once and retries.
 */
export async function apiRequest(path: string, init: RequestInit = {}): Promise<Response> {
  let res = await send(path, init);
  if (res.status === 401 && !path.startsWith('/auth/')) {
    const refreshed = await send('/auth/refresh', { method: 'POST' });
    if (refreshed.ok) res = await send(path, init);
  }
  if (!res.ok) throw await toError(res);
  return res;
}

const withBody = (method: string, body: unknown): RequestInit => ({
  method,
  ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
});

/** Call the API and validate the JSON response against a schema. */
export async function apiJson<S extends z.ZodType>(
  path: string,
  schema: S,
  method = 'GET',
  body?: unknown,
): Promise<z.infer<S>> {
  const res = await apiRequest(path, withBody(method, body));
  return schema.parse(await res.json());
}

/** Call the API when the response body doesn't matter (e.g. login, logout). */
export async function apiSend(path: string, method = 'POST', body?: unknown): Promise<void> {
  await apiRequest(path, withBody(method, body));
}

/** POST that returns a file, saved through a temporary download link. */
export async function apiDownload(path: string, body: unknown, filename: string): Promise<void> {
  const res = await apiRequest(path, { method: 'POST', body: JSON.stringify(body) });
  const url = URL.createObjectURL(await res.blob());
  const link = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
