'use client';

import { DiffResponse, SNAPSHOT_LABELS, VersionDetail, VersionSummary } from '@storyforge/shared';
import { useEffect, useState } from 'react';
import { Button, ErrorMessage } from '@/components/ui';
import { apiJson } from '@/lib/api-client';

export function formatWhen(iso: string): string {
  const d = new Date(iso);
  const time = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  return d.toDateString() === new Date().toDateString()
    ? `Today ${time}`
    : `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${time}`;
}

/**
 * Version history (DESIGN.md §5.4): snapshots newest first; open one to read it or compare it with
 * the current draft, and restore it.
 */
export function HistoryPanel({
  submissionId,
  refreshKey,
  restoring,
  onRestore,
}: {
  submissionId: string;
  /** Changes whenever a new version may exist. */
  refreshKey: number;
  restoring: boolean;
  onRestore: (version: VersionSummary) => void;
}) {
  const base = `/submissions/${encodeURIComponent(submissionId)}`;
  const [versions, setVersions] = useState<VersionSummary[] | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    apiJson(`${base}/versions`, VersionSummary.array())
      .then((list) => {
        if (live) setVersions(list);
      })
      .catch(() => {
        if (live) setError('Could not load your history. Check your connection.');
      });
    return () => {
      live = false;
    };
    // refreshKey is the reload trigger: it changes when a new version may exist.
    // oxlint-disable-next-line react/exhaustive-effect-dependencies
  }, [base, refreshKey]);

  const current = versions?.find((v) => v.id === selected) ?? null;

  return (
    <section
      id="history-panel"
      aria-labelledby="history-title"
      className="flex flex-col gap-4 rounded-xl border border-border bg-background p-4"
    >
      <h2 id="history-title" className="text-xl font-bold">
        ⟲ Version history
      </h2>
      <ErrorMessage message={error} />
      {versions?.length === 0 && (
        <p className="text-muted">
          No versions yet. They are saved as you write, or with “Save version”.
        </p>
      )}
      {versions && versions.length > 0 && (
        <div className="grid gap-4 md:grid-cols-[minmax(12rem,1fr)_2fr]">
          <ul className="flex max-h-96 flex-col gap-1 overflow-y-auto" aria-label="Saved versions">
            {versions.map((v) => (
              <li key={v.id}>
                <button
                  type="button"
                  onClick={() => setSelected(v.id)}
                  aria-current={v.id === selected ? 'true' : undefined}
                  className={`w-full rounded-lg px-3 py-2 text-left focus-visible:outline-3 focus-visible:outline-brand ${
                    v.id === selected ? 'bg-brand text-white' : 'hover:bg-card'
                  }`}
                >
                  <span className="block font-semibold">{formatWhen(v.createdAt)}</span>
                  <span className={`text-sm ${v.id === selected ? '' : 'text-muted'}`}>
                    {SNAPSHOT_LABELS[v.reason]} · {v.wordCount} words
                  </span>
                </button>
              </li>
            ))}
          </ul>
          {current ? (
            <VersionView
              key={current.id}
              base={base}
              version={current}
              restoring={restoring}
              onRestore={() => onRestore(current)}
            />
          ) : (
            <p className="text-muted">Pick a version to read it or compare it with now.</p>
          )}
        </div>
      )}
    </section>
  );
}

function VersionView({
  base,
  version,
  restoring,
  onRestore,
}: {
  base: string;
  version: VersionSummary;
  restoring: boolean;
  onRestore: () => void;
}) {
  const [mode, setMode] = useState<'text' | 'changes'>('text');
  const [detail, setDetail] = useState<VersionDetail | null>(null);
  const [diff, setDiff] = useState<DiffResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    const load =
      mode === 'text'
        ? apiJson(`${base}/versions/${version.id}`, VersionDetail).then((d) => live && setDetail(d))
        : apiJson(`${base}/diff?from=${version.id}`, DiffResponse).then((d) => live && setDiff(d));
    load.catch(() => live && setError('Could not load this version.'));
    return () => {
      live = false;
    };
  }, [base, version.id, mode]);

  return (
    <div className="flex flex-col gap-3">
      <fieldset className="flex flex-wrap items-center gap-2">
        <legend className="sr-only">Show</legend>
        <Button
          variant={mode === 'text' ? 'primary' : 'secondary'}
          aria-pressed={mode === 'text'}
          onClick={() => setMode('text')}
        >
          Read it
        </Button>
        <Button
          variant={mode === 'changes' ? 'primary' : 'secondary'}
          aria-pressed={mode === 'changes'}
          onClick={() => setMode('changes')}
        >
          Compare with now
        </Button>
      </fieldset>
      <ErrorMessage message={error} />

      {mode === 'text' && detail && (
        <p
          data-testid="version-text"
          className="max-h-80 overflow-y-auto rounded-xl border border-border bg-card p-4 text-lg leading-relaxed whitespace-pre-wrap"
        >
          {detail.text || <span className="text-muted italic">(empty)</span>}
        </p>
      )}
      {mode === 'changes' && diff && <DiffView diff={diff} />}

      <Button className="self-start" variant="secondary" disabled={restoring} onClick={onRestore}>
        {restoring ? 'Restoring…' : 'Restore this version'}
      </Button>
    </div>
  );
}

/** Words added since the version are underlined, removed words struck through (not colour alone). */
export function DiffView({ diff }: { diff: DiffResponse }) {
  const changed = diff.added + diff.removed > 0;
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted">
        {changed
          ? `Since then: ${diff.added} words added, ${diff.removed} removed.`
          : 'No changes since this version.'}
      </p>
      <p
        data-testid="diff"
        className="max-h-80 overflow-y-auto rounded-xl border border-border bg-card p-4 text-lg leading-relaxed whitespace-pre-wrap"
      >
        {diff.segments.map((s, i) =>
          s.type === 'same' ? (
            // Segments never reorder, so the index is a stable key.
            // oxlint-disable-next-line react/no-array-index-key
            <span key={i}>{s.text}</span>
          ) : s.type === 'added' ? (
            // oxlint-disable-next-line react/no-array-index-key
            <ins
              key={i}
              className="mx-px rounded bg-ok/15 px-0.5 text-foreground underline decoration-ok decoration-2"
            >
              <span className="sr-only">[added: </span>
              {s.text}
              <span className="sr-only">]</span>
            </ins>
          ) : (
            // oxlint-disable-next-line react/no-array-index-key
            <del
              key={i}
              className="mx-px rounded bg-bad/10 px-0.5 text-foreground line-through decoration-bad decoration-2"
            >
              <span className="sr-only">[removed: </span>
              {s.text}
              <span className="sr-only">]</span>
            </del>
          ),
        )}
      </p>
    </div>
  );
}
