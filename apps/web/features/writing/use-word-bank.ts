'use client';

import { WordBankResponse, type WordBankEntry } from '@storyforge/shared';
import { useEffect, useState } from 'react';
import { apiJson } from '@/lib/api-client';

/** The student's sensory word bank (null while loading; empty if it can't be loaded). */
export function useWordBank() {
  const [words, setWords] = useState<WordBankEntry[] | null>(null);
  useEffect(() => {
    let live = true;
    apiJson('/word-bank', WordBankResponse)
      .then((r) => live && setWords(r.words))
      .catch(() => live && setWords([]));
    return () => {
      live = false;
    };
  }, []);
  return [words, setWords] as const;
}
