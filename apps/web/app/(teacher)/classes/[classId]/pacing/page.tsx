import { ClassSummary, ClassUnitPacing } from '@storyforge/shared';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageShell } from '@/components/ui';
import { serverApi } from '@/lib/server-api';
import { PacingTable } from './pacing-table';

export const dynamic = 'force-dynamic';

export default async function PacingPage({ params }: PageProps<'/classes/[classId]/pacing'>) {
  const { classId } = await params;
  const [klass, units] = await Promise.all([
    serverApi(`/teacher/classes/${classId}`, ClassSummary),
    serverApi(`/teacher/classes/${classId}/units`, ClassUnitPacing.array()),
  ]);
  if (!klass || !units) notFound();

  return (
    <PageShell full>
      <div className="flex flex-col gap-6">
        <div>
          <Link href={`/classes/${classId}`} className="text-brand underline">
            ← {klass.name}
          </Link>
          <h1 className="mt-3 text-3xl font-bold">Units &amp; pacing</h1>
          <p className="mt-1 text-muted">
            Choose which units your students can open, and when they&apos;re due. Unit 1 is open by
            default.
          </p>
        </div>
        <PacingTable classId={classId} units={units} />
      </div>
    </PageShell>
  );
}
