'use client';

import { FLAG_LABELS, type FlagStatus, SafetyFlagView } from '@storyforge/shared';
import { useState } from 'react';
import { Button, ErrorMessage } from '@/components/ui';
import { ApiError, apiJson } from '@/lib/api-client';

const TABS: { status: FlagStatus; label: string }[] = [
  { status: 'OPEN', label: 'Open' },
  { status: 'ACKNOWLEDGED', label: 'Acknowledged' },
  { status: 'RESOLVED', label: 'Resolved' },
];

const SEVERITY: Record<number, { label: string; className: string }> = {
  3: { label: 'Urgent', className: 'border-bad text-bad' },
  2: { label: 'Concerning', className: 'border-warn text-warn' },
  1: { label: 'Low', className: 'border-border text-muted' },
};

/** Teacher inbox for safety flags (DESIGN.md §11.7): acknowledge, then resolve with a note. */
export function FlagInbox({ initial }: { initial: SafetyFlagView[] }) {
  const [flags, setFlags] = useState(initial);
  const [tab, setTab] = useState<FlagStatus>('OPEN');
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const shown = flags.filter((f) => f.status === tab);

  async function update(flag: SafetyFlagView, status: 'ACKNOWLEDGED' | 'RESOLVED', notes?: string) {
    setBusy(flag.id);
    setError(null);
    try {
      const updated = await apiJson(`/teacher/flags/${flag.id}`, SafetyFlagView, 'PATCH', {
        status,
        ...(notes ? { notes } : {}),
      });
      setFlags((all) => all.map((f) => (f.id === updated.id ? updated : f)));
    } catch (e) {
      setError(e instanceof ApiError ? e.userMessage : 'Could not save. Try again.');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <fieldset className="flex flex-wrap gap-2">
        <legend className="sr-only">Filter flags</legend>
        {TABS.map((t) => {
          const count = flags.filter((f) => f.status === t.status).length;
          return (
            <Button
              key={t.status}
              variant={tab === t.status ? 'primary' : 'secondary'}
              aria-pressed={tab === t.status}
              onClick={() => setTab(t.status)}
            >
              {t.label} ({count})
            </Button>
          );
        })}
      </fieldset>
      <ErrorMessage message={error} />

      {shown.length === 0 ? (
        <p className="rounded-2xl border border-border bg-card p-6 text-muted">
          {tab === 'OPEN' ? 'No open flags. 🎉' : 'Nothing here.'}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {shown.map((f) => (
            <FlagCard key={f.id} flag={f} busy={busy === f.id} onUpdate={update} />
          ))}
        </ul>
      )}
    </div>
  );
}

function FlagCard({
  flag,
  busy,
  onUpdate,
}: {
  flag: SafetyFlagView;
  busy: boolean;
  onUpdate: (f: SafetyFlagView, s: 'ACKNOWLEDGED' | 'RESOLVED', notes?: string) => Promise<void>;
}) {
  const [notes, setNotes] = useState(flag.notes ?? '');
  const severity = SEVERITY[flag.severity] ?? SEVERITY[1]!;
  return (
    <li className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full border px-2.5 py-0.5 text-sm font-semibold ${severity.className}`}
        >
          {severity.label}
        </span>
        <span className="font-semibold">{FLAG_LABELS[flag.type]}</span>
        <span className="text-muted">
          · {flag.student.displayName} · {new Date(flag.createdAt).toLocaleString()}
        </span>
      </div>
      <blockquote className="rounded-xl border-l-4 border-border bg-background p-3 italic">
        {flag.excerpt}
      </blockquote>
      <p className="text-sm text-muted">
        Found by {flag.detectedBy === 'ai-safety' ? 'Quill’s safety check' : 'the word list'}
        {flag.submissionId ? ' in a submission' : ' during a live check'}.
      </p>
      {flag.status !== 'RESOLVED' ? (
        <div className="flex flex-col gap-2">
          <label htmlFor={`notes-${flag.id}`} className="text-sm font-medium">
            Notes (only teachers see these)
          </label>
          <textarea
            id={`notes-${flag.id}`}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            maxLength={1000}
            className="rounded-xl border border-border bg-card px-3 py-2 focus-visible:outline-3 focus-visible:outline-brand"
          />
          <div className="flex flex-wrap gap-2">
            {flag.status === 'OPEN' && (
              <Button
                variant="secondary"
                disabled={busy}
                onClick={() => void onUpdate(flag, 'ACKNOWLEDGED', notes.trim() || undefined)}
              >
                Acknowledge
              </Button>
            )}
            <Button
              disabled={busy}
              onClick={() => void onUpdate(flag, 'RESOLVED', notes.trim() || undefined)}
            >
              Resolve
            </Button>
          </div>
        </div>
      ) : (
        flag.notes && <p className="text-sm">Notes: {flag.notes}</p>
      )}
    </li>
  );
}
