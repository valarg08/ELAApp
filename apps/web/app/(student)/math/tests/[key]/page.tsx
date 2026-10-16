import {
  LIGHT_REVIEW_SIZE,
  MathHome,
  MathStartKey,
  REVIEW_SIZE,
  SPRINT_MIN,
  SPRINT_MINUTES,
  SPRINT_SIZE,
} from '@storyforge/shared';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ButtonLink, PageShell } from '@/components/ui';
import { StartTest } from '@/features/math/test-player';
import { serverApi } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

/** The start page for a test, a sprint or a review (math-design.md §3.2 B3–B4, §3.4 D1–D3). */
export default async function MathTestPage({ params }: PageProps<'/math/tests/[key]'>) {
  const { key } = await params;
  const parsed = MathStartKey.safeParse(key);
  if (!parsed.success) notFound();
  const home = await serverApi('/math/home', MathHome);
  if (!home) notFound();

  let title: string;
  let about: string;
  let label = 'Start';
  let blocked: string | null = null;
  let lastAttemptId: string | null = null;

  if (parsed.data === 'sprint') {
    title = 'Sprint';
    about = `${SPRINT_SIZE} mixed multiple-choice problems in ${SPRINT_MINUTES} minutes, from the lessons you have finished, getting harder as you go. Scored like the AMC: 6 for right, 1.5 for blank, 0 for wrong.`;
    if (home.sprintProblems < SPRINT_MIN)
      blocked = `Finish a few more lessons first: a sprint needs at least ${SPRINT_MIN} multiple-choice problems.`;
    label = 'Start the sprint';
  } else if (parsed.data === 'review') {
    title = 'Today’s review';
    about = `Up to ${REVIEW_SIZE} problems: error-log redos and skills that are due, checked as you go. A few minutes a day keeps them fresh.`;
    if (home.review.doneToday) blocked = 'Done for today. Come back tomorrow.';
    else if (home.review.due === 0)
      blocked = 'Nothing is due yet. Finish a lesson to start the review.';
    label = 'Start today’s review';
  } else if (parsed.data === 'light-review') {
    title = 'Light review';
    about = `${LIGHT_REVIEW_SIZE} easier problems on skills you already know, with fact cards to read first. Good for the last days before the contest.`;
    if (home.review.lightAvailable === 0)
      blocked = 'No skills are Strong yet: keep practising and this opens up.';
    label = 'Start the light review';
  } else {
    const card = home.tests.find((t) => t.key === parsed.data);
    if (!card) notFound();
    title = card.title;
    about = `${card.instructions} ${card.problemCount} problems${card.timeLimitMinutes ? `, ${card.timeLimitMinutes} minutes` : ''}.`;
    if (!card.unlocked) blocked = card.lockedReason ?? 'Not open yet.';
    label = card.openAttemptId ? 'Carry on' : card.attempts > 0 ? 'Take it again' : 'Start';
    lastAttemptId = card.lastAttemptId;
  }

  return (
    <PageShell width="max-w-4xl">
      <div className="flex flex-col gap-6">
        <Link href="/math" className="text-brand underline">
          ← Math
        </Link>
        <div>
          <h1 className="text-4xl font-bold">{title}</h1>
          <p className="mt-2 text-lg text-muted">{about}</p>
        </div>
        {blocked ? (
          <p className="rounded-2xl border border-dashed border-border p-5 text-lg">{blocked}</p>
        ) : (
          <StartTest startKey={parsed.data} label={label} />
        )}
        {lastAttemptId && (
          <ButtonLink
            href={`/math/attempts/${encodeURIComponent(lastAttemptId)}`}
            variant="secondary"
            className="self-start"
          >
            See my last result
          </ButtonLink>
        )}
      </div>
    </PageShell>
  );
}
