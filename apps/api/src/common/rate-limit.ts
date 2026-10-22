import { ErrorCode } from '@storyforge/shared';
import type { NextFunction, Request, Response } from 'express';

/**
 * A small in-memory, fixed-window rate limit per client IP (one API process). Accounts also lock
 * after repeated wrong passwords (AuthService); this slows guessing across many accounts and
 * class codes. A whole class often shares one school IP, so the limit is generous.
 */
export function rateLimit({ limit, windowMs }: { limit: number; windowMs: number }) {
  const hits = new Map<string, { count: number; resetAt: number }>();
  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    if (hits.size > 10_000) {
      for (const [key, entry] of hits) if (entry.resetAt <= now) hits.delete(key);
    }
    const key = req.ip ?? 'unknown';
    const entry = hits.get(key);
    if (!entry || entry.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }
    entry.count += 1;
    if (entry.count <= limit) return next();
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    res
      .status(429)
      .set('Retry-After', String(retryAfter))
      .type('application/problem+json')
      .json({
        type: '/errors/rate-limited',
        title: 'Too many requests',
        status: 429,
        code: ErrorCode.RATE_LIMITED,
        detail: `Too many sign-in attempts. Try again in ${Math.ceil(retryAfter / 60)} min.`,
      });
  };
}

/** Headers for API responses (JSON only): no sniffing, no framing, no caching of personal data. */
export function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
    'Cache-Control': 'no-store',
  });
  next();
}
