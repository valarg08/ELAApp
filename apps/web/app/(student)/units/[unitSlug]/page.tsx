import {
  MENTAL_UNIT_TEST_PASS,
  MENTAL_UNIT_TEST_SECONDS,
  MENTAL_UNIT_TEST_SIZE,
  UnitDetail,
  unitLabel,
} from '@storyforge/shared';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MathText } from '@/components/math-text';
import { ProgressBar } from '@/components/progress-bar';
import { CourseShell } from '@/components/course-shell';
import { Card } from '@/components/ui';
import { serverApi } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

export default async function UnitPage({ params }: PageProps<'/units/[unitSlug]'>) {
  const { unitSlug } = await params;
  const unit = await serverApi(`/units/${encodeURIComponent(unitSlug)}`, UnitDetail);
  if (!unit) notFound();

  return (
    <CourseShell track={unit.track} unitSlug={unit.slug}>
      <div className="flex flex-col gap-8">
        <div>
          <p className="text-sm font-semibold tracking-widest text-muted uppercase">
            {unitLabel(unit.track, unit.number)}
          </p>
          <h1 className="text-4xl font-bold">{unit.title}</h1>
          <p className="mt-2 text-lg text-muted">{unit.summary}</p>
        </div>

        {!unit.available ? (
          <Card>
            <p className="text-lg">
              {unit.lockReason === 'COMING_SOON'
                ? '⏳ This unit is coming soon.'
                : unit.lockReason === 'FINISH_PREVIOUS'
                  ? `🔒 Finish ${unitLabel(unit.track, unit.number - 1)} to unlock this unit.`
                  : '🔒 Your teacher hasn’t unlocked this unit yet.'}
            </p>
          </Card>
        ) : (
          <>
            {unit.bigIdeas.length > 0 && (
              <Card>
                <h2 className="text-xl font-semibold">Big ideas</h2>
                <ul className="mt-3 list-disc space-y-1 pl-5">
                  {unit.bigIdeas.map((idea) => (
                    <li key={idea}>{idea}</li>
                  ))}
                </ul>
              </Card>
            )}

            {unit.tips.length > 0 && (
              <section
                aria-labelledby="pattern-tips"
                className="rounded-2xl border-2 border-accent bg-card p-5 shadow-sm"
              >
                <h2 id="pattern-tips" className="text-xl font-semibold">
                  <span aria-hidden="true">💡 </span>Pattern tips
                </h2>
                <ul className="mt-3 list-disc space-y-1 pl-5">
                  {unit.tips.map((tip) => (
                    <li key={tip}>
                      <MathText text={tip} />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* From md up the lessons are listed in the Chapters panel (DESIGN.md §6.2); phones fold it. */}
            <section aria-labelledby="lessons" className="md:hidden">
              <h2 id="lessons" className="mb-4 text-2xl font-semibold">
                Lessons
              </h2>
              <ol className="flex flex-col gap-3">
                {unit.lessons.map((lesson) => (
                  <li key={lesson.id}>
                    {lesson.locked ? (
                      <div className="flex flex-col gap-2 rounded-2xl border border-dashed border-border bg-card p-5 text-muted sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm">
                            Lesson {lesson.order} · about {lesson.estMinutes} min
                          </p>
                          <p className="text-lg font-semibold">{lesson.title}</p>
                        </div>
                        <p className="text-sm">
                          <span aria-hidden="true">🔒 </span>Finish Lesson {lesson.order - 1} first
                        </p>
                      </div>
                    ) : (
                      <Link
                        href={`/lessons/${lesson.id}`}
                        className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-brand focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="text-sm text-muted">
                            Lesson {lesson.order} · about {lesson.estMinutes} min
                          </p>
                          <p className="text-lg font-semibold">{lesson.title}</p>
                        </div>
                        <div className="w-full sm:w-48">
                          {lesson.completed ? (
                            <p className="font-semibold text-ok">✓ Completed</p>
                          ) : (
                            <>
                              <ProgressBar
                                value={lesson.completedSteps}
                                max={lesson.totalSteps}
                                label={`${lesson.title} progress`}
                              />
                              <p className="mt-1 text-sm text-muted">
                                {lesson.completedSteps === 0
                                  ? 'Not started'
                                  : `${lesson.completedSteps} of ${lesson.totalSteps} steps`}
                              </p>
                            </>
                          )}
                        </div>
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </section>

            {unit.track === 'MENTAL' && <MentalUnitTestCard unit={unit} />}
          </>
        )}
      </div>
    </CourseShell>
  );
}

/** Mental Math: the timed test after the unit, open once every lesson is finished. */
function MentalUnitTestCard({ unit }: { unit: UnitDetail }) {
  const done = unit.lessons.length > 0 && unit.lessons.every((l) => l.completed);
  const body = (
    <>
      <p className="text-lg font-bold">
        <span aria-hidden="true">⏱️ </span>Unit {unit.number} test
      </p>
      <p className="mt-1">
        {MENTAL_UNIT_TEST_SIZE} questions in {MENTAL_UNIT_TEST_SECONDS / 60} minutes, with the timer
        in the side panel. Get all {MENTAL_UNIT_TEST_PASS} right to pass.
      </p>
      <p className="mt-1 text-sm text-muted">
        {done ? 'Ready when you are!' : 'Opens when you finish every lesson of this unit.'}
      </p>
    </>
  );
  const base = 'block rounded-2xl border-2 border-dashed bg-card p-5';
  return done ? (
    <Link
      href={`/mental/tests/mental-unit-${unit.number}`}
      className={`${base} border-accent shadow-sm transition hover:border-brand focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand`}
    >
      {body}
    </Link>
  ) : (
    <div className={`${base} border-border opacity-70`} aria-disabled="true">
      {body}
    </div>
  );
}
