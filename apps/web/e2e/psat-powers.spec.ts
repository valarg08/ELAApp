import { expect, test } from '@playwright/test';
import { expectAccessible, setUpStudent, studentLogin } from './helpers';

const CHAPTERS = [
  'What is a power?',
  'Zero and negative exponents',
  'Writing and expanding powers',
  'Negative bases',
  'Substituting into expressions',
  'What is scientific notation?',
  'Scientific notation to standard form',
  'Standard form to scientific notation',
] as const;

// First compile of /join → /start and the Powers pages is slower than the 5s default.
const slowExpect = expect.configure({ timeout: 30_000 });

test('a student can open the Powers study guide and a chapter', async ({ page }) => {
  test.setTimeout(180_000);
  const student = await setUpStudent(page);
  await studentLogin(page, student);

  await page.goto('/psat/powers');
  await slowExpect(
    page.getByRole('heading', { name: 'Powers and Scientific Notation', level: 1 }),
  ).toBeVisible();

  const topics = page.getByRole('navigation', { name: 'Topics' });
  for (const title of CHAPTERS) {
    await slowExpect(topics.getByRole('link', { name: title, exact: true })).toBeVisible();
  }

  const chapters = page.getByRole('navigation', { name: 'Chapters' });
  await slowExpect(chapters.getByRole('heading', { name: 'Study guides' })).toBeVisible();
  await slowExpect(
    chapters.getByRole('link', { name: 'Powers and Scientific Notation', exact: true }),
  ).toHaveAttribute('aria-current', 'page');
  await expectAccessible(page);

  await page.goto('/psat/powers/powers');
  await slowExpect(page.getByRole('heading', { name: 'What is a power?', level: 1 })).toBeVisible();
  await slowExpect(page.getByRole('tab', { name: 'Middle school (grades 7–8)' })).toBeVisible();
  await slowExpect(page.getByRole('tab', { name: 'PSAT' })).toBeVisible();

  const problems = page.getByRole('tabpanel');
  await slowExpect(problems.getByRole('heading', { name: /25 problems/ })).toBeVisible();
  await slowExpect(problems.getByLabel(/Answer to problem \d+/)).toHaveCount(25);
  await slowExpect(
    page
      .getByRole('navigation', { name: 'Chapters' })
      .getByRole('link', { name: '1. What is a power?', exact: true }),
  ).toHaveAttribute('aria-current', 'page');
  await expectAccessible(page);
});
