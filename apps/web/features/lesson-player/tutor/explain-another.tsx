'use client';

import { ExplainResponse } from '@storyforge/shared';
import { useState } from 'react';
import { Button, ErrorMessage } from '@/components/ui';
import { ApiError, apiJson } from '@/lib/api-client';

/** "Explain it another way": Quill re-teaches a Learn card from a new angle each time. */
export function ExplainAnother({ lessonId, cardIndex }: { lessonId: string; cardIndex: number }) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<ExplainResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function ask() {
    setBusy(true);
    setError(null);
    try {
      const next = await apiJson('/ai/explain', ExplainResponse, 'POST', {
        lessonId,
        cardIndex,
        attempt,
      });
      setResult(next);
      setShowAnswer(false);
      setAttempt((a) => a + 1);
    } catch (e) {
      setError(e instanceof ApiError ? e.userMessage : 'Could not reach Quill. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Button variant="secondary" className="self-start" disabled={busy} onClick={() => void ask()}>
        <span aria-hidden="true">🦉</span>
        {busy
          ? 'Quill is thinking…'
          : result
            ? 'Explain it yet another way'
            : 'Explain it another way'}
      </Button>
      <ErrorMessage message={error} />
      <div aria-live="polite">
        {result && (
          <div className="flex flex-col gap-3 rounded-2xl border border-brand/40 bg-background p-5">
            <p className="text-lg leading-relaxed">{result.explanation}</p>
            <blockquote className="border-l-4 border-brand pl-4 text-lg italic">
              {result.example}
            </blockquote>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="font-semibold">Quick check: {result.check.question}</p>
              {showAnswer ? (
                <p className="mt-2 text-ok">{result.check.answer}</p>
              ) : (
                <Button variant="secondary" className="mt-2" onClick={() => setShowAnswer(true)}>
                  Show the answer
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
