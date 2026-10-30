import { SAT_DOMAINS, SatMistakes } from '@storyforge/shared';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CourseShell } from '@/components/course-shell';
import { MathText } from '@/components/math-text';
import { ProblemFigure } from '@/features/math/problem-view';
import { getMe, serverApi } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

/**
 * The SAT's own mistakes list (sat-design.md): every question missed or left blank in a finished
 * test, by content area, with the answer and the worked solution one click away.
 */
export default async function SatMistakesPage() {
  const me = await getMe();
  if (!me) redirect('/join');
  const mistakes = (await serverApi('/sat/mistakes', SatMistakes)) ?? [];

  return (
    <CourseShell track="SAT">
      <div className="flex flex-col gap-6">
        <Link href="/sat" className="text-brand underline">
          ← SAT Math
        </Link>
        <div>
          <h1 className="text-4xl font-bold">My mistakes</h1>
          <p className="mt-2 text-lg text-muted">
            Questions you missed or left blank in your finished tests. Try each one again before you
            open its solution.
          </p>
        </div>

        {mistakes.length === 0 ? (
          <p className="text-muted">
            Nothing here yet. Finish a weekly test and the questions you miss will collect here.
          </p>
        ) : (
          SAT_DOMAINS.map((d) => {
            const list = mistakes.filter((m) => m.domain === d.id);
            if (list.length === 0) return null;
            return (
              <section key={d.id} aria-labelledby={`m-${d.id}`} className="flex flex-col gap-3">
                <h2 id={`m-${d.id}`} className="text-2xl font-semibold">
                  {d.label} <span className="font-normal text-muted">({list.length})</span>
                </h2>
                <ol className="flex flex-col gap-4">
                  {list.map((m) => (
                    <li key={m.id} className="rounded-2xl border border-border bg-card p-4">
                      <p className="text-sm font-semibold text-muted">
                        Week {m.week} · {m.skillLabel}
                      </p>
                      <p className="mt-1 text-lg">
                        <MathText text={m.prompt} />
                      </p>
                      {m.figure && <ProblemFigure figure={m.figure} />}
                      {m.choices && (
                        <ol className="mt-2 flex flex-col gap-1" aria-label="Choices">
                          {m.choices.map((c, i) => (
                            <li key={i}>
                              <strong>{'ABCD'[i]}.</strong> <MathText text={c} />
                            </li>
                          ))}
                        </ol>
                      )}
                      <details className="mt-3 rounded-xl bg-brand/5 p-3">
                        <summary className="cursor-pointer font-semibold">
                          Show my answer, the right answer and the solution
                        </summary>
                        <p className="mt-2">
                          You answered: <strong>{m.yourAnswer ?? 'nothing'}</strong>. Right answer:{' '}
                          <strong>{m.correctAnswer}</strong>.
                        </p>
                        <p className="mt-2">
                          <MathText text={m.solution} />
                        </p>
                      </details>
                    </li>
                  ))}
                </ol>
              </section>
            );
          })
        )}
      </div>
    </CourseShell>
  );
}
