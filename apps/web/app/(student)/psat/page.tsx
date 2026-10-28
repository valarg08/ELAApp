import { UnitSummary } from '@storyforge/shared';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CourseShell } from '@/components/course-shell';
import { TrackTabs } from '@/components/track-tabs';
import { UnitCard } from '@/components/unit-card';
import { currentUnit } from '@/lib/current-unit';
import { getMe, serverApi } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

const tile =
  'block rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-brand focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand';

/**
 * The PSAT Math track (psat-design.md): one unit for each of the PSAT's four math areas, each
 * lesson teaching a topic with worked examples, then typed practice with hints and a four-choice
 * PSAT-style challenge with worked solutions. Every unit is open; the review sheet sits beside them.
 */
export default async function PsatHome() {
  const [me, units] = await Promise.all([
    getMe(),
    serverApi('/units?track=PSAT', UnitSummary.array()),
  ]);
  if (!me) redirect('/join');
  const current = currentUnit(units ?? []);

  return (
    <CourseShell track="PSAT">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-bold">PSAT Math</h1>
          <p className="mt-2 text-lg text-muted">
            Get ready for the math section of the PSAT/NMSQT. Each lesson teaches one topic with
            worked examples, then you practise with hints and finish with four-choice PSAT-style
            questions and full explanations. Start with any unit.
          </p>
        </div>

        <TrackTabs current="PSAT" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {current && (
            <Link href={`/units/${current.slug}`} className={`${tile} border-2 border-accent`}>
              <p className="text-sm font-semibold tracking-widest text-brand uppercase">
                Keep going
              </p>
              <p className="mt-1 text-2xl font-bold">
                PSAT Unit {current.number}: {current.title}
              </p>
              <p className="mt-1 text-muted">
                {current.completedLessons} of {current.lessonCount} lessons done
              </p>
            </Link>
          )}
          <Link href="/psat/review" className={tile}>
            <p className="text-lg font-bold">PSAT review</p>
            <p className="text-muted">The PSAT math facts on one printable sheet</p>
          </Link>
          <section
            aria-labelledby="about-psat"
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <h2 id="about-psat" className="text-lg font-bold">
              About the test
            </h2>
            <ul className="mt-1 ml-5 list-disc text-muted">
              <li>Two modules, 44 questions, 70 minutes</li>
              <li>Four-choice and typed-answer questions</li>
              <li>A calculator is allowed on every question</li>
              <li>No penalty for a wrong answer</li>
            </ul>
          </section>
        </div>

        <section aria-labelledby="psat-units" className="flex flex-col gap-4">
          <h2 id="psat-units" className="text-2xl font-semibold">
            Units
          </h2>
          {(units ?? []).length === 0 ? (
            <p className="text-muted">No units yet.</p>
          ) : (
            <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(units ?? []).map((u) => (
                <li key={u.id}>
                  <UnitCard unit={u} />
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </CourseShell>
  );
}
