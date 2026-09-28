import { homePathFor } from '@storyforge/shared';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Card, PageShell } from '@/components/ui';
import { getMe } from '@/lib/server-api';
import { TeacherAuthForm } from '../login/teacher-auth-form';

export const dynamic = 'force-dynamic';

export default async function RegisterPage() {
  const me = await getMe().catch(() => null);
  if (me) redirect(homePathFor(me.role));

  return (
    <PageShell width="max-w-md">
      <Card className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Create a teacher account</h1>
          <p className="mt-1 text-muted">
            You&apos;ll add your students next. They don&apos;t need email addresses.
          </p>
        </div>
        <TeacherAuthForm mode="register" />
        <p className="text-sm text-muted">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-brand underline">
            Log in
          </Link>
        </p>
      </Card>
    </PageShell>
  );
}
