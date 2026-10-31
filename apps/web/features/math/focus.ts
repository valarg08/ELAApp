/**
 * Puts focus where a student answers: the chosen choice, else the answer box, else the first
 * choice, inside `root`. Used when a new question appears, so the keyboard is ready at once.
 */
export function focusAnswer(root: Element | null | undefined) {
  const el =
    root?.querySelector<HTMLInputElement>('input[type=radio]:checked:not(:disabled)') ??
    root?.querySelector<HTMLInputElement>(
      'input:not([type=radio]):not([type=checkbox]):not(:disabled)',
    ) ??
    root?.querySelector<HTMLInputElement>('input[type=radio]:not(:disabled)');
  el?.focus();
}
