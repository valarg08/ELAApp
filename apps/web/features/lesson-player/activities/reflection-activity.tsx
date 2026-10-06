'use client';

import type { ActivityContent } from '@storyforge/shared';
import { useState } from 'react';
import { Button } from '@/components/ui';
import type { ActivityResult } from './types';

type Activity = Extract<ActivityContent, { type: 'REFLECTION' }>;

export function ReflectionActivity({
  activity,
  onDone,
}: {
  activity: Activity;
  onDone: (r: ActivityResult) => void;
}) {
  const [answers, setAnswers] = useState<string[]>(activity.prompts.map(() => ''));
  const ready = answers.every((a) => a.trim().length > 0);

  return (
    <div className="flex flex-col gap-4">
      {activity.prompts.map((prompt, i) => (
        <div key={prompt} className="flex flex-col gap-1">
          <label htmlFor={`${activity.key}-${i}`} className="font-medium">
            {prompt}
          </label>
          <textarea
            id={`${activity.key}-${i}`}
            rows={3}
            value={answers[i]}
            onChange={(e) => setAnswers(answers.map((a, j) => (j === i ? e.target.value : a)))}
            className="rounded-xl border border-border bg-card px-3 py-2 focus-visible:outline-3 focus-visible:outline-brand"
          />
        </div>
      ))}
      <Button
        className="self-start"
        disabled={!ready}
        onClick={() => onDone({ correct: true, attempts: 1 })}
      >
        Done
      </Button>
    </div>
  );
}
