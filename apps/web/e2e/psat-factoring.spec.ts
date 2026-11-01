import { expect, test } from '@playwright/test';
import { expectAccessible, setUpStudent, studentLogin } from './helpers';

const CHAPTERS = [
  'Start from the average',
  'A negative sum',
  'When the average is a fraction',
  'A coefficient on x²',
  'Irrational factors',
  'Imaginary factors',
] as const;

// First compile of /join → /start and the Factoring pages is slower than the 5s default.
const slowExpect = expect.configure({ timeout: 30_000 });

test('a student can open the Factoring study guide and a chapter', async ({ page }) => {
  test.setTimeout(180_000);
  const student = await setUpStudent(page);
  await studentLogin(page, student);

  await page.goto('/psat/factoring');
  await slowExpect(page.getByRole('heading', { name: 'Factoring', level: 1 })).toBeVisible();

  const topics = page.getByRole('navigation', { name: 'Topics' });
  for (const title of CHAPTERS) {
    await slowExpect(topics.getByRole('link', { name: title, exact: true })).toBeVisible();
  }

  const chapters = page.getByRole('navigation', { name: 'Chapters' });
  await slowExpect(chapters.getByRole('heading', { name: 'Study guides' })).toBeVisible();
  await slowExpect(chapters.getByRole('link', { name: 'Factoring', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await expectAccessible(page);

  await page.goto('/psat/factoring/average');
  await slowExpect(
    page.getByRole('heading', { name: 'Start from the average', level: 1 }),
  ).toBeVisible();
  await slowExpect(page.getByRole('tab', { name: 'Algebra 1 (grade 9)' })).toBeVisible();
  await slowExpect(page.getByRole('tab', { name: 'PSAT' })).toBeVisible();

  const problems = page.getByRole('tabpanel');
  await slowExpect(problems.getByRole('heading', { name: /25 problems/ })).toBeVisible();
  await slowExpect(problems.getByLabel(/Answer to problem \d+/)).toHaveCount(25);
  await slowExpect(
    page.getByRole('navigation', { name: 'Chapters' }).getByRole('link', {
      name: '1. Start from the average',
      exact: true,
    }),
  ).toHaveAttribute('aria-current', 'page');
  await expectAccessible(page);
});
