import { APP_NAME, type MeResponse } from '@storyforge/shared';
import Link from 'next/link';
import { LogoutButton } from './logout-button';

export function AppHeader({ me, home }: { me: MeResponse; home: string }) {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href={home} className="text-xl font-bold text-brand">
          🦉 {APP_NAME}
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-muted">
            {me.role === 'STUDENT' ? 'Hi, ' : ''}
            <span className="font-semibold text-foreground">{me.displayName}</span>
          </span>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
