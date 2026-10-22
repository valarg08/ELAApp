import {
  MathHome as MathHomeView,
  SPRINT_MIN,
  type TestCard,
  UnitSummary,
} from '@storyforge/shared';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { TrackTabs } from '@/components/track-tabs';
import { CourseShell } from '@/components/course-shell';
import { navFocus } from '@/components/course-styles';
import { UnitCard } from '@/components/unit-card';
import { points } from '@/features/math/copy';
import { getMe, serverApi } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

const tile =
  'rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-brand focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand';

/**
 * The Math track (math-design.md): AMC 10 preparation at the student's own pace, in four stages
 * with the units in order, today's review, the tests and sprints; the fact sheets sit in the
 * Progress panel.
 */
export default async function MathHome() {
  const [me, units, home] = await Promise.all([
    getMe(),
    serverApi('/units?track=MATH', UnitSummary.array()),
    serverApi('/math/home', MathHomeView),
  ]);
  if (!me) redirect('/join');
  const current = units?.find((u) => u.available && u.completedLessons < u.lessonCount);
  const byNumber = new Map((units ?? []).map((u) => [u.number, u]));
  const stages = home?.stages ?? [];
  const tests = new Map((home?.tests ?? []).map((t) => [t.key, t]));

  return (
    <CourseShell
      track="MATH"
      extra={
        home && (
          <section aria-labelledby="fact-sheets" className="mt-5 border-t border-white/30 pt-4">
            <h3 id="fact-sheets" className="text-sm font-semibold">
              Fact sheets
            </h3>
            {home.factSheets.length === 0 ? (
              <p className="mt-1 text-sm text-white/80">None yet</p>
            ) : (
              <ul className="mt-1 flex flex-col gap-1">
                {home.factSheets.map((f) => (
                  <li key={f.number}>
                    <Link
                      href={`/math/facts/${f.number}`}
                      className={`text-sm text-white underline ${navFocus}`}
                    >
                      Unit {f.number}: {f.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )
      }
    >
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

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {current && (
            <Link
              href={`/units/${current.slug}`}
              className={`${tile} border-2 border-brand sm:col-span-2`}
            >
              <p className="text-sm font-semibold tracking-widest text-brand uppercase">
                Keep going
              </p>
              <p className="mt-1 text-2xl font-bold">
                Math Unit {current.number}: {current.title}
              </p>
              <p className="mt-1 text-muted">
                {current.completedLessons} of {current.lessonCount} lessons done
              </p>
            </Link>
          )}
          {home && (
            <Link href="/math/tests/review" className={tile}>
              <p className="text-lg font-bold">Today’s review</p>
              <p className="text-muted">
                {home.review.doneToday
                  ? 'Done for today ✓'
                  : home.review.due > 0
                    ? `${home.review.due} due · a few minutes`
                    : 'Nothing due yet'}
              </p>
              {home.review.streak > 0 && (
                <p className="mt-1 text-sm text-muted">
                  {home.review.streak} {home.review.streak === 1 ? 'day' : 'days'} in a row
                </p>
              )}
            </Link>
          )}
          <Link href="/math/error-log" className={tile}>
            <p className="text-lg font-bold">My error log</p>
            <p className="text-muted">Problems to redo until you’ve got them</p>
          </Link>
          <Link href="/math/progress" className={tile}>
            <p className="text-lg font-bold">My skills</p>
            <p className="text-muted">Mastery, danger zones and how sure you were</p>
          </Link>
        </div>

        {stages.length > 0 && home?.currentStage && (
          <p className="text-lg">
            You are in{' '}
            <strong>
              Stage {home.currentStage}: {stages.find((s) => s.number === home.currentStage)?.title}
            </strong>
            .
          </p>
        )}

        {stages.length > 0 ? (
          stages.map((stage) => (
            <section
              key={stage.number}
              aria-labelledby={`stage-${stage.number}`}
              className="flex flex-col gap-4"
            >
              <div>
                <h2 id={`stage-${stage.number}`} className="text-2xl font-semibold">
                  Stage {stage.number}: {stage.title}
                  {home?.currentStage === stage.number && (
                    <span className="ml-3 rounded-full bg-brand px-3 py-1 align-middle text-sm text-white">
                      You are here
                    </span>
                  )}
                </h2>
                <p className="mt-1 text-muted">{stage.focus}</p>
              </div>
              <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {stage.tests
                  .filter((k) => k === 'diagnostic')
                  .map((k) => tests.get(k))
                  .filter((t): t is TestCard => Boolean(t))
                  .map((t) => (
                    <li key={t.key}>
                      <TestTile test={t} />
                    </li>
                  ))}
                {stage.units.map((su) => {
                  const u = byNumber.get(su.number);
                  if (!u) return null;
                  return (
                    <li
                      key={`${su.number}-${su.lessons?.join('-') ?? 'all'}`}
                      className="flex flex-col gap-1"
                    >
                      <UnitCard unit={u} />
                      {su.lessons && (
                        <p className="text-sm text-muted">
                          Lessons {su.lessons[0]}–{su.lessons[1]} in this stage
                        </p>
                      )}
                    </li>
                  );
                })}
                {stage.tests
                  .filter((k) => k !== 'diagnostic')
                  .map((k) => tests.get(k))
                  .filter((t): t is TestCard => Boolean(t))
                  .map((t) => (
                    <li key={t.key}>
                      <TestTile test={t} />
                    </li>
                  ))}
                {stage.extras.includes('sprints') && home && (
                  <li>
                    <Link href="/math/tests/sprint" className={`${tile} flex h-full flex-col`}>
                      <p className="text-lg font-bold">Sprints</p>
                      <p className="text-muted">
                        {home.sprintProblems >= SPRINT_MIN
                          ? '10 mixed problems in 20 minutes, AMC scoring'
                          : 'Opens after a few more lessons'}
                      </p>
                    </Link>
                  </li>
                )}
                {stage.extras.includes('light-review') && home && (
                  <li>
                    <Link
                      href="/math/tests/light-review"
                      className={`${tile} flex h-full flex-col`}
                    >
                      <p className="text-lg font-bold">Light review</p>
                      <p className="text-muted">
                        Easy problems on skills you know, with fact cards
                      </p>
                    </Link>
                  </li>
                )}
              </ol>
            </section>
          ))
        ) : (
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
        )}
      </div>
    </CourseShell>
  );
}

function TestTile({ test }: { test: TestCard }) {
  return (
    <Link href={`/math/tests/${test.key}`} className={`${tile} flex h-full flex-col gap-1`}>
      <p className="text-sm font-semibold tracking-widest text-brand uppercase">
        {test.kind === 'diagnostic' ? 'Diagnostic' : 'Checkpoint'}
      </p>
      <p className="text-lg font-bold">{test.title}</p>
      <p className="text-muted">
        {test.problemCount} problems
        {test.timeLimitMinutes ? ` · ${test.timeLimitMinutes} min` : ''}
      </p>
      {!test.unlocked && test.lockedReason && (
        <p className="text-sm text-muted">🔒 {test.lockedReason}</p>
      )}
      {test.best && (
        <p className="text-sm">
          Best: {points(test.best.points)} points ({test.best.correct} of {test.best.total})
        </p>
      )}
      {test.openAttemptId && <p className="text-sm font-semibold text-brand">In progress</p>}
    </Link>
  );
}
