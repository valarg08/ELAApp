'use client';

import { type LessonActivity, answerLabel, markAnswer, publicProblem } from '@storyforge/shared';
import { useState } from 'react';
import { Button, ErrorMessage } from '@/components/ui';
import { MathText } from '@/components/math-text';
import { ProblemView } from '@/features/math/problem-view';
import { QuillMath } from '@/features/math/quill-math';
import { ApiError, apiJson } from '@/lib/api-client';
import { ErrorLogEntry } from '@storyforge/shared';
import { focusOnMount } from './focus';
import type { ActivityResult } from './types';

type Activity = Extract<LessonActivity, { type: 'PROBLEMS' }>;

type State = 'trying' | 'solved' | 'shown';

/**
 * Math practice (DESIGN.md §9.13): one problem at a time, checked in the browser with math-check.
 * Hints open one at a time; "Show me" reveals the worked solution. A miss can go to the error log,
 * and Quill can explain the solution or the student's wrong answer.
 */
export function Problems({
  lessonId,
  activity,
  onDone,
}: {
  lessonId: string;
  activity: Activity;
  onDone: (r: ActivityResult) => void;
}) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [message, setMessage] = useState<{ text: string; good: boolean } | null>(null);
  const [hints, setHints] = useState(0);
  const [state, setState] = useState<State>('trying');
  const [lastWrong, setLastWrong] = useState<string | null>(null);
  const [checks, setChecks] = useState(0);
  const [logged, setLogged] = useState<'idle' | 'busy' | 'done'>('idle');
  const [error, setError] = useState<string | null>(null);
  const problem = activity.problems[index];
  if (!problem) return null;
  const isLast = index === activity.problems.length - 1;

  function check() {
    if (!problem || state !== 'trying' || !answer.trim()) return;
    const mark = markAnswer(problem, answer);
    if (mark.readable) setChecks((n) => n + 1);
    if (mark.verdict === 'correct') {
      setState('solved');
      setMessage({ text: 'Correct! 🎉', good: true });
    } else if (mark.verdict === 'form') {
      setMessage({ text: mark.message, good: false });
    } else {
      if (mark.readable) setLastWrong(answer.trim());
      setMessage({
        text: mark.readable
          ? `Not quite. ${hints < problem.hints.length ? 'Try a hint, or check your working.' : 'Check your working, or see the solution.'}`
          : mark.message,
        good: false,
      });
    }
  }

  async function addToLog() {
    if (!problem) return;
    setLogged('busy');
    setError(null);
    try {
      await apiJson('/math/error-log', ErrorLogEntry, 'POST', {
        lessonId,
        activityKey: activity.key,
        problemId: problem.id,
      });
      setLogged('done');
    } catch (e) {
      setLogged('idle');
      setError(e instanceof ApiError ? e.userMessage : 'Could not add it. Try again.');
    }
  }

  function next() {
    if (isLast) {
      onDone({ correct: true, attempts: Math.max(checks, activity.problems.length) });
      return;
    }
    setIndex(index + 1);
    setAnswer('');
    setMessage(null);
    setHints(0);
    setState('trying');
    setLastWrong(null);
    setLogged('idle');
    setError(null);
  }

  const finished = state !== 'trying';
  return (
    <div className="flex flex-col gap-5">
      {index === 0 && <p className="text-muted">{activity.instructions}</p>}
      <p className="text-sm font-semibold text-muted" aria-live="polite">
        Problem {index + 1} of {activity.problems.length}
        {problem.difficulty >= 3 && ' · ⭐ challenge'}
      </p>
      <ProblemView
        key={problem.id}
        problem={publicProblem(problem)}
        answer={answer}
        onAnswer={(v) => {
          setAnswer(v);
          if (!finished) setMessage(null);
        }}
        onSubmit={check}
        disabled={finished}
      />
      {message && (
        <output className={`block font-semibold ${message.good ? 'text-ok' : 'text-warn'}`}>
          {message.text}
        </output>
      )}

      {hints > 0 && (
        <ol className="flex flex-col gap-2" aria-label="Hints">
          {problem.hints.slice(0, hints).map((h, i) => (
            <li key={i} className="rounded-xl border border-border bg-background p-3">
              <span className="font-semibold">Hint {i + 1}: </span>
              <MathText text={h} />
            </li>
          ))}
        </ol>
      )}

      {!finished && (
        <div className="flex flex-wrap gap-3">
          <Button disabled={!answer.trim()} onClick={check}>
            Check
          </Button>
          {hints < problem.hints.length && (
            <Button variant="secondary" onClick={() => setHints(hints + 1)}>
              {hints === 0 ? 'Show a hint' : 'Another hint'}
            </Button>
          )}
          {(checks > 0 || hints > 0) && (
            <Button variant="secondary" onClick={() => setState('shown')}>
              Show me the solution
            </Button>
          )}
        </div>
      )}

      {finished && (
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-4">
          {state === 'shown' && (
            <p className="font-semibold">
              Answer: <MathText text={answerLabel(problem)} />
            </p>
          )}
          <p className="font-semibold">Worked solution</p>
          <MathText as="p" text={problem.solution} className="leading-relaxed" />
        </div>
      )}

      {(finished || lastWrong) && (
        <div className="flex flex-col gap-3">
          {lastWrong && (
            <QuillMath
              key={`mistake-${problem.id}-${lastWrong}`}
              lessonId={lessonId}
              activityKey={activity.key}
              problemId={problem.id}
              mode="mistake"
              answer={lastWrong}
            />
          )}
          {finished && (
            <QuillMath
              key={`explain-${problem.id}`}
              lessonId={lessonId}
              activityKey={activity.key}
              problemId={problem.id}
              mode="explain"
            />
          )}
          {(lastWrong || state === 'shown') && (
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                disabled={logged !== 'idle'}
                onClick={() => void addToLog()}
              >
                {logged === 'done' ? '✓ In your error log' : '📒 Add to my error log'}
              </Button>
            </div>
          )}
          <ErrorMessage message={error} />
        </div>
      )}

      {finished && (
        <Button ref={focusOnMount} className="self-start" onClick={next}>
          {isLast ? 'Finish' : 'Next problem →'}
        </Button>
      )}
    </div>
  );
}
