'use client';

import { ClassSummary } from '@storyforge/shared';
import { useState } from 'react';
import { ErrorMessage } from '@/components/ui';
import { ApiError, apiJson } from '@/lib/api-client';

/** Self-paced learning: students unlock lessons and units by finishing the previous ones. */
export function SelfPacedToggle({ classId, initial }: { classId: string; initial: boolean }) {
  const [on, setOn] = useState(initial);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function change(next: boolean) {
    setOn(next);
    setStatus(null);
    setError(null);
    try {
      await apiJson(`/teacher/classes/${classId}`, ClassSummary, 'PATCH', { selfPaced: next });
      setStatus('Saved');
    } catch (e) {
      setOn(!next);
      setError(e instanceof ApiError ? e.userMessage : 'Could not save. Try again.');
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <input
          id="self-paced"
          type="checkbox"
          checked={on}
          onChange={(e) => void change(e.target.checked)}
          aria-describedby="self-paced-hint"
          className="size-5 accent-brand"
        />
        <label htmlFor="self-paced" className="font-semibold">
          <span aria-hidden="true">🧭 </span>Self-paced learning
        </label>
        <output className="text-sm text-ok">{status}</output>
      </div>
      <p id="self-paced-hint" className="text-sm text-muted">
        {on
          ? 'Students move on by themselves: finishing a lesson opens the next one, and finishing a unit opens the next unit. Quill’s feedback on their writing appears straight away.'
          : 'You choose which units are open on the Units & pacing page, and Quill’s feedback follows the AI feedback setting below.'}
      </p>
      <ErrorMessage message={error} />
    </div>
  );
}
