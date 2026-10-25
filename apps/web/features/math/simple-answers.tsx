'use client';

import { createContext, useContext } from 'react';

/**
 * Simple answers (Mental Math, mental-math-design.md): whole numbers only, so the answer box hides
 * the √ π / ^ helpers and asks for a number. The lesson player turns it on for Mental Math lessons.
 */
export const SimpleAnswers = createContext(false);

export const useSimpleAnswers = () => useContext(SimpleAnswers);
