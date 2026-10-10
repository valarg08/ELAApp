import { SubmissionDetail } from '@storyforge/shared';
import Link from 'next/link';
import { Card, PageShell } from '@/components/ui';
import { WritePage } from '@/features/writing/write-page';
import { serverApi } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

export default async function WriteRoute({ params }: PageProps<'/write/[submissionId]'>) {
  const { submissionId } = await params;
  const submission = await serverApi(
    `/submissions/${encodeURIComponent(submissionId)}`,
    SubmissionDetail,
  );

  return (
    <PageShell width="max-w-6xl">
      {submission ? (
        <WritePage key={submission.id} submission={submission} />
      ) : (
        <Card className="flex flex-col gap-3">
          <h1 className="text-2xl font-bold">We couldn&apos;t find this writing</h1>
          <Link href="/home" className="text-brand underline">
            ← Back to my journey
          </Link>
        </Card>
      )}
    </PageShell>
  );
}
