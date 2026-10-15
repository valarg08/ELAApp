'use client';

import { useState } from 'react';
import { type Proofread, proofreadStatus } from '@storyforge/shared';

/**
 * Error clinic checklist (DESIGN.md §9.12): counts the planted mistakes the student has fixed in
 * the editor and explains each one once it's fixed. A hint points at an unfixed mistake without
 * giving the answer. Updates as they type.
 */
export function ProofreadPanel({ proofread, text }: { proofread: Proofread; text: string }) {
  const status = proofreadStatus(text, proofread.errors);
  const fixed = status.map((f) => f !== null);
  const done = fixed.filter(Boolean).length;
  const total = proofread.errors.length;
  const [hintFor, setHintFor] = useState<number | null>(null);
  const open = proofread.errors.map((_, i) => i).filter((i) => !fixed[i]);
  // Keep showing the same hint until that mistake is fixed.
  const hintIndex = hintFor !== null && !fixed[hintFor] ? hintFor : null;

  const nextHint = () => {
    if (open.length === 0) return;
    const after = open.find((i) => hintIndex === null || i > hintIndex);
    setHintFor(after ?? open[0]!);
  };
  const hint = hintIndex !== null ? proofread.errors[hintIndex]! : null;

  return (
    <section
      aria-labelledby="proofread-heading"
      className="rounded-xl border border-border bg-background p-4"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="proofread-heading" className="font-semibold">
          {proofread.label}
        </h2>
        <p className="text-sm text-muted" aria-live="polite">
          {done} of {total} fixed
        </p>
      </div>
      <p className="mt-1 text-sm text-muted">
        Find each mistake in the paragraph and fix it right in the box. Each one you fix appears
        below with why it was wrong.
      </p>
      {open.length > 0 && (
        <div className="mt-3">
          <button
            type="button"
            onClick={nextHint}
            className="text-sm font-semibold text-brand underline focus-visible:outline-3 focus-visible:outline-brand"
          >
            {hint ? 'Another hint' : 'Give me a hint'}
          </button>
          {hint && (
            <p className="mt-1 text-sm" aria-live="polite">
              {hint.hint ?? `Look for “${hint.wrong}”.`}
            </p>
          )}
        </div>
      )}
      {done === total && (
        <p className="mt-3 font-semibold text-ok">All {total} fixed. Read it through once more!</p>
      )}
      {done > 0 && (
        <ul className="mt-3 flex flex-col gap-2">
          {proofread.errors.map((e, i) =>
            fixed[i] ? (
              <li key={e.wrong} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-ok text-sm font-bold text-white"
                >
                  ✓
                </span>
                <span className="text-sm">
                  <span className="sr-only">Fixed: </span>
                  <s className="text-muted">{e.wrong}</s> → {status[i]}
                  <span className="block text-muted">{e.explanation}</span>
                </span>
              </li>
            ) : null,
          )}
        </ul>
      )}
    </section>
  );
}
