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
test.use({ expect: { timeout: 30_000 } });

test('a student can open the Factoring study guide and a chapter', async ({ page }) => {
  test.setTimeout(180_000);
  const student = await setUpStudent(page);
  await studentLogin(page, student);

  await page.goto('/psat/factoring');
  await expect(page.getByRole('heading', { name: 'Factoring', level: 1 })).toBeVisible();

  const topics = page.getByRole('navigation', { name: 'Topics' });
  for (const title of CHAPTERS) {
    await expect(topics.getByRole('link', { name: title, exact: true })).toBeVisible();
  }

  const chapters = page.getByRole('navigation', { name: 'Chapters' });
  await expect(chapters.getByRole('heading', { name: 'Study guides' })).toBeVisible();
  await expect(chapters.getByRole('link', { name: 'Factoring', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await expectAccessible(page);

  await page.goto('/psat/factoring/average');
  await expect(page.getByRole('heading', { name: 'Start from the average', level: 1 })).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Algebra 1 (grade 9)' })).toBeVisible();
  await expect(page.getByRole('tab', { name: 'PSAT' })).toBeVisible();

  const problems = page.getByRole('tabpanel');
  await expect(problems.getByRole('heading', { name: /25 problems/ })).toBeVisible();
  await expect(problems.getByLabel(/Answer to problem \d+/)).toHaveCount(25);
  await expect(
    page.getByRole('navigation', { name: 'Chapters' }).getByRole('link', {
      name: '1. Start from the average',
      exact: true,
    }),
  ).toHaveAttribute('aria-current', 'page');
  await expectAccessible(page);
});
