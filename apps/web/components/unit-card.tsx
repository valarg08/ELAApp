import { type UnitSummary, unitLabel } from '@storyforge/shared';
import Link from 'next/link';
import { ProgressBar } from '@/components/progress-bar';

const dueLabel = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

/**
 * One unit on a journey page: open (a link with progress), locked, or coming soon.
 * `previousNumber` names the unit to finish when the one before is not built yet.
 */
export function UnitCard({ unit, previousNumber }: { unit: UnitSummary; previousNumber?: number }) {
  const label = unitLabel(unit.track, unit.number);
  const body = (
    <>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-muted">{label}</p>
        {unit.available ? (
          unit.lessonCount > 0 && unit.completedLessons === unit.lessonCount ? (
            <span className="text-sm font-semibold text-ok">✓ Done</span>
          ) : null
        ) : (
          <span className="text-sm text-muted">
            {unit.lockReason === 'COMING_SOON'
              ? '⏳ Coming soon'
              : unit.lockReason === 'FINISH_PREVIOUS'
                ? `🔒 Finish ${unitLabel(unit.track, previousNumber ?? unit.number - 1)} first`
                : '🔒 Locked'}
          </span>
        )}
      </div>
      <h3 className="mt-1 text-lg font-semibold">{unit.title}</h3>
      {unit.available && (
        <div className="mt-3 flex flex-col gap-1">
          <ProgressBar
            value={unit.completedLessons}
            max={unit.lessonCount}
            label={`${label} progress`}
          />
          <p className="text-sm text-muted">
            {unit.completedLessons}/{unit.lessonCount} lessons
            {unit.dueAt ? ` · due ${dueLabel(unit.dueAt)}` : ''}
          </p>
        </div>
      )}
    </>
  );

  const base = 'block h-full rounded-2xl border border-border bg-card p-5 shadow-sm';
  return unit.available ? (
    <Link
      href={`/units/${unit.slug}`}
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
