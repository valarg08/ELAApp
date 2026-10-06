import { readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';
import { ActivitiesFile, decodePictureSecret, PICTURES } from '@storyforge/shared';

/** Correct answers come straight from the content files, so the test follows content edits. */
const activities = ActivitiesFile.parse(
  JSON.parse(
    readFileSync(
      new URL('../../../content/units/unit-01/activities.json', import.meta.url),
      'utf8',
    ),
  ),
);
type Activity = (typeof activities)[number];
const isType = <T extends Activity['type']>(
  a: Activity,
  type: T,
): a is Extract<Activity, { type: T }> => a.type === type;
function activity<T extends Activity['type']>(
  key: string,
  type: T,
): Extract<Activity, { type: T }> {
  const a = activities.find((x) => x.key === key);
  if (!a || !isType(a, type)) throw new Error(`Activity ${key} is not ${type}`);
  return a;
}

async function setUpStudent(page: Page) {
  await page.goto('/register');
  await page.getByLabel('Your name (shown to students)').fill('Ms Okafor');
  await page.getByLabel('Email').fill(`okafor-${Date.now()}@example.test`);
  await page.getByLabel('Password').fill('e2e-teacher-password-2');
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await page.getByLabel('Class name').fill('6C Storytellers');
  await page.getByRole('button', { name: 'Create class', exact: true }).click();
  const joinCode = (await page.getByTestId('join-code').textContent())?.trim() ?? '';
  await page.getByLabel('Student names').fill('Zara');
  await page.getByRole('button', { name: 'Add 1 student', exact: true }).click();
  const card = page.getByTestId('credential');
  const username = (await card.getAttribute('data-username')) ?? '';
  const secret = (await card.getAttribute('data-secret')) ?? '';
  await page.getByRole('button', { name: 'Log out', exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  return { joinCode, username, secret };
}

async function studentLogin(page: Page, s: { joinCode: string; username: string; secret: string }) {
  await page.goto(`/join?code=${s.joinCode}&user=${s.username}`);
  for (const id of decodePictureSecret(s.secret) ?? []) {
    const label = PICTURES.find((p) => p.id === id)?.label ?? id;
    await page
      .getByRole('group', { name: 'Pictures' })
      .getByRole('button', { name: label, exact: true })
      .click();
  }
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await expect(page).toHaveURL(/\/home$/);
}

test('acceptance: a student plays Unit 1, Lesson 1 end to end and progress persists', async ({
  page,
}) => {
  const student = await setUpStudent(page);
  await studentLogin(page, student);

  // Unit map → unit → lesson.
  await expect(page.getByText('0 of 4 lessons done')).toBeVisible();
  await page.getByRole('link', { name: /Keep going/ }).click();
  await expect(page.getByRole('heading', { name: 'Foundations' })).toBeVisible();
  await page.getByRole('link', { name: /Six Words, Big Story/ }).click();
  await expect(page.getByRole('heading', { name: 'Lesson 1: Six Words, Big Story' })).toBeVisible();

  // 1. Hook: pick a sentence to see the reveal.
  await page.getByRole('button', { name: /Bought milk\. Came home\. Door open\./ }).click();
  await expect(page.getByText(/That's the power of a six-word story/)).toBeVisible();
  await page.getByRole('button', { name: 'Next', exact: true }).click();

  // 2. Learn: four cards, one is a clue hunt.
  await page.getByRole('button', { name: 'Next card →' }).click();
  await page.getByRole('button', { name: 'Next card →' }).click();
  await expect(page.getByRole('button', { name: 'Next card →' })).toBeDisabled();
  await page.getByRole('button', { name: 'New', exact: true }).click();
  await page.getByRole('button', { name: 'Same', exact: true }).click();
  await expect(page.getByText('✓ You found them all!')).toBeVisible();
  await page.getByRole('button', { name: 'Next card →' }).click();
  await page.getByRole('button', { name: 'Got it!' }).click();

  // 3. Practice: sort, highlight, multiple choice.
  const sort = activity('u01.six-word-sort', 'SORT');
  for (const item of sort.items) {
    const bucket = sort.buckets.find((b) => b.id === item.bucketId)?.label ?? '';
    await page.getByRole('button', { name: `Put "${item.text}" in ${bucket}` }).click();
  }
  await page.getByRole('button', { name: 'Check', exact: true }).click();
  await expect(page.getByText('✓ All sorted!')).toBeVisible();
  await page.getByRole('button', { name: 'Done', exact: true }).click();

  const highlight = activity('u01.six-word-highlight', 'HIGHLIGHT');
  for (const target of highlight.targets) {
    await page.getByRole('button', { name: new RegExp(`^${target}$`, 'i') }).click();
  }
  await page.getByRole('button', { name: 'Check', exact: true }).click();
  await expect(page.getByText('✓ You got them all!')).toBeVisible();
  await page.getByRole('button', { name: 'Done', exact: true }).click();

  const mc = activity('u01.six-word-mc', 'MULTIPLE_CHOICE');
  for (const [i, q] of mc.questions.entries()) {
    const answer = q.options.find((o) => o.id === q.correctOptionId)?.text ?? '';
    await page.getByLabel(answer, { exact: true }).check();
    await page.getByRole('button', { name: 'Check', exact: true }).click();
    await expect(page.getByText('✓ Yes!')).toBeVisible();
    await page
      .getByRole('button', {
        name: i === mc.questions.length - 1 ? 'Done' : 'Next question',
        exact: true,
      })
      .click();
  }

  // 4. Challenge: exactly six words, checked live.
  const box = page.getByLabel('Your writing');
  await box.fill('Too short for six.');
  await expect(page.getByText('Use exactly 6 words (you have 4).')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Submit', exact: true })).toBeDisabled();
  await box.fill('Lost my map. Found new friends.');
  await expect(page.getByText('✓ Ready to submit!')).toBeVisible();
  await page.getByRole('button', { name: 'Submit', exact: true }).click();

  // 5. Reflect.
  await page.getByLabel(/proudest of/).fill('"Friends" shows the surprise.');
  await page.getByLabel(/question do you hope/).fill('Who were the friends?');
  // The radio itself is visually hidden; students click its card.
  await page.getByText('Pretty confident', { exact: true }).click();
  await expect(page.getByLabel('Pretty confident')).toBeChecked();
  await page.getByRole('button', { name: 'Finish lesson', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Lesson complete!' })).toBeVisible();

  // Progress survives a reload and shows on the unit map.
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Lesson complete!' })).toBeVisible();
  await page.getByRole('button', { name: /Challenge/ }).click();
  await expect(page.getByLabel('Your writing')).toHaveValue('Lost my map. Found new friends.');
  await page.goto('/home');
  await expect(page.getByText('1 of 4 lessons done')).toBeVisible();
});
