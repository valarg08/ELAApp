import { ClassSummary, SafetyFlagView } from '@storyforge/shared';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageShell } from '@/components/ui';
import { serverApi } from '@/lib/server-api';
import { FlagInbox } from './flag-inbox';

export const dynamic = 'force-dynamic';

export default async function FlagsPage({ params }: PageProps<'/classes/[classId]/flags'>) {
  const { classId } = await params;
  const [klass, flags] = await Promise.all([
    serverApi(`/teacher/classes/${classId}`, ClassSummary),
    serverApi(`/teacher/classes/${classId}/flags?status=ALL`, SafetyFlagView.array()),
  ]);
  if (!klass || !flags) notFound();

  return (
    <PageShell full>
      <div className="flex flex-col gap-6">
        <div>
          <Link href={`/classes/${classId}`} className="text-brand underline">
            ← {klass.name}
          </Link>
          <h1 className="mt-3 text-3xl font-bold">Safety flags</h1>
          <p className="mt-1 text-muted">
            Writing that may need your attention, found by Quill’s safety check or the word list.
            Students only see “Your teacher will read it soon” for held pieces.
          </p>
        </div>
        <FlagInbox initial={flags} />
      </div>
    </PageShell>
  );
}
