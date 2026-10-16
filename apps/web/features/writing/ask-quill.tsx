'use client';

import { DEFAULT_ANALYZERS, type AnalyzerId, type Span } from '@storyforge/writing-analysis';
import {
  CHARACTER_ACTIVITY_TYPES,
  FIGURATIVE_ACTIVITY_TYPES,
  GRAMMAR_ACTIVITY_TYPES,
  PARAGRAPH_ACTIVITY_TYPES,
  ESSAY_ACTIVITY_TYPES,
  type LiveAnalyzerId,
  PLOT_ACTIVITY_TYPES,
  POETRY_ACTIVITY_TYPES,
  POV_ACTIVITY_TYPES,
  type PlotPlan,
  SETTING_ACTIVITY_TYPES,
  TONE_ACTIVITY_TYPES,
  type ToneChoice,
  LiveCheckResponse,
  type WritingActivity,
} from '@storyforge/shared';
import { useState } from 'react';
import { Button, ErrorMessage } from '@/components/ui';
import { ApiError, apiJson } from '@/lib/api-client';
import { Points } from './feedback-panel';

/** Coach checks that have a deeper AI version. */
const AI_CHECKS: Partial<Record<AnalyzerId, { id: LiveAnalyzerId; label: string }>> = {
  telling: { id: 'show-vs-tell', label: 'Ask Quill about showing' },
  senses: { id: 'sensory-analysis', label: 'Ask Quill about senses' },
};

/**
 * "Ask Quill": AI checks from the Coach panel (DESIGN.md §5.5). Limited per hour and per day, so
 * students use the instant checks first.
 */
export function AskQuill({
  activityId,
  activity,
  traits,
  mood,
  conflict,
  plot,
  tone,
  syllables,
  text,
  onShow,
}: {
  activityId: string;
  activity: WritingActivity;
  traits: string[];
  mood: string[];
  conflict: string | null;
  plot: PlotPlan;
  tone: ToneChoice;
  syllables: Record<string, number>;
  text: string;
  onShow: (span: Span) => void;
}) {
  const checks = [
    ...(CHARACTER_ACTIVITY_TYPES.includes(activity.type)
      ? [{ id: 'character-read' as const, label: 'Can my reader tell?' }]
      : []),
    ...(PLOT_ACTIVITY_TYPES.includes(activity.type)
      ? [{ id: 'plot-check' as const, label: 'Does my plot work?' }]
      : []),
    ...(POV_ACTIVITY_TYPES.includes(activity.type)
      ? [{ id: 'pov-consistency' as const, label: 'Is my point of view steady?' }]
      : []),
    ...(POETRY_ACTIVITY_TYPES.includes(activity.type)
      ? [{ id: 'poetry-craft' as const, label: 'Does my poem work?' }]
      : []),
    ...(GRAMMAR_ACTIVITY_TYPES.includes(activity.type)
      ? [{ id: 'grammar-check' as const, label: 'Is my grammar right?' }]
      : []),
    ...(PARAGRAPH_ACTIVITY_TYPES.includes(activity.type)
      ? [{ id: 'paragraph-structure' as const, label: 'Is my paragraph built well?' }]
      : []),
    ...(ESSAY_ACTIVITY_TYPES.includes(activity.type)
      ? [
          {
            id: 'essay-structure' as const,
            label:
              activity.type === 'ESSAY_OUTLINE'
                ? 'Is my outline ready to write from?'
                : activity.essay?.part === 'introduction'
                  ? 'Is my introduction ready?'
                  : 'Is my essay structured well?',
          },
        ]
      : []),
    ...(FIGURATIVE_ACTIVITY_TYPES.includes(activity.type)
      ? [{ id: 'figurative-language' as const, label: 'Did my comparisons work?' }]
      : []),
    ...(TONE_ACTIVITY_TYPES.includes(activity.type)
      ? [{ id: 'tone-style' as const, label: 'What tone will my reader hear?' }]
      : []),
    ...(SETTING_ACTIVITY_TYPES.includes(activity.type)
      ? [{ id: 'setting-mood' as const, label: 'What mood will my reader feel?' }]
      : []),
    ...(activity.analyzers ?? DEFAULT_ANALYZERS).flatMap((a) => {
      const check = AI_CHECKS[a];
      return check ? [check] : [];
    }),
  ];
  const [busy, setBusy] = useState<LiveAnalyzerId | null>(null);
  const [result, setResult] = useState<{ text: string; response: LiveCheckResponse } | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (checks.length === 0) return null;

  async function ask(analyzer: LiveAnalyzerId) {
    setBusy(analyzer);
    setError(null);
    try {
      const response = await apiJson('/ai/check', LiveCheckResponse, 'POST', {
        activityId,
        analyzer,
        text,
        traits,
        mood,
        conflict,
        plot,
        tone,
        syllables,
      });
      setResult({ text, response });
    } catch (e) {
      setError(
        e instanceof ApiError ? e.userMessage : 'Could not reach Quill. Check your connection.',
      );
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-col gap-3 border-t border-border pt-4">
      <h3 className="font-semibold">
        <span aria-hidden="true">✨ </span>Ask Quill (AI)
      </h3>
      <p className="text-sm text-muted">Deeper tips from Quill’s AI. You get a few each hour.</p>
      <div className="flex flex-wrap gap-2">
        {checks.map((c) => (
          <Button
            key={c.id}
            variant="secondary"
            disabled={busy !== null}
            onClick={() => void ask(c.id)}
          >
            {busy === c.id ? 'Quill is thinking…' : c.label}
          </Button>
        ))}
      </div>
      <ErrorMessage message={error} />
      <div aria-live="polite" className="flex flex-col gap-3">
        {result && (
          <>
            {result.text !== text && (
              <p className="text-sm text-muted">
                These tips are for an earlier version of your writing.
              </p>
            )}
            {result.response.held ? (
              <p>{result.response.message}</p>
            ) : (
              <>
                <Points
                  title="🌟 What’s working"
                  points={result.response.strengths}
                  text={text}
                  onShow={onShow}
                />
                <Points
                  title="💡 Try next"
                  points={result.response.nextSteps}
                  text={text}
                  onShow={onShow}
                  numbered
                />
                {result.response.strengths.length + result.response.nextSteps.length === 0 && (
                  <p className="text-muted">Quill didn’t find anything to point out this time.</p>
                )}
              </>
            )}
            <p className="text-sm text-muted">
              {result.response.remaining.hour} AI checks left this hour.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
