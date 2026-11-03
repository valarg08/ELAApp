import { expect, test } from '@playwright/test';
import { expectAccessible, setUpStudent, studentLogin } from './helpers';

const CHAPTERS = [
  'What is an inequality?',
  'Graphing on a number line',
  'Linear inequalities with one variable',
  'Compound inequalities (OR)',
  'Compound inequalities (AND)',
  'Absolute-value inequalities',
  'Linear inequalities with two variables',
  'Systems of inequalities',
  'Polynomial inequalities',
  'Rational inequalities',
] as const;

// First compile of /join → /start and the Inequalities pages is slower than the 5s default.
const slowExpect = expect.configure({ timeout: 30_000 });

test('a student can open the Inequalities study guide and a chapter', async ({ page }) => {
  test.setTimeout(180_000);
  const student = await setUpStudent(page);
  await studentLogin(page, student);

  await page.goto('/psat/inequalities');
  await slowExpect(page.getByRole('heading', { name: 'Inequalities', level: 1 })).toBeVisible();

  const topics = page.getByRole('navigation', { name: 'Topics' });
  for (const title of CHAPTERS) {
    await slowExpect(topics.getByRole('link', { name: title, exact: true })).toBeVisible();
  }

  const chapters = page.getByRole('navigation', { name: 'Chapters' });
  await slowExpect(chapters.getByRole('heading', { name: 'Study guides' })).toBeVisible();
  await slowExpect(
    chapters.getByRole('link', { name: 'Inequalities', exact: true }),
  ).toHaveAttribute('aria-current', 'page');
  await expectAccessible(page);

  await page.goto('/psat/inequalities/symbols');
  await slowExpect(
    page.getByRole('heading', { name: 'What is an inequality?', level: 1 }),
  ).toBeVisible();
  await slowExpect(page.getByRole('tab', { name: 'Algebra 1 (grade 9)' })).toBeVisible();
  await slowExpect(page.getByRole('tab', { name: 'PSAT' })).toBeVisible();

  const problems = page.getByRole('tabpanel');
  await slowExpect(problems.getByRole('heading', { name: /25 problems/ })).toBeVisible();
  await slowExpect(problems.getByLabel(/Answer to problem \d+/)).toHaveCount(25);
  await slowExpect(
    page.getByRole('navigation', { name: 'Chapters' }).getByRole('link', {
      name: '1. What is an inequality?',
      exact: true,
    }),
  ).toHaveAttribute('aria-current', 'page');
  await expectAccessible(page);
});
