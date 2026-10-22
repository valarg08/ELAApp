import { splitMath } from '@storyforge/shared';
import { renderToString } from 'katex';
import type { ElementType } from 'react';

const cache = new Map<string, string>();

/** One TeX piece as MathML (read by screen readers, drawn natively by the browser). */
function render(tex: string, display: boolean): string {
  const key = `${display ? 'D' : 'I'}${tex}`;
  const hit = cache.get(key);
  if (hit !== undefined) return hit;
  let html: string;
  try {
    html = renderToString(tex, {
      output: 'mathml',
      throwOnError: false,
      trust: false,
      displayMode: display,
    });
  } catch {
    html = '';
  }
  if (cache.size > 500) cache.clear();
  cache.set(key, html);
  return html;
}

/**
 * Text with $…$ inline math and $$…$$ display math (DESIGN.md §9.13), rendered with KaTeX. `\$` is
 * a dollar sign. Content was checked by content:check, and KaTeX escapes everything it outputs.
 */
export function MathText({
  text,
  as: Tag = 'span',
  className,
}: {
  text: string;
  as?: ElementType;
  className?: string;
}) {
  const { segments } = splitMath(text);
  return (
    <Tag className={className}>
      {segments.map((s, i) =>
        s.display ? (
          <span
            key={i}
            // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a formula wider than a phone screen scrolls, and a scrollable region must be keyboard focusable (axe)
            tabIndex={0}
            className="math math-display rounded focus-visible:outline-3 focus-visible:outline-brand"
            dangerouslySetInnerHTML={{ __html: render(s.text, true) }}
          />
        ) : s.math ? (
          <span
            key={i}
            className="math"
            dangerouslySetInnerHTML={{ __html: render(s.text, false) }}
          />
        ) : (
          <span key={i}>{s.text}</span>
        ),
      )}
    </Tag>
  );
}

/** Text that is math-aware only in the Math track (Story and Essay text never treats $ as math). */
export function TrackText({ text, math }: { text: string; math: boolean }) {
  return math ? <MathText text={text} /> : <>{text}</>;
}
