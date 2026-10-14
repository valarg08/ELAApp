import { UnitSummary } from '@storyforge/shared';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { TrackTabs } from '@/components/track-tabs';
import { PageShell } from '@/components/ui';
import { UnitCard } from '@/components/unit-card';
import { getMe, serverApi } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

/** The Essay Writing journey (DESIGN.md §9.12): its own units, at the student's own pace. */
export default async function EssayHome() {
  const [me, units] = await Promise.all([
    getMe(),
    serverApi('/units?track=ESSAY', UnitSummary.array()),
  ]);
  if (!me) redirect('/join');
  const current = units?.find((u) => u.available && u.completedLessons < u.lessonCount);

  return (
    <PageShell width="max-w-5xl">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-bold">Essay Writing</h1>
          <p className="mt-2 text-lg text-muted">
            Build your grammar, sentences and paragraphs, then write argumentative, informative and
            narrative essays. Go at your own pace: each lesson opens when you finish the one before.
          </p>
        </div>

        <TrackTabs current="ESSAY" />

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
                Essay Unit {current.number}: {current.title}
              </p>
              <p className="mt-1 text-muted">
                {current.completedLessons} of {current.lessonCount} lessons done
              </p>
            </Link>
          )}
          <Link
            href="/essays/progress"
            className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:border-brand focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-72"
          >
            <p className="text-2xl" aria-hidden="true">
              📊
            </p>
            <p className="mt-1 text-lg font-bold">My progress</p>
            <p className="text-muted">Lessons, quiz scores and essay feedback</p>
          </Link>
        </div>

        <section aria-labelledby="essay-journey">
          <h2 id="essay-journey" className="mb-4 text-2xl font-semibold">
            Your essay journey
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
