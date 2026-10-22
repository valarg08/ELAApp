'use client';

import type { SubmissionDetail, SubmitResponse } from '@storyforge/shared';
import Link from 'next/link';
import { type KeyboardEvent, useState } from 'react';
import { ButtonLink, Card } from '@/components/ui';
import { ActivityPrompt } from './activity-prompt';
import { WritingWorkspace } from './writing-workspace';

const TABS = [
  { id: 'prompt', label: 'Prompt' },
  { id: 'write', label: 'Write' },
  { id: 'coach', label: 'Coach' },
] as const;
type Tab = (typeof TABS)[number]['id'];

/**
 * Full-screen workspace (DESIGN.md §6.3). Wide screens: prompt and coach on the left, the editor
 * on the right. Narrow screens: tabs (Prompt · Write · Coach).
 */
export function WritePage({ submission }: { submission: SubmissionDetail }) {
  const [tab, setTab] = useState<Tab>('write');
  const [result, setResult] = useState<SubmitResponse | null>(null);
  const [coachTarget, setCoachTarget] = useState<HTMLElement | null>(null);
  const back = submission.lesson
    ? {
        href: `/lessons/${submission.lesson.id}`,
        label: `Lesson ${submission.lesson.order}: ${submission.lesson.title}`,
      }
    : { href: '/home', label: 'My journey' };

  function onTabKey(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const step = e.key === 'ArrowRight' ? 1 : TABS.length - 1;
    const next = TABS[(TABS.findIndex((t) => t.id === tab) + step) % TABS.length]!;
    setTab(next.id);
    document.getElementById(`tab-${next.id}`)?.focus();
  }

  const panel = (id: Tab) => ({
    id: `panel-${id}`,
    role: 'tabpanel',
    'aria-labelledby': `tab-${id}`,
    className: `${tab === id ? '' : 'hidden'} @4xl:block`,
  });

  return (
    <div className="@container flex flex-col gap-6">
      <Link href={back.href} className="text-brand underline">
        ← {back.label}
      </Link>

      {/* On phones the prompt (and its h1) is hidden behind another tab: keep one h1 for screen readers. */}
      {tab !== 'prompt' && (
        <h1 className="sr-only @4xl:hidden">{submission.activity.content.title}</h1>
      )}

      <div role="tablist" aria-label="Workspace" className="flex gap-2 @4xl:hidden">
        {TABS.map((t) => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            tabIndex={tab === t.id ? 0 : -1}
            onClick={() => setTab(t.id)}
            onKeyDown={onTabKey}
            className={`min-h-11 flex-1 rounded-xl px-4 font-semibold focus-visible:outline-3 focus-visible:outline-brand ${
              tab === t.id ? 'bg-brand text-white' : 'border border-border bg-card'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid items-start gap-6 @4xl:grid-cols-[minmax(18rem,1fr)_2fr]">
        <div className="flex flex-col gap-6">
          <div {...panel('prompt')}>
            <Card>
              <ActivityPrompt activity={submission.activity.content} headingLevel={1} />
            </Card>
          </div>
          <div {...panel('coach')}>
            <Card>
              <div ref={setCoachTarget} />
            </Card>
          </div>
        </div>
        <div {...panel('write')}>
          <Card className="flex flex-col gap-4">
            <WritingWorkspace
              submission={submission}
              onSubmitted={setResult}
              coachTarget={coachTarget}
              onShowInText={() => setTab('write')}
            />
            {result?.lessonProgress && submission.lesson && (
              <ButtonLink href={`/lessons/${submission.lesson.id}`} className="self-start">
                Back to the lesson →
              </ButtonLink>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
