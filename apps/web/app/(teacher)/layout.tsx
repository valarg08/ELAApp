import { homePathFor } from '@storyforge/shared';
import { redirect } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { getMe } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

export default async function TeacherLayout({ children }: LayoutProps<'/'>) {
  const me = await getMe();
  if (!me) redirect('/login');
  if (me.role !== 'TEACHER') redirect(homePathFor(me.role));

  return (
    <>
      <AppHeader me={me} home="/classes" />
      {children}
    </>
  );
}
