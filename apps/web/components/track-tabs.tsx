import type { Track } from '@storyforge/shared';
import Link from 'next/link';

const TABS: { track: Track; label: string; emoji: string }[] = [
  { track: 'STORY', label: 'Story Writing', emoji: '✍️' },
  { track: 'ESSAY', label: 'Essay Writing', emoji: '📝' },
  { track: 'MATH', label: 'Math (AMC 10)', emoji: '📐' },
];

/**
 * The learning tracks (DESIGN.md §9.12, §9.13), as tabs at the top of the journey pages. Teacher
 * pages pass `hrefFor` to switch the track of their own view.
 */
export function TrackTabs({
  current,
  // Students go to the unit they're working on in that track (/start).
  hrefFor = (track) => `/start?track=${track}`,
}: {
  current: Track;
  hrefFor?: (track: Track) => string;
}) {
  return (
    <nav aria-label="Learning tracks">
      <ul className="flex flex-wrap gap-x-1 gap-y-1 border-b border-border sm:gap-x-2">
        {TABS.map((t) => {
          const active = t.track === current;
          return (
            <li key={t.track}>
              <Link
                href={hrefFor(t.track)}
                aria-current={active ? 'page' : undefined}
                className={`-mb-px inline-flex min-h-11 items-center gap-2 rounded-t-xl border border-b-0 px-3 py-2 font-semibold sm:px-4 focus-visible:outline-3 focus-visible:outline-brand ${
                  active
                    ? 'border-border bg-card text-brand'
                    : 'border-transparent text-muted hover:text-foreground'
                }`}
              >
                <span aria-hidden="true">{t.emoji}</span>
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
