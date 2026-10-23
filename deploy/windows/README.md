# Running Owlery Academy for students from this Windows PC

A trial setup: the site runs on this PC and a free **Cloudflare Tunnel** gives it a public HTTPS
address. Nothing is opened on the router. The PC must stay on and awake while students use it.

The production copy lives in its own folder (`C:\workspace\owlery-prod`) with its own database
(`owlery`) and ports (web 3200, API 4200), so development in `C:\workspace\ELAApp` (3000/4000)
never touches students' data. Updates reach students only when you run `update.ps1`.

## One-time setup

1. **Tools:** Node 24, pnpm and PostgreSQL (already used for development), plus pm2:
   `npm install -g pm2`.
2. **The copy:** `git clone https://github.com/valarg08/ELAApp.git C:\workspace\owlery-prod`.
3. **Settings:** copy `deploy\windows\env.production.example` to `C:\workspace\owlery-prod\.env`
   and fill it in: a new `JWT_ACCESS_SECRET`, the `owlery` database URL, `WEB_ORIGIN` (the public
   address from step 5), `ANTHROPIC_API_KEY` and `BACKUP_DIR`.
4. **Build and start:** in `C:\workspace\owlery-prod` run
   `powershell -ExecutionPolicy Bypass -File deploy\windows\update.ps1`, then create your accounts
   (teacher sign-up is closed on the public site):
   `pnpm user:create --role ADMIN --email you@school.org --name "Your Name"` and
   `pnpm user:create --role TEACHER --email teacher@school.org --name "Ms Rivera"`.
   Each prints a password once. After that, add teachers in `/admin/schools` (**Add a teacher**;
   the password is shown once, and **Reset password** makes a new one). In `/admin`, set a daily
   AI budget for the school.
5. **Public address (Cloudflare Tunnel):**
   1. Create a free Cloudflare account and add a domain to it (buy one there or move one in).
   2. Install cloudflared: `winget install --id Cloudflare.cloudflared`.
   3. `cloudflared tunnel login` (opens the browser), then `cloudflared tunnel create owlery`.
   4. `cloudflared tunnel route dns owlery owlery.example.com` (your hostname).
   5. Copy `deploy\windows\cloudflared-config.example.yml` to `%USERPROFILE%\.cloudflared\config.yml`
      and fill in the tunnel id, credentials file and hostname.
   6. Set `TUNNEL_NAME=owlery` and `WEB_ORIGIN=https://owlery.example.com` in `.env` and run
      `update.ps1` again: pm2 starts the tunnel with the site (no Windows service or admin
      rights needed) and restarts it if it stops.
6. **Start on boot and nightly backups:** run `deploy\windows\register-tasks.ps1` once. It adds
   two tasks for your user: start pm2's saved processes at log-on, and back up the database
   every night at 02:00 (`backup-db.ps1`, keeps the last 14).
7. **Power settings:** never sleep while plugged in; set Windows Update active hours to cover school
   and homework time.

## Day to day

- Status: `pm2 status`, logs: `pm2 logs`, the site's own check: `https://<your address>/status`.
- Update to the latest `main`: run `update.ps1` again (students may see a few seconds of downtime).
- Restore a backup: `pg_restore --clean --no-owner --dbname=<DATABASE_URL> <file>.dump`.
- End of the trial: `pm2 delete all`, `cloudflared tunnel delete owlery`, and drop the `owlery`
  database unless the school wants to keep the work.
