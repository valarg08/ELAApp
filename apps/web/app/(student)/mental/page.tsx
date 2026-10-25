import { MentalHome as MentalHomeView, UnitSummary } from '@storyforge/shared';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CourseShell } from '@/components/course-shell';
import { MathText } from '@/components/math-text';
import { tipOfTheDay } from '@/components/mental-cheat-sheets';
import { TrackTabs } from '@/components/track-tabs';
import { UnitCard } from '@/components/unit-card';
import { getMe, serverApi } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

/**
 * The Mental Math track (mental-math-design.md): number sense for ages 7–14 in four levels by age,
 * each unit one pattern. Units not written yet show as coming soon; the cheat sheets and the day's
 * tip sit in the Progress panel.
 */
export default async function MentalHome() {
  const [me, units, home] = await Promise.all([
    getMe(),
    serverApi('/units?track=MENTAL', UnitSummary.array()),
    serverApi('/mental/home', MentalHomeView),
  ]);
  if (!me) redirect('/join');
  const current = units?.find((u) => u.available && u.completedLessons < u.lessonCount);
  const byNumber = new Map((units ?? []).map((u) => [u.number, u]));
  const tip = home ? tipOfTheDay(home.tips, 1) : null;

  return (
    <CourseShell track="MENTAL">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-bold">Mental Math</h1>
          <p className="mt-2 text-lg text-muted">
            Work out sums in your head, fast and sure. Each unit teaches one number pattern, then
            you practise it from easy to hard. We teach patterns, not tricks: you’ll always see why
            a shortcut works.
          </p>
        </div>

        <TrackTabs current="MENTAL" />

        <div className="grid gap-4 sm:grid-cols-2">
          {current && (
            <Link
              href={`/units/${current.slug}`}
              className="rounded-2xl border-2 border-accent bg-card p-5 shadow-sm transition hover:border-brand focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <p className="text-sm font-semibold tracking-widest text-brand uppercase">
                Keep going
              </p>
              <p className="mt-1 text-2xl font-bold">
                Mental Math Unit {current.number}: {current.title}
              </p>
              <p className="mt-1 text-muted">
                {current.completedLessons} of {current.lessonCount} lessons done
              </p>
            </Link>
          )}
          {tip && (
            <aside
              aria-labelledby="home-tip"
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <h2 id="home-tip" className="text-lg font-bold">
                <span aria-hidden="true">💡</span> Pattern tip
              </h2>
              <p className="mt-1">
                <MathText text={tip.tip} />
              </p>
              <p className="mt-1 text-sm text-muted">From Unit {tip.unitNumber}</p>
            </aside>
          )}
        </div>

        {(home?.levels ?? []).map((level) => (
          <section
            key={level.number}
            aria-labelledby={`level-${level.number}`}
            className="flex flex-col gap-4"
          >
            <div>
              <h2 id={`level-${level.number}`} className="text-2xl font-semibold">
                Level {level.number}: {level.title}{' '}
                <span className="text-lg font-normal text-muted">(ages {level.ages})</span>
              </h2>
              <p className="mt-1 text-muted">{level.focus}</p>
            </div>
            <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {level.units.map((planned) => {
                const u = byNumber.get(planned.number);
                return (
                  <li key={planned.number}>
                    {u ? (
                      <UnitCard unit={u} />
                    ) : (
                      <div
                        className="block h-full rounded-2xl border border-border bg-card p-5 opacity-60 shadow-sm"
                        aria-disabled="true"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-muted">
                            Mental Math Unit {planned.number}
                          </p>
                          <span className="text-sm text-muted">⏳ Coming soon</span>
                        </div>
                        <h3 className="mt-1 text-lg font-semibold">{planned.title}</h3>
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </CourseShell>
  );
}
