/** Shared classes of the course frame (CourseShell and CourseFrame). */

/** Focus ring on the chapters panel. */
export const navFocus =
  'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand';
const panel = 'rounded-2xl border border-border p-4 shadow-sm';
/** Left: light teal chapters. Right: light cyan progress. Both with deep teal text; the page between them is white. */
export const navPanel = `${panel} bg-nav-panel text-brand`;
export const cyanPanel = `${panel} bg-progress-panel text-brand`;
/** Focus ring on the cyan progress panel. */
export const cyanFocus =
  'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand';
