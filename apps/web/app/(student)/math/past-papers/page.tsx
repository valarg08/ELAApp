import { MathSkillsView, PastPaperList } from '@storyforge/shared';
import Link from 'next/link';
import { TrackTabs } from '@/components/track-tabs';
import { ErrorMessage, PageShell } from '@/components/ui';
import { PastPaperLog } from '@/features/math/past-paper-log';
import { serverApi } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

/**
 * The past-paper log (math-design.md §4.15): official AMC 10 papers worked outside Owlery Academy,
 * logged as answer letters and topics only. Past AMC problems are never on the platform (© MAA).
 */
export default async function MathPastPapers() {
  const [list, skills] = await Promise.all([
    serverApi('/math/past-papers', PastPaperList),
    serverApi('/math/skills', MathSkillsView),
  ]);

  return (
    <PageShell width="max-w-4xl">
      <div className="flex flex-col gap-8">
        <div>
          <Link href="/math/progress" className="text-brand underline">
            ← My math progress
          </Link>
          <h1 className="mt-4 text-4xl font-bold">My past-paper log</h1>
          <p className="mt-2 text-lg text-muted">
            Worked an official AMC 10 paper on your own? Mark it with the official answers, then log
            your letters here. Owlery Academy scores it like the AMC (6 right, 1.5 blank, 0 wrong)
            and adds it to your AMC-score estimate and danger zones.
          </p>
        </div>
        <TrackTabs current="MATH" />
        {list && skills ? (
          <PastPaperLog initial={list} skills={skills.skills} />
        ) : (
          <ErrorMessage message="Could not load your past-paper log." />
        )}
      </div>
    </PageShell>
  );
}
