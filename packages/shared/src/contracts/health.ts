import { z } from 'zod';

/**
 * State of a dependency the API talks to.
 * - `up`: reachable
 * - `down`: configured but not reachable
 * - `not_configured`: no connection settings provided
 */
export const DependencyStatus = z.enum(['up', 'down', 'not_configured']);
export type DependencyStatus = z.infer<typeof DependencyStatus>;

/**
 * Response of `GET /api/v1/health`.
 * The endpoint answers 200 whenever the API process is running (liveness);
 * dependency problems are reported in `checks` and `status: "degraded"`.
 */
export const HealthResponse = z.object({
  status: z.enum(['ok', 'degraded']),
  service: z.literal('api'),
  version: z.string(),
  timestamp: z.iso.datetime(),
  uptimeSeconds: z.number().nonnegative(),
  checks: z.object({
    database: DependencyStatus,
  }),
});
export type HealthResponse = z.infer<typeof HealthResponse>;

/** Overall status: `ok` only when no configured dependency is down. */
export function overallStatus(checks: HealthResponse['checks']): HealthResponse['status'] {
  return Object.values(checks).includes('down') ? 'degraded' : 'ok';
}
