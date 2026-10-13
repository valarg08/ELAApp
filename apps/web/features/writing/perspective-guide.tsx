'use client';

import type { WritingConstraints } from '@storyforge/shared';
import { checkPerspectives, perspectiveName } from '@storyforge/writing-analysis';
import { Button } from '@/components/ui';

type Perspectives = NonNullable<WritingConstraints['perspectives']>;

const STATUS = {
  ok: { icon: '✓', text: 'keeps its point of view', className: 'border-ok text-ok' },
  missing: { icon: '＋', text: 'heading not found yet', className: 'border-border text-muted' },
  short: { icon: '…', text: 'keep writing', className: 'border-border text-muted' },
  shift: { icon: '⚠', text: 'slips out of its point of view', className: 'border-warn text-warn' },
  narrator: { icon: '?', text: 'check whose thoughts we hear', className: 'border-warn text-warn' },
} as const;

/**
 * The multi-perspective rewrite (DESIGN.md §10, Unit 5): one draft with a part per point of view,
 * each under its own heading line. Shows each part's point of view, checked live, and adds any
 * missing headings.
 */
export function PerspectiveGuide({
  text,
  perspectives,
  onAddHeadings,
}: {
  text: string;
  perspectives: Perspectives;
  onAddHeadings: (text: string) => void;
}) {
  const checks = checkPerspectives(text, perspectives);
  const missing = checks.filter((c) => c.status === 'missing');

  function addHeadings() {
    const trimmed = text.trimEnd();
    const added = missing.map((c) => `${c.label}\n`).join('\n');
    onAddHeadings(trimmed ? `${trimmed}\n\n${added}` : added);
  }

  return (
    <section
      aria-labelledby="perspectives-title"
      className="flex flex-col gap-3 rounded-xl border border-brand/40 bg-background p-4"
    >
      <h2 id="perspectives-title" className="font-semibold">
        <span aria-hidden="true">🎥 </span>One event, {perspectives.length} points of view
      </h2>
      <p className="text-sm text-muted">
        Write each version under its own heading. Keep the headings exactly as they are, so Quill
        can check each part.
      </p>
      <ol className="flex flex-col gap-2" aria-live="polite">
        {checks.map((c) => {
          const s = STATUS[c.status];
          return (
            <li
              key={c.label}
              className={`flex flex-wrap items-center gap-x-2 rounded-lg border px-3 py-1.5 text-sm ${s.className}`}
            >
              <span aria-hidden="true">{s.icon}</span>
              <span className="font-semibold">{c.label}</span>
              {!c.label.toLowerCase().includes(perspectiveName(c)) && (
                <span className="text-muted">({perspectiveName(c)})</span>
              )}
              <span>· {text.trim() === '' && c.status === 'missing' ? 'not started' : s.text}</span>
            </li>
          );
        })}
      </ol>
      {missing.length > 0 && (
        <Button variant="secondary" className="self-start" onClick={addHeadings}>
          {missing.length === perspectives.length ? 'Add the headings' : 'Add the missing headings'}
        </Button>
      )}
    </section>
  );
}
