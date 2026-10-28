import { APP_NAME, type MeResponse } from '@storyforge/shared';
import Link from 'next/link';
import { LogoutButton } from './logout-button';
import { OwlIcon } from './owl-icon';

export function AppHeader({ me, home }: { me: MeResponse; home: string }) {
  return (
    <header className="border-b-2 border-accent bg-card text-brand">
      <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link
          href={home}
          className="text-xl font-bold text-brand focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <OwlIcon className="mr-2" />
          {APP_NAME}
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-muted">
            {me.role === 'STUDENT' ? 'Hi, ' : ''}
            <span className="font-semibold text-brand">{me.displayName}</span>
          </span>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
