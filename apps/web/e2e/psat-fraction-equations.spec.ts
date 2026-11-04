import { expect, test } from '@playwright/test';
import { expectAccessible, setUpStudent, studentLogin } from './helpers';

const CHAPTERS = [
  'Finding the LCM',
  'Clearing the fractions',
  'Fractions on both sides',
  'One fraction equal to a number',
  'Cross multiplying',
  'Brackets over denominators',
  'Checking your answer',
] as const;

// First compile of /join → /start and the Equations with Fractions pages is slower than the 5s default.
const slowExpect = expect.configure({ timeout: 30_000 });

test('a student can open the Equations with Fractions guide and a chapter', async ({ page }) => {
  test.setTimeout(180_000);
  const student = await setUpStudent(page);
  await studentLogin(page, student);

  await page.goto('/psat/fraction-equations');
  await slowExpect(
    page.getByRole('heading', { name: 'Equations with Fractions', level: 1 }),
  ).toBeVisible();

  const topics = page.getByRole('navigation', { name: 'Topics' });
  for (const title of CHAPTERS) {
    await slowExpect(topics.getByRole('link', { name: title, exact: true })).toBeVisible();
  }

  const chapters = page.getByRole('navigation', { name: 'Chapters' });
  await slowExpect(chapters.getByRole('heading', { name: 'Study guides' })).toBeVisible();
  await slowExpect(
    chapters.getByRole('link', { name: 'Equations with Fractions', exact: true }),
  ).toHaveAttribute('aria-current', 'page');
  await expectAccessible(page);

  await page.goto('/psat/fraction-equations/lcm');
  await slowExpect(page.getByRole('heading', { name: 'Finding the LCM', level: 1 })).toBeVisible();
  await slowExpect(page.getByRole('tab', { name: 'Middle school (grades 6–8)' })).toBeVisible();
  await slowExpect(page.getByRole('tab', { name: 'PSAT' })).toBeVisible();

  const problems = page.getByRole('tabpanel');
  await slowExpect(problems.getByRole('heading', { name: /25 problems/ })).toBeVisible();
  await slowExpect(problems.getByLabel(/Answer to problem \d+/)).toHaveCount(25);
  await slowExpect(
    page
      .getByRole('navigation', { name: 'Chapters' })
      .getByRole('link', { name: '1. Finding the LCM', exact: true }),
  ).toHaveAttribute('aria-current', 'page');
  await expectAccessible(page);
});
