/** Give an element focus when it appears (a ref callback), e.g. "Next" after a right answer. */
export function focusOnMount(el: HTMLElement | null) {
  el?.focus();
}
