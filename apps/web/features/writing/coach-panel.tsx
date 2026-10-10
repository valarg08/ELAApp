'use client';

import type { WritingActivity } from '@storyforge/shared';
import {
  type CoachCard,
  type CoachReport,
  SENSES,
  type Sense,
  type Span,
  buildCoachReport,
} from '@storyforge/writing-analysis';
import { useState } from 'react';
import { Button } from '@/components/ui';
import { AskQuill } from './ask-quill';

const SENSE_ICONS: Record<Sense, string> = {
  sight: '👁',
  sound: '👂',
  smell: '👃',
  taste: '👅',
  touch: '✋',
};

/**
 * Coach panel (DESIGN.md §6.3): instant, rule-based feedback from packages/writing-analysis.
 * AI checks (Ask Quill) sit below. Runs on demand ("Check my writing") so it never distracts mid-sentence.
 */
export function CoachPanel({
  text,
  activity,
  activityId,
  onShow,
}: {
  text: string;
  activityId: string;
  activity: WritingActivity;
  /** Select the words a card points at in the editor. */
  onShow: (span: Span) => void;
}) {
  const [checked, setChecked] = useState<{ text: string; report: CoachReport } | null>(null);
  const stale = checked !== null && checked.text !== text;

  function check() {
    setChecked({
      text,
      report: buildCoachReport(text, {
        analyzers: activity.analyzers,
        povLock: activity.constraints.povLock,
        tenseLock: activity.constraints.tenseLock,
      }),
    });
  }

  /** "Show me" only works while the words are still where they were. */
  const canShow = (span: Span | undefined): span is Span =>
    !!span && text.slice(span.start, span.end) === span.text;

  return (
    <section aria-labelledby="coach-title" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="coach-title" className="text-xl font-bold">
          <span aria-hidden="true">🦉 </span>Quill, your coach
        </h2>
        <Button variant={checked ? 'secondary' : 'primary'} onClick={check}>
          {checked ? 'Check again' : 'Check my writing'}
        </Button>
      </div>

      {!checked && (
        <p className="text-muted">
          When you’re ready, press “Check my writing” for tips on what’s working and what to try
          next.
        </p>
      )}

      <div aria-live="polite" className="flex flex-col gap-4">
        {checked && (
          <>
            {stale && (
              <p className="text-sm text-muted">
                You’ve changed your writing since this check. Press “Check again” to update it.
              </p>
            )}
            {checked.report.strengths.length > 0 && (
              <CardList
                title="🌟 What’s working"
                cards={checked.report.strengths}
                canShow={canShow}
                onShow={onShow}
              />
            )}
            {checked.report.nextSteps.length > 0 ? (
              <CardList
                title="💡 Try next"
                cards={checked.report.nextSteps}
                numbered
                canShow={canShow}
                onShow={onShow}
              />
            ) : (
              <p className="font-semibold text-ok">
                Quill has no tips right now. Read it aloud once more, then submit!
              </p>
            )}
            {checked.report.senses && <SensesMeter counts={checked.report.senses} />}
          </>
        )}
      </div>

      <AskQuill activityId={activityId} activity={activity} text={text} onShow={onShow} />
    </section>
  );
}

function CardList({
  title,
  cards,
  numbered = false,
  canShow,
  onShow,
}: {
  title: string;
  cards: CoachCard[];
  numbered?: boolean;
  canShow: (span: Span | undefined) => span is Span;
  onShow: (span: Span) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-semibold">{title}</h3>
      <ul className="flex flex-col gap-2">
        {cards.map((card, i) => (
          <li key={card.id} className="rounded-xl border border-border bg-background p-3">
            <p className="font-semibold">
              {numbered && (
                <span className="text-muted">
                  {i + 1}/{cards.length}{' '}
                </span>
              )}
              {card.title}
            </p>
            <p className="mt-1">{card.message}</p>
            {canShow(card.span) && (
              <button
                type="button"
                onClick={() => card.span && onShow(card.span)}
                className="mt-2 text-sm font-semibold text-brand underline focus-visible:outline-3 focus-visible:outline-brand"
              >
                Show me in my writing
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SensesMeter({ counts }: { counts: Record<Sense, number> }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-semibold">Senses you used</h3>
      <ul className="flex flex-wrap gap-2">
        {SENSES.map((s) => (
          <li
            key={s}
            className={`rounded-full border px-3 py-1 text-sm ${
              counts[s] > 0 ? 'border-ok text-ok' : 'border-border text-muted'
            }`}
          >
            <span aria-hidden="true">{SENSE_ICONS[s]} </span>
            {s} {counts[s] > 0 ? `✓ ${counts[s]}` : '–'}
          </li>
        ))}
      </ul>
    </div>
  );
}
