import { APP_NAME, type DependencyStatus } from '@storyforge/shared';
import { fetchApiHealth } from '@/lib/api-health';

// Always check the API live; never cache this page.
export const dynamic = 'force-dynamic';

const API_URL = process.env.API_INTERNAL_URL ?? 'http://localhost:4000';

const dependencyLabel: Record<DependencyStatus, { text: string; tone: string }> = {
  up: { text: 'Connected', tone: 'text-ok' },
  down: { text: 'Not reachable (install PostgreSQL before Phase P1)', tone: 'text-warn' },
  not_configured: { text: 'Not configured (set DATABASE_URL)', tone: 'text-muted' },
};

export default async function Home() {
  const result = await fetchApiHealth(API_URL);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-8 px-4 py-16">
      <header className="flex flex-col gap-2">
        <p className="text-sm font-semibold tracking-widest text-brand uppercase">Phase P0</p>
        <h1 className="text-4xl font-bold">{APP_NAME}</h1>
        <p className="text-lg text-muted">
          Hello! The scaffold is running. Lessons, the writing workspace and the teacher dashboard
          arrive in later phases.
        </p>
      </header>

      <section
        aria-labelledby="status-heading"
        className="rounded-2xl border border-border bg-card p-6 shadow-sm"
      >
        <h2 id="status-heading" className="mb-4 text-xl font-semibold">
          System status
        </h2>
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3">
          <dt className="font-medium">Web app</dt>
          <dd className="text-ok">✓ Running</dd>

          <dt className="font-medium">API</dt>
          {result.reachable ? (
            <dd className="text-ok">
              ✓ {result.health.status === 'ok' ? 'Healthy' : 'Running (degraded)'} · v
              {result.health.version}
            </dd>
          ) : (
            <dd className="text-bad">✗ {result.reason}. Start it with pnpm dev.</dd>
          )}

          <dt className="font-medium">Database</dt>
          {result.reachable ? (
            <dd className={dependencyLabel[result.health.checks.database].tone}>
              {dependencyLabel[result.health.checks.database].text}
            </dd>
          ) : (
            <dd className="text-muted">Unknown (API offline)</dd>
          )}
        </dl>
      </section>
    </main>
  );
}
