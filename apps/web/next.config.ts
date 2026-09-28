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
};

export default nextConfig;
