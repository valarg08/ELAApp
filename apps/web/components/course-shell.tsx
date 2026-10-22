import {
  TRACK_HOME,
  TRACK_NAMES,
  type Track,
  UnitDetail,
  UnitSummary,
  unitLabel,
} from '@storyforge/shared';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { serverApi } from '@/lib/server-api';
import { ProgressBar } from './progress-bar';

const focus = 'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand';
const panel = 'rounded-2xl border border-border bg-card p-4 shadow-sm';
const pct = (done: number, total: number) => (total === 0 ? 0 : Math.round((done / total) * 100));

/**
 * The course frame around the unit and lesson pages: the track's chapters (units) and the current
 * unit's lessons on the left, progress on the right. On small screens both collapse above and
 * below the page.
 */
export async function CourseShell({
  track,
  unitSlug,
  lessonId,
  children,
}: {
  track: Track;
  unitSlug: string;
  lessonId?: string;
  children: ReactNode;
}) {
  const [units, unit] = await Promise.all([
    serverApi(`/units?track=${track}`, UnitSummary.array()),
    serverApi(`/units/${encodeURIComponent(unitSlug)}`, UnitDetail),
  ]);
  const chapters = units ?? [];
  const lesson = lessonId ? unit?.lessons.find((l) => l.id === lessonId) : undefined;
  const trackDone = chapters.reduce((n, u) => n + u.completedLessons, 0);
  const trackTotal = chapters.reduce((n, u) => n + u.lessonCount, 0);
  const unitDone = unit?.lessons.filter((l) => l.completed).length ?? 0;

  const chapterNav = (
    <nav aria-label="Chapters">
      <Link href={TRACK_HOME[track]} className={`text-sm text-brand underline ${focus}`}>
        ← {TRACK_NAMES[track]}
      </Link>
      <ol className="mt-3 flex flex-col gap-1">
        {chapters.map((u) => {
          const current = u.slug === unitSlug;
          const done = u.lessonCount > 0 && u.completedLessons >= u.lessonCount;
          return (
            <li key={u.id}>
              {u.available ? (
                <Link
                  href={`/units/${u.slug}`}
                  aria-current={current && !lessonId ? 'page' : undefined}
                  className={`flex min-h-11 items-start gap-2 rounded-xl px-2 py-2 text-sm hover:bg-background ${focus} ${current ? 'bg-background font-semibold text-brand' : ''}`}
                >
                  <span aria-hidden="true" className="w-4 shrink-0">
                    {done ? '✓' : ''}
                  </span>
                  <span>
                    <span className="block text-xs text-muted">{unitLabel(track, u.number)}</span>
                    {u.title}
                    {done && <span className="sr-only"> (completed)</span>}
                  </span>
                </Link>
              ) : (
                <p className="flex items-start gap-2 px-2 py-2 text-sm text-muted">
                  <span aria-hidden="true" className="w-4 shrink-0">
                    🔒
                  </span>
                  <span>
                    <span className="block text-xs">{unitLabel(track, u.number)}</span>
                    {u.title}
                    <span className="sr-only"> (locked)</span>
                  </span>
                </p>
              )}
              {current && unit?.available && unit.lessons.length > 0 && (
                <ol
                  aria-label={`${unit.title} lessons`}
                  className="mt-1 mb-2 ml-6 border-l border-border"
                >
                  {unit.lessons.map((l) => (
                    <li key={l.id}>
                      {l.locked ? (
                        <p className="py-1.5 pl-3 text-sm text-muted">
                          <span aria-hidden="true">🔒 </span>
                          {l.order}. {l.title}
                          <span className="sr-only"> (locked)</span>
                        </p>
                      ) : (
                        <Link
                          href={`/lessons/${l.id}`}
                          aria-current={l.id === lessonId ? 'page' : undefined}
                          className={`-ml-px flex min-h-11 items-center gap-1 border-l-2 py-1.5 pl-3 text-sm hover:text-brand ${focus} ${l.id === lessonId ? 'border-brand font-semibold text-brand' : 'border-transparent'}`}
                        >
                          {l.completed && (
                            <span aria-hidden="true" className="text-ok">
                              ✓
                            </span>
                          )}
                          <span>
                            {l.order}. {l.title}
                            {l.completed && <span className="sr-only"> (completed)</span>}
                          </span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ol>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );

  const progress = (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-sm font-semibold">{TRACK_NAMES[track]}</p>
        <ProgressBar value={trackDone} max={trackTotal} label={`${TRACK_NAMES[track]} progress`} />
        <p className="mt-1 text-sm text-muted">
          {trackDone} of {trackTotal} lessons · {pct(trackDone, trackTotal)}%
        </p>
      </div>
      {unit && (
        <div>
          <p className="text-sm font-semibold">
            {unitLabel(track, unit.number)}: {unit.title}
          </p>
          <ProgressBar
            value={unitDone}
            max={unit.lessons.length}
            label={`${unit.title} progress`}
          />
          <p className="mt-1 text-sm text-muted">
            {unitDone} of {unit.lessons.length} lessons
          </p>
        </div>
      )}
      {lesson && (
        <div>
          <p className="text-sm font-semibold">This lesson</p>
          <ProgressBar
            value={lesson.completedSteps}
            max={lesson.totalSteps}
            label={`${lesson.title} progress`}
          />
          <p className="mt-1 text-sm text-muted">
            {lesson.completed
              ? '✓ Completed'
              : `${lesson.completedSteps} of ${lesson.totalSteps} steps · about ${lesson.estMinutes} min`}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="mx-auto grid w-full max-w-7xl flex-1 gap-6 px-4 py-6 lg:grid-cols-[16rem_minmax(0,1fr)_15rem] lg:py-10">
      <aside className="lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:self-start lg:overflow-y-auto">
        <details className={`${panel} lg:hidden`}>
          <summary className={`min-h-11 cursor-pointer content-center font-semibold ${focus}`}>
            Chapters
          </summary>
          <div className="mt-3">{chapterNav}</div>
        </details>
        <div className={`${panel} hidden lg:block`}>
          <h2 className="mb-2 text-lg font-semibold">Chapters</h2>
          {chapterNav}
        </div>
      </aside>

      <main className="min-w-0">{children}</main>

      <aside
        aria-label="Progress"
        className="order-last lg:order-none lg:sticky lg:top-6 lg:self-start"
      >
        <div className={panel}>
          <h2 className="mb-3 text-lg font-semibold">Progress</h2>
          {progress}
        </div>
      </aside>
    </div>
  );
}
