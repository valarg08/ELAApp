/**
 * Who a Math-engine student is, for Quill's prompts: the AMC 10 group (math-design.md) or a
 * Mental Math learner aged 7–14 (mental-math-design.md), or a PSAT student (psat-design.md).
 */
export type MathAudience = 'amc' | 'mental' | 'psat';

export const audienceLine = (audience: MathAudience = 'amc') =>
  audience === 'mental'
    ? 'Student: aged 7-14, building mental math and number sense. Use short sentences, everyday words and small friendly numbers; teach the pattern, not a trick.'
    : audience === 'psat'
      ? 'Student: aged 14-16, preparing for the PSAT/NMSQT math section on their own (four-choice and typed-answer questions; a calculator is allowed).'
      : 'Student: aged 14-16, preparing for the AMC 10 on their own.';
