'use client';

import {
  type PlotPlan,
  type ToneChoice,
  type WritingActivity,
  validTone,
} from '@storyforge/shared';
import {
  type CoachCard,
  type CoachReport,
  SENSES,
  type Sense,
  type Span,
  MOOD_POLES,
  TONE_STEPS,
  buildCoachReport,
  perspectiveName,
  toneAxis,
  toneStepLabel,
} from '@storyforge/writing-analysis';
import { useState } from 'react';
import { Button } from '@/components/ui';
import { AskQuill } from './ask-quill';
import { TONE_ICONS } from './tone-picker';

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
  traits,
  mood,
  conflict,
  plot,
  tone,
  onShow,
}: {
  text: string;
  activityId: string;
  activity: WritingActivity;
  /** Traits picked for the trait picker (for "Can my reader tell?"). */
  traits: string[];
  /** Moods chosen for the mood picker (the mood check compares against them). */
  mood: string[];
  /** Conflict card and plan (for "Does my plot work?"). */
  conflict: string | null;
  plot: PlotPlan;
  /** Tone aimed for on the tone sliders (the tone check compares against it). */
  tone: ToneChoice;
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
        moods: MOOD_POLES.filter((p) => mood.includes(p)),
        narrator: activity.constraints.narrator,
        perspectives: activity.constraints.perspectives,
        tone: activity.tonePicker ? validTone(activity, tone) : undefined,
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
            {checked.report.perspectives && (
              <PerspectiveStrip
                parts={checked.report.perspectives}
                canShow={canShow}
                onShow={onShow}
              />
            )}
            {checked.report.tone && <ToneBand scales={checked.report.tone} />}
            {checked.report.pacing && (
              <PacingBand segments={checked.report.pacing} canShow={canShow} onShow={onShow} />
            )}
          </>
        )}
      </div>

      <AskQuill
        activityId={activityId}
        activity={activity}
        traits={traits}
        mood={mood}
        conflict={conflict}
        plot={plot}
        tone={tone}
        text={text}
        onShow={onShow}
      />
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

const PACE_STYLES = {
  slow: { label: 'slow', icon: '🐢', className: 'bg-ok/15 border-ok' },
  medium: { label: 'medium', icon: '🚶', className: 'bg-warn/15 border-warn' },
  fast: { label: 'fast', icon: '⚡', className: 'bg-bad/15 border-bad' },
} as const;

/** Pacing band (DESIGN.md §10): each part of the story with its speed, in story order. */
function PacingBand({
  segments,
  canShow,
  onShow,
}: {
  segments: NonNullable<CoachReport['pacing']>;
  canShow: (span: Span | undefined) => span is Span;
  onShow: (span: Span) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-semibold">Story speed, part by part</h3>
      <ol className="flex flex-wrap gap-1" aria-label="Pacing of each part">
        {segments.map((s, i) => {
          const style = PACE_STYLES[s.pace];
          const span = { start: s.start, end: s.end, text: s.text };
          return (
            <li key={s.start} className="min-w-16 flex-1">
              <button
                type="button"
                disabled={!canShow(span)}
                onClick={() => onShow(span)}
                className={`w-full rounded-lg border px-2 py-1 text-left text-sm focus-visible:outline-3 focus-visible:outline-brand ${style.className}`}
                aria-label={`Part ${i + 1}: ${style.label}. Show it in my writing`}
              >
                <span aria-hidden="true">{style.icon} </span>
                {style.label}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

const PART_STATUS = {
  ok: { icon: '✓', label: 'keeps its point of view', className: 'border-ok' },
  missing: { icon: '＋', label: 'heading missing', className: 'border-border' },
  short: { icon: '…', label: 'too short to check', className: 'border-border' },
  shift: { icon: '⚠', label: 'slips out of its point of view', className: 'border-warn' },
  narrator: { icon: '?', label: 'check whose thoughts we hear', className: 'border-warn' },
} as const;

/** Each part of a multi-perspective rewrite with its point of view, checked. */
function PerspectiveStrip({
  parts,
  canShow,
  onShow,
}: {
  parts: NonNullable<CoachReport['perspectives']>;
  canShow: (span: Span | undefined) => span is Span;
  onShow: (span: Span) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-semibold">Points of view, part by part</h3>
      <ol className="flex flex-col gap-1">
        {parts.map((p) => {
          const s = PART_STATUS[p.status];
          return (
            <li
              key={p.label}
              className={`flex flex-wrap items-center gap-x-2 rounded-lg border px-3 py-1.5 text-sm ${s.className}`}
            >
              <span aria-hidden="true">{s.icon}</span>
              <span className="font-semibold">{p.label}</span>
              {!p.label.toLowerCase().includes(perspectiveName(p)) && (
                <span className="text-muted">({perspectiveName(p)})</span>
              )}
              <span>· {s.label}</span>
              {p.status !== 'ok' && canShow(p.span) && (
                <button
                  type="button"
                  onClick={() => p.span && onShow(p.span)}
                  className="font-semibold text-brand underline focus-visible:outline-3 focus-visible:outline-brand"
                >
                  Show me
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** The tone sliders again: where the student aimed (🎯) and where their words sit (🦉). */
function ToneBand({ scales }: { scales: NonNullable<CoachReport['tone']> }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-semibold">Your tone: aimed 🎯 and heard 🦉</h3>
      <ul className="flex flex-col gap-3">
        {scales.map(({ axis, aimed, heard }) => {
          const [left, right] = toneAxis(axis).poles;
          return (
            <li key={axis} className="flex flex-col gap-1">
              <div aria-hidden="true" className="flex flex-col gap-1">
                <div className="flex justify-between text-sm">
                  <span>
                    {TONE_ICONS[left]} {left}
                  </span>
                  <span>
                    {right} {TONE_ICONS[right]}
                  </span>
                </div>
                <div className="relative flex items-center justify-between px-1">
                  <span className="absolute inset-x-2 top-1/2 h-1 -translate-y-1/2 rounded bg-border" />
                  {TONE_STEPS.map((step) => (
                    <span
                      key={step}
                      className={`relative flex size-8 items-center justify-center rounded-full border ${
                        step === heard ? 'border-brand bg-brand/15' : 'border-border bg-card'
                      }`}
                    >
                      {step === aimed ? '🎯' : step === heard ? '🦉' : ''}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-center text-sm">
                {aimed !== null && <>Aimed: {toneStepLabel(axis, aimed)} · </>}
                {heard === null
                  ? 'Quill can’t hear this one yet: add a few more words with that feel.'
                  : `Sounds: ${toneStepLabel(axis, heard)}${aimed !== null && Math.abs(aimed - heard) <= 1 && aimed * heard >= 0 ? ' ✓' : ''}`}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
