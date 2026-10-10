'use client';

import { DEFAULT_ANALYZERS, type AnalyzerId, type Span } from '@storyforge/writing-analysis';
import { type LiveAnalyzerId, LiveCheckResponse, type WritingActivity } from '@storyforge/shared';
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
  text,
  onShow,
}: {
  activityId: string;
  activity: WritingActivity;
  text: string;
  onShow: (span: Span) => void;
}) {
  const checks = (activity.analyzers ?? DEFAULT_ANALYZERS).flatMap((a) => {
    const check = AI_CHECKS[a];
    return check ? [check] : [];
  });
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
