import { SatAttemptView } from '@storyforge/shared';
import { notFound, redirect } from 'next/navigation';
import { PageShell } from '@/components/ui';
import { SatTest } from '@/features/sat/sat-player';
import { getMe, serverApi } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

/** A weekly SAT test: the open module, or the finished result (sat-design.md). */
export default async function SatTestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const me = await getMe();
  if (!me) redirect('/join');
  const view = await serverApi(`/sat/attempts/${encodeURIComponent(id)}`, SatAttemptView);
  if (!view) notFound();
  return (
    <PageShell full>
      <SatTest initial={view} />
    </PageShell>
  );
}
