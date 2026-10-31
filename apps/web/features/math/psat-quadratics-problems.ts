import type { GuideProblem } from './guide-problem';

/** 25 problems per Quadratics chapter, simple to complex: 1–8 warm-up, 9–17 core, 18–25 challenge. Generated from small templates, so every answer is computed. */
export const QUADRATICS_PROBLEMS: Record<string, GuideProblem[]> = {
  recognize: [
    {
      q: 'What is the highest exponent of x in y = x² − 6x + 8?',
      a: '2',
      steps: ['Look for the largest power of x: x² is the largest.', 'Answer: 2'],
    },
    {
      q: 'Find y when x = 0 in y = x² − 6x + 8.',
      a: '8',
      steps: [
        'Replace x with 0. Square first: 0² = 0.',
        '−6 × 0 = 0.',
        'Add: 0 + 0 + 8 = 8.',
        'Answer: 8',
      ],
    },
    {
      q: 'How many of these are quadratic relationships: y = 2x + 3, y = x² − 4, y = x³ + x, y = 3x² + x, y = 5?',
      a: '2',
      steps: [
        'A quadratic has x² as its highest power.',
        'y = x² − 4 and y = 3x² + x qualify; y = 2x + 3 and y = 5 are not (x² is missing), and y = x³ + x has degree 3.',
        'Answer: 2',
      ],
    },
    {
      q: 'Find y when x = 2 in y = x² − 6x + 8.',
      a: '0',
      steps: [
        'Replace x with 2. Square first: 2² = 4.',
        '−6 × 2 = −12.',
        'Add: 4 − 12 + 8 = 0.',
        'Answer: 0',
      ],
    },
    {
      q: 'A table has x = 0, 1, 2, 3, 4 and y = 8, 3, 0, −1, 0. The relationship is quadratic. What is its constant second difference?',
      a: '2',
      steps: [
        'First differences (bottom minus top): −5, −3, −1, 1.',
        'Second differences: 2, 2, 2.',
        'They are all the same, as they must be for a quadratic.',
        'Answer: 2',
      ],
    },
    {
      q: 'Find y when x = 2 in y = 2x² + 3x − 1.',
      a: '13',
      steps: [
        'Replace x with 2. Square first: 2² = 4.',
        '2 × 4 = 8. 3 × 2 = 6.',
        'Add: 8 + 6 − 1 = 13.',
        'Answer: 13',
      ],
    },
    {
      q: 'A table has x = 0, 1, 2, 3, 4 and y = −1, 2, 11, 26, 47. The relationship is quadratic. What is its constant second difference?',
      a: '6',
      steps: [
        'First differences (bottom minus top): 3, 9, 15, 21.',
        'Second differences: 6, 6, 6.',
        'They are all the same, as they must be for a quadratic.',
        'Answer: 6',
      ],
    },
    {
      q: 'A quadratic relationship has x = 0, 1, 2, 3, 4 and its y-values start −3, −4, −3, 0. Find y when x = 4.',
      a: '5',
      steps: [
        'First differences: −1, 1, 3. Second difference: 2.',
        'The second difference is constant, so the next first difference is 3 + 2 = 5.',
        'Next y: 0 + 5 = 5.',
        'Answer: 5',
      ],
    },
    {
      q: 'In y = 2x² − 5x + 3, what is the value of a? (Standard form is y = ax² + bx + c.)',
      a: '2',
      steps: ['a is the number in front of x².', 'Here it is 2.', 'Answer: 2'],
    },
    {
      q: 'The table x = 0, 1, 2, 3, 4 and y = 4, 7, 14, 25, 40 fits y = ax² + bx + c. Find a.',
      a: '2',
      steps: [
        'First differences: 3, 7, 11, 15. Second difference: 4.',
        'For steps of 1 the second difference is 2a, so a = 4 ÷ 2 = 2.',
        'Answer: 2',
      ],
    },
    {
      q: 'A parabola passes through (−1, 5) and (5, 5). Find x in the equation x = ? of its axis of symmetry.',
      a: '2',
      steps: [
        'Two points at the same height are mirror images across the axis of symmetry.',
        'The axis is halfway between them: (−1 + 5) ÷ 2 = 2.',
        'Answer: 2',
      ],
    },
    {
      q: 'Enter 1 if the parabola y = −2x² + 8x + 1 opens up and −1 if it opens down.',
      a: '-1',
      steps: ['a = −2.', 'a < 0, so it opens down.', 'Answer: −1'],
    },
    {
      q: 'A quadratic relationship has x = 0, 1, 2, 3, 4 and its y-values start 1, 0, 3, 10. Find y when x = 4.',
      a: '21',
      steps: [
        'First differences: −1, 3, 7. Second difference: 4.',
        'The second difference is constant, so the next first difference is 7 + 4 = 11.',
        'Next y: 10 + 11 = 21.',
        'Answer: 21',
      ],
    },
    {
      q: 'A table has x = 0, 1, 2, 3, 4, 5, 6 and y = 3, 0, −1, 0, 3, 8, 15. What is the minimum y-value of this parabola?',
      a: '-1',
      steps: [
        'The vertex is where the y-values turn around, in the middle of the table.',
        'The smallest y in the table is −1.',
        'Answer: −1',
      ],
    },
    {
      q: 'A parabola passes through (−5, 7) and (3, 7). Find x in the equation x = ? of its axis of symmetry.',
      a: '-1',
      steps: [
        'Two points at the same height are mirror images across the axis of symmetry.',
        'The axis is halfway between them: (−5 + 3) ÷ 2 = −1.',
        'Answer: −1',
      ],
    },
    {
      q: 'A table has x = 0, 2, 4, 6, 8 and y = 0, 8, 24, 48, 80. The relationship is quadratic. What is its constant second difference?',
      a: '8',
      steps: [
        'First differences (bottom minus top): 8, 16, 24, 32.',
        'Second differences: 8, 8, 8.',
        'They are all the same, as they must be for a quadratic.',
        'Answer: 8',
      ],
    },
    {
      q: 'Find y when x = −1 in y = −2x² + 4x + 5.',
      a: '-1',
      steps: [
        'Replace x with −1. Square first: (−1)² = 1.',
        '−2 × 1 = −2. 4 × (−1) = −4.',
        'Add: −2 − 4 + 5 = −1.',
        'Answer: −1',
      ],
    },
    {
      q: 'The table is for a quadratic relationship: x = 0, 1, 2, 3, 4 and y = 3, 0, ?, 0, 3. Find the missing y-value.',
      a: '-1',
      steps: [
        'The second difference of a quadratic is constant, here 2 (from the other values).',
        'Work from the known differences to the missing value.',
        'Missing y = −1; check that the second differences all equal 2.',
        'Answer: −1',
      ],
    },
    {
      q: 'A table has x = 0, 1, 2, 3, 4, 5, 6 and y = −5, 0, 3, 4, 3, 0, −5. What is the maximum y-value of this parabola?',
      a: '4',
      steps: [
        'The vertex is where the y-values turn around, in the middle of the table.',
        'The largest y in the table is 4.',
        'Answer: 4',
      ],
    },
    {
      q: 'A table has x = 0, 1, 2, 3, 4 and y = 1, 4, 3, −2, −11. The relationship is quadratic. What is its constant second difference?',
      a: '-4',
      steps: [
        'First differences (bottom minus top): 3, −1, −5, −9.',
        'Second differences: −4, −4, −4.',
        'They are all the same, as they must be for a quadratic.',
        'Answer: −4',
      ],
    },
    {
      q: 'A parabola passes through (−2, 6) and (4, 6). Find x in the equation x = ? of its axis of symmetry.',
      a: '1',
      steps: [
        'Two points at the same height are mirror images across the axis of symmetry.',
        'The axis is halfway between them: (−2 + 4) ÷ 2 = 1.',
        'Answer: 1',
      ],
    },
    {
      q: 'The table is for a quadratic relationship: x = 0, 1, 2, 3, 4 and y = 6, 0, −2, ?, 6. Find the missing y-value.',
      a: '0',
      steps: [
        'The second difference of a quadratic is constant, here 4 (from the other values).',
        'Work from the known differences to the missing value.',
        'Missing y = 0; check that the second differences all equal 4.',
        'Answer: 0',
      ],
    },
    {
      q: 'A parabola has its axis of symmetry at x = 3 and passes through (0, 4). Find y at x = 6.',
      a: '4',
      steps: [
        'Mirror images across x = 3: x = 0 is 3 to the left, so x = 6 is 3 to the right.',
        'Mirror points have the same y.',
        'Answer: 4',
      ],
    },
    {
      q: 'The parabola y = x² + bx + 8 passes through (2, 0). Find b.',
      a: '-6',
      steps: ['Put x = 2 and y = 0: 0 = 4 + 2b + 8.', '2b = −12, so b = −6.', 'Answer: −6'],
    },
    {
      q: 'The parabola y = ax² + 1 passes through (2, 13). Find a.',
      a: '3',
      steps: ['Put x = 2 and y = 13: 13 = a(4) + 1.', '4a = 12, so a = 3.', 'Answer: 3'],
    },
  ],
  standard: [
    {
      q: 'In y = 3x² − 5x + 2, what is the value of a? (Standard form is y = ax² + bx + c.)',
      a: '3',
      steps: ['a is the number in front of x².', 'Here it is 3.', 'Answer: 3'],
    },
    {
      q: 'In y = 3x² − 5x + 2, what is the value of b? (Standard form is y = ax² + bx + c.)',
      a: '-5',
      steps: ['b is the number in front of x.', 'Here it is −5.', 'Answer: −5'],
    },
    {
      q: 'In y = 3x² − 5x + 2, what is the value of c? (Standard form is y = ax² + bx + c.)',
      a: '2',
      steps: ['c is the constant, with its sign.', 'Here it is 2.', 'Answer: 2'],
    },
    {
      q: 'Enter 1 if the parabola y = 5x² − 2x + 1 opens up and −1 if it opens down.',
      a: '1',
      steps: ['a = 5.', 'a > 0, so it opens up.', 'Answer: 1'],
    },
    {
      q: 'Enter 1 if the parabola y = −3x² + 4 opens up and −1 if it opens down.',
      a: '-1',
      steps: ['a = −3.', 'a < 0, so it opens down.', 'Answer: −1'],
    },
    {
      q: 'At what y-value does y = x² + 4x + 9 cross the y-axis?',
      a: '9',
      steps: [
        'On the y-axis x = 0, so every x-term disappears.',
        'y = 9, which is c.',
        'Answer: 9',
      ],
    },
    {
      q: 'At what y-value does y = −2x² + 3x − 7 cross the y-axis?',
      a: '-7',
      steps: [
        'On the y-axis x = 0, so every x-term disappears.',
        'y = −7, which is c.',
        'Answer: −7',
      ],
    },
    {
      q: 'In y = −x² + 6x, what is the value of b? (Standard form is y = ax² + bx + c.)',
      a: '6',
      steps: ['b is the number in front of x.', 'Here it is 6.', 'Answer: 6'],
    },
    {
      q: 'Find y when x = 1 in y = 2x² + 4x − 5.',
      a: '1',
      steps: [
        'Replace x with 1. Square first: 1² = 1.',
        '2 × 1 = 2. 4 × 1 = 4.',
        'Add: 2 + 4 − 5 = 1.',
        'Answer: 1',
      ],
    },
    {
      q: 'Find y when x = −2 in y = 2x² + 4x − 5.',
      a: '-5',
      steps: [
        'Replace x with −2. Square first: (−2)² = 4.',
        '2 × 4 = 8. 4 × (−2) = −8.',
        'Add: 8 − 8 − 5 = −5.',
        'Answer: −5',
      ],
    },
    {
      q: 'In y = x² − 9, what is the value of c? (Standard form is y = ax² + bx + c.)',
      a: '-9',
      steps: ['c is the constant, with its sign.', 'Here it is −9.', 'Answer: −9'],
    },
    {
      q: 'At what y-value does y = 4x² − x cross the y-axis?',
      a: '0',
      steps: [
        'On the y-axis x = 0, so every x-term disappears.',
        'y = 0, which is c.',
        'Answer: 0',
      ],
    },
    {
      q: 'Find y when x = 2 in y = −3x² + 6x + 2.',
      a: '2',
      steps: [
        'Replace x with 2. Square first: 2² = 4.',
        '−3 × 4 = −12. 6 × 2 = 12.',
        'Add: −12 + 12 + 2 = 2.',
        'Answer: 2',
      ],
    },
    {
      q: 'Find y when x = −3 in y = x² + 5x + 6.',
      a: '0',
      steps: [
        'Replace x with −3. Square first: (−3)² = 9.',
        '5 × (−3) = −15.',
        'Add: 9 − 15 + 6 = 0.',
        'Answer: 0',
      ],
    },
    {
      q: 'A parabola has a = −2 and c = 5. At what y-value does it cross the y-axis?',
      a: '5',
      steps: ['The y-intercept is (0, c).', 'c = 5.', 'Answer: 5'],
    },
    {
      q: 'The parabola y = ax² − 3 passes through (2, 5). Find a.',
      a: '2',
      steps: ['Put x = 2 and y = 5: 5 = a(4) − 3.', '4a = 8, so a = 2.', 'Answer: 2'],
    },
    {
      q: 'The parabola y = x² + bx + 2 passes through (2, 0). Find b.',
      a: '-3',
      steps: ['Put x = 2 and y = 0: 0 = 4 + 2b + 2.', '2b = −6, so b = −3.', 'Answer: −3'],
    },
    {
      q: 'y = 2x² + 4x − 5. Find the sum a + b + c.',
      a: '1',
      steps: ['a = 2, b = 4, c = −5.', '2 + 4 + (−5) = 1.', 'Answer: 1'],
    },
    {
      q: 'y = −x² + 6x − 8. At x = 1, y equals what?',
      a: '-3',
      steps: ['−(1)² + 6(1) − 8 = −1 + 6 − 8.', 'Answer: −3'],
    },
    {
      q: 'Find y when x = 4 in y = 3x² − 2x + 1.',
      a: '41',
      steps: [
        'Replace x with 4. Square first: 4² = 16.',
        '3 × 16 = 48. −2 × 4 = −8.',
        'Add: 48 − 8 + 1 = 41.',
        'Answer: 41',
      ],
    },
    {
      q: 'Which value of a, 4 or −4, makes y = ax² + 2x + 1 open downward? Enter it.',
      a: '-4',
      steps: ['A parabola opens down when a < 0.', 'Answer: −4'],
    },
    {
      q: 'y = x² + bx + 5 passes through (1, 0). Find b.',
      a: '-6',
      steps: ['Put x = 1, y = 0: 0 = 1 + b + 5.', 'b = −6.', 'Answer: −6'],
    },
    {
      q: 'y = ax² + 3x − 2 passes through (2, 12). Find a.',
      a: '2',
      steps: ['12 = 4a + 6 − 2.', '4a = 8, a = 2.', 'Answer: 2'],
    },
    {
      q: 'A table of y = x² + bx + c has y = 3 at x = 0 and y = 0 at x = 1 and y = −1 at x = 2. Find b.',
      a: '-4',
      steps: [
        'x = 0 gives c = 3.',
        'x = 1: 1 + b + 3 = 0, so b = −4.',
        'Check x = 2: 4 − 8 + 3 = −1. ✓.',
        'Answer: −4',
      ],
    },
    {
      q: 'For y = 2x² − 8x + 3, find y at the x-value where the parabola is lowest: x = −b ÷ 2a. What is that y?',
      a: '-5',
      steps: ['x = 8 ÷ 4 = 2.', 'y = 2(4) − 16 + 3 = −5.', 'Answer: −5'],
    },
  ],
  'vertex-form': [
    {
      q: 'The vertex form is y = (x − 3)² + 2. What is the x-coordinate of the vertex?',
      a: '3',
      steps: [
        'Vertex form is y = a(x − h)² + k, so the vertex is (h, k).',
        'x − h matches x − 3, so h = 3.',
        'Answer: 3',
      ],
      fig: {
        kind: 'grid',
        x: [-1, 7],
        y: [-1, 14],
        quad: [
          {
            a: 1,
            b: -6,
            c: 11,
          },
        ],
        free: true,
      },
    },
    {
      q: 'The vertex form is y = (x − 3)² + 2. What is the y-coordinate of the vertex?',
      a: '2',
      steps: ['The vertex is (h, k).', 'k is the number added at the end: 2.', 'Answer: 2'],
    },
    {
      q: 'The vertex form is y = (x − 4)² − 1. What is the x-coordinate of the vertex?',
      a: '4',
      steps: [
        'Vertex form is y = a(x − h)² + k, so the vertex is (h, k).',
        'x − h matches x − 4, so h = 4.',
        'Answer: 4',
      ],
      fig: {
        kind: 'grid',
        x: [0, 8],
        y: [-2, 11],
        quad: [
          {
            a: 1,
            b: -8,
            c: 15,
          },
        ],
        free: true,
      },
    },
    {
      q: 'The vertex form is y = 2(x + 3)² + 5. What is the x-coordinate of the vertex?',
      a: '-3',
      steps: [
        'Vertex form is y = a(x − h)² + k, so the vertex is (h, k).',
        'x − h matches x + 3, so h = −3.',
        'Answer: −3',
      ],
      fig: {
        kind: 'grid',
        x: [-7, 1],
        y: [-1, 17],
        quad: [
          {
            a: 2,
            b: 12,
            c: 23,
          },
        ],
        free: true,
      },
    },
    {
      q: 'The vertex form is y = (x − 2)² − 9. Find x in the equation x = ? of the axis of symmetry.',
      a: '2',
      steps: [
        'The axis of symmetry is the vertical line through the vertex: x = h.',
        'h = 2.',
        'Answer: 2',
      ],
    },
    {
      q: 'What is the minimum value of y = (x − 3)² + 2?',
      a: '2',
      steps: [
        'a = 1, so the parabola opens up and the vertex is the lowest point.',
        'The vertex is (3, 2), so the minimum value is 2.',
        'Answer: 2',
      ],
    },
    {
      q: 'What is the maximum value of y = −2(x − 1)² + 7?',
      a: '7',
      steps: [
        'a = −2, so the parabola opens down and the vertex is the highest point.',
        'The vertex is (1, 7), so the maximum value is 7.',
        'Answer: 7',
      ],
    },
    {
      q: 'Where does y = (x − 2)² − 1 cross the y-axis? Give the y-value.',
      a: '3',
      steps: ['Put x = 0.', '(−2)² − 1 = 4 − 1 = 3.', 'Answer: 3'],
    },
    {
      q: 'The vertex form is y = −(x + 5)² + 3. Find x in the equation x = ? of the axis of symmetry.',
      a: '-5',
      steps: [
        'The axis of symmetry is the vertical line through the vertex: x = h.',
        'h = −5.',
        'Answer: −5',
      ],
    },
    {
      q: 'Write y = (x − 3)² − 2 in standard form y = ax² + bx + c. Find b.',
      a: '-6',
      steps: [
        'Expand (x − 3)²: x² − 6x + 9.',
        'Multiply by 1 and subtract 2: x² − 6x + 7.',
        'b = −6.',
        'Answer: −6',
      ],
    },
    {
      q: 'Write y = (x − 3)² − 2 in standard form y = ax² + bx + c. Find c.',
      a: '7',
      steps: [
        'Expand (x − 3)²: x² − 6x + 9.',
        'Multiply by 1 and subtract 2: x² − 6x + 7.',
        'c = 7.',
        'Answer: 7',
      ],
    },
    {
      q: 'Find y when x = 3 on y = 2(x − 1)² + 3.',
      a: '11',
      steps: ['x − 1 → 3 − 1 = 2.', 'Square: 4. Multiply by 2: 8. Add 3: 11.', 'Answer: 11'],
    },
    {
      q: 'Find y when x = 4 on y = −(x − 2)² + 5.',
      a: '1',
      steps: ['x − 2 → 4 − 2 = 2.', 'Square: 4. Multiply by −1: −4. Add 5: 1.', 'Answer: 1'],
    },
    {
      q: 'Where does y = −3(x − 1)² + 6 cross the y-axis? Give the y-value.',
      a: '3',
      steps: ['Put x = 0.', '−3(−1)² + 6 = −3 + 6 = 3.', 'Answer: 3'],
    },
    {
      q: 'Write y = 2(x − 2)² + 1 in standard form y = ax² + bx + c. Find b.',
      a: '-8',
      steps: [
        'Expand (x − 2)²: x² − 4x + 4.',
        'Multiply by 2 and add 1: 2x² − 8x + 9.',
        'b = −8.',
        'Answer: −8',
      ],
    },
    {
      q: 'Write y = −(x + 4)² + 3 in standard form y = ax² + bx + c. Find c.',
      a: '-13',
      steps: [
        'Expand (x + 4)²: x² + 8x + 16.',
        'Multiply by −1 and add 3: −x² − 8x − 13.',
        'c = −13.',
        'Answer: −13',
      ],
    },
    {
      q: 'A parabola has vertex (2, 1) and passes through (4, 5). Write it as y = a(x − h)² + k. Find a.',
      a: '1',
      steps: [
        'Put h = 2, k = 1 and the point into y = a(x − h)² + k: 5 = a(2)² + 1.',
        '4 = 4a, so a = 1.',
        'Answer: 1',
      ],
    },
    {
      q: 'A parabola has vertex (−1, 5) and passes through (2, −4). Write it as y = a(x − h)² + k. Find a.',
      a: '-1',
      steps: [
        'Put h = −1, k = 5 and the point into y = a(x − h)² + k: −4 = a(3)² + 5.',
        '−9 = 9a, so a = −1.',
        'Answer: −1',
      ],
    },
    {
      q: 'Complete the square to write y = x² + 6x + 4 as y = a(x − h)² + k. Find k.',
      a: '-5',
      steps: [
        'Half of 6 is 3, and 3² = 9. Add and subtract 9.',
        'y = (x² + 6x + 9) − 9 + 4 = (x + 3)² − 5.',
        'h = −3 and k = −5.',
        'Answer: −5',
      ],
    },
    {
      q: 'Complete the square to write y = x² − 8x + 3 as y = a(x − h)² + k. Find h.',
      a: '4',
      steps: [
        'Half of −8 is −4, and (−4)² = 16. Add and subtract 16.',
        'y = (x² − 8x + 16) − 16 + 3 = (x − 4)² − 13.',
        'h = 4 and k = −13.',
        'Answer: 4',
      ],
    },
    {
      q: 'Complete the square to write y = 2x² + 12x + 5 as y = a(x − h)² + k. Find k.',
      a: '-13',
      steps: [
        'Take 2 out of the first two terms: 2(x² + 6x) + 5. Half of 6 is 3; 3² = 9.',
        'Add and subtract 9 inside; the subtracted part leaves the bracket times 2: y = 2(x + 3)² − 13.',
        'h = −3 and k = −13.',
        'Answer: −13',
      ],
    },
    {
      q: 'Complete the square to write y = −2x² + 20x − 11 as y = a(x − h)² + k. Find h.',
      a: '5',
      steps: [
        'Take −2 out of the first two terms: −2(x² − 10x) − 11. Half of −10 is −5; (−5)² = 25.',
        'Add and subtract 25 inside; the subtracted part leaves the bracket times −2: y = −2(x − 5)² + 39.',
        'h = 5 and k = 39.',
        'Answer: 5',
      ],
    },
    {
      q: 'Complete the square to write y = −2x² + 20x − 11 as y = a(x − h)² + k. Find k.',
      a: '39',
      steps: [
        'Take −2 out of the first two terms: −2(x² − 10x) − 11. Half of −10 is −5; (−5)² = 25.',
        'Add and subtract 25 inside; the subtracted part leaves the bracket times −2: y = −2(x − 5)² + 39.',
        'h = 5 and k = 39.',
        'Answer: 39',
      ],
    },
    {
      q: 'y = −2x² + 20x − 11 is rewritten as y = a(x − h)² + k. Find a + h + k.',
      a: '42',
      steps: [
        'Complete the square: y = −2(x − 5)² + 39, so a = −2, h = 5, k = 39.',
        'a + h + k = −2 + 5 + 39 = 42.',
        'Answer: 42',
      ],
    },
    {
      q: 'A parabola has vertex (4, −3) and passes through (6, 5). In y = a(x − 4)² − 3, find a.',
      a: '2',
      steps: ['Put x = 6, y = 5: 5 = a(2)² − 3.', '8 = 4a, so a = 2.', 'Answer: 2'],
    },
  ],
  'factored-form': [
    {
      q: 'The parabola y = (x − 2)(x − 5) crosses the x-axis at two points. What is the smaller x-intercept?',
      a: '2',
      steps: [
        'An x-intercept has y = 0. A product is 0 when a factor is 0 (zero product rule).',
        'x − 2 = 0 gives x = 2, and x − 5 = 0 gives x = 5.',
        'Answer: 2',
      ],
      fig: {
        kind: 'grid',
        x: [-1, 8],
        y: [-4, 10],
        quad: [
          {
            a: 1,
            b: -7,
            c: 10,
          },
        ],
        free: true,
      },
    },
    {
      q: 'The parabola y = (x − 2)(x − 5) crosses the x-axis at two points. What is the larger x-intercept?',
      a: '5',
      steps: [
        'An x-intercept has y = 0. A product is 0 when a factor is 0 (zero product rule).',
        'x − 2 = 0 gives x = 2, and x − 5 = 0 gives x = 5.',
        'Answer: 5',
      ],
      fig: {
        kind: 'grid',
        x: [-1, 8],
        y: [-4, 10],
        quad: [
          {
            a: 1,
            b: -7,
            c: 10,
          },
        ],
        free: true,
      },
    },
    {
      q: 'The parabola y = (x + 3)(x − 4) crosses the x-axis at two points. What is the smaller x-intercept?',
      a: '-3',
      steps: [
        'An x-intercept has y = 0. A product is 0 when a factor is 0 (zero product rule).',
        'x + 3 = 0 gives x = −3, and x − 4 = 0 gives x = 4.',
        'Answer: −3',
      ],
      fig: {
        kind: 'grid',
        x: [-4, 5],
        y: [-14, 0],
        quad: [
          {
            a: 1,
            b: -1,
            c: -12,
          },
        ],
        free: true,
      },
    },
    {
      q: 'Find x in the equation x = ? of the axis of symmetry of y = (x − 2)(x − 6).',
      a: '4',
      steps: [
        'The x-intercepts are 2 and 6.',
        'The axis is halfway between them: (2 + 6) ÷ 2 = 4.',
        'Answer: 4',
      ],
    },
    {
      q: 'Expand y = (x − 2)(x − 5) into standard form y = ax² + bx + c. Find b.',
      a: '-7',
      steps: [
        'Multiply the two brackets: (x − 2)(x − 5) = x² − 7x + 10.',
        'Multiply by 1: x² − 7x + 10.',
        'b = −7.',
        'Answer: −7',
      ],
    },
    {
      q: 'Expand y = (x − 2)(x − 5) into standard form y = ax² + bx + c. Find c.',
      a: '10',
      steps: [
        'Multiply the two brackets: (x − 2)(x − 5) = x² − 7x + 10.',
        'Multiply by 1: x² − 7x + 10.',
        'c = 10.',
        'Answer: 10',
      ],
    },
    {
      q: 'The parabola y = 2(x + 1)(x − 3) crosses the x-axis at two points. What is the larger x-intercept?',
      a: '3',
      steps: [
        'An x-intercept has y = 0. A product is 0 when a factor is 0 (zero product rule).',
        'x + 1 = 0 gives x = −1, and x − 3 = 0 gives x = 3.',
        'Answer: 3',
      ],
      fig: {
        kind: 'grid',
        x: [-3, 5],
        y: [-9, 4],
        quad: [
          {
            a: 2,
            b: -4,
            c: -6,
          },
        ],
        free: true,
      },
    },
    {
      q: 'Find x in the equation x = ? of the axis of symmetry of y = (x + 4)(x − 2).',
      a: '-1',
      steps: [
        'The x-intercepts are −4 and 2.',
        'The axis is halfway between them: (−4 + 2) ÷ 2 = −1.',
        'Answer: −1',
      ],
    },
    {
      q: 'Find x in the equation x = ? of the axis of symmetry of y = 3(x − 1)(x − 4).',
      a: '5/2',
      steps: [
        'The x-intercepts are 1 and 4.',
        'The axis is halfway between them: (1 + 4) ÷ 2 = 5/2.',
        'Answer: 5/2',
      ],
    },
    {
      q: 'What is the y-coordinate of the vertex of y = (x − 2)(x − 6)?',
      a: '-4',
      steps: [
        'The x-intercepts are 2 and 6, so the vertex is at x = 4.',
        'Put x = 4 into both factors and multiply by 1: 1 × (2) × (−2) = −4.',
        'Answer: −4',
      ],
      fig: {
        kind: 'grid',
        x: [0, 8],
        y: [-5, 8],
        quad: [
          {
            a: 1,
            b: -8,
            c: 12,
          },
        ],
        free: true,
      },
    },
    {
      q: 'The parabola y = −(x + 5)(x + 1) crosses the x-axis at two points. What is the smaller x-intercept?',
      a: '-5',
      steps: [
        'An x-intercept has y = 0. A product is 0 when a factor is 0 (zero product rule).',
        'x + 5 = 0 gives x = −5, and x + 1 = 0 gives x = −1.',
        'Answer: −5',
      ],
      fig: {
        kind: 'grid',
        x: [-7, 1],
        y: [-8, 5],
        quad: [
          {
            a: -1,
            b: -6,
            c: -5,
          },
        ],
        free: true,
      },
    },
    {
      q: 'Expand y = (x + 3)(x − 7) into standard form y = ax² + bx + c. Find b.',
      a: '-4',
      steps: [
        'Multiply the two brackets: (x + 3)(x − 7) = x² − 4x − 21.',
        'Multiply by 1: x² − 4x − 21.',
        'b = −4.',
        'Answer: −4',
      ],
    },
    {
      q: 'Expand y = 2(x − 1)(x − 4) into standard form y = ax² + bx + c. Find b.',
      a: '-10',
      steps: [
        'Multiply the two brackets: (x − 1)(x − 4) = x² − 5x + 4.',
        'Multiply by 2: 2x² − 10x + 8.',
        'b = −10.',
        'Answer: −10',
      ],
    },
    {
      q: 'Expand y = −(x − 2)(x − 3) into standard form y = ax² + bx + c. Find c.',
      a: '-6',
      steps: [
        'Multiply the two brackets: (x − 2)(x − 3) = x² − 5x + 6.',
        'Multiply by −1: −x² + 5x − 6.',
        'c = −6.',
        'Answer: −6',
      ],
    },
    {
      q: 'What is the y-coordinate of the vertex of y = (x + 2)(x − 6)?',
      a: '-16',
      steps: [
        'The x-intercepts are −2 and 6, so the vertex is at x = 2.',
        'Put x = 2 into both factors and multiply by 1: 1 × (4) × (−4) = −16.',
        'Answer: −16',
      ],
      fig: {
        kind: 'grid',
        x: [-2, 6],
        y: [-17, -4],
        quad: [
          {
            a: 1,
            b: -4,
            c: -12,
          },
        ],
        free: true,
      },
    },
    {
      q: 'What is the y-coordinate of the vertex of y = −(x + 1)(x − 5)?',
      a: '9',
      steps: [
        'The x-intercepts are −1 and 5, so the vertex is at x = 2.',
        'Put x = 2 into both factors and multiply by −1: −1 × (3) × (−3) = 9.',
        'Answer: 9',
      ],
      fig: {
        kind: 'grid',
        x: [-2, 6],
        y: [-3, 10],
        quad: [
          {
            a: -1,
            b: 4,
            c: 5,
          },
        ],
        free: true,
      },
    },
    {
      q: 'A parabola has x-intercepts 1 and 5 and passes through (3, −8). It is y = a(x − 1)(x − 5). Find a.',
      a: '2',
      steps: [
        'Put x = 3 and y = −8 into the factored form: −8 = a(2)(−2).',
        '−8 = −4a, so a = 2.',
        'Answer: 2',
      ],
    },
    {
      q: 'A parabola has x-intercepts −2 and 4 and passes through (1, 9). It is y = a(x + 2)(x − 4). Find a.',
      a: '-1',
      steps: [
        'Put x = 1 and y = 9 into the factored form: 9 = a(3)(−3).',
        '9 = −9a, so a = −1.',
        'Answer: −1',
      ],
    },
    {
      q: 'What is the y-coordinate of the vertex of y = 2x(x − 4)?',
      a: '-8',
      steps: [
        'The x-intercepts are 0 and 4, so the vertex is at x = 2.',
        'Put x = 2 into both factors and multiply by 2: 2 × (2) × (−2) = −8.',
        'Answer: −8',
      ],
      fig: {
        kind: 'grid',
        x: [-2, 6],
        y: [-9, 4],
        quad: [
          {
            a: 2,
            b: -8,
            c: 0,
          },
        ],
        free: true,
      },
    },
    {
      q: 'Find x in the equation x = ? of the axis of symmetry of y = −2(x + 7)(x + 3).',
      a: '-5',
      steps: [
        'The x-intercepts are −7 and −3.',
        'The axis is halfway between them: (−7 − 3) ÷ 2 = −5.',
        'Answer: −5',
      ],
    },
    {
      q: 'A parabola has x-intercepts −2 and 1 and passes through (0, −6). It is y = a(x + 2)(x − 1). Find a.',
      a: '3',
      steps: [
        'Put x = 0 and y = −6 into the factored form: −6 = a(2)(−1).',
        '−6 = −2a, so a = 3.',
        'Answer: 3',
      ],
    },
    {
      q: 'What is the y-coordinate of the vertex of y = (x + 5)(x − 1)?',
      a: '-9',
      steps: [
        'The x-intercepts are −5 and 1, so the vertex is at x = −2.',
        'Put x = −2 into both factors and multiply by 1: 1 × (3) × (−3) = −9.',
        'Answer: −9',
      ],
      fig: {
        kind: 'grid',
        x: [-6, 2],
        y: [-10, 3],
        quad: [
          {
            a: 1,
            b: 4,
            c: -5,
          },
        ],
        free: true,
      },
    },
    {
      q: 'Expand y = −2(x + 1)(x − 6) into standard form y = ax² + bx + c. Find c.',
      a: '12',
      steps: [
        'Multiply the two brackets: (x + 1)(x − 6) = x² − 5x − 6.',
        'Multiply by −2: −2x² + 10x + 12.',
        'c = 12.',
        'Answer: 12',
      ],
    },
    {
      q: 'A parabola with x-intercepts 1 and 7 has a minimum value of −9. Find the x-coordinate of its vertex.',
      a: '4',
      steps: ['The vertex is halfway between the intercepts.', '(1 + 7) ÷ 2 = 4.', 'Answer: 4'],
    },
    {
      q: 'y = (x + 3)(x − 5) crosses the y-axis at what y-value?',
      a: '-15',
      steps: ['Put x = 0: (3)(−5).', '= −15.', 'Answer: −15'],
    },
  ],
  factoring: [
    {
      q: '2x² + 6x = 2x(x + k). Find k.',
      a: '3',
      steps: [
        'Both terms contain 2x. Divide 2x² + 6x by 2x.',
        'x² ÷ x = x, and 6x ÷ 2x = 3.',
        'Answer: 3',
      ],
    },
    {
      q: 'Factor x² + 5x + 6 as (x + p)(x + q) with p < q (or equal). Find p.',
      a: '2',
      steps: [
        'Look for two numbers with product 6 and sum 5.',
        '2 × 3 = 6 and 2 + 3 = 5.',
        'So it factors as (x + 2)(x + 3); p = 2.',
        'Answer: 2',
      ],
    },
    {
      q: 'Factor x² + 5x + 6 as (x + p)(x + q) with p < q (or equal). Find q.',
      a: '3',
      steps: [
        'Look for two numbers with product 6 and sum 5.',
        '2 × 3 = 6 and 2 + 3 = 5.',
        'So it factors as (x + 2)(x + 3); q = 3.',
        'Answer: 3',
      ],
    },
    {
      q: 'x² − 25 = (x − p)(x + p) with p > 0. Find p.',
      a: '5',
      steps: [
        '25 = 5², so this is a difference of squares: x² − 5².',
        'a² − b² = (a − b)(a + b), so the factors are (x − 5)(x + 5) and p = 5.',
        'Answer: 5',
      ],
    },
    {
      q: 'Factor x² − 7x + 10 as (x + p)(x + q) with p < q (or equal). Find p.',
      a: '-5',
      steps: [
        'Look for two numbers with product 10 and sum −7.',
        '−5 × −2 = 10 and −5 − 2 = −7.',
        'So it factors as (x − 5)(x − 2); p = −5.',
        'Answer: −5',
      ],
    },
    {
      q: 'Factor x² − x − 12 as (x + p)(x + q) with p < q (or equal). Find q.',
      a: '3',
      steps: [
        'Look for two numbers with product −12 and sum −1.',
        '−4 × 3 = −12 and −4 + 3 = −1.',
        'So it factors as (x − 4)(x + 3); q = 3.',
        'Answer: 3',
      ],
    },
    {
      q: '3x² + 6x = 3x(x + k). Find k.',
      a: '2',
      steps: [
        'Both terms contain 3x. Divide 3x² + 6x by 3x.',
        'x² ÷ x = x, and 6x ÷ 3x = 2.',
        'Answer: 2',
      ],
    },
    {
      q: 'x² − 49 = (x − p)(x + p) with p > 0. Find p.',
      a: '7',
      steps: [
        '49 = 7², so this is a difference of squares: x² − 7².',
        'a² − b² = (a − b)(a + b), so the factors are (x − 7)(x + 7) and p = 7.',
        'Answer: 7',
      ],
    },
    {
      q: 'x² − 4x − 12 = (x + p)(x + q). Find p + q.',
      a: '-4',
      steps: [
        'In (x + p)(x + q) the x-coefficient is p + q.',
        'Here it is −4. (Check: p × q = −12.)',
        'Answer: −4',
      ],
    },
    {
      q: 'Factor x² − 3x − 28 as (x + p)(x + q) with p < q (or equal). Find p.',
      a: '-7',
      steps: [
        'Look for two numbers with product −28 and sum −3.',
        '−7 × 4 = −28 and −7 + 4 = −3.',
        'So it factors as (x − 7)(x + 4); p = −7.',
        'Answer: −7',
      ],
    },
    {
      q: 'Factor x² + 11x + 24 as (x + p)(x + q) with p < q (or equal). Find q.',
      a: '8',
      steps: [
        'Look for two numbers with product 24 and sum 11.',
        '3 × 8 = 24 and 3 + 8 = 11.',
        'So it factors as (x + 3)(x + 8); q = 8.',
        'Answer: 8',
      ],
    },
    {
      q: '2x² + 7x + 3 = (2x + p)(x + q). Find p + q.',
      a: '4',
      steps: [
        'Product a × c = 2 × 3 = 6; find two numbers with that product and sum 7: 6 and 1.',
        'Split the middle term and group: 2x² + 6x + x + 3.',
        'The factors are (2x + 1)(x + 3), so p + q = 1 + 3 = 4.',
        'Answer: 4',
      ],
    },
    {
      q: '3x² + 10x + 8 = (3x + p)(x + q). Find p + q.',
      a: '6',
      steps: [
        'Product a × c = 3 × 8 = 24; find two numbers with that product and sum 10: 6 and 4.',
        'Split the middle term and group: 3x² + 6x + 4x + 8.',
        'The factors are (3x + 4)(x + 2), so p + q = 4 + 2 = 6.',
        'Answer: 6',
      ],
    },
    {
      q: '2x² + 5x − 12 = (2x + p)(x + q). Find p + q.',
      a: '1',
      steps: [
        'Product a × c = 2 × −12 = −24; find two numbers with that product and sum 5: 8 and −3.',
        'Split the middle term and group: 2x² + 8x − 3x − 12.',
        'The factors are (2x − 3)(x + 4), so p + q = −3 + 4 = 1.',
        'Answer: 1',
      ],
    },
    {
      q: '2x² − 32 = 2(x − p)(x + p) with p > 0. Find p.',
      a: '4',
      steps: [
        'Take out 2: 2(x² − 16), and 16 = 4².',
        'a² − b² = (a − b)(a + b), so the factors are (x − 4)(x + 4) and p = 4.',
        'Answer: 4',
      ],
    },
    {
      q: 'Factor x² − 11x + 30 as (x + p)(x + q) with p < q (or equal). Find q.',
      a: '-5',
      steps: [
        'Look for two numbers with product 30 and sum −11.',
        '−6 × −5 = 30 and −6 − 5 = −11.',
        'So it factors as (x − 6)(x − 5); q = −5.',
        'Answer: −5',
      ],
    },
    {
      q: '6x² + x − 2 = (3x + p)(2x + q). Find p + q.',
      a: '1',
      steps: [
        'Product a × c = 6 × −2 = −12; find two numbers with that product and sum 1: −3 and 4.',
        'Split the middle term and group: 6x² − 3x + 4x − 2.',
        'The factors are (3x + 2)(2x − 1), so p + q = 2 − 1 = 1.',
        'Answer: 1',
      ],
    },
    {
      q: '5x² − 9x − 2 = (5x + p)(x + q). Find p + q.',
      a: '-1',
      steps: [
        'Product a × c = 5 × −2 = −10; find two numbers with that product and sum −9: −10 and 1.',
        'Split the middle term and group: 5x² − 10x + x − 2.',
        'The factors are (5x + 1)(x − 2), so p + q = 1 − 2 = −1.',
        'Answer: −1',
      ],
    },
    {
      q: '6x² − 13x − 5 = (2x + p)(3x + q). Find p + q.',
      a: '-4',
      steps: [
        'Product a × c = 6 × −5 = −30; find two numbers with that product and sum −13: 2 and −15.',
        'Split the middle term and group: 6x² + 2x − 15x − 5.',
        'The factors are (2x − 5)(3x + 1), so p + q = −5 + 1 = −4.',
        'Answer: −4',
      ],
    },
    {
      q: '4x² − 5x − 6 = (4x + p)(x + q). Find p + q.',
      a: '1',
      steps: [
        'Product a × c = 4 × −6 = −24; find two numbers with that product and sum −5: −8 and 3.',
        'Split the middle term and group: 4x² − 8x + 3x − 6.',
        'The factors are (4x + 3)(x − 2), so p + q = 3 − 2 = 1.',
        'Answer: 1',
      ],
    },
    {
      q: 'x² − 13x + 36 = (x + p)(x + q). Find p + q.',
      a: '-13',
      steps: [
        'In (x + p)(x + q) the x-coefficient is p + q.',
        'Here it is −13. (Check: p × q = 36.)',
        'Answer: −13',
      ],
    },
    {
      q: '6x² + 13x − 5 = (3x + p)(2x + q). Find p + q.',
      a: '4',
      steps: [
        'Product a × c = 6 × −5 = −30; find two numbers with that product and sum 13: 15 and −2.',
        'Split the middle term and group: 6x² + 15x − 2x − 5.',
        'The factors are (3x − 1)(2x + 5), so p + q = −1 + 5 = 4.',
        'Answer: 4',
      ],
    },
    {
      q: 'x² + 7x + 12 = (x + p)(x + q). The area of a rectangle with sides (x + p) and (x + q) is x² + 7x + 12. Find p × q.',
      a: '12',
      steps: [
        'The constant term is p × q.',
        'It is 12 (and p + q = 7: p = 3, q = 4).',
        'Answer: 12',
      ],
    },
    {
      q: 'Factor 6x² + 11x + 3 = (2x + 3)(3x + k). Find k.',
      a: '1',
      steps: [
        '(2x + 3)(3x + k) = 6x² + (2k + 9)x + 3k.',
        '3k = 3, so k = 1. Check: 2k + 9 = 11 ✓.',
        'Answer: 1',
      ],
    },
    {
      q: 'x² − 10x + 25 = (x − p)². Find p.',
      a: '5',
      steps: ['It is a perfect square trinomial: 25 = 5² and 2 × 5 = 10.', 'Answer: 5'],
    },
  ],
  'solve-factoring': [
    {
      q: 'Solve x² + 5x + 6 = 0. Give the smaller solution.',
      a: '-3',
      steps: [
        'Factor: (x + 2)(x + 3) = 0.',
        'Zero product rule: x + 2 = 0 or x + 3 = 0, so x = −2 or x = −3.',
        'The smaller one is −3.',
        'Answer: −3',
      ],
    },
    {
      q: 'Solve x² + 5x + 6 = 0. Give the larger solution.',
      a: '-2',
      steps: [
        'Factor: (x + 2)(x + 3) = 0.',
        'Zero product rule: x + 2 = 0 or x + 3 = 0, so x = −2 or x = −3.',
        'The larger one is −2.',
        'Answer: −2',
      ],
    },
    {
      q: 'Solve x² − 5x + 4 = 0. Give the larger solution.',
      a: '4',
      steps: [
        'Factor: (x − 1)(x − 4) = 0.',
        'Zero product rule: x − 1 = 0 or x − 4 = 0, so x = 1 or x = 4.',
        'The larger one is 4.',
        'Answer: 4',
      ],
    },
    {
      q: 'Solve x² − 8x + 15 = 0. Give the smaller solution.',
      a: '3',
      steps: [
        'Factor: (x − 3)(x − 5) = 0.',
        'Zero product rule: x − 3 = 0 or x − 5 = 0, so x = 3 or x = 5.',
        'The smaller one is 3.',
        'Answer: 3',
      ],
    },
    {
      q: 'Solve x² + 7x = −10. Give the smaller solution.',
      a: '-5',
      steps: [
        'Set one side to 0 first: add 10 on both sides to get x² + 7x + 10 = 0.',
        'Factor: (x + 2)(x + 5) = 0, so x = −2 or x = −5.',
        'The smaller solution is −5.',
        'Answer: −5',
      ],
    },
    {
      q: 'Solve x² + x − 12 = 0. Give the larger solution.',
      a: '3',
      steps: [
        'Factor: (x + 4)(x − 3) = 0.',
        'Zero product rule: x + 4 = 0 or x − 3 = 0, so x = −4 or x = 3.',
        'The larger one is 3.',
        'Answer: 3',
      ],
    },
    {
      q: 'Solve 2x² − 2x − 24 = 0. Give the smaller solution.',
      a: '-3',
      steps: [
        'Take out the common factor 2: 2(x² − x − 12) = 0, so x² − x − 12 = 0.',
        'Factor: (x − 4)(x + 3) = 0, so x = 4 or x = −3.',
        'The smaller solution is −3.',
        'Answer: −3',
      ],
    },
    {
      q: 'Solve x² − 7x + 6 = 0. Give the larger solution.',
      a: '6',
      steps: [
        'Factor: (x − 6)(x − 1) = 0.',
        'Zero product rule: x − 6 = 0 or x − 1 = 0, so x = 6 or x = 1.',
        'The larger one is 6.',
        'Answer: 6',
      ],
    },
    {
      q: 'Solve x² − 5x = −6. Give the smaller solution.',
      a: '2',
      steps: [
        'Set one side to 0 first: add 6 on both sides to get x² − 5x + 6 = 0.',
        'Factor: (x − 2)(x − 3) = 0, so x = 2 or x = 3.',
        'The smaller solution is 2.',
        'Answer: 2',
      ],
    },
    {
      q: 'Solve 2x² + 7x + 3 = 0. Give the smaller solution.',
      a: '-3',
      steps: [
        'Split the middle term using two numbers with product 6 and sum 7: 6 and 1.',
        'Group and factor: (2x + 1)(x + 3) = 0.',
        '2x + 1 = 0 gives x = −1/2, and x + 3 = 0 gives x = −3.',
        'The smaller one is −3.',
        'Answer: −3',
      ],
    },
    {
      q: 'Solve 2x² + 7x + 3 = 0. Give the larger solution.',
      a: '-1/2',
      steps: [
        'Split the middle term using two numbers with product 6 and sum 7: 6 and 1.',
        'Group and factor: (2x + 1)(x + 3) = 0.',
        '2x + 1 = 0 gives x = −1/2, and x + 3 = 0 gives x = −3.',
        'The larger one is −1/2.',
        'Answer: −1/2',
      ],
    },
    {
      q: 'Solve 3x² − 21x + 30 = 0. Give the larger solution.',
      a: '5',
      steps: [
        'Take out the common factor 3: 3(x² − 7x + 10) = 0, so x² − 7x + 10 = 0.',
        'Factor: (x − 2)(x − 5) = 0, so x = 2 or x = 5.',
        'The larger solution is 5.',
        'Answer: 5',
      ],
    },
    {
      q: 'Solve 3x² + 10x − 8 = 0. Give the smaller solution.',
      a: '-4',
      steps: [
        'Split the middle term using two numbers with product −24 and sum 10: 12 and −2.',
        'Group and factor: (3x − 2)(x + 4) = 0.',
        '3x − 2 = 0 gives x = 2/3, and x + 4 = 0 gives x = −4.',
        'The smaller one is −4.',
        'Answer: −4',
      ],
    },
    {
      q: 'Solve x² − 5x = 24. Give the larger solution.',
      a: '8',
      steps: [
        'Set one side to 0 first: subtract 24 on both sides to get x² − 5x − 24 = 0.',
        'Factor: (x + 3)(x − 8) = 0, so x = −3 or x = 8.',
        'The larger solution is 8.',
        'Answer: 8',
      ],
    },
    {
      q: 'Solve 6x² − 5x − 6 = 0. Give the larger solution.',
      a: '3/2',
      steps: [
        'Split the middle term using two numbers with product −36 and sum −5: 4 and −9.',
        'Group and factor: (2x − 3)(3x + 2) = 0.',
        '2x − 3 = 0 gives x = 3/2, and 3x + 2 = 0 gives x = −2/3.',
        'The larger one is 3/2.',
        'Answer: 3/2',
      ],
    },
    {
      q: 'The product of two consecutive positive integers is 56. What is the larger one?',
      a: '8',
      steps: [
        'Let the integers be n and n + 1: n(n + 1) = 56, so n² + n − 56 = 0.',
        'Factor: (n − 7)(n + 8) = 0, so n = 7 (positive).',
        'The larger integer is 8.',
        'Answer: 8',
      ],
    },
    {
      q: 'The product of two consecutive positive integers is 132. What is the larger one?',
      a: '12',
      steps: [
        'Let the integers be n and n + 1: n(n + 1) = 132, so n² + n − 132 = 0.',
        'Factor: (n − 11)(n + 12) = 0, so n = 11 (positive).',
        'The larger integer is 12.',
        'Answer: 12',
      ],
    },
    {
      q: 'A rectangle is 3 cm longer than it is wide. Its area is 40 cm². How wide is it?',
      a: '5',
      steps: [
        'Let the width be w: w(w + 3) = 40, so w² + 3w − 40 = 0.',
        'Factor: (w + 8)(w − 5) = 0, so w = 5 (a width is positive).',
        'Answer: 5 cm',
      ],
    },
    {
      q: 'A positive number n satisfies n² = 5n + 14. Find n.',
      a: '7',
      steps: [
        'Set it to 0: n² − 5n − 14 = 0.',
        'Factor: (n − 7)(n + 2) = 0, so n = 7 or −2.',
        'n is positive, so n = 7.',
        'Answer: 7',
      ],
    },
    {
      q: 'Solve 5x² + 13x − 6 = 0. Give the larger solution.',
      a: '2/5',
      steps: [
        'Split the middle term using two numbers with product −30 and sum 13: 15 and −2.',
        'Group and factor: (5x − 2)(x + 3) = 0.',
        '5x − 2 = 0 gives x = 2/5, and x + 3 = 0 gives x = −3.',
        'The larger one is 2/5.',
        'Answer: 2/5',
      ],
    },
    {
      q: 'A ball is thrown so that its height is h = −5t² + 20t metres after t seconds. At what time t > 0 does it land?',
      a: '4',
      steps: [
        'It lands when h = 0: −5t² + 20t = 0.',
        'Factor: −5t(t − 4) = 0, so t = 0 (the throw) or t = 4.',
        'Answer: 4 seconds',
      ],
    },
    {
      q: 'The sum of a positive number and its square is 56. Find the number.',
      a: '7',
      steps: [
        'n + n² = 56, so n² + n − 56 = 0.',
        'Factor: (n + 8)(n − 7) = 0, so n = 7 (positive).',
        'Answer: 7',
      ],
    },
    {
      q: 'A ball’s height is h = −5t² + 25t + 30 metres. When does it reach the ground (h = 0)?',
      a: '6',
      steps: [
        '−5t² + 25t + 30 = 0. Divide by −5: t² − 5t − 6 = 0.',
        'Factor: (t − 6)(t + 1) = 0, so t = 6 (time is positive).',
        'Answer: 6 seconds',
      ],
    },
    {
      q: 'Solve x² − 15x = −56. Give the smaller solution.',
      a: '7',
      steps: [
        'Set one side to 0 first: add 56 on both sides to get x² − 15x + 56 = 0.',
        'Factor: (x − 7)(x − 8) = 0, so x = 7 or x = 8.',
        'The smaller solution is 7.',
        'Answer: 7',
      ],
    },
    {
      q: '(x − 3)(x + 2) = 6. Find the positive solution.',
      a: '4',
      steps: [
        'Expand: x² − x − 6 = 6, so x² − x − 12 = 0.',
        'Factor: (x − 4)(x + 3) = 0.',
        'The positive solution is 4. (Do not set each factor equal to 6.)',
        'Answer: 4',
      ],
    },
  ],
  'complete-square': [
    {
      q: 'To make x² + 6x a perfect square, add the number k. Find k.',
      a: '9',
      steps: ['Half of 6 is 3.', 'Square it: 3² = 9.', 'x² + 6x + 9 = (x + 3)².', 'Answer: 9'],
    },
    {
      q: 'To make x² − 8x a perfect square, add the number k. Find k.',
      a: '16',
      steps: [
        'Half of −8 is −4.',
        'Square it: (−4)² = 16.',
        'x² − 8x + 16 = (x − 4)².',
        'Answer: 16',
      ],
    },
    {
      q: 'To make x² + 10x a perfect square, add the number k. Find k.',
      a: '25',
      steps: ['Half of 10 is 5.', 'Square it: 5² = 25.', 'x² + 10x + 25 = (x + 5)².', 'Answer: 25'],
    },
    {
      q: 'To make x² − 4x a perfect square, add the number k. Find k.',
      a: '4',
      steps: ['Half of −4 is −2.', 'Square it: (−2)² = 4.', 'x² − 4x + 4 = (x − 2)².', 'Answer: 4'],
    },
    {
      q: 'To make x² + 14x a perfect square, add the number k. Find k.',
      a: '49',
      steps: ['Half of 14 is 7.', 'Square it: 7² = 49.', 'x² + 14x + 49 = (x + 7)².', 'Answer: 49'],
    },
    {
      q: 'Complete the square to write y = x² + 4x + 7 as y = a(x − h)² + k. Find k.',
      a: '3',
      steps: [
        'Half of 4 is 2, and 2² = 4. Add and subtract 4.',
        'y = (x² + 4x + 4) − 4 + 7 = (x + 2)² + 3.',
        'h = −2 and k = 3.',
        'Answer: 3',
      ],
    },
    {
      q: 'Complete the square to write y = x² − 6x + 5 as y = a(x − h)² + k. Find h.',
      a: '3',
      steps: [
        'Half of −6 is −3, and (−3)² = 9. Add and subtract 9.',
        'y = (x² − 6x + 9) − 9 + 5 = (x − 3)² − 4.',
        'h = 3 and k = −4.',
        'Answer: 3',
      ],
    },
    {
      q: 'Solve x² − 2x − 3 = 0 by completing the square. Give the larger solution.',
      a: '3',
      steps: [
        'Move the constant: x² − 2x = 3. Add 1 to both sides.',
        '(x − 1)² = 4.',
        'Take square roots: x − 1 = ±2, so x = 1 ± 2.',
        'The larger solution is 3.',
        'Answer: 3',
      ],
    },
    {
      q: 'Solve x² + 4x − 5 = 0 by completing the square. Give the smaller solution.',
      a: '-5',
      steps: [
        'Move the constant: x² + 4x = 5. Add 4 to both sides.',
        '(x + 2)² = 9.',
        'Take square roots: x + 2 = ±3, so x = −2 ± 3.',
        'The smaller solution is −5.',
        'Answer: −5',
      ],
    },
    {
      q: 'Complete the square to write y = x² − 10x + 3 as y = a(x − h)² + k. Find k.',
      a: '-22',
      steps: [
        'Half of −10 is −5, and (−5)² = 25. Add and subtract 25.',
        'y = (x² − 10x + 25) − 25 + 3 = (x − 5)² − 22.',
        'h = 5 and k = −22.',
        'Answer: −22',
      ],
    },
    {
      q: 'Solve x² + 6x + 2 = 0 by completing the square. Give the larger solution in exact form.',
      a: '-3+1*sqrt(7)',
      form: 'radical',
      steps: [
        'Move the constant: x² + 6x = −2. Add 9 to both sides.',
        '(x + 3)² = 7.',
        'Take square roots: x + 3 = ±√7, so x = −3 ± √7.',
        'The larger solution is −3 + √7.',
        'Answer: −3 + √7',
      ],
    },
    {
      q: 'Solve x² − 6x − 8 = 0 by completing the square. Give the larger solution in exact form.',
      a: '3+1*sqrt(17)',
      form: 'radical',
      steps: [
        'Move the constant: x² − 6x = 8. Add 9 to both sides.',
        '(x − 3)² = 17.',
        'Take square roots: x − 3 = ±√17, so x = 3 ± √17.',
        'The larger solution is 3 + √17.',
        'Answer: 3 + √17',
      ],
    },
    {
      q: 'Solve x² + 2x − 7 = 0 by completing the square. Give the larger solution in exact form.',
      a: '-1+2*sqrt(2)',
      form: 'radical',
      steps: [
        'Move the constant: x² + 2x = 7. Add 1 to both sides.',
        '(x + 1)² = 8.',
        'Take square roots: x + 1 = ±√8 = ±2√2, so x = −1 ± 2√2.',
        'The larger solution is −1 + 2√2.',
        'Answer: −1 + 2√2',
      ],
    },
    {
      q: 'Solve x² + 8x + 5 = 0 by completing the square. Give the smaller solution in exact form.',
      a: '-4-1*sqrt(11)',
      form: 'radical',
      steps: [
        'Move the constant: x² + 8x = −5. Add 16 to both sides.',
        '(x + 4)² = 11.',
        'Take square roots: x + 4 = ±√11, so x = −4 ± √11.',
        'The smaller solution is −4 − √11.',
        'Answer: −4 − √11',
      ],
    },
    {
      q: 'Complete the square to write y = 2x² + 8x + 1 as y = a(x − h)² + k. Find k.',
      a: '-7',
      steps: [
        'Take 2 out of the first two terms: 2(x² + 4x) + 1. Half of 4 is 2; 2² = 4.',
        'Add and subtract 4 inside; the subtracted part leaves the bracket times 2: y = 2(x + 2)² − 7.',
        'h = −2 and k = −7.',
        'Answer: −7',
      ],
    },
    {
      q: 'Solve x² − 4x + 1 = 0 by completing the square. Give the smaller solution in exact form.',
      a: '2-1*sqrt(3)',
      form: 'radical',
      steps: [
        'Move the constant: x² − 4x = −1. Add 4 to both sides.',
        '(x − 2)² = 3.',
        'Take square roots: x − 2 = ±√3, so x = 2 ± √3.',
        'The smaller solution is 2 − √3.',
        'Answer: 2 − √3',
      ],
    },
    {
      q: 'Solve x² + 10x + 20 = 0 by completing the square. Give the larger solution in exact form.',
      a: '-5+1*sqrt(5)',
      form: 'radical',
      steps: [
        'Move the constant: x² + 10x = −20. Add 25 to both sides.',
        '(x + 5)² = 5.',
        'Take square roots: x + 5 = ±√5, so x = −5 ± √5.',
        'The larger solution is −5 + √5.',
        'Answer: −5 + √5',
      ],
    },
    {
      q: 'Complete the square to write y = 3x² − 12x + 5 as y = a(x − h)² + k. Find h.',
      a: '2',
      steps: [
        'Take 3 out of the first two terms: 3(x² − 4x) + 5. Half of −4 is −2; (−2)² = 4.',
        'Add and subtract 4 inside; the subtracted part leaves the bracket times 3: y = 3(x − 2)² − 7.',
        'h = 2 and k = −7.',
        'Answer: 2',
      ],
    },
    {
      q: 'Solve x² − 8x + 4 = 0 by completing the square. Give the larger solution in exact form.',
      a: '4+2*sqrt(3)',
      form: 'radical',
      steps: [
        'Move the constant: x² − 8x = −4. Add 16 to both sides.',
        '(x − 4)² = 12.',
        'Take square roots: x − 4 = ±√12 = ±2√3, so x = 4 ± 2√3.',
        'The larger solution is 4 + 2√3.',
        'Answer: 4 + 2√3',
      ],
    },
    {
      q: 'Solve x² + 6x − 16 = 0 by completing the square. Give the smaller solution.',
      a: '-8',
      steps: [
        'Move the constant: x² + 6x = 16. Add 9 to both sides.',
        '(x + 3)² = 25.',
        'Take square roots: x + 3 = ±5, so x = −3 ± 5.',
        'The smaller solution is −8.',
        'Answer: −8',
      ],
    },
    {
      q: 'Solve x² − 10x − 1 = 0 by completing the square. Give the larger solution in exact form.',
      a: '5+1*sqrt(26)',
      form: 'radical',
      steps: [
        'Move the constant: x² − 10x = 1. Add 25 to both sides.',
        '(x − 5)² = 26.',
        'Take square roots: x − 5 = ±√26, so x = 5 ± √26.',
        'The larger solution is 5 + √26.',
        'Answer: 5 + √26',
      ],
    },
    {
      q: 'Complete the square to write y = −x² + 6x − 5 as y = a(x − h)² + k. Find k.',
      a: '4',
      steps: [
        'Take −1 out of the first two terms: −1(x² − 6x) − 5. Half of −6 is −3; (−3)² = 9.',
        'Add and subtract 9 inside; the subtracted part leaves the bracket times −1: y = −1(x − 3)² + 4.',
        'h = 3 and k = 4.',
        'Answer: 4',
      ],
    },
    {
      q: 'Complete the square to write y = −3x² + 12x − 7 as y = a(x − h)² + k. Find k.',
      a: '5',
      steps: [
        'Take −3 out of the first two terms: −3(x² − 4x) − 7. Half of −4 is −2; (−2)² = 4.',
        'Add and subtract 4 inside; the subtracted part leaves the bracket times −3: y = −3(x − 2)² + 5.',
        'h = 2 and k = 5.',
        'Answer: 5',
      ],
    },
    {
      q: 'The vertex of y = x² − 8x + 20 is (h, k). Find k.',
      a: '4',
      steps: [
        'Half of −8 is −4; (−4)² = 16.',
        'y = (x² − 8x + 16) + 4 = (x − 4)² + 4.',
        'Answer: 4',
      ],
    },
    {
      q: '(x − 3)² = 25. Find the larger solution.',
      a: '8',
      steps: [
        'Square root both sides: x − 3 = 5 or x − 3 = −5.',
        'x = 8 or x = −2.',
        'The larger is 8.',
        'Answer: 8',
      ],
    },
  ],
  formula: [
    {
      q: 'Use the quadratic formula to solve x² − 5x + 6 = 0. Give the larger solution.',
      a: '3',
      steps: [
        'a = 1, b = −5, c = 6.',
        'b² − 4ac = 25 − 24 = 1.',
        '√1 = 1, so x = (5 ± 1) ÷ 2.',
        'x = 3 or x = 2.',
        'The larger solution is 3.',
        'Answer: 3',
      ],
    },
    {
      q: 'Use the quadratic formula to solve x² − 5x + 6 = 0. Give the smaller solution.',
      a: '2',
      steps: [
        'a = 1, b = −5, c = 6.',
        'b² − 4ac = 25 − 24 = 1.',
        '√1 = 1, so x = (5 ± 1) ÷ 2.',
        'x = 3 or x = 2.',
        'The smaller solution is 2.',
        'Answer: 2',
      ],
    },
    {
      q: 'Use the quadratic formula to solve x² + 3x − 10 = 0. Give the smaller solution.',
      a: '-5',
      steps: [
        'a = 1, b = 3, c = −10.',
        'b² − 4ac = 9 − (−40) = 49.',
        '√49 = 7, so x = (−3 ± 7) ÷ 2.',
        'x = 2 or x = −5.',
        'The smaller solution is −5.',
        'Answer: −5',
      ],
    },
    {
      q: 'Use the quadratic formula to solve x² − x − 12 = 0. Give the larger solution.',
      a: '4',
      steps: [
        'a = 1, b = −1, c = −12.',
        'b² − 4ac = 1 − (−48) = 49.',
        '√49 = 7, so x = (1 ± 7) ÷ 2.',
        'x = 4 or x = −3.',
        'The larger solution is 4.',
        'Answer: 4',
      ],
    },
    {
      q: 'Use the quadratic formula to solve 2x² − 7x + 3 = 0. Give the larger solution.',
      a: '3',
      steps: [
        'a = 2, b = −7, c = 3.',
        'b² − 4ac = 49 − 24 = 25.',
        '√25 = 5, so x = (7 ± 5) ÷ 4.',
        'x = 3 or x = 1/2.',
        'The larger solution is 3.',
        'Answer: 3',
      ],
    },
    {
      q: 'Use the quadratic formula to solve 2x² − 7x + 3 = 0. Give the smaller solution.',
      a: '1/2',
      steps: [
        'a = 2, b = −7, c = 3.',
        'b² − 4ac = 49 − 24 = 25.',
        '√25 = 5, so x = (7 ± 5) ÷ 4.',
        'x = 3 or x = 1/2.',
        'The smaller solution is 1/2.',
        'Answer: 1/2',
      ],
    },
    {
      q: 'Use the quadratic formula to solve x² − 6x − 8 = 0. Give the larger solution in exact form.',
      a: '3+1*sqrt(17)',
      form: 'radical',
      steps: [
        'a = 1, b = −6, c = −8.',
        'b² − 4ac = 36 − (−32) = 68.',
        '√68 = 2√17, so x = (6 ± 2√17) ÷ 2.',
        'Simplify by dividing every term by their common factor.',
        'The larger solution is 3 + √17.',
        'Answer: 3 + √17',
      ],
    },
    {
      q: 'Use the quadratic formula to solve x² + 4x + 1 = 0. Give the larger solution in exact form.',
      a: '-2+1*sqrt(3)',
      form: 'radical',
      steps: [
        'a = 1, b = 4, c = 1.',
        'b² − 4ac = 16 − 4 = 12.',
        '√12 = 2√3, so x = (−4 ± 2√3) ÷ 2.',
        'Simplify by dividing every term by their common factor.',
        'The larger solution is −2 + √3.',
        'Answer: −2 + √3',
      ],
    },
    {
      q: 'Use the quadratic formula to solve x² − 2x − 5 = 0. Give the larger solution in exact form.',
      a: '1+1*sqrt(6)',
      form: 'radical',
      steps: [
        'a = 1, b = −2, c = −5.',
        'b² − 4ac = 4 − (−20) = 24.',
        '√24 = 2√6, so x = (2 ± 2√6) ÷ 2.',
        'Simplify by dividing every term by their common factor.',
        'The larger solution is 1 + √6.',
        'Answer: 1 + √6',
      ],
    },
    {
      q: 'Use the quadratic formula to solve 3x² + 10x + 3 = 0. Give the smaller solution.',
      a: '-3',
      steps: [
        'a = 3, b = 10, c = 3.',
        'b² − 4ac = 100 − 36 = 64.',
        '√64 = 8, so x = (−10 ± 8) ÷ 6.',
        'x = −1/3 or x = −3.',
        'The smaller solution is −3.',
        'Answer: −3',
      ],
    },
    {
      q: 'Use the quadratic formula to solve 2x² + 5x + 1 = 0. Give the larger solution in exact form.',
      a: '(-5+1*sqrt(17))/4',
      form: 'radical',
      steps: [
        'a = 2, b = 5, c = 1.',
        'b² − 4ac = 25 − 8 = 17.',
        '√17, so x = (−5 ± √17) ÷ 4.',
        'Simplify by dividing every term by their common factor.',
        'The larger solution is (−5 + √17)/4.',
        'Answer: (−5 + √17)/4',
      ],
    },
    {
      q: 'Use the quadratic formula to solve 2x² − 6x + 3 = 0. Give the larger solution in exact form.',
      a: '(3+1*sqrt(3))/2',
      form: 'radical',
      steps: [
        'a = 2, b = −6, c = 3.',
        'b² − 4ac = 36 − 24 = 12.',
        '√12 = 2√3, so x = (6 ± 2√3) ÷ 4.',
        'Simplify by dividing every term by their common factor.',
        'The larger solution is (3 + √3)/2.',
        'Answer: (3 + √3)/2',
      ],
    },
    {
      q: 'Use the quadratic formula to solve −x² + 4x + 3 = 0. Give the larger solution in exact form.',
      a: '2+1*sqrt(7)',
      form: 'radical',
      steps: [
        'a = −1, b = 4, c = 3.',
        'b² − 4ac = 16 − (−12) = 28.',
        '√28 = 2√7, so x = (−4 ± 2√7) ÷ −2.',
        'Simplify by dividing every term by their common factor.',
        'The larger solution is 2 + √7.',
        'Answer: 2 + √7',
      ],
    },
    {
      q: 'Use the quadratic formula to solve 3x² − 4x − 2 = 0. Give the larger solution in exact form.',
      a: '(2+1*sqrt(10))/3',
      form: 'radical',
      steps: [
        'a = 3, b = −4, c = −2.',
        'b² − 4ac = 16 − (−24) = 40.',
        '√40 = 2√10, so x = (4 ± 2√10) ÷ 6.',
        'Simplify by dividing every term by their common factor.',
        'The larger solution is (2 + √10)/3.',
        'Answer: (2 + √10)/3',
      ],
    },
    {
      q: 'Use the quadratic formula to solve 5x² − 3x − 1 = 0. Give the larger solution in exact form.',
      a: '(3+1*sqrt(29))/10',
      form: 'radical',
      steps: [
        'a = 5, b = −3, c = −1.',
        'b² − 4ac = 9 − (−20) = 29.',
        '√29, so x = (3 ± √29) ÷ 10.',
        'Simplify by dividing every term by their common factor.',
        'The larger solution is (3 + √29)/10.',
        'Answer: (3 + √29)/10',
      ],
    },
    {
      q: 'Use the quadratic formula to solve x² − 8x + 13 = 0. Give the smaller solution in exact form.',
      a: '4-1*sqrt(3)',
      form: 'radical',
      steps: [
        'a = 1, b = −8, c = 13.',
        'b² − 4ac = 64 − 52 = 12.',
        '√12 = 2√3, so x = (8 ± 2√3) ÷ 2.',
        'Simplify by dividing every term by their common factor.',
        'The smaller solution is 4 − √3.',
        'Answer: 4 − √3',
      ],
    },
    {
      q: 'Use the quadratic formula to solve 4x² − 4x − 1 = 0. Give the larger solution in exact form.',
      a: '(1+1*sqrt(2))/2',
      form: 'radical',
      steps: [
        'a = 4, b = −4, c = −1.',
        'b² − 4ac = 16 − (−16) = 32.',
        '√32 = 4√2, so x = (4 ± 4√2) ÷ 8.',
        'Simplify by dividing every term by their common factor.',
        'The larger solution is (1 + √2)/2.',
        'Answer: (1 + √2)/2',
      ],
    },
    {
      q: 'Use the quadratic formula to solve 2x² + 3x − 5 = 0. Give the smaller solution.',
      a: '-5/2',
      steps: [
        'a = 2, b = 3, c = −5.',
        'b² − 4ac = 9 − (−40) = 49.',
        '√49 = 7, so x = (−3 ± 7) ÷ 4.',
        'x = 1 or x = −5/2.',
        'The smaller solution is −5/2.',
        'Answer: −5/2',
      ],
    },
    {
      q: 'Use the quadratic formula to solve 6x² − 5x − 6 = 0. Give the larger solution.',
      a: '3/2',
      steps: [
        'a = 6, b = −5, c = −6.',
        'b² − 4ac = 25 − (−144) = 169.',
        '√169 = 13, so x = (5 ± 13) ÷ 12.',
        'x = 3/2 or x = −2/3.',
        'The larger solution is 3/2.',
        'Answer: 3/2',
      ],
    },
    {
      q: 'Use the quadratic formula to solve x² + 6x + 7 = 0. Give the smaller solution in exact form.',
      a: '-3-1*sqrt(2)',
      form: 'radical',
      steps: [
        'a = 1, b = 6, c = 7.',
        'b² − 4ac = 36 − 28 = 8.',
        '√8 = 2√2, so x = (−6 ± 2√2) ÷ 2.',
        'Simplify by dividing every term by their common factor.',
        'The smaller solution is −3 − √2.',
        'Answer: −3 − √2',
      ],
    },
    {
      q: 'Use the quadratic formula to solve −2x² + 3x + 5 = 0. Give the larger solution.',
      a: '5/2',
      steps: [
        'a = −2, b = 3, c = 5.',
        'b² − 4ac = 9 − (−40) = 49.',
        '√49 = 7, so x = (−3 ± 7) ÷ −4.',
        'x = −1 or x = 5/2.',
        'The larger solution is 5/2.',
        'Answer: 5/2',
      ],
    },
    {
      q: 'Use the quadratic formula to solve 3x² − 7x + 2 = 0. Give the smaller solution.',
      a: '1/3',
      steps: [
        'a = 3, b = −7, c = 2.',
        'b² − 4ac = 49 − 24 = 25.',
        '√25 = 5, so x = (7 ± 5) ÷ 6.',
        'x = 2 or x = 1/3.',
        'The smaller solution is 1/3.',
        'Answer: 1/3',
      ],
    },
    {
      q: 'The solutions of x² − 6x + 7 = 0 are 3 ± √k. Find k.',
      a: '2',
      steps: [
        'a = 1, b = −6, c = 7: b² − 4ac = 36 − 28 = 8.',
        'x = (6 ± √8) ÷ 2 and √8 = 2√2, so x = 3 ± √2.',
        'k = 2.',
        'Answer: 2',
      ],
    },
    {
      q: 'Find the sum of the two solutions of 2x² − 9x + 4 = 0.',
      a: '9/2',
      steps: [
        'b² − 4ac = 81 − 32 = 49, so x = (9 ± 7) ÷ 4 = 4 or 1/2.',
        'Sum: 4 + 1/2 = 9/2.',
        'Answer: 9/2',
      ],
    },
    {
      q: 'Find the product of the two solutions of 3x² + x − 10 = 0.',
      a: '-10/3',
      steps: [
        'b² − 4ac = 1 + 120 = 121, so x = (−1 ± 11) ÷ 6 = 5/3 or −2.',
        'Product: (5/3)(−2) = −10/3.',
        'Answer: −10/3',
      ],
    },
  ],
  discriminant: [
    {
      q: 'Find the discriminant b² − 4ac of x² − 6x + 8 = 0.',
      a: '4',
      steps: ['a = 1, b = −6, c = 8.', 'b² = 36 and 4ac = 32.', '36 − 32 = 4.', 'Answer: 4'],
    },
    {
      q: 'Find the discriminant b² − 4ac of x² + 2x + 5 = 0.',
      a: '-16',
      steps: ['a = 1, b = 2, c = 5.', 'b² = 4 and 4ac = 20.', '4 − 20 = −16.', 'Answer: −16'],
    },
    {
      q: 'How many real solutions does x² − 6x + 8 = 0 have? (Enter 0, 1 or 2.)',
      a: '2',
      steps: ['b² − 4ac = 36 − 32 = 4.', 'Positive: two real solutions.', 'Answer: 2'],
    },
    {
      q: 'How many real solutions does x² + 2x + 5 = 0 have? (Enter 0, 1 or 2.)',
      a: '0',
      steps: ['b² − 4ac = 4 − 20 = −16.', 'Negative: no real solutions.', 'Answer: 0'],
    },
    {
      q: 'How many real solutions does x² − 6x + 9 = 0 have? (Enter 0, 1 or 2.)',
      a: '1',
      steps: ['b² − 4ac = 36 − 36 = 0.', 'Zero: exactly one real solution.', 'Answer: 1'],
    },
    {
      q: 'Find the discriminant b² − 4ac of 2x² − 3x − 5 = 0.',
      a: '49',
      steps: ['a = 2, b = −3, c = −5.', 'b² = 9 and 4ac = −40.', '9 − (−40) = 49.', 'Answer: 49'],
    },
    {
      q: 'How many real solutions does 2x² − 3x − 5 = 0 have? (Enter 0, 1 or 2.)',
      a: '2',
      steps: ['b² − 4ac = 9 − (−40) = 49.', 'Positive: two real solutions.', 'Answer: 2'],
    },
    {
      q: 'Does x² − 3x − 10 = 0 have two rational solutions? Enter 1 for yes and 0 for no.',
      a: '1',
      steps: [
        'b² − 4ac = 9 − (−40) = 49.',
        '49 = 7² is a perfect square, so both solutions are rational.',
        'Answer: 1',
      ],
    },
    {
      q: 'Does x² − 6x − 8 = 0 have two rational solutions? Enter 1 for yes and 0 for no.',
      a: '0',
      steps: [
        'b² − 4ac = 36 − (−32) = 68.',
        '68 is not a perfect square, so the solutions are irrational.',
        'Answer: 0',
      ],
    },
    {
      q: 'Does x² − 4 = 0 have two rational solutions? Enter 1 for yes and 0 for no.',
      a: '1',
      steps: [
        'b² − 4ac = 0 − (−16) = 16.',
        '16 = 4² is a perfect square, so both solutions are rational.',
        'Answer: 1',
      ],
    },
    {
      q: 'For what value of k does x² − 6x + k = 0 have exactly one real solution?',
      a: '9',
      steps: [
        'One solution means the discriminant is 0: b² − 4ac = 36 − 4k = 0.',
        '4k = 36, so k = 9.',
        'Answer: 9',
      ],
    },
    {
      q: 'For what value of k does x² + 10x + k = 0 have exactly one real solution?',
      a: '25',
      steps: [
        'One solution means the discriminant is 0: b² − 4ac = 100 − 4k = 0.',
        '4k = 100, so k = 25.',
        'Answer: 25',
      ],
    },
    {
      q: 'What is the smallest integer k for which x² + 4x + k = 0 has no real solutions?',
      a: '5',
      steps: [
        'No real solutions means b² − 4ac < 0: 16 − 4k < 0.',
        '4k > 16, so k > 4.',
        'The smallest integer above 4 is 5.',
        'Answer: 5',
      ],
    },
    {
      q: 'What is the smallest integer k for which x² − 6x + k = 0 has no real solutions?',
      a: '10',
      steps: [
        'No real solutions means b² − 4ac < 0: 36 − 4k < 0.',
        '4k > 36, so k > 9.',
        'The smallest integer above 9 is 10.',
        'Answer: 10',
      ],
    },
    {
      q: 'Find the discriminant b² − 4ac of −3x² + 2x + 1 = 0.',
      a: '16',
      steps: ['a = −3, b = 2, c = 1.', 'b² = 4 and 4ac = −12.', '4 − (−12) = 16.', 'Answer: 16'],
    },
    {
      q: 'How many real solutions does 3x² − 2x + 1 = 0 have? (Enter 0, 1 or 2.)',
      a: '0',
      steps: ['b² − 4ac = 4 − 12 = −8.', 'Negative: no real solutions.', 'Answer: 0'],
    },
    {
      q: 'How many real solutions does −x² + 2x − 1 = 0 have? (Enter 0, 1 or 2.)',
      a: '1',
      steps: ['b² − 4ac = 4 − 4 = 0.', 'Zero: exactly one real solution.', 'Answer: 1'],
    },
    {
      q: 'The discriminant of 2x² + 5x + 2 = 0 is 9. Does the quadratic factor with whole numbers? Enter 1 for yes and 0 for no.',
      a: '1',
      steps: [
        'A discriminant that is a perfect square means the solutions are rational and the quadratic factors.',
        '9 = 3², so it is a perfect square.',
        'Answer: 1',
      ],
    },
    {
      q: 'The discriminant of 2x² + 3x + 4 = 0 is −23. Does the quadratic factor with whole numbers? Enter 1 for yes and 0 for no.',
      a: '0',
      steps: [
        'A discriminant that is a perfect square means the solutions are rational and the quadratic factors.',
        '−23 is not a perfect square, so it does not factor.',
        'Answer: 0',
      ],
    },
    {
      q: 'For what value of k does x² + 8x + k = 0 have exactly one real solution?',
      a: '16',
      steps: [
        'One solution means the discriminant is 0: b² − 4ac = 64 − 4k = 0.',
        '4k = 64, so k = 16.',
        'Answer: 16',
      ],
    },
    {
      q: 'x² + kx + 9 = 0 has exactly one solution and k > 0. Find k.',
      a: '6',
      steps: ['One solution means k² − 4(1)(9) = 0.', 'k² = 36, so k = 6 (k > 0).', 'Answer: 6'],
    },
    {
      q: '4x² − 12x + c = 0 has exactly one solution. Find c.',
      a: '9',
      steps: [
        'The discriminant is 0: (−12)² − 4(4)c = 0.',
        '144 − 16c = 0, so c = 9.',
        'Answer: 9',
      ],
    },
    {
      q: 'kx² + 4x + 1 = 0 has exactly one solution. Find k.',
      a: '4',
      steps: ['The discriminant is 0: 4² − 4(k)(1) = 0.', '16 − 4k = 0, so k = 4.', 'Answer: 4'],
    },
    {
      q: 'x² − 4x + k = 0 has two real solutions. What is the largest integer k can be?',
      a: '3',
      steps: [
        'Two real solutions means the discriminant is positive: 16 − 4k > 0.',
        'k < 4.',
        'The largest integer below 4 is 3.',
        'Answer: 3',
      ],
    },
    {
      q: 'How many x-intercepts does y = −x² + 4x − 5 have?',
      a: '0',
      steps: [
        'x-intercepts are real solutions of −x² + 4x − 5 = 0.',
        'b² − 4ac = 16 − 4(−1)(−5) = 16 − 20 = −4, which is negative.',
        'No real solutions, so no x-intercepts. The parabola opens down with its vertex below the x-axis.',
        'Answer: 0',
      ],
    },
  ],
  'find-vertex': [
    {
      q: 'Find the x-coordinate of the vertex of y = x² − 6x + 8.',
      a: '3',
      steps: ['Use x = −b ÷ 2a.', 'x = 6 ÷ 2 = 3.', 'Answer: 3'],
      fig: {
        kind: 'grid',
        x: [-1, 7],
        y: [-2, 11],
        quad: [
          {
            a: 1,
            b: -6,
            c: 8,
          },
        ],
        free: true,
      },
    },
    {
      q: 'Find the y-coordinate of the vertex of y = x² − 6x + 8.',
      a: '-1',
      steps: [
        'The vertex has x = 6 ÷ 2 = 3.',
        'Put it back into the equation: (3)² − 6(3) + 8 = −1.',
        'Answer: −1',
      ],
    },
    {
      q: 'Find the x-coordinate of the vertex of y = x² + 4x − 5.',
      a: '-2',
      steps: ['Use x = −b ÷ 2a.', 'x = −4 ÷ 2 = −2.', 'Answer: −2'],
      fig: {
        kind: 'grid',
        x: [-6, 2],
        y: [-10, 3],
        quad: [
          {
            a: 1,
            b: 4,
            c: -5,
          },
        ],
        free: true,
      },
    },
    {
      q: 'Find the x-coordinate of the vertex of y = 2x² − 12x + 10.',
      a: '3',
      steps: ['Use x = −b ÷ 2a.', 'x = 12 ÷ 4 = 3.', 'Answer: 3'],
      fig: {
        kind: 'grid',
        x: [-1, 7],
        y: [-9, 4],
        quad: [
          {
            a: 2,
            b: -12,
            c: 10,
          },
        ],
        free: true,
      },
    },
    {
      q: 'Find the y-coordinate of the vertex of y = 2x² − 12x + 10.',
      a: '-8',
      steps: [
        'The vertex has x = 12 ÷ 4 = 3.',
        'Put it back into the equation: 2(3)² − 12(3) + 10 = −8.',
        'Answer: −8',
      ],
    },
    {
      q: 'What is the minimum value of y = x² − 2x + 5?',
      a: '4',
      steps: [
        'a = 1 so the vertex is the lowest point.',
        'Vertex x = 2 ÷ 2 = 1.',
        'Put it back in: (1)² − 2(1) + 5 = 4, the minimum.',
        'Answer: 4',
      ],
    },
    {
      q: 'What is the maximum value of y = −x² + 6x + 2?',
      a: '11',
      steps: [
        'a = −1 so the vertex is the highest point.',
        'Vertex x = −6 ÷ −2 = 3.',
        'Put it back in: −1(3)² + 6(3) + 2 = 11, the maximum.',
        'Answer: 11',
      ],
    },
    {
      q: 'Find the x-coordinate of the vertex of y = −3x² + 12x + 1.',
      a: '2',
      steps: ['Use x = −b ÷ 2a.', 'x = −12 ÷ −6 = 2.', 'Answer: 2'],
      fig: {
        kind: 'grid',
        x: [-2, 6],
        y: [1, 14],
        quad: [
          {
            a: -3,
            b: 12,
            c: 1,
          },
        ],
        free: true,
      },
    },
    {
      q: 'The parabola y = x² + 2x − 8 crosses the x-axis at −4 and 2. Find the x-coordinate of its vertex.',
      a: '-1',
      steps: [
        'The vertex is halfway between the x-intercepts.',
        '(−4 + 2) ÷ 2 = −1.',
        'Check with −b ÷ 2a = −2 ÷ 2 = −1.',
        'Answer: −1',
      ],
    },
    {
      q: 'The parabola y = 2x² − 16x + 14 crosses the x-axis at 1 and 7. Find the x-coordinate of its vertex.',
      a: '4',
      steps: [
        'The vertex is halfway between the x-intercepts.',
        '(1 + 7) ÷ 2 = 4.',
        'Check with −b ÷ 2a = 16 ÷ 4 = 4.',
        'Answer: 4',
      ],
    },
    {
      q: 'The parabola y = x² + bx + 2 has its vertex at x = 3. Find b.',
      a: '-6',
      steps: ['The vertex is at x = −b ÷ 2a.', '3 = −b ÷ 2, so b = −6.', 'Answer: −6'],
    },
    {
      q: 'The vertex of y = x² − 6x + 8 is at x = 3. Find its y-coordinate.',
      a: '-1',
      steps: ['Put x = 3 into the equation.', '(3)² − 6(3) + 8 = −1.', 'Answer: −1'],
    },
    {
      q: 'Find the y-coordinate of the vertex of y = −2x² + 8x − 3.',
      a: '5',
      steps: [
        'The vertex has x = −8 ÷ −4 = 2.',
        'Put it back into the equation: −2(2)² + 8(2) − 3 = 5.',
        'Answer: 5',
      ],
    },
    {
      q: 'Find the x-coordinate of the vertex of y = x² + 3x + 1.',
      a: '-3/2',
      steps: ['Use x = −b ÷ 2a.', 'x = −3 ÷ 2 = −3/2.', 'Answer: −3/2'],
      fig: {
        kind: 'grid',
        x: [-6, 3],
        y: [-3, 11],
        quad: [
          {
            a: 1,
            b: 3,
            c: 1,
          },
        ],
        free: true,
      },
    },
    {
      q: 'Find the y-coordinate of the vertex of y = x² + 3x + 1.',
      a: '-5/4',
      steps: [
        'The vertex has x = −3 ÷ 2 = −3/2.',
        'Put it back into the equation: (−3/2)² + 3(−3/2) + 1 = −5/4.',
        'Answer: −5/4',
      ],
    },
    {
      q: 'What is the minimum value of y = 2x² − 5x + 3?',
      a: '-1/8',
      steps: [
        'a = 2 so the vertex is the lowest point.',
        'Vertex x = 5 ÷ 4 = 5/4.',
        'Put it back in: 2(5/4)² − 5(5/4) + 3 = −1/8, the minimum.',
        'Answer: −1/8',
      ],
    },
    {
      q: 'What is the maximum value of y = −4x² + 4x?',
      a: '1',
      steps: [
        'a = −4 so the vertex is the highest point.',
        'Vertex x = −4 ÷ −8 = 1/2.',
        'Put it back in: −4(1/2)² + 4(1/2) + 0 = 1, the maximum.',
        'Answer: 1',
      ],
    },
    {
      q: 'The parabola y = 2x² + bx + 5 has its vertex at x = −1. Find b.',
      a: '4',
      steps: ['The vertex is at x = −b ÷ 2a.', '−1 = −b ÷ 4, so b = 4.', 'Answer: 4'],
    },
    {
      q: 'The parabola y = −x² + 2x + 15 crosses the x-axis at −3 and 5. Find the x-coordinate of its vertex.',
      a: '1',
      steps: [
        'The vertex is halfway between the x-intercepts.',
        '(−3 + 5) ÷ 2 = 1.',
        'Check with −b ÷ 2a = −2 ÷ −2 = 1.',
        'Answer: 1',
      ],
    },
    {
      q: 'A ball’s height is h = −5t² + 20t + 1 metres after t seconds. What is its greatest height?',
      a: '21',
      steps: [
        'The vertex is at t = −b ÷ 2a = −20 ÷ (−10) = 2.',
        'h = −5(4) + 20(2) + 1 = −20 + 40 + 1 = 21.',
        'Answer: 21 metres',
      ],
    },
    {
      q: 'A ball’s height is h = −5t² + 30t metres. At what time is it highest?',
      a: '3',
      steps: ['t = −b ÷ 2a = −30 ÷ (−10).', '= 3.', 'Answer: 3 seconds'],
    },
    {
      q: 'h = −t² + 8t + 9. What is the maximum height?',
      a: '25',
      steps: ['t = −8 ÷ (−2) = 4.', 'h = −16 + 32 + 9 = 25.', 'Answer: 25'],
    },
    {
      q: 'A rectangle has perimeter 40 m. Its width is w and its length is 20 − w, so its area is A = w(20 − w). What is the greatest area?',
      a: '100',
      steps: [
        'A = −w² + 20w, a parabola opening down.',
        'Vertex: w = −20 ÷ (−2) = 10.',
        'A = 10 × 10 = 100.',
        'Answer: 100 m²',
      ],
    },
    {
      q: 'Two numbers add to 12. What is the largest possible product?',
      a: '36',
      steps: [
        'The numbers are x and 12 − x: product P = x(12 − x) = −x² + 12x.',
        'Vertex: x = −12 ÷ (−2) = 6.',
        'P = 6 × 6 = 36.',
        'Answer: 36',
      ],
    },
    {
      q: 'Revenue is R = −2p² + 40p dollars when the price is p dollars. At what price is revenue greatest?',
      a: '10',
      steps: ['The vertex: p = −40 ÷ (2 × −2) = 10.', 'Answer: 10 dollars'],
    },
  ],
};
