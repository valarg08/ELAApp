import { APP_NAME, type MeResponse } from '@storyforge/shared';
import Link from 'next/link';
import { LogoutButton } from './logout-button';
import { OwlIcon } from './owl-icon';

export function AppHeader({ me, home }: { me: MeResponse; home: string }) {
  return (
    <header className="border-b-4 border-mint bg-brand text-white [&_:focus-visible]:outline-white">
      <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href={home} className="text-xl font-bold text-white">
          <OwlIcon className="mr-2" />
          {APP_NAME}
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-white/85">
            {me.role === 'STUDENT' ? 'Hi, ' : ''}
            <span className="font-semibold text-white">{me.displayName}</span>
          </span>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
