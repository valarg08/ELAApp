import { TRACK_HOME, Track, UnitSummary } from '@storyforge/shared';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LAST_TRACK_COOKIE } from '@/lib/last-track';
import { serverApi } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

/**
 * Where a student lands (after signing in, the logo, the track tabs): the unit they're working on
 * in the track asked for, else the last track they used, else Story Writing (DESIGN.md §6.2). The
 * track's overview stays one click away ("← Story Writing" in the Chapters panel).
 */
export default async function Start({ searchParams }: PageProps<'/start'>) {
  const asked = Track.safeParse((await searchParams).track);
  const last = Track.safeParse((await cookies()).get(LAST_TRACK_COOKIE)?.value);
  const track = asked.success ? asked.data : last.success ? last.data : 'STORY';

  const units = (await serverApi(`/units?track=${track}`, UnitSummary.array())) ?? [];
  const open = units.filter((u) => u.available);
  // The first open unit with lessons left; when all are done, the last open one.
  const current = open.find((u) => u.completedLessons < u.lessonCount) ?? open.at(-1);
  redirect(current ? `/units/${current.slug}` : TRACK_HOME[track]);
}
