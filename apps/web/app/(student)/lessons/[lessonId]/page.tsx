import { LessonDetail } from '@storyforge/shared';
import Link from 'next/link';
import { Card, PageShell } from '@/components/ui';
import { LessonPlayer } from '@/features/lesson-player/lesson-player';
import { serverApi } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

export default async function LessonPage({ params }: PageProps<'/lessons/[lessonId]'>) {
  const { lessonId } = await params;
  const lesson = await serverApi(`/lessons/${encodeURIComponent(lessonId)}`, LessonDetail);

  return (
    <PageShell width="max-w-3xl">
      {lesson ? (
        // Remount when switching lessons so step state starts fresh.
        <LessonPlayer key={lesson.id} lesson={lesson} />
      ) : (
        <Card className="flex flex-col gap-3">
          <h1 className="text-2xl font-bold">This lesson isn&apos;t open yet</h1>
          <p className="text-muted">Your teacher may not have unlocked it. Check back soon!</p>
          <Link href="/home" className="text-brand underline">
            ← Back to my journey
          </Link>
        </Card>
      )}
    </PageShell>
  );
}
