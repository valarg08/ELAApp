'use client';

import { SubmissionDetail, type TraitPicker as TraitPickerConfig } from '@storyforge/shared';
import { useState } from 'react';
import { ErrorMessage } from '@/components/ui';
import { ApiError, apiJson } from '@/lib/api-client';

/**
 * Unit 2: the student picks traits (or a flaw) before writing. Picked traits become banned words,
 * and Quill later checks whether a reader can tell. Saved straight away.
 */
export function TraitPicker({
  submissionId,
  picker,
  traits,
  onChange,
}: {
  submissionId: string;
  picker: TraitPickerConfig;
  traits: string[];
  onChange: (traits: string[]) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const full = traits.length >= picker.count;

  async function toggle(trait: string, on: boolean) {
    const previous = traits;
    const next = on ? [...traits, trait] : traits.filter((t) => t !== trait);
    onChange(next);
    setError(null);
    setSaving(true);
    try {
      const saved = await apiJson(
        `/submissions/${encodeURIComponent(submissionId)}/traits`,
        SubmissionDetail,
        'PUT',
        { traits: next },
      );
      onChange(saved.traits);
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
        <span aria-hidden="true">🎭 </span>
        {picker.label}
      </legend>
      <p id="trait-hint" className="text-sm text-muted">
        Pick {picker.count === 1 ? 'one' : picker.count}. Then show{' '}
        {picker.count === 1 ? 'it' : 'them'} through what your character does and says, without
        using the word{picker.count === 1 ? '' : 's'}.
      </p>
      <div className="flex flex-wrap gap-2">
        {picker.options.map(({ trait }) => {
          const checked = traits.includes(trait);
          const id = `trait-${trait.replace(/[^a-z0-9]+/g, '-')}`;
          return (
            <div key={trait}>
              <input
                id={id}
                type="checkbox"
                className="peer sr-only"
                checked={checked}
                disabled={saving || (!checked && full)}
                aria-describedby="trait-hint"
                onChange={(e) => void toggle(trait, e.target.checked)}
              />
              <label
                htmlFor={id}
                className="inline-block cursor-pointer rounded-full border border-border bg-card px-3 py-1 peer-checked:border-brand peer-checked:bg-brand peer-checked:text-white peer-focus-visible:outline-3 peer-focus-visible:outline-brand peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
              >
                {checked && <span aria-hidden="true">✓ </span>}
                {trait}
              </label>
            </div>
          );
        })}
      </div>
      <output className="text-sm font-semibold" aria-live="polite">
        {traits.length === 0
          ? `Nothing picked yet (${picker.count} to pick).`
          : `Your character: ${traits.join(', ')}${full ? '' : ` (pick ${picker.count - traits.length} more)`}`}
      </output>
      <ErrorMessage message={error} />
    </fieldset>
  );
}
