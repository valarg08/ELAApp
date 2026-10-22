import { ErrorLogList, REDOS_TO_RESOLVE } from '@storyforge/shared';
import Link from 'next/link';
import { TrackTabs } from '@/components/track-tabs';
import { ErrorMessage, PageShell } from '@/components/ui';
import { ErrorLogView } from '@/features/math/error-log-view';
import { serverApi } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

/** My error log (DESIGN.md §9.13): missed problems to redo on different days until they stick. */
export default async function MathErrorLog() {
  const log = await serverApi('/math/error-log', ErrorLogList);

  return (
    <PageShell width="max-w-4xl">
      <div className="flex flex-col gap-8">
        <div>
          <Link href="/math" className="text-brand underline">
            ← Math
          </Link>
          <h1 className="mt-4 text-4xl font-bold">My error log</h1>
          <p className="mt-2 text-lg text-muted">
            Problems you missed, to redo later. Get one right on {REDOS_TO_RESOLVE} different days
            and it leaves the log. Redoing beats rereading!
          </p>
          <p className="mt-2 text-muted">
            Missed problems on an official paper you worked on your own?{' '}
            <Link href="/math/past-papers" className="text-brand underline">
              Log them in your past-paper log
            </Link>{' '}
            by topic: they show up as danger zones.
          </p>
        </div>
        <TrackTabs current="MATH" />
        {log ? (
          <ErrorLogView initial={log} />
        ) : (
          <ErrorMessage message="Could not load your error log." />
        )}
      </div>
    </PageShell>
  );
}
