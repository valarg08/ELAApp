import type { NextConfig } from 'next';

const apiUrl = process.env.API_INTERNAL_URL ?? 'http://localhost:4000';

const nextConfig: NextConfig = {
  // Browser tests run a second dev server; it needs its own build folder.
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
  // The browser calls /api/* on the web origin; Next forwards it to the NestJS API.
  // Same-origin requests keep auth cookies simple (DESIGN.md §2.5).
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${apiUrl}/api/:path*` }];
  },
  poweredByHeader: false,
  // Security headers on every page. No full CSP yet: Next's inline scripts and KaTeX styles
  // need nonces first; these block framing, plugins and sniffing.
  async headers() {
    const headers = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      {
        key: 'Content-Security-Policy',
        value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'",
      },
    ];
    // Only over HTTPS (real sites); browsers would otherwise pin localhost to HTTPS.
    if (process.env.NODE_ENV === 'production' && process.env.WEB_ORIGIN?.startsWith('https:')) {
      headers.push({ key: 'Strict-Transport-Security', value: 'max-age=31536000' });
    }
    return [{ source: '/:path*', headers }];
  },
};

export default nextConfig;
