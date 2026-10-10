'use client';

import {
  type WritingConstraints,
  checkConstraints,
  describeProblem,
  findBannedWords,
} from '@storyforge/shared';
import { useEffect, useState } from 'react';
import { ProgressBar } from '@/components/progress-bar';

/** Live view of the challenge rules (DESIGN.md §6.3), using the same checks as the server. */
export function ConstraintsBar({
  text,
  constraints,
  started,
}: {
  text: string;
  constraints: WritingConstraints;
  /** The timer starts at the first keystroke. */
  started: boolean;
}) {
  const { wordCount, problems } = checkConstraints(text, constraints);
  const target = constraints.exactWords ?? constraints.minWords ?? constraints.maxWords;
  const goal =
    constraints.exactWords !== undefined
      ? `exactly ${constraints.exactWords}`
      : [
          constraints.minWords && `at least ${constraints.minWords}`,
          constraints.maxWords && `at most ${constraints.maxWords}`,
        ]
          .filter(Boolean)
          .join(', ');
  const used = new Set(findBannedWords(text, constraints.bannedWords));
  const missing = new Set(problems.flatMap((p) => (p.rule === 'requiredWords' ? p.missing : [])));

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <p className="font-semibold" data-testid="word-count">
          {wordCount} {wordCount === 1 ? 'word' : 'words'}
          {goal && <span className="font-normal text-muted"> · goal: {goal}</span>}
        </p>
        {constraints.timeLimitMin !== undefined && (
          <Countdown minutes={constraints.timeLimitMin} running={started} />
        )}
      </div>
      {target !== undefined && (
        <ProgressBar value={Math.min(wordCount, target)} max={target} label="Word goal" />
      )}

      {constraints.bannedWords.length > 0 && (
        <WordRule
          label="Avoid"
          words={constraints.bannedWords}
          isProblem={(w) => used.has(w)}
          problemText="used"
        />
      )}
      {constraints.requiredWords.length > 0 && (
        <WordRule
          label="Use"
          words={constraints.requiredWords}
          isProblem={(w) => missing.has(w)}
          problemText="not yet"
        />
      )}

      <div id="rules-status" aria-live="polite">
        {text.trim().length > 0 && problems.length > 0 && (
          <ul className="list-disc space-y-1 pl-5 text-warn">
            {problems.map((p) => (
              <li key={p.rule}>{describeProblem(p)}</li>
            ))}
          </ul>
        )}
        {text.trim().length > 0 && problems.length === 0 && (
          <p className="font-semibold text-ok">✓ Ready to submit!</p>
        )}
      </div>
    </div>
  );
}

function WordRule({
  label,
  words,
  isProblem,
  problemText,
}: {
  label: string;
  words: string[];
  isProblem: (word: string) => boolean;
  problemText: string;
}) {
  return (
    <p className="flex flex-wrap items-center gap-2 text-sm">
      <span className="font-semibold">{label}:</span>
      {words.map((w) => {
        const bad = isProblem(w);
        return (
          <span
            key={w}
            className={`rounded-full border px-2.5 py-0.5 ${
              bad ? 'border-warn font-semibold text-warn' : 'border-border text-muted'
            }`}
          >
            <span aria-hidden="true">{bad ? '⚠ ' : '✓ '}</span>
            {w}
            {bad && <span className="sr-only"> ({problemText})</span>}
          </span>
        );
      })}
    </p>
  );
}

function Countdown({ minutes, running }: { minutes: number; running: boolean }) {
  const [left, setLeft] = useState(minutes * 60);
  useEffect(() => {
    if (!running) return undefined;
    const timer = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [running]);
  const mm = Math.floor(left / 60);
  const ss = String(left % 60).padStart(2, '0');
  return (
    <p role="timer" aria-label="Time left" className={left === 0 ? 'font-semibold text-warn' : ''}>
      ⏱ {left === 0 ? 'Time’s up! Finish your sentence.' : `${mm}:${ss} left`}
    </p>
  );
}
