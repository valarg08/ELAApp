import { expect, test, type Page } from '@playwright/test';
import { PICTURES, decodePictureSecret } from '@storyforge/shared';

const labelOf = (id: string) => PICTURES.find((p) => p.id === id)?.label ?? id;

async function registerTeacher(page: Page, email: string) {
  await page.goto('/register');
  await page.getByLabel('Your name (shown to students)').fill('Ms Rivera');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill('e2e-teacher-password-1');
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page).toHaveURL(/\/classes$/);
}

async function tapPictures(page: Page, secret: string) {
  for (const id of decodePictureSecret(secret) ?? []) {
    await page
      .getByRole('group', { name: 'Pictures' })
      .getByRole('button', { name: labelOf(id), exact: true })
      .click();
  }
}

test('acceptance: teacher creates a class, adds 3 students, and a student logs in with a picture password', async ({
  page,
  context,
}) => {
  await registerTeacher(page, `rivera-${Date.now()}@example.test`);

  // Create a class.
  await page.getByLabel('Class name').fill('7B Creative Writing');
  await page.getByRole('button', { name: 'Create class', exact: true }).click();
  await expect(page.getByRole('heading', { name: '7B Creative Writing' })).toBeVisible();
  const joinCode = (await page.getByTestId('join-code').textContent())?.trim() ?? '';
  expect(joinCode).toMatch(/^[A-HJ-NP-Z2-9]{6}$/);

  // Add three students.
  await page.getByLabel('Student names').fill('Maya\nLeo\nAarav');
  await page.getByRole('button', { name: 'Add 3 students', exact: true }).click();
  const credentials = page.getByTestId('credential');
  await expect(credentials).toHaveCount(3);
  await expect(page.getByRole('table').getByRole('row')).toHaveCount(4); // header + 3

  const maya = credentials.filter({ hasText: 'Maya' });
  const username = (await maya.getAttribute('data-username')) ?? '';
  const secret = (await maya.getAttribute('data-secret')) ?? '';
  expect(decodePictureSecret(secret)).not.toBeNull();

  // Login cards download as a PDF.
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: /Download login cards/ }).click(),
  ]);
  expect(download.suggestedFilename()).toBe('login-cards.pdf');

  // Teacher logs out; Maya joins with the class code and her pictures.
  await page.getByRole('button', { name: 'Log out', exact: true }).click();
  await expect(page).toHaveURL(/\/$/);

  await page.goto('/join');
  await page.getByLabel('Class code').fill(joinCode.toLowerCase());
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Who are you?' })).toBeVisible();
  await page.getByRole('button', { name: 'Maya', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Hi, Maya!' })).toBeVisible();
  await tapPictures(page, secret);
  await page.getByRole('button', { name: 'Log in', exact: true }).click();

  await expect(page).toHaveURL(/\/home$/);
  await expect(page.getByRole('heading', { name: /Welcome, Maya!/ })).toBeVisible();
  await expect(page.getByText('7B Creative Writing')).toBeVisible();

  // Students can't open teacher pages.
  await page.goto('/classes');
  await expect(page).toHaveURL(/\/home$/);

  // An expired access token is refreshed transparently before the page renders.
  await context.clearCookies({ name: 'sf_access' });
  await page.goto('/home');
  await expect(page.getByRole('heading', { name: /Welcome, Maya!/ })).toBeVisible();
  const cookies = await context.cookies();
  expect(cookies.find((c) => c.name === 'sf_access')?.httpOnly).toBe(true);

  // The QR-code link on the login card skips straight to the picture step.
  await page.getByRole('button', { name: 'Log out', exact: true }).click();
  await page.goto(`/join?code=${joinCode}&user=${username}`);
  await expect(page.getByRole('heading', { name: 'Hi, Maya!' })).toBeVisible();
});

test('a wrong picture password shows a friendly error and clears the pictures', async ({
  page,
}) => {
  await registerTeacher(page, `lee-${Date.now()}@example.test`);
  await page.getByLabel('Class name').fill('8A Poets');
  await page.getByRole('button', { name: 'Create class', exact: true }).click();
  const joinCode = (await page.getByTestId('join-code').textContent())?.trim() ?? '';
  await page.getByLabel('Student names').fill('Leo');
  await page.getByRole('button', { name: 'Add 1 student', exact: true }).click();
  const secret = (await page.getByTestId('credential').getAttribute('data-secret')) ?? '';
  await page.getByRole('button', { name: 'Log out', exact: true }).click();
  await expect(page).toHaveURL(/\/$/);

  await page.goto('/join');
  await page.getByLabel('Class code').fill(joinCode);
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.getByRole('button', { name: 'Leo', exact: true }).click();

  // Tap the right pictures in reverse order: a guaranteed wrong password.
  const reversed = (decodePictureSecret(secret) ?? []).toReversed().join('-');
  await tapPictures(page, reversed);
  await page.getByRole('button', { name: 'Log in', exact: true }).click();

  // (Next.js also renders an empty role="alert" route announcer, so filter by text.)
  await expect(
    page.getByRole('alert').filter({ hasText: "Those pictures don't match. Try again!" }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Log in', exact: true })).toBeDisabled();
  await tapPictures(page, secret);
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await expect(page).toHaveURL(/\/home$/);
});
