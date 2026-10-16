'use client';

import {
  type EssayConfig,
  type OutlineBuilder as OutlineBuilderConfig,
  type OutlineField,
  type OutlinePlan,
  SubmissionDetail,
  buildEssayStart,
  buildOutline,
  outlineFieldInfo,
  outlineFields,
  outlinePlanComplete,
} from '@storyforge/shared';
import { useEffect, useRef, useState } from 'react';
import { Button, ErrorMessage } from '@/components/ui';
import { ApiError, apiJson } from '@/lib/api-client';

const SAVE_DELAY_MS = 1000;

const FIELD_STYLES: Record<OutlineField, string> = {
  hook: 'border-l-brand',
  thesis: 'border-l-brand',
  body1: 'border-l-ok',
  evidence1: 'border-l-warn',
  body2: 'border-l-ok',
  evidence2: 'border-l-warn',
  body3: 'border-l-ok',
  evidence3: 'border-l-warn',
  counterclaim: 'border-l-border',
  rebuttal: 'border-l-border',
  conclusion: 'border-l-brand',
};

/** The group each box belongs to, for the headings between them. */
const GROUP: Record<OutlineField, 'introduction' | 'body' | 'counter' | 'conclusion'> = {
  hook: 'introduction',
  thesis: 'introduction',
  body1: 'body',
  evidence1: 'body',
  body2: 'body',
  evidence2: 'body',
  body3: 'body',
  evidence3: 'body',
  counterclaim: 'counter',
  rebuttal: 'counter',
  conclusion: 'conclusion',
};
const GROUP_LABELS = {
  introduction: 'Introduction',
  body: 'Body paragraphs',
  counter: 'The other side',
  conclusion: 'Conclusion',
};

/**
 * Essay Units 11–15: the outline builder. One box per part of the essay (hook, thesis, body points
 * with evidence, counterclaim and rebuttal, conclusion) with sentence starters, saved a moment
 * after typing stops. In an outline activity "Put it in my writing" writes the labelled outline;
 * in an essay activity "Start my essay from the outline" writes one paragraph per part.
 */
export function OutlineBuilder({
  submissionId,
  builder,
  essay,
  mode,
  plan,
  onChange,
  draft,
  onUse,
}: {
  submissionId: string;
  builder: OutlineBuilderConfig;
  essay: EssayConfig;
  /** An outline activity writes labelled lines; an essay activity starts the essay. */
  mode: 'outline' | 'essay';
  plan: OutlinePlan;
  onChange: (plan: OutlinePlan) => void;
  /** The writing box's text (to offer "add" or "replace"). */
  draft: string;
  onUse: (text: string) => void;
}) {
  const [status, setStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [error, setError] = useState<string | null>(null);
  const [confirmReplace, setConfirmReplace] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const latest = useRef(plan);
  const fields = outlineFields(builder);
  const filled = fields.filter((f) => plan[f].trim().length > 0).length;
  const built =
    mode === 'outline' ? buildOutline(plan, builder, essay.type) : buildEssayStart(plan, builder);
  const empty = draft.trim() === '';

  useEffect(() => () => clearTimeout(timer.current), []);

  async function save() {
    clearTimeout(timer.current);
    setStatus('saving');
    try {
      await apiJson(
        `/submissions/${encodeURIComponent(submissionId)}/outline`,
        SubmissionDetail,
        'PUT',
        { outline: latest.current },
      );
      setStatus('saved');
      setError(null);
    } catch (e) {
      setStatus('unsaved');
      setError(e instanceof ApiError ? e.userMessage : 'Could not save your outline. Try again.');
    }
  }

  function update(field: OutlineField, value: string) {
    const next = { ...latest.current, [field]: value };
    latest.current = next;
    onChange(next);
    setNotice(null);
    setStatus('unsaved');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => void save(), SAVE_DELAY_MS);
  }

  /** A starter goes at the start of an empty box ("However, "), or after what's there. */
  function startWith(field: OutlineField, starter: string) {
    const lead = starter
      .replace(/\s*…\s*\??$/, '')
      .replace(/…/g, '')
      .trimEnd();
    const current = latest.current[field].trimEnd();
    update(field, current === '' ? `${lead} ` : `${current} ${lead} `);
    requestAnimationFrame(() => {
      const box = document.getElementById(`outline-${field}`);
      if (!(box instanceof HTMLTextAreaElement)) return;
      box.focus();
      box.setSelectionRange(box.value.length, box.value.length);
    });
  }

  function use() {
    onUse(built);
    setConfirmReplace(false);
    setNotice(
      mode === 'outline'
        ? 'Your outline is in the writing box. Keep improving it there.'
        : 'Your essay is started in the writing box: one paragraph per part. Now turn each into full sentences.',
    );
  }

  const useLabel = mode === 'outline' ? 'Put it in my writing' : 'Start my essay from the outline';

  return (
    <fieldset className="flex flex-col gap-3 rounded-xl border border-brand/40 bg-background p-4">
      <legend className="px-1 font-semibold">
        <span aria-hidden="true">🗺️ </span>
        {builder.label}
      </legend>
      <p className="text-sm text-muted">
        Plan your essay one part at a time. Tap a sentence starter to begin a box, then finish it in
        your own words.
      </p>
      <ol className="flex flex-col gap-4">
        {fields.map((field, i) => {
          const info = outlineFieldInfo(field, essay.type);
          const group = GROUP[field];
          const newGroup = i === 0 || GROUP[fields[i - 1]!] !== group;
          return (
            <li key={field} className="flex flex-col gap-2">
              {newGroup && (
                <h2 className="text-sm font-semibold tracking-wide text-muted uppercase">
                  {GROUP_LABELS[group]}
                </h2>
              )}
              <div className={`flex flex-col gap-2 border-l-4 pl-3 ${FIELD_STYLES[field]}`}>
                <label htmlFor={`outline-${field}`} className="font-medium">
                  {info.label}
                </label>
                <span id={`outline-${field}-help`} className="text-sm text-muted">
                  {info.help}
                </span>
                <div className="flex flex-wrap gap-2">
                  {info.starters.map((starter) => (
                    <button
                      key={starter}
                      type="button"
                      onClick={() => startWith(field, starter)}
                      className="min-h-11 rounded-full border border-border bg-card px-3 py-1 text-sm focus-visible:outline-3 focus-visible:outline-brand"
                    >
                      {starter}
                    </button>
                  ))}
                </div>
                <textarea
                  id={`outline-${field}`}
                  rows={2}
                  maxLength={400}
                  value={plan[field]}
                  aria-describedby={`outline-${field}-help`}
                  onChange={(e) => update(field, e.target.value)}
                  onBlur={() => {
                    if (status === 'unsaved') void save();
                  }}
                  className="rounded-lg border border-border bg-card px-3 py-2 focus-visible:outline-3 focus-visible:outline-brand"
                />
              </div>
            </li>
          );
        })}
      </ol>
      <output className="text-sm font-semibold" aria-live="polite">
        {outlinePlanComplete(plan, builder)
          ? '✓ Every part has words'
          : `${filled} of ${fields.length} parts written`}
        {status === 'saving' ? ' · saving…' : status === 'unsaved' ? '' : ' · saved'}
      </output>
      {built !== '' && (
        <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3">
          <h2 className="text-sm font-semibold">
            {mode === 'outline' ? 'Your outline so far' : 'Your essay plan so far'}
          </h2>
          <p className="text-sm whitespace-pre-line">{built}</p>
          <div className="flex flex-wrap gap-2">
            {empty ? (
              <Button type="button" onClick={use}>
                {useLabel}
              </Button>
            ) : confirmReplace ? (
              <>
                <span className="w-full text-sm">
                  Replace everything in your writing box with this{' '}
                  {mode === 'outline' ? 'outline' : 'plan'}?
                </span>
                <Button type="button" onClick={use}>
                  Yes, replace it
                </Button>
                <Button type="button" variant="secondary" onClick={() => setConfirmReplace(false)}>
                  Keep my writing
                </Button>
              </>
            ) : (
              <Button type="button" variant="secondary" onClick={() => setConfirmReplace(true)}>
                Replace my writing
              </Button>
            )}
          </div>
        </div>
      )}
      {notice && (
        <output className="text-sm" aria-live="polite">
          {notice}
        </output>
      )}
      <ErrorMessage message={error} />
    </fieldset>
  );
}
