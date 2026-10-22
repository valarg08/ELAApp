import type { Metadata } from 'next';
import { APP_NAME } from '@storyforge/shared';
import './globals.css';

export const metadata: Metadata = {
  // app/icon.svg (the blue owl) is the tab icon.
  title: { default: APP_NAME, template: `%s · ${APP_NAME}` },
  description: 'Writing, essays and AMC 10 math practice for middle school.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
