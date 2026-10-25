import {
  MENTAL_LEVEL_CHECK_SIZE,
  MENTAL_LEVEL_PASS,
  MENTAL_PLACEMENT_PER_LEVEL,
  MENTAL_REVIEW_SIZE,
  MENTAL_SPRINT_MIN,
  MENTAL_SPRINT_SECONDS,
  MENTAL_SPRINT_SIZE,
  MentalHome,
  MentalStartKey,
} from '@storyforge/shared';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CourseShell } from '@/components/course-shell';
import { ButtonLink } from '@/components/ui';
import { StartTest } from '@/features/math/test-player';
import { serverApi } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

/** The start page of a Mental Math review, sprint, placement or level check (mental-math-design.md). */
export default async function MentalTestPage({ params }: PageProps<'/mental/tests/[key]'>) {
  const { key } = await params;
  const parsed = MentalStartKey.safeParse(key);
  if (!parsed.success) notFound();
  const home = await serverApi('/mental/home', MentalHome);
  const practice = home?.practice;
  if (!practice) notFound();

  let title: string;
  let about: string;
  let label = 'Start';
  let blocked: string | null = null;
  let carryOn: string | null = null;
  let lastAttemptId: string | null = null;

  if (parsed.data === 'mental-review') {
    title = 'Today’s review';
    about = `Up to ${MENTAL_REVIEW_SIZE} questions from the lessons you have finished: mistakes to redo first, then skills that are due. Each answer is checked straight away. A few minutes every day keeps the patterns fresh.`;
    if (practice.review.doneToday) blocked = 'Done for today. Come back tomorrow!';
    else if (practice.review.due === 0)
      blocked = 'Nothing is due yet. Finish a lesson, and the review brings it back later.';
    label = 'Start today’s review';
  } else if (parsed.data === 'mental-sprint') {
    title = 'Speed sprint';
    about = `${MENTAL_SPRINT_SIZE} quick questions from the lessons you have finished, in ${MENTAL_SPRINT_SECONDS / 60} minutes. Get as many right as you can, then try to beat your best. Right first, fast second!`;
    if (practice.sprint.available < MENTAL_SPRINT_MIN)
      blocked = 'Finish a Mental Math lesson first: sprints use what you have learned.';
    label = 'Start the sprint';
    lastAttemptId = practice.sprint.lastAttemptId;
  } else if (parsed.data === 'mental-placement') {
    title = 'Placement check';
    about = `Not sure where to start? Answer ${MENTAL_PLACEMENT_PER_LEVEL} questions from each of the four levels, easiest first. There is no timer and no hints: just do what you can and leave the rest blank. Your result shows the level to start at and opens its units.`;
    carryOn = practice.placement.openAttemptId;
    label = carryOn ? 'Carry on' : practice.placement.lastAttemptId ? 'Take it again' : 'Start';
    lastAttemptId = practice.placement.lastAttemptId;
  } else {
    const level = Number(parsed.data.slice('mental-level-'.length));
    const card = practice.levelChecks.find((c) => c.level === level);
    if (!card) notFound();
    title = `Level ${level} check: ${card.title}`;
    about = `${MENTAL_LEVEL_CHECK_SIZE} questions from every unit of Level ${level}, easiest first, no hints. Get ${MENTAL_LEVEL_PASS} right to earn the Level ${level} badge. Each try gives you new numbers.`;
    if (!card.unlocked) blocked = card.lockedReason ?? 'Not open yet.';
    carryOn = card.openAttemptId;
    label = carryOn ? 'Carry on' : card.lastAttemptId ? 'Take it again' : 'Start';
    lastAttemptId = card.lastAttemptId;
  }

  return (
    <CourseShell track="MENTAL">
      <div className="flex flex-col gap-6">
        <Link href="/mental" className="text-brand underline">
          ← Mental Math
        </Link>
        <div>
          <h1 className="text-4xl font-bold">{title}</h1>
          <p className="mt-2 text-lg text-muted">{about}</p>
        </div>
        {blocked ? (
          <p className="rounded-2xl border border-dashed border-border p-5 text-lg">{blocked}</p>
        ) : carryOn ? (
          <ButtonLink
            href={`/mental/attempts/${encodeURIComponent(carryOn)}`}
            className="self-start"
          >
            {label}
          </ButtonLink>
        ) : (
          <StartTest startKey={parsed.data} label={label} attemptsPath="/mental/attempts" />
        )}
        {lastAttemptId && (
          <ButtonLink
            href={`/mental/attempts/${encodeURIComponent(lastAttemptId)}`}
            variant="secondary"
            className="self-start"
          >
            See my last result
          </ButtonLink>
        )}
      </div>
    </CourseShell>
  );
}
