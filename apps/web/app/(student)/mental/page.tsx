import {
  MENTAL_SPRINT_MIN,
  MENTAL_UNIT_TEST_PASS,
  MENTAL_UNIT_TEST_SECONDS,
  MENTAL_UNIT_TEST_SIZE,
  type MentalLevelCheck,
  type MentalUnitTest,
  MentalHome as MentalHomeView,
  UnitSummary,
} from '@storyforge/shared';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CourseShell } from '@/components/course-shell';
import { MathText } from '@/components/math-text';
import { tipOfTheDay } from '@/components/mental-cheat-sheets';
import { TrackTabs } from '@/components/track-tabs';
import { UnitCard } from '@/components/unit-card';
import { clock } from '@/features/math/copy';
import { currentUnit } from '@/lib/current-unit';
import { getMe, serverApi } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

/**
 * The Mental Math track (mental-math-design.md): number sense for ages 7–14 in four levels by age,
 * each unit one pattern. Units not written yet show as coming soon; the cheat sheets and the day's
 * tip sit in the Progress panel. Practice: the daily review with its streak, speed sprints with a
 * personal best, the placement check, a timed test after each unit and a level check (with a badge)
 * after each level.
 */
export default async function MentalHome() {
  const [me, units, home] = await Promise.all([
    getMe(),
    serverApi('/units?track=MENTAL', UnitSummary.array()),
    serverApi('/mental/home', MentalHomeView),
  ]);
  if (!me) redirect('/join');
  const current = currentUnit(units ?? []);
  const practice = home?.practice ?? null;
  const byNumber = new Map((units ?? []).map((u) => [u.number, u]));
  // A locked unit waits for the last built unit before it (a planned unit may not be built yet).
  const previousOpen = (n: number) =>
    Math.max(
      0,
      ...(units ?? [])
        .filter((p) => p.number < n && p.lockReason !== 'COMING_SOON')
        .map((p) => p.number),
    ) || undefined;
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
          {current && current.completedLessons < current.lessonCount && (
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

        {practice && (
          <section aria-labelledby="practice" className="flex flex-col gap-4">
            <h2 id="practice" className="text-2xl font-semibold">
              Practice
            </h2>
            <ul className="grid gap-4 sm:grid-cols-3">
              <PracticeCard
                href="/mental/tests/mental-review"
                emoji="🔁"
                title="Today’s review"
                line={
                  practice.review.doneToday
                    ? '✓ Done for today'
                    : practice.review.due > 0
                      ? `${practice.review.due} questions due`
                      : 'Nothing due yet'
                }
                extra={
                  practice.review.streak > 0
                    ? `🔥 ${practice.review.streak} ${practice.review.streak === 1 ? 'day' : 'days'} in a row`
                    : 'Do it every day to build a streak'
                }
              />
              <PracticeCard
                href="/mental/tests/mental-sprint"
                emoji="⚡"
                title="Speed sprint"
                line={
                  practice.sprint.available < MENTAL_SPRINT_MIN
                    ? 'Opens after your first lesson'
                    : '10 questions, 3 minutes'
                }
                extra={
                  practice.sprint.best
                    ? `Your best: ${practice.sprint.best.correct} right in ${clock(practice.sprint.best.seconds)}`
                    : 'Set your first best score'
                }
              />
              <PracticeCard
                href="/mental/tests/mental-placement"
                emoji="🧭"
                title="Placement check"
                line={
                  practice.placement.level
                    ? `You start at Level ${practice.placement.level}`
                    : 'Not sure where to start?'
                }
                extra="12 questions from all four levels"
              />
            </ul>
            <p className="flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/mental/progress" className="text-brand underline">
                My skills
              </Link>
              <Link href="/mental/mistakes" className="text-brand underline">
                My mistakes
              </Link>
              <Link href="/mental/parents" className="text-brand underline">
                Parent guide
              </Link>
            </p>
          </section>
        )}

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
                      <UnitCard unit={u} previousNumber={previousOpen(u.number)} />
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
            {practice && (
              <UnitTests
                tests={practice.unitTests.filter((t) =>
                  level.units.some((u) => u.number === t.unit),
                )}
              />
            )}
            {practice?.levelChecks
              .filter((c) => c.level === level.number)
              .map((c) => (
                <LevelCheckCard key={c.level} check={c} />
              ))}
          </section>
        ))}
      </div>
    </CourseShell>
  );
}

function PracticeCard({
  href,
  emoji,
  title,
  line,
  extra,
}: {
  href: string;
  emoji: string;
  title: string;
  line: string;
  extra: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="block h-full rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-brand focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <p className="text-lg font-bold">
          <span aria-hidden="true">{emoji} </span>
          {title}
        </p>
        <p className="mt-1">{line}</p>
        <p className="mt-1 text-sm text-muted">{extra}</p>
      </Link>
    </li>
  );
}

/** The timed test after each unit of a level: locked until the unit's lessons are done. */
function UnitTests({ tests }: { tests: MentalUnitTest[] }) {
  if (tests.length === 0) return null;
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="font-semibold">
        <span aria-hidden="true">⏱️ </span>Unit tests
        <span className="font-normal text-muted">
          {' '}
          · {MENTAL_UNIT_TEST_SIZE} questions in {MENTAL_UNIT_TEST_SECONDS / 60} minutes, all{' '}
          {MENTAL_UNIT_TEST_PASS} right to pass
        </span>
      </p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {tests.map((t) => (
          <li key={t.unit}>
            {t.unlocked ? (
              <Link
                href={`/mental/tests/mental-unit-${t.unit}`}
                className="inline-flex min-h-11 items-center rounded-xl border border-border px-3 text-sm hover:border-brand focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                {t.passed && <span aria-hidden="true">✅ </span>}
                Unit {t.unit} test
                {t.passed && <span className="sr-only"> (passed)</span>}
                {t.best !== null && (
                  <span className="ml-1 text-muted">
                    · best {t.best}/{MENTAL_UNIT_TEST_SIZE}
                  </span>
                )}
              </Link>
            ) : (
              <span
                className="inline-flex min-h-11 items-center rounded-xl border border-dashed border-border px-3 text-sm text-muted"
                aria-disabled="true"
              >
                <span aria-hidden="true">🔒 </span>Unit {t.unit} test
                <span className="sr-only"> (finish the unit's lessons first)</span>
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The level check after a level's units: locked until they are done, then a badge to earn. */
function LevelCheckCard({ check }: { check: MentalLevelCheck }) {
  const body = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="font-semibold">
        <span aria-hidden="true">{check.passed ? '🏅 ' : '⭐ '}</span>
        Level {check.level} check
        {check.passed && ' · badge earned'}
      </p>
      <p className="text-sm text-muted">
        {!check.unlocked
          ? `🔒 ${check.lockedReason ?? 'Not open yet.'}`
          : check.best !== null
            ? `Best: ${check.best} of 10`
            : '10 questions · 9 right for the badge'}
      </p>
    </div>
  );
  const base = 'block rounded-2xl border-2 border-dashed border-border bg-card p-4';
  return check.unlocked ? (
    <Link
      href={`/mental/tests/mental-level-${check.level}`}
      className={`${base} transition hover:border-brand focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand`}
    >
      {body}
    </Link>
  ) : (
    <div className={`${base} opacity-60`} aria-disabled="true">
      {body}
    </div>
  );
}
