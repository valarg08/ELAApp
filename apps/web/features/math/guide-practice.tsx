'use client';

import {
  approx,
  checkAnswer,
  contentValue,
  readAnswer,
  type AnswerCheck,
} from '@storyforge/math-check';
import { useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { AnswerBox } from './answer-box';
import { focusAnswer } from './focus';
import { ProblemFigure } from './guide-figure';
import type { GuideProblem } from './guide-problem';

/** Problems 1–8, 9–17 and 18–25: the guide's problems run from simple to complex. */
const level = (i: number) => (i < 8 ? 'Warm-up' : i < 17 ? 'Core' : 'Challenge');

// Solved problems and the chosen level, kept in this browser only (the page still works when storage is blocked).
const listeners = new Set<() => void>();
const memory = new Map<string, string>();

function readStored(key: string, fallback: string): string {
  if (memory.has(key)) return memory.get(key)!;
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function writeStored(key: string, value: string) {
  memory.set(key, value);
  try {
    localStorage.setItem(key, value);
  } catch {
    // Kept in memory for this page.
  }
  for (const l of listeners) l();
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/** A value kept in this browser (the server render uses `fallback`). */
function useStored(key: string, fallback: string): string {
  return useSyncExternalStore(
    subscribe,
    () => readStored(key, fallback),
    () => fallback,
  );
}

/** One level's problems; `storageKey` keeps its solved problems apart from the other level's. */
export type GuideLevel = {
  id: string;
  label: string;
  storageKey: string;
  /** A line about the level, under its intro. */
  note?: string;
  problems: GuideProblem[];
};

/**
 * A study-guide sub-module's problems (psat-design.md), at one or more levels (Middle school,
 * PSAT) picked with tabs: typed answers checked in the browser with math-check; a wrong answer
 * shows the worked steps. Solved problems and the chosen level are kept in this browser only.
 */
export function GuidePractice({ levels }: { levels: GuideLevel[] }) {
  const stored = useStored('guide:level', levels[0]?.id ?? '');
  const current = levels.find((l) => l.id === stored) ?? levels[0];
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  if (!current) return null;
  if (levels.length === 1)
    return (
      <section id="problems" aria-labelledby="problems-h" className="flex flex-col gap-4">
        <ProblemSet storageKey={current.storageKey} problems={current.problems} idPrefix="" />
      </section>
    );

  function pick(i: number) {
    const l = levels[(i + levels.length) % levels.length]!;
    writeStored('guide:level', l.id);
    tabs.current[(i + levels.length) % levels.length]?.focus();
  }

  return (
    <section id="problems" aria-labelledby="problems-h" className="flex flex-col gap-4">
      <h2 id="problems-h" className="text-2xl font-semibold">
        Practice problems
      </h2>
      <div role="tablist" aria-label="Level" className="flex flex-wrap gap-2">
        {levels.map((l, i) => {
          const on = l.id === current.id;
          return (
            <button
              key={l.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`level-${l.id}`}
              aria-selected={on}
              aria-controls={`panel-${l.id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => pick(i)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') pick(i + 1);
                if (e.key === 'ArrowLeft') pick(i - 1);
              }}
              className={`min-h-11 rounded-xl border-2 px-4 font-semibold focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand ${on ? 'border-brand bg-brand text-white' : 'border-border hover:border-brand'}`}
            >
              {l.label}
            </button>
          );
        })}
      </div>
      {levels.map((l) => (
        <div
          key={l.id}
          role="tabpanel"
          id={`panel-${l.id}`}
          aria-labelledby={`level-${l.id}`}
          hidden={l.id !== current.id}
          className="flex flex-col gap-4"
        >
          <ProblemSet
            storageKey={l.storageKey}
            problems={l.problems}
            idPrefix={`${l.id}-`}
            label={l.label}
            note={l.note}
          />
        </div>
      ))}
    </section>
  );
}

/** One level's problems with its solved count. */
function ProblemSet({
  storageKey,
  problems,
  idPrefix,
  label,
  note,
}: {
  storageKey: string;
  problems: GuideProblem[];
  idPrefix: string;
  label?: string;
  note?: string;
}) {
  const raw = useStored(storageKey, '[]');
  const solved = useMemo(() => {
    try {
      const v = JSON.parse(raw) as unknown;
      return Array.isArray(v) ? v.filter((n): n is number => typeof n === 'number') : [];
    } catch {
      return [];
    }
  }, [raw]);

  const markSolved = (i: number) => {
    if (!solved.includes(i)) writeStored(storageKey, JSON.stringify([...solved, i]));
  };
  const reset = () => writeStored(storageKey, '[]');
  const list = useRef<HTMLOListElement>(null);
  // A right answer moves the keyboard on to the next problem's answer box.
  const solvedAt = (i: number) => {
    markSolved(i);
    requestAnimationFrame(() => focusAnswer(list.current?.children[i + 1]));
  };
  // With level tabs the section heading is "Practice problems"; each level gets an h3.
  const Heading = label ? 'h3' : 'h2';

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Heading
          id={label ? undefined : 'problems-h'}
          className={label ? 'text-xl font-semibold' : 'text-2xl font-semibold'}
        >
          {label ? `${label}: ` : ''}
          {problems.length} problems
        </Heading>
        <p className="font-semibold" aria-live="polite">
          {solved.length} of {problems.length} solved
        </p>
      </div>
      <p className="text-muted">
        From simple to complex: warm-up (1–8), core (9–17), challenge (18–25). Type your answer and
        press Check; if it is wrong you will see how to solve it, step by step.
      </p>
      {note && <p className="text-muted">{note}</p>}
      <ol ref={list} className="flex flex-col gap-4">
        {problems.map((pr, i) => (
          <ProblemCard
            key={pr.q}
            n={i + 1}
            idPrefix={idPrefix}
            problem={pr}
            solved={solved.includes(i)}
            onSolved={() => solvedAt(i)}
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
    </>
  );
}

function ProblemCard({
  n,
  idPrefix,
  problem,
  solved,
  onSolved,
}: {
  n: number;
  idPrefix: string;
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

  const headingId = `${idPrefix}problem-${n}`;
  return (
    <li className={`rounded-2xl border p-4 ${solved ? 'border-ok' : 'border-border'}`}>
      <p id={headingId} className="text-sm font-semibold text-muted">
        Problem {n} · {level(n - 1)}
        {problem.std && <span> · B.E.S.T. {problem.std}</span>}
        {solved && <span className="text-ok"> · ✓ solved</span>}
      </p>
      <p className="mt-1 text-lg">{problem.q}</p>
      {problem.fig && <ProblemFigure fig={problem.fig} />}
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
