import Link from 'next/link';
import type { ReactNode } from 'react';
import type { GuideProblem } from './guide-problem';
import { GuidePractice } from './guide-practice';
import { PrintButton } from './print-button';

export type Table = { head: string[]; rows: string[][] };

export type Topic = {
  id: string;
  title: string;
  start: string;
  intro: string;
  tables?: { caption: string; table: Table }[];
  rules?: string[];
  example?: string;
  tip?: string;
};

/** A study guide made from a video: our own notes, diagrams and practice, linked to its chapters. */
export type Guide = {
  title: string;
  blurb: string;
  /** The diagrams' folder in public/guides. */
  folder: string;
  video: { url: string; label: string };
  topics: Topic[];
  /** Topic id → its diagram (our own drawing) and description. */
  figures: Record<string, { file: string; alt: string }>;
  /** The formula review sheet: [topic, rule] rows, every rule on one page. */
  review: [string, string][];
  practice: { q: string; a: string }[];
  /** The guide's page; each topic with problems is a sub-module at `${href}/${topic id}`. */
  href: string;
  /** Topic id → its sub-module's problems, simple to complex. */
  problems?: Record<string, GuideProblem[]>;
};

function DataTable({ caption, table }: { caption: string; table: Table }) {
  return (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <caption className="mb-1 text-left font-semibold">{caption}</caption>
        <thead>
          <tr>
            {table.head.map((h) => (
              <th key={h} scope="col" className="border-b border-border px-2 py-1 text-sm">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((r) => (
            <tr key={r[0]}>
              {r.map((c, i) => (
                <td key={i} className="border-b border-border px-2 py-1">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Note({ label, children }: { label: string; children: ReactNode }) {
  return (
    <p className="mt-3">
      <span className="font-semibold">{label}: </span>
      {children}
    </p>
  );
}

/** One topic: its video link, diagram, notes, tables and tips. */
function TopicBody({ guide, t }: { guide: Guide; t: Topic }) {
  const [m = 0, s = 0] = t.start.split(':').map(Number);
  const fig = guide.figures[t.id];
  return (
    <>
      <p className="text-sm">
        <a
          href={`${guide.video.url}&t=${m * 60 + s}s`}
          className="text-brand underline"
          target="_blank"
          rel="noreferrer"
        >
          Watch from {t.start}
          <span className="sr-only"> (opens YouTube in a new tab)</span>
        </a>
      </p>
      {fig && (
        // A link to the full-size drawing, for narrow columns.
        <a
          href={`/guides/${guide.folder}/${fig.file}.svg`}
          target="_blank"
          rel="noreferrer"
          className="mt-3 block max-w-3xl rounded-lg"
        >
          {/* Static SVGs from public/; next/image adds nothing for them. */}
          {/* oxlint-disable-next-line nextjs/no-img-element */}
          <img
            src={`/guides/${guide.folder}/${fig.file}.svg`}
            alt={fig.alt}
            className="h-auto w-full"
          />
          <span className="sr-only"> (opens full size in a new tab)</span>
        </a>
      )}
      <p className="mt-2 text-lg">{t.intro}</p>
      {t.rules && (
        <ul className="mt-2 ml-5 flex list-disc flex-col gap-1 text-lg">
          {t.rules.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      )}
      {t.tables?.map((tb) => (
        <DataTable key={tb.caption} {...tb} />
      ))}
      {t.example && <Note label="Example">{t.example}</Note>}
      {t.tip && <Note label="Watch out">{t.tip}</Note>}
    </>
  );
}

/**
 * A guide topic as its own sub-module page (psat-design.md): the notes, then its problems, with
 * links to the previous and next sub-modules.
 */
export function GuideTopicPage({ guide, topicId }: { guide: Guide; topicId: string }) {
  const i = guide.topics.findIndex((t) => t.id === topicId);
  const t = guide.topics[i];
  const problems = guide.problems?.[topicId];
  if (!t || !problems) return null;
  const prev = guide.topics[i - 1];
  const next = guide.topics[i + 1];
  return (
    <div className="flex flex-col gap-8">
      <Link href={guide.href} className="text-brand underline print:hidden">
        ← {guide.title} study guide
      </Link>
      <section aria-labelledby={`${t.id}-h`}>
        <p className="text-sm font-semibold tracking-widest text-brand uppercase">
          {guide.title} · sub-module {i + 1} of {guide.topics.length}
        </p>
        <h1 id={`${t.id}-h`} className="text-4xl font-bold">
          {t.title}
        </h1>
        <TopicBody guide={guide} t={t} />
      </section>
      <GuidePractice storageKey={`guide:${guide.folder}:${t.id}`} problems={problems} />
      <nav aria-label="Sub-modules" className="flex flex-wrap justify-between gap-3 print:hidden">
        {prev ? (
          <Link href={`${guide.href}/${prev.id}`} className="text-brand underline">
            ← {i}. {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`${guide.href}/${next.id}`} className="text-brand underline">
            {i + 2}. {next.title} →
          </Link>
        )}
      </nav>
    </div>
  );
}

/** A PSAT study guide page (psat-design.md): topics with diagrams, notes and practice. */
export function StudyGuide({ guide }: { guide: Guide }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/psat" className="text-brand underline">
          ← PSAT Math
        </Link>
        <PrintButton />
      </div>
      <div>
        <p className="text-sm font-semibold tracking-widest text-brand uppercase">Study guide</p>
        <h1 className="text-4xl font-bold">{guide.title}</h1>
        <p className="mt-2 text-muted">{guide.blurb}</p>
      </div>

      <nav aria-label="Topics">
        <ol className="ml-5 grid list-decimal gap-1 sm:grid-cols-2">
          {guide.topics.map((t) => (
            <li key={t.id}>
              <a href={`#${t.id}`} className="text-brand underline">
                {t.title}
              </a>
            </li>
          ))}
          <li>
            <a href="#review" className="text-brand underline">
              Formula review sheet
            </a>
          </li>
          <li>
            <a href="#practice" className="text-brand underline">
              Practice questions
            </a>
          </li>
        </ol>
      </nav>

      {guide.topics.map((t, i) => (
        <section key={t.id} id={t.id} aria-labelledby={`${t.id}-h`} className="break-inside-avoid">
          <h2 id={`${t.id}-h`} className="text-2xl font-semibold">
            {i + 1}. {t.title}
          </h2>
          <TopicBody guide={guide} t={t} />
          {guide.problems?.[t.id] && (
            <p className="mt-3 print:hidden">
              <Link
                href={`${guide.href}/${t.id}`}
                className="inline-flex min-h-11 items-center rounded-xl border-2 border-brand px-4 font-semibold text-brand hover:bg-brand/10"
              >
                Practice: {guide.problems[t.id]!.length} problems →
              </Link>
            </p>
          )}
        </section>
      ))}

      <section id="review" aria-labelledby="review-h" className="break-inside-avoid">
        <h2 id="review-h" className="text-2xl font-semibold">
          Formula review sheet
        </h2>
        <p className="mt-1 text-muted">
          Every rule in this guide on one page, for the night before a test.
        </p>
        <DataTable
          caption={`${guide.title} rules`}
          table={{ head: ['Topic', 'Rule'], rows: guide.review }}
        />
      </section>

      <section id="practice" aria-labelledby="practice-h">
        <h2 id="practice-h" className="text-2xl font-semibold">
          Practice questions
        </h2>
        <p className="mt-1 text-muted">Try each one, then open it to check your answer.</p>
        <ol className="mt-3 ml-5 flex list-decimal flex-col gap-2 text-lg">
          {guide.practice.map((p) => (
            <li key={p.q}>
              <details>
                <summary className="cursor-pointer">{p.q}</summary>
                <p className="mt-1 font-semibold text-ok">{p.a}</p>
              </details>
            </li>
          ))}
        </ol>
      </section>

      <p className="text-sm text-muted">
        Source:{' '}
        <a href={guide.video.url} className="underline" target="_blank" rel="noreferrer">
          {guide.video.label}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        . The notes and questions here are our own.
      </p>
    </div>
  );
}
