'use client';

import { SatSchedule } from '@storyforge/shared';
import { useState } from 'react';
import { Button, ErrorMessage } from '@/components/ui';
import { ApiError, apiJson } from '@/lib/api-client';

const shown = (date: string) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });

/**
 * The class's SAT weekly schedule (sat-design.md §3): the day week 1 opens. Week 2 opens 7 days
 * later, and so on; without a date every week is open.
 */
export function SatScheduleCard({ classId, initial }: { classId: string; initial: SatSchedule }) {
  const [schedule, setSchedule] = useState(initial);
  const [date, setDate] = useState(initial.startDate ?? '');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function save(startDate: string | null) {
    setBusy(true);
    setStatus(null);
    setError(null);
    try {
      const next = await apiJson(`/teacher/classes/${classId}/sat-schedule`, SatSchedule, 'PUT', {
        startDate,
      });
      setSchedule(next);
      setDate(next.startDate ?? '');
      setStatus('Saved');
    } catch (e) {
      setError(e instanceof ApiError ? e.userMessage : 'Could not save. Try again.');
    }
    setBusy(false);
  }

  return (
    <section
      aria-labelledby="sat-schedule"
      className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      <h2 id="sat-schedule" className="text-lg font-bold">
        <span aria-hidden="true">🏆 </span>SAT Math weekly tests
      </h2>
      <p className="text-sm text-muted">
        Pick the day week 1 opens; every next week opens 7 days later (class time zone:{' '}
        {schedule.timezone}). Students can still finish a test they started, and take earlier weeks
        they missed. With no date, every week is open.
      </p>
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1">
          <span className="font-semibold">Week 1 opens on</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="min-h-11 rounded-xl border border-border bg-card px-3 focus-visible:outline-3 focus-visible:outline-brand"
          />
        </label>
        <Button
          onClick={() => void save(date || null)}
          disabled={busy || date === (schedule.startDate ?? '')}
        >
          Save
        </Button>
        {schedule.startDate && (
          <Button variant="secondary" onClick={() => void save(null)} disabled={busy}>
            Open every week
          </Button>
        )}
        <output className="text-sm text-ok">{status}</output>
      </div>
      <ErrorMessage message={error} />
      {schedule.weeks.length > 0 && (
        <table className="w-full max-w-md border-collapse text-left">
          <caption className="sr-only">When each weekly test opens for this class</caption>
          <thead>
            <tr>
              <th scope="col" className="border-b border-border px-2 py-1">
                Week
              </th>
              <th scope="col" className="border-b border-border px-2 py-1">
                Opens
              </th>
            </tr>
          </thead>
          <tbody>
            {schedule.weeks.map((w) => (
              <tr key={w.week}>
                <th scope="row" className="border-b border-border px-2 py-1 font-normal">
                  {w.week}. {w.title}
                </th>
                <td className="border-b border-border px-2 py-1">
                  {w.opens ? shown(w.opens) : 'Open now'}
                  {w.opens && w.opens > schedule.today && (
                    <span className="text-muted"> (not yet)</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
