'use client';

import { type AnswerForm, FORM_LABELS, approx, format, readAnswer } from '@storyforge/math-check';
import { useId, useRef } from 'react';

/** A plain number like "100.5" or "-3": echoed as a decimal, not as 201/2. */
const PLAIN_NUMBER = /^\s*-?(\d+\.?\d*|\.\d+)\s*$/;

/** Helper buttons insert these at the cursor (DESIGN.md §9.13). */
const HELPERS: { insert: string; label: string; name: string }[] = [
  { insert: '√(', label: '√', name: 'square root' },
  { insert: 'π', label: 'π', name: 'pi' },
  { insert: '/', label: 'a/b', name: 'fraction bar' },
  { insert: '^', label: 'xⁿ', name: 'power' },
  { insert: '(', label: '(', name: 'open bracket' },
  { insert: ')', label: ')', name: 'close bracket' },
];

/**
 * A typed answer: a plain box, helper buttons for √ π / ^ and brackets, and a live "We read…"
 * preview from math-check so the student sees how their answer is understood before checking.
 */
export function AnswerBox({
  value,
  onChange,
  onSubmit,
  form = 'any',
  disabled,
  label = 'Your answer',
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  form?: AnswerForm;
  disabled?: boolean;
  label?: string;
}) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const read = value.trim() ? readAnswer(value) : null;

  function insert(text: string) {
    const el = input.current;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    onChange(value.slice(0, start) + text + value.slice(end));
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(start + text.length, start + text.length);
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-semibold">
        {label}
        {form !== 'any' && (
          <span className="font-normal text-muted"> (write it {FORM_LABELS[form]})</span>
        )}
      </label>
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={input}
          id={id}
          type="text"
          inputMode="text"
          autoComplete="off"
          spellCheck={false}
          maxLength={100}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && onSubmit) {
              e.preventDefault();
              onSubmit();
            }
          }}
          aria-describedby={`${id}-read`}
          className="min-h-11 w-56 rounded-xl border-2 border-border bg-background px-3 py-2 font-mono text-lg focus-visible:border-brand focus-visible:outline-3 focus-visible:outline-brand"
        />
        <fieldset className="flex flex-wrap gap-1">
          <legend className="sr-only">Insert a symbol</legend>
          {HELPERS.map((h) => (
            <button
              key={h.name}
              type="button"
              disabled={disabled}
              aria-label={`Insert ${h.name}`}
              onClick={() => insert(h.insert)}
              className="min-h-11 min-w-11 rounded-lg border border-border bg-card px-2 font-mono hover:border-brand focus-visible:outline-3 focus-visible:outline-brand disabled:opacity-50"
            >
              {h.label}
            </button>
          ))}
        </fieldset>
      </div>
      <p id={`${id}-read`} className="min-h-6 text-sm text-muted" aria-live="polite">
        {read
          ? read.ok
            ? `We read: ${PLAIN_NUMBER.test(value) ? String(approx(read.value)) : format(read.value)}`
            : `${read.message}.`
          : 'Type a number, a fraction like 3/4, or something like 2√3 or 4π.'}
      </p>
    </div>
  );
}
