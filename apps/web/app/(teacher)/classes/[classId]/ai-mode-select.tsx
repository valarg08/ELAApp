'use client';

import { ClassSummary } from '@storyforge/shared';
import { useState } from 'react';
import { ErrorMessage } from '@/components/ui';
import { ApiError, apiJson } from '@/lib/api-client';
import { OwlIcon } from '@/components/owl-icon';

type Mode = ClassSummary['aiFeedbackMode'];

const MODES: { value: Mode; label: string; hint: string }[] = [
  {
    value: 'TEACHER_APPROVAL',
    label: 'Teacher approval',
    hint: 'Quill writes feedback; students see it after you release it.',
  },
  {
    value: 'IMMEDIATE',
    label: 'Immediate',
    hint: 'Students see Quill’s feedback as soon as it’s ready (safety concerns are always held for you).',
  },
  { value: 'OFF', label: 'Off', hint: 'No AI feedback on submissions.' },
];

/** Class AI feedback mode (DESIGN.md §8.1). */
export function AiModeSelect({ classId, initial }: { classId: string; initial: Mode }) {
  const [mode, setMode] = useState<Mode>(initial);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function change(next: Mode) {
    const previous = mode;
    setMode(next);
    setStatus(null);
    setError(null);
    try {
      await apiJson(`/teacher/classes/${classId}`, ClassSummary, 'PATCH', {
        aiFeedbackMode: next,
      });
      setStatus('Saved');
    } catch (e) {
      setMode(previous);
      setError(e instanceof ApiError ? e.userMessage : 'Could not save. Try again.');
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <label htmlFor="ai-mode" className="font-semibold">
        <OwlIcon className="mr-1" />
        AI feedback from Quill
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <select
          id="ai-mode"
          value={mode}
          onChange={(e) => {
            const next = MODES.find((m) => m.value === e.target.value)?.value;
            if (next) void change(next);
          }}
          aria-describedby="ai-mode-hint"
          className="min-h-11 rounded-xl border border-border bg-card px-3 focus-visible:outline-3 focus-visible:outline-brand"
        >
          {MODES.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
        <output className="text-sm text-ok">{status}</output>
      </div>
      <p id="ai-mode-hint" className="text-sm text-muted">
        {MODES.find((m) => m.value === mode)?.hint}
      </p>
      <ErrorMessage message={error} />
    </div>
  );
}
