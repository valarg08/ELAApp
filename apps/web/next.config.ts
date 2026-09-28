import type { NextConfig } from 'next';

const apiUrl = process.env.API_INTERNAL_URL ?? 'http://localhost:4000';

const nextConfig: NextConfig = {
  // The browser calls /api/* on the web origin; Next forwards it to the NestJS API.
  // Same-origin requests keep auth cookies simple (DESIGN.md §2.5).
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${apiUrl}/api/:path*` }];
  },
};

export default nextConfig;
