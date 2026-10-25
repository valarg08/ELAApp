import Link from 'next/link';
import { CourseShell } from '@/components/course-shell';

/** The parent guide (mental-math-design.md Part 7): how to help with Mental Math at home. */
export default function MentalParentGuide() {
  return (
    <CourseShell track="MENTAL">
      <article className="flex flex-col gap-6">
        <Link href="/mental" className="text-brand underline">
          ← Mental Math
        </Link>
        <div>
          <p className="text-sm font-semibold tracking-widest text-brand uppercase">
            For parents and carers
          </p>
          <h1 className="mt-1 text-4xl font-bold">Helping with Mental Math at home</h1>
          <p className="mt-2 text-lg text-muted">
            Mental Math teaches number patterns, not tricks: every shortcut comes with why it works.
            You don’t need to be good at maths to help. Here is what makes the biggest difference.
          </p>
        </div>

        <section aria-labelledby="little-often">
          <h2 id="little-often" className="text-2xl font-semibold">
            Little and often
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>
              10 minutes a day beats an hour on Sunday. Patterns stick with short, regular practice.
            </li>
            <li>
              The <strong>daily review</strong> on the Mental Math page takes about five minutes and
              brings back what your child learned earlier, just before it is forgotten.
            </li>
            <li>A lesson takes 15 to 25 minutes. One or two a week is a good pace.</li>
          </ul>
        </section>

        <section aria-labelledby="ask-how">
          <h2 id="ask-how" className="text-2xl font-semibold">
            Ask “how did you think it?”
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>
              Ask how they worked it out rather than only what the answer is. “I made 10 first” is
              the real learning.
            </li>
            <li>
              There is often more than one good way. Ask them to show you theirs, then another.
            </li>
            <li>
              A wrong answer with a good idea behind it is worth talking about, not just fixing.
            </li>
          </ul>
        </section>

        <section aria-labelledby="praise">
          <h2 id="praise" className="text-2xl font-semibold">
            Praise the strategy, not the speed
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>
              Say “you spotted the pair that makes 100!” rather than “you’re so fast”. Speed comes
              with practice.
            </li>
            <li>
              Speed sprints compare your child only with their own best. There are no leaderboards.
            </li>
            <li>
              Unit checks need every answer right, so a second or third try is normal and fine.
            </li>
          </ul>
        </section>

        <section aria-labelledby="everyday">
          <h2 id="everyday" className="text-2xl font-semibold">
            Everyday chances
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Change at the shop: “It costs 64. How much change from 100?”</li>
            <li>Sharing snacks: halves, quarters and “is there one left over?”</li>
            <li>Times on the clock: “The film is 95 minutes long. When does it end?”</li>
            <li>Scores in games, distances on a journey and prices in a sale (10% off).</li>
          </ul>
        </section>

        <section aria-labelledby="where">
          <h2 id="where" className="text-2xl font-semibold">
            Where to start
          </h2>
          <p className="mt-2">
            There are four levels by age: Level 1 (ages 7–8), Level 2 (9–10), Level 3 (11–12) and
            Level 4 (13–14). If your child is older or already confident, the{' '}
            <Link href="/mental/tests/mental-placement" className="text-brand underline">
              placement check
            </Link>{' '}
            finds the right level and opens its units. Each level ends with a level check and a
            badge.
          </p>
        </section>
      </article>
    </CourseShell>
  );
}
