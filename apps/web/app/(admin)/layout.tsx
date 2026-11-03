import { homePathFor } from '@storyforge/shared';
import { redirect } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { getMe } from '@/lib/server-api';
import { AdminNav } from './admin-nav';

export const dynamic = 'force-dynamic';

/** The admin console (DESIGN.md §11.9): admins only. */
export default async function AdminLayout({ children }: LayoutProps<'/'>) {
  const me = await getMe();
  if (!me) redirect('/login');
  if (me.role !== 'ADMIN') redirect(homePathFor(me.role));

  return (
    <>
      <AppHeader me={me} home="/admin" />
      <AdminNav />
      {children}
    </>
  );
}
