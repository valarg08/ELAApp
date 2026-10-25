import { ErrorLogList, REDOS_TO_RESOLVE } from '@storyforge/shared';
import Link from 'next/link';
import { CourseShell } from '@/components/course-shell';
import { TrackTabs } from '@/components/track-tabs';
import { ErrorMessage } from '@/components/ui';
import { ErrorLogView } from '@/features/math/error-log-view';
import { serverApi } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

/** Mental Math mistakes to redo (its own error log, separate from the Math one). */
export default async function MentalMistakes() {
  const log = await serverApi('/math/error-log?track=mental', ErrorLogList);

  return (
    <CourseShell track="MENTAL">
      <div className="flex flex-col gap-8">
        <div>
          <Link href="/mental" className="text-brand underline">
            ← Mental Math
          </Link>
          <h1 className="mt-4 text-4xl font-bold">My mistakes</h1>
          <p className="mt-2 text-lg text-muted">
            Questions you missed in the challenges and checks, to try again with new numbers. Get
            one right on {REDOS_TO_RESOLVE} different days and it leaves the list. The daily review
            brings them back too.
          </p>
        </div>
        <TrackTabs current="MENTAL" />
        {log ? (
          <ErrorLogView initial={log} />
        ) : (
          <ErrorMessage message="Could not load your mistakes." />
        )}
      </div>
    </CourseShell>
  );
}
