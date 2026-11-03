import { expect, test } from '@playwright/test';
import { expectAccessible, setUpStudent, studentLogin } from './helpers';

const CHAPTERS = [
  'What is a radical?',
  'Perfect squares and cubes',
  'Simplifying radicals',
  'Multiplying and dividing radicals',
  'Adding and subtracting radicals',
  'Rationalizing the denominator',
  'Solving radical equations',
  'The square root function',
  'Imaginary and complex numbers',
  'Where radicals are used',
] as const;

// First compile of /join → /start and the Radicals pages is slower than the 5s default.
const slowExpect = expect.configure({ timeout: 30_000 });

test('a student can open the Radicals study guide and a chapter', async ({ page }) => {
  test.setTimeout(180_000);
  const student = await setUpStudent(page);
  await studentLogin(page, student);

  await page.goto('/psat/radicals');
  await slowExpect(page.getByRole('heading', { name: 'Radicals', level: 1 })).toBeVisible();

  const topics = page.getByRole('navigation', { name: 'Topics' });
  for (const title of CHAPTERS) {
    await slowExpect(topics.getByRole('link', { name: title, exact: true })).toBeVisible();
  }

  const chapters = page.getByRole('navigation', { name: 'Chapters' });
  await slowExpect(chapters.getByRole('heading', { name: 'Study guides' })).toBeVisible();
  await slowExpect(chapters.getByRole('link', { name: 'Radicals', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await expectAccessible(page);

  await page.goto('/psat/radicals/whatis');
  await slowExpect(
    page.getByRole('heading', { name: 'What is a radical?', level: 1 }),
  ).toBeVisible();
  await slowExpect(page.getByRole('tab', { name: 'Algebra 1 (grade 9)' })).toBeVisible();
  await slowExpect(page.getByRole('tab', { name: 'PSAT' })).toBeVisible();

  const problems = page.getByRole('tabpanel');
  await slowExpect(problems.getByRole('heading', { name: /25 problems/ })).toBeVisible();
  await slowExpect(problems.getByLabel(/Answer to problem \d+/)).toHaveCount(25);
  await slowExpect(
    page
      .getByRole('navigation', { name: 'Chapters' })
      .getByRole('link', { name: '1. What is a radical?', exact: true }),
  ).toHaveAttribute('aria-current', 'page');
  await expectAccessible(page);
});
