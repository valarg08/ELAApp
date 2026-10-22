import { UnitDetail, unitLabel } from '@storyforge/shared';
import Link from 'next/link';
import { notFound } from 'next/navigation';
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

            <section aria-labelledby="lessons">
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
          </>
        )}
      </div>
    </CourseShell>
  );
}
