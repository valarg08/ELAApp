import type { Metadata } from 'next';
import { APP_NAME } from '@storyforge/shared';
import './globals.css';

export const metadata: Metadata = {
  title: APP_NAME,
  description: 'Interactive creative writing for middle school.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
