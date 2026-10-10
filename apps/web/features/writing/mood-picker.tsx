'use client';

import { type MoodPicker as MoodPickerConfig, SubmissionDetail } from '@storyforge/shared';
import { MOOD_AXES, type MoodPole, moodWordBank } from '@storyforge/writing-analysis';
import { useState } from 'react';
import { ErrorMessage } from '@/components/ui';
import { ApiError, apiJson } from '@/lib/api-client';

const POLE_ICONS: Record<MoodPole, string> = {
  calm: '🌊',
  tense: '⚡',
  bright: '☀️',
  gloomy: '🌫️',
  safe: '🏠',
  dangerous: '⚠️',
};

/**
 * Unit 3: the mood "sliders" of the World builder (DESIGN.md §10), one choice per scale. Shows a
 * setting word bank for the chosen moods. Saved straight away.
 */
export function MoodPicker({
  submissionId,
  picker,
  mood,
  onChange,
}: {
  submissionId: string;
  picker: MoodPickerConfig;
  mood: string[];
  onChange: (mood: string[]) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const axes = MOOD_AXES.filter((a) => picker.axes.includes(a.id));
  const chosen: MoodPole[] = axes.flatMap((a) => a.poles.filter((p) => mood.includes(p)));
  const bank = moodWordBank(chosen);

  async function choose(axisPoles: readonly string[], pole: string) {
    const previous = mood;
    const next = [...mood.filter((m) => !axisPoles.includes(m)), pole];
    onChange(next);
    setError(null);
    setSaving(true);
    try {
      const saved = await apiJson(
        `/submissions/${encodeURIComponent(submissionId)}/mood`,
        SubmissionDetail,
        'PUT',
        { mood: next },
      );
      onChange(saved.mood);
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
      <p id="mood-hint" className="text-sm text-muted">
        Choose one side of each scale. Then build that mood with details: light, weather, sounds,
        objects. Try not to name the mood itself.
      </p>
      <div className="flex flex-col gap-3">
        {axes.map((axis) => (
          <fieldset key={axis.id} className="flex flex-wrap items-center gap-2">
            <legend className="sr-only">
              {axis.poles[0]} or {axis.poles[1]}
            </legend>
            {axis.poles.map((pole) => {
              const id = `mood-${pole}`;
              return (
                <div key={pole}>
                  <input
                    id={id}
                    type="radio"
                    name={`mood-${axis.id}`}
                    className="peer sr-only"
                    checked={mood.includes(pole)}
                    disabled={saving}
                    aria-describedby="mood-hint"
                    onChange={() => void choose(axis.poles, pole)}
                  />
                  <label
                    htmlFor={id}
                    className="inline-block min-w-28 cursor-pointer rounded-full border border-border bg-card px-3 py-1 text-center peer-checked:border-brand peer-checked:bg-brand peer-checked:text-white peer-focus-visible:outline-3 peer-focus-visible:outline-brand peer-disabled:cursor-wait"
                  >
                    <span aria-hidden="true">{POLE_ICONS[pole]} </span>
                    {pole}
                  </label>
                </div>
              );
            })}
          </fieldset>
        ))}
      </div>
      <output className="text-sm font-semibold" aria-live="polite">
        {chosen.length === 0
          ? 'No mood chosen yet.'
          : `Your setting: ${chosen.join(', ')}${chosen.length < axes.length ? ` (choose ${axes.length - chosen.length} more)` : ''}`}
      </output>
      {chosen.length > 0 && (
        <details className="rounded-lg border border-border bg-card p-3" open>
          <summary className="cursor-pointer font-semibold">📚 Setting word bank</summary>
          <dl className="mt-2 flex flex-col gap-1 text-sm">
            {chosen.map((pole) => (
              <div key={pole}>
                <dt className="inline font-semibold">Words that feel {pole}: </dt>
                <dd className="inline">{bank[pole]?.join(', ')}</dd>
              </div>
            ))}
          </dl>
        </details>
      )}
      <ErrorMessage message={error} />
    </fieldset>
  );
}
