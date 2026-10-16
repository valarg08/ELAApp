import { TRACK_HOME, type Track } from '@storyforge/shared';
import Link from 'next/link';

const TABS: { track: Track; label: string; emoji: string }[] = [
  { track: 'STORY', label: 'Story Writing', emoji: '✍️' },
  { track: 'ESSAY', label: 'Essay Writing', emoji: '📝' },
];

/**
 * The two learning tracks (DESIGN.md §9.12), as tabs at the top of the journey pages. Teacher
 * pages pass `hrefFor` to switch the track of their own view.
 */
export function TrackTabs({
  current,
  hrefFor = (track) => TRACK_HOME[track],
}: {
  current: Track;
  hrefFor?: (track: Track) => string;
}) {
  return (
    <nav aria-label="Learning tracks">
      <ul className="flex gap-2 border-b border-border">
        {TABS.map((t) => {
          const active = t.track === current;
          return (
            <li key={t.track}>
              <Link
                href={hrefFor(t.track)}
                aria-current={active ? 'page' : undefined}
                className={`-mb-px inline-flex min-h-11 items-center gap-2 rounded-t-xl border border-b-0 px-4 py-2 font-semibold focus-visible:outline-3 focus-visible:outline-brand ${
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
