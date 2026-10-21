'use client';

import {
  ErrorLogEntry,
  type LessonActivity,
  MathNudgeResponse,
  type MathProblem,
  type MathVariant,
  type PracticeAnswer,
  PracticeAnswersResponse,
  type ProblemLocator,
  SimilarProblemResponse,
  answerLabel,
  markAnswer,
  newSeed,
  problemVariant,
  publicProblem,
} from '@storyforge/shared';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Button, ErrorMessage } from '@/components/ui';
import { MathText } from '@/components/math-text';
import { MATH_COPY, clock } from '@/features/math/copy';
import { Scratchpad, useElapsed, useStopwatchSetting } from '@/features/math/practice-tools';
import { ProblemView } from '@/features/math/problem-view';
import { QuillMath } from '@/features/math/quill-math';
import { ApiError, apiJson } from '@/lib/api-client';
import { focusOnMount } from './focus';
import type { ActivityResult } from './types';

type Activity = Extract<LessonActivity, { type: 'PROBLEMS' }>;

type State = 'trying' | 'solved' | 'shown';

/** One problem on screen: a lesson problem or a "similar one" (an extra that doesn't count). */
type Item = {
  locator: Required<Pick<ProblemLocator, 'lessonId'>> & ProblemLocator;
  problem: MathVariant;
  extra: boolean;
};

const itemFor = (lessonId: string, activityKey: string, p: MathProblem, extra: boolean): Item => {
  const problem = problemVariant(p, p.template ? newSeed() : undefined);
  return {
    locator: { lessonId, activityKey, problemId: p.id, seed: problem.seed },
    problem,
    extra,
  };
};

/** Nothing to subscribe to: `mounted` is false on the server and during hydration only. */
const noSubscribe = () => () => {};

/** Answer rows are sent in small batches (math-design.md §3.2 B1). */
const BATCH = 5;

/**
 * Math practice (math-design.md §2, §3): one problem at a time, checked in the browser with
 * math-check. A template problem shows a fresh variant each time. Hints open one at a time, Quill
 * can nudge after a wrong try, and "Show me" reveals the worked solution. A wrong answer the problem
 * expected gets its note. "Try a similar one" gives another variant (or another problem of the same
 * skill). Every finished problem goes to the answer record.
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
  const mounted = useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  );
  const [item, setItem] = useState<Item>(() =>
    itemFor(lessonId, activity.key, activity.problems[0]!, false),
  );
  const [answer, setAnswer] = useState('');
  const [message, setMessage] = useState<{ text: string; good: boolean } | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [hints, setHints] = useState(0);
  const [nudges, setNudges] = useState<string[]>([]);
  const [nudgeBusy, setNudgeBusy] = useState(false);
  const [state, setState] = useState<State>('trying');
  const [lastWrong, setLastWrong] = useState<string | null>(null);
  const [checks, setChecks] = useState(0);
  const [logged, setLogged] = useState<'idle' | 'busy' | 'done'>('idle');
  const [similarBusy, setSimilarBusy] = useState(false);
  const [similarNone, setSimilarNone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [timerOn, setTimerOn] = useStopwatchSetting();
  const first = useRef<{ answer: string; hints: number } | null>(null);
  const pending = useRef<PracticeAnswer[]>([]);
  const finished = state !== 'trying';
  const elapsed = useElapsed(startedAt, timerOn && !finished);
  const { problem, locator } = item;
  const isLast = index === activity.problems.length - 1;

  const flush = useCallback(() => {
    const answers = pending.current.splice(0);
    if (answers.length === 0) return;
    // The record helps mastery and review; a failed send never blocks practice.
    void apiJson('/math/answers', PracticeAnswersResponse, 'POST', { answers }).catch(() => {});
  }, []);

  // Send what is left when the student leaves the activity.
  useEffect(() => flush, [flush]);

  function record(revealed: boolean) {
    pending.current.push({
      lessonId: locator.lessonId,
      activityKey: locator.activityKey,
      problemId: locator.problemId,
      seed: locator.seed,
      firstAnswer: first.current?.answer ?? '',
      hintsUsed: Math.min(3, first.current?.hints ?? hints),
      revealed,
      seconds: Math.min(7200, Math.round((Date.now() - startedAt) / 1000)),
    });
    if (pending.current.length >= BATCH) flush();
  }

  function check() {
    if (state !== 'trying' || !answer.trim()) return;
    const mark = markAnswer(problem, answer);
    if (mark.readable && mark.verdict !== 'form') {
      setChecks((n) => n + 1);
      first.current ??= { answer: answer.trim(), hints };
    }
    if (mark.verdict === 'correct') {
      setState('solved');
      setNote(null);
      setMessage({ text: MATH_COPY.correct, good: true });
      record(false);
    } else if (mark.verdict === 'form') {
      setMessage({ text: mark.message, good: false });
    } else {
      if (mark.readable) setLastWrong(answer.trim());
      setNote(mark.note);
      setMessage({
        text: mark.readable
          ? `${MATH_COPY.notQuite} ${hints < problem.hints.length ? MATH_COPY.tryHint : MATH_COPY.seeSolution}`
          : mark.message,
        good: false,
      });
    }
  }

  function reveal() {
    setState('shown');
    record(true);
  }

  async function nudge() {
    if (!lastWrong) return;
    setNudgeBusy(true);
    setError(null);
    try {
      const r = await apiJson('/ai/math/nudge', MathNudgeResponse, 'POST', {
        ...locator,
        answer: lastWrong,
        attempt: nudges.length,
      });
      if (r.question) setNudges((n) => [...n, r.question!]);
      else if (hints < problem.hints.length) setHints(hints + 1);
      else setError('No more nudges for this one: check your working, or see the solution.');
    } catch (e) {
      // Quill unavailable: the next authored hint does the same job.
      if (hints < problem.hints.length) setHints(hints + 1);
      else setError(e instanceof ApiError ? e.userMessage : 'Quill is busy right now.');
    } finally {
      setNudgeBusy(false);
    }
  }

  async function addToLog() {
    setLogged('busy');
    setError(null);
    try {
      await apiJson('/math/error-log', ErrorLogEntry, 'POST', locator);
      setLogged('done');
    } catch (e) {
      setLogged('idle');
      setError(e instanceof ApiError ? e.userMessage : 'Could not add it. Try again.');
    }
  }

  function show(fresh: Item) {
    setItem(fresh);
    setAnswer('');
    setMessage(null);
    setNote(null);
    setHints(0);
    setNudges([]);
    setState('trying');
    setLastWrong(null);
    setLogged('idle');
    setSimilarNone(false);
    setError(null);
    setStartedAt(Date.now());
    first.current = null;
  }

  async function similar() {
    const base = activity.problems.find((p) => p.id === locator.problemId);
    if (base?.template && locator.activityKey === activity.key) {
      show(itemFor(lessonId, activity.key, base, true));
      return;
    }
    setSimilarBusy(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        lessonId: locator.lessonId,
        activityKey: locator.activityKey,
        problemId: locator.problemId,
      });
      const r = await apiJson(`/math/similar?${params}`, SimilarProblemResponse);
      if (r.problem && r.locator?.lessonId)
        show(itemFor(r.locator.lessonId, r.locator.activityKey, r.problem, true));
      else setSimilarNone(true);
    } catch (e) {
      setError(e instanceof ApiError ? e.userMessage : 'Could not find one. Try again.');
    } finally {
      setSimilarBusy(false);
    }
  }

  function next() {
    if (isLast) {
      flush();
      onDone({ correct: true, attempts: Math.max(checks, activity.problems.length) });
      return;
    }
    setIndex(index + 1);
    show(itemFor(lessonId, activity.key, activity.problems[index + 1]!, false));
  }

  const key = `${locator.activityKey}/${locator.problemId}/${locator.seed ?? ''}`;
  return (
    <div className="flex flex-col gap-5">
      {index === 0 && !item.extra && (
        <MathText as="p" className="text-muted" text={activity.instructions} />
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-muted" aria-live="polite">
          {item.extra ? 'A similar problem' : `Problem ${index + 1} of ${activity.problems.length}`}
          {problem.difficulty >= 3 && ' · challenge'}
        </p>
        <div className="flex items-center gap-3 text-sm">
          {timerOn && (
            <span
              className="font-mono tabular-nums"
              aria-label={`Time on this problem ${clock(elapsed)}`}
            >
              {clock(elapsed)}
            </span>
          )}
          <label className="flex min-h-11 cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={timerOn}
              onChange={(e) => setTimerOn(e.target.checked)}
              className="h-5 w-5 accent-brand"
            />
            Stopwatch
          </label>
        </div>
      </div>
      {/* A template's numbers are picked in the browser, so the problem shows after hydration. */}
      {mounted ? (
        <ProblemView
          key={key}
          problem={publicProblem(problem)}
          answer={answer}
          onAnswer={(v) => {
            setAnswer(v);
            if (!finished) setMessage(null);
          }}
          onSubmit={check}
          disabled={finished}
        />
      ) : (
        <p className="text-muted">Loading the problem…</p>
      )}
      {message && (
        <output className={`block font-semibold ${message.good ? 'text-ok' : 'text-warn'}`}>
          {message.text}
        </output>
      )}
      {note && !finished && (
        <p className="rounded-xl border border-warn/40 bg-background p-3">
          <MathText text={note} />
        </p>
      )}

      {(hints > 0 || nudges.length > 0) && (
        <ol className="flex flex-col gap-2" aria-label="Hints">
          {problem.hints.slice(0, hints).map((h, i) => (
            <li key={`h${i}`} className="rounded-xl border border-border bg-background p-3">
              <span className="font-semibold">Hint {i + 1}: </span>
              <MathText text={h} />
            </li>
          ))}
          {nudges.map((q, i) => (
            <li key={`n${i}`} className="rounded-xl border border-brand/40 bg-background p-3">
              <span className="font-semibold">
                <span aria-hidden="true">🦉 </span>Quill asks:{' '}
              </span>
              <MathText text={q} />
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
          {lastWrong && nudges.length < 3 && (
            <Button variant="secondary" disabled={nudgeBusy} onClick={() => void nudge()}>
              {nudgeBusy ? 'Quill is thinking…' : MATH_COPY.nudge}
            </Button>
          )}
          {(checks > 0 || hints > 0) && (
            <Button variant="secondary" onClick={reveal}>
              Show me the solution
            </Button>
          )}
        </div>
      )}

      {!finished && <Scratchpad key={`pad-${key}`} />}

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
              key={`mistake-${key}-${lastWrong}`}
              locator={locator}
              mode="mistake"
              answer={lastWrong}
            />
          )}
          {finished && <QuillMath key={`explain-${key}`} locator={locator} mode="explain" />}
          {(lastWrong || state === 'shown') && (
            <Button
              variant="secondary"
              className="self-start"
              disabled={logged !== 'idle'}
              onClick={() => void addToLog()}
            >
              {logged === 'done' ? `✓ ${MATH_COPY.inLog}` : MATH_COPY.addToLog}
            </Button>
          )}
          <ErrorMessage message={error} />
        </div>
      )}

      {finished && (
        <div className="flex flex-wrap items-center gap-3">
          <Button ref={focusOnMount} onClick={next}>
            {isLast ? 'Finish' : 'Next problem →'}
          </Button>
          {!similarNone && (
            <Button variant="secondary" disabled={similarBusy} onClick={() => void similar()}>
              {similarBusy ? 'Finding one…' : MATH_COPY.similar}
            </Button>
          )}
          {similarNone && <p className="text-sm text-muted">{MATH_COPY.noSimilar}</p>}
        </div>
      )}
    </div>
  );
}
