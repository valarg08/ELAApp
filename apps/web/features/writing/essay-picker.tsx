'use client';

import { type EssayPrompt, SubmissionDetail } from '@storyforge/shared';
import type { EssayType } from '@storyforge/writing-analysis';
import { useState } from 'react';
import { ErrorMessage } from '@/components/ui';
import { ApiError, apiJson } from '@/lib/api-client';

/**
 * Choose your essay (Essay Unit 15's final essay, DESIGN.md §9.12): one prompt per kind of essay.
 * The choice is saved straight away, and the Coach, the checklist and Quill judge the essay as
 * that kind.
 */
export function EssayPicker({
  submissionId,
  prompts,
  value,
  onChange,
}: {
  submissionId: string;
  prompts: EssayPrompt[];
  value: EssayType | null;
  onChange: (type: EssayType) => void;
}) {
  const [error, setError] = useState<string | null>(null);

  async function choose(type: EssayType) {
    const before = value;
    onChange(type);
    try {
      await apiJson(
        `/submissions/${encodeURIComponent(submissionId)}/essay-type`,
        SubmissionDetail,
        'PUT',
        { essayType: type },
      );
      setError(null);
    } catch (e) {
      if (before) onChange(before);
      setError(e instanceof ApiError ? e.userMessage : 'Could not save your choice. Try again.');
    }
  }

  return (
    <fieldset className="rounded-xl border border-border bg-background p-4">
      <legend className="px-1 font-semibold">Choose your essay</legend>
      <p className="text-sm text-muted">
        Pick one prompt. You can change your mind while you plan; the Coach checks your essay as the
        kind you choose.
      </p>
      <div className="mt-3 flex flex-col gap-2">
        {prompts.map((p) => (
          <label
            key={p.type}
            className={`flex cursor-pointer gap-3 rounded-lg border p-3 ${
              value === p.type ? 'border-brand bg-brand/5' : 'border-border'
            }`}
          >
            <input
              type="radio"
              name="essay-prompt"
              value={p.type}
              checked={value === p.type}
              onChange={() => void choose(p.type)}
              className="mt-1 size-4 shrink-0 accent-brand focus-visible:outline-3 focus-visible:outline-brand"
            />
            <span className="text-sm">
              <span className="block font-semibold">{p.title}</span>
              <span className="block">{p.prompt}</span>
              {p.tips.length > 0 && (
                <span className="mt-1 block">
                  <span className="font-semibold">Tips:</span> {p.tips.join(' ')}
                </span>
              )}
            </span>
          </label>
        ))}
      </div>
      <ErrorMessage message={error} />
    </fieldset>
  );
}
