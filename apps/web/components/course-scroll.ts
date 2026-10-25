/** Back to the top of the page: the course frame's middle column scrolls on its own from md up. */
export function scrollPageTop() {
  document.getElementById('course-main')?.scrollTo({ top: 0, behavior: 'smooth' });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
