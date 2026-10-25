import { MentalHome } from '@storyforge/shared';
import Link from 'next/link';
import { MathText } from './math-text';
import { serverApi } from '@/lib/server-api';
import { cyanFocus } from './course-styles';

/**
 * The day's pattern tip, the same for everyone all day (one per day, in turn). The home page passes
 * an offset so it shows a different tip from the Progress panel.
 */
export function tipOfTheDay(tips: MentalHome['tips'], offset = 0) {
  if (tips.length === 0) return null;
  const day = Math.floor(Date.now() / 86_400_000);
  return tips[(day + offset) % tips.length];
}

/**
 * The Mental Math cheat sheets and the day's pattern tip, below the bars in the Progress panel
 * (mental-math-design.md): CourseShell shows them on every Mental Math page.
 */
export async function MentalCheatSheets() {
  const home = await serverApi('/mental/home', MentalHome);
  if (!home) return null;
  const tip = tipOfTheDay(home.tips);
  return (
    <>
      {tip && (
        <section aria-labelledby="tip-of-the-day" className="mt-5 border-t border-brand/30 pt-4">
          <h3 id="tip-of-the-day" className="text-sm font-semibold">
            <span aria-hidden="true">💡</span> Tip of the day
          </h3>
          {/* Math at text size (not 1.1em) so a sum fits the narrow panel. */}
          <p className="mt-1 text-sm [&_math]:text-[1em]!">
            <MathText text={tip.tip} />
          </p>
        </section>
      )}
      <section aria-labelledby="cheat-sheets" className="mt-5 border-t border-brand/30 pt-4">
        <h3 id="cheat-sheets" className="text-sm font-semibold">
          Cheat sheets
        </h3>
        {home.cheatSheets.length === 0 ? (
          <p className="mt-1 text-sm">None yet</p>
        ) : (
          <ul className="mt-1 flex flex-col gap-1">
            {home.cheatSheets.map((c) => (
              <li key={c.unitNumber}>
                <Link
                  href={`/mental/cheat-sheets/${c.unitNumber}`}
                  className={`text-sm text-brand underline ${cyanFocus}`}
                >
                  Unit {c.unitNumber}: {c.unitTitle}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
