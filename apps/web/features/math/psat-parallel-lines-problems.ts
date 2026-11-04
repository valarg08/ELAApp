import type { GuideProblem } from './guide-problem';

/**
 * 50 problems per Parallel Lines and Angles chapter, simple to complex (1–16 warm-up, 17–34 core, 35–50 challenge),
 * and a 50-problem final test that mixes every chapter. Generated from small templates, so every answer is computed.
 */
export const PARALLEL_LINES_PROBLEMS: Record<string, GuideProblem[]> = {
  parallel: [
    {
      q: 'A line has a slope of −3. What is the slope of a line parallel to it?',
      a: '-3',
      steps: ['Parallel lines have the same slope.', 'The slope is −3.', 'Answer: −3'],
    },
    {
      q: 'A line has a slope of 7/2. What is the slope of a line parallel to it?',
      a: '7/2',
      form: 'fraction',
      steps: ['Parallel lines have the same slope.', 'The slope is 7/2.', 'Answer: 7/2'],
    },
    {
      q: 'A line has a slope of −2. What is the slope of a line parallel to it?',
      a: '-2',
      steps: ['Parallel lines have the same slope.', 'The slope is −2.', 'Answer: −2'],
    },
    {
      q: 'A line has a slope of 1/3. What is the slope of a line parallel to it?',
      a: '1/3',
      form: 'fraction',
      steps: ['Parallel lines have the same slope.', 'The slope is 1/3.', 'Answer: 1/3'],
    },
    {
      q: 'A line has a slope of 6. What is the slope of a line perpendicular to it?',
      a: '-1/6',
      form: 'fraction',
      steps: [
        'For a perpendicular line, flip the fraction and change the sign.',
        '6 becomes −1/6.',
        'Answer: −1/6',
      ],
    },
    {
      q: 'A line has a slope of −1/3. What is the slope of a line perpendicular to it?',
      a: '3',
      steps: [
        'For a perpendicular line, flip the fraction and change the sign.',
        '−1/3 becomes 3.',
        'Answer: 3',
      ],
    },
    {
      q: 'A line has a slope of −4. What is the slope of a line perpendicular to it?',
      a: '1/4',
      form: 'fraction',
      steps: [
        'For a perpendicular line, flip the fraction and change the sign.',
        '−4 becomes 1/4.',
        'Answer: 1/4',
      ],
    },
    {
      q: 'A line has a slope of −2/9. What is the slope of a line perpendicular to it?',
      a: '9/2',
      form: 'fraction',
      steps: [
        'For a perpendicular line, flip the fraction and change the sign.',
        '−2/9 becomes 9/2.',
        'Answer: 9/2',
      ],
    },
    {
      q: 'A line has a slope of −7. What is the slope of a line perpendicular to it?',
      a: '1/7',
      form: 'fraction',
      steps: [
        'For a perpendicular line, flip the fraction and change the sign.',
        '−7 becomes 1/7.',
        'Answer: 1/7',
      ],
    },
    {
      q: 'A line has a slope of −7/2. What is the slope of a line perpendicular to it?',
      a: '2/7',
      form: 'fraction',
      steps: [
        'For a perpendicular line, flip the fraction and change the sign.',
        '−7/2 becomes 2/7.',
        'Answer: 2/7',
      ],
    },
    {
      q: 'What is the slope of a line parallel to y = −6/5x?',
      a: '-6/5',
      form: 'fraction',
      steps: [
        'The slope of y = −6/5x is −6/5.',
        'A parallel line has the same slope, −6/5.',
        'Answer: −6/5',
      ],
    },
    {
      q: 'What is the slope of a line parallel to y = −2/3x − 8?',
      a: '-2/3',
      form: 'fraction',
      steps: [
        'The slope of y = −2/3x − 8 is −2/3.',
        'A parallel line has the same slope, −2/3.',
        'Answer: −2/3',
      ],
    },
    {
      q: 'What is the slope of a line parallel to y = −1/2x − 4?',
      a: '-1/2',
      form: 'fraction',
      steps: [
        'The slope of y = −1/2x − 4 is −1/2.',
        'A parallel line has the same slope, −1/2.',
        'Answer: −1/2',
      ],
    },
    {
      q: 'What is the slope of a line perpendicular to y = −4/9x + 9?',
      a: '9/4',
      form: 'fraction',
      steps: [
        'The slope of y = −4/9x + 9 is −4/9.',
        'A perpendicular line has the negative reciprocal slope: 9/4.',
        'Answer: 9/4',
      ],
    },
    {
      q: 'What is the slope of a line perpendicular to y = −5/2x − 1?',
      a: '2/5',
      form: 'fraction',
      steps: [
        'The slope of y = −5/2x − 1 is −5/2.',
        'A perpendicular line has the negative reciprocal slope: 2/5.',
        'Answer: 2/5',
      ],
    },
    {
      q: 'What is the slope of a line perpendicular to y = 5/6x − 9?',
      a: '-6/5',
      form: 'fraction',
      steps: [
        'The slope of y = 5/6x − 9 is 5/6.',
        'A perpendicular line has the negative reciprocal slope: −6/5.',
        'Answer: −6/5',
      ],
    },
    {
      q: 'Are the lines y = −1/3x + 3 and y = −1/3x + 8 parallel? Type 1 for yes, 0 for no.',
      a: '1',
      steps: [
        'Their slopes are −1/3 and −1/3.',
        'Parallel lines have equal slopes: −1/3 = −1/3.',
        'So the answer is yes, 1.',
        'Answer: 1',
      ],
    },
    {
      q: 'Are the lines y = −1/4x − 6 and y = 1/2x + 1 parallel? Type 1 for yes, 0 for no.',
      a: '0',
      steps: [
        'Their slopes are −1/4 and 1/2.',
        'Parallel lines have equal slopes: −1/4 ≠ 1/2.',
        'So the answer is no, 0.',
        'Answer: 0',
      ],
    },
    {
      q: 'Are the lines y = −7/2x − 2 and y = 2/7x + 7 perpendicular? Type 1 for yes, 0 for no.',
      a: '1',
      steps: [
        'Their slopes are −7/2 and 2/7.',
        'Perpendicular slopes multiply to −1: −7/2 × 2/7 = −1.',
        'So the answer is yes, 1.',
        'Answer: 1',
      ],
    },
    {
      q: 'Are the lines y = −7/2x + 8 and y = 2/7x + 1 perpendicular? Type 1 for yes, 0 for no.',
      a: '1',
      steps: [
        'Their slopes are −7/2 and 2/7.',
        'Perpendicular slopes multiply to −1: −7/2 × 2/7 = −1.',
        'So the answer is yes, 1.',
        'Answer: 1',
      ],
    },
    {
      q: 'A line passes through (−3, 4) and (1, 2). What is the slope of a line parallel to it?',
      a: '-1/2',
      form: 'fraction',
      steps: [
        'Slope = rise ÷ run = (2 − 4) ÷ (1 − (−3)) = −1/2.',
        'A parallel line has the same slope, −1/2.',
        'Answer: −1/2',
      ],
    },
    {
      q: 'A line passes through (−1, 2) and (5, −2). What is the slope of a line parallel to it?',
      a: '-2/3',
      form: 'fraction',
      steps: [
        'Slope = rise ÷ run = (−2 − 2) ÷ (5 − (−1)) = −2/3.',
        'A parallel line has the same slope, −2/3.',
        'Answer: −2/3',
      ],
    },
    {
      q: 'A line passes through (−5, 0) and (1, −2). What is the slope of a line perpendicular to it?',
      a: '3',
      steps: [
        'Slope = rise ÷ run = (−2 − 0) ÷ (1 − (−5)) = −1/3.',
        'A perpendicular line has the negative reciprocal slope, 3.',
        'Answer: 3',
      ],
    },
    {
      q: 'A line passes through (0, 4) and (2, 1). What is the slope of a line perpendicular to it?',
      a: '2/3',
      form: 'fraction',
      steps: [
        'Slope = rise ÷ run = (1 − 4) ÷ (2 − 0) = −3/2.',
        'A perpendicular line has the negative reciprocal slope, 2/3.',
        'Answer: 2/3',
      ],
    },
    {
      q: 'What is the slope of a line parallel to 2x + 4y = 3?',
      a: '-1/2',
      form: 'fraction',
      steps: [
        'Solve for y: 4y = −2x + 3, so y = −1/2x + 3/4.',
        'The slope is −1/2.',
        'A parallel line has the same slope, −1/2.',
        'Answer: −1/2',
      ],
    },
    {
      q: 'What is the slope of a line parallel to x + 4y = 20?',
      a: '-1/4',
      form: 'fraction',
      steps: [
        'Solve for y: 4y = −1x + 20, so y = −1/4x + 20/4.',
        'The slope is −1/4.',
        'A parallel line has the same slope, −1/4.',
        'Answer: −1/4',
      ],
    },
    {
      q: 'What is the slope of a line perpendicular to 4x + 2y = 19?',
      a: '1/2',
      form: 'fraction',
      steps: [
        'Solve for y: 2y = −4x + 19, so y = −2x + 19/2.',
        'The slope is −2.',
        'A perpendicular line has the negative reciprocal slope, 1/2.',
        'Answer: 1/2',
      ],
    },
    {
      q: 'What is the slope of a line perpendicular to 3x + 2y = 3?',
      a: '2/3',
      form: 'fraction',
      steps: [
        'Solve for y: 2y = −3x + 3, so y = −3/2x + 3/2.',
        'The slope is −3/2.',
        'A perpendicular line has the negative reciprocal slope, 2/3.',
        'Answer: 2/3',
      ],
    },
    {
      q: 'The lines y = kx + 3 and y = 4x − 4 are parallel. What is k?',
      a: '4',
      steps: ['Parallel lines have the same slope.', 'k = 4.', 'Answer: 4'],
    },
    {
      q: 'The lines y = kx + 5 and y = 2x − 4 are parallel. What is k?',
      a: '2',
      steps: ['Parallel lines have the same slope.', 'k = 2.', 'Answer: 2'],
    },
    {
      q: 'The lines y = kx + 7 and y = −3x − 4 are parallel. What is k?',
      a: '-3',
      steps: ['Parallel lines have the same slope.', 'k = −3.', 'Answer: −3'],
    },
    {
      q: 'The lines y = kx + 5 and y = −4x − 4 are perpendicular. What is k?',
      a: '1/4',
      form: 'fraction',
      steps: [
        'The slope of the second line is −4.',
        'A perpendicular slope is the negative reciprocal: k = 1/4.',
        'Answer: 1/4',
      ],
    },
    {
      q: 'The lines y = kx + 7 and y = 2x − 4 are perpendicular. What is k?',
      a: '-1/2',
      form: 'fraction',
      steps: [
        'The slope of the second line is 2.',
        'A perpendicular slope is the negative reciprocal: k = −1/2.',
        'Answer: −1/2',
      ],
    },
    {
      q: 'The lines y = kx + 5 and y = 2x − 4 are perpendicular. What is k?',
      a: '-1/2',
      form: 'fraction',
      steps: [
        'The slope of the second line is 2.',
        'A perpendicular slope is the negative reciprocal: k = −1/2.',
        'Answer: −1/2',
      ],
    },
    {
      q: 'A line through (−4, −2) is parallel to y = 5x − 3. What is its y-intercept?',
      a: '18',
      steps: [
        'A parallel line has the same slope: y = 5x + b.',
        'Put in the point: −2 = 5(−4) + b, so b = −2 − −20 = 18.',
        'Answer: 18',
      ],
    },
    {
      q: 'A line through (2, −5) is parallel to y = 2x + 1. What is its y-intercept?',
      a: '-9',
      steps: [
        'A parallel line has the same slope: y = 2x + b.',
        'Put in the point: −5 = 2(2) + b, so b = −5 − 4 = −9.',
        'Answer: −9',
      ],
    },
    {
      q: 'A line through (5, −5) is parallel to y = x − 5. What is its y-intercept?',
      a: '-10',
      steps: [
        'A parallel line has the same slope: y = 1x + b.',
        'Put in the point: −5 = 1(5) + b, so b = −5 − 5 = −10.',
        'Answer: −10',
      ],
    },
    {
      q: 'A line through (1, −6) is parallel to y = 3x − 6. What is its y-intercept?',
      a: '-9',
      steps: [
        'A parallel line has the same slope: y = 3x + b.',
        'Put in the point: −6 = 3(1) + b, so b = −6 − 3 = −9.',
        'Answer: −9',
      ],
    },
    {
      q: 'A line through (5, 2) is parallel to y = −2x + 4. What is its y-intercept?',
      a: '12',
      steps: [
        'A parallel line has the same slope: y = −2x + b.',
        'Put in the point: 2 = −2(5) + b, so b = 2 − −10 = 12.',
        'Answer: 12',
      ],
    },
    {
      q: 'A line through (−2, 7) is perpendicular to y = x − 2. What is its y-intercept?',
      a: '5',
      steps: [
        'The slope of the given line is 1, so the perpendicular slope is −1.',
        'Put in the point: 7 = −1(−2) + b, so b = 7 − 2 = 5.',
        'Answer: 5',
      ],
    },
    {
      q: 'A line through (−6, 0) is perpendicular to y = 2x + 1. What is its y-intercept?',
      a: '-3',
      steps: [
        'The slope of the given line is 2, so the perpendicular slope is −1/2.',
        'Put in the point: 0 = −1/2(−6) + b, so b = 0 − 3 = −3.',
        'Answer: −3',
      ],
    },
    {
      q: 'A line through (6, 3) is perpendicular to y = 3x − 5. What is its y-intercept?',
      a: '5',
      steps: [
        'The slope of the given line is 3, so the perpendicular slope is −1/3.',
        'Put in the point: 3 = −1/3(6) + b, so b = 3 − −2 = 5.',
        'Answer: 5',
      ],
    },
    {
      q: 'A line through (−4, 0) is perpendicular to y = 4x + 2. What is its y-intercept?',
      a: '-1',
      steps: [
        'The slope of the given line is 4, so the perpendicular slope is −1/4.',
        'Put in the point: 0 = −1/4(−4) + b, so b = 0 − 1 = −1.',
        'Answer: −1',
      ],
    },
    {
      q: 'A line through (6, −5) is perpendicular to y = 2x + 6. What is its y-intercept?',
      a: '-2',
      steps: [
        'The slope of the given line is 2, so the perpendicular slope is −1/2.',
        'Put in the point: −5 = −1/2(6) + b, so b = −5 − −3 = −2.',
        'Answer: −2',
      ],
    },
    {
      q: 'The lines kx + 2y = 8 and −2x + y = 7 are parallel. What is k?',
      a: '-4',
      steps: [
        'Write each line as y = mx + c: the first has slope −k/2 and the second has slope 2.',
        'Parallel lines have equal slopes: −k/2 = 2, so k = −4.',
        'Answer: −4',
      ],
    },
    {
      q: 'The lines kx + 2y = 8 and 3x + y = 7 are parallel. What is k?',
      a: '6',
      steps: [
        'Write each line as y = mx + c: the first has slope −k/2 and the second has slope −3.',
        'Parallel lines have equal slopes: −k/2 = −3, so k = 6.',
        'Answer: 6',
      ],
    },
    {
      q: 'The lines kx + 2y = 8 and 5x + y = 7 are perpendicular. What is k?',
      a: '-2/5',
      form: 'fraction',
      steps: [
        'The first line has slope −k/2 and the second has slope −5.',
        'Perpendicular slopes multiply to −1: (−k/2)(−5) = −1, so kp/2 = −1 with p = 5.',
        'k = −2/5.',
        'Answer: −2/5',
      ],
    },
    {
      q: 'The lines kx + 2y = 8 and −3x + y = 7 are perpendicular. What is k?',
      a: '2/3',
      form: 'fraction',
      steps: [
        'The first line has slope −k/2 and the second has slope 3.',
        'Perpendicular slopes multiply to −1: (−k/2)(3) = −1, so kp/2 = −1 with p = −3.',
        'k = 2/3.',
        'Answer: 2/3',
      ],
    },
    {
      q: 'Line m passes through (1, 0) and (8, 3). A line n is perpendicular to m, and a line p is perpendicular to n. What is the slope of p?',
      a: '3/7',
      form: 'fraction',
      steps: [
        'The slope of m is 3/7.',
        'n is perpendicular to m, so its slope is −7/3.',
        'p is perpendicular to n, so its slope is 3/7, the same as m: p is parallel to m.',
        'Answer: 3/7',
      ],
    },
    {
      q: 'Line m passes through (2, −3) and (5, 2). A line n is perpendicular to m, and a line p is perpendicular to n. What is the slope of p?',
      a: '5/3',
      form: 'fraction',
      steps: [
        'The slope of m is 5/3.',
        'n is perpendicular to m, so its slope is −3/5.',
        'p is perpendicular to n, so its slope is 5/3, the same as m: p is parallel to m.',
        'Answer: 5/3',
      ],
    },
  ],
  transversal: [
    {
      q: 'In the figure, the two horizontal lines are parallel. What is the relationship between ∠3 and ∠6? Type 1 for alternate interior, 2 for alternate exterior, 3 for corresponding, 4 for consecutive interior, 5 for vertical, 6 for a linear pair, 7 for consecutive exterior.',
      a: '1',
      steps: [
        'Look at where the two angles sit. ∠3 and ∠6 are alternate interior angles.',
        'That is code 1.',
        'Answer: 1',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. What is the relationship between ∠7 and ∠2? Type 1 for alternate interior, 2 for alternate exterior, 3 for corresponding, 4 for consecutive interior, 5 for vertical, 6 for a linear pair, 7 for consecutive exterior.',
      a: '2',
      steps: [
        'Look at where the two angles sit. ∠7 and ∠2 are alternate exterior angles.',
        'That is code 2.',
        'Answer: 2',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. What is the relationship between ∠3 and ∠7? Type 1 for alternate interior, 2 for alternate exterior, 3 for corresponding, 4 for consecutive interior, 5 for vertical, 6 for a linear pair, 7 for consecutive exterior.',
      a: '3',
      steps: [
        'Look at where the two angles sit. ∠3 and ∠7 are corresponding angles.',
        'That is code 3.',
        'Answer: 3',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. What is the relationship between ∠6 and ∠4? Type 1 for alternate interior, 2 for alternate exterior, 3 for corresponding, 4 for consecutive interior, 5 for vertical, 6 for a linear pair, 7 for consecutive exterior.',
      a: '4',
      steps: [
        'Look at where the two angles sit. ∠6 and ∠4 are consecutive (same-side) interior angles.',
        'That is code 4.',
        'Answer: 4',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. What is the relationship between ∠4 and ∠1? Type 1 for alternate interior, 2 for alternate exterior, 3 for corresponding, 4 for consecutive interior, 5 for vertical, 6 for a linear pair, 7 for consecutive exterior.',
      a: '5',
      steps: [
        'Look at where the two angles sit. ∠4 and ∠1 are vertical angles.',
        'That is code 5.',
        'Answer: 5',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. What is the relationship between ∠3 and ∠1? Type 1 for alternate interior, 2 for alternate exterior, 3 for corresponding, 4 for consecutive interior, 5 for vertical, 6 for a linear pair, 7 for consecutive exterior.',
      a: '6',
      steps: [
        'Look at where the two angles sit. ∠3 and ∠1 are a linear pair (they form a straight line).',
        'That is code 6.',
        'Answer: 6',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. What is the relationship between ∠1 and ∠7? Type 1 for alternate interior, 2 for alternate exterior, 3 for corresponding, 4 for consecutive interior, 5 for vertical, 6 for a linear pair, 7 for consecutive exterior.',
      a: '7',
      steps: [
        'Look at where the two angles sit. ∠1 and ∠7 are consecutive (same-side) exterior angles.',
        'That is code 7.',
        'Answer: 7',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. How many of the eight angles are interior angles (between the two parallel lines)?',
      a: '4',
      steps: [
        'Interior means between the two parallel lines.',
        'The interior angles are 3, 4, 5 and 6, so there are 4.',
        'Answer: 4',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. How many of the eight angles are exterior angles (outside the two parallel lines)?',
      a: '4',
      steps: [
        'Exterior means outside the two parallel lines.',
        'The exterior angles are 1, 2, 7 and 8, so there are 4.',
        'Answer: 4',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. How many angles do the two parallel lines and the transversal make in all?',
      a: '8',
      steps: [
        'Each crossing makes 4 angles.',
        'There are 2 crossings, so 2 × 4 = 8 angles.',
        'Answer: 8',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. How many of the eight angles lie to the left of the transversal?',
      a: '4',
      steps: [
        'Angles 1, 3, 5 and 7 are on the left of the transversal.',
        'That is 4 angles.',
        'Answer: 4',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. Which angle is the alternate interior angle of ∠5? Type its number.',
      a: '4',
      steps: [
        'The alternate interior angle of ∠5 is the one in the matching position that makes alternate interior angles.',
        'That is ∠4.',
        'Answer: 4',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. Which angle is the alternate exterior angle of ∠2? Type its number.',
      a: '7',
      steps: [
        'The alternate exterior angle of ∠2 is the one in the matching position that makes alternate exterior angles.',
        'That is ∠7.',
        'Answer: 7',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. Which angle is the corresponding angle of ∠6? Type its number.',
      a: '2',
      steps: [
        'The corresponding angle of ∠6 is the one in the matching position that makes corresponding angles.',
        'That is ∠2.',
        'Answer: 2',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. Which angle is the consecutive interior angle of ∠6? Type its number.',
      a: '4',
      steps: [
        'The consecutive interior angle of ∠6 is the one in the matching position that makes consecutive (same-side) interior angles.',
        'That is ∠4.',
        'Answer: 4',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. Which angle is the vertical angle of ∠1? Type its number.',
      a: '4',
      steps: [
        'The vertical angle of ∠1 is the one in the matching position that makes vertical angles.',
        'That is ∠4.',
        'Answer: 4',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. Which angle is the alternate interior angle of ∠6? Type its number.',
      a: '3',
      steps: [
        'The alternate interior angle of ∠6 is the one in the matching position that makes alternate interior angles.',
        'That is ∠3.',
        'Answer: 3',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. Which angle is the alternate exterior angle of ∠8? Type its number.',
      a: '1',
      steps: [
        'The alternate exterior angle of ∠8 is the one in the matching position that makes alternate exterior angles.',
        'That is ∠1.',
        'Answer: 1',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. Which angle is the corresponding angle of ∠2? Type its number.',
      a: '6',
      steps: [
        'The corresponding angle of ∠2 is the one in the matching position that makes corresponding angles.',
        'That is ∠6.',
        'Answer: 6',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. Which angle is the consecutive interior angle of ∠5? Type its number.',
      a: '3',
      steps: [
        'The consecutive interior angle of ∠5 is the one in the matching position that makes consecutive (same-side) interior angles.',
        'That is ∠3.',
        'Answer: 3',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. Which angle is the vertical angle of ∠8? Type its number.',
      a: '5',
      steps: [
        'The vertical angle of ∠8 is the one in the matching position that makes vertical angles.',
        'That is ∠5.',
        'Answer: 5',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. Which angle is the alternate interior angle of ∠3? Type its number.',
      a: '6',
      steps: [
        'The alternate interior angle of ∠3 is the one in the matching position that makes alternate interior angles.',
        'That is ∠6.',
        'Answer: 6',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. Which angle is the alternate exterior angle of ∠1? Type its number.',
      a: '8',
      steps: [
        'The alternate exterior angle of ∠1 is the one in the matching position that makes alternate exterior angles.',
        'That is ∠8.',
        'Answer: 8',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. Which angle is the corresponding angle of ∠7? Type its number.',
      a: '3',
      steps: [
        'The corresponding angle of ∠7 is the one in the matching position that makes corresponding angles.',
        'That is ∠3.',
        'Answer: 3',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. Which angle is the consecutive interior angle of ∠3? Type its number.',
      a: '5',
      steps: [
        'The consecutive interior angle of ∠3 is the one in the matching position that makes consecutive (same-side) interior angles.',
        'That is ∠5.',
        'Answer: 5',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. Which angle is the vertical angle of ∠2? Type its number.',
      a: '3',
      steps: [
        'The vertical angle of ∠2 is the one in the matching position that makes vertical angles.',
        'That is ∠3.',
        'Answer: 3',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. What is the relationship between ∠2 and ∠7? Type 1 for alternate interior, 2 for alternate exterior, 3 for corresponding, 4 for consecutive interior, 5 for vertical, 6 for a linear pair, 7 for consecutive exterior.',
      a: '2',
      steps: [
        'Look at where the two angles sit. ∠2 and ∠7 are alternate exterior angles.',
        'That is code 2.',
        'Answer: 2',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. What is the relationship between ∠5 and ∠3? Type 1 for alternate interior, 2 for alternate exterior, 3 for corresponding, 4 for consecutive interior, 5 for vertical, 6 for a linear pair, 7 for consecutive exterior.',
      a: '4',
      steps: [
        'Look at where the two angles sit. ∠5 and ∠3 are consecutive (same-side) interior angles.',
        'That is code 4.',
        'Answer: 4',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. What is the relationship between ∠4 and ∠2? Type 1 for alternate interior, 2 for alternate exterior, 3 for corresponding, 4 for consecutive interior, 5 for vertical, 6 for a linear pair, 7 for consecutive exterior.',
      a: '6',
      steps: [
        'Look at where the two angles sit. ∠4 and ∠2 are a linear pair (they form a straight line).',
        'That is code 6.',
        'Answer: 6',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. What is the relationship between ∠4 and ∠5? Type 1 for alternate interior, 2 for alternate exterior, 3 for corresponding, 4 for consecutive interior, 5 for vertical, 6 for a linear pair, 7 for consecutive exterior.',
      a: '1',
      steps: [
        'Look at where the two angles sit. ∠4 and ∠5 are alternate interior angles.',
        'That is code 1.',
        'Answer: 1',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. What is the relationship between ∠2 and ∠8? Type 1 for alternate interior, 2 for alternate exterior, 3 for corresponding, 4 for consecutive interior, 5 for vertical, 6 for a linear pair, 7 for consecutive exterior.',
      a: '7',
      steps: [
        'Look at where the two angles sit. ∠2 and ∠8 are consecutive (same-side) exterior angles.',
        'That is code 7.',
        'Answer: 7',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. What is the relationship between ∠1 and ∠4? Type 1 for alternate interior, 2 for alternate exterior, 3 for corresponding, 4 for consecutive interior, 5 for vertical, 6 for a linear pair, 7 for consecutive exterior.',
      a: '5',
      steps: [
        'Look at where the two angles sit. ∠1 and ∠4 are vertical angles.',
        'That is code 5.',
        'Answer: 5',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. What is the relationship between ∠4 and ∠3? Type 1 for alternate interior, 2 for alternate exterior, 3 for corresponding, 4 for consecutive interior, 5 for vertical, 6 for a linear pair, 7 for consecutive exterior.',
      a: '6',
      steps: [
        'Look at where the two angles sit. ∠4 and ∠3 are a linear pair (they form a straight line).',
        'That is code 6.',
        'Answer: 6',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. What is the relationship between ∠8 and ∠1? Type 1 for alternate interior, 2 for alternate exterior, 3 for corresponding, 4 for consecutive interior, 5 for vertical, 6 for a linear pair, 7 for consecutive exterior.',
      a: '2',
      steps: [
        'Look at where the two angles sit. ∠8 and ∠1 are alternate exterior angles.',
        'That is code 2.',
        'Answer: 2',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠2 = 50°. How many of the eight angles measure 50°?',
      a: '4',
      steps: [
        'The eight angles take only two values: 50° and 180° − 50° = 130°.',
        'Four angles are 50° and four are 130°, so 4 of them measure 50°.',
        'Answer: 4',
      ],
      fig: {
        kind: 'transversal',
        angle: 50,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠4 = 110°. How many of the eight angles measure 110°?',
      a: '4',
      steps: [
        'The eight angles take only two values: 110° and 180° − 110° = 70°.',
        'Four angles are 110° and four are 70°, so 4 of them measure 110°.',
        'Answer: 4',
      ],
      fig: {
        kind: 'transversal',
        angle: 70,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠1 = 125°. How many of the eight angles measure 55°?',
      a: '4',
      steps: [
        'The eight angles take only two values: 125° and 180° − 125° = 55°.',
        'Four angles are 125° and four are 55°, so 4 of them measure 55°.',
        'Answer: 4',
      ],
      fig: {
        kind: 'transversal',
        angle: 55,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠1 = 50°. How many of the eight angles measure 50°?',
      a: '4',
      steps: [
        'The eight angles take only two values: 50° and 180° − 50° = 130°.',
        'Four angles are 50° and four are 130°, so 4 of them measure 50°.',
        'Answer: 4',
      ],
      fig: {
        kind: 'transversal',
        angle: 130,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠5 = 75°. What is ∠2 + ∠7?',
      a: '210',
      steps: [
        'The eight angles are 75° or 105°: ∠2 = 105°, ∠7 = 105°.',
        '105 + 105 = 210.',
        'Answer: 210',
      ],
      fig: {
        kind: 'transversal',
        angle: 105,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠5 = 45°. What is ∠1 + ∠4 + ∠8?',
      a: '135',
      steps: [
        'The eight angles are 45° or 135°: ∠1 = 45°, ∠4 = 45°, ∠8 = 45°.',
        '45 + 45 + 45 = 135.',
        'Answer: 135',
      ],
      fig: {
        kind: 'transversal',
        angle: 135,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠7 = 45°. What is ∠2 + ∠3 + ∠4 + ∠5?',
      a: '360',
      steps: [
        'The eight angles are 45° or 135°: ∠2 = 45°, ∠3 = 45°, ∠4 = 135°, ∠5 = 135°.',
        '45 + 45 + 135 + 135 = 360.',
        'Answer: 360',
      ],
      fig: {
        kind: 'transversal',
        angle: 45,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠7 = 105°. What is ∠1 + ∠4 + ∠6?',
      a: '255',
      steps: [
        'The eight angles are 105° or 75°: ∠1 = 75°, ∠4 = 75°, ∠6 = 105°.',
        '75 + 75 + 105 = 255.',
        'Answer: 255',
      ],
      fig: {
        kind: 'transversal',
        angle: 105,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠7 = 120°. What is ∠1 + ∠2 + ∠7?',
      a: '300',
      steps: [
        'The eight angles are 120° or 60°: ∠1 = 60°, ∠2 = 120°, ∠7 = 120°.',
        '60 + 120 + 120 = 300.',
        'Answer: 300',
      ],
      fig: {
        kind: 'transversal',
        angle: 120,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠3 = 105°. What is ∠3 + ∠6 + ∠7?',
      a: '315',
      steps: [
        'The eight angles are 105° or 75°: ∠3 = 105°, ∠6 = 105°, ∠7 = 105°.',
        '105 + 105 + 105 = 315.',
        'Answer: 315',
      ],
      fig: {
        kind: 'transversal',
        angle: 105,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = 140°. What is ∠1 + ∠2 + ∠7?',
      a: '220',
      steps: [
        'The eight angles are 140° or 40°: ∠1 = 140°, ∠2 = 40°, ∠7 = 40°.',
        '140 + 40 + 40 = 220.',
        'Answer: 220',
      ],
      fig: {
        kind: 'transversal',
        angle: 40,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. What is the sum of all eight angles?',
      a: '720',
      steps: [
        'The four angles at one crossing make a full turn, 360°.',
        'Two crossings: 2 × 360° = 720°.',
        'Answer: 720',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. What is the sum of the four interior angles?',
      a: '360',
      steps: [
        'The interior angles are 3, 4, 5 and 6.',
        'Angles 3 and 4 add to 180° and angles 5 and 6 add to 180°, so the sum is 360°.',
        'Answer: 360',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. What is the sum of the four exterior angles?',
      a: '360',
      steps: [
        'The exterior angles are 1, 2, 7 and 8.',
        'Angles 1 and 2 add to 180° and angles 7 and 8 add to 180°, so the sum is 360°.',
        'Answer: 360',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. Do ∠2 and ∠5 have a named relationship (vertical, linear pair, corresponding, alternate or consecutive)? Type 1 for yes, 0 for no.',
      a: '0',
      steps: [
        'Check the pairs: ∠2 and ∠5 are not vertical, not a linear pair, and not corresponding, alternate or consecutive.',
        'They have no named relationship, so the answer is 0.',
        'Answer: 0',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. Do ∠4 and ∠7 have a named relationship (vertical, linear pair, corresponding, alternate or consecutive)? Type 1 for yes, 0 for no.',
      a: '0',
      steps: [
        'Check the pairs: ∠4 and ∠7 are not vertical, not a linear pair, and not corresponding, alternate or consecutive.',
        'They have no named relationship, so the answer is 0.',
        'Answer: 0',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
  ],
  alternate: [
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠3 = 70°. What is ∠6?',
      a: '70',
      steps: [
        '∠3 and ∠6 are alternate interior angles, so they are equal: ∠6 = 70°.',
        'Answer: 70',
      ],
      fig: {
        kind: 'transversal',
        angle: 70,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠5 = 125°. What is ∠4?',
      a: '125',
      steps: [
        '∠5 and ∠4 are alternate interior angles, so they are equal: ∠4 = 125°.',
        'Answer: 125',
      ],
      fig: {
        kind: 'transversal',
        angle: 55,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠5 = 70°. What is ∠4?',
      a: '70',
      steps: [
        '∠5 and ∠4 are alternate interior angles, so they are equal: ∠4 = 70°.',
        'Answer: 70',
      ],
      fig: {
        kind: 'transversal',
        angle: 110,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠3 = 35°. What is ∠6?',
      a: '35',
      steps: [
        '∠3 and ∠6 are alternate interior angles, so they are equal: ∠6 = 35°.',
        'Answer: 35',
      ],
      fig: {
        kind: 'transversal',
        angle: 35,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠4 = 70°. What is ∠5?',
      a: '70',
      steps: [
        '∠4 and ∠5 are alternate interior angles, so they are equal: ∠5 = 70°.',
        'Answer: 70',
      ],
      fig: {
        kind: 'transversal',
        angle: 110,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠4 = 145°. What is ∠5?',
      a: '145',
      steps: [
        '∠4 and ∠5 are alternate interior angles, so they are equal: ∠5 = 145°.',
        'Answer: 145',
      ],
      fig: {
        kind: 'transversal',
        angle: 35,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠3 = 65°. What is ∠6?',
      a: '65',
      steps: [
        '∠3 and ∠6 are alternate interior angles, so they are equal: ∠6 = 65°.',
        'Answer: 65',
      ],
      fig: {
        kind: 'transversal',
        angle: 65,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠3 = 140°. What is ∠6?',
      a: '140',
      steps: [
        '∠3 and ∠6 are alternate interior angles, so they are equal: ∠6 = 140°.',
        'Answer: 140',
      ],
      fig: {
        kind: 'transversal',
        angle: 140,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠7 = 45°. What is ∠2?',
      a: '45',
      steps: [
        '∠7 and ∠2 are alternate exterior angles, so they are equal: ∠2 = 45°.',
        'Answer: 45',
      ],
      fig: {
        kind: 'transversal',
        angle: 45,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠2 = 70°. What is ∠7?',
      a: '70',
      steps: [
        '∠2 and ∠7 are alternate exterior angles, so they are equal: ∠7 = 70°.',
        'Answer: 70',
      ],
      fig: {
        kind: 'transversal',
        angle: 70,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = 125°. What is ∠1?',
      a: '125',
      steps: [
        '∠8 and ∠1 are alternate exterior angles, so they are equal: ∠1 = 125°.',
        'Answer: 125',
      ],
      fig: {
        kind: 'transversal',
        angle: 55,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠1 = 75°. What is ∠8?',
      a: '75',
      steps: [
        '∠1 and ∠8 are alternate exterior angles, so they are equal: ∠8 = 75°.',
        'Answer: 75',
      ],
      fig: {
        kind: 'transversal',
        angle: 105,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠7 = 105°. What is ∠2?',
      a: '105',
      steps: [
        '∠7 and ∠2 are alternate exterior angles, so they are equal: ∠2 = 105°.',
        'Answer: 105',
      ],
      fig: {
        kind: 'transversal',
        angle: 105,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = 145°. What is ∠1?',
      a: '145',
      steps: [
        '∠8 and ∠1 are alternate exterior angles, so they are equal: ∠1 = 145°.',
        'Answer: 145',
      ],
      fig: {
        kind: 'transversal',
        angle: 35,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = 105°. What is ∠1?',
      a: '105',
      steps: [
        '∠8 and ∠1 are alternate exterior angles, so they are equal: ∠1 = 105°.',
        'Answer: 105',
      ],
      fig: {
        kind: 'transversal',
        angle: 75,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠2 = 35°. What is ∠7?',
      a: '35',
      steps: [
        '∠2 and ∠7 are alternate exterior angles, so they are equal: ∠7 = 35°.',
        'Answer: 35',
      ],
      fig: {
        kind: 'transversal',
        angle: 35,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠3 = (9x + 11)° and ∠6 = (x + 59)°. What is x?',
      a: '6',
      steps: [
        '∠3 and ∠6 are alternate interior angles, so they are equal.',
        '9x + 11 = x + 59',
        '8x = 48, so x = 6.',
        'Answer: 6',
      ],
      fig: {
        kind: 'transversal',
        angle: 65,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠4 = (3x + 17)° and ∠5 = (x + 39)°. What is x?',
      a: '11',
      steps: [
        '∠4 and ∠5 are alternate interior angles, so they are equal.',
        '3x + 17 = x + 39',
        '2x = 22, so x = 11.',
        'Answer: 11',
      ],
      fig: {
        kind: 'transversal',
        angle: 130,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠4 = (4x + 3)° and ∠5 = (8x − 49)°. What is x?',
      a: '13',
      steps: [
        '∠4 and ∠5 are alternate interior angles, so they are equal.',
        '4x + 3 = 8x − 49',
        '−4x = −52, so x = 13.',
        'Answer: 13',
      ],
      fig: {
        kind: 'transversal',
        angle: 125,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠4 = (6x − 15)° and ∠5 = (2x + 45)°. What is ∠4?',
      a: '75',
      steps: [
        '∠4 and ∠5 are alternate interior angles, so they are equal.',
        '6x − 15 = 2x + 45',
        '4x = 60, so x = 15.',
        '∠4 = 6(15) − 15 = 75°.',
        'Answer: 75',
      ],
      fig: {
        kind: 'transversal',
        angle: 105,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠3 = (5x − 30)° and ∠6 = (4x − 17)°. What is ∠3?',
      a: '35',
      steps: [
        '∠3 and ∠6 are alternate interior angles, so they are equal.',
        '5x − 30 = 4x − 17',
        '1x = 13, so x = 13.',
        '∠3 = 5(13) − 30 = 35°.',
        'Answer: 35',
      ],
      fig: {
        kind: 'transversal',
        angle: 35,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠4 = (9x + 24)° and ∠5 = (5x + 40)°. What is x?',
      a: '4',
      steps: [
        '∠4 and ∠5 are alternate interior angles, so they are equal.',
        '9x + 24 = 5x + 40',
        '4x = 16, so x = 4.',
        'Answer: 4',
      ],
      fig: {
        kind: 'transversal',
        angle: 120,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠4 = (4x + 50)° and ∠5 = (6x + 20)°. What is ∠4?',
      a: '110',
      steps: [
        '∠4 and ∠5 are alternate interior angles, so they are equal.',
        '4x + 50 = 6x + 20',
        '−2x = −30, so x = 15.',
        '∠4 = 4(15) + 50 = 110°.',
        'Answer: 110',
      ],
      fig: {
        kind: 'transversal',
        angle: 70,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠6 = (6x − 56)° and ∠3 = (5x − 40)°. What is x?',
      a: '16',
      steps: [
        '∠6 and ∠3 are alternate interior angles, so they are equal.',
        '6x − 56 = 5x − 40',
        '1x = 16, so x = 16.',
        'Answer: 16',
      ],
      fig: {
        kind: 'transversal',
        angle: 40,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠3 = (9x + 27)° and ∠6 = (7x + 51)°. What is ∠3?',
      a: '135',
      steps: [
        '∠3 and ∠6 are alternate interior angles, so they are equal.',
        '9x + 27 = 7x + 51',
        '2x = 24, so x = 12.',
        '∠3 = 9(12) + 27 = 135°.',
        'Answer: 135',
      ],
      fig: {
        kind: 'transversal',
        angle: 135,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = (4x + 17)° and ∠1 = (8x − 31)°. What is ∠1?',
      a: '65',
      steps: [
        '∠8 and ∠1 are alternate exterior angles, so they are equal.',
        '4x + 17 = 8x − 31',
        '−4x = −48, so x = 12.',
        '∠1 = 8(12) − 31 = 65°.',
        'Answer: 65',
      ],
      fig: {
        kind: 'transversal',
        angle: 115,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = (5x + 45)° and ∠1 = (9x − 23)°. What is x?',
      a: '17',
      steps: [
        '∠8 and ∠1 are alternate exterior angles, so they are equal.',
        '5x + 45 = 9x − 23',
        '−4x = −68, so x = 17.',
        'Answer: 17',
      ],
      fig: {
        kind: 'transversal',
        angle: 50,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = (5x + 10)° and ∠1 = (8x − 14)°. What is ∠8?',
      a: '50',
      steps: [
        '∠8 and ∠1 are alternate exterior angles, so they are equal.',
        '5x + 10 = 8x − 14',
        '−3x = −24, so x = 8.',
        '∠8 = 5(8) + 10 = 50°.',
        'Answer: 50',
      ],
      fig: {
        kind: 'transversal',
        angle: 130,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠7 = (x + 41)° and ∠2 = (6x − 29)°. What is x?',
      a: '14',
      steps: [
        '∠7 and ∠2 are alternate exterior angles, so they are equal.',
        'x + 41 = 6x − 29',
        '−5x = −70, so x = 14.',
        'Answer: 14',
      ],
      fig: {
        kind: 'transversal',
        angle: 55,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠1 = (7x − 9)° and ∠8 = (3x + 19)°. What is x?',
      a: '7',
      steps: [
        '∠1 and ∠8 are alternate exterior angles, so they are equal.',
        '7x − 9 = 3x + 19',
        '4x = 28, so x = 7.',
        'Answer: 7',
      ],
      fig: {
        kind: 'transversal',
        angle: 140,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠2 = (8x + 9)° and ∠7 = (x + 58)°. What is ∠7?',
      a: '65',
      steps: [
        '∠2 and ∠7 are alternate exterior angles, so they are equal.',
        '8x + 9 = x + 58',
        '7x = 49, so x = 7.',
        '∠7 = 1(7) + 58 = 65°.',
        'Answer: 65',
      ],
      fig: {
        kind: 'transversal',
        angle: 65,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠7 = (6x − 2)° and ∠2 = (7x − 24)°. What is ∠7?',
      a: '130',
      steps: [
        '∠7 and ∠2 are alternate exterior angles, so they are equal.',
        '6x − 2 = 7x − 24',
        '−1x = −22, so x = 22.',
        '∠7 = 6(22) − 2 = 130°.',
        'Answer: 130',
      ],
      fig: {
        kind: 'transversal',
        angle: 130,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = (4x + 26)° and ∠1 = (5x + 20)°. What is x?',
      a: '6',
      steps: [
        '∠8 and ∠1 are alternate exterior angles, so they are equal.',
        '4x + 26 = 5x + 20',
        '−1x = −6, so x = 6.',
        'Answer: 6',
      ],
      fig: {
        kind: 'transversal',
        angle: 130,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠2 = (8x − 2)° and ∠7 = (6x + 26)°. What is ∠7?',
      a: '110',
      steps: [
        '∠2 and ∠7 are alternate exterior angles, so they are equal.',
        '8x − 2 = 6x + 26',
        '2x = 28, so x = 14.',
        '∠7 = 6(14) + 26 = 110°.',
        'Answer: 110',
      ],
      fig: {
        kind: 'transversal',
        angle: 110,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠6 = (8x + 7)° and ∠3 = (7x + 23)°. What is ∠3?',
      a: '135',
      steps: [
        '∠6 and ∠3 are alternate interior angles, so they are equal.',
        '8x + 7 = 7x + 23',
        '1x = 16, so x = 16.',
        '∠3 = 7(16) + 23 = 135°.',
        'Answer: 135',
      ],
      fig: {
        kind: 'transversal',
        angle: 135,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠2 = (4x + 55)° and ∠7 = (8x − 25)°. What is ∠2?',
      a: '135',
      steps: [
        '∠2 and ∠7 are alternate exterior angles, so they are equal.',
        '4x + 55 = 8x − 25',
        '−4x = −80, so x = 20.',
        '∠2 = 4(20) + 55 = 135°.',
        'Answer: 135',
      ],
      fig: {
        kind: 'transversal',
        angle: 135,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠7 = (8x − 49)° and ∠2 = (4x + 43)°. What is ∠2?',
      a: '135',
      steps: [
        '∠7 and ∠2 are alternate exterior angles, so they are equal.',
        '8x − 49 = 4x + 43',
        '4x = 92, so x = 23.',
        '∠2 = 4(23) + 43 = 135°.',
        'Answer: 135',
      ],
      fig: {
        kind: 'transversal',
        angle: 135,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = (8x + 35)° and ∠1 = (7x + 45)°. What is ∠1?',
      a: '115',
      steps: [
        '∠8 and ∠1 are alternate exterior angles, so they are equal.',
        '8x + 35 = 7x + 45',
        '1x = 10, so x = 10.',
        '∠1 = 7(10) + 45 = 115°.',
        'Answer: 115',
      ],
      fig: {
        kind: 'transversal',
        angle: 65,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = (x + 49)° and ∠1 = (5x + 25)°. What is ∠1?',
      a: '55',
      steps: [
        '∠8 and ∠1 are alternate exterior angles, so they are equal.',
        'x + 49 = 5x + 25',
        '−4x = −24, so x = 6.',
        '∠1 = 5(6) + 25 = 55°.',
        'Answer: 55',
      ],
      fig: {
        kind: 'transversal',
        angle: 125,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠7 = (x + 42)° and ∠2 = (8x − 14)°. What is ∠2?',
      a: '50',
      steps: [
        '∠7 and ∠2 are alternate exterior angles, so they are equal.',
        'x + 42 = 8x − 14',
        '−7x = −56, so x = 8.',
        '∠2 = 8(8) − 14 = 50°.',
        'Answer: 50',
      ],
      fig: {
        kind: 'transversal',
        angle: 50,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠4 = (5x + 50)° and ∠5 = (8x + 11)°. What is ∠5?',
      a: '115',
      steps: [
        '∠4 and ∠5 are alternate interior angles, so they are equal.',
        '5x + 50 = 8x + 11',
        '−3x = −39, so x = 13.',
        '∠5 = 8(13) + 11 = 115°.',
        'Answer: 115',
      ],
      fig: {
        kind: 'transversal',
        angle: 65,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠3 = (6x − 39)° and ∠6 = (2x + 57)°. What is ∠6?',
      a: '105',
      steps: [
        '∠3 and ∠6 are alternate interior angles, so they are equal.',
        '6x − 39 = 2x + 57',
        '4x = 96, so x = 24.',
        '∠6 = 2(24) + 57 = 105°.',
        'Answer: 105',
      ],
      fig: {
        kind: 'transversal',
        angle: 105,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠6 = 70°. What is ∠1?',
      a: '110',
      steps: [
        '∠6 and ∠2 are corresponding angles, so they are equal: ∠2 = 70°.',
        '∠2 and ∠1 are a linear pair (they form a straight line), so they add up to 180°: ∠1 = 180° − 70° = 110°.',
        'Answer: 110',
      ],
      fig: {
        kind: 'transversal',
        angle: 70,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠6 = 60°. What is ∠1?',
      a: '120',
      steps: [
        '∠6 and ∠2 are corresponding angles, so they are equal: ∠2 = 60°.',
        '∠2 and ∠1 are a linear pair (they form a straight line), so they add up to 180°: ∠1 = 180° − 60° = 120°.',
        'Answer: 120',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠7 = 55°. What is ∠4?',
      a: '125',
      steps: [
        '∠7 and ∠1 are consecutive (same-side) exterior angles, so they add up to 180°: ∠1 = 180° − 55° = 125°.',
        '∠1 and ∠4 are vertical angles, so they are equal: ∠4 = 125°.',
        'Answer: 125',
      ],
      fig: {
        kind: 'transversal',
        angle: 55,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠2 = 120°. What is ∠5?',
      a: '60',
      steps: [
        '∠2 and ∠1 are a linear pair (they form a straight line), so they add up to 180°: ∠1 = 180° − 120° = 60°.',
        '∠1 and ∠5 are corresponding angles, so they are equal: ∠5 = 60°.',
        'Answer: 60',
      ],
      fig: {
        kind: 'transversal',
        angle: 120,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠6 = 110°. What is ∠1?',
      a: '70',
      steps: [
        '∠6 and ∠2 are corresponding angles, so they are equal: ∠2 = 110°.',
        '∠2 and ∠1 are a linear pair (they form a straight line), so they add up to 180°: ∠1 = 180° − 110° = 70°.',
        'Answer: 70',
      ],
      fig: {
        kind: 'transversal',
        angle: 110,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = 70°. What is ∠3?',
      a: '110',
      steps: [
        '∠8 and ∠1 are alternate exterior angles, so they are equal: ∠1 = 70°.',
        '∠1 and ∠3 are a linear pair (they form a straight line), so they add up to 180°: ∠3 = 180° − 70° = 110°.',
        'Answer: 110',
      ],
      fig: {
        kind: 'transversal',
        angle: 110,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠3 = 35°. What is ∠8?',
      a: '145',
      steps: [
        '∠3 and ∠1 are a linear pair (they form a straight line), so they add up to 180°: ∠1 = 180° − 35° = 145°.',
        '∠1 and ∠8 are alternate exterior angles, so they are equal: ∠8 = 145°.',
        'Answer: 145',
      ],
      fig: {
        kind: 'transversal',
        angle: 35,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠7 = 65°. What is ∠4?',
      a: '115',
      steps: [
        '∠7 and ∠1 are consecutive (same-side) exterior angles, so they add up to 180°: ∠1 = 180° − 65° = 115°.',
        '∠1 and ∠4 are vertical angles, so they are equal: ∠4 = 115°.',
        'Answer: 115',
      ],
      fig: {
        kind: 'transversal',
        angle: 65,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
  ],
  corresponding: [
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠5 = 105°. What is ∠1?',
      a: '105',
      steps: ['∠5 and ∠1 are corresponding angles, so they are equal: ∠1 = 105°.', 'Answer: 105'],
      fig: {
        kind: 'transversal',
        angle: 75,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠7 = 130°. What is ∠3?',
      a: '130',
      steps: ['∠7 and ∠3 are corresponding angles, so they are equal: ∠3 = 130°.', 'Answer: 130'],
      fig: {
        kind: 'transversal',
        angle: 130,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠4 = 120°. What is ∠8?',
      a: '120',
      steps: ['∠4 and ∠8 are corresponding angles, so they are equal: ∠8 = 120°.', 'Answer: 120'],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = 55°. What is ∠4?',
      a: '55',
      steps: ['∠8 and ∠4 are corresponding angles, so they are equal: ∠4 = 55°.', 'Answer: 55'],
      fig: {
        kind: 'transversal',
        angle: 125,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠4 = 115°. What is ∠8?',
      a: '115',
      steps: ['∠4 and ∠8 are corresponding angles, so they are equal: ∠8 = 115°.', 'Answer: 115'],
      fig: {
        kind: 'transversal',
        angle: 65,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠1 = 145°. What is ∠5?',
      a: '145',
      steps: ['∠1 and ∠5 are corresponding angles, so they are equal: ∠5 = 145°.', 'Answer: 145'],
      fig: {
        kind: 'transversal',
        angle: 35,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠3 = 50°. What is ∠7?',
      a: '50',
      steps: ['∠3 and ∠7 are corresponding angles, so they are equal: ∠7 = 50°.', 'Answer: 50'],
      fig: {
        kind: 'transversal',
        angle: 50,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = 100°. What is ∠4?',
      a: '100',
      steps: ['∠8 and ∠4 are corresponding angles, so they are equal: ∠4 = 100°.', 'Answer: 100'],
      fig: {
        kind: 'transversal',
        angle: 80,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠3 = 65°. What is ∠7?',
      a: '65',
      steps: ['∠3 and ∠7 are corresponding angles, so they are equal: ∠7 = 65°.', 'Answer: 65'],
      fig: {
        kind: 'transversal',
        angle: 65,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠6 = 130°. What is ∠2?',
      a: '130',
      steps: ['∠6 and ∠2 are corresponding angles, so they are equal: ∠2 = 130°.', 'Answer: 130'],
      fig: {
        kind: 'transversal',
        angle: 130,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠6 = 110°. What is ∠2?',
      a: '110',
      steps: ['∠6 and ∠2 are corresponding angles, so they are equal: ∠2 = 110°.', 'Answer: 110'],
      fig: {
        kind: 'transversal',
        angle: 110,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠7 = 140°. What is ∠3?',
      a: '140',
      steps: ['∠7 and ∠3 are corresponding angles, so they are equal: ∠3 = 140°.', 'Answer: 140'],
      fig: {
        kind: 'transversal',
        angle: 140,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠4 = 140°. What is ∠8?',
      a: '140',
      steps: ['∠4 and ∠8 are corresponding angles, so they are equal: ∠8 = 140°.', 'Answer: 140'],
      fig: {
        kind: 'transversal',
        angle: 40,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = 45°. What is ∠4?',
      a: '45',
      steps: ['∠8 and ∠4 are corresponding angles, so they are equal: ∠4 = 45°.', 'Answer: 45'],
      fig: {
        kind: 'transversal',
        angle: 135,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠1 = 40°. What is ∠5?',
      a: '40',
      steps: ['∠1 and ∠5 are corresponding angles, so they are equal: ∠5 = 40°.', 'Answer: 40'],
      fig: {
        kind: 'transversal',
        angle: 140,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = 110°. What is ∠4?',
      a: '110',
      steps: ['∠8 and ∠4 are corresponding angles, so they are equal: ∠4 = 110°.', 'Answer: 110'],
      fig: {
        kind: 'transversal',
        angle: 70,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠7 = (4x + 23)° and ∠3 = (5x)°. What is x?',
      a: '23',
      steps: [
        '∠7 and ∠3 are corresponding angles, so they are equal.',
        '4x + 23 = 5x',
        '−1x = −23, so x = 23.',
        'Answer: 23',
      ],
      fig: {
        kind: 'transversal',
        angle: 115,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠7 = (6x + 38)° and ∠3 = (7x + 26)°. What is ∠7?',
      a: '110',
      steps: [
        '∠7 and ∠3 are corresponding angles, so they are equal.',
        '6x + 38 = 7x + 26',
        '−1x = −12, so x = 12.',
        '∠7 = 6(12) + 38 = 110°.',
        'Answer: 110',
      ],
      fig: {
        kind: 'transversal',
        angle: 110,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠4 = (6x + 19)° and ∠8 = (4x + 51)°. What is ∠8?',
      a: '115',
      steps: [
        '∠4 and ∠8 are corresponding angles, so they are equal.',
        '6x + 19 = 4x + 51',
        '2x = 32, so x = 16.',
        '∠8 = 4(16) + 51 = 115°.',
        'Answer: 115',
      ],
      fig: {
        kind: 'transversal',
        angle: 65,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠3 = (2x + 3)° and ∠7 = (x + 19)°. What is ∠3?',
      a: '35',
      steps: [
        '∠3 and ∠7 are corresponding angles, so they are equal.',
        '2x + 3 = x + 19',
        '1x = 16, so x = 16.',
        '∠3 = 2(16) + 3 = 35°.',
        'Answer: 35',
      ],
      fig: {
        kind: 'transversal',
        angle: 35,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = (3x + 29)° and ∠4 = (4x + 22)°. What is ∠8?',
      a: '50',
      steps: [
        '∠8 and ∠4 are corresponding angles, so they are equal.',
        '3x + 29 = 4x + 22',
        '−1x = −7, so x = 7.',
        '∠8 = 3(7) + 29 = 50°.',
        'Answer: 50',
      ],
      fig: {
        kind: 'transversal',
        angle: 130,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠4 = (6x + 34)° and ∠8 = (8x + 2)°. What is ∠8?',
      a: '130',
      steps: [
        '∠4 and ∠8 are corresponding angles, so they are equal.',
        '6x + 34 = 8x + 2',
        '−2x = −32, so x = 16.',
        '∠8 = 8(16) + 2 = 130°.',
        'Answer: 130',
      ],
      fig: {
        kind: 'transversal',
        angle: 50,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = (6x − 39)° and ∠4 = (2x + 17)°. What is x?',
      a: '14',
      steps: [
        '∠8 and ∠4 are corresponding angles, so they are equal.',
        '6x − 39 = 2x + 17',
        '4x = 56, so x = 14.',
        'Answer: 14',
      ],
      fig: {
        kind: 'transversal',
        angle: 135,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = (7x + 58)° and ∠4 = (9x + 36)°. What is x?',
      a: '11',
      steps: [
        '∠8 and ∠4 are corresponding angles, so they are equal.',
        '7x + 58 = 9x + 36',
        '−2x = −22, so x = 11.',
        'Answer: 11',
      ],
      fig: {
        kind: 'transversal',
        angle: 45,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠4 = (3x + 48)° and ∠8 = (8x − 47)°. What is ∠8?',
      a: '105',
      steps: [
        '∠4 and ∠8 are corresponding angles, so they are equal.',
        '3x + 48 = 8x − 47',
        '−5x = −95, so x = 19.',
        '∠8 = 8(19) − 47 = 105°.',
        'Answer: 105',
      ],
      fig: {
        kind: 'transversal',
        angle: 75,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠4 = (5x + 25)° and ∠8 = (4x + 47)°. What is ∠8?',
      a: '135',
      steps: [
        '∠4 and ∠8 are corresponding angles, so they are equal.',
        '5x + 25 = 4x + 47',
        '1x = 22, so x = 22.',
        '∠8 = 4(22) + 47 = 135°.',
        'Answer: 135',
      ],
      fig: {
        kind: 'transversal',
        angle: 45,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠3 = (5x + 35)° and ∠7 = (4x + 54)°. What is ∠3?',
      a: '130',
      steps: [
        '∠3 and ∠7 are corresponding angles, so they are equal.',
        '5x + 35 = 4x + 54',
        '1x = 19, so x = 19.',
        '∠3 = 5(19) + 35 = 130°.',
        'Answer: 130',
      ],
      fig: {
        kind: 'transversal',
        angle: 130,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠3 = (6x − 57)° and ∠7 = (3x − 6)°. What is ∠3?',
      a: '45',
      steps: [
        '∠3 and ∠7 are corresponding angles, so they are equal.',
        '6x − 57 = 3x − 6',
        '3x = 51, so x = 17.',
        '∠3 = 6(17) − 57 = 45°.',
        'Answer: 45',
      ],
      fig: {
        kind: 'transversal',
        angle: 45,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠2 = (3x + 15)° and ∠6 = (2x + 25)°. What is ∠2?',
      a: '45',
      steps: [
        '∠2 and ∠6 are corresponding angles, so they are equal.',
        '3x + 15 = 2x + 25',
        '1x = 10, so x = 10.',
        '∠2 = 3(10) + 15 = 45°.',
        'Answer: 45',
      ],
      fig: {
        kind: 'transversal',
        angle: 45,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠6 = (7x + 12)° and ∠2 = (9x + 4)°. What is ∠6?',
      a: '40',
      steps: [
        '∠6 and ∠2 are corresponding angles, so they are equal.',
        '7x + 12 = 9x + 4',
        '−2x = −8, so x = 4.',
        '∠6 = 7(4) + 12 = 40°.',
        'Answer: 40',
      ],
      fig: {
        kind: 'transversal',
        angle: 40,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠2 = (8x − 39)° and ∠6 = (4x + 33)°. What is x?',
      a: '18',
      steps: [
        '∠2 and ∠6 are corresponding angles, so they are equal.',
        '8x − 39 = 4x + 33',
        '4x = 72, so x = 18.',
        'Answer: 18',
      ],
      fig: {
        kind: 'transversal',
        angle: 105,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠7 = (2x + 30)° and ∠3 = (5x − 30)°. What is x?',
      a: '20',
      steps: [
        '∠7 and ∠3 are corresponding angles, so they are equal.',
        '2x + 30 = 5x − 30',
        '−3x = −60, so x = 20.',
        'Answer: 20',
      ],
      fig: {
        kind: 'transversal',
        angle: 70,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠1 = (x + 53)° and ∠5 = (5x − 35)°. What is ∠1?',
      a: '75',
      steps: [
        '∠1 and ∠5 are corresponding angles, so they are equal.',
        'x + 53 = 5x − 35',
        '−4x = −88, so x = 22.',
        '∠1 = 1(22) + 53 = 75°.',
        'Answer: 75',
      ],
      fig: {
        kind: 'transversal',
        angle: 105,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠6 = (8x − 21)° and ∠2 = (9x − 33)°. What is ∠2?',
      a: '75',
      steps: [
        '∠6 and ∠2 are corresponding angles, so they are equal.',
        '8x − 21 = 9x − 33',
        '−1x = −12, so x = 12.',
        '∠2 = 9(12) − 33 = 75°.',
        'Answer: 75',
      ],
      fig: {
        kind: 'transversal',
        angle: 75,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠4 = (7x + 15)° and ∠8 = (3x + 35)°. What is ∠8?',
      a: '50',
      steps: [
        '∠4 and ∠8 are corresponding angles, so they are equal.',
        '7x + 15 = 3x + 35',
        '4x = 20, so x = 5.',
        '∠8 = 3(5) + 35 = 50°.',
        'Answer: 50',
      ],
      fig: {
        kind: 'transversal',
        angle: 130,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠5 = (8x + 10)° and ∠1 = (5x + 55)°. What is ∠1?',
      a: '130',
      steps: [
        '∠5 and ∠1 are corresponding angles, so they are equal.',
        '8x + 10 = 5x + 55',
        '3x = 45, so x = 15.',
        '∠1 = 5(15) + 55 = 130°.',
        'Answer: 130',
      ],
      fig: {
        kind: 'transversal',
        angle: 50,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = (9x + 19)° and ∠4 = (7x + 37)°. What is ∠8?',
      a: '100',
      steps: [
        '∠8 and ∠4 are corresponding angles, so they are equal.',
        '9x + 19 = 7x + 37',
        '2x = 18, so x = 9.',
        '∠8 = 9(9) + 19 = 100°.',
        'Answer: 100',
      ],
      fig: {
        kind: 'transversal',
        angle: 80,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠1 = (4x + 34)° and ∠5 = (5x + 10)°. What is ∠5?',
      a: '130',
      steps: [
        '∠1 and ∠5 are corresponding angles, so they are equal.',
        '4x + 34 = 5x + 10',
        '−1x = −24, so x = 24.',
        '∠5 = 5(24) + 10 = 130°.',
        'Answer: 130',
      ],
      fig: {
        kind: 'transversal',
        angle: 50,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠7 = (8x + 6)° and ∠3 = (9x − 7)°. What is ∠7?',
      a: '110',
      steps: [
        '∠7 and ∠3 are corresponding angles, so they are equal.',
        '8x + 6 = 9x − 7',
        '−1x = −13, so x = 13.',
        '∠7 = 8(13) + 6 = 110°.',
        'Answer: 110',
      ],
      fig: {
        kind: 'transversal',
        angle: 110,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠3 = (3x + 38)° and ∠7 = (5x − 10)°. What is ∠3?',
      a: '110',
      steps: [
        '∠3 and ∠7 are corresponding angles, so they are equal.',
        '3x + 38 = 5x − 10',
        '−2x = −48, so x = 24.',
        '∠3 = 3(24) + 38 = 110°.',
        'Answer: 110',
      ],
      fig: {
        kind: 'transversal',
        angle: 110,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠2 = (4x + 33)° and ∠6 = (6x + 17)°. What is ∠2?',
      a: '65',
      steps: [
        '∠2 and ∠6 are corresponding angles, so they are equal.',
        '4x + 33 = 6x + 17',
        '−2x = −16, so x = 8.',
        '∠2 = 4(8) + 33 = 65°.',
        'Answer: 65',
      ],
      fig: {
        kind: 'transversal',
        angle: 65,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠3 = (4x − 1)° and ∠7 = (x + 41)°. What is ∠3?',
      a: '55',
      steps: [
        '∠3 and ∠7 are corresponding angles, so they are equal.',
        '4x − 1 = x + 41',
        '3x = 42, so x = 14.',
        '∠3 = 4(14) − 1 = 55°.',
        'Answer: 55',
      ],
      fig: {
        kind: 'transversal',
        angle: 55,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠2 = 70°. What is ∠5?',
      a: '110',
      steps: [
        '∠2 and ∠1 are a linear pair (they form a straight line), so they add up to 180°: ∠1 = 180° − 70° = 110°.',
        '∠1 and ∠5 are corresponding angles, so they are equal: ∠5 = 110°.',
        'Answer: 110',
      ],
      fig: {
        kind: 'transversal',
        angle: 70,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠4 = 50°. What is ∠7?',
      a: '130',
      steps: [
        '∠4 and ∠1 are vertical angles, so they are equal: ∠1 = 50°.',
        '∠1 and ∠7 are consecutive (same-side) exterior angles, so they add up to 180°: ∠7 = 180° − 50° = 130°.',
        'Answer: 130',
      ],
      fig: {
        kind: 'transversal',
        angle: 130,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠7 = 115°. What is ∠4?',
      a: '65',
      steps: [
        '∠7 and ∠1 are consecutive (same-side) exterior angles, so they add up to 180°: ∠1 = 180° − 115° = 65°.',
        '∠1 and ∠4 are vertical angles, so they are equal: ∠4 = 65°.',
        'Answer: 65',
      ],
      fig: {
        kind: 'transversal',
        angle: 115,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠2 = 55°. What is ∠5?',
      a: '125',
      steps: [
        '∠2 and ∠1 are a linear pair (they form a straight line), so they add up to 180°: ∠1 = 180° − 55° = 125°.',
        '∠1 and ∠5 are corresponding angles, so they are equal: ∠5 = 125°.',
        'Answer: 125',
      ],
      fig: {
        kind: 'transversal',
        angle: 55,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠6 = 65°. What is ∠1?',
      a: '115',
      steps: [
        '∠6 and ∠2 are corresponding angles, so they are equal: ∠2 = 65°.',
        '∠2 and ∠1 are a linear pair (they form a straight line), so they add up to 180°: ∠1 = 180° − 65° = 115°.',
        'Answer: 115',
      ],
      fig: {
        kind: 'transversal',
        angle: 65,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠6 = 115°. What is ∠1?',
      a: '65',
      steps: [
        '∠6 and ∠2 are corresponding angles, so they are equal: ∠2 = 115°.',
        '∠2 and ∠1 are a linear pair (they form a straight line), so they add up to 180°: ∠1 = 180° − 115° = 65°.',
        'Answer: 65',
      ],
      fig: {
        kind: 'transversal',
        angle: 115,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠3 = 135°. What is ∠8?',
      a: '45',
      steps: [
        '∠3 and ∠1 are a linear pair (they form a straight line), so they add up to 180°: ∠1 = 180° − 135° = 45°.',
        '∠1 and ∠8 are alternate exterior angles, so they are equal: ∠8 = 45°.',
        'Answer: 45',
      ],
      fig: {
        kind: 'transversal',
        angle: 135,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠5 = 115°. What is ∠2?',
      a: '65',
      steps: [
        '∠5 and ∠1 are corresponding angles, so they are equal: ∠1 = 115°.',
        '∠1 and ∠2 are a linear pair (they form a straight line), so they add up to 180°: ∠2 = 180° − 115° = 65°.',
        'Answer: 65',
      ],
      fig: {
        kind: 'transversal',
        angle: 65,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
  ],
  consecutive: [
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠3 = 75°. What is ∠5?',
      a: '105',
      steps: [
        '∠3 and ∠5 are consecutive (same-side) interior angles, so they add up to 180°: ∠5 = 180° − 75° = 105°.',
        'Answer: 105',
      ],
      fig: {
        kind: 'transversal',
        angle: 75,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠5 = 130°. What is ∠3?',
      a: '50',
      steps: [
        '∠5 and ∠3 are consecutive (same-side) interior angles, so they add up to 180°: ∠3 = 180° − 130° = 50°.',
        'Answer: 50',
      ],
      fig: {
        kind: 'transversal',
        angle: 50,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠4 = 40°. What is ∠6?',
      a: '140',
      steps: [
        '∠4 and ∠6 are consecutive (same-side) interior angles, so they add up to 180°: ∠6 = 180° − 40° = 140°.',
        'Answer: 140',
      ],
      fig: {
        kind: 'transversal',
        angle: 140,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠4 = 70°. What is ∠6?',
      a: '110',
      steps: [
        '∠4 and ∠6 are consecutive (same-side) interior angles, so they add up to 180°: ∠6 = 180° − 70° = 110°.',
        'Answer: 110',
      ],
      fig: {
        kind: 'transversal',
        angle: 110,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠5 = 75°. What is ∠3?',
      a: '105',
      steps: [
        '∠5 and ∠3 are consecutive (same-side) interior angles, so they add up to 180°: ∠3 = 180° − 75° = 105°.',
        'Answer: 105',
      ],
      fig: {
        kind: 'transversal',
        angle: 105,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠5 = 60°. What is ∠3?',
      a: '120',
      steps: [
        '∠5 and ∠3 are consecutive (same-side) interior angles, so they add up to 180°: ∠3 = 180° − 60° = 120°.',
        'Answer: 120',
      ],
      fig: {
        kind: 'transversal',
        angle: 120,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠4 = 125°. What is ∠6?',
      a: '55',
      steps: [
        '∠4 and ∠6 are consecutive (same-side) interior angles, so they add up to 180°: ∠6 = 180° − 125° = 55°.',
        'Answer: 55',
      ],
      fig: {
        kind: 'transversal',
        angle: 55,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠3 = 40°. What is ∠5?',
      a: '140',
      steps: [
        '∠3 and ∠5 are consecutive (same-side) interior angles, so they add up to 180°: ∠5 = 180° − 40° = 140°.',
        'Answer: 140',
      ],
      fig: {
        kind: 'transversal',
        angle: 40,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠5 = 55°. What is ∠8?',
      a: '55',
      steps: ['∠5 and ∠8 are vertical angles, so they are equal: ∠8 = 55°.', 'Answer: 55'],
      fig: {
        kind: 'transversal',
        angle: 125,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠5 = 100°. What is ∠8?',
      a: '100',
      steps: ['∠5 and ∠8 are vertical angles, so they are equal: ∠8 = 100°.', 'Answer: 100'],
      fig: {
        kind: 'transversal',
        angle: 80,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠3 = 70°. What is ∠2?',
      a: '70',
      steps: ['∠3 and ∠2 are vertical angles, so they are equal: ∠2 = 70°.', 'Answer: 70'],
      fig: {
        kind: 'transversal',
        angle: 70,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = 40°. What is ∠5?',
      a: '40',
      steps: ['∠8 and ∠5 are vertical angles, so they are equal: ∠5 = 40°.', 'Answer: 40'],
      fig: {
        kind: 'transversal',
        angle: 140,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠7 = 40°. What is ∠6?',
      a: '40',
      steps: ['∠7 and ∠6 are vertical angles, so they are equal: ∠6 = 40°.', 'Answer: 40'],
      fig: {
        kind: 'transversal',
        angle: 40,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠5 = 105°. What is ∠8?',
      a: '105',
      steps: ['∠5 and ∠8 are vertical angles, so they are equal: ∠8 = 105°.', 'Answer: 105'],
      fig: {
        kind: 'transversal',
        angle: 75,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠3 = 115°. What is ∠2?',
      a: '115',
      steps: ['∠3 and ∠2 are vertical angles, so they are equal: ∠2 = 115°.', 'Answer: 115'],
      fig: {
        kind: 'transversal',
        angle: 115,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = 50°. What is ∠5?',
      a: '50',
      steps: ['∠8 and ∠5 are vertical angles, so they are equal: ∠5 = 50°.', 'Answer: 50'],
      fig: {
        kind: 'transversal',
        angle: 130,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠5 = (9x − 13)° and ∠3 = (5x − 45)°. What is ∠5?',
      a: '140',
      steps: [
        '∠5 and ∠3 are consecutive (same-side) interior angles, so they add up to 180°.',
        '(9x − 13) + (5x − 45) = 180',
        '14x − 58 = 180, so 14x = 238 and x = 17.',
        '∠5 = 9(17) − 13 = 140°.',
        'Answer: 140',
      ],
      fig: {
        kind: 'transversal',
        angle: 40,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠6 = (6x − 38)° and ∠4 = (4x + 38)°. What is ∠6?',
      a: '70',
      steps: [
        '∠6 and ∠4 are consecutive (same-side) interior angles, so they add up to 180°.',
        '(6x − 38) + (4x + 38) = 180',
        '10x + 0 = 180, so 10x = 180 and x = 18.',
        '∠6 = 6(18) − 38 = 70°.',
        'Answer: 70',
      ],
      fig: {
        kind: 'transversal',
        angle: 70,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠6 = (7x + 35)° and ∠4 = (5x − 35)°. What is ∠6?',
      a: '140',
      steps: [
        '∠6 and ∠4 are consecutive (same-side) interior angles, so they add up to 180°.',
        '(7x + 35) + (5x − 35) = 180',
        '12x + 0 = 180, so 12x = 180 and x = 15.',
        '∠6 = 7(15) + 35 = 140°.',
        'Answer: 140',
      ],
      fig: {
        kind: 'transversal',
        angle: 140,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠5 = (7x − 8)° and ∠3 = (6x − 59)°. What is ∠3?',
      a: '55',
      steps: [
        '∠5 and ∠3 are consecutive (same-side) interior angles, so they add up to 180°.',
        '(7x − 8) + (6x − 59) = 180',
        '13x − 67 = 180, so 13x = 247 and x = 19.',
        '∠3 = 6(19) − 59 = 55°.',
        'Answer: 55',
      ],
      fig: {
        kind: 'transversal',
        angle: 55,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠6 = (5x + 30)° and ∠4 = (6x − 37)°. What is x?',
      a: '17',
      steps: [
        '∠6 and ∠4 are consecutive (same-side) interior angles, so they add up to 180°.',
        '(5x + 30) + (6x − 37) = 180',
        '11x − 7 = 180, so 11x = 187 and x = 17.',
        'Answer: 17',
      ],
      fig: {
        kind: 'transversal',
        angle: 115,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠5 = (8x − 34)° and ∠3 = (7x + 19)°. What is ∠3?',
      a: '110',
      steps: [
        '∠5 and ∠3 are consecutive (same-side) interior angles, so they add up to 180°.',
        '(8x − 34) + (7x + 19) = 180',
        '15x − 15 = 180, so 15x = 195 and x = 13.',
        '∠3 = 7(13) + 19 = 110°.',
        'Answer: 110',
      ],
      fig: {
        kind: 'transversal',
        angle: 110,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠3 = (x + 28)° and ∠5 = (9x − 18)°. What is ∠3?',
      a: '45',
      steps: [
        '∠3 and ∠5 are consecutive (same-side) interior angles, so they add up to 180°.',
        '(x + 28) + (9x − 18) = 180',
        '10x + 10 = 180, so 10x = 170 and x = 17.',
        '∠3 = 1(17) + 28 = 45°.',
        'Answer: 45',
      ],
      fig: {
        kind: 'transversal',
        angle: 45,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠5 = (6x − 28)° and ∠3 = (8x + 26)°. What is ∠5?',
      a: '50',
      steps: [
        '∠5 and ∠3 are consecutive (same-side) interior angles, so they add up to 180°.',
        '(6x − 28) + (8x + 26) = 180',
        '14x − 2 = 180, so 14x = 182 and x = 13.',
        '∠5 = 6(13) − 28 = 50°.',
        'Answer: 50',
      ],
      fig: {
        kind: 'transversal',
        angle: 130,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠6 = (9x + 13)° and ∠4 = (3x + 11)°. What is ∠4?',
      a: '50',
      steps: [
        '∠6 and ∠4 are consecutive (same-side) interior angles, so they add up to 180°.',
        '(9x + 13) + (3x + 11) = 180',
        '12x + 24 = 180, so 12x = 156 and x = 13.',
        '∠4 = 3(13) + 11 = 50°.',
        'Answer: 50',
      ],
      fig: {
        kind: 'transversal',
        angle: 130,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = (x + 57)° and ∠5 = (2x + 39)°. What is x?',
      a: '18',
      steps: [
        '∠8 and ∠5 are vertical angles, so they are equal.',
        'x + 57 = 2x + 39',
        '−1x = −18, so x = 18.',
        'Answer: 18',
      ],
      fig: {
        kind: 'transversal',
        angle: 105,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠5 = (6x + 52)° and ∠8 = (7x + 39)°. What is ∠8?',
      a: '130',
      steps: [
        '∠5 and ∠8 are vertical angles, so they are equal.',
        '6x + 52 = 7x + 39',
        '−1x = −13, so x = 13.',
        '∠8 = 7(13) + 39 = 130°.',
        'Answer: 130',
      ],
      fig: {
        kind: 'transversal',
        angle: 50,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠1 = (4x + 43)° and ∠4 = (6x + 7)°. What is ∠1?',
      a: '115',
      steps: [
        '∠1 and ∠4 are vertical angles, so they are equal.',
        '4x + 43 = 6x + 7',
        '−2x = −36, so x = 18.',
        '∠1 = 4(18) + 43 = 115°.',
        'Answer: 115',
      ],
      fig: {
        kind: 'transversal',
        angle: 65,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = (6x + 55)° and ∠5 = (8x + 25)°. What is x?',
      a: '15',
      steps: [
        '∠8 and ∠5 are vertical angles, so they are equal.',
        '6x + 55 = 8x + 25',
        '−2x = −30, so x = 15.',
        'Answer: 15',
      ],
      fig: {
        kind: 'transversal',
        angle: 35,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠1 = (7x + 5)° and ∠4 = (6x + 25)°. What is ∠1?',
      a: '145',
      steps: [
        '∠1 and ∠4 are vertical angles, so they are equal.',
        '7x + 5 = 6x + 25',
        '1x = 20, so x = 20.',
        '∠1 = 7(20) + 5 = 145°.',
        'Answer: 145',
      ],
      fig: {
        kind: 'transversal',
        angle: 35,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠2 = (2x + 26)° and ∠3 = (5x − 40)°. What is x?',
      a: '22',
      steps: [
        '∠2 and ∠3 are vertical angles, so they are equal.',
        '2x + 26 = 5x − 40',
        '−3x = −66, so x = 22.',
        'Answer: 22',
      ],
      fig: {
        kind: 'transversal',
        angle: 70,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠4 = (7x + 19)° and ∠1 = (5x + 55)°. What is x?',
      a: '18',
      steps: [
        '∠4 and ∠1 are vertical angles, so they are equal.',
        '7x + 19 = 5x + 55',
        '2x = 36, so x = 18.',
        'Answer: 18',
      ],
      fig: {
        kind: 'transversal',
        angle: 35,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = (6x + 28)° and ∠5 = (7x + 11)°. What is ∠5?',
      a: '130',
      steps: [
        '∠8 and ∠5 are vertical angles, so they are equal.',
        '6x + 28 = 7x + 11',
        '−1x = −17, so x = 17.',
        '∠5 = 7(17) + 11 = 130°.',
        'Answer: 130',
      ],
      fig: {
        kind: 'transversal',
        angle: 50,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠4 = (x + 58)° and ∠1 = (5x − 10)°. What is ∠4?',
      a: '75',
      steps: [
        '∠4 and ∠1 are vertical angles, so they are equal.',
        'x + 58 = 5x − 10',
        '−4x = −68, so x = 17.',
        '∠4 = 1(17) + 58 = 75°.',
        'Answer: 75',
      ],
      fig: {
        kind: 'transversal',
        angle: 105,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠1 = 105°. What is ∠7?',
      a: '75',
      steps: [
        '∠1 and ∠7 are consecutive (same-side) exterior angles, so they add up to 180°: ∠7 = 180° − 105° = 75°.',
        'Answer: 75',
      ],
      fig: {
        kind: 'transversal',
        angle: 75,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠1 = 120°. What is ∠7?',
      a: '60',
      steps: [
        '∠1 and ∠7 are consecutive (same-side) exterior angles, so they add up to 180°: ∠7 = 180° − 120° = 60°.',
        'Answer: 60',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠7 = 120°. What is ∠1?',
      a: '60',
      steps: [
        '∠7 and ∠1 are consecutive (same-side) exterior angles, so they add up to 180°: ∠1 = 180° − 120° = 60°.',
        'Answer: 60',
      ],
      fig: {
        kind: 'transversal',
        angle: 120,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠7 = 50°. What is ∠1?',
      a: '130',
      steps: [
        '∠7 and ∠1 are consecutive (same-side) exterior angles, so they add up to 180°: ∠1 = 180° − 50° = 130°.',
        'Answer: 130',
      ],
      fig: {
        kind: 'transversal',
        angle: 50,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠1 = 40°. What is ∠2?',
      a: '140',
      steps: [
        '∠1 and ∠2 are a linear pair (they form a straight line), so they add up to 180°: ∠2 = 180° − 40° = 140°.',
        'Answer: 140',
      ],
      fig: {
        kind: 'transversal',
        angle: 140,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = 120°. What is ∠7?',
      a: '60',
      steps: [
        '∠8 and ∠7 are a linear pair (they form a straight line), so they add up to 180°: ∠7 = 180° − 120° = 60°.',
        'Answer: 60',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠7 = 35°. What is ∠8?',
      a: '145',
      steps: [
        '∠7 and ∠8 are a linear pair (they form a straight line), so they add up to 180°: ∠8 = 180° − 35° = 145°.',
        'Answer: 145',
      ],
      fig: {
        kind: 'transversal',
        angle: 35,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = 125°. What is ∠7?',
      a: '55',
      steps: [
        '∠8 and ∠7 are a linear pair (they form a straight line), so they add up to 180°: ∠7 = 180° − 125° = 55°.',
        'Answer: 55',
      ],
      fig: {
        kind: 'transversal',
        angle: 55,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠7 = (7x − 4)° and ∠1 = (5x + 40)°. What is x?',
      a: '12',
      steps: [
        '∠7 and ∠1 are consecutive (same-side) exterior angles, so they add up to 180°.',
        '(7x − 4) + (5x + 40) = 180',
        '12x + 36 = 180, so 12x = 144 and x = 12.',
        'Answer: 12',
      ],
      fig: {
        kind: 'transversal',
        angle: 80,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠2 = (5x − 40)° and ∠8 = (7x + 40)°. What is x?',
      a: '15',
      steps: [
        '∠2 and ∠8 are consecutive (same-side) exterior angles, so they add up to 180°.',
        '(5x − 40) + (7x + 40) = 180',
        '12x + 0 = 180, so 12x = 180 and x = 15.',
        'Answer: 15',
      ],
      fig: {
        kind: 'transversal',
        angle: 35,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = (5x + 50)° and ∠2 = (x + 16)°. What is ∠2?',
      a: '35',
      steps: [
        '∠8 and ∠2 are consecutive (same-side) exterior angles, so they add up to 180°.',
        '(5x + 50) + (x + 16) = 180',
        '6x + 66 = 180, so 6x = 114 and x = 19.',
        '∠2 = 1(19) + 16 = 35°.',
        'Answer: 35',
      ],
      fig: {
        kind: 'transversal',
        angle: 35,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠2 = (9x + 14)° and ∠8 = (7x − 58)°. What is ∠2?',
      a: '140',
      steps: [
        '∠2 and ∠8 are consecutive (same-side) exterior angles, so they add up to 180°.',
        '(9x + 14) + (7x − 58) = 180',
        '16x − 44 = 180, so 16x = 224 and x = 14.',
        '∠2 = 9(14) + 14 = 140°.',
        'Answer: 140',
      ],
      fig: {
        kind: 'transversal',
        angle: 140,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = (4x + 14)° and ∠6 = (6x + 26)°. What is ∠6?',
      a: '110',
      steps: [
        '∠8 and ∠6 are a linear pair (they form a straight line), so they add up to 180°.',
        '(4x + 14) + (6x + 26) = 180',
        '10x + 40 = 180, so 10x = 140 and x = 14.',
        '∠6 = 6(14) + 26 = 110°.',
        'Answer: 110',
      ],
      fig: {
        kind: 'transversal',
        angle: 110,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = (x + 51)° and ∠6 = (2x + 57)°. What is ∠6?',
      a: '105',
      steps: [
        '∠8 and ∠6 are a linear pair (they form a straight line), so they add up to 180°.',
        '(x + 51) + (2x + 57) = 180',
        '3x + 108 = 180, so 3x = 72 and x = 24.',
        '∠6 = 2(24) + 57 = 105°.',
        'Answer: 105',
      ],
      fig: {
        kind: 'transversal',
        angle: 105,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠4 = (8x − 35)° and ∠2 = (5x − 45)°. What is x?',
      a: '20',
      steps: [
        '∠4 and ∠2 are a linear pair (they form a straight line), so they add up to 180°.',
        '(8x − 35) + (5x − 45) = 180',
        '13x − 80 = 180, so 13x = 260 and x = 20.',
        'Answer: 20',
      ],
      fig: {
        kind: 'transversal',
        angle: 55,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠5 = (8x + 25)° and ∠7 = (6x − 55)°. What is ∠7?',
      a: '35',
      steps: [
        '∠5 and ∠7 are a linear pair (they form a straight line), so they add up to 180°.',
        '(8x + 25) + (6x − 55) = 180',
        '14x − 30 = 180, so 14x = 210 and x = 15.',
        '∠7 = 6(15) − 55 = 35°.',
        'Answer: 35',
      ],
      fig: {
        kind: 'transversal',
        angle: 35,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
  ],
  compsupp: [
    {
      q: 'What is the complement of a 42° angle?',
      a: '48',
      steps: ['Complementary angles add up to 90°.', '90° − 42° = 48°.', 'Answer: 48'],
    },
    {
      q: 'What is the complement of a 57° angle?',
      a: '33',
      steps: ['Complementary angles add up to 90°.', '90° − 57° = 33°.', 'Answer: 33'],
    },
    {
      q: 'What is the complement of a 29° angle?',
      a: '61',
      steps: ['Complementary angles add up to 90°.', '90° − 29° = 61°.', 'Answer: 61'],
    },
    {
      q: 'What is the complement of a 44° angle?',
      a: '46',
      steps: ['Complementary angles add up to 90°.', '90° − 44° = 46°.', 'Answer: 46'],
    },
    {
      q: 'What is the complement of a 68° angle?',
      a: '22',
      steps: ['Complementary angles add up to 90°.', '90° − 68° = 22°.', 'Answer: 22'],
    },
    {
      q: 'What is the complement of a 43° angle?',
      a: '47',
      steps: ['Complementary angles add up to 90°.', '90° − 43° = 47°.', 'Answer: 47'],
    },
    {
      q: 'What is the supplement of a 64° angle?',
      a: '116',
      steps: ['Supplementary angles add up to 180°.', '180° − 64° = 116°.', 'Answer: 116'],
    },
    {
      q: 'What is the supplement of a 21° angle?',
      a: '159',
      steps: ['Supplementary angles add up to 180°.', '180° − 21° = 159°.', 'Answer: 159'],
    },
    {
      q: 'What is the supplement of a 90° angle?',
      a: '90',
      steps: ['Supplementary angles add up to 180°.', '180° − 90° = 90°.', 'Answer: 90'],
    },
    {
      q: 'What is the supplement of a 34° angle?',
      a: '146',
      steps: ['Supplementary angles add up to 180°.', '180° − 34° = 146°.', 'Answer: 146'],
    },
    {
      q: 'What is the supplement of a 79° angle?',
      a: '101',
      steps: ['Supplementary angles add up to 180°.', '180° − 79° = 101°.', 'Answer: 101'],
    },
    {
      q: 'What is the supplement of a 152° angle?',
      a: '28',
      steps: ['Supplementary angles add up to 180°.', '180° − 152° = 28°.', 'Answer: 28'],
    },
    {
      q: 'Angles A and B are complementary. ∠A = 52°. What is ∠B?',
      a: '38',
      steps: ['Complementary angles add up to 90°.', '∠B = 90° − 52° = 38°.', 'Answer: 38'],
    },
    {
      q: 'Angles A and B are complementary. ∠A = 15°. What is ∠B?',
      a: '75',
      steps: ['Complementary angles add up to 90°.', '∠B = 90° − 15° = 75°.', 'Answer: 75'],
    },
    {
      q: 'Angles A and B are supplementary. ∠A = 116°. What is ∠B?',
      a: '64',
      steps: ['Supplementary angles add up to 180°.', '∠B = 180° − 116° = 64°.', 'Answer: 64'],
    },
    {
      q: 'Angles A and B are supplementary. ∠A = 129°. What is ∠B?',
      a: '51',
      steps: ['Supplementary angles add up to 180°.', '∠B = 180° − 129° = 51°.', 'Answer: 51'],
    },
    {
      q: 'Angles R and S are complementary. ∠R = (9x + 27)° and ∠S = (2x + 19)°. What is x?',
      a: '4',
      steps: [
        'Complementary angles add up to 90°.',
        '(9x + 27) + (2x + 19) = 90',
        '11x + 46 = 90, so 11x = 44 and x = 4.',
        'Answer: 4',
      ],
    },
    {
      q: 'Angles R and S are complementary. ∠R = (4x − 25)° and ∠S = (7x + 38)°. What is x?',
      a: '7',
      steps: [
        'Complementary angles add up to 90°.',
        '(4x − 25) + (7x + 38) = 90',
        '11x + 13 = 90, so 11x = 77 and x = 7.',
        'Answer: 7',
      ],
    },
    {
      q: 'Angles R and S are complementary. ∠R = (9x + 12)° and ∠S = (2x + 12)°. What is x?',
      a: '6',
      steps: [
        'Complementary angles add up to 90°.',
        '(9x + 12) + (2x + 12) = 90',
        '11x + 24 = 90, so 11x = 66 and x = 6.',
        'Answer: 6',
      ],
    },
    {
      q: 'Angles R and S are complementary. ∠R = (x + 15)° and ∠S = (9x − 35)°. What is x?',
      a: '11',
      steps: [
        'Complementary angles add up to 90°.',
        '(x + 15) + (9x − 35) = 90',
        '10x − 20 = 90, so 10x = 110 and x = 11.',
        'Answer: 11',
      ],
    },
    {
      q: 'Angles R and S are complementary. ∠R = (3x − 21)° and ∠S = (5x + 31)°. What is x?',
      a: '10',
      steps: [
        'Complementary angles add up to 90°.',
        '(3x − 21) + (5x + 31) = 90',
        '8x + 10 = 90, so 8x = 80 and x = 10.',
        'Answer: 10',
      ],
    },
    {
      q: 'Angles R and S are complementary. ∠R = (6x + 2)° and ∠S = (3x + 25)°. What is ∠R?',
      a: '44',
      steps: [
        'Complementary angles add up to 90°.',
        '(6x + 2) + (3x + 25) = 90',
        '9x + 27 = 90, so 9x = 63 and x = 7.',
        '∠R = 6(7) + 2 = 44°.',
        'Answer: 44',
      ],
    },
    {
      q: 'Angles R and S are complementary. ∠R = (x − 5)° and ∠S = (6x − 24)°. What is ∠R?',
      a: '12',
      steps: [
        'Complementary angles add up to 90°.',
        '(x − 5) + (6x − 24) = 90',
        '7x − 29 = 90, so 7x = 119 and x = 17.',
        '∠R = 1(17) − 5 = 12°.',
        'Answer: 12',
      ],
    },
    {
      q: 'Angles R and S are complementary. ∠R = (8x + 5)° and ∠S = (9x + 34)°. What is ∠R?',
      a: '29',
      steps: [
        'Complementary angles add up to 90°.',
        '(8x + 5) + (9x + 34) = 90',
        '17x + 39 = 90, so 17x = 51 and x = 3.',
        '∠R = 8(3) + 5 = 29°.',
        'Answer: 29',
      ],
    },
    {
      q: 'Angles R and S are complementary. ∠R = (3x + 12)° and ∠S = (7x − 12)°. What is ∠S?',
      a: '51',
      steps: [
        'Complementary angles add up to 90°.',
        '(3x + 12) + (7x − 12) = 90',
        '10x + 0 = 90, so 10x = 90 and x = 9.',
        '∠S = 7(9) − 12 = 51°.',
        'Answer: 51',
      ],
    },
    {
      q: 'Angles X and Y are supplementary. ∠X = (x + 2)° and ∠Y = (9x + 38)°. What is x?',
      a: '14',
      steps: [
        'Supplementary angles add up to 180°.',
        '(x + 2) + (9x + 38) = 180',
        '10x + 40 = 180, so 10x = 140 and x = 14.',
        'Answer: 14',
      ],
    },
    {
      q: 'Angles X and Y are supplementary. ∠X = (3x − 24)° and ∠Y = (9x + 36)°. What is x?',
      a: '14',
      steps: [
        'Supplementary angles add up to 180°.',
        '(3x − 24) + (9x + 36) = 180',
        '12x + 12 = 180, so 12x = 168 and x = 14.',
        'Answer: 14',
      ],
    },
    {
      q: 'Angles X and Y are supplementary. ∠X = (3x + 10)° and ∠Y = (5x + 34)°. What is x?',
      a: '17',
      steps: [
        'Supplementary angles add up to 180°.',
        '(3x + 10) + (5x + 34) = 180',
        '8x + 44 = 180, so 8x = 136 and x = 17.',
        'Answer: 17',
      ],
    },
    {
      q: 'Angles X and Y are supplementary. ∠X = (8x − 5)° and ∠Y = (4x − 31)°. What is x?',
      a: '18',
      steps: [
        'Supplementary angles add up to 180°.',
        '(8x − 5) + (4x − 31) = 180',
        '12x − 36 = 180, so 12x = 216 and x = 18.',
        'Answer: 18',
      ],
    },
    {
      q: 'Angles X and Y are supplementary. ∠X = (2x + 15)° and ∠Y = (9x − 22)°. What is x?',
      a: '17',
      steps: [
        'Supplementary angles add up to 180°.',
        '(2x + 15) + (9x − 22) = 180',
        '11x − 7 = 180, so 11x = 187 and x = 17.',
        'Answer: 17',
      ],
    },
    {
      q: 'Angles X and Y are supplementary. ∠X = (6x − 15)° and ∠Y = (9x)°. What is ∠Y?',
      a: '117',
      steps: [
        'Supplementary angles add up to 180°.',
        '(6x − 15) + (9x) = 180',
        '15x − 15 = 180, so 15x = 195 and x = 13.',
        '∠Y = 9(13) + 0 = 117°.',
        'Answer: 117',
      ],
    },
    {
      q: 'Angles X and Y are supplementary. ∠X = (4x + 21)° and ∠Y = (9x − 10)°. What is ∠X?',
      a: '73',
      steps: [
        'Supplementary angles add up to 180°.',
        '(4x + 21) + (9x − 10) = 180',
        '13x + 11 = 180, so 13x = 169 and x = 13.',
        '∠X = 4(13) + 21 = 73°.',
        'Answer: 73',
      ],
    },
    {
      q: 'Angles X and Y are supplementary. ∠X = (8x + 24)° and ∠Y = (7x + 21)°. What is ∠X?',
      a: '96',
      steps: [
        'Supplementary angles add up to 180°.',
        '(8x + 24) + (7x + 21) = 180',
        '15x + 45 = 180, so 15x = 135 and x = 9.',
        '∠X = 8(9) + 24 = 96°.',
        'Answer: 96',
      ],
    },
    {
      q: 'Angles X and Y are supplementary. ∠X = (2x + 5)° and ∠Y = (9x + 32)°. What is ∠X?',
      a: '31',
      steps: [
        'Supplementary angles add up to 180°.',
        '(2x + 5) + (9x + 32) = 180',
        '11x + 37 = 180, so 11x = 143 and x = 13.',
        '∠X = 2(13) + 5 = 31°.',
        'Answer: 31',
      ],
    },
    {
      q: 'An angle is 5 times its complement. What is the angle?',
      a: '75',
      steps: [
        'Call the angle x, so its complement is 90 − x.',
        'x = 5(90 − x), so 6x = 450.',
        'x = 75.',
        'Answer: 75',
      ],
    },
    {
      q: 'An angle is 2 times its complement. What is the angle?',
      a: '60',
      steps: [
        'Call the angle x, so its complement is 90 − x.',
        'x = 2(90 − x), so 3x = 180.',
        'x = 60.',
        'Answer: 60',
      ],
    },
    {
      q: 'An angle is 8 times its complement. What is the angle?',
      a: '80',
      steps: [
        'Call the angle x, so its complement is 90 − x.',
        'x = 8(90 − x), so 9x = 720.',
        'x = 80.',
        'Answer: 80',
      ],
    },
    {
      q: 'An angle is 4 times its complement. What is the angle?',
      a: '72',
      steps: [
        'Call the angle x, so its complement is 90 − x.',
        'x = 4(90 − x), so 5x = 360.',
        'x = 72.',
        'Answer: 72',
      ],
    },
    {
      q: 'An angle is 40° more than its complement. What is the angle?',
      a: '65',
      steps: [
        'Call the angle x, so its complement is 90 − x.',
        'x = (90 − x) + 40, so 2x = 130.',
        'x = 65.',
        'Answer: 65',
      ],
    },
    {
      q: 'An angle is 10° more than its complement. What is the angle?',
      a: '50',
      steps: [
        'Call the angle x, so its complement is 90 − x.',
        'x = (90 − x) + 10, so 2x = 100.',
        'x = 50.',
        'Answer: 50',
      ],
    },
    {
      q: 'An angle is 20° more than its complement. What is the angle?',
      a: '55',
      steps: [
        'Call the angle x, so its complement is 90 − x.',
        'x = (90 − x) + 20, so 2x = 110.',
        'x = 55.',
        'Answer: 55',
      ],
    },
    {
      q: 'An angle is 50° more than its complement. What is the angle?',
      a: '70',
      steps: [
        'Call the angle x, so its complement is 90 − x.',
        'x = (90 − x) + 50, so 2x = 140.',
        'x = 70.',
        'Answer: 70',
      ],
    },
    {
      q: 'The supplement of an angle is 8 times the angle. What is the angle?',
      a: '20',
      steps: [
        'Call the angle x, so its supplement is 180 − x.',
        '180 − x = 8x, so 9x = 180.',
        'x = 20.',
        'Answer: 20',
      ],
    },
    {
      q: 'The supplement of an angle is 5 times the angle. What is the angle?',
      a: '30',
      steps: [
        'Call the angle x, so its supplement is 180 − x.',
        '180 − x = 5x, so 6x = 180.',
        'x = 30.',
        'Answer: 30',
      ],
    },
    {
      q: 'The supplement of an angle is 11 times the angle. What is the angle?',
      a: '15',
      steps: [
        'Call the angle x, so its supplement is 180 − x.',
        '180 − x = 11x, so 12x = 180.',
        'x = 15.',
        'Answer: 15',
      ],
    },
    {
      q: 'The supplement of an angle is 2 times the angle. What is the angle?',
      a: '60',
      steps: [
        'Call the angle x, so its supplement is 180 − x.',
        '180 − x = 2x, so 3x = 180.',
        'x = 60.',
        'Answer: 60',
      ],
    },
    {
      q: 'Two complementary angles are in the ratio 2 : 7. What is the larger angle?',
      a: '70',
      steps: [
        'Share 90° in 9 equal parts: 90 ÷ 9 = 10° each.',
        'The larger angle has 7 parts: 7 × 10 = 70°.',
        'Answer: 70',
      ],
    },
    {
      q: 'Two complementary angles are in the ratio 4 : 5. What is the larger angle?',
      a: '50',
      steps: [
        'Share 90° in 9 equal parts: 90 ÷ 9 = 10° each.',
        'The larger angle has 5 parts: 5 × 10 = 50°.',
        'Answer: 50',
      ],
    },
    {
      q: 'Two complementary angles are in the ratio 3 : 7. What is the larger angle?',
      a: '63',
      steps: [
        'Share 90° in 10 equal parts: 90 ÷ 10 = 9° each.',
        'The larger angle has 7 parts: 7 × 9 = 63°.',
        'Answer: 63',
      ],
    },
    {
      q: 'Two complementary angles are in the ratio 1 : 5. What is the larger angle?',
      a: '75',
      steps: [
        'Share 90° in 6 equal parts: 90 ÷ 6 = 15° each.',
        'The larger angle has 5 parts: 5 × 15 = 75°.',
        'Answer: 75',
      ],
    },
  ],
  solvex: [
    {
      q: 'Two vertical angles measure x° and 55°. What is x?',
      a: '55',
      steps: ['Vertical angles are equal.', 'x = 55.', 'Answer: 55'],
    },
    {
      q: 'Two vertical angles measure x° and 77°. What is x?',
      a: '77',
      steps: ['Vertical angles are equal.', 'x = 77.', 'Answer: 77'],
    },
    {
      q: 'Two vertical angles measure x° and 64°. What is x?',
      a: '64',
      steps: ['Vertical angles are equal.', 'x = 64.', 'Answer: 64'],
    },
    {
      q: 'Two vertical angles measure x° and 70°. What is x?',
      a: '70',
      steps: ['Vertical angles are equal.', 'x = 70.', 'Answer: 70'],
    },
    {
      q: 'Two angles form a linear pair and measure 116° and x°. What is x?',
      a: '64',
      steps: ['A linear pair adds up to 180°.', '116 + x = 180, so x = 64.', 'Answer: 64'],
    },
    {
      q: 'Two angles form a linear pair and measure 91° and x°. What is x?',
      a: '89',
      steps: ['A linear pair adds up to 180°.', '91 + x = 180, so x = 89.', 'Answer: 89'],
    },
    {
      q: 'Two angles form a linear pair and measure 109° and x°. What is x?',
      a: '71',
      steps: ['A linear pair adds up to 180°.', '109 + x = 180, so x = 71.', 'Answer: 71'],
    },
    {
      q: 'Two angles form a linear pair and measure 136° and x°. What is x?',
      a: '44',
      steps: ['A linear pair adds up to 180°.', '136 + x = 180, so x = 44.', 'Answer: 44'],
    },
    {
      q: '∠ABC is a right angle and D is inside it. ∠ABD = 64° and ∠DBC = x°. What is x?',
      a: '26',
      steps: [
        'A right angle is 90°, so the two parts add up to 90°.',
        '64 + x = 90, so x = 26.',
        'Answer: 26',
      ],
    },
    {
      q: '∠ABC is a right angle and D is inside it. ∠ABD = 80° and ∠DBC = x°. What is x?',
      a: '10',
      steps: [
        'A right angle is 90°, so the two parts add up to 90°.',
        '80 + x = 90, so x = 10.',
        'Answer: 10',
      ],
    },
    {
      q: '∠ABC is a right angle and D is inside it. ∠ABD = 81° and ∠DBC = x°. What is x?',
      a: '9',
      steps: [
        'A right angle is 90°, so the two parts add up to 90°.',
        '81 + x = 90, so x = 9.',
        'Answer: 9',
      ],
    },
    {
      q: '∠ABC is a right angle and D is inside it. ∠ABD = 30° and ∠DBC = x°. What is x?',
      a: '60',
      steps: [
        'A right angle is 90°, so the two parts add up to 90°.',
        '30 + x = 90, so x = 60.',
        'Answer: 60',
      ],
    },
    {
      q: 'Three angles on a straight line measure 71°, 51° and x°. What is x?',
      a: '58',
      steps: [
        'Angles on a straight line add up to 180°.',
        '71 + 51 + x = 180, so x = 180 − 122 = 58.',
        'Answer: 58',
      ],
    },
    {
      q: 'Three angles on a straight line measure 67°, 55° and x°. What is x?',
      a: '58',
      steps: [
        'Angles on a straight line add up to 180°.',
        '67 + 55 + x = 180, so x = 180 − 122 = 58.',
        'Answer: 58',
      ],
    },
    {
      q: 'Four angles around a point measure 17°, 100°, 69° and x°. What is x?',
      a: '174',
      steps: [
        'Angles around a point add up to 360°.',
        '17 + 100 + 69 + x = 360, so x = 360 − 186 = 174.',
        'Answer: 174',
      ],
    },
    {
      q: 'Four angles around a point measure 122°, 111°, 69° and x°. What is x?',
      a: '58',
      steps: [
        'Angles around a point add up to 360°.',
        '122 + 111 + 69 + x = 360, so x = 360 − 302 = 58.',
        'Answer: 58',
      ],
    },
    {
      q: 'Two vertical angles are formed when two lines cross. One measures (3x + 29)° and the other (7x − 31)°. What is x?',
      a: '15',
      steps: [
        'Vertical angles are equal.',
        '3x + 29 = 7x − 31',
        '−4x = −60, so x = 15.',
        'Answer: 15',
      ],
    },
    {
      q: 'Two vertical angles are formed when two lines cross. One measures (3x + 28)° and the other (4x + 19)°. What is x?',
      a: '9',
      steps: [
        'Vertical angles are equal.',
        '3x + 28 = 4x + 19',
        '−1x = −9, so x = 9.',
        'Answer: 9',
      ],
    },
    {
      q: 'Two vertical angles are formed when two lines cross. One measures (7x − 5)° and the other (8x − 10)°. What is x?',
      a: '5',
      steps: ['Vertical angles are equal.', '7x − 5 = 8x − 10', '−1x = −5, so x = 5.', 'Answer: 5'],
    },
    {
      q: 'Two vertical angles are formed when two lines cross. One measures (2x + 24)° and the other (x + 28)°. What is x?',
      a: '4',
      steps: ['Vertical angles are equal.', '2x + 24 = x + 28', '1x = 4, so x = 4.', 'Answer: 4'],
    },
    {
      q: 'Two vertical angles are formed when two lines cross. One measures (x + 17)° and the other (4x − 22)°. What is x?',
      a: '13',
      steps: [
        'Vertical angles are equal.',
        'x + 17 = 4x − 22',
        '−3x = −39, so x = 13.',
        'Answer: 13',
      ],
    },
    {
      q: 'Two angles form a linear pair. They measure (5x − 29)° and (7x − 19)°. What is x?',
      a: '19',
      steps: [
        'A linear pair is supplementary: angles add up to 180°.',
        '(5x − 29) + (7x − 19) = 180',
        '12x − 48 = 180, so 12x = 228 and x = 19.',
        'Answer: 19',
      ],
    },
    {
      q: 'Two angles form a linear pair. They measure (9x − 14)° and (8x + 24)°. What is x?',
      a: '10',
      steps: [
        'A linear pair is supplementary: angles add up to 180°.',
        '(9x − 14) + (8x + 24) = 180',
        '17x + 10 = 180, so 17x = 170 and x = 10.',
        'Answer: 10',
      ],
    },
    {
      q: 'Two angles form a linear pair. They measure (6x + 3)° and (6x + 9)°. What is x?',
      a: '14',
      steps: [
        'A linear pair is supplementary: angles add up to 180°.',
        '(6x + 3) + (6x + 9) = 180',
        '12x + 12 = 180, so 12x = 168 and x = 14.',
        'Answer: 14',
      ],
    },
    {
      q: 'Two angles form a linear pair. They measure (5x + 16)° and (5x − 6)°. What is x?',
      a: '17',
      steps: [
        'A linear pair is supplementary: angles add up to 180°.',
        '(5x + 16) + (5x − 6) = 180',
        '10x + 10 = 180, so 10x = 170 and x = 17.',
        'Answer: 17',
      ],
    },
    {
      q: 'Two angles form a linear pair. They measure (x + 18)° and (7x + 26)°. What is x?',
      a: '17',
      steps: [
        'A linear pair is supplementary: angles add up to 180°.',
        '(x + 18) + (7x + 26) = 180',
        '8x + 44 = 180, so 8x = 136 and x = 17.',
        'Answer: 17',
      ],
    },
    {
      q: '∠ABC is a right angle and D is inside it. ∠ABD = (7x − 10)° and ∠DBC = (8x + 25)°. What is x?',
      a: '5',
      steps: [
        '∠ABD + ∠DBC = ∠ABC = 90°.',
        '(7x − 10) + (8x + 25) = 90, so 15x + 15 = 90 and x = 5.',
        'Answer: 5',
      ],
    },
    {
      q: '∠ABC is a right angle and D is inside it. ∠ABD = (8x + 20)° and ∠DBC = (7x − 5)°. What is x?',
      a: '5',
      steps: [
        '∠ABD + ∠DBC = ∠ABC = 90°.',
        '(8x + 20) + (7x − 5) = 90, so 15x + 15 = 90 and x = 5.',
        'Answer: 5',
      ],
    },
    {
      q: '∠ABC is a right angle and D is inside it. ∠ABD = (15x + 4)° and ∠DBC = (5x + 26)°. What is ∠ABD?',
      a: '49',
      steps: [
        '∠ABD + ∠DBC = ∠ABC = 90°.',
        '(15x + 4) + (5x + 26) = 90, so 20x + 30 = 90 and x = 3.',
        '∠ABD = 15(3) + 4 = 49°.',
        'Answer: 49',
      ],
    },
    {
      q: '∠ABC is a right angle and D is inside it. ∠ABD = (8x + 6)° and ∠DBC = (5x + 6)°. What is ∠ABD?',
      a: '54',
      steps: [
        '∠ABD + ∠DBC = ∠ABC = 90°.',
        '(8x + 6) + (5x + 6) = 90, so 13x + 12 = 90 and x = 6.',
        '∠ABD = 8(6) + 6 = 54°.',
        'Answer: 54',
      ],
    },
    {
      q: 'A, B and C lie on a straight line and D is off it. ∠ABD = (11x + 17)° and ∠DBC = (4x − 2)°. What is x?',
      a: '11',
      steps: [
        '∠ABD + ∠DBC = 180° because they make a straight line.',
        '(11x + 17) + (4x − 2) = 180, so 15x + 15 = 180 and x = 11.',
        'Answer: 11',
      ],
    },
    {
      q: 'A, B and C lie on a straight line and D is off it. ∠ABD = (9x − 15)° and ∠DBC = (7x + 3)°. What is x?',
      a: '12',
      steps: [
        '∠ABD + ∠DBC = 180° because they make a straight line.',
        '(9x − 15) + (7x + 3) = 180, so 16x − 12 = 180 and x = 12.',
        'Answer: 12',
      ],
    },
    {
      q: 'A, B and C lie on a straight line and D is off it. ∠ABD = (10x − 7)° and ∠DBC = (8x − 11)°. What is x?',
      a: '11',
      steps: [
        '∠ABD + ∠DBC = 180° because they make a straight line.',
        '(10x − 7) + (8x − 11) = 180, so 18x − 18 = 180 and x = 11.',
        'Answer: 11',
      ],
    },
    {
      q: 'A, B and C lie on a straight line and D is off it. ∠ABD = (7x − 11)° and ∠DBC = (10x + 4)°. What is x?',
      a: '11',
      steps: [
        '∠ABD + ∠DBC = 180° because they make a straight line.',
        '(7x − 11) + (10x + 4) = 180, so 17x − 7 = 180 and x = 11.',
        'Answer: 11',
      ],
    },
    {
      q: 'Two lines cross. One angle measures 76°, the angle vertical to it is (y + 11)°, and an angle next to it is (2x + 5)°. What is x?',
      a: '49.5',
      form: 'decimal',
      steps: [
        'Vertical angles are equal: y + 11 = 76, so y = 65.',
        'The angle next to it forms a linear pair with the 76° angle: 76 + (2x + 5) = 180.',
        '2x = 99, so x = 49.5.',
        'Answer: 49.5',
      ],
    },
    {
      q: 'Two lines cross. One angle measures 49°, the angle vertical to it is (y + 4)°, and an angle next to it is (2x + 7)°. What is y?',
      a: '45',
      steps: [
        'Vertical angles are equal: y + 4 = 49, so y = 45.',
        'The angle next to it forms a linear pair with the 49° angle: 49 + (2x + 7) = 180.',
        '2x = 124, so x = 62.',
        'Answer: 45',
      ],
    },
    {
      q: 'Two lines cross. One angle measures 57°, the angle vertical to it is (y + 3)°, and an angle next to it is (2x + 8)°. What is x + y?',
      a: '111.5',
      form: 'decimal',
      steps: [
        'Vertical angles are equal: y + 3 = 57, so y = 54.',
        'The angle next to it forms a linear pair with the 57° angle: 57 + (2x + 8) = 180.',
        '2x = 115, so x = 57.5.',
        'x + y = 57.5 + 54 = 111.5.',
        'Answer: 111.5',
      ],
    },
    {
      q: 'Two lines cross. One angle measures 72°, the angle vertical to it is (y + 3)°, and an angle next to it is (4x + 16)°. What is x?',
      a: '23',
      steps: [
        'Vertical angles are equal: y + 3 = 72, so y = 69.',
        'The angle next to it forms a linear pair with the 72° angle: 72 + (4x + 16) = 180.',
        '4x = 92, so x = 23.',
        'Answer: 23',
      ],
    },
    {
      q: 'Two lines cross. One angle measures 77°, the angle vertical to it is (y + 15)°, and an angle next to it is (2x + 9)°. What is y?',
      a: '62',
      steps: [
        'Vertical angles are equal: y + 15 = 77, so y = 62.',
        'The angle next to it forms a linear pair with the 77° angle: 77 + (2x + 9) = 180.',
        '2x = 94, so x = 47.',
        'Answer: 62',
      ],
    },
    {
      q: 'Two lines cross. One angle measures 39°, the angle vertical to it is (y + 11)°, and an angle next to it is (3x + 6)°. What is x + y?',
      a: '73',
      steps: [
        'Vertical angles are equal: y + 11 = 39, so y = 28.',
        'The angle next to it forms a linear pair with the 39° angle: 39 + (3x + 6) = 180.',
        '3x = 135, so x = 45.',
        'x + y = 45 + 28 = 73.',
        'Answer: 73',
      ],
    },
    {
      q: 'Two lines cross. One angle measures 38°, the angle vertical to it is (y + 10)°, and an angle next to it is (4x + 8)°. What is x?',
      a: '33.5',
      form: 'decimal',
      steps: [
        'Vertical angles are equal: y + 10 = 38, so y = 28.',
        'The angle next to it forms a linear pair with the 38° angle: 38 + (4x + 8) = 180.',
        '4x = 134, so x = 33.5.',
        'Answer: 33.5',
      ],
    },
    {
      q: 'Two lines cross. One angle measures 51°, the angle vertical to it is (y + 8)°, and an angle next to it is (2x + 7)°. What is y?',
      a: '43',
      steps: [
        'Vertical angles are equal: y + 8 = 51, so y = 43.',
        'The angle next to it forms a linear pair with the 51° angle: 51 + (2x + 7) = 180.',
        '2x = 122, so x = 61.',
        'Answer: 43',
      ],
    },
    {
      q: '∠ABC is a right angle and D is inside it. ∠ABD = (8x + 14)° and ∠DBC = (15x + 7)°. What is ∠DBC?',
      a: '52',
      steps: [
        '∠ABD + ∠DBC = ∠ABC = 90°.',
        '(8x + 14) + (15x + 7) = 90, so 23x + 21 = 90 and x = 3.',
        '∠DBC = 15(3) + 7 = 52°.',
        'Answer: 52',
      ],
    },
    {
      q: '∠ABC is a right angle and D is inside it. ∠ABD = (4x + 19)° and ∠DBC = (8x − 25)°. What is ∠DBC?',
      a: '39',
      steps: [
        '∠ABD + ∠DBC = ∠ABC = 90°.',
        '(4x + 19) + (8x − 25) = 90, so 12x − 6 = 90 and x = 8.',
        '∠DBC = 8(8) − 25 = 39°.',
        'Answer: 39',
      ],
    },
    {
      q: '∠ABC is a right angle and D is inside it. ∠ABD = (11x − 16)° and ∠DBC = (2x + 2)°. What is ∠DBC?',
      a: '18',
      steps: [
        '∠ABD + ∠DBC = ∠ABC = 90°.',
        '(11x − 16) + (2x + 2) = 90, so 13x − 14 = 90 and x = 8.',
        '∠DBC = 2(8) + 2 = 18°.',
        'Answer: 18',
      ],
    },
    {
      q: '∠ABC is a right angle and D is inside it. ∠ABD = (2x + 16)° and ∠DBC = (4x + 2)°. What is ∠DBC?',
      a: '50',
      steps: [
        '∠ABD + ∠DBC = ∠ABC = 90°.',
        '(2x + 16) + (4x + 2) = 90, so 6x + 18 = 90 and x = 12.',
        '∠DBC = 4(12) + 2 = 50°.',
        'Answer: 50',
      ],
    },
    {
      q: 'A, B and C lie on a straight line and D is off it. ∠ABD = (7x − 2)° and ∠DBC = (7x + 28)°. What is ∠DBC?',
      a: '105',
      steps: [
        '∠ABD + ∠DBC = 180° because they make a straight line.',
        '(7x − 2) + (7x + 28) = 180, so 14x + 26 = 180 and x = 11.',
        '∠DBC = 7(11) + 28 = 105°.',
        'Answer: 105',
      ],
    },
    {
      q: 'A, B and C lie on a straight line and D is off it. ∠ABD = (9x + 14)° and ∠DBC = (15x − 2)°. What is ∠DBC?',
      a: '103',
      steps: [
        '∠ABD + ∠DBC = 180° because they make a straight line.',
        '(9x + 14) + (15x − 2) = 180, so 24x + 12 = 180 and x = 7.',
        '∠DBC = 15(7) − 2 = 103°.',
        'Answer: 103',
      ],
    },
    {
      q: 'A, B and C lie on a straight line and D is off it. ∠ABD = (4x + 20)° and ∠DBC = (11x + 25)°. What is ∠DBC?',
      a: '124',
      steps: [
        '∠ABD + ∠DBC = 180° because they make a straight line.',
        '(4x + 20) + (11x + 25) = 180, so 15x + 45 = 180 and x = 9.',
        '∠DBC = 11(9) + 25 = 124°.',
        'Answer: 124',
      ],
    },
    {
      q: 'A, B and C lie on a straight line and D is off it. ∠ABD = (12x + 17)° and ∠DBC = (11x + 2)°. What is ∠DBC?',
      a: '79',
      steps: [
        '∠ABD + ∠DBC = 180° because they make a straight line.',
        '(12x + 17) + (11x + 2) = 180, so 23x + 19 = 180 and x = 7.',
        '∠DBC = 11(7) + 2 = 79°.',
        'Answer: 79',
      ],
    },
  ],
  allangles: [
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = 135°. What is ∠6?',
      a: '45',
      steps: [
        '∠8 and ∠6 are a linear pair (they form a straight line), so they add up to 180°: ∠6 = 180° − 135° = 45°.',
        'Answer: 45',
      ],
      fig: {
        kind: 'transversal',
        angle: 45,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠7 = 75°. What is ∠1?',
      a: '105',
      steps: [
        '∠7 and ∠1 are consecutive (same-side) exterior angles, so they add up to 180°: ∠1 = 180° − 75° = 105°.',
        'Answer: 105',
      ],
      fig: {
        kind: 'transversal',
        angle: 75,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠3 = 65°. What is ∠2?',
      a: '65',
      steps: ['∠3 and ∠2 are vertical angles, so they are equal: ∠2 = 65°.', 'Answer: 65'],
      fig: {
        kind: 'transversal',
        angle: 65,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠1 = 125°. What is ∠8?',
      a: '125',
      steps: [
        '∠1 and ∠8 are alternate exterior angles, so they are equal: ∠8 = 125°.',
        'Answer: 125',
      ],
      fig: {
        kind: 'transversal',
        angle: 55,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠1 = 50°. What is ∠3?',
      a: '130',
      steps: [
        '∠1 and ∠3 are a linear pair (they form a straight line), so they add up to 180°: ∠3 = 180° − 50° = 130°.',
        'Answer: 130',
      ],
      fig: {
        kind: 'transversal',
        angle: 130,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠5 = 105°. What is ∠7?',
      a: '75',
      steps: [
        '∠5 and ∠7 are a linear pair (they form a straight line), so they add up to 180°: ∠7 = 180° − 105° = 75°.',
        'Answer: 75',
      ],
      fig: {
        kind: 'transversal',
        angle: 75,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠2 = 105°. What is ∠5?',
      a: '75',
      steps: [
        '∠2 and ∠1 are a linear pair (they form a straight line), so they add up to 180°: ∠1 = 180° − 105° = 75°.',
        '∠1 and ∠5 are corresponding angles, so they are equal: ∠5 = 75°.',
        'Answer: 75',
      ],
      fig: {
        kind: 'transversal',
        angle: 105,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠4 = 105°. What is ∠7?',
      a: '75',
      steps: [
        '∠4 and ∠1 are vertical angles, so they are equal: ∠1 = 105°.',
        '∠1 and ∠7 are consecutive (same-side) exterior angles, so they add up to 180°: ∠7 = 180° − 105° = 75°.',
        'Answer: 75',
      ],
      fig: {
        kind: 'transversal',
        angle: 75,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠7 = 75°. What is ∠4?',
      a: '105',
      steps: [
        '∠7 and ∠1 are consecutive (same-side) exterior angles, so they add up to 180°: ∠1 = 180° − 75° = 105°.',
        '∠1 and ∠4 are vertical angles, so they are equal: ∠4 = 105°.',
        'Answer: 105',
      ],
      fig: {
        kind: 'transversal',
        angle: 75,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠4 = 110°. What is ∠7?',
      a: '70',
      steps: [
        '∠4 and ∠1 are vertical angles, so they are equal: ∠1 = 110°.',
        '∠1 and ∠7 are consecutive (same-side) exterior angles, so they add up to 180°: ∠7 = 180° − 110° = 70°.',
        'Answer: 70',
      ],
      fig: {
        kind: 'transversal',
        angle: 70,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠5 = 105°. What is ∠3 + ∠8?',
      a: '180',
      steps: [
        'The eight angles are 105° or 75°: ∠3 = 75°, ∠8 = 105°.',
        '75 + 105 = 180.',
        'Answer: 180',
      ],
      fig: {
        kind: 'transversal',
        angle: 75,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠1 = 70°. What is ∠2 + ∠3?',
      a: '220',
      steps: [
        'The eight angles are 70° or 110°: ∠2 = 110°, ∠3 = 110°.',
        '110 + 110 = 220.',
        'Answer: 220',
      ],
      fig: {
        kind: 'transversal',
        angle: 110,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠7 = 40°. What is ∠3 + ∠8?',
      a: '180',
      steps: [
        'The eight angles are 40° or 140°: ∠3 = 40°, ∠8 = 140°.',
        '40 + 140 = 180.',
        'Answer: 180',
      ],
      fig: {
        kind: 'transversal',
        angle: 40,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠5 = 130°. What is ∠3 + ∠5?',
      a: '180',
      steps: [
        'The eight angles are 130° or 50°: ∠3 = 50°, ∠5 = 130°.',
        '50 + 130 = 180.',
        'Answer: 180',
      ],
      fig: {
        kind: 'transversal',
        angle: 50,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠6 = 65°. What is ∠1 + ∠4?',
      a: '230',
      steps: [
        'The eight angles are 65° or 115°: ∠1 = 115°, ∠4 = 115°.',
        '115 + 115 = 230.',
        'Answer: 230',
      ],
      fig: {
        kind: 'transversal',
        angle: 65,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = 110°. What is ∠6 + ∠7?',
      a: '140',
      steps: [
        'The eight angles are 110° or 70°: ∠6 = 70°, ∠7 = 70°.',
        '70 + 70 = 140.',
        'Answer: 140',
      ],
      fig: {
        kind: 'transversal',
        angle: 70,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠2 = 45°. How many of the eight angles measure 45°?',
      a: '4',
      steps: [
        'The eight angles take only two values: 45° and 180° − 45° = 135°.',
        'Four angles are 45° and four are 135°, so 4 of them measure 45°.',
        'Answer: 4',
      ],
      fig: {
        kind: 'transversal',
        angle: 45,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠4 = 100°. How many of the eight angles measure 100°?',
      a: '4',
      steps: [
        'The eight angles take only two values: 100° and 180° − 100° = 80°.',
        'Four angles are 100° and four are 80°, so 4 of them measure 100°.',
        'Answer: 4',
      ],
      fig: {
        kind: 'transversal',
        angle: 80,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = 115°. How many of the eight angles measure 115°?',
      a: '4',
      steps: [
        'The eight angles take only two values: 115° and 180° − 115° = 65°.',
        'Four angles are 115° and four are 65°, so 4 of them measure 115°.',
        'Answer: 4',
      ],
      fig: {
        kind: 'transversal',
        angle: 65,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠5 = 130°. How many of the eight angles measure 50°?',
      a: '4',
      steps: [
        'The eight angles take only two values: 130° and 180° − 130° = 50°.',
        'Four angles are 130° and four are 50°, so 4 of them measure 50°.',
        'Answer: 4',
      ],
      fig: {
        kind: 'transversal',
        angle: 50,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠7 = 125°. What is ∠1 + ∠3 + ∠8?',
      a: '235',
      steps: [
        'The eight angles are 125° or 55°: ∠1 = 55°, ∠3 = 125°, ∠8 = 55°.',
        '55 + 125 + 55 = 235.',
        'Answer: 235',
      ],
      fig: {
        kind: 'transversal',
        angle: 125,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠6 = 80°. What is ∠3 + ∠5 + ∠8?',
      a: '280',
      steps: [
        'The eight angles are 80° or 100°: ∠3 = 80°, ∠5 = 100°, ∠8 = 100°.',
        '80 + 100 + 100 = 280.',
        'Answer: 280',
      ],
      fig: {
        kind: 'transversal',
        angle: 80,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠5 = 125°. What is ∠1 + ∠3 + ∠5?',
      a: '305',
      steps: [
        'The eight angles are 125° or 55°: ∠1 = 125°, ∠3 = 55°, ∠5 = 125°.',
        '125 + 55 + 125 = 305.',
        'Answer: 305',
      ],
      fig: {
        kind: 'transversal',
        angle: 55,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠3 = 65°. What is ∠3 + ∠4 + ∠5?',
      a: '295',
      steps: [
        'The eight angles are 65° or 115°: ∠3 = 65°, ∠4 = 115°, ∠5 = 115°.',
        '65 + 115 + 115 = 295.',
        'Answer: 295',
      ],
      fig: {
        kind: 'transversal',
        angle: 65,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠7 = 105°. What is ∠1 + ∠4 + ∠8?',
      a: '225',
      steps: [
        'The eight angles are 105° or 75°: ∠1 = 75°, ∠4 = 75°, ∠8 = 75°.',
        '75 + 75 + 75 = 225.',
        'Answer: 225',
      ],
      fig: {
        kind: 'transversal',
        angle: 105,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = 40°. What is ∠3 + ∠6 + ∠7?',
      a: '420',
      steps: [
        'The eight angles are 40° or 140°: ∠3 = 140°, ∠6 = 140°, ∠7 = 140°.',
        '140 + 140 + 140 = 420.',
        'Answer: 420',
      ],
      fig: {
        kind: 'transversal',
        angle: 140,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠4 = (6x + 16)° and ∠3 = (2x + 52)°. What is ∠4?',
      a: '100',
      steps: [
        '∠4 and ∠3 are a linear pair (they form a straight line), so they add up to 180°.',
        '(6x + 16) + (2x + 52) = 180',
        '8x + 68 = 180, so 8x = 112 and x = 14.',
        '∠4 = 6(14) + 16 = 100°.',
        'Answer: 100',
      ],
      fig: {
        kind: 'transversal',
        angle: 80,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠6 = (9x − 54)° and ∠2 = (2x + 23)°. What is ∠6?',
      a: '45',
      steps: [
        '∠6 and ∠2 are corresponding angles, so they are equal.',
        '9x − 54 = 2x + 23',
        '7x = 77, so x = 11.',
        '∠6 = 9(11) − 54 = 45°.',
        'Answer: 45',
      ],
      fig: {
        kind: 'transversal',
        angle: 45,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠5 = (6x + 32)° and ∠6 = (6x − 8)°. What is x?',
      a: '13',
      steps: [
        '∠5 and ∠6 are a linear pair (they form a straight line), so they add up to 180°.',
        '(6x + 32) + (6x − 8) = 180',
        '12x + 24 = 180, so 12x = 156 and x = 13.',
        'Answer: 13',
      ],
      fig: {
        kind: 'transversal',
        angle: 70,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠1 = (3x + 53)° and ∠4 = (6x + 41)°. What is x?',
      a: '4',
      steps: [
        '∠1 and ∠4 are vertical angles, so they are equal.',
        '3x + 53 = 6x + 41',
        '−3x = −12, so x = 4.',
        'Answer: 4',
      ],
      fig: {
        kind: 'transversal',
        angle: 115,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = (4x + 39)° and ∠1 = (5x + 15)°. What is x?',
      a: '24',
      steps: [
        '∠8 and ∠1 are alternate exterior angles, so they are equal.',
        '4x + 39 = 5x + 15',
        '−1x = −24, so x = 24.',
        'Answer: 24',
      ],
      fig: {
        kind: 'transversal',
        angle: 45,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠1 = (6x + 16)° and ∠8 = (5x + 25)°. What is ∠8?',
      a: '70',
      steps: [
        '∠1 and ∠8 are alternate exterior angles, so they are equal.',
        '6x + 16 = 5x + 25',
        '1x = 9, so x = 9.',
        '∠8 = 5(9) + 25 = 70°.',
        'Answer: 70',
      ],
      fig: {
        kind: 'transversal',
        angle: 110,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠7 = (6x + 51)° and ∠1 = (5x + 30)°. What is x?',
      a: '9',
      steps: [
        '∠7 and ∠1 are consecutive (same-side) exterior angles, so they add up to 180°.',
        '(6x + 51) + (5x + 30) = 180',
        '11x + 81 = 180, so 11x = 99 and x = 9.',
        'Answer: 9',
      ],
      fig: {
        kind: 'transversal',
        angle: 105,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠2 = (2x + 27)° and ∠7 = (6x − 49)°. What is ∠7?',
      a: '65',
      steps: [
        '∠2 and ∠7 are alternate exterior angles, so they are equal.',
        '2x + 27 = 6x − 49',
        '−4x = −76, so x = 19.',
        '∠7 = 6(19) − 49 = 65°.',
        'Answer: 65',
      ],
      fig: {
        kind: 'transversal',
        angle: 65,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠4 = (7x − 7)° and ∠8 = (8x − 28)°. What is ∠8?',
      a: '140',
      steps: [
        '∠4 and ∠8 are corresponding angles, so they are equal.',
        '7x − 7 = 8x − 28',
        '−1x = −21, so x = 21.',
        '∠8 = 8(21) − 28 = 140°.',
        'Answer: 140',
      ],
      fig: {
        kind: 'transversal',
        angle: 40,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = (2x + 10)° and ∠2 = (6x + 50)°. What is ∠8?',
      a: '40',
      steps: [
        '∠8 and ∠2 are consecutive (same-side) exterior angles, so they add up to 180°.',
        '(2x + 10) + (6x + 50) = 180',
        '8x + 60 = 180, so 8x = 120 and x = 15.',
        '∠8 = 2(15) + 10 = 40°.',
        'Answer: 40',
      ],
      fig: {
        kind: 'transversal',
        angle: 140,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠2 = (6x − 19)° and ∠3 = (7x − 28)°. What is ∠2?',
      a: '35',
      steps: [
        '∠2 and ∠3 are vertical angles, so they are equal.',
        '6x − 19 = 7x − 28',
        '−1x = −9, so x = 9.',
        '∠2 = 6(9) − 19 = 35°.',
        'Answer: 35',
      ],
      fig: {
        kind: 'transversal',
        angle: 35,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠3 = (5x − 40)° and ∠4 = (6x)°. What is ∠3?',
      a: '60',
      steps: [
        '∠3 and ∠4 are a linear pair (they form a straight line), so they add up to 180°.',
        '(5x − 40) + (6x) = 180',
        '11x − 40 = 180, so 11x = 220 and x = 20.',
        '∠3 = 5(20) − 40 = 60°.',
        'Answer: 60',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠4 = (2x + 12)° and ∠3 = (5x + 35)°. What is ∠4?',
      a: '50',
      steps: [
        '∠4 and ∠3 are a linear pair (they form a straight line), so they add up to 180°.',
        '(2x + 12) + (5x + 35) = 180',
        '7x + 47 = 180, so 7x = 133 and x = 19.',
        '∠4 = 2(19) + 12 = 50°.',
        'Answer: 50',
      ],
      fig: {
        kind: 'transversal',
        angle: 130,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠7 = (x + 49)° and ∠5 = (5x + 5)°. What is ∠7?',
      a: '70',
      steps: [
        '∠7 and ∠5 are a linear pair (they form a straight line), so they add up to 180°.',
        '(x + 49) + (5x + 5) = 180',
        '6x + 54 = 180, so 6x = 126 and x = 21.',
        '∠7 = 1(21) + 49 = 70°.',
        'Answer: 70',
      ],
      fig: {
        kind: 'transversal',
        angle: 70,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠1 = (8x − 49)° and ∠5 = (2x + 29)°. What is ∠1?',
      a: '55',
      steps: [
        '∠1 and ∠5 are corresponding angles, so they are equal.',
        '8x − 49 = 2x + 29',
        '6x = 78, so x = 13.',
        '∠1 = 8(13) − 49 = 55°.',
        'Answer: 55',
      ],
      fig: {
        kind: 'transversal',
        angle: 125,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠3 = (8x − 27)° and ∠2 = (6x + 11)°. What is ∠3?',
      a: '125',
      steps: [
        '∠3 and ∠2 are vertical angles, so they are equal.',
        '8x − 27 = 6x + 11',
        '2x = 38, so x = 19.',
        '∠3 = 8(19) − 27 = 125°.',
        'Answer: 125',
      ],
      fig: {
        kind: 'transversal',
        angle: 125,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠3 = 125°. What is ∠2 + ∠3 + ∠7 + ∠8?',
      a: '430',
      steps: [
        'The eight angles are 125° or 55°: ∠2 = 125°, ∠3 = 125°, ∠7 = 125°, ∠8 = 55°.',
        '125 + 125 + 125 + 55 = 430.',
        'Answer: 430',
      ],
      fig: {
        kind: 'transversal',
        angle: 125,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠6 = 75°. What is ∠1 + ∠3 + ∠7 + ∠8?',
      a: '360',
      steps: [
        'The eight angles are 75° or 105°: ∠1 = 105°, ∠3 = 75°, ∠7 = 75°, ∠8 = 105°.',
        '105 + 75 + 75 + 105 = 360.',
        'Answer: 360',
      ],
      fig: {
        kind: 'transversal',
        angle: 75,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠1 = 70°. What is ∠3 + ∠5 + ∠7 + ∠8?',
      a: '360',
      steps: [
        'The eight angles are 70° or 110°: ∠3 = 110°, ∠5 = 70°, ∠7 = 110°, ∠8 = 70°.',
        '110 + 70 + 110 + 70 = 360.',
        'Answer: 360',
      ],
      fig: {
        kind: 'transversal',
        angle: 110,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = 55°. What is ∠1 + ∠2 + ∠4 + ∠8?',
      a: '290',
      steps: [
        'The eight angles are 55° or 125°: ∠1 = 55°, ∠2 = 125°, ∠4 = 55°, ∠8 = 55°.',
        '55 + 125 + 55 + 55 = 290.',
        'Answer: 290',
      ],
      fig: {
        kind: 'transversal',
        angle: 125,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠1 = 110°. What is ∠6?',
      a: '70',
      steps: [
        '∠1 and ∠2 are a linear pair (they form a straight line), so they add up to 180°: ∠2 = 180° − 110° = 70°.',
        '∠2 and ∠6 are corresponding angles, so they are equal: ∠6 = 70°.',
        'Answer: 70',
      ],
      fig: {
        kind: 'transversal',
        angle: 70,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = 140°. What is ∠3?',
      a: '40',
      steps: [
        '∠8 and ∠1 are alternate exterior angles, so they are equal: ∠1 = 140°.',
        '∠1 and ∠3 are a linear pair (they form a straight line), so they add up to 180°: ∠3 = 180° − 140° = 40°.',
        'Answer: 40',
      ],
      fig: {
        kind: 'transversal',
        angle: 40,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠2 = 45°. What is ∠5?',
      a: '135',
      steps: [
        '∠2 and ∠1 are a linear pair (they form a straight line), so they add up to 180°: ∠1 = 180° − 45° = 135°.',
        '∠1 and ∠5 are corresponding angles, so they are equal: ∠5 = 135°.',
        'Answer: 135',
      ],
      fig: {
        kind: 'transversal',
        angle: 45,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠7 = 120°. What is ∠4?',
      a: '60',
      steps: [
        '∠7 and ∠1 are consecutive (same-side) exterior angles, so they add up to 180°: ∠1 = 180° − 120° = 60°.',
        '∠1 and ∠4 are vertical angles, so they are equal: ∠4 = 60°.',
        'Answer: 60',
      ],
      fig: {
        kind: 'transversal',
        angle: 120,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
  ],
  polygons: [
    {
      q: 'What is the sum of the interior angles of a hexagon (6 sides)?',
      a: '720',
      steps: ['Use (n − 2) × 180 with n = 6.', '(6 − 2) × 180 = 4 × 180 = 720.', 'Answer: 720'],
    },
    {
      q: 'What is the sum of the interior angles of a heptagon (7 sides)?',
      a: '900',
      steps: ['Use (n − 2) × 180 with n = 7.', '(7 − 2) × 180 = 5 × 180 = 900.', 'Answer: 900'],
    },
    {
      q: 'What is the sum of the interior angles of a octagon (8 sides)?',
      a: '1080',
      steps: ['Use (n − 2) × 180 with n = 8.', '(8 − 2) × 180 = 6 × 180 = 1080.', 'Answer: 1080'],
    },
    {
      q: 'What is the sum of the interior angles of a nonagon (9 sides)?',
      a: '1260',
      steps: ['Use (n − 2) × 180 with n = 9.', '(9 − 2) × 180 = 7 × 180 = 1260.', 'Answer: 1260'],
    },
    {
      q: 'What is the sum of the interior angles of a decagon (10 sides)?',
      a: '1440',
      steps: ['Use (n − 2) × 180 with n = 10.', '(10 − 2) × 180 = 8 × 180 = 1440.', 'Answer: 1440'],
    },
    {
      q: 'What is the sum of the interior angles of a polygon with 11 sides?',
      a: '1620',
      steps: ['Use (n − 2) × 180 with n = 11.', '(11 − 2) × 180 = 9 × 180 = 1620.', 'Answer: 1620'],
    },
    {
      q: 'What is the sum of the interior angles of a dodecagon (12 sides)?',
      a: '1800',
      steps: [
        'Use (n − 2) × 180 with n = 12.',
        '(12 − 2) × 180 = 10 × 180 = 1800.',
        'Answer: 1800',
      ],
    },
    {
      q: 'What is the sum of the interior angles of a polygon with 13 sides?',
      a: '1980',
      steps: [
        'Use (n − 2) × 180 with n = 13.',
        '(13 − 2) × 180 = 11 × 180 = 1980.',
        'Answer: 1980',
      ],
    },
    {
      q: 'A triangle has angles 40°, 75° and x°. What is x?',
      a: '65',
      steps: [
        'The angles of a triangle add up to (3 − 2) × 180 = 180°.',
        'x = 180 − 115 = 65.',
        'Answer: 65',
      ],
    },
    {
      q: 'A triangle has angles 60°, 50° and x°. What is x?',
      a: '70',
      steps: [
        'The angles of a triangle add up to (3 − 2) × 180 = 180°.',
        'x = 180 − 110 = 70.',
        'Answer: 70',
      ],
    },
    {
      q: 'A triangle has angles 55°, 70° and x°. What is x?',
      a: '55',
      steps: [
        'The angles of a triangle add up to (3 − 2) × 180 = 180°.',
        'x = 180 − 125 = 55.',
        'Answer: 55',
      ],
    },
    {
      q: 'A triangle has angles 50°, 55° and x°. What is x?',
      a: '75',
      steps: [
        'The angles of a triangle add up to (3 − 2) × 180 = 180°.',
        'x = 180 − 105 = 75.',
        'Answer: 75',
      ],
    },
    {
      q: 'A quadrilateral has angles 75°, 65°, 105° and x°. What is x?',
      a: '115',
      steps: [
        'The angles of a quadrilateral add up to (4 − 2) × 180 = 360°.',
        'x = 360 − 245 = 115.',
        'Answer: 115',
      ],
    },
    {
      q: 'A quadrilateral has angles 65°, 105°, 75° and x°. What is x?',
      a: '115',
      steps: [
        'The angles of a quadrilateral add up to (4 − 2) × 180 = 360°.',
        'x = 360 − 245 = 115.',
        'Answer: 115',
      ],
    },
    {
      q: 'A quadrilateral has angles 75°, 90°, 85° and x°. What is x?',
      a: '110',
      steps: [
        'The angles of a quadrilateral add up to (4 − 2) × 180 = 360°.',
        'x = 360 − 250 = 110.',
        'Answer: 110',
      ],
    },
    {
      q: 'A quadrilateral has angles 65°, 85°, 115° and x°. What is x?',
      a: '95',
      steps: [
        'The angles of a quadrilateral add up to (4 − 2) × 180 = 360°.',
        'x = 360 − 265 = 95.',
        'Answer: 95',
      ],
    },
    {
      q: 'Every angle of a regular pentagon is equal. How big is one angle?',
      a: '108',
      steps: ['The angles add up to (5 − 2) × 180 = 540°.', '540 ÷ 5 = 108°.', 'Answer: 108'],
    },
    {
      q: 'Every angle of a regular hexagon is equal. How big is one angle?',
      a: '120',
      steps: ['The angles add up to (6 − 2) × 180 = 720°.', '720 ÷ 6 = 120°.', 'Answer: 120'],
    },
    {
      q: 'Every angle of a regular octagon is equal. How big is one angle?',
      a: '135',
      steps: ['The angles add up to (8 − 2) × 180 = 1080°.', '1080 ÷ 8 = 135°.', 'Answer: 135'],
    },
    {
      q: 'Every angle of a regular nonagon is equal. How big is one angle?',
      a: '140',
      steps: ['The angles add up to (9 − 2) × 180 = 1260°.', '1260 ÷ 9 = 140°.', 'Answer: 140'],
    },
    {
      q: 'Every angle of a regular decagon is equal. How big is one angle?',
      a: '144',
      steps: ['The angles add up to (10 − 2) × 180 = 1440°.', '1440 ÷ 10 = 144°.', 'Answer: 144'],
    },
    {
      q: 'Every angle of a regular dodecagon is equal. How big is one angle?',
      a: '150',
      steps: ['The angles add up to (12 − 2) × 180 = 1800°.', '1800 ÷ 12 = 150°.', 'Answer: 150'],
    },
    {
      q: 'A hexagon has angles 125°, 120°, 110°, 115°, 120° and x°. What is x?',
      a: '130',
      steps: [
        'The angles of a hexagon add up to (6 − 2) × 180 = 720°.',
        'x = 720 − 590 = 130.',
        'Answer: 130',
      ],
    },
    {
      q: 'A pentagon has angles 110°, 105°, 105°, 115° and x°. What is x?',
      a: '105',
      steps: [
        'The angles of a pentagon add up to (5 − 2) × 180 = 540°.',
        'x = 540 − 435 = 105.',
        'Answer: 105',
      ],
    },
    {
      q: 'A hexagon has angles 140°, 125°, 125°, 80°, 90° and x°. What is x?',
      a: '160',
      steps: [
        'The angles of a hexagon add up to (6 − 2) × 180 = 720°.',
        'x = 720 − 560 = 160.',
        'Answer: 160',
      ],
    },
    {
      q: 'A hexagon has angles 125°, 95°, 125°, 125°, 120° and x°. What is x?',
      a: '130',
      steps: [
        'The angles of a hexagon add up to (6 − 2) × 180 = 720°.',
        'x = 720 − 590 = 130.',
        'Answer: 130',
      ],
    },
    {
      q: 'A pentagon has angles 85°, 110°, 105°, 120° and x°. What is x?',
      a: '120',
      steps: [
        'The angles of a pentagon add up to (5 − 2) × 180 = 540°.',
        'x = 540 − 420 = 120.',
        'Answer: 120',
      ],
    },
    {
      q: 'A pentagon has angles 105°, 95°, 85°, 125° and x°. What is x?',
      a: '130',
      steps: [
        'The angles of a pentagon add up to (5 − 2) × 180 = 540°.',
        'x = 540 − 410 = 130.',
        'Answer: 130',
      ],
    },
    {
      q: 'The interior angles of a polygon add up to 1620°. How many sides does it have?',
      a: '11',
      steps: ['Solve (n − 2) × 180 = 1620.', 'n − 2 = 1620 ÷ 180 = 9, so n = 11.', 'Answer: 11'],
    },
    {
      q: 'The interior angles of a polygon add up to 1800°. How many sides does it have?',
      a: '12',
      steps: ['Solve (n − 2) × 180 = 1800.', 'n − 2 = 1800 ÷ 180 = 10, so n = 12.', 'Answer: 12'],
    },
    {
      q: 'The interior angles of a polygon add up to 1080°. How many sides does it have?',
      a: '8',
      steps: ['Solve (n − 2) × 180 = 1080.', 'n − 2 = 1080 ÷ 180 = 6, so n = 8.', 'Answer: 8'],
    },
    {
      q: 'The interior angles of a polygon add up to 2160°. How many sides does it have?',
      a: '14',
      steps: ['Solve (n − 2) × 180 = 2160.', 'n − 2 = 2160 ÷ 180 = 12, so n = 14.', 'Answer: 14'],
    },
    {
      q: 'The interior angles of a polygon add up to 1440°. How many sides does it have?',
      a: '10',
      steps: ['Solve (n − 2) × 180 = 1440.', 'n − 2 = 1440 ÷ 180 = 8, so n = 10.', 'Answer: 10'],
    },
    {
      q: 'The interior angles of a polygon add up to 1980°. How many sides does it have?',
      a: '13',
      steps: ['Solve (n − 2) × 180 = 1980.', 'n − 2 = 1980 ÷ 180 = 11, so n = 13.', 'Answer: 13'],
    },
    {
      q: 'The angles of a triangle are (3x + 5)°, (3x + 11)°, (4x + 4)°. What is the largest angle?',
      a: '68',
      steps: [
        'The angles of a triangle add up to (3 − 2) × 180 = 180°.',
        '3x + 5 + 3x + 11 + 4x + 4 = 180, so 10x + 20 = 180 and x = 16.',
        'The angles are 53°, 59°, 68°; the largest is 68°.',
        'Answer: 68',
      ],
    },
    {
      q: 'The angles of a triangle are (4x − 3)°, (2x + 15)°, (x − 7)°. What is the largest angle?',
      a: '97',
      steps: [
        'The angles of a triangle add up to (3 − 2) × 180 = 180°.',
        '4x − 3 + 2x + 15 + x − 7 = 180, so 7x + 5 = 180 and x = 25.',
        'The angles are 97°, 65°, 18°; the largest is 97°.',
        'Answer: 97',
      ],
    },
    {
      q: 'The angles of a triangle are (3x − 10)°, (4x − 10)°, (2x + 11)°. What is the largest angle?',
      a: '74',
      steps: [
        'The angles of a triangle add up to (3 − 2) × 180 = 180°.',
        '3x − 10 + 4x − 10 + 2x + 11 = 180, so 9x − 9 = 180 and x = 21.',
        'The angles are 53°, 74°, 53°; the largest is 74°.',
        'Answer: 74',
      ],
    },
    {
      q: 'The angles of a triangle are (x + 7)°, (x − 1)°, (2x − 6)°. What is the largest angle?',
      a: '84',
      steps: [
        'The angles of a triangle add up to (3 − 2) × 180 = 180°.',
        'x + 7 + x − 1 + 2x − 6 = 180, so 4x + 0 = 180 and x = 45.',
        'The angles are 52°, 44°, 84°; the largest is 84°.',
        'Answer: 84',
      ],
    },
    {
      q: 'The angles of a quadrilateral are (5x + 10)°, (4x + 1)°, (4x − 3)°, (4x + 12)°. What is the largest angle?',
      a: '110',
      steps: [
        'The angles of a quadrilateral add up to (4 − 2) × 180 = 360°.',
        '5x + 10 + 4x + 1 + 4x − 3 + 4x + 12 = 360, so 17x + 20 = 360 and x = 20.',
        'The angles are 110°, 81°, 77°, 92°; the largest is 110°.',
        'Answer: 110',
      ],
    },
    {
      q: 'The angles of a quadrilateral are (3x + 12)°, (4x + 14)°, (x + 5)°, (x + 5)°. What is the largest angle?',
      a: '158',
      steps: [
        'The angles of a quadrilateral add up to (4 − 2) × 180 = 360°.',
        '3x + 12 + 4x + 14 + x + 5 + x + 5 = 360, so 9x + 36 = 360 and x = 36.',
        'The angles are 120°, 158°, 41°, 41°; the largest is 158°.',
        'Answer: 158',
      ],
    },
    {
      q: 'The angles of a quadrilateral are (x − 9)°, (2x − 4)°, (4x + 5)°, (3x + 8)°. What is the largest angle?',
      a: '149',
      steps: [
        'The angles of a quadrilateral add up to (4 − 2) × 180 = 360°.',
        'x − 9 + 2x − 4 + 4x + 5 + 3x + 8 = 360, so 10x + 0 = 360 and x = 36.',
        'The angles are 27°, 68°, 149°, 116°; the largest is 149°.',
        'Answer: 149',
      ],
    },
    {
      q: 'The angles of a quadrilateral are (4x + 15)°, (x + 8)°, (3x − 6)°, (3x + 13)°. What is the largest angle?',
      a: '135',
      steps: [
        'The angles of a quadrilateral add up to (4 − 2) × 180 = 360°.',
        '4x + 15 + x + 8 + 3x − 6 + 3x + 13 = 360, so 11x + 30 = 360 and x = 30.',
        'The angles are 135°, 38°, 84°, 103°; the largest is 135°.',
        'Answer: 135',
      ],
    },
    {
      q: 'Every angle of a regular polygon measures 140°. How many sides does it have?',
      a: '9',
      steps: [
        'The angles add up to (n − 2) × 180 and each is 140°, so (n − 2) × 180 = 140n.',
        '180n − 360 = 140n, so 40n = 360 and n = 9.',
        'Answer: 9',
      ],
    },
    {
      q: 'Every angle of a regular polygon measures 135°. How many sides does it have?',
      a: '8',
      steps: [
        'The angles add up to (n − 2) × 180 and each is 135°, so (n − 2) × 180 = 135n.',
        '180n − 360 = 135n, so 45n = 360 and n = 8.',
        'Answer: 8',
      ],
    },
    {
      q: 'Every angle of a regular polygon measures 150°. How many sides does it have?',
      a: '12',
      steps: [
        'The angles add up to (n − 2) × 180 and each is 150°, so (n − 2) × 180 = 150n.',
        '180n − 360 = 150n, so 30n = 360 and n = 12.',
        'Answer: 12',
      ],
    },
    {
      q: 'Every angle of a regular polygon measures 120°. How many sides does it have?',
      a: '6',
      steps: [
        'The angles add up to (n − 2) × 180 and each is 120°, so (n − 2) × 180 = 120n.',
        '180n − 360 = 120n, so 60n = 360 and n = 6.',
        'Answer: 6',
      ],
    },
    {
      q: 'A octagon has angles 140°, 100°, 160°, 105°, 155°, 115°, 130° and x°. What is x?',
      a: '175',
      steps: [
        'The angles of a octagon add up to (8 − 2) × 180 = 1080°.',
        'x = 1080 − 905 = 175.',
        'Answer: 175',
      ],
    },
    {
      q: 'A octagon has angles 150°, 150°, 145°, 140°, 105°, 145°, 90° and x°. What is x?',
      a: '155',
      steps: [
        'The angles of a octagon add up to (8 − 2) × 180 = 1080°.',
        'x = 1080 − 925 = 155.',
        'Answer: 155',
      ],
    },
    {
      q: 'A heptagon has angles 115°, 140°, 140°, 140°, 95°, 135° and x°. What is x?',
      a: '135',
      steps: [
        'The angles of a heptagon add up to (7 − 2) × 180 = 900°.',
        'x = 900 − 765 = 135.',
        'Answer: 135',
      ],
    },
    {
      q: 'A heptagon has angles 140°, 100°, 150°, 125°, 110°, 150° and x°. What is x?',
      a: '125',
      steps: [
        'The angles of a heptagon add up to (7 − 2) × 180 = 900°.',
        'x = 900 − 775 = 125.',
        'Answer: 125',
      ],
    },
  ],
  words: [
    {
      q: 'Angles R and S are complementary. ∠R = (3x − 5)° and ∠S = (3x + 17)°. What is ∠R?',
      a: '34',
      steps: [
        'Complementary angles add up to 90°.',
        '(3x − 5) + (3x + 17) = 90',
        '6x + 12 = 90, so 6x = 78 and x = 13.',
        '∠R = 3(13) − 5 = 34°.',
        'Answer: 34',
      ],
    },
    {
      q: 'Angles R and S are complementary. ∠R = (6x − 17)° and ∠S = (3x − 1)°. What is ∠S?',
      a: '35',
      steps: [
        'Complementary angles add up to 90°.',
        '(6x − 17) + (3x − 1) = 90',
        '9x − 18 = 90, so 9x = 108 and x = 12.',
        '∠S = 3(12) − 1 = 35°.',
        'Answer: 35',
      ],
    },
    {
      q: 'Angles R and S are complementary. ∠R = (6x + 17)° and ∠S = (4x − 17)°. What is ∠R?',
      a: '71',
      steps: [
        'Complementary angles add up to 90°.',
        '(6x + 17) + (4x − 17) = 90',
        '10x + 0 = 90, so 10x = 90 and x = 9.',
        '∠R = 6(9) + 17 = 71°.',
        'Answer: 71',
      ],
    },
    {
      q: 'Angles R and S are complementary. ∠R = (7x − 21)° and ∠S = (5x − 9)°. What is ∠R?',
      a: '49',
      steps: [
        'Complementary angles add up to 90°.',
        '(7x − 21) + (5x − 9) = 90',
        '12x − 30 = 90, so 12x = 120 and x = 10.',
        '∠R = 7(10) − 21 = 49°.',
        'Answer: 49',
      ],
    },
    {
      q: 'Angles R and S are complementary. ∠R = (8x + 15)° and ∠S = (3x + 20)°. What is ∠R?',
      a: '55',
      steps: [
        'Complementary angles add up to 90°.',
        '(8x + 15) + (3x + 20) = 90',
        '11x + 35 = 90, so 11x = 55 and x = 5.',
        '∠R = 8(5) + 15 = 55°.',
        'Answer: 55',
      ],
    },
    {
      q: 'Angles R and S are complementary. ∠R = (3x − 11)° and ∠S = (7x + 21)°. What is ∠R?',
      a: '13',
      steps: [
        'Complementary angles add up to 90°.',
        '(3x − 11) + (7x + 21) = 90',
        '10x + 10 = 90, so 10x = 80 and x = 8.',
        '∠R = 3(8) − 11 = 13°.',
        'Answer: 13',
      ],
    },
    {
      q: 'Angles R and S are complementary. ∠R = (4x + 15)° and ∠S = (8x + 15)°. What is ∠R?',
      a: '35',
      steps: [
        'Complementary angles add up to 90°.',
        '(4x + 15) + (8x + 15) = 90',
        '12x + 30 = 90, so 12x = 60 and x = 5.',
        '∠R = 4(5) + 15 = 35°.',
        'Answer: 35',
      ],
    },
    {
      q: 'Angles R and S are complementary. ∠R = (7x − 24)° and ∠S = (7x + 30)°. What is ∠R?',
      a: '18',
      steps: [
        'Complementary angles add up to 90°.',
        '(7x − 24) + (7x + 30) = 90',
        '14x + 6 = 90, so 14x = 84 and x = 6.',
        '∠R = 7(6) − 24 = 18°.',
        'Answer: 18',
      ],
    },
    {
      q: 'Angles X and Y are supplementary. ∠X = (3x + 11)° and ∠Y = (7x − 11)°. What is ∠Y?',
      a: '115',
      steps: [
        'Supplementary angles add up to 180°.',
        '(3x + 11) + (7x − 11) = 180',
        '10x + 0 = 180, so 10x = 180 and x = 18.',
        '∠Y = 7(18) − 11 = 115°.',
        'Answer: 115',
      ],
    },
    {
      q: 'Angles X and Y are supplementary. ∠X = (8x − 24)° and ∠Y = (6x + 36)°. What is ∠X?',
      a: '72',
      steps: [
        'Supplementary angles add up to 180°.',
        '(8x − 24) + (6x + 36) = 180',
        '14x + 12 = 180, so 14x = 168 and x = 12.',
        '∠X = 8(12) − 24 = 72°.',
        'Answer: 72',
      ],
    },
    {
      q: 'Angles X and Y are supplementary. ∠X = (3x + 18)° and ∠Y = (6x + 18)°. What is ∠X?',
      a: '66',
      steps: [
        'Supplementary angles add up to 180°.',
        '(3x + 18) + (6x + 18) = 180',
        '9x + 36 = 180, so 9x = 144 and x = 16.',
        '∠X = 3(16) + 18 = 66°.',
        'Answer: 66',
      ],
    },
    {
      q: 'Angles X and Y are supplementary. ∠X = (4x + 1)° and ∠Y = (7x + 3)°. What is ∠Y?',
      a: '115',
      steps: [
        'Supplementary angles add up to 180°.',
        '(4x + 1) + (7x + 3) = 180',
        '11x + 4 = 180, so 11x = 176 and x = 16.',
        '∠Y = 7(16) + 3 = 115°.',
        'Answer: 115',
      ],
    },
    {
      q: 'Angles X and Y are supplementary. ∠X = (6x + 1)° and ∠Y = (6x − 13)°. What is ∠X?',
      a: '97',
      steps: [
        'Supplementary angles add up to 180°.',
        '(6x + 1) + (6x − 13) = 180',
        '12x − 12 = 180, so 12x = 192 and x = 16.',
        '∠X = 6(16) + 1 = 97°.',
        'Answer: 97',
      ],
    },
    {
      q: 'Angles X and Y are supplementary. ∠X = (7x + 11)° and ∠Y = (5x + 1)°. What is ∠X?',
      a: '109',
      steps: [
        'Supplementary angles add up to 180°.',
        '(7x + 11) + (5x + 1) = 180',
        '12x + 12 = 180, so 12x = 168 and x = 14.',
        '∠X = 7(14) + 11 = 109°.',
        'Answer: 109',
      ],
    },
    {
      q: 'Angles X and Y are supplementary. ∠X = (2x − 21)° and ∠Y = (9x + 36)°. What is ∠Y?',
      a: '171',
      steps: [
        'Supplementary angles add up to 180°.',
        '(2x − 21) + (9x + 36) = 180',
        '11x + 15 = 180, so 11x = 165 and x = 15.',
        '∠Y = 9(15) + 36 = 171°.',
        'Answer: 171',
      ],
    },
    {
      q: 'Angles X and Y are supplementary. ∠X = (8x − 23)° and ∠Y = (4x + 35)°. What is ∠Y?',
      a: '91',
      steps: [
        'Supplementary angles add up to 180°.',
        '(8x − 23) + (4x + 35) = 180',
        '12x + 12 = 180, so 12x = 168 and x = 14.',
        '∠Y = 4(14) + 35 = 91°.',
        'Answer: 91',
      ],
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠7 = (4x + 29)° and ∠6 = (9x − 16)°. What is x?',
      a: '9',
      steps: [
        '∠7 and ∠6 are vertical angles, so they are equal.',
        '4x + 29 = 9x − 16',
        '−5x = −45, so x = 9.',
        'Answer: 9',
      ],
      fig: {
        kind: 'transversal',
        angle: 65,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠7 = (4x + 55)° and ∠6 = (7x − 5)°. What is x?',
      a: '20',
      steps: [
        '∠7 and ∠6 are vertical angles, so they are equal.',
        '4x + 55 = 7x − 5',
        '−3x = −60, so x = 20.',
        'Answer: 20',
      ],
      fig: {
        kind: 'transversal',
        angle: 135,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠1 = (6x − 13)° and ∠4 = (4x + 33)°. What is x?',
      a: '23',
      steps: [
        '∠1 and ∠4 are vertical angles, so they are equal.',
        '6x − 13 = 4x + 33',
        '2x = 46, so x = 23.',
        'Answer: 23',
      ],
      fig: {
        kind: 'transversal',
        angle: 55,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = (4x + 51)° and ∠5 = (7x − 12)°. What is x?',
      a: '21',
      steps: [
        '∠8 and ∠5 are vertical angles, so they are equal.',
        '4x + 51 = 7x − 12',
        '−3x = −63, so x = 21.',
        'Answer: 21',
      ],
      fig: {
        kind: 'transversal',
        angle: 45,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠6 = (9x + 18)° and ∠7 = (7x + 44)°. What is x?',
      a: '13',
      steps: [
        '∠6 and ∠7 are vertical angles, so they are equal.',
        '9x + 18 = 7x + 44',
        '2x = 26, so x = 13.',
        'Answer: 13',
      ],
      fig: {
        kind: 'transversal',
        angle: 135,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠6 = (6x + 3)° and ∠7 = (4x + 47)°. What is x?',
      a: '22',
      steps: [
        '∠6 and ∠7 are vertical angles, so they are equal.',
        '6x + 3 = 4x + 47',
        '2x = 44, so x = 22.',
        'Answer: 22',
      ],
      fig: {
        kind: 'transversal',
        angle: 135,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠4 = (6x + 35)° and ∠6 = (4x − 5)°. What is ∠4?',
      a: '125',
      steps: [
        '∠4 and ∠6 are consecutive (same-side) interior angles, so they add up to 180°.',
        '(6x + 35) + (4x − 5) = 180',
        '10x + 30 = 180, so 10x = 150 and x = 15.',
        '∠4 = 6(15) + 35 = 125°.',
        'Answer: 125',
      ],
      fig: {
        kind: 'transversal',
        angle: 55,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠5 = (6x − 11)° and ∠3 = (7x + 48)°. What is ∠3?',
      a: '125',
      steps: [
        '∠5 and ∠3 are consecutive (same-side) interior angles, so they add up to 180°.',
        '(6x − 11) + (7x + 48) = 180',
        '13x + 37 = 180, so 13x = 143 and x = 11.',
        '∠3 = 7(11) + 48 = 125°.',
        'Answer: 125',
      ],
      fig: {
        kind: 'transversal',
        angle: 125,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠5 = (2x + 23)° and ∠3 = (7x + 13)°. What is ∠3?',
      a: '125',
      steps: [
        '∠5 and ∠3 are consecutive (same-side) interior angles, so they add up to 180°.',
        '(2x + 23) + (7x + 13) = 180',
        '9x + 36 = 180, so 9x = 144 and x = 16.',
        '∠3 = 7(16) + 13 = 125°.',
        'Answer: 125',
      ],
      fig: {
        kind: 'transversal',
        angle: 125,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠6 = (3x + 14)° and ∠4 = (7x − 54)°. What is ∠6?',
      a: '80',
      steps: [
        '∠6 and ∠4 are consecutive (same-side) interior angles, so they add up to 180°.',
        '(3x + 14) + (7x − 54) = 180',
        '10x − 40 = 180, so 10x = 220 and x = 22.',
        '∠6 = 3(22) + 14 = 80°.',
        'Answer: 80',
      ],
      fig: {
        kind: 'transversal',
        angle: 80,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠4 = (6x − 27)° and ∠6 = (x + 53)°. What is ∠6?',
      a: '75',
      steps: [
        '∠4 and ∠6 are consecutive (same-side) interior angles, so they add up to 180°.',
        '(6x − 27) + (x + 53) = 180',
        '7x + 26 = 180, so 7x = 154 and x = 22.',
        '∠6 = 1(22) + 53 = 75°.',
        'Answer: 75',
      ],
      fig: {
        kind: 'transversal',
        angle: 75,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠5 = (8x − 9)° and ∠3 = (2x + 9)°. What is ∠3?',
      a: '45',
      steps: [
        '∠5 and ∠3 are consecutive (same-side) interior angles, so they add up to 180°.',
        '(8x − 9) + (2x + 9) = 180',
        '10x + 0 = 180, so 10x = 180 and x = 18.',
        '∠3 = 2(18) + 9 = 45°.',
        'Answer: 45',
      ],
      fig: {
        kind: 'transversal',
        angle: 45,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = (x + 33)° and ∠1 = (5x − 55)°. What is ∠1?',
      a: '55',
      steps: [
        '∠8 and ∠1 are alternate exterior angles, so they are equal.',
        'x + 33 = 5x − 55',
        '−4x = −88, so x = 22.',
        '∠1 = 5(22) − 55 = 55°.',
        'Answer: 55',
      ],
      fig: {
        kind: 'transversal',
        angle: 125,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠2 = (7x − 18)° and ∠7 = (8x − 32)°. What is ∠7?',
      a: '80',
      steps: [
        '∠2 and ∠7 are alternate exterior angles, so they are equal.',
        '7x − 18 = 8x − 32',
        '−1x = −14, so x = 14.',
        '∠7 = 8(14) − 32 = 80°.',
        'Answer: 80',
      ],
      fig: {
        kind: 'transversal',
        angle: 80,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠2 = (7x − 12)° and ∠7 = (5x + 10)°. What is ∠7?',
      a: '65',
      steps: [
        '∠2 and ∠7 are alternate exterior angles, so they are equal.',
        '7x − 12 = 5x + 10',
        '2x = 22, so x = 11.',
        '∠7 = 5(11) + 10 = 65°.',
        'Answer: 65',
      ],
      fig: {
        kind: 'transversal',
        angle: 65,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠7 = (7x + 16)° and ∠2 = (5x + 30)°. What is ∠7?',
      a: '65',
      steps: [
        '∠7 and ∠2 are alternate exterior angles, so they are equal.',
        '7x + 16 = 5x + 30',
        '2x = 14, so x = 7.',
        '∠7 = 7(7) + 16 = 65°.',
        'Answer: 65',
      ],
      fig: {
        kind: 'transversal',
        angle: 65,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠1 = (8x − 8)° and ∠8 = (4x + 56)°. What is ∠8?',
      a: '120',
      steps: [
        '∠1 and ∠8 are alternate exterior angles, so they are equal.',
        '8x − 8 = 4x + 56',
        '4x = 64, so x = 16.',
        '∠8 = 4(16) + 56 = 120°.',
        'Answer: 120',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠1 = (7x + 29)° and ∠8 = (8x + 16)°. What is ∠1?',
      a: '120',
      steps: [
        '∠1 and ∠8 are alternate exterior angles, so they are equal.',
        '7x + 29 = 8x + 16',
        '−1x = −13, so x = 13.',
        '∠1 = 7(13) + 29 = 120°.',
        'Answer: 120',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠6 = (2x + 19)° and ∠5 = (7x − 1)°. What is ∠5?',
      a: '125',
      steps: [
        '∠6 and ∠5 are a linear pair (they form a straight line), so they add up to 180°.',
        '(2x + 19) + (7x − 1) = 180',
        '9x + 18 = 180, so 9x = 162 and x = 18.',
        '∠5 = 7(18) − 1 = 125°.',
        'Answer: 125',
      ],
      fig: {
        kind: 'transversal',
        angle: 55,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = (4x − 21)° and ∠6 = (2x + 57)°. What is ∠6?',
      a: '105',
      steps: [
        '∠8 and ∠6 are a linear pair (they form a straight line), so they add up to 180°.',
        '(4x − 21) + (2x + 57) = 180',
        '6x + 36 = 180, so 6x = 144 and x = 24.',
        '∠6 = 2(24) + 57 = 105°.',
        'Answer: 105',
      ],
      fig: {
        kind: 'transversal',
        angle: 105,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠3 = (7x − 13)° and ∠1 = (9x + 49)°. What is ∠3?',
      a: '50',
      steps: [
        '∠3 and ∠1 are a linear pair (they form a straight line), so they add up to 180°.',
        '(7x − 13) + (9x + 49) = 180',
        '16x + 36 = 180, so 16x = 144 and x = 9.',
        '∠3 = 7(9) − 13 = 50°.',
        'Answer: 50',
      ],
      fig: {
        kind: 'transversal',
        angle: 50,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠2 = (6x + 35)° and ∠1 = (5x − 20)°. What is ∠2?',
      a: '125',
      steps: [
        '∠2 and ∠1 are a linear pair (they form a straight line), so they add up to 180°.',
        '(6x + 35) + (5x − 20) = 180',
        '11x + 15 = 180, so 11x = 165 and x = 15.',
        '∠2 = 6(15) + 35 = 125°.',
        'Answer: 125',
      ],
      fig: {
        kind: 'transversal',
        angle: 125,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠6 = (6x + 6)° and ∠5 = (x + 41)°. What is ∠5?',
      a: '60',
      steps: [
        '∠6 and ∠5 are a linear pair (they form a straight line), so they add up to 180°.',
        '(6x + 6) + (x + 41) = 180',
        '7x + 47 = 180, so 7x = 133 and x = 19.',
        '∠5 = 1(19) + 41 = 60°.',
        'Answer: 60',
      ],
      fig: {
        kind: 'transversal',
        angle: 120,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠1 = (5x − 30)° and ∠5 = (4x − 15)°. What is ∠1?',
      a: '45',
      steps: [
        '∠1 and ∠5 are corresponding angles, so they are equal.',
        '5x − 30 = 4x − 15',
        '1x = 15, so x = 15.',
        '∠1 = 5(15) − 30 = 45°.',
        'Answer: 45',
      ],
      fig: {
        kind: 'transversal',
        angle: 135,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠2 = (8x − 39)° and ∠3 = (9x − 57)°. What is ∠3?',
      a: '105',
      steps: [
        '∠2 and ∠3 are vertical angles, so they are equal.',
        '8x − 39 = 9x − 57',
        '−1x = −18, so x = 18.',
        '∠3 = 9(18) − 57 = 105°.',
        'Answer: 105',
      ],
      fig: {
        kind: 'transversal',
        angle: 105,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠6 = (x + 38)° and ∠5 = (9x − 28)°. What is ∠6?',
      a: '55',
      steps: [
        '∠6 and ∠5 are a linear pair (they form a straight line), so they add up to 180°.',
        '(x + 38) + (9x − 28) = 180',
        '10x + 10 = 180, so 10x = 170 and x = 17.',
        '∠6 = 1(17) + 38 = 55°.',
        'Answer: 55',
      ],
      fig: {
        kind: 'transversal',
        angle: 55,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'Two lines cross. One angle measures 71°, the angle vertical to it is (y + 12)°, and an angle next to it is (2x + 5)°. What is x + y?',
      a: '111',
      steps: [
        'Vertical angles are equal: y + 12 = 71, so y = 59.',
        'The angle next to it forms a linear pair with the 71° angle: 71 + (2x + 5) = 180.',
        '2x = 104, so x = 52.',
        'x + y = 52 + 59 = 111.',
        'Answer: 111',
      ],
    },
    {
      q: 'Two lines cross. One angle measures 37°, the angle vertical to it is (y + 10)°, and an angle next to it is (2x + 10)°. What is x + y?',
      a: '93.5',
      form: 'decimal',
      steps: [
        'Vertical angles are equal: y + 10 = 37, so y = 27.',
        'The angle next to it forms a linear pair with the 37° angle: 37 + (2x + 10) = 180.',
        '2x = 133, so x = 66.5.',
        'x + y = 66.5 + 27 = 93.5.',
        'Answer: 93.5',
      ],
    },
    {
      q: 'Two lines cross. One angle measures 34°, the angle vertical to it is (y + 3)°, and an angle next to it is (4x + 4)°. What is x + y?',
      a: '66.5',
      form: 'decimal',
      steps: [
        'Vertical angles are equal: y + 3 = 34, so y = 31.',
        'The angle next to it forms a linear pair with the 34° angle: 34 + (4x + 4) = 180.',
        '4x = 142, so x = 35.5.',
        'x + y = 35.5 + 31 = 66.5.',
        'Answer: 66.5',
      ],
    },
    {
      q: 'Two lines cross. One angle measures 42°, the angle vertical to it is (y + 4)°, and an angle next to it is (2x + 4)°. What is x + y?',
      a: '105',
      steps: [
        'Vertical angles are equal: y + 4 = 42, so y = 38.',
        'The angle next to it forms a linear pair with the 42° angle: 42 + (2x + 4) = 180.',
        '2x = 134, so x = 67.',
        'x + y = 67 + 38 = 105.',
        'Answer: 105',
      ],
    },
    {
      q: 'A, B and C lie on a straight line and D is off it. ∠ABD = (7x + 5)° and ∠DBC = (8x + 10)°. What is ∠DBC?',
      a: '98',
      steps: [
        '∠ABD + ∠DBC = 180° because they make a straight line.',
        '(7x + 5) + (8x + 10) = 180, so 15x + 15 = 180 and x = 11.',
        '∠DBC = 8(11) + 10 = 98°.',
        'Answer: 98',
      ],
    },
    {
      q: '∠ABC is a right angle and D is inside it. ∠ABD = (5x − 2)° and ∠DBC = (11x + 28)°. What is ∠ABD?',
      a: '18',
      steps: [
        '∠ABD + ∠DBC = ∠ABC = 90°.',
        '(5x − 2) + (11x + 28) = 90, so 16x + 26 = 90 and x = 4.',
        '∠ABD = 5(4) − 2 = 18°.',
        'Answer: 18',
      ],
    },
    {
      q: '∠ABC is a right angle and D is inside it. ∠ABD = (4x − 13)° and ∠DBC = (8x − 5)°. What is ∠ABD?',
      a: '23',
      steps: [
        '∠ABD + ∠DBC = ∠ABC = 90°.',
        '(4x − 13) + (8x − 5) = 90, so 12x − 18 = 90 and x = 9.',
        '∠ABD = 4(9) − 13 = 23°.',
        'Answer: 23',
      ],
    },
    {
      q: 'A, B and C lie on a straight line and D is off it. ∠ABD = (11x + 11)° and ∠DBC = (5x − 23)°. What is ∠ABD?',
      a: '143',
      steps: [
        '∠ABD + ∠DBC = 180° because they make a straight line.',
        '(11x + 11) + (5x − 23) = 180, so 16x − 12 = 180 and x = 12.',
        '∠ABD = 11(12) + 11 = 143°.',
        'Answer: 143',
      ],
    },
  ],
  final: [
    {
      q: 'A line has a slope of 7/3. What is the slope of a line parallel to it?',
      a: '7/3',
      form: 'fraction',
      steps: ['Parallel lines have the same slope.', 'The slope is 7/3.', 'Answer: 7/3'],
    },
    {
      q: 'A line has a slope of −3/7. What is the slope of a line parallel to it?',
      a: '-3/7',
      form: 'fraction',
      steps: ['Parallel lines have the same slope.', 'The slope is −3/7.', 'Answer: −3/7'],
    },
    {
      q: 'A line has a slope of 3/7. What is the slope of a line perpendicular to it?',
      a: '-7/3',
      form: 'fraction',
      steps: [
        'For a perpendicular line, flip the fraction and change the sign.',
        '3/7 becomes −7/3.',
        'Answer: −7/3',
      ],
    },
    {
      q: 'A line has a slope of −1/4. What is the slope of a line perpendicular to it?',
      a: '4',
      steps: [
        'For a perpendicular line, flip the fraction and change the sign.',
        '−1/4 becomes 4.',
        'Answer: 4',
      ],
    },
    {
      q: 'What is the complement of a 33° angle?',
      a: '57',
      steps: ['Complementary angles add up to 90°.', '90° − 33° = 57°.', 'Answer: 57'],
    },
    {
      q: 'What is the complement of a 45° angle?',
      a: '45',
      steps: ['Complementary angles add up to 90°.', '90° − 45° = 45°.', 'Answer: 45'],
    },
    {
      q: 'What is the supplement of a 121° angle?',
      a: '59',
      steps: ['Supplementary angles add up to 180°.', '180° − 121° = 59°.', 'Answer: 59'],
    },
    {
      q: 'What is the supplement of a 104° angle?',
      a: '76',
      steps: ['Supplementary angles add up to 180°.', '180° − 104° = 76°.', 'Answer: 76'],
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠3 = 65°. What is ∠4?',
      a: '115',
      steps: [
        '∠3 and ∠4 are a linear pair (they form a straight line), so they add up to 180°: ∠4 = 180° − 65° = 115°.',
        'Answer: 115',
      ],
      fig: {
        kind: 'transversal',
        angle: 65,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠7 = 135°. What is ∠3?',
      a: '135',
      steps: ['∠7 and ∠3 are corresponding angles, so they are equal: ∠3 = 135°.', 'Answer: 135'],
      fig: {
        kind: 'transversal',
        angle: 135,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠2 = 130°. What is ∠1?',
      a: '50',
      steps: [
        '∠2 and ∠1 are a linear pair (they form a straight line), so they add up to 180°: ∠1 = 180° − 130° = 50°.',
        'Answer: 50',
      ],
      fig: {
        kind: 'transversal',
        angle: 130,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠6 = 35°. What is ∠7?',
      a: '35',
      steps: ['∠6 and ∠7 are vertical angles, so they are equal: ∠7 = 35°.', 'Answer: 35'],
      fig: {
        kind: 'transversal',
        angle: 35,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'Every angle of a regular polygon with 20 sides is equal. How big is one angle?',
      a: '162',
      steps: ['The angles add up to (20 − 2) × 180 = 3240°.', '3240 ÷ 20 = 162°.', 'Answer: 162'],
    },
    {
      q: 'Every angle of a regular polygon with 24 sides is equal. How big is one angle?',
      a: '165',
      steps: ['The angles add up to (24 − 2) × 180 = 3960°.', '3960 ÷ 24 = 165°.', 'Answer: 165'],
    },
    {
      q: 'Every angle of a regular polygon with 15 sides is equal. How big is one angle?',
      a: '156',
      steps: ['The angles add up to (15 − 2) × 180 = 2340°.', '2340 ÷ 15 = 156°.', 'Answer: 156'],
    },
    {
      q: 'Every angle of a regular polygon with 16 sides is equal. How big is one angle?',
      a: '157.5',
      form: 'decimal',
      steps: [
        'The angles add up to (16 − 2) × 180 = 2520°.',
        '2520 ÷ 16 = 157.5°.',
        'Answer: 157.5',
      ],
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠7 = (5x − 45)° and ∠8 = (7x − 39)°. What is ∠8?',
      a: '115',
      steps: [
        '∠7 and ∠8 are a linear pair (they form a straight line), so they add up to 180°.',
        '(5x − 45) + (7x − 39) = 180',
        '12x − 84 = 180, so 12x = 264 and x = 22.',
        '∠8 = 7(22) − 39 = 115°.',
        'Answer: 115',
      ],
      fig: {
        kind: 'transversal',
        angle: 65,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠1 = (5x − 5)° and ∠8 = (6x − 28)°. What is ∠8?',
      a: '110',
      steps: [
        '∠1 and ∠8 are alternate exterior angles, so they are equal.',
        '5x − 5 = 6x − 28',
        '−1x = −23, so x = 23.',
        '∠8 = 6(23) − 28 = 110°.',
        'Answer: 110',
      ],
      fig: {
        kind: 'transversal',
        angle: 70,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠2 = (7x + 17)° and ∠6 = (8x + 3)°. What is x?',
      a: '14',
      steps: [
        '∠2 and ∠6 are corresponding angles, so they are equal.',
        '7x + 17 = 8x + 3',
        '−1x = −14, so x = 14.',
        'Answer: 14',
      ],
      fig: {
        kind: 'transversal',
        angle: 115,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠3 = (4x + 30)° and ∠7 = (5x + 20)°. What is ∠3?',
      a: '70',
      steps: [
        '∠3 and ∠7 are corresponding angles, so they are equal.',
        '4x + 30 = 5x + 20',
        '−1x = −10, so x = 10.',
        '∠3 = 4(10) + 30 = 70°.',
        'Answer: 70',
      ],
      fig: {
        kind: 'transversal',
        angle: 70,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠6 = (4x + 34)° and ∠2 = (8x − 42)°. What is x?',
      a: '19',
      steps: [
        '∠6 and ∠2 are corresponding angles, so they are equal.',
        '4x + 34 = 8x − 42',
        '−4x = −76, so x = 19.',
        'Answer: 19',
      ],
      fig: {
        kind: 'transversal',
        angle: 110,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠3 = (5x − 5)° and ∠6 = (8x − 29)°. What is x?',
      a: '8',
      steps: [
        '∠3 and ∠6 are alternate interior angles, so they are equal.',
        '5x − 5 = 8x − 29',
        '−3x = −24, so x = 8.',
        'Answer: 8',
      ],
      fig: {
        kind: 'transversal',
        angle: 35,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'Angles X and Y are supplementary. ∠X = (5x − 8)° and ∠Y = (9x + 34)°. What is ∠X?',
      a: '47',
      steps: [
        'Supplementary angles add up to 180°.',
        '(5x − 8) + (9x + 34) = 180',
        '14x + 26 = 180, so 14x = 154 and x = 11.',
        '∠X = 5(11) − 8 = 47°.',
        'Answer: 47',
      ],
    },
    {
      q: 'Angles X and Y are supplementary. ∠X = (7x − 7)° and ∠Y = (5x + 7)°. What is x?',
      a: '15',
      steps: [
        'Supplementary angles add up to 180°.',
        '(7x − 7) + (5x + 7) = 180',
        '12x + 0 = 180, so 12x = 180 and x = 15.',
        'Answer: 15',
      ],
    },
    {
      q: 'Angles R and S are complementary. ∠R = (2x)° and ∠S = (9x + 35)°. What is x?',
      a: '5',
      steps: [
        'Complementary angles add up to 90°.',
        '(2x) + (9x + 35) = 90',
        '11x + 35 = 90, so 11x = 55 and x = 5.',
        'Answer: 5',
      ],
    },
    {
      q: 'Angles R and S are complementary. ∠R = (3x + 22)° and ∠S = (4x + 19)°. What is x?',
      a: '7',
      steps: [
        'Complementary angles add up to 90°.',
        '(3x + 22) + (4x + 19) = 90',
        '7x + 41 = 90, so 7x = 49 and x = 7.',
        'Answer: 7',
      ],
    },
    {
      q: 'The angles of a triangle are (5x + 9)°, (4x + 2)°, (3x + 1)°. What is the largest angle?',
      a: '79',
      steps: [
        'The angles of a triangle add up to (3 − 2) × 180 = 180°.',
        '5x + 9 + 4x + 2 + 3x + 1 = 180, so 12x + 12 = 180 and x = 14.',
        'The angles are 79°, 58°, 43°; the largest is 79°.',
        'Answer: 79',
      ],
    },
    {
      q: 'The angles of a quadrilateral are (2x − 3)°, (3x + 4)°, (5x − 1)°, (5x + 15)°. What is the largest angle?',
      a: '130',
      steps: [
        'The angles of a quadrilateral add up to (4 − 2) × 180 = 360°.',
        '2x − 3 + 3x + 4 + 5x − 1 + 5x + 15 = 360, so 15x + 15 = 360 and x = 23.',
        'The angles are 43°, 73°, 114°, 130°; the largest is 130°.',
        'Answer: 130',
      ],
    },
    {
      q: 'The angles of a triangle are (x + 1)°, (2x + 4)°, (2x + 15)°. What is the largest angle?',
      a: '79',
      steps: [
        'The angles of a triangle add up to (3 − 2) × 180 = 180°.',
        'x + 1 + 2x + 4 + 2x + 15 = 180, so 5x + 20 = 180 and x = 32.',
        'The angles are 33°, 68°, 79°; the largest is 79°.',
        'Answer: 79',
      ],
    },
    {
      q: 'The angles of a triangle are (5x + 11)°, (5x + 5)°, (4x + 10)°. What is the largest angle?',
      a: '66',
      steps: [
        'The angles of a triangle add up to (3 − 2) × 180 = 180°.',
        '5x + 11 + 5x + 5 + 4x + 10 = 180, so 14x + 26 = 180 and x = 11.',
        'The angles are 66°, 60°, 54°; the largest is 66°.',
        'Answer: 66',
      ],
    },
    {
      q: 'A line through (−1, −6) is parallel to y = 2x − 3. What is its y-intercept?',
      a: '-4',
      steps: [
        'A parallel line has the same slope: y = 2x + b.',
        'Put in the point: −6 = 2(−1) + b, so b = −6 − −2 = −4.',
        'Answer: −4',
      ],
    },
    {
      q: 'A line through (6, −2) is parallel to y = 5x + 1. What is its y-intercept?',
      a: '-32',
      steps: [
        'A parallel line has the same slope: y = 5x + b.',
        'Put in the point: −2 = 5(6) + b, so b = −2 − 30 = −32.',
        'Answer: −32',
      ],
    },
    {
      q: 'A line through (−2, 8) is perpendicular to y = 2x + 5. What is its y-intercept?',
      a: '7',
      steps: [
        'The slope of the given line is 2, so the perpendicular slope is −1/2.',
        'Put in the point: 8 = −1/2(−2) + b, so b = 8 − 1 = 7.',
        'Answer: 7',
      ],
    },
    {
      q: 'A line through (−3, 5) is parallel to y = 4x + 0. What is its y-intercept?',
      a: '17',
      steps: [
        'A parallel line has the same slope: y = 4x + b.',
        'Put in the point: 5 = 4(−3) + b, so b = 5 − −12 = 17.',
        'Answer: 17',
      ],
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠2 = 80°. What is ∠5?',
      a: '100',
      steps: [
        '∠2 and ∠1 are a linear pair (they form a straight line), so they add up to 180°: ∠1 = 180° − 80° = 100°.',
        '∠1 and ∠5 are corresponding angles, so they are equal: ∠5 = 100°.',
        'Answer: 100',
      ],
      fig: {
        kind: 'transversal',
        angle: 80,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠1 = 120°. What is ∠6?',
      a: '60',
      steps: [
        '∠1 and ∠2 are a linear pair (they form a straight line), so they add up to 180°: ∠2 = 180° − 120° = 60°.',
        '∠2 and ∠6 are corresponding angles, so they are equal: ∠6 = 60°.',
        'Answer: 60',
      ],
      fig: {
        kind: 'transversal',
        angle: 60,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠3 = 40°. What is ∠8?',
      a: '140',
      steps: [
        '∠3 and ∠1 are a linear pair (they form a straight line), so they add up to 180°: ∠1 = 180° − 40° = 140°.',
        '∠1 and ∠8 are alternate exterior angles, so they are equal: ∠8 = 140°.',
        'Answer: 140',
      ],
      fig: {
        kind: 'transversal',
        angle: 40,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠2 = 75°. What is ∠5?',
      a: '105',
      steps: [
        '∠2 and ∠1 are a linear pair (they form a straight line), so they add up to 180°: ∠1 = 180° − 75° = 105°.',
        '∠1 and ∠5 are corresponding angles, so they are equal: ∠5 = 105°.',
        'Answer: 105',
      ],
      fig: {
        kind: 'transversal',
        angle: 75,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = (8x + 11)° and ∠7 = (x + 52)°. What is ∠7?',
      a: '65',
      steps: [
        '∠8 and ∠7 are a linear pair (they form a straight line), so they add up to 180°.',
        '(8x + 11) + (x + 52) = 180',
        '9x + 63 = 180, so 9x = 117 and x = 13.',
        '∠7 = 1(13) + 52 = 65°.',
        'Answer: 65',
      ],
      fig: {
        kind: 'transversal',
        angle: 65,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠3 = (6x + 21)° and ∠6 = (4x + 29)°. What is ∠6?',
      a: '45',
      steps: [
        '∠3 and ∠6 are alternate interior angles, so they are equal.',
        '6x + 21 = 4x + 29',
        '2x = 8, so x = 4.',
        '∠6 = 4(4) + 29 = 45°.',
        'Answer: 45',
      ],
      fig: {
        kind: 'transversal',
        angle: 45,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠8 = (6x + 49)° and ∠6 = (2x + 3)°. What is ∠6?',
      a: '35',
      steps: [
        '∠8 and ∠6 are a linear pair (they form a straight line), so they add up to 180°.',
        '(6x + 49) + (2x + 3) = 180',
        '8x + 52 = 180, so 8x = 128 and x = 16.',
        '∠6 = 2(16) + 3 = 35°.',
        'Answer: 35',
      ],
      fig: {
        kind: 'transversal',
        angle: 35,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'In the figure, the two horizontal lines are parallel. ∠4 = (6x − 34)° and ∠2 = (8x + 18)°. What is ∠2?',
      a: '130',
      steps: [
        '∠4 and ∠2 are a linear pair (they form a straight line), so they add up to 180°.',
        '(6x − 34) + (8x + 18) = 180',
        '14x − 16 = 180, so 14x = 196 and x = 14.',
        '∠2 = 8(14) + 18 = 130°.',
        'Answer: 130',
      ],
      fig: {
        kind: 'transversal',
        angle: 130,
        marks: [
          {
            line: 'top',
            quad: 2,
            text: '1',
          },
          {
            line: 'top',
            quad: 1,
            text: '2',
          },
          {
            line: 'top',
            quad: 3,
            text: '3',
          },
          {
            line: 'top',
            quad: 4,
            text: '4',
          },
          {
            line: 'bottom',
            quad: 2,
            text: '5',
          },
          {
            line: 'bottom',
            quad: 1,
            text: '6',
          },
          {
            line: 'bottom',
            quad: 3,
            text: '7',
          },
          {
            line: 'bottom',
            quad: 4,
            text: '8',
          },
        ],
      },
    },
    {
      q: 'Two lines cross. One angle measures 27°, the angle vertical to it is (y + 13)°, and an angle next to it is (4x + 7)°. What is x + y?',
      a: '50.5',
      form: 'decimal',
      steps: [
        'Vertical angles are equal: y + 13 = 27, so y = 14.',
        'The angle next to it forms a linear pair with the 27° angle: 27 + (4x + 7) = 180.',
        '4x = 146, so x = 36.5.',
        'x + y = 36.5 + 14 = 50.5.',
        'Answer: 50.5',
      ],
    },
    {
      q: 'Two lines cross. One angle measures 56°, the angle vertical to it is (y + 4)°, and an angle next to it is (2x + 8)°. What is y?',
      a: '52',
      steps: [
        'Vertical angles are equal: y + 4 = 56, so y = 52.',
        'The angle next to it forms a linear pair with the 56° angle: 56 + (2x + 8) = 180.',
        '2x = 116, so x = 58.',
        'Answer: 52',
      ],
    },
    {
      q: 'The angles of a quadrilateral are (4x + 2)°, (5x + 2)°, (x − 1)°, (5x − 3)°. What is the largest angle?',
      a: '122',
      steps: [
        'The angles of a quadrilateral add up to (4 − 2) × 180 = 360°.',
        '4x + 2 + 5x + 2 + x − 1 + 5x − 3 = 360, so 15x + 0 = 360 and x = 24.',
        'The angles are 98°, 122°, 23°, 117°; the largest is 122°.',
        'Answer: 122',
      ],
    },
    {
      q: 'The angles of a quadrilateral are (2x + 10)°, (x + 3)°, (x − 8)°, (x)°. What is the largest angle?',
      a: '152',
      steps: [
        'The angles of a quadrilateral add up to (4 − 2) × 180 = 360°.',
        '2x + 10 + x + 3 + x − 8 + x = 360, so 5x + 5 = 360 and x = 71.',
        'The angles are 152°, 74°, 63°, 71°; the largest is 152°.',
        'Answer: 152',
      ],
    },
    {
      q: 'A, B and C lie on a straight line and D is off it. ∠ABD = (9x + 9)° and ∠DBC = (11x + 11)°. What is x?',
      a: '8',
      steps: [
        '∠ABD + ∠DBC = 180° because they make a straight line.',
        '(9x + 9) + (11x + 11) = 180, so 20x + 20 = 180 and x = 8.',
        'Answer: 8',
      ],
    },
    {
      q: '∠ABC is a right angle and D is inside it. ∠ABD = (2x − 9)° and ∠DBC = (14x − 13)°. What is x?',
      a: '7',
      steps: [
        '∠ABD + ∠DBC = ∠ABC = 90°.',
        '(2x − 9) + (14x − 13) = 90, so 16x − 22 = 90 and x = 7.',
        'Answer: 7',
      ],
    },
    {
      q: 'The lines y = kx + 7 and y = 3x − 4 are parallel. What is k?',
      a: '3',
      steps: ['Parallel lines have the same slope.', 'k = 3.', 'Answer: 3'],
    },
    {
      q: 'The lines y = kx + 7 and y = 5x − 4 are parallel. What is k?',
      a: '5',
      steps: ['Parallel lines have the same slope.', 'k = 5.', 'Answer: 5'],
    },
  ],
};
