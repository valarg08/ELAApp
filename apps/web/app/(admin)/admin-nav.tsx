'use client';

import { usePathname } from 'next/navigation';

const links = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/schools', label: 'Schools & teachers' },
  { href: '/admin/ai', label: 'AI usage' },
  { href: '/admin/content', label: 'Curriculum' },
  { href: '/admin/logs', label: 'Logs' },
] as const;

const item =
  'inline-flex min-h-11 items-center font-medium text-brand underline-offset-4 hover:underline focus-visible:outline-3 focus-visible:outline-brand';

/**
 * Admin console tabs. `target="_top"` skips the App Router so these force-dynamic
 * pages do a real load instead of hanging on a client transition.
 */
export function AdminNav() {
  const path = usePathname();
  return (
    <nav aria-label="Admin" className="border-b border-border bg-card">
      <ul className="flex flex-wrap gap-x-6 gap-y-1 px-4 py-2 md:px-6">
        {links.map((l) => {
          const current = l.href === '/admin' ? path === '/admin' : path.startsWith(l.href);
          return (
            <li key={l.href}>
              <a
                href={l.href}
                target="_top"
                aria-current={current ? 'page' : undefined}
                className={`${item} ${current ? 'underline' : ''}`}
              >
                {l.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
