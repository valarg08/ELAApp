/**
 * Who a Math-engine student is, for Quill's prompts: the AMC 10 group (math-design.md) or a
 * Mental Math learner aged 7–14 (mental-math-design.md).
 */
export type MathAudience = 'amc' | 'mental';

export const audienceLine = (audience: MathAudience = 'amc') =>
  audience === 'mental'
    ? 'Student: aged 7-14, building mental math and number sense. Use short sentences, everyday words and small friendly numbers; teach the pattern, not a trick.'
    : 'Student: aged 14-16, preparing for the AMC 10 on their own.';
