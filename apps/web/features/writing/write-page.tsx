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
] as const;
type Tab = (typeof TABS)[number]['id'];

/**
 * Full-screen workspace (DESIGN.md §6.3): prompt beside the editor on wide screens, tabs
 * (Prompt · Write) on narrow ones. The Coach panel arrives with AI feedback in P4.
 */
export function WritePage({ submission }: { submission: SubmissionDetail }) {
  const [tab, setTab] = useState<Tab>('write');
  const [result, setResult] = useState<SubmitResponse | null>(null);
  const back = submission.lesson
    ? {
        href: `/lessons/${submission.lesson.id}`,
        label: `Lesson ${submission.lesson.order}: ${submission.lesson.title}`,
      }
    : { href: '/home', label: 'My journey' };

  function onTabKey(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const next = TABS[(TABS.findIndex((t) => t.id === tab) + 1) % TABS.length]!;
    setTab(next.id);
    document.getElementById(`tab-${next.id}`)?.focus();
  }

  return (
    <div className="flex flex-col gap-6">
      <Link href={back.href} className="text-brand underline">
        ← {back.label}
      </Link>

      <div role="tablist" aria-label="Workspace" className="flex gap-2 lg:hidden">
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

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(16rem,1fr)_2fr]">
        <div
          id="panel-prompt"
          role="tabpanel"
          aria-labelledby="tab-prompt"
          className={`${tab === 'prompt' ? '' : 'hidden'} lg:block`}
        >
          <Card className="lg:sticky lg:top-6">
            <ActivityPrompt activity={submission.activity.content} headingLevel={1} />
          </Card>
        </div>
        <div
          id="panel-write"
          role="tabpanel"
          aria-labelledby="tab-write"
          className={`${tab === 'write' ? '' : 'hidden'} lg:block`}
        >
          <Card className="flex flex-col gap-4">
            <WritingWorkspace submission={submission} onSubmitted={setResult} />
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
