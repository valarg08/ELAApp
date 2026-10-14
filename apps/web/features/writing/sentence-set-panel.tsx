'use client';

import type { SentenceSet } from '@storyforge/shared';
import { GRAMMAR_FEATURE_LABELS, checkSentenceSet } from '@storyforge/writing-analysis';

const short = (s: string) => {
  const t = s.trim().replace(/\s+/g, ' ');
  return t.length > 70 ? `${t.slice(0, 67)}…` : t;
};

/**
 * Sentence set checklist (DESIGN.md §9.12): one row per task, matched to the student's sentences
 * in order, with what each sentence still needs. Updates as they type; a guide, not a rule.
 */
export function SentenceSetPanel({ set, text }: { set: SentenceSet; text: string }) {
  const checks = checkSentenceSet(text, set.sentences);
  const done = checks.filter((c) => c.done).length;
  return (
    <section
      aria-labelledby="sentence-set-heading"
      className="rounded-xl border border-border bg-background p-4"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="sentence-set-heading" className="font-semibold">
          {set.label}
        </h2>
        <p className="text-sm text-muted">
          {done} of {set.sentences.length} done
        </p>
      </div>
      <p className="mt-1 text-sm text-muted">
        Write one sentence for each task, in order. End each one with a full stop.
      </p>
      <ol className="mt-3 flex flex-col gap-2">
        {set.sentences.map((task, i) => {
          const c = checks[i]!;
          return (
            <li key={task.ask} className="flex gap-3">
              <span
                aria-hidden="true"
                className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  c.done ? 'bg-ok text-white' : 'border-2 border-border text-muted'
                }`}
              >
                {c.done ? '✓' : i + 1}
              </span>
              <div className="flex flex-col">
                <span>
                  <span className="sr-only">
                    Sentence {i + 1}, {c.done ? 'done' : 'not done yet'}:{' '}
                  </span>
                  {task.ask}
                </span>
                {c.sentence ? (
                  <span className="text-sm text-muted">
                    “{short(c.sentence.text)}”
                    {c.missing.length > 0 && (
                      <>
                        {' '}
                        · still needs{' '}
                        {c.missing.map((f) => GRAMMAR_FEATURE_LABELS[f]).join(' and ')}
                      </>
                    )}
                  </span>
                ) : (
                  <span className="text-sm text-muted">Not written yet</span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
