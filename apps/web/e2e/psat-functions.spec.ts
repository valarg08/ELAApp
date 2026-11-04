import { expect, test } from '@playwright/test';
import { expectAccessible, setUpStudent, studentLogin } from './helpers';

const CHAPTERS = [
  'What is a function?',
  'Domain and range',
  'Graphs of common functions',
  'Transformations',
  'Inverse functions',
  'Combining functions',
  'Composite functions',
  'Piecewise functions',
  'Even and odd functions',
  'Asymptotes',
] as const;

// First compile of /join → /start and the Functions pages is slower than the 5s default.
const slowExpect = expect.configure({ timeout: 30_000 });

test('a student can open the Functions study guide and a chapter', async ({ page }) => {
  test.setTimeout(180_000);
  const student = await setUpStudent(page);
  await studentLogin(page, student);

  await page.goto('/psat/functions');
  await slowExpect(page.getByRole('heading', { name: 'Functions', level: 1 })).toBeVisible();

  const topics = page.getByRole('navigation', { name: 'Topics' });
  for (const title of CHAPTERS) {
    await slowExpect(topics.getByRole('link', { name: title, exact: true })).toBeVisible();
  }

  const chapters = page.getByRole('navigation', { name: 'Chapters' });
  await slowExpect(chapters.getByRole('heading', { name: 'Study guides' })).toBeVisible();
  await slowExpect(chapters.getByRole('link', { name: 'Functions', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await expectAccessible(page);

  await page.goto('/psat/functions/whatis');
  await slowExpect(
    page.getByRole('heading', { name: 'What is a function?', level: 1 }),
  ).toBeVisible();
  await slowExpect(page.getByRole('tab', { name: 'Algebra 1 (grade 9)' })).toBeVisible();
  await slowExpect(page.getByRole('tab', { name: 'PSAT' })).toBeVisible();

  const problems = page.getByRole('tabpanel');
  await slowExpect(problems.getByRole('heading', { name: /25 problems/ })).toBeVisible();
  await slowExpect(problems.getByLabel(/Answer to problem \d+/)).toHaveCount(25);
  await slowExpect(
    page
      .getByRole('navigation', { name: 'Chapters' })
      .getByRole('link', { name: '1. What is a function?', exact: true }),
  ).toHaveAttribute('aria-current', 'page');
  await expectAccessible(page);
});
