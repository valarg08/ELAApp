import { TrackProgress } from '@storyforge/shared';
import Link from 'next/link';
import { TrackProgressView } from '@/components/track-progress';
import { TrackTabs } from '@/components/track-tabs';
import { ErrorMessage, PageShell } from '@/components/ui';
import { serverApi } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

/** The Essay Writing progress tracker (DESIGN.md §9.12). */
export default async function EssayProgress() {
  const progress = await serverApi('/progress?track=ESSAY', TrackProgress);

  return (
    <PageShell width="max-w-5xl">
      <div className="flex flex-col gap-8">
        <div>
          <Link href="/essays" className="text-brand underline">
            ← Essay Writing
          </Link>
          <h1 className="mt-4 text-4xl font-bold">My essay progress</h1>
        </div>
        <TrackTabs current="ESSAY" />
        {progress ? (
          <TrackProgressView progress={progress} />
        ) : (
          <ErrorMessage message="Could not load your progress." />
        )}
      </div>
    </PageShell>
  );
}
