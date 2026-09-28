import { redirect } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { getMe } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

export default async function StudentLayout({ children }: LayoutProps<'/'>) {
  const me = await getMe();
  if (!me) redirect('/join');
  if (me.role !== 'STUDENT') redirect('/classes');

  return (
    <>
      <AppHeader me={me} home="/home" />
      {children}
    </>
  );
}
