import { PageShell } from '@/components/ui';

/** Shown while an admin page is loading so a click in the nav is not a blank wait. */
export default function AdminLoading() {
  return (
    <PageShell full>
      <p className="text-muted">Loading…</p>
    </PageShell>
  );
}
