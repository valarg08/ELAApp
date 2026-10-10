import { expect, test, type Page } from '@playwright/test';
import { expectAccessible, openChallenge, setUpStudent, studentLogin } from './helpers';

/** P3 acceptance (DESIGN.md §14.2): offline autosave, two-tab conflict, restore. */

const status = (page: Page) => page.getByTestId('save-status');
const editor = (page: Page) => page.getByLabel('Your writing');

async function openWorkspace(page: Page, name: string) {
  const student = await setUpStudent(page, name);
  await studentLogin(page, student);
  // Lesson 2: "show, don't tell" (25–150 words, some banned words).
  const submission = await openChallenge(page, 2);
  await page.goto(`/write/${submission.id}`);
  await expect(editor(page)).toBeVisible();
  return submission.id;
}

test('acceptance: type → autosave → go offline → type → reconnect → no data lost', async ({
  page,
  context,
}) => {
  const id = await openWorkspace(page, 'Omar');
  await expectAccessible(page);

  await editor(page).fill('The kettle screamed.');
  await expect(status(page)).toHaveAttribute('data-status', 'saved');

  await context.setOffline(true);
  await editor(page).fill('The kettle screamed. Her hands shook as she poured.');
  await expect(status(page)).toHaveAttribute('data-status', 'offline');
  await expect(status(page)).toContainText('kept on this device');

  await context.setOffline(false);
  await expect(status(page)).toHaveAttribute('data-status', 'saved');
  await page.reload();
  await expect(editor(page)).toHaveValue('The kettle screamed. Her hands shook as she poured.');

  // Offline again, then the tab closes before it can sync: the device copy is sent next time.
  await context.setOffline(true);
  await editor(page).fill('The kettle screamed. Her hands shook as she poured. Steam curled up.');
  await expect(status(page)).toHaveAttribute('data-status', 'offline');
  await page.close();
  await context.setOffline(false);

  const again = await context.newPage();
  await again.goto(`/write/${id}`);
  await expect(editor(again)).toHaveValue(
    'The kettle screamed. Her hands shook as she poured. Steam curled up.',
  );
  await expect(status(again)).toHaveAttribute('data-status', 'saved');
  await again.reload();
  await expect(editor(again)).toHaveValue(
    'The kettle screamed. Her hands shook as she poured. Steam curled up.',
  );
});

test('acceptance: the same draft in two tabs shows the conflict dialog', async ({
  page,
  context,
}) => {
  const id = await openWorkspace(page, 'Priya');
  const other = await context.newPage();
  await other.goto(`/write/${id}`);
  await expect(editor(other)).toBeVisible();

  await editor(page).fill('Written in the first tab.');
  await expect(status(page)).toHaveAttribute('data-status', 'saved');

  await editor(other).fill('Written in the second tab.');
  const dialog = other.getByRole('dialog', { name: 'This writing changed somewhere else' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText('Written in the first tab.')).toBeVisible();
  await expect(dialog.getByText('Written in the second tab.')).toBeVisible();
  await expectAccessible(other);

  await dialog.getByRole('button', { name: 'Keep my version' }).click();
  await expect(dialog).toBeHidden();
  await expect(status(other)).toHaveAttribute('data-status', 'saved');

  // The first tab's text is kept in the history.
  await page.reload();
  await expect(editor(page)).toHaveValue('Written in the second tab.');
  await page.getByRole('button', { name: '⟲ History' }).click();
  await page
    .getByRole('button', { name: /Saved by you/ })
    .first()
    .click();
  await expect(page.getByTestId('version-text')).toHaveText('Written in the first tab.');
});

test('acceptance: restore an older version from the history', async ({ page }) => {
  await openWorkspace(page, 'Kai');

  await editor(page).fill('First draft: the cat waited by the door.');
  await expect(status(page)).toHaveAttribute('data-status', 'saved');
  await page.getByRole('button', { name: 'Save version' }).click();
  await expect(page.getByText('Version saved')).toBeVisible();

  await editor(page).fill('Second draft: nothing like the first one.');
  await expect(status(page)).toHaveAttribute('data-status', 'saved');

  await page.getByRole('button', { name: '⟲ History' }).click();
  const history = page.getByRole('region', { name: '⟲ Version history' });
  await history.getByRole('button', { name: /Saved by you/ }).click();
  await expect(history.getByTestId('version-text')).toHaveText(
    'First draft: the cat waited by the door.',
  );
  await history.getByRole('button', { name: 'Compare with now' }).click();
  await expect(history.getByTestId('diff')).toContainText('[removed:');
  await expect(history.getByTestId('diff')).toContainText('[added:');
  await expectAccessible(page);

  await history.getByRole('button', { name: 'Restore this version' }).click();
  await expect(editor(page)).toHaveValue('First draft: the cat waited by the door.');
  await expect(page.getByText(/Restored the version from/)).toBeVisible();

  await page.reload();
  await expect(editor(page)).toHaveValue('First draft: the cat waited by the door.');
});
