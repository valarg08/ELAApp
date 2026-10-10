import type { SaveStatus } from './autosave';

const LABELS: Record<SaveStatus, string> = {
  saved: '✓ Saved',
  unsaved: 'Not saved yet',
  saving: 'Saving…',
  offline: 'Offline: your work is kept on this device and will sync',
  conflict: '⚠ Changed in another tab',
  error: '⚠ Couldn’t save',
};

const COLORS: Record<SaveStatus, string> = {
  saved: 'text-ok',
  unsaved: 'text-muted',
  saving: 'text-muted',
  offline: 'text-warn',
  conflict: 'text-warn',
  error: 'text-bad',
};

/** Shows the autosave state. Only problems are announced, so screen readers aren't flooded. */
export function SaveStatusText({ status, error }: { status: SaveStatus; error: string | null }) {
  const problem = status === 'offline' || status === 'conflict' || status === 'error';
  return (
    <>
      <p
        data-testid="save-status"
        data-status={status}
        className={`text-sm font-semibold ${COLORS[status]}`}
      >
        {LABELS[status]}
        {status === 'error' && error ? `: ${error}` : ''}
      </p>
      <p className="sr-only" aria-live="polite">
        {problem ? LABELS[status] : ''}
      </p>
    </>
  );
}
