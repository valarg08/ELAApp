import { MathSkillsView, TrackProgress, UnitSummary } from '@storyforge/shared';
import Link from 'next/link';
import { TrackProgressView } from '@/components/track-progress';
import { TrackTabs } from '@/components/track-tabs';
import { ErrorMessage, PageShell } from '@/components/ui';
import { SkillsView } from '@/features/math/skills-view';
import { serverApi } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

/** The Math progress tracker (math-design.md): skills and danger zones, then lessons and badges. */
export default async function MathProgress() {
  const [progress, skills, units] = await Promise.all([
    serverApi('/progress?track=MATH', TrackProgress),
    serverApi('/math/skills', MathSkillsView),
    serverApi('/units?track=MATH', UnitSummary.array()),
  ]);

  return (
    <PageShell width="max-w-5xl">
      <div className="flex flex-col gap-8">
        <div>
          <Link href="/math" className="text-brand underline">
            ← Math
          </Link>
          <h1 className="mt-4 text-4xl font-bold">My math progress</h1>
        </div>
        <TrackTabs current="MATH" />
        {skills && <SkillsView view={skills} units={units ?? []} />}
        {progress ? (
          <section aria-labelledby="lessons-progress" className="flex flex-col gap-4">
            <h2 id="lessons-progress" className="text-2xl font-semibold">
              Lessons and badges
            </h2>
            <TrackProgressView progress={progress} />
          </section>
        ) : (
          <ErrorMessage message="Could not load your progress." />
        )}
      </div>
    </PageShell>
  );
}
