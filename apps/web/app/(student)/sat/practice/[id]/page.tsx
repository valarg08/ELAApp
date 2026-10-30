import { SatPracticeView } from '@storyforge/shared';
import { notFound, redirect } from 'next/navigation';
import { PageShell } from '@/components/ui';
import { SatPractice } from '@/features/sat/sat-practice';
import { getMe, serverApi } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

/** An adaptive practice set (resumes where the student left off). */
export default async function SatPracticeSetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const me = await getMe();
  if (!me) redirect('/join');
  const view = await serverApi(`/sat/practice/${encodeURIComponent(id)}`, SatPracticeView);
  if (!view) notFound();
  return (
    <PageShell full>
      <SatPractice initial={view} />
    </PageShell>
  );
}
