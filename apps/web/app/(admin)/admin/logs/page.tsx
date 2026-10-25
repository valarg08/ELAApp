import { AdminLogs } from '@storyforge/shared';
import Link from 'next/link';
import { Card, PageShell } from '@/components/ui';
import { serverApi } from '@/lib/server-api';
import { count } from '../format';

export const dynamic = 'force-dynamic';

const SOURCES = ['api', 'worker', 'web', 'tunnel'] as const;
const SOURCE_NAMES: Record<string, string> = {
  api: 'API',
  worker: 'AI worker',
  web: 'Website',
  tunnel: 'Tunnel',
};
const LEVEL_STYLE = {
  error: 'bg-bad text-white',
  warn: 'bg-warn text-white',
  info: 'bg-border text-foreground',
} as const;

const time = (iso: string) =>
  new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  });

const chip = (active: boolean) =>
  `inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand ${
    active
      ? 'border-brand bg-brand text-white'
      : 'border-border bg-card text-brand hover:border-brand'
  }`;

/** The last day of the server logs (DESIGN.md §11.9), problems first by default. */
export default async function LogsPage({ searchParams }: PageProps<'/admin/logs'>) {
  const params = await searchParams;
  const all = params.show === 'all';
  const source = SOURCES.find((s) => s === params.source);
  const data = await serverApi('/admin/logs', AdminLogs);
  if (!data) return null;

  const problems = data.entries.filter((e) => e.level !== 'info');
  const shown = data.entries.filter(
    (e) => (all || e.level !== 'info') && (!source || e.source === source),
  );
  const href = (next: { show?: string; source?: string }) => {
    const q = new URLSearchParams();
    const s = 'show' in next ? next.show : all ? 'all' : undefined;
    const src = 'source' in next ? next.source : source;
    if (s) q.set('show', s);
    if (src) q.set('source', src);
    const query = q.toString();
    return query ? `/admin/logs?${query}` : '/admin/logs';
  };

  return (
    <PageShell full>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Logs</h1>
          <p className="mt-2 text-muted">
            The last {data.hours} hours of the server’s logs, newest first. Logs never contain
            students’ writing.
          </p>
        </div>

        {!data.available ? (
          <Card>
            <p>
              Logs are shown on the production site only (run by pm2, which sets{' '}
              <code>LOG_DIR</code>). In development, read the terminal running <code>pnpm dev</code>
              .
            </p>
          </Card>
        ) : (
          <>
            <ul aria-label="Summary" className="grid gap-4 sm:grid-cols-3">
              {(
                [
                  ['Errors', data.entries.filter((e) => e.level === 'error').length],
                  ['Warnings', data.entries.filter((e) => e.level === 'warn').length],
                  ['All lines', data.entries.length],
                ] as const
              ).map(([label, n]) => (
                <li key={label} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                  <p className="text-sm text-muted">{label}</p>
                  <p className="text-2xl font-bold">{count(n)}</p>
                </li>
              ))}
            </ul>

            <nav aria-label="Log filters" className="flex flex-col gap-3">
              <ul className="flex flex-wrap gap-2">
                <li>
                  <Link
                    href={href({ show: undefined })}
                    className={chip(!all)}
                    aria-current={!all ? 'true' : undefined}
                  >
                    Errors and warnings ({count(problems.length)})
                  </Link>
                </li>
                <li>
                  <Link
                    href={href({ show: 'all' })}
                    className={chip(all)}
                    aria-current={all ? 'true' : undefined}
                  >
                    Everything
                  </Link>
                </li>
              </ul>
              <ul className="flex flex-wrap gap-2">
                <li>
                  <Link
                    href={href({ source: undefined })}
                    className={chip(!source)}
                    aria-current={!source ? 'true' : undefined}
                  >
                    All parts
                  </Link>
                </li>
                {SOURCES.map((s) => (
                  <li key={s}>
                    <Link
                      href={href({ source: s })}
                      className={chip(source === s)}
                      aria-current={source === s ? 'true' : undefined}
                    >
                      {SOURCE_NAMES[s]}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <Card className="p-0">
              {shown.length === 0 ? (
                <p className="p-6 text-muted">
                  {all
                    ? 'No log lines in the last day.'
                    : 'No errors or warnings in the last day. 🎉'}
                </p>
              ) : (
                <ol className="divide-y divide-border">
                  {shown.map((e, i) => (
                    <li
                      key={`${e.time}-${i}`}
                      className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:gap-4"
                    >
                      <div className="flex shrink-0 items-start gap-2 sm:w-64">
                        <span
                          className={`rounded px-2 py-0.5 text-xs font-semibold uppercase ${LEVEL_STYLE[e.level]}`}
                        >
                          {e.level}
                        </span>
                        <span className="text-sm">
                          <time dateTime={e.time}>{time(e.time)}</time>
                          <span className="block text-muted">
                            {SOURCE_NAMES[e.source] ?? e.source}
                          </span>
                        </span>
                      </div>
                      <pre className="min-w-0 overflow-x-auto font-mono text-xs leading-relaxed whitespace-pre-wrap break-words">
                        {e.text}
                      </pre>
                    </li>
                  ))}
                </ol>
              )}
            </Card>
            {data.truncated && (
              <p className="text-sm text-muted">
                Only the newest {count(data.entries.length)} lines are listed.
              </p>
            )}
          </>
        )}
      </div>
    </PageShell>
  );
}
