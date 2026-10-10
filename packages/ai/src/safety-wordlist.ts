/**
 * Fast local pre-filter (DESIGN.md §8.7): personal information and strong profanity. Runs before
 * (and independently of) the Claude safety classifier, so it works even when the AI is down.
 */

export const FLAG_TYPES = [
  'SELF_HARM',
  'ABUSE_DISCLOSURE',
  'VIOLENCE_THREAT',
  'BULLYING',
  'PERSONAL_INFO',
  'PROFANITY',
  'OTHER',
] as const;
export type FlagType = (typeof FLAG_TYPES)[number];

/** Severity 3 types notify the teacher urgently and hold AI feedback. */
export const URGENT_FLAG_TYPES: readonly FlagType[] = [
  'SELF_HARM',
  'ABUSE_DISCLOSURE',
  'VIOLENCE_THREAT',
];

export interface LocalFlag {
  type: FlagType;
  severity: 1 | 2 | 3;
  excerpt: string;
}

const EMAIL = /[\w.+-]+@[\w-]+\.[\w.-]{2,}/;
const PHONE = /(?:\+?\d[\s.-]?)?(?:\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}\b/;
const ADDRESS =
  /\b\d{1,5}\s+(?:[A-Z][a-z]+\s){1,3}(?:Street|St|Avenue|Ave|Road|Rd|Lane|Ln|Drive|Dr|Court|Ct|Boulevard|Blvd)\b/;
/** Kept short and unambiguous; mild words ("stupid", "crap") are fine in stories. */
const PROFANITY = /\b(?:fuck\w*|shit\w*|bitch\w*|cunt\w*|motherfuck\w*|asshole\w*)\b/i;

const excerptAround = (text: string, index: number, length: number) => {
  const start = Math.max(0, index - 40);
  const end = Math.min(text.length, index + length + 40);
  return `${start > 0 ? '…' : ''}${text.slice(start, end).replace(/\s+/g, ' ').trim()}${end < text.length ? '…' : ''}`;
};

export function localSafetyFlags(text: string): LocalFlag[] {
  const flags: LocalFlag[] = [];
  for (const pattern of [EMAIL, PHONE, ADDRESS]) {
    const m = pattern.exec(text);
    if (m) {
      flags.push({
        type: 'PERSONAL_INFO',
        severity: 1,
        excerpt: excerptAround(text, m.index, m[0].length),
      });
      break;
    }
  }
  const swear = PROFANITY.exec(text);
  if (swear) {
    flags.push({
      type: 'PROFANITY',
      severity: 1,
      excerpt: excerptAround(text, swear.index, swear[0].length),
    });
  }
  return flags;
}

/** What the student sees when their writing is held for the teacher (DESIGN.md §8.7). */
export const HOLDING_MESSAGE = 'Thanks for sharing your writing. Your teacher will read it soon.';
export const PERSONAL_INFO_REMINDER =
  'Remember: don’t put real phone numbers, emails or addresses in your stories.';
