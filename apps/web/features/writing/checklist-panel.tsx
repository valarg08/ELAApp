'use client';

import { type Checklist, type EssayConfig, SubmissionDetail } from '@storyforge/shared';
import { essayChecks } from '@storyforge/writing-analysis';
import { useDeferredValue, useState } from 'react';
import { ErrorMessage } from '@/components/ui';
import { ApiError, apiJson } from '@/lib/api-client';

/**
 * Essay checklist (Essay Unit 14 on, DESIGN.md §9.12): items StoryForge checks from the essay
 * analysis as the student writes, and items the student ticks themselves (saved right away).
 * It never blocks submitting.
 */
export function ChecklistPanel({
  submissionId,
  checklist,
  essay,
  text,
  ticked,
  onChange,
}: {
  submissionId: string;
  checklist: Checklist;
  essay: EssayConfig;
  text: string;
  ticked: string[];
  onChange: (ticked: string[]) => void;
}) {
  const deferred = useDeferredValue(text);
  const auto = essayChecks(deferred, essay);
  const [error, setError] = useState<string | null>(null);
  const done = checklist.items.filter((i) =>
    i.auto ? auto[i.auto] : ticked.includes(i.id),
  ).length;
  const total = checklist.items.length;

  async function toggle(id: string, on: boolean) {
    const next = checklist.items
      .filter((i) => !i.auto && (i.id === id ? on : ticked.includes(i.id)))
      .map((i) => i.id);
    onChange(next);
    try {
      await apiJson(
        `/submissions/${encodeURIComponent(submissionId)}/checklist`,
        SubmissionDetail,
        'PUT',
        { ticked: next },
      );
      setError(null);
    } catch (e) {
      setError(e instanceof ApiError ? e.userMessage : 'Could not save your checklist. Try again.');
    }
  }

  return (
    <section
      aria-labelledby="checklist-heading"
      className="rounded-xl border border-border bg-background p-4"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="checklist-heading" className="font-semibold">
          {checklist.label}
        </h2>
        <p className="text-sm text-muted" aria-live="polite">
          {done} of {total} done
        </p>
      </div>
      <p className="mt-1 text-sm text-muted">
        Edit your essay until every item is done. Items marked “checked for you” tick themselves as
        you write; tick the others when you have checked them yourself.
      </p>
      <ul className="mt-3 flex flex-col gap-2">
        {checklist.items.map((item) =>
          item.auto ? (
            <li key={item.id} className="flex gap-3">
              <span
                aria-hidden="true"
                className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  auto[item.auto] ? 'bg-ok text-white' : 'border-2 border-border text-muted'
                }`}
              >
                {auto[item.auto] ? '✓' : ''}
              </span>
              <span className="text-sm">
                <span className="sr-only">{auto[item.auto] ? 'Done: ' : 'Not yet: '}</span>
                {item.text}
                <span className="block text-xs text-muted">Checked for you</span>
              </span>
            </li>
          ) : (
            <li key={item.id}>
              <label className="flex cursor-pointer gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={ticked.includes(item.id)}
                  onChange={(e) => void toggle(item.id, e.target.checked)}
                  className="mt-0.5 size-5 shrink-0 accent-brand focus-visible:outline-3 focus-visible:outline-brand"
                />
                <span>{item.text}</span>
              </label>
            </li>
          ),
        )}
      </ul>
      {done === total && (
        <p className="mt-3 font-semibold text-ok">
          Everything checked. Read it aloud one last time!
        </p>
      )}
      <ErrorMessage message={error} />
    </section>
  );
}
