import { UnitSummary } from '@storyforge/shared';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { TrackTabs } from '@/components/track-tabs';
import { CourseShell } from '@/components/course-shell';
import { UnitCard } from '@/components/unit-card';
import { getMe, serverApi } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

export default async function StudentHome() {
  const [me, units] = await Promise.all([getMe(), serverApi('/units', UnitSummary.array())]);
  if (!me) redirect('/join');
  const current = units?.find((u) => u.available && u.completedLessons < u.lessonCount);

  return (
    <CourseShell track="STORY">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-bold">Welcome, {me.displayName}! 👋</h1>
          {me.classes.length > 0 && (
            <p className="mt-2 text-lg text-muted">
              You&apos;re in{' '}
              <strong className="text-foreground">
                {me.classes.map((c) => c.name).join(', ')}
              </strong>
              .
            </p>
          )}
        </div>

        <TrackTabs current="STORY" />

        {current && (
          <Link
            href={`/units/${current.slug}`}
            className="rounded-2xl border-2 border-brand bg-card p-6 shadow-sm transition hover:shadow-md focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <p className="text-sm font-semibold tracking-widest text-brand uppercase">
              ⭐ Keep going
            </p>
            <p className="mt-1 text-2xl font-bold">
              Unit {current.number}: {current.title}
            </p>
            <p className="mt-1 text-muted">
              {current.completedLessons} of {current.lessonCount} lessons done
            </p>
          </Link>
        )}

        <section aria-labelledby="journey">
          <h2 id="journey" className="mb-4 text-2xl font-semibold">
            Your writing journey
          </h2>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(units ?? []).map((u) => (
              <li key={u.id}>
                <UnitCard unit={u} />
              </li>
            ))}
          </ol>
        </section>
      </div>
    </CourseShell>
  );
}
