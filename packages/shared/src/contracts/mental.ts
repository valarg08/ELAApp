import { z } from 'zod';
import { MentalLevelsFile } from '../curriculum/math-content.js';

/**
 * The Mental Math home (mental-math-design.md): the four age levels with their planned units, the
 * cheat sheets there are, and the pattern tips of the published units (the page picks one a day).
 * The units' progress comes from /units?track=MENTAL.
 */
export const MentalHome = z.object({
  levels: MentalLevelsFile,
  cheatSheets: z.array(z.object({ unitNumber: z.number(), unitTitle: z.string() })),
  tips: z.array(z.object({ unitNumber: z.number(), tip: z.string() })),
});
export type MentalHome = z.infer<typeof MentalHome>;
