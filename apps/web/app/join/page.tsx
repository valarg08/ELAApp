import { JoinCode, StudentLookupResponse, homePathFor } from '@storyforge/shared';
import { redirect } from 'next/navigation';
import { PageShell } from '@/components/ui';
import { getMe, lookupClass } from '@/lib/server-api';
import { JoinFlow } from './join-flow';

export const dynamic = 'force-dynamic';

export default async function JoinPage({ searchParams }: PageProps<'/join'>) {
  const me = await getMe().catch(() => null);
  if (me) redirect(homePathFor(me.role));

  const params = await searchParams;
  const code = typeof params.code === 'string' ? params.code : '';
  const user = typeof params.user === 'string' ? params.user.toLowerCase() : '';

  // From a login-card QR code: look the class up now so the flow opens at the right step.
  const validCode = JoinCode.safeParse(code);
  const lookup: StudentLookupResponse | null = validCode.success
    ? await lookupClass(validCode.data).catch(() => null)
    : null;
  const student = lookup?.students.find((s) => s.username === user) ?? null;

  return (
    <PageShell width="max-w-2xl">
      <JoinFlow initialCode={code} initialLookup={lookup} initialStudent={student} />
    </PageShell>
  );
}
