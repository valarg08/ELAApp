import { API_PREFIX, HealthResponse } from '@storyforge/shared';

export type ApiHealthResult =
  { reachable: true; health: HealthResponse } | { reachable: false; reason: string };

/**
 * Fetch and validate the API health report. Never throws: an unreachable or
 * misbehaving API becomes `{ reachable: false }` so the page can explain it.
 */
export async function fetchApiHealth(
  baseUrl: string,
  fetchImpl: typeof fetch = fetch,
): Promise<ApiHealthResult> {
  try {
    const res = await fetchImpl(`${baseUrl}/${API_PREFIX}/health`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return { reachable: false, reason: `API answered HTTP ${res.status}` };
    const parsed = HealthResponse.safeParse(await res.json());
    if (!parsed.success) return { reachable: false, reason: 'API sent an unexpected response' };
    return { reachable: true, health: parsed.data };
  } catch {
    return { reachable: false, reason: 'API is not running' };
  }
}
