'use client';

import {
  type PlotPlan,
  type PlotPlanner as PlotPlannerConfig,
  STORY_STAGES,
  SubmissionDetail,
  planComplete,
} from '@storyforge/shared';
import { useEffect, useRef, useState } from 'react';
import { ErrorMessage } from '@/components/ui';
import { ApiError, apiJson } from '@/lib/api-client';

const SAVE_DELAY_MS = 1000;

/**
 * Unit 4: the story mountain planner. One line per stage, saved a moment after typing stops (and
 * when a field loses focus). All five are needed before submitting.
 */
export function PlotPlanner({
  submissionId,
  planner,
  plot,
  onChange,
}: {
  submissionId: string;
  planner: PlotPlannerConfig;
  plot: PlotPlan;
  onChange: (plot: PlotPlan) => void;
}) {
  const [status, setStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const latest = useRef(plot);
  const filled = STORY_STAGES.filter((s) => plot[s.id].trim().length > 0).length;

  useEffect(() => () => clearTimeout(timer.current), []);

  async function save() {
    clearTimeout(timer.current);
    setStatus('saving');
    try {
      await apiJson(
        `/submissions/${encodeURIComponent(submissionId)}/plot`,
        SubmissionDetail,
        'PUT',
        { plot: latest.current },
      );
      setStatus('saved');
      setError(null);
    } catch (e) {
      setStatus('unsaved');
      setError(e instanceof ApiError ? e.userMessage : 'Could not save your plan. Try again.');
    }
  }

  function update(stage: keyof PlotPlan, value: string) {
    const next = { ...latest.current, [stage]: value };
    latest.current = next;
    onChange(next);
    setStatus('unsaved');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => void save(), SAVE_DELAY_MS);
  }

  return (
    <fieldset className="flex flex-col gap-3 rounded-xl border border-brand/40 bg-background p-4">
      <legend className="px-1 font-semibold">
        <span aria-hidden="true">⛰️ </span>
        {planner.label}
      </legend>
      <p className="text-sm text-muted">
        One line for each part of the story mountain. You can change the plan while you write.
      </p>
      <ol className="flex flex-col gap-3">
        {STORY_STAGES.map((stage, i) => (
          <li key={stage.id} className="flex flex-col gap-1">
            <label htmlFor={`plot-${stage.id}`} className="font-medium">
              {i + 1}. {stage.label}
            </label>
            <input
              id={`plot-${stage.id}`}
              type="text"
              maxLength={200}
              value={plot[stage.id]}
              placeholder={stage.hint}
              aria-describedby={`plot-${stage.id}-hint`}
              onChange={(e) => update(stage.id, e.target.value)}
              onBlur={() => {
                if (status === 'unsaved') void save();
              }}
              className="rounded-lg border border-border bg-card px-3 py-2 focus-visible:outline-3 focus-visible:outline-brand"
            />
            <span id={`plot-${stage.id}-hint`} className="sr-only">
              {stage.hint}
            </span>
          </li>
        ))}
      </ol>
      <output className="text-sm font-semibold" aria-live="polite">
        {planComplete(plot) ? '✓ Plan complete' : `${filled} of 5 parts planned`}
        {status === 'saving' ? ' · saving…' : status === 'unsaved' ? '' : ' · saved'}
      </output>
      <ErrorMessage message={error} />
    </fieldset>
  );
}
