'use client';

import { MathExplainResponse } from '@storyforge/shared';
import { useState } from 'react';
import { Button, ErrorMessage } from '@/components/ui';
import { MathText } from '@/components/math-text';
import { ApiError, apiJson } from '@/lib/api-client';

/**
 * Quill on a Math problem (DESIGN.md §9.13): "Explain it another way" or "Why was mine wrong?".
 * The verdict came from math-check; Quill only explains it.
 */
export function QuillMath({
  lessonId,
  activityKey,
  problemId,
  mode,
  answer,
}: {
  lessonId: string;
  activityKey: string;
  problemId: string;
  mode: 'explain' | 'mistake';
  /** Mistake mode: the wrong answer the student gave. */
  answer?: string;
}) {
  const [result, setResult] = useState<MathExplainResponse | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function ask(next: number) {
    setBusy(true);
    setError(null);
    try {
      setResult(
        await apiJson('/ai/math/explain', MathExplainResponse, 'POST', {
          lessonId,
          activityKey,
          problemId,
          mode,
          answer: mode === 'mistake' ? answer : undefined,
          attempt: next,
        }),
      );
      setAttempt(next);
    } catch (e) {
      setError(e instanceof ApiError ? e.userMessage : 'Quill is busy right now. Try again.');
    } finally {
      setBusy(false);
    }
  }

  const label = mode === 'explain' ? 'Explain it another way' : 'Why was mine wrong?';
  if (!result) {
    return (
      <div className="flex flex-col gap-2">
        <Button
          variant="secondary"
          className="self-start"
          disabled={busy}
          onClick={() => void ask(0)}
        >
          <span aria-hidden="true">🦉 </span>
          {busy ? 'Quill is thinking…' : label}
        </Button>
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <section
      aria-label={`Quill: ${label}`}
      className="flex flex-col gap-3 rounded-2xl border border-brand/40 bg-background p-4"
      aria-live="polite"
    >
      <p className="font-semibold">
        <span aria-hidden="true">🦉 </span>Quill
      </p>
      {result.likelyMistake && (
        <p>
          <MathText text={result.likelyMistake} />
        </p>
      )}
      <ol className="ml-5 flex list-decimal flex-col gap-1">
        {result.steps.map((step, i) => (
          <li key={i}>
            <MathText text={step} />
          </li>
        ))}
      </ol>
      <p className="text-sm">
        <strong>Key idea:</strong> <MathText text={result.keyIdea} />
      </p>
      <ErrorMessage message={error} />
      {attempt < 4 && (
        <Button
          variant="secondary"
          className="self-start"
          disabled={busy}
          onClick={() => void ask(attempt + 1)}
        >
          {busy ? 'Quill is thinking…' : 'Explain it another way'}
        </Button>
      )}
    </section>
  );
}
