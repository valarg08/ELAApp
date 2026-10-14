'use client';

import { type LessonActivity, errorFixMatches, errorPositions } from '@storyforge/shared';
import { useId, useRef, useState } from 'react';
import { Button } from '@/components/ui';
import { splitWords } from '@/lib/tokens';
import { focusOnMount } from './focus';
import type { ActivityResult } from './types';

type Activity = Extract<LessonActivity, { type: 'ERROR_HUNT' }>;

/** Wrong taps before the remaining mistakes are outlined. */
const SHOW_WHERE_AFTER = 3;
/** Wrong fixes before the fix can be shown. */
const REVEAL_FIX_AFTER = 2;

/**
 * The error hunt (DESIGN.md §9.12): tap a word that's wrong, then type the fix. Fixed words turn
 * green in the passage. Done when every mistake is fixed.
 */
export function ErrorHunt({
  activity,
  onDone,
}: {
  activity: Activity;
  onDone: (r: ActivityResult) => void;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const positions = errorPositions(activity);
  const parts = splitWords(activity.text);
  // The word number of each part (null for spaces and punctuation).
  let n = -1;
  const wordIndex = parts.map((p) => (p.word ? ++n : null));

  const [fixed, setFixed] = useState<Record<number, string>>({});
  const [picked, setPicked] = useState<number | null>(null);
  const [answer, setAnswer] = useState('');
  const [misses, setMisses] = useState(0);
  const [wrongFixes, setWrongFixes] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [lastExplanation, setLastExplanation] = useState('');
  const total = activity.errors.length;
  const fixedCount = Object.keys(fixed).length;
  const done = fixedCount === total;
  const pickedError = picked === null ? undefined : activity.errors[positions.indexOf(picked)];
  const showWhere = !done && misses >= SHOW_WHERE_AFTER;

  function tap(word: number, text: string) {
    if (fixed[word] !== undefined || done) return;
    const at = positions.indexOf(word);
    if (at === -1) {
      setMisses((m) => m + 1);
      setAttempts((a) => a + 1);
      setPicked(null);
      setMessage({ ok: false, text: `“${text}” is fine. Keep looking!` });
      return;
    }
    setPicked(word);
    setAnswer('');
    setWrongFixes(0);
    setMessage(null);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function accept(word: number, fix: string, explanation: string, prefix: string) {
    setFixed((f) => ({ ...f, [word]: fix }));
    setPicked(null);
    setLastExplanation(explanation);
    setMessage({ ok: true, text: `${prefix} ${explanation}` });
    // The fix form goes away: keep keyboard users in the passage (the last fix focuses Done).
    if (fixedCount + 1 < total) requestAnimationFrame(() => statusRef.current?.focus());
  }

  function checkFix() {
    if (picked === null || !pickedError || !answer.trim()) return;
    setAttempts((a) => a + 1);
    if (errorFixMatches(pickedError.word, answer, pickedError.fixes)) {
      accept(picked, answer.trim(), pickedError.explanation, '✓ Fixed!');
    } else {
      setWrongFixes((w) => w + 1);
      setMessage({ ok: false, text: 'That’s not quite the fix. Try again.' });
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg">{activity.instructions}</p>
      <p
        ref={statusRef}
        tabIndex={-1}
        className="text-sm font-semibold text-muted outline-none"
        aria-live="polite"
      >
        Fixed {fixedCount} of {total} {total === 1 ? 'mistake' : 'mistakes'}
      </p>
      <p className="rounded-xl border border-border bg-card p-4 text-xl leading-loose whitespace-pre-line">
        {parts.map((p, i) => {
          const w = wordIndex[i];
          if (w === null || w === undefined) return <span key={p.index}>{p.text}</span>;
          const fix = fixed[w];
          if (fix !== undefined) {
            return (
              <span key={p.index} className="rounded bg-ok/15 px-0.5 font-semibold text-ok">
                <span className="sr-only">fixed: </span>
                {fix}
              </span>
            );
          }
          return (
            <button
              key={p.index}
              type="button"
              onClick={() => tap(w, p.text)}
              disabled={done}
              aria-pressed={picked === w}
              className={`rounded px-0.5 transition focus-visible:outline-2 focus-visible:outline-brand ${
                picked === w
                  ? 'bg-brand text-white'
                  : showWhere && positions.includes(w)
                    ? 'underline decoration-warn decoration-4 underline-offset-4'
                    : 'hover:bg-border'
              }`}
            >
              {p.text}
            </button>
          );
        })}
      </p>

      {picked !== null && pickedError && (
        <form
          className="flex flex-wrap items-end gap-3 rounded-xl border border-brand/40 bg-background p-4"
          onSubmit={(e) => {
            e.preventDefault();
            checkFix();
          }}
        >
          <div className="flex flex-col gap-1">
            <label htmlFor={`${id}-fix`} className="font-semibold">
              Fix “{pickedError.word}”
            </label>
            <input
              ref={inputRef}
              id={`${id}-fix`}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              className="rounded-xl border-2 border-border bg-card px-4 py-2 text-lg focus-visible:border-brand focus-visible:outline-none"
            />
          </div>
          <Button type="submit" disabled={!answer.trim()}>
            Check
          </Button>
          {wrongFixes >= REVEAL_FIX_AFTER && (
            <Button
              variant="secondary"
              onClick={() =>
                accept(
                  picked,
                  pickedError.fixes[0]!,
                  pickedError.explanation,
                  `The fix is “${pickedError.fixes[0]}”.`,
                )
              }
            >
              Show me the fix
            </Button>
          )}
        </form>
      )}

      <div aria-live="polite">
        {done ? (
          <p className="rounded-xl border border-ok bg-card px-4 py-3">
            <strong className="text-ok">✓ You fixed every mistake!</strong> {lastExplanation}
          </p>
        ) : message ? (
          <p
            className={`rounded-xl border bg-card px-4 py-3 ${message.ok ? 'border-ok' : 'border-warn'}`}
          >
            {message.text}
            {showWhere && !message.ok && ' The mistakes left are underlined.'}
          </p>
        ) : null}
      </div>

      {done && (
        <Button
          ref={focusOnMount}
          className="self-start"
          onClick={() => onDone({ correct: true, attempts: Math.max(attempts, total) })}
        >
          Done
        </Button>
      )}
    </div>
  );
}
