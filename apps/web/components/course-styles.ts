/** Shared classes of the course frame (CourseShell and CourseFrame). */

/** Focus ring on the navy chapters panel. */
export const navFocus =
  'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-white';
const panel = 'rounded-2xl p-4 shadow-sm';
/** Left: navy chapters. Right: rose progress. The page between them sits on a white panel. */
export const navPanel = `${panel} bg-brand text-white`;
export const progressPanel = `${panel} border border-border border-t-4 border-t-bad bg-progress-panel`;
