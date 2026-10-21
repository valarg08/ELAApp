'use client';

import { CONFIDENCE_LEVELS, type LessonSteps, TrapProblems } from '@storyforge/shared';
import { useEffect, useState } from 'react';
import { MathText } from '@/components/math-text';
import { Button, ErrorMessage } from '@/components/ui';
import { ApiError, apiJson } from '@/lib/api-client';
import type { StepProps } from './step-props';

type Reflect = LessonSteps[4];
type Trap = { activityKey: string; problemId: string; note: string };

export function ReflectStep({
  step,
  done,
  busy,
  onComplete,
  lessonId,
  math = false,
}: StepProps<Reflect> & { lessonId: string; math?: boolean }) {
  const [answers, setAnswers] = useState<string[]>(step.prompts.map(() => ''));
  const [confidence, setConfidence] = useState<number | null>(null);
  const [trap, setTrap] = useState<Trap>({ activityKey: '', problemId: '', note: '' });
  const [error, setError] = useState<string | null>(null);
  const trapReady = !step.trapPicker || (trap.problemId !== '' && trap.note.trim() !== '');
  const ready =
    answers.every((a) => a.trim()) && (!step.confidenceCheck || confidence !== null) && trapReady;

  async function submit() {
    setError(null);
    try {
      await onComplete({
        answers: answers.map((a) => a.trim()),
        ...(confidence ? { confidence } : {}),
        ...(step.trapPicker ? { trap: { ...trap, note: trap.note.trim() } } : {}),
      });
    } catch (e) {
      setError(e instanceof ApiError ? e.userMessage : 'Could not save. Try again.');
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-2xl font-bold">Think about it</h2>
      {step.trapPicker && <TrapPicker lessonId={lessonId} value={trap} onChange={setTrap} />}
      {step.prompts.map((prompt, i) => (
        <div key={prompt} className="flex flex-col gap-1">
          <label htmlFor={`reflect-${i}`} className="text-lg font-medium">
            {math ? <MathText text={prompt} /> : prompt}
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

/**
 * Math only (math-design.md §3.3 C3): pick the problem that tricked you (the ones you missed come
 * first) and say what the trap was in one line.
 */
function TrapPicker({
  lessonId,
  value,
  onChange,
}: {
  lessonId: string;
  value: Trap;
  onChange: (t: Trap) => void;
}) {
  const [list, setList] = useState<TrapProblems['problems'] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    apiJson(`/math/lessons/${encodeURIComponent(lessonId)}/trap-problems`, TrapProblems)
      .then((r) => {
        if (live) setList(r.problems);
      })
      .catch((e: unknown) => {
        if (live) setError(e instanceof ApiError ? e.userMessage : 'Could not load the problems.');
      });
    return () => {
      live = false;
    };
  }, [lessonId]);

  if (error) return <ErrorMessage message={error} />;
  if (!list) return <p className="text-muted">Loading the problems…</p>;
  const anyMissed = list.some((p) => p.missed);
  return (
    <div className="flex flex-col gap-4">
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-lg font-medium">
          {anyMissed
            ? 'Which problem tricked you? The ones you missed are first.'
            : 'Which problem was the trickiest?'}
        </legend>
        {list.map((p) => {
          const checked = value.activityKey === p.activityKey && value.problemId === p.problemId;
          return (
            <label
              key={`${p.activityKey}/${p.problemId}`}
              className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border-2 bg-card px-4 py-3 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-brand ${
                checked ? 'border-brand' : 'border-border'
              }`}
            >
              <input
                type="radio"
                name="trap-problem"
                checked={checked}
                onChange={() =>
                  onChange({ ...value, activityKey: p.activityKey, problemId: p.problemId })
                }
                className="mt-1 h-5 w-5 shrink-0 accent-brand"
              />
              <span className="flex flex-col gap-1">
                {p.missed && (
                  <span className="text-sm font-semibold text-warn">You missed this</span>
                )}
                <span className="line-clamp-3">
                  <MathText text={p.prompt} />
                </span>
              </span>
            </label>
          );
        })}
      </fieldset>
      <div className="flex flex-col gap-1">
        <label htmlFor="trap-note" className="text-lg font-medium">
          What’s the trap? (one line)
        </label>
        <input
          id="trap-note"
          type="text"
          maxLength={300}
          value={value.note}
          onChange={(e) => onChange({ ...value, note: e.target.value })}
          className="min-h-11 rounded-xl border border-border bg-card px-3 py-2 text-lg focus-visible:outline-3 focus-visible:outline-brand"
        />
      </div>
    </div>
  );
}
