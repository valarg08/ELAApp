'use client';

import {
  type LessonDetail,
  LessonProgressView,
  STEP_IDS,
  STEP_LABELS,
  type StepId,
  unitLabel,
} from '@storyforge/shared';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ButtonLink, Card, ErrorMessage } from '@/components/ui';
import { ApiError, apiJson } from '@/lib/api-client';
import { ChallengeStep } from './steps/challenge-step';
import { HookStep } from './steps/hook-step';
import { LearnStep } from './steps/learn-step';
import { PracticeStep } from './steps/practice-step';
import { ReflectStep } from './steps/reflect-step';

const FINISHED = STEP_IDS.length;

/**
 * The 5-step lesson engine (DESIGN.md §9.1): hook → learn → practice → challenge → reflect.
 * Students may go back freely; moving forward requires finishing the current step.
 */
export function LessonPlayer({ lesson }: { lesson: LessonDetail }) {
  const router = useRouter();
  const [completed, setCompleted] = useState<StepId[]>(lesson.progress.completedSteps);
  const firstOpen = STEP_IDS.findIndex((s) => !completed.includes(s));
  const [view, setView] = useState<number>(firstOpen === -1 ? FINISHED : firstOpen);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canOpen = (i: number) => i <= (firstOpen === -1 ? FINISHED : firstOpen);

  async function complete(stepId: StepId, body: object) {
    setBusy(true);
    setError(null);
    try {
      const progress = await apiJson(
        `/lessons/${lesson.id}/steps/${stepId}/complete`,
        LessonProgressView,
        'POST',
        body,
      );
      setCompleted(progress.completedSteps);
      setView(STEP_IDS.indexOf(stepId) + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (stepId === 'reflect') router.refresh();
    } finally {
      setBusy(false);
    }
  }

  const [hook, learn, practice, challenge, reflect] = lesson.steps;
  // Steps without their own error display (hook, learn) report failures here.
  const completeOrReport = (stepId: StepId) => (body: object) =>
    complete(stepId, body).catch((e: unknown) =>
      setError(
        e instanceof ApiError
          ? e.userMessage
          : 'Could not save. Check your connection and try again.',
      ),
    );
  const done = (id: StepId) => completed.includes(id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href={`/units/${lesson.unit.slug}`} className="text-brand underline">
          ← {unitLabel(lesson.unit.track, lesson.unit.number)}: {lesson.unit.title}
        </Link>
        <h1 className="mt-3 text-3xl font-bold">
          Lesson {lesson.order}: {lesson.title}
        </h1>
      </div>

      <nav aria-label="Lesson steps">
        <ol className="grid grid-cols-5 gap-2">
          {STEP_IDS.map((id, i) => {
            const current = view === i;
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => setView(i)}
                  disabled={!canOpen(i)}
                  aria-current={current ? 'step' : undefined}
                  className={`flex w-full flex-col items-center gap-1 rounded-xl px-1 py-2 text-xs font-semibold transition focus-visible:outline-3 focus-visible:outline-brand sm:text-sm ${
                    current
                      ? 'bg-brand text-white'
                      : done(id)
                        ? 'bg-card text-ok'
                        : 'bg-card text-muted'
                  } disabled:opacity-50`}
                >
                  <span aria-hidden="true">{done(id) ? '✓' : i + 1}</span>
                  {STEP_LABELS[id]}
                  <span className="sr-only">
                    {done(id) ? ' (done)' : canOpen(i) ? '' : ' (locked)'}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <ErrorMessage message={error} />

      <Card>
        {view === 0 && (
          <HookStep
            step={hook}
            done={done('hook')}
            busy={busy}
            onComplete={completeOrReport('hook')}
          />
        )}
        {view === 1 && (
          <LearnStep
            lessonId={lesson.id}
            step={learn}
            done={done('learn')}
            busy={busy}
            onComplete={completeOrReport('learn')}
          />
        )}
        {view === 2 && (
          <PracticeStep
            lessonId={lesson.id}
            step={practice}
            activities={lesson.activities}
            done={done('practice')}
            busy={busy}
            onComplete={(b) => complete('practice', b)}
          />
        )}
        {view === 3 && (
          <ChallengeStep
            step={challenge}
            activities={lesson.activities}
            activityId={lesson.challengeActivityId}
            done={done('challenge')}
            onSubmitted={({ lessonProgress }) => {
              // Stay on the challenge: Quill's feedback appears below, and the student may revise.
              if (lessonProgress) setCompleted(lessonProgress.completedSteps);
            }}
            onContinue={() => {
              setView(STEP_IDS.indexOf('reflect'));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
        {view === 4 && (
          <ReflectStep
            step={reflect}
            done={done('reflect')}
            busy={busy}
            onComplete={(b) => complete('reflect', b)}
          />
        )}
        {view === FINISHED && (
          <div className="flex flex-col items-start gap-4" aria-live="polite">
            <p className="text-5xl" aria-hidden="true">
              🎉
            </p>
            <h2 className="text-3xl font-bold">Lesson complete!</h2>
            <p className="text-lg text-muted">
              Great work on “{lesson.title}”. You can look back at any step using the buttons above.
            </p>
            <div className="flex flex-wrap gap-3">
              {lesson.nextLessonId ? (
                <ButtonLink href={`/lessons/${lesson.nextLessonId}`}>Next lesson →</ButtonLink>
              ) : null}
              <ButtonLink href={`/units/${lesson.unit.slug}`} variant="secondary">
                Back to the unit
              </ButtonLink>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
