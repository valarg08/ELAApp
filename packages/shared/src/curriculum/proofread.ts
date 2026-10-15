import { z } from 'zod';

/**
 * Essay Writing proofreading (Unit 7 error clinic, DESIGN.md §9.12): a paragraph with planted
 * mistakes goes in the editor, and a checklist counts each mistake as fixed once one of its
 * fixes is in the text and the mistake is gone. Matching ignores curly vs straight quotes and
 * extra spaces, but not capitals ("home. Because" vs "home because" differ only in that).
 */
export const ProofreadError = z.object({
  /** The mistake exactly as the starter has it, with enough words around it to be unique. */
  wrong: z.string().trim().min(1).max(120),
  /** Ways to write it correctly (the same stretch of text, fixed). */
  fixes: z.array(z.string().trim().min(1).max(160)).min(1).max(6),
  /** Shown once it's fixed: what was wrong. */
  explanation: z.string().trim().min(1).max(300),
  /** Shown when the student asks for a hint: where to look, not the answer. */
  hint: z.string().trim().min(1).max(200).optional(),
});
export type ProofreadError = z.infer<typeof ProofreadError>;

export const Proofread = z.object({
  label: z.string().trim().min(1).max(120),
  errors: z.array(ProofreadError).min(1).max(25),
});
export type Proofread = z.infer<typeof Proofread>;

/** Straight quotes and single spaces, so typing style doesn't decide whether a fix counts. */
export function normaliseForProofread(text: string): string {
  return text
    .replace(/[‘’‛′]/g, "'")
    .replace(/[“”„″]/g, '"')
    .replace(/\s+/g, ' ');
}

/** Number of times `part` appears in `text` (both already normalised). */
export function occurrences(text: string, part: string): number {
  if (!part) return 0;
  let n = 0;
  for (let at = text.indexOf(part); at !== -1; at = text.indexOf(part, at + part.length)) n++;
  return n;
}

/** For each error, the fix the student's text has, or null while it isn't fixed. */
export function proofreadStatus(
  text: string,
  errors: readonly ProofreadError[],
): (string | null)[] {
  const t = normaliseForProofread(text);
  return errors.map((e) =>
    t.includes(normaliseForProofread(e.wrong))
      ? null
      : (e.fixes.find((f) => t.includes(normaliseForProofread(f))) ?? null),
  );
}
