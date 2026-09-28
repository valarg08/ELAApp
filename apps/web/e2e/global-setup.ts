import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

/** Migrate and empty the test database before the browser tests run. */
export default function globalSetup(): void {
  const url = process.env.DATABASE_TEST_URL;
  if (!url) throw new Error('DATABASE_TEST_URL is not set.');
  const dbPackage = fileURLToPath(new URL('../../../packages/db', import.meta.url));
  const run = (args: string[], input?: string) =>
    execFileSync('pnpm', args, {
      cwd: dbPackage,
      env: { ...process.env, DATABASE_URL: url },
      input,
      stdio: input ? ['pipe', 'pipe', 'pipe'] : 'pipe',
      shell: process.platform === 'win32',
    });

  run(['exec', 'prisma', 'migrate', 'deploy']);
  // Empty every app table (keeps the migrations table).
  run(
    ['exec', 'prisma', 'db', 'execute', '--stdin'],
    `DO $$ DECLARE r record; BEGIN
       FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename <> '_prisma_migrations' LOOP
         EXECUTE 'TRUNCATE TABLE public.' || quote_ident(r.tablename) || ' RESTART IDENTITY CASCADE';
       END LOOP; END $$;`,
  );
}
