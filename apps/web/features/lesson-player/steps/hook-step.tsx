'use client';

import type { LessonSteps } from '@storyforge/shared';
import { useState } from 'react';
import { Button } from '@/components/ui';
import type { StepProps } from './step-props';

type Hook = LessonSteps[0];

export function HookStep({ step, done, busy, onComplete }: StepProps<Hook>) {
  const [picked, setPicked] = useState<'a' | 'b' | null>(null);
  const [response, setResponse] = useState('');

  if (step.variant === 'story') {
    return (
      <div className="flex flex-col gap-5">
        <h2 className="text-2xl font-bold">{step.title}</h2>
        {step.paragraphs.map((p) => (
          <p key={p} className="text-xl leading-relaxed whitespace-pre-line">
            {p}
          </p>
        ))}
        <Button className="self-start" disabled={busy} onClick={() => onComplete({})}>
          {done ? 'Next' : "Let's go"}
        </Button>
      </div>
    );
  }

  if (step.variant === 'compare') {
    return (
      <div className="flex flex-col gap-5">
        <h2 className="text-2xl font-bold">{step.prompt}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {(['a', 'b'] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setPicked(key)}
              aria-pressed={picked === key}
              className={`min-h-28 rounded-2xl border-2 bg-card p-5 text-left text-lg whitespace-pre-line transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                picked === key ? 'border-brand' : 'border-border hover:border-brand'
              }`}
            >
              <span className="mb-2 block text-sm font-semibold text-muted">
                {key.toUpperCase()}
              </span>
              {step[key]}
            </button>
          ))}
        </div>
        <div aria-live="polite">
          {(picked || done) && (
            <p className="rounded-xl border border-brand bg-card px-4 py-3 text-lg">
              💡 {step.reveal}
            </p>
          )}
        </div>
        <Button
          className="self-start"
          disabled={busy || (!picked && !done)}
          onClick={() =>
            onComplete({ response: picked ? `Chose ${picked.toUpperCase()}` : undefined })
          }
        >
          Next
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <label htmlFor="hook-response" className="text-2xl font-bold">
        {step.prompt}
      </label>
      <textarea
        id="hook-response"
        rows={4}
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        placeholder={step.placeholder}
        className="rounded-xl border border-border bg-card px-3 py-2 text-lg focus-visible:outline-3 focus-visible:outline-brand"
      />
      <p className="text-sm text-muted">
        Writing an answer is optional, but it warms up your brain!
      </p>
      <Button
        className="self-start"
        disabled={busy}
        onClick={() => onComplete({ response: response.trim() || undefined })}
      >
        Next
      </Button>
    </div>
  );
}
