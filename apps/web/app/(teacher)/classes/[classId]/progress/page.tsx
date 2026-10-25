import {
  ClassMathSkills,
  ClassMentalSkills,
  ClassProgress,
  ClassSummary,
  INACTIVE_DAYS,
  type LessonCell,
  type StudentProgressRow,
  Track,
  UNIT_WORD,
  isMathTrack,
} from '@storyforge/shared';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TrackTabs } from '@/components/track-tabs';
import { Card, PageShell } from '@/components/ui';
import { ClassMentalPractice } from '@/features/math/class-mental-practice';
import { ClassSkillsGrid } from '@/features/math/class-skills-grid';
import { serverApi } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

const FILTERS = [
  { id: 'all', label: 'Everyone' },
  { id: 'inactive', label: `Inactive ${INACTIVE_DAYS}+ days` },
  { id: 'help', label: 'Needs help' },
] as const;
type Filter = (typeof FILTERS)[number]['id'];

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

/** Class progress (DESIGN.md §11.3): this week's numbers and the students × lessons heatmap. */
export default async function ClassProgressPage({
  params,
  searchParams,
}: PageProps<'/classes/[classId]/progress'>) {
  const { classId } = await params;
  const query = await searchParams;
  const track = Track.catch('STORY').parse(one(query.track)?.toUpperCase());
  const unitParam = one(query.unit);
  const filter: Filter = FILTERS.find((f) => f.id === one(query.show))?.id ?? 'all';
  // Math and Mental Math: the skills × students grid (math-design.md §3.3 C5) instead of the
  // lesson heatmap; Mental Math adds each student's practice (mental-math-design.md Part 9).
  const skillsView = isMathTrack(track) && one(query.view) === 'skills';
  const [klass, progress, mathSkills, mentalSkills] = await Promise.all([
    serverApi(`/teacher/classes/${classId}`, ClassSummary),
    serverApi(
      `/teacher/classes/${classId}/progress?track=${track}${unitParam ? `&unit=${encodeURIComponent(unitParam)}` : ''}`,
      ClassProgress,
    ),
    skillsView && track === 'MATH'
      ? serverApi(`/teacher/classes/${classId}/math-skills`, ClassMathSkills)
      : null,
    skillsView && track === 'MENTAL'
      ? serverApi(`/teacher/classes/${classId}/mental-skills`, ClassMentalSkills)
      : null,
  ]);
  if (!klass || !progress) notFound();

  const base = `/classes/${classId}/progress`;
  const href = (changes: { track?: Track; unit?: number | null; show?: Filter }) => {
    const next = new URLSearchParams();
    const t = changes.track ?? track;
    next.set('track', t.toLowerCase());
    const u = changes.track
      ? null
      : changes.unit === undefined
        ? progress.unit?.number
        : changes.unit;
    if (u) next.set('unit', String(u));
    const s = changes.show ?? filter;
    if (s !== 'all') next.set('show', s);
    return `${base}?${next.toString()}`;
  };
  const unitName = UNIT_WORD[track];
  const students = progress.students.filter((s) =>
    filter === 'inactive' ? s.inactive : filter === 'help' ? s.needsHelp : true,
  );
  const { week } = progress;

  return (
    <PageShell full>
      <div className="flex flex-col gap-8">
        <div>
          <Link href={`/classes/${classId}`} className="text-brand underline">
            ← {klass.name}
          </Link>
          <h1 className="mt-3 text-3xl font-bold">Class progress</h1>
          <p className="mt-1 text-muted">
            {klass.name} · {week.totalStudents} {week.totalStudents === 1 ? 'student' : 'students'}
          </p>
        </div>

        <section aria-labelledby="week-heading">
          <h2 id="week-heading" className="mb-3 text-xl font-semibold">
            The last 7 days
          </h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            <Stat
              value={`${week.activeStudents} / ${week.totalStudents}`}
              label="Active students"
            />
            <Stat value={week.lessonsCompleted} label="Lessons finished" />
            <Stat value={week.submissions} label="Writing handed in" />
            <Stat value={week.wordsSubmitted.toLocaleString('en')} label="Words handed in" />
            <Stat
              value={week.averageScorePercent === null ? '—' : `${week.averageScorePercent}%`}
              label="Average feedback score"
            />
          </div>
        </section>

        <TrackTabs current={track} hrefFor={(t) => href({ track: t })} />

        {isMathTrack(track) && (
          <nav aria-label={track === 'MATH' ? 'Math view' : 'Mental Math view'}>
            <ul className="flex flex-wrap gap-2">
              {[
                { id: 'lessons', label: 'Lessons', to: href({}) },
                {
                  id: 'skills',
                  label: track === 'MATH' ? 'Skills' : 'Skills & practice',
                  to: `${base}?track=${track.toLowerCase()}&view=skills`,
                },
              ].map((v) => {
                const active = (v.id === 'skills') === skillsView;
                return (
                  <li key={v.id}>
                    <Link
                      href={v.to}
                      aria-current={active ? 'page' : undefined}
                      className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-semibold focus-visible:outline-3 focus-visible:outline-brand ${
                        active
                          ? 'border-brand bg-brand text-white'
                          : 'border-border bg-card hover:border-brand'
                      }`}
                    >
                      {v.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        {skillsView && track === 'MENTAL' ? (
          mentalSkills ? (
            <>
              <ClassMentalPractice data={mentalSkills} />
              <ClassSkillsGrid data={mentalSkills} trackName="Mental Math" />
            </>
          ) : (
            <p className="text-muted">Could not load the skills.</p>
          )
        ) : skillsView ? (
          mathSkills ? (
            <ClassSkillsGrid data={mathSkills} />
          ) : (
            <p className="text-muted">Could not load the skills.</p>
          )
        ) : progress.unit === null ? (
          <p className="text-muted">No units are published in this track yet.</p>
        ) : (
          <section aria-labelledby="heatmap-heading" className="flex flex-col gap-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 id="heatmap-heading" className="text-xl font-semibold">
                {unitName} {progress.unit.number}: {progress.unit.title}
              </h2>
              <form method="get" action={base} className="flex flex-wrap items-end gap-2">
                <input type="hidden" name="track" value={track.toLowerCase()} />
                {filter !== 'all' && <input type="hidden" name="show" value={filter} />}
                <label className="flex flex-col text-sm font-semibold">
                  Unit
                  <select
                    name="unit"
                    defaultValue={progress.unit.number}
                    className="mt-1 min-h-11 rounded-lg border border-border bg-background px-3 font-normal"
                  >
                    {progress.units.map((u) => (
                      <option key={u.id} value={u.number}>
                        {unitName} {u.number}: {u.title}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="submit"
                  className="min-h-11 rounded-lg border border-border bg-card px-4 font-semibold hover:border-brand focus-visible:outline-3 focus-visible:outline-brand"
                >
                  Show
                </button>
              </form>
            </div>

            <nav aria-label="Filter students">
              <ul className="flex flex-wrap gap-2">
                {FILTERS.map((f) => {
                  const count =
                    f.id === 'all'
                      ? progress.students.length
                      : progress.students.filter((s) =>
                          f.id === 'inactive' ? s.inactive : s.needsHelp,
                        ).length;
                  return (
                    <li key={f.id}>
                      <Link
                        href={href({ show: f.id })}
                        aria-current={filter === f.id ? 'page' : undefined}
                        className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-semibold focus-visible:outline-3 focus-visible:outline-brand ${
                          filter === f.id
                            ? 'border-brand bg-brand text-white'
                            : 'border-border bg-card hover:border-brand'
                        }`}
                      >
                        {f.label} ({count})
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <Legend math={isMathTrack(track)} />

            {students.length === 0 ? (
              <p className="text-muted">
                {progress.students.length === 0
                  ? 'No students yet. Add them on the class page.'
                  : 'No students match this filter.'}
              </p>
            ) : (
              <section
                className="overflow-x-auto rounded-2xl border border-border bg-card focus-visible:outline-3 focus-visible:outline-brand"
                // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a scrollable region must be keyboard focusable (axe)
                tabIndex={0}
                aria-label="Progress heatmap"
              >
                <table className="w-full min-w-2xl text-left text-sm">
                  <caption className="sr-only">
                    Progress in {unitName} {progress.unit.number}: one row per student, one column
                    per lesson
                  </caption>
                  <thead>
                    <tr className="border-b border-border">
                      <th scope="col" className="sticky left-0 z-10 bg-card p-3 font-semibold">
                        Student
                      </th>
                      {progress.unit.lessons.map((l) => (
                        <th key={l.id} scope="col" className="p-3 text-center font-semibold">
                          <span className="block">L{l.order}</span>
                          <span className="block text-xs font-normal text-muted">
                            <span className="sr-only">{l.title}: </span>
                            {l.completed}/{progress.students.length} done
                          </span>
                        </th>
                      ))}
                      <th scope="col" className="p-3 font-semibold">
                        Track lessons
                      </th>
                      <th scope="col" className="p-3 font-semibold">
                        Last active
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <StudentRow
                        key={s.id}
                        student={s}
                        classId={classId}
                        track={track}
                        trackLessons={progress.trackLessons}
                        lessons={progress.unit!.lessons}
                      />
                    ))}
                  </tbody>
                </table>
              </section>
            )}
          </section>
        )}
      </div>
    </PageShell>
  );
}

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <Card className="flex flex-col gap-1">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-muted">{label}</p>
    </Card>
  );
}

function Legend({ math }: { math: boolean }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted" aria-label="Key">
      <li className="flex items-center gap-2">
        <Square state="done" /> Done
      </li>
      <li className="flex items-center gap-2">
        <Square state="in_progress" /> Started (steps done)
      </li>
      <li className="flex items-center gap-2">
        <Square state="not_started" /> Not started
      </li>
      {!math && <li>✍ writing handed in (feedback score)</li>}
      <li>Q {math ? 'problem set' : 'quiz'} best score</li>
      <li>😟 low confidence</li>
    </ul>
  );
}

function Square({ state, label }: { state: LessonCell['state']; label?: string }) {
  const style =
    state === 'done'
      ? 'bg-ok text-white'
      : state === 'in_progress'
        ? 'border-2 border-brand bg-brand/15 text-foreground'
        : 'border-2 border-border';
  return (
    <span
      aria-hidden="true"
      className={`inline-flex size-8 items-center justify-center rounded-md text-xs font-bold ${style}`}
    >
      {label}
    </span>
  );
}

function describe(cell: LessonCell, title: string, marked = 'quiz') {
  const parts = [
    cell.state === 'done'
      ? 'done'
      : cell.state === 'in_progress'
        ? `started, ${cell.completedSteps} of 5 steps`
        : 'not started',
  ];
  if (cell.quizPercent !== null)
    parts.push(
      `${marked} ${cell.quizPercent}%${cell.quizPassed ? ', passed' : ', not passed yet'}`,
    );
  if (cell.submitted)
    parts.push(
      cell.scorePercent === null
        ? 'writing handed in'
        : `writing handed in, feedback ${cell.scorePercent}%`,
    );
  if (cell.confidence !== null && cell.confidence <= 2) parts.push('low confidence');
  return `${title}: ${parts.join('; ')}`;
}

function StudentRow({
  student: s,
  classId,
  track,
  trackLessons,
  lessons,
}: {
  student: StudentProgressRow;
  classId: string;
  track: Track;
  trackLessons: number;
  lessons: { id: string; order: number; title: string }[];
}) {
  return (
    <tr className="border-t border-border align-top">
      <th scope="row" className="sticky left-0 z-10 bg-card p-3 font-normal">
        <Link
          href={`/classes/${classId}/students/${s.id}?track=${track.toLowerCase()}`}
          className="font-semibold text-brand underline"
        >
          {s.displayName}
        </Link>
        <span className="mt-1 flex flex-wrap gap-1">
          {s.inactive && (
            <span className="rounded-full bg-warn/15 px-2 py-0.5 text-xs font-semibold text-foreground">
              ⚑ Inactive
            </span>
          )}
          {s.needsHelp && (
            <span className="rounded-full bg-bad/10 px-2 py-0.5 text-xs font-semibold text-foreground">
              Needs help
            </span>
          )}
        </span>
      </th>
      {s.cells.map((c, i) => (
        <td key={c.lessonId} className="p-2 text-center">
          <span className="sr-only">
            {describe(
              c,
              `Lesson ${lessons[i]?.order ?? i + 1}`,
              isMathTrack(track) ? 'problem set' : 'quiz',
            )}
          </span>
          <span aria-hidden="true" className="flex flex-col items-center gap-0.5">
            <Square
              state={c.state}
              label={
                c.state === 'done' ? '✓' : c.state === 'in_progress' ? `${c.completedSteps}/5` : ''
              }
            />
            {c.quizPercent !== null && (
              <span className={`text-xs ${c.quizPassed ? 'text-ok' : 'text-bad'} font-semibold`}>
                Q {c.quizPercent}%
              </span>
            )}
            {c.submitted && (
              <span className="text-xs">
                ✍ {c.scorePercent === null ? '' : `${c.scorePercent}%`}
              </span>
            )}
            {c.confidence !== null && c.confidence <= 2 && <span className="text-xs">😟</span>}
          </span>
        </td>
      ))}
      <td className="p-3">
        {s.trackCompletedLessons}/{trackLessons}
      </td>
      <td className="p-3 whitespace-nowrap">
        {s.lastActiveAt ? (
          <LastActive at={s.lastActiveAt} />
        ) : (
          <span className="text-muted">Never</span>
        )}
      </td>
    </tr>
  );
}

const midnight = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

function LastActive({ at }: { at: string }) {
  // Calendar days, so an evening two days ago is not "Yesterday".
  const days = Math.round((midnight(new Date()) - midnight(new Date(at))) / (24 * 60 * 60 * 1000));
  return (
    <time dateTime={at}>{days <= 0 ? 'Today' : days === 1 ? 'Yesterday' : `${days} days ago`}</time>
  );
}
