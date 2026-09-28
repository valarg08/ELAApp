import { homePathFor } from '@storyforge/shared';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Card, PageShell } from '@/components/ui';
import { getMe } from '@/lib/server-api';
import { TeacherAuthForm } from './teacher-auth-form';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  const me = await getMe().catch(() => null);
  if (me) redirect(homePathFor(me.role));

  return (
    <PageShell width="max-w-md">
      <Card className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Teacher login</h1>
          <p className="mt-1 text-muted">
            Students,{' '}
            <Link href="/join" className="text-brand underline">
              join your class here
            </Link>
            .
          </p>
        </div>
        <TeacherAuthForm mode="login" />
        <p className="text-sm text-muted">
          No account yet?{' '}
          <Link href="/register" className="font-semibold text-brand underline">
            Create one
          </Link>
        </p>
      </Card>
    </PageShell>
  );
}
