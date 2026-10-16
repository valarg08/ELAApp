import { UnitSummary } from '@storyforge/shared';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { TrackTabs } from '@/components/track-tabs';
import { PageShell } from '@/components/ui';
import { UnitCard } from '@/components/unit-card';
import { getMe, serverApi } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

/** The Math track (DESIGN.md §9.13): AMC 10 preparation, at the student's own pace. */
export default async function MathHome() {
  const [me, units] = await Promise.all([
    getMe(),
    serverApi('/units?track=MATH', UnitSummary.array()),
  ]);
  if (!me) redirect('/join');
  const current = units?.find((u) => u.available && u.completedLessons < u.lessonCount);

  return (
    <PageShell width="max-w-5xl">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-bold">Math: AMC 10 practice</h1>
          <p className="mt-2 text-lg text-muted">
            Get ready for the AMC 10 with original contest-style problems: algebra, number theory,
            counting and probability, and geometry. Go at your own pace: each lesson opens when you
            finish the one before.
          </p>
        </div>

        <TrackTabs current="MATH" />

        <div className="flex flex-col gap-4 sm:flex-row">
          {current && (
            <Link
              href={`/units/${current.slug}`}
              className="flex-1 rounded-2xl border-2 border-brand bg-card p-6 shadow-sm transition hover:shadow-md focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <p className="text-sm font-semibold tracking-widest text-brand uppercase">
                ⭐ Keep going
              </p>
              <p className="mt-1 text-2xl font-bold">
                Math Unit {current.number}: {current.title}
              </p>
              <p className="mt-1 text-muted">
                {current.completedLessons} of {current.lessonCount} lessons done
              </p>
            </Link>
          )}
          <Link
            href="/math/error-log"
            className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:border-brand focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-72"
          >
            <p className="text-2xl" aria-hidden="true">
              📒
            </p>
            <p className="mt-1 text-lg font-bold">My error log</p>
            <p className="text-muted">Problems to redo until you've got them</p>
          </Link>
          <Link
            href="/math/progress"
            className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:border-brand focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-72"
          >
            <p className="text-2xl" aria-hidden="true">
              📊
            </p>
            <p className="mt-1 text-lg font-bold">My progress</p>
            <p className="text-muted">Lessons, problem sets and strand badges</p>
          </Link>
        </div>

        <section aria-labelledby="math-journey">
          <h2 id="math-journey" className="mb-4 text-2xl font-semibold">
            Your AMC 10 journey
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
    </PageShell>
  );
}
