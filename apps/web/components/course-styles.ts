/** Shared classes of the course frame (CourseShell and CourseFrame). */

/** Focus ring on the navy chapters panel. */
export const navFocus =
  'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-white';
const panel = 'rounded-2xl p-4 shadow-sm';
/** Left: deep teal chapters (--brand). Right: cyan progress with deep teal text. The page between them sits on a light cyan panel (bg-page-panel). */
export const navPanel = `${panel} bg-brand text-white`;
export const cyanPanel = `${panel} bg-cyan text-brand`;
/** Focus ring on the cyan progress panel. */
export const cyanFocus =
  'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand';
