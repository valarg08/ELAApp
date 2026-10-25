import { MASTERY_LABELS, MentalProgress } from '@storyforge/shared';
import Link from 'next/link';
import { CourseShell } from '@/components/course-shell';
import { TrackTabs } from '@/components/track-tabs';
import { ErrorMessage } from '@/components/ui';
import { clock } from '@/features/math/copy';
import { serverApi } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

const LEVEL_STYLE = {
  new: 'border-border',
  learning: 'border-warn/60',
  strong: 'border-brand/60',
  mastered: 'border-ok',
} as const;

/** Mastery per Mental Math skill, by unit, with the review streak, the sprint best and badges. */
export default async function MentalProgressPage() {
  const progress = await serverApi('/mental/progress', MentalProgress);

  return (
    <CourseShell track="MENTAL">
      <div className="flex flex-col gap-8">
        <div>
          <Link href="/mental" className="text-brand underline">
            ← Mental Math
          </Link>
          <h1 className="mt-4 text-4xl font-bold">My skills</h1>
          <p className="mt-2 text-lg text-muted">
            Every pattern you practise, from New to Mastered. A skill gets stronger with right
            answers on different days, so keep up the daily review.
          </p>
        </div>
        <TrackTabs current="MENTAL" />
        {!progress ? (
          <ErrorMessage message="Could not load your skills." />
        ) : (
          <>
            <ul className="grid gap-4 sm:grid-cols-3">
              <li className="rounded-2xl border border-border bg-card p-5">
                <p className="text-sm font-semibold text-muted">Review streak</p>
                <p className="mt-1 text-2xl font-bold">
                  <span aria-hidden="true">🔥 </span>
                  {progress.streak} {progress.streak === 1 ? 'day' : 'days'}
                </p>
              </li>
              <li className="rounded-2xl border border-border bg-card p-5">
                <p className="text-sm font-semibold text-muted">Best sprint</p>
                <p className="mt-1 text-2xl font-bold">
                  {progress.sprintBest
                    ? `${progress.sprintBest.correct} right in ${clock(progress.sprintBest.seconds)}`
                    : 'Not yet'}
                </p>
              </li>
              <li className="rounded-2xl border border-border bg-card p-5">
                <p className="text-sm font-semibold text-muted">Level badges</p>
                <p className="mt-1 text-2xl font-bold">
                  {progress.badges.length > 0
                    ? progress.badges.map((b) => `🏅 Level ${b}`).join(', ')
                    : 'None yet'}
                </p>
              </li>
            </ul>
            {progress.units.map((u) => (
              <section key={u.number} aria-labelledby={`unit-${u.number}`}>
                <h2 id={`unit-${u.number}`} className="text-xl font-semibold">
                  Mental Math Unit {u.number}: {u.title}
                </h2>
                <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                  {u.skills.map((s) => (
                    <li
                      key={s.skill}
                      className={`flex items-center justify-between gap-3 rounded-xl border-2 bg-card p-3 ${LEVEL_STYLE[s.level]}`}
                    >
                      <span>{s.label}</span>
                      <span className="text-right text-sm">
                        <strong>{MASTERY_LABELS[s.level]}</strong>
                        {s.accuracy !== null && (
                          <span className="block text-muted">
                            {s.accuracy}% · {s.answered} answered
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </>
        )}
      </div>
    </CourseShell>
  );
}
