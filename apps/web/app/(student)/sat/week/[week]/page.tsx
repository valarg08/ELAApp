import { SAT_FORMAT, SAT_RULES, SatWeekSummary } from '@storyforge/shared';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ButtonLink, PageShell } from '@/components/ui';
import { StartSatTest } from '@/features/sat/sat-start';
import { getMe, serverApi } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

/**
 * The page before a weekly SAT test (sat-design.md): the rules of the test, then Start, Continue
 * or the finished result.
 */
export default async function SatWeekPage({ params }: { params: Promise<{ week: string }> }) {
  const week = Number((await params).week);
  if (!Number.isInteger(week)) notFound();
  const me = await getMe();
  if (!me) redirect('/join');
  const weeks = await serverApi('/sat/weeks', SatWeekSummary.array());
  const info = weeks?.find((w) => w.week === week);
  if (!info) notFound();

  return (
    <PageShell width="max-w-4xl">
      <div className="flex flex-col gap-6">
        <Link href="/sat" className="text-brand underline">
          ← SAT Math
        </Link>
        <div>
          <p className="text-sm font-semibold tracking-widest text-brand uppercase">
            Week {info.week}
          </p>
          <h1 className="text-4xl font-bold">{info.title}</h1>
          <p className="mt-2 text-lg text-muted">
            {info.sample
              ? `A short sample test: ${info.questions} questions, two modules of ${info.minutes} minutes. The real weekly test has ${SAT_FORMAT.totalQuestions} questions in ${SAT_FORMAT.totalMinutes} minutes.`
              : `${SAT_FORMAT.totalQuestions} questions in ${SAT_FORMAT.totalMinutes} minutes: two modules of ${SAT_FORMAT.questionsPerModule} questions, ${SAT_FORMAT.minutesPerModule} minutes each.`}
          </p>
        </div>

        <section aria-labelledby="sat-before" className="flex flex-col gap-4">
          <h2 id="sat-before" className="text-2xl font-semibold">
            Before you begin
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {SAT_RULES.map((group, i) => (
              <section
                key={group.title}
                aria-labelledby={`sat-before-${i}`}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                <h3 id={`sat-before-${i}`} className="text-lg font-bold">
                  {group.title}
                </h3>
                <ul className="mt-2 ml-5 flex list-disc flex-col gap-2">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </section>

        <section aria-labelledby="sat-go" className="flex flex-col gap-3">
          <h2 id="sat-go" className="text-2xl font-semibold">
            {info.status === 'done' ? 'Your result' : 'Ready?'}
          </h2>
          {info.status === 'done' && info.attemptId ? (
            <>
              <p>
                You got {info.correct} of {info.total} right.
              </p>
              <ButtonLink href={`/sat/test/${info.attemptId}`} className="self-start">
                See the review
              </ButtonLink>
            </>
          ) : (
            <>
              <p className="text-muted">
                {info.status === 'in-progress'
                  ? 'Your test is open. The clock keeps running while you are away, so carry on now.'
                  : 'Find a quiet place, have scrap paper ready and start when you can do the whole test without a break. The clock starts as soon as you press the button.'}
              </p>
              <div className="self-start">
                <StartSatTest
                  week={info.week}
                  label={info.status === 'in-progress' ? 'Continue the test' : 'Start the test'}
                />
              </div>
            </>
          )}
        </section>
      </div>
    </PageShell>
  );
}
