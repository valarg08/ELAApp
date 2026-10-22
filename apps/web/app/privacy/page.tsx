import { APP_NAME } from '@storyforge/shared';
import Link from 'next/link';

export const metadata = { title: `Privacy · ${APP_NAME}` };

/** A plain-language privacy note for students, parents and teachers (DESIGN.md §13). */
export default function PrivacyPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-12">
      <h1 className="text-4xl font-bold">Privacy</h1>
      <p className="text-lg text-muted">
        {APP_NAME} is a writing and math practice site for classes. This page explains, in plain
        words, what it keeps and why.
      </p>

      <section aria-labelledby="what" className="flex flex-col gap-2">
        <h2 id="what" className="text-2xl font-semibold">
          What we keep
        </h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            <strong>Students:</strong> the name the teacher typed (a first name or nickname is
            enough), a made-up username, and a login code or picture password (stored scrambled,
            never as plain text). No email address, birthday or photo.
          </li>
          <li>
            <strong>Students&apos; work:</strong> writing drafts and their saved versions, answers
            to lessons, quizzes and math problems, and progress.
          </li>
          <li>
            <strong>Teachers:</strong> name, email address and a scrambled password.
          </li>
        </ul>
      </section>

      <section aria-labelledby="who" className="flex flex-col gap-2">
        <h2 id="who" className="text-2xl font-semibold">
          Who can see it
        </h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>A student sees their own work.</li>
          <li>The student&apos;s teacher sees the work and progress of their own classes.</li>
          <li>The site administrator can see accounts and usage to keep the site running.</li>
        </ul>
      </section>

      <section aria-labelledby="ai" className="flex flex-col gap-2">
        <h2 id="ai" className="text-2xl font-semibold">
          AI feedback
        </h2>
        <p>
          When a student asks Quill, the AI coach, for feedback, the text they wrote (without their
          name) is sent to Anthropic&apos;s Claude service to write the feedback. Under
          Anthropic&apos;s commercial terms this text is not used to train its models. Teachers can
          turn AI feedback off for a class.
        </p>
      </section>

      <section aria-labelledby="cookies" className="flex flex-col gap-2">
        <h2 id="cookies" className="text-2xl font-semibold">
          Cookies
        </h2>
        <p>
          Only the cookies needed to keep you signed in. No ads, no tracking and no selling of data.
        </p>
      </section>

      <section aria-labelledby="delete" className="flex flex-col gap-2">
        <h2 id="delete" className="text-2xl font-semibold">
          Questions and deleting data
        </h2>
        <p>
          Ask your teacher. They can remove a student, and they can ask the site administrator to
          delete all of a class&apos;s data. At the end of the trial the data is deleted unless the
          school asks to keep it.
        </p>
      </section>

      <p>
        <Link href="/" className="font-semibold text-brand underline">
          ← Back to {APP_NAME}
        </Link>
      </p>
    </main>
  );
}
