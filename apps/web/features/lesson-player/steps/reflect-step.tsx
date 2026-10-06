'use client';

import { CONFIDENCE_LEVELS, type LessonSteps } from '@storyforge/shared';
import { useState } from 'react';
import { Button, ErrorMessage } from '@/components/ui';
import { ApiError } from '@/lib/api-client';
import type { StepProps } from './step-props';

type Reflect = LessonSteps[4];

export function ReflectStep({ step, done, busy, onComplete }: StepProps<Reflect>) {
  const [answers, setAnswers] = useState<string[]>(step.prompts.map(() => ''));
  const [confidence, setConfidence] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const ready = answers.every((a) => a.trim()) && (!step.confidenceCheck || confidence !== null);

  async function submit() {
    setError(null);
    try {
      await onComplete({
        answers: answers.map((a) => a.trim()),
        ...(confidence ? { confidence } : {}),
      });
    } catch (e) {
      setError(e instanceof ApiError ? e.userMessage : 'Could not save. Try again.');
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-2xl font-bold">Think about it</h2>
      {step.prompts.map((prompt, i) => (
        <div key={prompt} className="flex flex-col gap-1">
          <label htmlFor={`reflect-${i}`} className="text-lg font-medium">
            {prompt}
          </label>
          <textarea
            id={`reflect-${i}`}
            rows={3}
            value={answers[i]}
            onChange={(e) => setAnswers(answers.map((a, j) => (j === i ? e.target.value : a)))}
            className="rounded-xl border border-border bg-card px-3 py-2 text-lg focus-visible:outline-3 focus-visible:outline-brand"
          />
        </div>
      ))}

      {step.confidenceCheck && (
        <fieldset>
          <legend className="mb-3 text-lg font-medium">
            How confident do you feel about this skill?
          </legend>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {CONFIDENCE_LEVELS.map((level) => (
              <label
                key={level.value}
                className={`flex cursor-pointer flex-col items-center gap-1 rounded-2xl border-2 bg-card p-3 text-center transition has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-brand ${
                  confidence === level.value ? 'border-brand' : 'border-border hover:border-brand'
                }`}
              >
                <input
                  type="radio"
                  name="confidence"
                  value={level.value}
                  checked={confidence === level.value}
                  onChange={() => setConfidence(level.value)}
                  className="sr-only"
                />
                <span className="text-4xl" aria-hidden="true">
                  {level.emoji}
                </span>
                <span className="text-sm font-medium">{level.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <ErrorMessage message={error} />
      <Button className="self-start" disabled={busy || !ready} onClick={submit}>
        {busy ? 'Saving…' : done ? 'Save' : 'Finish lesson'}
      </Button>
    </div>
  );
}
