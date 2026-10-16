import { TrackProgress } from '@storyforge/shared';
import Link from 'next/link';
import { TrackProgressView } from '@/components/track-progress';
import { TrackTabs } from '@/components/track-tabs';
import { ErrorMessage, PageShell } from '@/components/ui';
import { serverApi } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

/** The Math progress tracker (DESIGN.md §9.13), with the five strand badges. */
export default async function MathProgress() {
  const progress = await serverApi('/progress?track=MATH', TrackProgress);

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
        {progress ? (
          <TrackProgressView progress={progress} />
        ) : (
          <ErrorMessage message="Could not load your progress." />
        )}
      </div>
    </PageShell>
  );
}
