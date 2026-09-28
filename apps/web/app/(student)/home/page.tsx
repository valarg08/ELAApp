import { redirect } from 'next/navigation';
import { Card, PageShell } from '@/components/ui';
import { getMe } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

export default async function StudentHome() {
  const me = await getMe();
  if (!me) redirect('/join');

  return (
    <PageShell>
      <div className="flex flex-col gap-6">
        <h1 className="text-4xl font-bold">Welcome, {me.displayName}! 👋</h1>
        {me.classes.length > 0 && (
          <p className="text-lg text-muted">
            You&apos;re in{' '}
            <strong className="text-foreground">{me.classes.map((c) => c.name).join(', ')}</strong>.
          </p>
        )}
        <Card>
          <h2 className="text-xl font-semibold">⭐ Coming soon</h2>
          <p className="mt-2 text-muted">
            Your lessons, writing missions and badges will appear here. Get your imagination ready!
          </p>
        </Card>
      </div>
    </PageShell>
  );
}
