import { SubmissionDetail } from '@storyforge/shared';
import Link from 'next/link';
import { CourseShell } from '@/components/course-shell';
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

  if (submission) {
    return (
      <CourseShell
        track={submission.unit.track}
        unitSlug={submission.unit.slug}
        lessonId={submission.lesson?.id}
        wide
      >
        <WritePage key={submission.id} submission={submission} />
      </CourseShell>
    );
  }
  return (
    <PageShell width="max-w-6xl">
      <Card className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold">We couldn&apos;t find this writing</h1>
        <Link href="/home" className="text-brand underline">
          ← Back to my journey
        </Link>
      </Card>
    </PageShell>
  );
}
