import { SAT_DOMAINS, type SatSkillStanding, type SatWeekSummary } from '@storyforge/shared';
import Link from 'next/link';
import { navFocus } from './course-styles';
import { ProgressBar } from './progress-bar';

const day = (date: string | null) =>
  date
    ? new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC',
      })
    : 'soon';

const link = (current: boolean) =>
  `flex min-h-11 items-center gap-2 rounded-xl px-2 py-1 text-sm hover:bg-brand/10 ${navFocus} ${
    current ? 'bg-brand/10 font-semibold' : ''
  }`;

/**
 * SAT Math's Chapters menu (sat-design.md): the weekly tests with where each stands, then practice,
 * the mistakes list and the rules. `current` is the page that is open.
 */
export function SatChapterNav({
  weeks,
  current,
}: {
  weeks: SatWeekSummary[];
  current: string | undefined;
}) {
  return (
    <nav aria-label="SAT Math">
      <ul className="flex flex-col gap-1">
        <li>
          <Link
            href="/sat"
            aria-current={current === '/sat' ? 'page' : undefined}
            className={link(current === '/sat')}
          >
            <span aria-hidden="true" className="w-4 shrink-0">
              🏆
            </span>
            SAT Math home
          </Link>
        </li>
        <li>
          <Link href="/sat#sat-rules" className={link(false)}>
            <span aria-hidden="true" className="w-4 shrink-0">
              📋
            </span>
            Rules of the SAT
          </Link>
        </li>
      </ul>

      <h3 id="sat-weeks-nav" className="mt-4 px-2 text-xs font-semibold text-muted uppercase">
        Weekly tests
      </h3>
      {weeks.length === 0 ? (
        <p className="mt-1 px-2 text-sm text-muted">The first test is on its way.</p>
      ) : (
        <ol aria-labelledby="sat-weeks-nav" className="mt-1 flex flex-col gap-1">
          {weeks.map((w) => {
            const href = `/sat/week/${w.week}`;
            const open = current === href;
            return (
              <li key={w.week}>
                <Link href={href} aria-current={open ? 'page' : undefined} className={link(open)}>
                  <span aria-hidden="true" className="w-4 shrink-0">
                    {w.status === 'done'
                      ? '✓'
                      : w.locked
                        ? '🔒'
                        : w.status === 'in-progress'
                          ? '▶'
                          : ''}
                  </span>
                  <span className="flex-1">
                    Week {w.week}
                    {w.current && w.status !== 'done' && !w.locked && (
                      <span className="text-brand"> · this week</span>
                    )}
                    <span className="block text-xs font-normal text-muted">
                      {w.status === 'done'
                        ? `Score about ${w.score ?? '—'}`
                        : w.locked
                          ? `Opens ${day(w.opens)}`
                          : w.status === 'in-progress'
                            ? 'In progress'
                            : 'Not started'}
                    </span>
                  </span>
                  <span className="sr-only">
                    {w.status === 'done'
                      ? ' (finished)'
                      : w.locked
                        ? ' (not open yet)'
                        : w.status === 'in-progress'
                          ? ' (in progress)'
                          : ''}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      )}

      <h3 className="mt-4 px-2 text-xs font-semibold text-muted uppercase">Practice</h3>
      <ul className="mt-1 flex flex-col gap-1">
        <li>
          <Link
            href="/sat/practice"
            aria-current={current === '/sat/practice' ? 'page' : undefined}
            className={link(current === '/sat/practice')}
          >
            <span aria-hidden="true" className="w-4 shrink-0">
              🎯
            </span>
            Adaptive practice
          </Link>
        </li>
        <li>
          <Link
            href="/sat/mistakes"
            aria-current={current === '/sat/mistakes' ? 'page' : undefined}
            className={link(current === '/sat/mistakes')}
          >
            <span aria-hidden="true" className="w-4 shrink-0">
              ✏️
            </span>
            My mistakes
          </Link>
        </li>
      </ul>
    </nav>
  );
}

const domainLabel = (id: string) => SAT_DOMAINS.find((d) => d.id === id)?.label ?? id;

/**
 * SAT Math's Progress panel: weekly tests finished, the latest and average estimated scores, and
 * the weakest skills from the latest answers.
 */
export function SatProgress({
  weeks,
  skills,
}: {
  weeks: SatWeekSummary[];
  skills: SatSkillStanding[];
}) {
  const available = weeks.filter((w) => !w.locked || w.status !== 'new');
  const done = weeks.filter((w) => w.status === 'done');
  const scores = done.flatMap((w) => (w.score === null ? [] : [w.score]));
  const latest = scores.at(-1) ?? null;
  const average =
    scores.length === 0 ? null : Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const weak = skills.filter((k) => k.accuracy !== null && k.accuracy < 70).slice(0, 3);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-sm font-semibold">SAT Math</p>
        <ProgressBar
          onCyan
          value={done.length}
          max={Math.max(available.length, 1)}
          label="Weekly tests finished"
        />
        <p className="mt-1 text-sm">
          {done.length} of {available.length} weekly {available.length === 1 ? 'test' : 'tests'}{' '}
          finished
        </p>
      </div>
      <div>
        <p className="text-sm font-semibold">Estimated score</p>
        {latest === null ? (
          <p className="mt-1 text-sm">Finish a test to see yours.</p>
        ) : (
          <>
            <p className="text-3xl font-bold">{latest}</p>
            <p className="text-sm">
              latest{average !== null && done.length > 1 ? ` · average ${average}` : ''}
            </p>
          </>
        )}
      </div>
      <div>
        <p className="text-sm font-semibold">Skills to work on</p>
        {weak.length === 0 ? (
          <p className="mt-1 text-sm">
            {skills.some((k) => k.accuracy !== null)
              ? 'No weak spot right now. Keep going.'
              : 'Take a test or some practice to find them.'}
          </p>
        ) : (
          <ul className="mt-1 flex flex-col gap-1 text-sm">
            {weak.map((k) => (
              <li key={k.id}>
                {k.label}{' '}
                <span className="text-xs">
                  ({domainLabel(k.domain)}, {k.accuracy}% right)
                </span>
              </li>
            ))}
          </ul>
        )}
        <Link href="/sat/practice" className={`mt-2 inline-block text-sm underline ${navFocus}`}>
          Practise these
        </Link>
      </div>
    </div>
  );
}
