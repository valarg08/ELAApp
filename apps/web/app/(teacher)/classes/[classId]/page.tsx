import { ClassSummary, SafetyFlagView, StudentSummary } from '@storyforge/shared';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ButtonLink, PageShell } from '@/components/ui';
import { serverApi } from '@/lib/server-api';
import { AiModeSelect } from './ai-mode-select';
import { Roster } from './roster';
import { SelfPacedToggle } from './self-paced-toggle';

export const dynamic = 'force-dynamic';

export default async function ClassPage({ params }: PageProps<'/classes/[classId]'>) {
  const { classId } = await params;
  const [klass, students, openFlags] = await Promise.all([
    serverApi(`/teacher/classes/${classId}`, ClassSummary),
    serverApi(`/teacher/classes/${classId}/students`, StudentSummary.array()),
    serverApi(`/teacher/classes/${classId}/flags?status=OPEN`, SafetyFlagView.array()),
  ]);
  if (!klass || !students) notFound();

  return (
    <PageShell width="max-w-5xl">
      <div className="flex flex-col gap-8">
        <div>
          <Link href="/classes" className="text-brand underline">
            ← All classes
          </Link>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold">{klass.name}</h1>
              <p className="mt-1 text-muted">Grade {klass.gradeLevel}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <ButtonLink href={`/classes/${klass.id}/progress`}>📊 Progress</ButtonLink>
              <ButtonLink
                href={`/classes/${klass.id}/flags`}
                variant={openFlags && openFlags.length > 0 ? 'danger' : 'secondary'}
              >
                🚩 Safety flags
                {openFlags && openFlags.length > 0 ? ` (${openFlags.length} open)` : ''}
              </ButtonLink>
              <ButtonLink href={`/classes/${klass.id}/pacing`} variant="secondary">
                📚 Units &amp; pacing
              </ButtonLink>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm font-semibold tracking-widest text-muted uppercase">Class code</p>
          <p className="font-mono text-4xl font-bold tracking-[0.3em]" data-testid="join-code">
            {klass.joinCode}
          </p>
          <p className="mt-2 text-muted">
            Students go to Owlery Academy, choose <strong>I&apos;m a student</strong> and type this
            code.
          </p>
        </div>

        <SelfPacedToggle classId={klass.id} initial={klass.selfPaced} />
        <AiModeSelect classId={klass.id} initial={klass.aiFeedbackMode} />

        <Roster classId={klass.id} students={students} />
      </div>
    </PageShell>
  );
}
