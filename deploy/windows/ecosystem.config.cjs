// pm2 processes for the production copy on this Windows PC (deploy/windows/README.md).
// Settings come from the copy's root .env; ports default to 3200 (web) and 4200 (API) so a
// development copy on 3000/4000 can run beside it.
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
try {
  process.loadEnvFile(path.join(root, '.env'));
} catch {
  // No .env: pm2 falls back to the real environment.
}
const env = { ...process.env, NODE_ENV: 'production' };
const webPort = process.env.WEB_PORT ?? '3200';
// The Cloudflare Tunnel (README step 5) runs beside the site when TUNNEL_NAME is set; its
// settings are in %USERPROFILE%.cloudflaredconfig.yml.
const tunnel = process.env.TUNNEL_NAME && {
  name: 'owlery-tunnel',
  script: process.env.CLOUDFLARED ?? 'C:\Program Files (x86)\cloudflared\cloudflared.exe',
  args: `tunnel --no-autoupdate run ${process.env.TUNNEL_NAME}`,
  interpreter: 'none',
};

module.exports = {
  apps: [
    {
      name: 'owlery-api',
      cwd: path.join(root, 'apps/api'),
      script: 'dist/main.js',
      env: { ...env, AI_WORKER: 'false' },
    },
    {
      name: 'owlery-worker',
      cwd: path.join(root, 'apps/api'),
      script: 'dist/worker.js',
      env,
    },
    {
      name: 'owlery-web',
      cwd: path.join(root, 'apps/web'),
      script: 'node_modules/next/dist/bin/next',
      args: `start --port ${webPort}`,
      env,
    },
    ...(tunnel ? [tunnel] : []),
  ].map((app) => ({ ...app, autorestart: true, max_restarts: 20, restart_delay: 3000 })),
};
