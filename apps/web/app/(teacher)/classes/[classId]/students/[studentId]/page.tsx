import {
  CONFIDENCE_LEVELS,
  ClassSummary,
  LOW_CONFIDENCE,
  StudentProgressDetail,
  Track,
} from '@storyforge/shared';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TrackProgressView } from '@/components/track-progress';
import { TrackTabs } from '@/components/track-tabs';
import { Card, PageShell } from '@/components/ui';
import { serverApi } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

const KIND_ICON = { lesson: '📘', quiz: '✅', writing: '✍' } as const;
const dateFormat = new Intl.DateTimeFormat('en', {
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: '2-digit',
});

/** A student's profile for their teacher (DESIGN.md §11.2–11.3): progress and recent activity. */
export default async function StudentProgressPage({
  params,
  searchParams,
}: PageProps<'/classes/[classId]/students/[studentId]'>) {
  const { classId, studentId } = await params;
  const query = await searchParams;
  const raw = Array.isArray(query.track) ? query.track[0] : query.track;
  const track = Track.catch('STORY').parse(raw?.toUpperCase());
  const [klass, detail] = await Promise.all([
    serverApi(`/teacher/classes/${classId}`, ClassSummary),
    serverApi(
      `/teacher/classes/${classId}/students/${studentId}/progress?track=${track}`,
      StudentProgressDetail,
    ),
  ]);
  if (!klass || !detail) notFound();
  const { student, recent, confidence } = detail;
  const unitName = track === 'ESSAY' ? 'Essay Unit' : 'Unit';
  const low = confidence.filter((c) => c.confidence <= LOW_CONFIDENCE);

  return (
    <PageShell width="max-w-5xl">
      <div className="flex flex-col gap-8">
        <div>
          <Link
            href={`/classes/${classId}/progress?track=${track.toLowerCase()}`}
            className="text-brand underline"
          >
            ← {klass.name} progress
          </Link>
          <h1 className="mt-3 text-3xl font-bold">{student.displayName}</h1>
          <p className="mt-1 text-muted">
            {student.username && <>Username {student.username} · </>}
            Last active{' '}
            {student.lastActiveAt ? (
              <time dateTime={student.lastActiveAt}>
                {dateFormat.format(new Date(student.lastActiveAt))}
              </time>
            ) : (
              'never'
            )}
          </p>
        </div>

        <TrackTabs
          current={track}
          hrefFor={(t) => `/classes/${classId}/students/${studentId}?track=${t.toLowerCase()}`}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <h2 className="mb-3 text-xl font-semibold">Recent activity</h2>
            {recent.length === 0 ? (
              <p className="text-muted">Nothing in this track yet.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {recent.map((r, i) => (
                  <li key={`${r.kind}-${r.at}-${i}`} className="flex gap-3">
                    <span aria-hidden="true">{KIND_ICON[r.kind]}</span>
                    <span className="text-sm">
                      <span className="block font-semibold">
                        {unitName} {r.unitNumber}: {r.title}
                      </span>
                      <span className="block text-muted">
                        {r.detail} ·{' '}
                        <time dateTime={r.at}>{dateFormat.format(new Date(r.at))}</time>
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <h2 className="mb-1 text-xl font-semibold">Confidence check-ins</h2>
            <p className="mb-3 text-sm text-muted">
              How sure the student felt at the end of each lesson.
              {low.length > 0 &&
                ` ${low.length} lesson${low.length === 1 ? '' : 's'} with low confidence.`}
            </p>
            {confidence.length === 0 ? (
              <p className="text-muted">No check-ins in this track yet.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {confidence.slice(0, 12).map((c) => {
                  const level = CONFIDENCE_LEVELS.find((l) => l.value === c.confidence);
                  return (
                    <li
                      key={c.lessonId}
                      className={`flex items-center justify-between gap-3 rounded-lg px-2 py-1 text-sm ${
                        c.confidence <= LOW_CONFIDENCE ? 'bg-warn/15' : ''
                      }`}
                    >
                      <span>
                        {unitName} {c.unitNumber}: {c.lessonTitle}
                      </span>
                      <span className="whitespace-nowrap">
                        <span aria-hidden="true">{level?.emoji} </span>
                        {level?.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </div>

        <TrackProgressView progress={detail.progress} linkUnits={false} />
      </div>
    </PageShell>
  );
}
