'use client';

import {
  approx,
  checkAnswer,
  contentValue,
  readAnswer,
  type AnswerCheck,
} from '@storyforge/math-check';
import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';
import { AnswerBox } from './answer-box';
import type { GuideProblem } from './guide-problem';

/** Problems 1–8, 9–17 and 18–25: the guide's problems run from simple to complex. */
const level = (i: number) => (i < 8 ? 'Warm-up' : i < 17 ? 'Core' : 'Challenge');

// Solved problems, kept in this browser only (the page still works when storage is blocked).
const listeners = new Set<() => void>();
const memory = new Map<string, string>();

function readSolved(key: string): string {
  if (memory.has(key)) return memory.get(key)!;
  try {
    return localStorage.getItem(key) ?? '[]';
  } catch {
    return '[]';
  }
}

function writeSolved(key: string, value: string) {
  memory.set(key, value);
  try {
    localStorage.setItem(key, value);
  } catch {
    // Kept in memory for this page.
  }
  for (const l of listeners) l();
}

/**
 * A study-guide sub-module's problems (psat-design.md): typed answers checked in the browser with
 * math-check; a wrong answer shows the worked steps. Which problems are solved is kept in this
 * browser only (a per-viewer convenience).
 */
export function GuidePractice({
  storageKey,
  problems,
}: {
  storageKey: string;
  problems: GuideProblem[];
}) {
  const subscribe = useCallback((listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);
  const raw = useSyncExternalStore(
    subscribe,
    () => readSolved(storageKey),
    () => '[]',
  );
  const solved = useMemo(() => {
    try {
      const v = JSON.parse(raw) as unknown;
      return Array.isArray(v) ? v.filter((n): n is number => typeof n === 'number') : [];
    } catch {
      return [];
    }
  }, [raw]);

  const markSolved = (i: number) => {
    if (!solved.includes(i)) writeSolved(storageKey, JSON.stringify([...solved, i]));
  };
  const reset = () => writeSolved(storageKey, '[]');

  return (
    <section id="problems" aria-labelledby="problems-h" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="problems-h" className="text-2xl font-semibold">
          {problems.length} problems
        </h2>
        <p className="font-semibold" aria-live="polite">
          {solved.length} of {problems.length} solved
        </p>
      </div>
      <p className="text-muted">
        From simple to complex: warm-up (1–8), core (9–17), challenge (18–25). Type your answer and
        press Check; if it is wrong you will see how to solve it, step by step.
      </p>
      <ol className="flex flex-col gap-4">
        {problems.map((pr, i) => (
          <ProblemCard
            key={pr.q}
            n={i + 1}
            problem={pr}
            solved={solved.includes(i)}
            onSolved={() => markSolved(i)}
          />
        ))}
      </ol>
      {solved.length > 0 && (
        <button
          type="button"
          onClick={reset}
          className="min-h-11 self-start rounded-xl border border-border px-4 hover:border-brand focus-visible:outline-3 focus-visible:outline-brand"
        >
          Start these problems again
        </button>
      )}
    </section>
  );
}

function ProblemCard({
  n,
  problem,
  solved,
  onSolved,
}: {
  n: number;
  problem: GuideProblem;
  solved: boolean;
  onSolved: () => void;
}) {
  const [value, setValue] = useState('');
  const [result, setResult] = useState<AnswerCheck | null>(null);
  const [showSteps, setShowSteps] = useState(false);

  function check() {
    let r = checkAnswer(value, [problem.a], problem.form);
    // A rounded decimal for an exact answer (12π, 3√5): close, but we want the exact form.
    if (r.status === 'wrong' && /pi|sqrt/.test(problem.a)) {
      const read = readAnswer(value);
      const exact = approx(contentValue(problem.a));
      if (read.ok && Math.abs(approx(read.value) - exact) <= 0.01 * Math.max(1, Math.abs(exact)))
        r = {
          status: 'form',
          message: `Close! That rounds the exact answer — write it exactly, using ${problem.a.includes('pi') ? 'π' : '√'}.`,
        };
    }
    setResult(r);
    if (r.status === 'correct') onSolved();
    if (r.status === 'wrong') setShowSteps(true);
  }

  const headingId = `problem-${n}`;
  return (
    <li className={`rounded-2xl border p-4 ${solved ? 'border-ok' : 'border-border'}`}>
      <p id={headingId} className="text-sm font-semibold text-muted">
        Problem {n} · {level(n - 1)}
        {solved && <span className="text-ok"> · ✓ solved</span>}
      </p>
      <p className="mt-1 text-lg">{problem.q}</p>
      <div className="mt-3 flex flex-wrap items-end gap-3">
        <AnswerBox
          value={value}
          onChange={setValue}
          onSubmit={check}
          form={problem.form}
          label={`Answer to problem ${n}`}
        />
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={check}
          className="min-h-11 rounded-xl bg-brand px-5 font-semibold text-white hover:opacity-90 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          Check
        </button>
        {!showSteps && (
          <button
            type="button"
            onClick={() => setShowSteps(true)}
            className="min-h-11 rounded-xl border border-border px-4 hover:border-brand focus-visible:outline-3 focus-visible:outline-brand"
          >
            Show the steps
          </button>
        )}
      </div>
      <div aria-live="polite" className="mt-2">
        {result && (
          <p
            className={`font-semibold ${result.status === 'correct' ? 'text-ok' : result.status === 'wrong' ? 'text-bad' : 'text-warn'}`}
          >
            {result.status === 'correct' ? '✓ ' : result.status === 'wrong' ? '✗ ' : ''}
            {result.status === 'wrong'
              ? 'Not quite. Here is how to solve it — then try again.'
              : result.message}
          </p>
        )}
        {showSteps && (
          <div className="mt-2 rounded-xl bg-brand/5 p-3">
            <p className="font-semibold">Steps</p>
            <ol className="mt-1 ml-5 flex list-decimal flex-col gap-1">
              {problem.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </li>
  );
}
