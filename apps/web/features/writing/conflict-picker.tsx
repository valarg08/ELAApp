'use client';

import {
  CONFLICT_TYPES,
  type ConflictPicker as ConflictPickerConfig,
  SubmissionDetail,
} from '@storyforge/shared';
import { useState } from 'react';
import { ErrorMessage } from '@/components/ui';
import { ApiError, apiJson } from '@/lib/api-client';

/**
 * Unit 4: the conflict selector (DESIGN.md §10). One card per conflict type; the chosen card shows
 * its definition, a mentor example and three starters (one can open an empty draft).
 */
export function ConflictPicker({
  submissionId,
  picker,
  conflict,
  onChange,
  onStarter,
}: {
  submissionId: string;
  picker: ConflictPickerConfig;
  conflict: string | null;
  onChange: (conflict: string | null) => void;
  /** Set when the draft is empty: start the story with a starter line. */
  onStarter?: (line: string) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const cards = CONFLICT_TYPES.filter((c) => picker.options.includes(c.id));
  const chosen = cards.find((c) => c.id === conflict);

  async function choose(id: string) {
    const previous = conflict;
    onChange(id);
    setError(null);
    setSaving(true);
    try {
      const saved = await apiJson(
        `/submissions/${encodeURIComponent(submissionId)}/conflict`,
        SubmissionDetail,
        'PUT',
        { conflict: id },
      );
      onChange(saved.conflict);
    } catch (e) {
      onChange(previous);
      setError(e instanceof ApiError ? e.userMessage : 'Could not save your choice. Try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <fieldset className="flex flex-col gap-3 rounded-xl border border-brand/40 bg-background p-4">
      <legend className="px-1 font-semibold">
        <span aria-hidden="true">⚔️ </span>
        {picker.label}
      </legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {cards.map((card) => {
          const id = `conflict-${card.id}`;
          return (
            <div key={card.id}>
              <input
                id={id}
                type="radio"
                name="conflict"
                className="peer sr-only"
                checked={conflict === card.id}
                disabled={saving}
                onChange={() => void choose(card.id)}
              />
              <label
                htmlFor={id}
                className="flex h-full cursor-pointer items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 peer-checked:border-brand peer-checked:bg-brand peer-checked:text-white peer-focus-visible:outline-3 peer-focus-visible:outline-brand peer-disabled:cursor-wait"
              >
                <span aria-hidden="true" className="text-xl">
                  {card.icon}
                </span>
                <span className="font-semibold">{card.label}</span>
              </label>
            </div>
          );
        })}
      </div>
      <div aria-live="polite">
        {chosen ? (
          <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3">
            <p>
              <strong>{chosen.label}:</strong> {chosen.definition}
            </p>
            <p className="text-sm text-muted">
              <strong>Example:</strong> {chosen.example}
            </p>
            <p className="text-sm font-semibold">Story starters</p>
            <ul className="flex flex-col gap-2">
              {chosen.starters.map((line) => (
                <li
                  key={line}
                  className="flex flex-wrap items-center justify-between gap-2 text-sm italic"
                >
                  <span>“{line}”</span>
                  {onStarter && (
                    <button
                      type="button"
                      onClick={() => onStarter(line)}
                      className="text-sm font-semibold text-brand not-italic underline focus-visible:outline-3 focus-visible:outline-brand"
                    >
                      Start with this
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-muted">
            Choose a card to see what it means and some starters.
          </p>
        )}
      </div>
      <ErrorMessage message={error} />
    </fieldset>
  );
}
