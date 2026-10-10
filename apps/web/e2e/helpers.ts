import { AxeBuilder } from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';
import {
  CSRF_COOKIE,
  CSRF_HEADER,
  LessonDetail,
  PICTURES,
  SubmissionDetail,
  UnitDetail,
  decodePictureSecret,
} from '@storyforge/shared';

export interface StudentLogin {
  joinCode: string;
  username: string;
  secret: string;
}

/** Register a teacher, create a class with one student, log out. Returns the student's login. */
export async function setUpStudent(page: Page, name = 'Zara'): Promise<StudentLogin> {
  await page.goto('/register');
  await page.getByLabel('Your name (shown to students)').fill('Ms Okafor');
  await page.getByLabel('Email').fill(`okafor-${Date.now()}@example.test`);
  await page.getByLabel('Password').fill('e2e-teacher-password-2');
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await page.getByLabel('Class name').fill('6C Storytellers');
  await page.getByRole('button', { name: 'Create class', exact: true }).click();
  const joinCode = (await page.getByTestId('join-code').textContent())?.trim() ?? '';
  await page.getByLabel('Student names').fill(name);
  await page.getByRole('button', { name: 'Add 1 student', exact: true }).click();
  const card = page.getByTestId('credential');
  const username = (await card.getAttribute('data-username')) ?? '';
  const secret = (await card.getAttribute('data-secret')) ?? '';
  await page.getByRole('button', { name: 'Log out', exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  return { joinCode, username, secret };
}

export async function studentLogin(page: Page, s: StudentLogin): Promise<void> {
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

/** Open (create) the logged-in student's working copy for a Unit 1 lesson challenge, via the API. */
export async function openChallenge(page: Page, lessonOrder: number): Promise<SubmissionDetail> {
  const api = page.request;
  const unit = UnitDetail.parse(await (await api.get('/api/v1/units/foundations')).json());
  const lessonId = unit.lessons.find((l) => l.order === lessonOrder)?.id ?? '';
  const lesson = LessonDetail.parse(await (await api.get(`/api/v1/lessons/${lessonId}`)).json());
  const csrf = (await page.context().cookies()).find((c) => c.name === CSRF_COOKIE)?.value ?? '';
  const res = await api.post('/api/v1/submissions', {
    data: { activityId: lesson.challengeActivityId },
    headers: { [CSRF_HEADER]: csrf },
  });
  expect(res.ok()).toBe(true);
  return SubmissionDetail.parse(await res.json());
}

/** Fail on serious or critical accessibility problems (DESIGN.md §13.1). */
export async function expectAccessible(page: Page): Promise<void> {
  const { violations } = await new AxeBuilder({ page }).analyze();
  const serious = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  expect(
    serious.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(' ')).join(', ')})`),
  ).toEqual([]);
}
