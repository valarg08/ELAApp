import { MathHome } from '@storyforge/shared';
import Link from 'next/link';
import { serverApi } from '@/lib/server-api';
import { cyanFocus } from './course-styles';

/** The Math fact sheets (formulas and key facts per unit), below the bars in the Progress panel. */
export async function MathFactSheets() {
  const home = await serverApi('/math/home', MathHome);
  if (!home) return null;
  return (
    <section aria-labelledby="fact-sheets" className="mt-5 border-t border-brand/30 pt-4">
      <h3 id="fact-sheets" className="text-sm font-semibold">
        Fact sheets
      </h3>
      {home.factSheets.length === 0 ? (
        <p className="mt-1 text-sm">None yet</p>
      ) : (
        <ul className="mt-1 flex flex-col gap-1">
          {home.factSheets.map((f) => (
            <li key={f.number}>
              <Link
                href={`/math/facts/${f.number}`}
                className={`text-sm text-brand underline ${cyanFocus}`}
              >
                Unit {f.number}: {f.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
