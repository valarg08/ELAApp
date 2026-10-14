import { ESSAY_STRANDS, type LessonProgressRow, TrackProgress } from '@storyforge/shared';
import Link from 'next/link';
import { ProgressBar } from '@/components/progress-bar';
import { TrackTabs } from '@/components/track-tabs';
import { Card, ErrorMessage, PageShell } from '@/components/ui';
import { serverApi } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

/** The Essay Writing progress tracker (DESIGN.md §9.12). */
export default async function EssayProgress() {
  const progress = await serverApi('/progress?track=ESSAY', TrackProgress);

  return (
    <PageShell width="max-w-5xl">
      <div className="flex flex-col gap-8">
        <div>
          <Link href="/essays" className="text-brand underline">
            ← Essay Writing
          </Link>
          <h1 className="mt-4 text-4xl font-bold">My essay progress</h1>
        </div>
        <TrackTabs current="ESSAY" />
        {progress ? (
          <Tracker progress={progress} />
        ) : (
          <ErrorMessage message="Could not load your progress." />
        )}
      </div>
    </PageShell>
  );
}

function Tracker({ progress }: { progress: TrackProgress }) {
  const { totals, units } = progress;
  const doneUnits = new Set(
    units
      .filter((u) => u.lessonCount > 0 && u.completedLessons === u.lessonCount)
      .map((u) => u.number),
  );
  return (
    <>
      <section aria-labelledby="totals" className="grid gap-4 sm:grid-cols-3">
        <h2 id="totals" className="sr-only">
          Totals
        </h2>
        <Stat label="Lessons finished" value={totals.completedLessons} of={totals.lessons} />
        <Stat label="Unit quizzes passed" value={totals.quizzesPassed} of={totals.quizzes} />
        <Stat label="Writing tasks handed in" value={totals.writingSubmitted} />
      </section>

      <section aria-labelledby="skills">
        <h2 id="skills" className="mb-3 text-2xl font-semibold">
          Skill badges
        </h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {ESSAY_STRANDS.map((s) => {
            const earned = s.units.every((n) => doneUnits.has(n));
            const finished = s.units.filter((n) => doneUnits.has(n)).length;
            return (
              <li
                key={s.id}
                className={`flex flex-col items-center gap-1 rounded-2xl border p-4 text-center ${
                  earned ? 'border-ok bg-card' : 'border-dashed border-border'
                }`}
              >
                <span className={`text-3xl ${earned ? '' : 'grayscale'}`} aria-hidden="true">
                  {s.emoji}
                </span>
                <span className="font-semibold">{s.label}</span>
                <span className={`text-sm ${earned ? 'font-semibold text-ok' : 'text-muted'}`}>
                  {earned
                    ? '✓ Earned'
                    : `${finished} of ${s.units.length} ${s.units.length === 1 ? 'unit' : 'units'}`}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="units" className="flex flex-col gap-3">
        <h2 id="units" className="text-2xl font-semibold">
          Units and lessons
        </h2>
        {units.map((u) => (
          <details
            key={u.id}
            open={u.available && u.completedLessons < u.lessonCount && u.completedLessons > 0}
            className="rounded-2xl border border-border bg-card p-4"
          >
            <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2 font-semibold">
              <span>
                Essay Unit {u.number}: {u.title}
              </span>
              <span className="text-sm font-normal text-muted">
                {!u.available
                  ? u.lockReason === 'COMING_SOON'
                    ? '⏳ Coming soon'
                    : '🔒 Locked'
                  : u.completedLessons === u.lessonCount
                    ? '✓ Done'
                    : `${u.completedLessons}/${u.lessonCount} lessons`}
              </span>
            </summary>
            {u.available ? (
              <div className="mt-3 flex flex-col gap-3">
                <ProgressBar
                  value={u.completedLessons}
                  max={u.lessonCount}
                  label={`Essay Unit ${u.number} progress`}
                />
                <div className="overflow-x-auto">
                  <table className="w-full min-w-md text-left text-sm">
                    <caption className="sr-only">Lessons in Essay Unit {u.number}</caption>
                    <thead className="text-muted">
                      <tr>
                        <th scope="col" className="py-1 pr-2 font-semibold">
                          Lesson
                        </th>
                        <th scope="col" className="py-1 pr-2 font-semibold">
                          Status
                        </th>
                        <th scope="col" className="py-1 pr-2 font-semibold">
                          Quiz
                        </th>
                        <th scope="col" className="py-1 font-semibold">
                          Writing
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {u.lessons.map((l) => (
                        <LessonRow key={l.id} lesson={l} />
                      ))}
                    </tbody>
                  </table>
                </div>
                <Link href={`/units/${u.slug}`} className="self-start text-brand underline">
                  Open Essay Unit {u.number}
                </Link>
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted">
                {u.lockReason === 'COMING_SOON'
                  ? 'These lessons are on their way.'
                  : 'Finish the unit before this one to open it.'}
              </p>
            )}
          </details>
        ))}
      </section>
    </>
  );
}

function Stat({ label, value, of }: { label: string; value: number; of?: number }) {
  return (
    <Card className="flex flex-col gap-1">
      <p className="text-3xl font-bold">
        {value}
        {of !== undefined && <span className="text-lg text-muted"> / {of}</span>}
      </p>
      <p className="text-muted">{label}</p>
    </Card>
  );
}

function LessonRow({ lesson: l }: { lesson: LessonProgressRow }) {
  return (
    <tr className="border-t border-border">
      <td className="py-2 pr-2">
        {l.order}. {l.title}
      </td>
      <td className="py-2 pr-2">
        {l.completed ? (
          <span className="font-semibold text-ok">✓ Done</span>
        ) : l.locked ? (
          <span className="text-muted">🔒 Locked</span>
        ) : (
          <span>
            {l.completedSteps}/{l.totalSteps} steps
          </span>
        )}
      </td>
      <td className="py-2 pr-2">
        {!l.quiz ? (
          <span className="text-muted">—</span>
        ) : l.quiz.bestPercent === null ? (
          <span className="text-muted">Not tried</span>
        ) : (
          <span className={l.quiz.passed ? 'font-semibold text-ok' : 'text-warn'}>
            {l.quiz.bestPercent}% {l.quiz.passed ? '✓' : `(${l.quiz.attempts} tries)`}
          </span>
        )}
      </td>
      <td className="py-2">
        {!l.writing.submitted ? (
          <span className="text-muted">Not yet</span>
        ) : l.writing.score !== null && l.writing.maxScore ? (
          <span>
            {Math.round(l.writing.score)}/{l.writing.maxScore}
          </span>
        ) : (
          <span>Handed in ✓</span>
        )}
      </td>
    </tr>
  );
}
