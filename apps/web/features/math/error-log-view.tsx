'use client';

import {
  type ErrorLogEntry,
  type ErrorLogList,
  REDOS_TO_RESOLVE,
  RedoResponse,
} from '@storyforge/shared';
import { useState } from 'react';
import { Button, ErrorMessage } from '@/components/ui';
import { MathText } from '@/components/math-text';
import { ApiError, apiJson } from '@/lib/api-client';
import { ProblemView } from './problem-view';

/** "Math Unit 3: Lesson title", or the test's title for a test problem. */
const where = (e: ErrorLogEntry) =>
  e.unitNumber > 0 ? `Math Unit ${e.unitNumber}: ${e.lessonTitle}` : e.lessonTitle;

/** The error log's open problems (each can be redone) and the resolved ones. */
export function ErrorLogView({ initial }: { initial: ErrorLogList }) {
  const [open, setOpen] = useState(initial.open);
  const [resolved, setResolved] = useState(initial.resolved);

  function update(entry: ErrorLogEntry) {
    if (entry.resolvedAt) {
      setResolved((r) => [entry, ...r.filter((e) => e.id !== entry.id)]);
    }
    setOpen((o) => o.map((e) => (e.id === entry.id ? entry : e)));
  }

  const skills = [...new Set(open.filter((e) => !e.resolvedAt).map((e) => e.skill))];
  return (
    <div className="flex flex-col gap-8">
      <section aria-labelledby="to-redo" className="flex flex-col gap-4">
        <h2 id="to-redo" className="text-2xl font-semibold">
          To redo ({open.filter((e) => !e.resolvedAt).length})
        </h2>
        {skills.length > 0 && (
          <p className="text-muted">
            Skills to work on: <strong className="text-foreground">{skills.join(', ')}</strong>
          </p>
        )}
        {open.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-6 text-muted">
            Nothing to redo. Problems you miss in a problem set land here, and you can add any
            practice problem with “Add to my error log”.
          </p>
        ) : (
          <ol className="flex flex-col gap-4">
            {open.map((e) => (
              <li key={e.id}>
                <Redo entry={e} onUpdate={update} />
              </li>
            ))}
          </ol>
        )}
      </section>

      {resolved.length > 0 && (
        <section aria-labelledby="resolved">
          <details className="rounded-2xl border border-border bg-card p-4">
            <summary className="cursor-pointer text-xl font-semibold" id="resolved">
              ✓ Resolved ({resolved.length})
            </summary>
            <ul className="mt-3 flex flex-col gap-2">
              {resolved.map((e) => (
                <li key={e.id} className="text-sm">
                  <strong>{e.skill}</strong> · {where(e)}
                </li>
              ))}
            </ul>
          </details>
        </section>
      )}
    </div>
  );
}

function Redo({ entry, onUpdate }: { entry: ErrorLogEntry; onUpdate: (e: ErrorLogEntry) => void }) {
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<RedoResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const done = !!entry.resolvedAt;

  async function check() {
    if (!answer.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const r = await apiJson(
        `/math/error-log/${encodeURIComponent(entry.id)}/redo`,
        RedoResponse,
        'POST',
        { answer },
      );
      setResult(r);
      // A template problem comes back with new numbers for the next redo.
      if (r.entry.problem.seed !== entry.problem.seed) setAnswer('');
      onUpdate(r.entry);
    } catch (e) {
      setError(e instanceof ApiError ? e.userMessage : 'Could not check it. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <article
      aria-label={`${entry.skill}: problem from ${entry.lessonTitle}`}
      className={`flex flex-col gap-4 rounded-2xl border bg-card p-5 ${done ? 'border-ok' : 'border-border'}`}
    >
      <p className="flex flex-wrap justify-between gap-2 text-sm text-muted">
        <span>
          <strong className="text-foreground">{entry.skill}</strong> · {where(entry)}
        </span>
        <span>
          {done
            ? '✓ Resolved'
            : `Right redos: ${entry.correctRedos} of ${REDOS_TO_RESOLVE} · missed ${entry.wrongTimes}×`}
        </span>
      </p>
      {entry.missed && (
        <details className="rounded-xl bg-background p-3">
          <summary className="cursor-pointer font-semibold">The one you missed</summary>
          <div className="mt-3">
            <ProblemView problem={entry.missed} answer="" onAnswer={() => {}} disabled />
          </div>
        </details>
      )}
      {entry.missed && !done && (
        <p className="text-sm text-muted">This redo has new numbers: same idea, fresh problem.</p>
      )}
      <ProblemView
        key={entry.problem.seed ?? entry.problem.id}
        problem={entry.problem}
        answer={answer}
        onAnswer={(v) => {
          setAnswer(v);
          setResult(null);
        }}
        onSubmit={() => void check()}
        disabled={done}
      />
      {!done && (
        <Button
          className="self-start"
          disabled={busy || !answer.trim()}
          onClick={() => void check()}
        >
          {busy ? 'Checking…' : 'Check my redo'}
        </Button>
      )}
      {result && (
        <output className="flex flex-col gap-2">
          <p className={`font-semibold ${result.verdict === 'correct' ? 'text-ok' : 'text-warn'}`}>
            {result.message}
          </p>
          {result.note && (
            <p className="rounded-xl border border-warn/40 bg-background p-3">
              <MathText text={result.note} />
            </p>
          )}
          {result.solution && (
            <details className="rounded-xl bg-background p-3">
              <summary className="cursor-pointer font-semibold">
                {result.rightAnswer ? 'Answer and worked solution' : 'Worked solution'}
              </summary>
              {result.rightAnswer && (
                <p className="mt-2">
                  Answer: <MathText text={result.rightAnswer} />
                </p>
              )}
              <MathText as="p" text={result.solution} className="mt-2 leading-relaxed" />
            </details>
          )}
        </output>
      )}
      <ErrorMessage message={error} />
    </article>
  );
}
