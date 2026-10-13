'use client';

import {
  SubmissionDetail,
  type TonePicker as TonePickerConfig,
  type ToneChoice,
} from '@storyforge/shared';
import {
  TONE_AXES,
  TONE_STEPS,
  type TonePole,
  type ToneStep,
  isToneStep,
  toneStepLabel,
} from '@storyforge/writing-analysis';
import { useState } from 'react';
import { ErrorMessage } from '@/components/ui';
import { ApiError, apiJson } from '@/lib/api-client';

export const TONE_ICONS: Record<TonePole, string> = {
  funny: '😄',
  serious: '🧐',
  formal: '🎩',
  casual: '🧢',
  hopeful: '🌅',
  dark: '🌑',
};

/**
 * Unit 5: the tone sliders (DESIGN.md §10). Five steps per scale (funny ↔ serious, formal ↔ casual,
 * hopeful ↔ dark), built from radio buttons so a scale can start unset and works with arrow keys.
 * Saved straight away; the Coach later shows where the words sit on the same scales.
 */
export function TonePicker({
  submissionId,
  picker,
  tone,
  onChange,
}: {
  submissionId: string;
  picker: TonePickerConfig;
  tone: ToneChoice;
  onChange: (tone: ToneChoice) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const axes = TONE_AXES.filter((a) => picker.axes.includes(a.id));
  const set = axes.flatMap((a) => {
    const step = tone[a.id];
    return isToneStep(step) ? [toneStepLabel(a.id, step)] : [];
  });

  async function choose(axis: (typeof axes)[number]['id'], step: ToneStep) {
    const previous = tone;
    const next = { ...tone, [axis]: step };
    onChange(next);
    setError(null);
    setSaving(true);
    try {
      const saved = await apiJson(
        `/submissions/${encodeURIComponent(submissionId)}/tone`,
        SubmissionDetail,
        'PUT',
        { tone: next },
      );
      onChange(saved.tone);
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
        <span aria-hidden="true">🎚️ </span>
        {picker.label}
      </legend>
      <p id="tone-hint" className="text-sm text-muted">
        Slide each scale to the tone you’re aiming for. Then let your word choices, sentences and
        what your narrator notices create it.
      </p>
      <div className="flex flex-col gap-4">
        {axes.map((axis) => {
          const [left, right] = axis.poles;
          const value = tone[axis.id];
          return (
            <fieldset key={axis.id} className="flex flex-col gap-1">
              <legend className="sr-only">
                How {left} or {right}?
              </legend>
              <div className="flex justify-between text-sm font-semibold" aria-hidden="true">
                <span>
                  {TONE_ICONS[left]} {left}
                </span>
                <span>
                  {right} {TONE_ICONS[right]}
                </span>
              </div>
              <div className="relative flex items-center justify-between px-1">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-2 top-1/2 h-1 -translate-y-1/2 rounded bg-border"
                />
                {TONE_STEPS.map((step) => {
                  const id = `tone-${axis.id}-${step}`;
                  return (
                    <span key={step} className="relative">
                      <input
                        id={id}
                        type="radio"
                        name={`tone-${axis.id}`}
                        className="peer sr-only"
                        checked={value === step}
                        disabled={saving}
                        aria-describedby="tone-hint"
                        onChange={() => void choose(axis.id, step)}
                      />
                      <label
                        htmlFor={id}
                        className="block size-7 cursor-pointer rounded-full border-2 border-border bg-card peer-checked:border-brand peer-checked:bg-brand peer-focus-visible:outline-3 peer-focus-visible:outline-brand peer-disabled:cursor-wait"
                      >
                        <span className="sr-only">{toneStepLabel(axis.id, step)}</span>
                      </label>
                    </span>
                  );
                })}
              </div>
              <p className="text-center text-sm text-muted">
                {isToneStep(value) ? `Aiming for: ${toneStepLabel(axis.id, value)}` : 'Not set yet'}
              </p>
            </fieldset>
          );
        })}
      </div>
      <output className="text-sm font-semibold" aria-live="polite">
        {set.length === axes.length
          ? `✓ Tone set: ${set.join(', ')}`
          : `Set ${axes.length - set.length} more ${axes.length - set.length === 1 ? 'scale' : 'scales'} to submit.`}
      </output>
      <ErrorMessage message={error} />
    </fieldset>
  );
}
