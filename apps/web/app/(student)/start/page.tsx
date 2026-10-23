import { TRACK_HOME, TRACK_NAMES, Track, UnitSummary, unitLabel } from '@storyforge/shared';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ProgressBar } from '@/components/progress-bar';
import { getMe, serverApi } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

const TRACKS: { track: Track; emoji: string }[] = [
  { track: 'STORY', emoji: '✍️' },
  { track: 'ESSAY', emoji: '📝' },
  { track: 'MATH', emoji: '📐' },
];

const pct = (done: number, total: number) => (total === 0 ? 0 : Math.round((done / total) * 100));

/** The first open unit with lessons left; when all are done, the last open one. */
function currentUnit(units: UnitSummary[]) {
  const open = units.filter((u) => u.available);
  return open.find((u) => u.completedLessons < u.lessonCount) ?? open.at(-1);
}

/**
 * A student's start page (after signing in and the logo, DESIGN.md §6.2): the three tracks with
 * progress in each and a link to the unit they're working on. `?track=` (the track tabs) goes
 * straight to that track's current unit.
 */
export default async function Start({ searchParams }: PageProps<'/start'>) {
  const asked = Track.safeParse((await searchParams).track);
  if (asked.success) {
    const units = (await serverApi(`/units?track=${asked.data}`, UnitSummary.array())) ?? [];
    const current = currentUnit(units);
    redirect(current ? `/units/${current.slug}` : TRACK_HOME[asked.data]);
  }

  const [me, ...lists] = await Promise.all([
    getMe(),
    ...TRACKS.map((t) => serverApi(`/units?track=${t.track}`, UnitSummary.array())),
  ]);
  if (!me) redirect('/join');

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-6 md:py-10">
      <h1 className="text-4xl font-bold">Welcome, {me.displayName}! 👋</h1>
      <ul aria-label="Learning tracks" className="grid gap-4 md:grid-cols-3">
        {TRACKS.map(({ track, emoji }, i) => {
          const units = lists[i] ?? [];
          const done = units.reduce((n, u) => n + u.completedLessons, 0);
          const total = units.reduce((n, u) => n + u.lessonCount, 0);
          const unitsDone = units.filter(
            (u) => u.lessonCount > 0 && u.completedLessons >= u.lessonCount,
          ).length;
          const current = currentUnit(units);
          const name = TRACK_NAMES[track];
          return (
            <li
              key={track}
              className="flex flex-col gap-4 rounded-2xl border-2 border-accent bg-card p-5 shadow-sm"
            >
              <h2 className="text-2xl font-bold">
                <span aria-hidden="true">{emoji} </span>
                {name}
              </h2>
              <div>
                <ProgressBar value={done} max={total} label={`${name} progress`} />
                <p className="mt-1 text-sm text-muted">
                  {done} of {total} lessons · {pct(done, total)}% · {unitsDone} of {units.length}{' '}
                  units done
                </p>
              </div>
              {current && (
                <Link
                  href={`/units/${current.slug}`}
                  className="rounded-xl bg-brand px-4 py-3 text-white hover:bg-brand/90 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <span className="block text-sm text-white/80">
                    Continue: {unitLabel(track, current.number)}
                  </span>
                  <span className="font-semibold">{current.title}</span>
                </Link>
              )}
              <Link
                href={TRACK_HOME[track]}
                className="mt-auto text-sm text-brand underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                All {name} units
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
