import { homePathFor } from '@storyforge/shared';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { getMe } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

const links = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/schools', label: 'Schools & teachers' },
  { href: '/admin/ai', label: 'AI usage' },
  { href: '/admin/content', label: 'Curriculum' },
] as const;

/** The admin console (DESIGN.md §11.9): admins only. */
export default async function AdminLayout({ children }: LayoutProps<'/'>) {
  const me = await getMe();
  if (!me) redirect('/login');
  if (me.role !== 'ADMIN') redirect(homePathFor(me.role));

  return (
    <>
      <AppHeader me={me} home="/admin" />
      <nav aria-label="Admin" className="border-b border-border bg-card">
        <ul className="mx-auto flex max-w-5xl flex-wrap gap-x-6 gap-y-1 px-4 py-2">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="inline-flex min-h-11 items-center font-medium text-brand underline-offset-4 hover:underline focus-visible:outline-3 focus-visible:outline-brand"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {children}
    </>
  );
}
