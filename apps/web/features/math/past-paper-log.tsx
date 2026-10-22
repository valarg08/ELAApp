'use client';

import {
  AMC_LETTERS,
  type AmcLetter,
  MATH_STRANDS,
  PAST_PAPER_SIZE,
  type PastPaperItem,
  type PastPaperList,
  PastPaperView,
  type SkillMastery,
} from '@storyforge/shared';
import { useState } from 'react';
import { Button, ErrorMessage, Field } from '@/components/ui';
import { ApiError, apiJson, apiSend } from '@/lib/api-client';
import { points } from './copy';

const select =
  'min-h-11 rounded-xl border border-border bg-card px-2 py-1 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand';

const emptyItems = (): PastPaperItem[] =>
  Array.from({ length: PAST_PAPER_SIZE }, () => ({ answer: null, official: 'A', skill: null }));

/** Today's date in the student's own time zone, as YYYY-MM-DD. */
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/**
 * The past-paper log (math-design.md §4.15): the student types their answer letter (or blank), the
 * official letter and an optional topic for each of the 25 questions of an official paper worked
 * outside StoryForge. Never the problem text. The app scores it like the AMC.
 */
export function PastPaperLog({
  initial,
  skills,
}: {
  initial: PastPaperList;
  skills: Pick<SkillMastery, 'skill' | 'label' | 'strand'>[];
}) {
  const [papers, setPapers] = useState(initial.papers);
  const [label, setLabel] = useState('');
  const [takenOn, setTakenOn] = useState(today);
  const [items, setItems] = useState(emptyItems);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);

  const set = (i: number, patch: Partial<PastPaperItem>) =>
    setItems((all) => all.map((item, j) => (j === i ? { ...item, ...patch } : item)));

  async function save() {
    setBusy(true);
    setError(null);
    setSaved(null);
    try {
      const paper = await apiJson('/math/past-papers', PastPaperView, 'POST', {
        label,
        takenOn,
        items,
      });
      setPapers((all) => [paper, ...all]);
      setItems(emptyItems());
      setLabel('');
      setSaved(`Saved: ${points(paper.points)} of 150 points.`);
    } catch (e) {
      setError(e instanceof ApiError ? e.userMessage : 'Could not save it. Try again.');
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    setError(null);
    try {
      await apiSend(`/math/past-papers/${encodeURIComponent(id)}`, 'DELETE');
      setPapers((all) => all.filter((p) => p.id !== id));
      setConfirming(null);
    } catch (e) {
      setError(e instanceof ApiError ? e.userMessage : 'Could not delete it. Try again.');
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <section aria-labelledby="papers" className="flex flex-col gap-3">
        <h2 id="papers" className="text-2xl font-semibold">
          My papers
        </h2>
        {papers.length === 0 ? (
          <p className="text-muted">None yet. Log a paper below after you have marked it.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {papers.map((p) => (
              <li
                key={p.id}
                className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4"
              >
                <p className="text-lg">
                  <strong>{p.label}</strong> · {p.takenOn} ·{' '}
                  <strong>{points(p.points)} of 150</strong> · {p.correct} right · {p.wrong} wrong ·{' '}
                  {p.blank} blank
                </p>
                {p.missedSkills.length > 0 && (
                  <p className="text-muted">
                    Missed topics:{' '}
                    {p.missedSkills.map((m) => `${m.label} (${m.missed})`).join(', ')}
                  </p>
                )}
                {confirming === p.id ? (
                  <div className="flex flex-wrap gap-2">
                    <Button variant="danger" onClick={() => void remove(p.id)}>
                      Yes, delete “{p.label}”
                    </Button>
                    <Button variant="secondary" onClick={() => setConfirming(null)}>
                      Keep it
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="secondary"
                    className="self-start"
                    onClick={() => setConfirming(p.id)}
                  >
                    Delete
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="log-paper" className="flex flex-col gap-4">
        <h2 id="log-paper" className="text-2xl font-semibold">
          Log a paper
        </h2>
        <p className="text-muted">
          Only letters and topics go here, never the questions themselves. Pick a topic for the
          questions you can name: missed topics feed your danger zones.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="paper-label"
            label="Name for this paper"
            hint="Your own name for it, for example “Practice paper 1”."
            maxLength={60}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <Field
            id="paper-date"
            label="Date you worked it"
            type="date"
            value={takenOn}
            onChange={(e) => setTakenOn(e.target.value)}
          />
        </div>
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            Your answer, the official answer and the topic for each question
          </caption>
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="py-2">
                Question
              </th>
              <th scope="col">My answer</th>
              <th scope="col">Official answer</th>
              <th scope="col">Topic (optional)</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b border-border">
                <th scope="row" className="py-1 font-normal">
                  {i + 1}
                  {item.answer !== null && (
                    <span className="ml-2 text-sm">
                      {item.answer === item.official ? '✓' : '✗'}
                    </span>
                  )}
                </th>
                <td>
                  <select
                    aria-label={`Question ${i + 1}: my answer`}
                    className={select}
                    value={item.answer ?? ''}
                    onChange={(e) =>
                      set(i, { answer: e.target.value ? (e.target.value as AmcLetter) : null })
                    }
                  >
                    <option value="">Blank</option>
                    {AMC_LETTERS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    aria-label={`Question ${i + 1}: official answer`}
                    className={select}
                    value={item.official}
                    onChange={(e) => set(i, { official: e.target.value as AmcLetter })}
                  >
                    {AMC_LETTERS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    aria-label={`Question ${i + 1}: topic`}
                    className={`${select} max-w-56`}
                    value={item.skill ?? ''}
                    onChange={(e) => set(i, { skill: e.target.value || null })}
                  >
                    <option value="">No topic</option>
                    {MATH_STRANDS.map((strand) => (
                      <optgroup key={strand.id} label={strand.label}>
                        {skills
                          .filter((s) => s.strand === strand.id)
                          .map((s) => (
                            <option key={s.skill} value={s.skill}>
                              {s.label}
                            </option>
                          ))}
                      </optgroup>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ErrorMessage message={error} />
        {saved && <output className="block font-semibold text-ok">{saved}</output>}
        <Button className="self-start" disabled={busy || !label.trim()} onClick={() => void save()}>
          {busy ? 'Saving…' : 'Save and score it'}
        </Button>
      </section>
    </div>
  );
}
