'use client';

import {
  PARAGRAPH_PART_INFO,
  type ParagraphBuilder as ParagraphBuilderConfig,
  type ParagraphPart,
  type ParagraphPlan,
  SubmissionDetail,
  buildParagraph,
  paragraphParts,
  paragraphPlanComplete,
} from '@storyforge/shared';
import { useEffect, useRef, useState } from 'react';
import { Button, ErrorMessage } from '@/components/ui';
import { ApiError, apiJson } from '@/lib/api-client';

const SAVE_DELAY_MS = 1000;

const PART_STYLES: Record<ParagraphPart, string> = {
  topic: 'border-l-brand',
  evidence1: 'border-l-ok',
  explain1: 'border-l-warn',
  evidence2: 'border-l-ok',
  explain2: 'border-l-warn',
  closing: 'border-l-brand',
};

/**
 * Essay Unit 10: the paragraph builder. One box per part (topic sentence, evidence, explanation…,
 * closing sentence) with sentence starters, saved a moment after typing stops. "Put it in my
 * writing" copies the built paragraph into the writing box, where the student keeps working.
 */
export function ParagraphBuilder({
  submissionId,
  builder,
  plan,
  onChange,
  draft,
  onUse,
}: {
  submissionId: string;
  builder: ParagraphBuilderConfig;
  plan: ParagraphPlan;
  onChange: (plan: ParagraphPlan) => void;
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
  const parts = paragraphParts(builder.points);
  const filled = parts.filter((p) => plan[p].trim().length > 0).length;
  const built = buildParagraph(plan, builder.points);
  const empty = draft.trim() === '';

  useEffect(() => () => clearTimeout(timer.current), []);

  async function save() {
    clearTimeout(timer.current);
    setStatus('saving');
    try {
      await apiJson(
        `/submissions/${encodeURIComponent(submissionId)}/paragraph`,
        SubmissionDetail,
        'PUT',
        { paragraph: latest.current },
      );
      setStatus('saved');
      setError(null);
    } catch (e) {
      setStatus('unsaved');
      setError(e instanceof ApiError ? e.userMessage : 'Could not save your boxes. Try again.');
    }
  }

  function update(part: ParagraphPart, value: string) {
    const next = { ...latest.current, [part]: value };
    latest.current = next;
    onChange(next);
    setNotice(null);
    setStatus('unsaved');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => void save(), SAVE_DELAY_MS);
  }

  /** A starter goes at the start of an empty box ("For example, "), or after what's there. */
  function startWith(part: ParagraphPart, starter: string) {
    const lead = starter
      .replace(/\s*…\s*$/, '')
      .replace(/…/g, '')
      .trimEnd();
    const current = latest.current[part].trimEnd();
    update(part, current === '' ? `${lead} ` : `${current} ${lead} `);
    requestAnimationFrame(() => {
      const box = document.getElementById(`paragraph-${part}`);
      if (!(box instanceof HTMLTextAreaElement)) return;
      box.focus();
      box.setSelectionRange(box.value.length, box.value.length);
    });
  }

  function use(mode: 'set' | 'add' | 'replace') {
    onUse(mode === 'add' ? `${draft.trimEnd()}\n\n${built}` : built);
    setConfirmReplace(false);
    setNotice(
      mode === 'add'
        ? 'Added as a new paragraph in your writing box.'
        : 'Your paragraph is in the writing box. Keep improving it there.',
    );
  }

  return (
    <fieldset className="flex flex-col gap-3 rounded-xl border border-brand/40 bg-background p-4">
      <legend className="px-1 font-semibold">
        <span aria-hidden="true">🧱 </span>
        {builder.label}
      </legend>
      <p className="text-sm text-muted">
        Build your paragraph one part at a time. Tap a sentence starter to begin a box, then finish
        the sentence in your own words.
      </p>
      <ol className="flex flex-col gap-4">
        {parts.map((part) => {
          const info = PARAGRAPH_PART_INFO[part];
          return (
            <li key={part} className={`flex flex-col gap-2 border-l-4 pl-3 ${PART_STYLES[part]}`}>
              <label htmlFor={`paragraph-${part}`} className="font-medium">
                {info.label}
              </label>
              <span id={`paragraph-${part}-help`} className="text-sm text-muted">
                {info.help}
              </span>
              <div className="flex flex-wrap gap-2">
                {info.starters.map((starter) => (
                  <button
                    key={starter}
                    type="button"
                    onClick={() => startWith(part, starter)}
                    className="min-h-11 rounded-full border border-border bg-card px-3 py-1 text-sm focus-visible:outline-3 focus-visible:outline-brand"
                  >
                    {starter}
                  </button>
                ))}
              </div>
              <textarea
                id={`paragraph-${part}`}
                rows={2}
                maxLength={400}
                value={plan[part]}
                aria-describedby={`paragraph-${part}-help`}
                onChange={(e) => update(part, e.target.value)}
                onBlur={() => {
                  if (status === 'unsaved') void save();
                }}
                className="rounded-lg border border-border bg-card px-3 py-2 focus-visible:outline-3 focus-visible:outline-brand"
              />
            </li>
          );
        })}
      </ol>
      <output className="text-sm font-semibold" aria-live="polite">
        {paragraphPlanComplete(plan, builder.points)
          ? '✓ Every part has words'
          : `${filled} of ${parts.length} parts written`}
        {status === 'saving' ? ' · saving…' : status === 'unsaved' ? '' : ' · saved'}
      </output>
      {built !== '' && (
        <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3">
          <h2 className="text-sm font-semibold">Your paragraph so far</h2>
          <p className="text-sm">{built}</p>
          <div className="flex flex-wrap gap-2">
            {empty ? (
              <Button type="button" onClick={() => use('set')}>
                Put it in my writing
              </Button>
            ) : confirmReplace ? (
              <>
                <span className="w-full text-sm">
                  Replace everything in your writing box with this paragraph?
                </span>
                <Button type="button" onClick={() => use('replace')}>
                  Yes, replace it
                </Button>
                <Button type="button" variant="secondary" onClick={() => setConfirmReplace(false)}>
                  Keep my writing
                </Button>
              </>
            ) : (
              <>
                <Button type="button" onClick={() => use('add')}>
                  Add it as a new paragraph
                </Button>
                <Button type="button" variant="secondary" onClick={() => setConfirmReplace(true)}>
                  Replace my writing
                </Button>
              </>
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
