import type { GuideProblem } from './guide-problem';

/** 25 problems per Inequalities chapter, simple to complex: 1–8 warm-up, 9–17 core, 18–25 challenge. Generated from small templates, so every answer is computed. */
export const INEQUALITIES_PROBLEMS: Record<string, GuideProblem[]> = {
  symbols: [
    {
      q: 'The inequality x > −7 is true for which of these: −7 or −6? Type the number that works.',
      a: '-6',
      steps: [
        'x > −7 means strictly greater than −7.',
        '−7 is equal to −7, so it is not greater.',
        '−6 is greater than −7.',
        'Answer: −6',
      ],
    },
    {
      q: 'Is −7 a solution of x ≥ −7? Type 1 for yes, 0 for no.',
      a: '1',
      steps: ['≥ includes equals, so −7 is in the solution set.', 'Answer: 1'],
    },
    {
      q: 'Is −7 a solution of x > −7? Type 1 for yes, 0 for no.',
      a: '0',
      steps: ['> does not include equals, so −7 is not a solution.', 'Answer: 0'],
    },
    {
      q: 'The interval for x ≤ −7 has its finite end at what number?',
      a: '-7',
      steps: ['x ≤ −7 is (−∞, −7], so the finite end is −7.', 'Answer: −7'],
    },
    {
      q: 'How many of the integers from −9 to −5 make x < −7 true?',
      a: '2',
      steps: [
        'x < −7 keeps the integers strictly less than −7.',
        'From −9 to −5 that is −9 and −8.',
        'Answer: 2',
      ],
    },
    {
      q: 'The inequality x > −6 is true for which of these: −6 or −5? Type the number that works.',
      a: '-5',
      steps: [
        'x > −6 means strictly greater than −6.',
        '−6 is equal to −6, so it is not greater.',
        '−5 is greater than −6.',
        'Answer: −5',
      ],
    },
    {
      q: 'Is −6 a solution of x ≥ −6? Type 1 for yes, 0 for no.',
      a: '1',
      steps: ['≥ includes equals, so −6 is in the solution set.', 'Answer: 1'],
    },
    {
      q: 'Is −6 a solution of x > −6? Type 1 for yes, 0 for no.',
      a: '0',
      steps: ['> does not include equals, so −6 is not a solution.', 'Answer: 0'],
    },
    {
      q: 'The interval for x ≤ −6 has its finite end at what number?',
      a: '-6',
      steps: ['x ≤ −6 is (−∞, −6], so the finite end is −6.', 'Answer: −6'],
    },
    {
      q: 'How many of the integers from −8 to −4 make x < −6 true?',
      a: '2',
      steps: [
        'x < −6 keeps the integers strictly less than −6.',
        'From −8 to −4 that is −8 and −7.',
        'Answer: 2',
      ],
    },
    {
      q: 'The inequality x > −2 is true for which of these: −2 or −1? Type the number that works.',
      a: '-1',
      steps: [
        'x > −2 means strictly greater than −2.',
        '−2 is equal to −2, so it is not greater.',
        '−1 is greater than −2.',
        'Answer: −1',
      ],
    },
    {
      q: 'Is −2 a solution of x ≥ −2? Type 1 for yes, 0 for no.',
      a: '1',
      steps: ['≥ includes equals, so −2 is in the solution set.', 'Answer: 1'],
    },
    {
      q: 'Is −2 a solution of x > −2? Type 1 for yes, 0 for no.',
      a: '0',
      steps: ['> does not include equals, so −2 is not a solution.', 'Answer: 0'],
    },
    {
      q: 'The interval for x ≤ −2 has its finite end at what number?',
      a: '-2',
      steps: ['x ≤ −2 is (−∞, −2], so the finite end is −2.', 'Answer: −2'],
    },
    {
      q: 'How many of the integers from −4 to 0 make x < −2 true?',
      a: '2',
      steps: [
        'x < −2 keeps the integers strictly less than −2.',
        'From −4 to 0 that is −4 and −3.',
        'Answer: 2',
      ],
    },
    {
      q: 'The inequality x > 11 is true for which of these: 11 or 12? Type the number that works.',
      a: '12',
      steps: [
        'x > 11 means strictly greater than 11.',
        '11 is equal to 11, so it is not greater.',
        '12 is greater than 11.',
        'Answer: 12',
      ],
    },
    {
      q: 'Is 11 a solution of x ≥ 11? Type 1 for yes, 0 for no.',
      a: '1',
      steps: ['≥ includes equals, so 11 is in the solution set.', 'Answer: 1'],
    },
    {
      q: 'Is 11 a solution of x > 11? Type 1 for yes, 0 for no.',
      a: '0',
      steps: ['> does not include equals, so 11 is not a solution.', 'Answer: 0'],
    },
    {
      q: 'The interval for x ≤ 11 has its finite end at what number?',
      a: '11',
      steps: ['x ≤ 11 is (−∞, 11], so the finite end is 11.', 'Answer: 11'],
    },
    {
      q: 'How many of the integers from 9 to 13 make x < 11 true?',
      a: '2',
      steps: [
        'x < 11 keeps the integers strictly less than 11.',
        'From 9 to 13 that is 9 and 10.',
        'Answer: 2',
      ],
    },
    {
      q: 'The inequality x > 12 is true for which of these: 12 or 13? Type the number that works.',
      a: '13',
      steps: [
        'x > 12 means strictly greater than 12.',
        '12 is equal to 12, so it is not greater.',
        '13 is greater than 12.',
        'Answer: 13',
      ],
    },
    {
      q: 'Is 12 a solution of x ≥ 12? Type 1 for yes, 0 for no.',
      a: '1',
      steps: ['≥ includes equals, so 12 is in the solution set.', 'Answer: 1'],
    },
    {
      q: 'Is 12 a solution of x > 12? Type 1 for yes, 0 for no.',
      a: '0',
      steps: ['> does not include equals, so 12 is not a solution.', 'Answer: 0'],
    },
    {
      q: 'The interval for x ≤ 12 has its finite end at what number?',
      a: '12',
      steps: ['x ≤ 12 is (−∞, 12], so the finite end is 12.', 'Answer: 12'],
    },
    {
      q: 'How many of the integers from 10 to 14 make x < 12 true?',
      a: '2',
      steps: [
        'x < 12 keeps the integers strictly less than 12.',
        'From 10 to 14 that is 10 and 11.',
        'Answer: 2',
      ],
    },
  ],
  numberline: [
    {
      q: 'To graph x > −8, is the circle at −8 open (type 1) or closed (type 0)?',
      a: '1',
      steps: ['> does not include −8, so use an open circle.', 'Answer: 1'],
      fig: {
        kind: 'numline',
        min: -12,
        max: -4,
        dots: [
          {
            at: -8,
            open: true,
            label: '−8',
          },
        ],
        ray: {
          from: -8,
          dir: 1,
        },
      },
    },
    {
      q: 'To graph x ≥ −8, is the circle at −8 open (type 1) or closed (type 0)?',
      a: '0',
      steps: ['≥ includes −8, so use a closed circle.', 'Answer: 0'],
      fig: {
        kind: 'numline',
        min: -12,
        max: -4,
        dots: [
          {
            at: -8,
            open: false,
            label: '−8',
          },
        ],
        ray: {
          from: -8,
          dir: 1,
        },
      },
    },
    {
      q: 'The graph of x ≤ −8 is a ray to the left. What is the endpoint?',
      a: '-8',
      steps: ['x ≤ −8 starts at −8 and goes toward −∞.', 'Answer: −8'],
      fig: {
        kind: 'numline',
        min: -12,
        max: -4,
        dots: [
          {
            at: -8,
            open: false,
            label: '−8',
          },
        ],
        ray: {
          from: -8,
          dir: -1,
        },
      },
    },
    {
      q: 'x > −8 is shaded to the right. What is the endpoint?',
      a: '-8',
      steps: ['The ray starts at −8 and goes toward +∞.', 'Answer: −8'],
      fig: {
        kind: 'numline',
        min: -12,
        max: -4,
        dots: [
          {
            at: -8,
            open: true,
            label: '−8',
          },
        ],
        ray: {
          from: -8,
          dir: 1,
        },
      },
    },
    {
      q: 'How many integers from −8 to −2 are on the graph of x > −8?',
      a: '6',
      steps: [
        'x > −8 keeps integers strictly larger than −8.',
        'From −8 to −2 that is −7 through −2.',
        'Answer: 6',
      ],
    },
    {
      q: 'To graph x > −6, is the circle at −6 open (type 1) or closed (type 0)?',
      a: '1',
      steps: ['> does not include −6, so use an open circle.', 'Answer: 1'],
      fig: {
        kind: 'numline',
        min: -10,
        max: -2,
        dots: [
          {
            at: -6,
            open: true,
            label: '−6',
          },
        ],
        ray: {
          from: -6,
          dir: 1,
        },
      },
    },
    {
      q: 'To graph x ≥ −6, is the circle at −6 open (type 1) or closed (type 0)?',
      a: '0',
      steps: ['≥ includes −6, so use a closed circle.', 'Answer: 0'],
      fig: {
        kind: 'numline',
        min: -10,
        max: -2,
        dots: [
          {
            at: -6,
            open: false,
            label: '−6',
          },
        ],
        ray: {
          from: -6,
          dir: 1,
        },
      },
    },
    {
      q: 'The graph of x ≤ −6 is a ray to the left. What is the endpoint?',
      a: '-6',
      steps: ['x ≤ −6 starts at −6 and goes toward −∞.', 'Answer: −6'],
      fig: {
        kind: 'numline',
        min: -10,
        max: -2,
        dots: [
          {
            at: -6,
            open: false,
            label: '−6',
          },
        ],
        ray: {
          from: -6,
          dir: -1,
        },
      },
    },
    {
      q: 'x > −6 is shaded to the right. What is the endpoint?',
      a: '-6',
      steps: ['The ray starts at −6 and goes toward +∞.', 'Answer: −6'],
      fig: {
        kind: 'numline',
        min: -10,
        max: -2,
        dots: [
          {
            at: -6,
            open: true,
            label: '−6',
          },
        ],
        ray: {
          from: -6,
          dir: 1,
        },
      },
    },
    {
      q: 'How many integers from −6 to 0 are on the graph of x > −6?',
      a: '6',
      steps: [
        'x > −6 keeps integers strictly larger than −6.',
        'From −6 to 0 that is −5 through 0.',
        'Answer: 6',
      ],
    },
    {
      q: 'To graph x > −5, is the circle at −5 open (type 1) or closed (type 0)?',
      a: '1',
      steps: ['> does not include −5, so use an open circle.', 'Answer: 1'],
      fig: {
        kind: 'numline',
        min: -9,
        max: -1,
        dots: [
          {
            at: -5,
            open: true,
            label: '−5',
          },
        ],
        ray: {
          from: -5,
          dir: 1,
        },
      },
    },
    {
      q: 'To graph x ≥ −5, is the circle at −5 open (type 1) or closed (type 0)?',
      a: '0',
      steps: ['≥ includes −5, so use a closed circle.', 'Answer: 0'],
      fig: {
        kind: 'numline',
        min: -9,
        max: -1,
        dots: [
          {
            at: -5,
            open: false,
            label: '−5',
          },
        ],
        ray: {
          from: -5,
          dir: 1,
        },
      },
    },
    {
      q: 'The graph of x ≤ −5 is a ray to the left. What is the endpoint?',
      a: '-5',
      steps: ['x ≤ −5 starts at −5 and goes toward −∞.', 'Answer: −5'],
      fig: {
        kind: 'numline',
        min: -9,
        max: -1,
        dots: [
          {
            at: -5,
            open: false,
            label: '−5',
          },
        ],
        ray: {
          from: -5,
          dir: -1,
        },
      },
    },
    {
      q: 'x > −5 is shaded to the right. What is the endpoint?',
      a: '-5',
      steps: ['The ray starts at −5 and goes toward +∞.', 'Answer: −5'],
      fig: {
        kind: 'numline',
        min: -9,
        max: -1,
        dots: [
          {
            at: -5,
            open: true,
            label: '−5',
          },
        ],
        ray: {
          from: -5,
          dir: 1,
        },
      },
    },
    {
      q: 'How many integers from −5 to 1 are on the graph of x > −5?',
      a: '6',
      steps: [
        'x > −5 keeps integers strictly larger than −5.',
        'From −5 to 1 that is −4 through 1.',
        'Answer: 6',
      ],
    },
    {
      q: 'To graph x > 9, is the circle at 9 open (type 1) or closed (type 0)?',
      a: '1',
      steps: ['> does not include 9, so use an open circle.', 'Answer: 1'],
      fig: {
        kind: 'numline',
        min: 5,
        max: 13,
        dots: [
          {
            at: 9,
            open: true,
            label: '9',
          },
        ],
        ray: {
          from: 9,
          dir: 1,
        },
      },
    },
    {
      q: 'To graph x ≥ 9, is the circle at 9 open (type 1) or closed (type 0)?',
      a: '0',
      steps: ['≥ includes 9, so use a closed circle.', 'Answer: 0'],
      fig: {
        kind: 'numline',
        min: 5,
        max: 13,
        dots: [
          {
            at: 9,
            open: false,
            label: '9',
          },
        ],
        ray: {
          from: 9,
          dir: 1,
        },
      },
    },
    {
      q: 'The graph of x ≤ 9 is a ray to the left. What is the endpoint?',
      a: '9',
      steps: ['x ≤ 9 starts at 9 and goes toward −∞.', 'Answer: 9'],
      fig: {
        kind: 'numline',
        min: 5,
        max: 13,
        dots: [
          {
            at: 9,
            open: false,
            label: '9',
          },
        ],
        ray: {
          from: 9,
          dir: -1,
        },
      },
    },
    {
      q: 'x > 9 is shaded to the right. What is the endpoint?',
      a: '9',
      steps: ['The ray starts at 9 and goes toward +∞.', 'Answer: 9'],
      fig: {
        kind: 'numline',
        min: 5,
        max: 13,
        dots: [
          {
            at: 9,
            open: true,
            label: '9',
          },
        ],
        ray: {
          from: 9,
          dir: 1,
        },
      },
    },
    {
      q: 'How many integers from 9 to 15 are on the graph of x > 9?',
      a: '6',
      steps: [
        'x > 9 keeps integers strictly larger than 9.',
        'From 9 to 15 that is 10 through 15.',
        'Answer: 6',
      ],
    },
    {
      q: 'To graph x > 10, is the circle at 10 open (type 1) or closed (type 0)?',
      a: '1',
      steps: ['> does not include 10, so use an open circle.', 'Answer: 1'],
      fig: {
        kind: 'numline',
        min: 6,
        max: 14,
        dots: [
          {
            at: 10,
            open: true,
            label: '10',
          },
        ],
        ray: {
          from: 10,
          dir: 1,
        },
      },
    },
    {
      q: 'To graph x ≥ 10, is the circle at 10 open (type 1) or closed (type 0)?',
      a: '0',
      steps: ['≥ includes 10, so use a closed circle.', 'Answer: 0'],
      fig: {
        kind: 'numline',
        min: 6,
        max: 14,
        dots: [
          {
            at: 10,
            open: false,
            label: '10',
          },
        ],
        ray: {
          from: 10,
          dir: 1,
        },
      },
    },
    {
      q: 'The graph of x ≤ 10 is a ray to the left. What is the endpoint?',
      a: '10',
      steps: ['x ≤ 10 starts at 10 and goes toward −∞.', 'Answer: 10'],
      fig: {
        kind: 'numline',
        min: 6,
        max: 14,
        dots: [
          {
            at: 10,
            open: false,
            label: '10',
          },
        ],
        ray: {
          from: 10,
          dir: -1,
        },
      },
    },
    {
      q: 'x > 10 is shaded to the right. What is the endpoint?',
      a: '10',
      steps: ['The ray starts at 10 and goes toward +∞.', 'Answer: 10'],
      fig: {
        kind: 'numline',
        min: 6,
        max: 14,
        dots: [
          {
            at: 10,
            open: true,
            label: '10',
          },
        ],
        ray: {
          from: 10,
          dir: 1,
        },
      },
    },
    {
      q: 'How many integers from 10 to 16 are on the graph of x > 10?',
      a: '6',
      steps: [
        'x > 10 keeps integers strictly larger than 10.',
        'From 10 to 16 that is 11 through 16.',
        'Answer: 6',
      ],
    },
  ],
  linear: [
    {
      q: 'Solve −4x − 9 > −12. What is the boundary number?',
      a: '3/4',
      form: 'fraction',
      steps: [
        'Start with −4x − 9 > −12.',
        'Move −9: −4x > −3.',
        'Divide by −4. Reverse the inequality because the divisor is negative.',
        'The bound is 3/4.',
        'Answer: 3/4',
      ],
    },
    {
      q: 'When graphing the solution of −4x − 9 > −12, is the circle at the bound open (type 1) or closed (type 0)?',
      a: '1',
      steps: [
        'Start with −4x − 9 > −12.',
        'Move −9: −4x > −3.',
        'Divide by −4. Reverse the inequality because the divisor is negative.',
        'The bound is 3/4.',
        'The inequality is strict, so the circle is open.',
        'Answer: 1',
      ],
    },
    {
      q: 'Solve −4x − 9 > −12. What is the largest integer solution?',
      a: '0',
      steps: [
        'Start with −4x − 9 > −12.',
        'Move −9: −4x > −3.',
        'Divide by −4. Reverse the inequality because the divisor is negative.',
        'The bound is 3/4.',
        'The solution goes to the left of the bound, so the largest integer is 0.',
        'Answer: 0',
      ],
    },
    {
      q: 'Is x = 0 a solution of −4x − 9 > −12? Type 1 for yes, 0 for no.',
      a: '1',
      steps: ['Substitute 0: −9 > −12 is true.', 'Answer: 1'],
    },
    {
      q: 'Solve −4x − 9 ≥ −12. What is the boundary number?',
      a: '3/4',
      form: 'fraction',
      steps: [
        'Start with −4x − 9 ≥ −12.',
        'Move −9: −4x ≥ −3.',
        'Divide by −4. Reverse the inequality because the divisor is negative.',
        'The bound is 3/4.',
        'Answer: 3/4',
      ],
    },
    {
      q: 'When graphing the solution of −4x − 9 ≥ −12, is the circle at the bound open (type 1) or closed (type 0)?',
      a: '0',
      steps: [
        'Start with −4x − 9 ≥ −12.',
        'Move −9: −4x ≥ −3.',
        'Divide by −4. Reverse the inequality because the divisor is negative.',
        'The bound is 3/4.',
        'Equals is allowed, so the circle is closed.',
        'Answer: 0',
      ],
    },
    {
      q: 'Solve −4x − 9 ≥ −12. What is the largest integer solution?',
      a: '0',
      steps: [
        'Start with −4x − 9 ≥ −12.',
        'Move −9: −4x ≥ −3.',
        'Divide by −4. Reverse the inequality because the divisor is negative.',
        'The bound is 3/4.',
        'The solution goes to the left of the bound, so the largest integer is 0.',
        'Answer: 0',
      ],
    },
    {
      q: 'Is x = 0 a solution of −4x − 9 ≥ −12? Type 1 for yes, 0 for no.',
      a: '1',
      steps: ['Substitute 0: −9 ≥ −12 is true.', 'Answer: 1'],
    },
    {
      q: 'Solve −4x − 9 < −12. What is the boundary number?',
      a: '3/4',
      form: 'fraction',
      steps: [
        'Start with −4x − 9 < −12.',
        'Move −9: −4x < −3.',
        'Divide by −4. Reverse the inequality because the divisor is negative.',
        'The bound is 3/4.',
        'Answer: 3/4',
      ],
    },
    {
      q: 'When graphing the solution of −4x − 9 < −12, is the circle at the bound open (type 1) or closed (type 0)?',
      a: '1',
      steps: [
        'Start with −4x − 9 < −12.',
        'Move −9: −4x < −3.',
        'Divide by −4. Reverse the inequality because the divisor is negative.',
        'The bound is 3/4.',
        'The inequality is strict, so the circle is open.',
        'Answer: 1',
      ],
    },
    {
      q: 'Solve −4x − 9 < −12. What is the smallest integer solution?',
      a: '1',
      steps: [
        'Start with −4x − 9 < −12.',
        'Move −9: −4x < −3.',
        'Divide by −4. Reverse the inequality because the divisor is negative.',
        'The bound is 3/4.',
        'The solution goes to the right of the bound, so the smallest integer is 1.',
        'Answer: 1',
      ],
    },
    {
      q: 'Is x = 2 a solution of −4x − 9 < −12? Type 1 for yes, 0 for no.',
      a: '1',
      steps: ['Substitute 2: −17 < −12 is true.', 'Answer: 1'],
    },
    {
      q: 'Solve −4x − 9 ≤ −12. What is the boundary number?',
      a: '3/4',
      form: 'fraction',
      steps: [
        'Start with −4x − 9 ≤ −12.',
        'Move −9: −4x ≤ −3.',
        'Divide by −4. Reverse the inequality because the divisor is negative.',
        'The bound is 3/4.',
        'Answer: 3/4',
      ],
    },
    {
      q: 'When graphing the solution of −4x − 9 ≤ −12, is the circle at the bound open (type 1) or closed (type 0)?',
      a: '0',
      steps: [
        'Start with −4x − 9 ≤ −12.',
        'Move −9: −4x ≤ −3.',
        'Divide by −4. Reverse the inequality because the divisor is negative.',
        'The bound is 3/4.',
        'Equals is allowed, so the circle is closed.',
        'Answer: 0',
      ],
    },
    {
      q: 'Solve −4x − 9 ≤ −12. What is the smallest integer solution?',
      a: '1',
      steps: [
        'Start with −4x − 9 ≤ −12.',
        'Move −9: −4x ≤ −3.',
        'Divide by −4. Reverse the inequality because the divisor is negative.',
        'The bound is 3/4.',
        'The solution goes to the right of the bound, so the smallest integer is 1.',
        'Answer: 1',
      ],
    },
    {
      q: 'Is x = 2 a solution of −4x − 9 ≤ −12? Type 1 for yes, 0 for no.',
      a: '1',
      steps: ['Substitute 2: −17 ≤ −12 is true.', 'Answer: 1'],
    },
    {
      q: 'Solve −4x − 9 > −6. What is the boundary number?',
      a: '-3/4',
      form: 'fraction',
      steps: [
        'Start with −4x − 9 > −6.',
        'Move −9: −4x > 3.',
        'Divide by −4. Reverse the inequality because the divisor is negative.',
        'The bound is −3/4.',
        'Answer: −3/4',
      ],
    },
    {
      q: 'When graphing the solution of −4x − 9 > −6, is the circle at the bound open (type 1) or closed (type 0)?',
      a: '1',
      steps: [
        'Start with −4x − 9 > −6.',
        'Move −9: −4x > 3.',
        'Divide by −4. Reverse the inequality because the divisor is negative.',
        'The bound is −3/4.',
        'The inequality is strict, so the circle is open.',
        'Answer: 1',
      ],
    },
    {
      q: 'Solve −4x − 9 > −6. What is the largest integer solution?',
      a: '-1',
      steps: [
        'Start with −4x − 9 > −6.',
        'Move −9: −4x > 3.',
        'Divide by −4. Reverse the inequality because the divisor is negative.',
        'The bound is −3/4.',
        'The solution goes to the left of the bound, so the largest integer is −1.',
        'Answer: −1',
      ],
    },
    {
      q: 'Is x = −2 a solution of −4x − 9 > −6? Type 1 for yes, 0 for no.',
      a: '1',
      steps: ['Substitute −2: −1 > −6 is true.', 'Answer: 1'],
    },
    {
      q: 'Solve −4x − 9 ≥ −6. What is the boundary number?',
      a: '-3/4',
      form: 'fraction',
      steps: [
        'Start with −4x − 9 ≥ −6.',
        'Move −9: −4x ≥ 3.',
        'Divide by −4. Reverse the inequality because the divisor is negative.',
        'The bound is −3/4.',
        'Answer: −3/4',
      ],
    },
    {
      q: 'When graphing the solution of −4x − 9 ≥ −6, is the circle at the bound open (type 1) or closed (type 0)?',
      a: '0',
      steps: [
        'Start with −4x − 9 ≥ −6.',
        'Move −9: −4x ≥ 3.',
        'Divide by −4. Reverse the inequality because the divisor is negative.',
        'The bound is −3/4.',
        'Equals is allowed, so the circle is closed.',
        'Answer: 0',
      ],
    },
    {
      q: 'Solve −4x − 9 ≥ −6. What is the largest integer solution?',
      a: '-1',
      steps: [
        'Start with −4x − 9 ≥ −6.',
        'Move −9: −4x ≥ 3.',
        'Divide by −4. Reverse the inequality because the divisor is negative.',
        'The bound is −3/4.',
        'The solution goes to the left of the bound, so the largest integer is −1.',
        'Answer: −1',
      ],
    },
    {
      q: 'Is x = −2 a solution of −4x − 9 ≥ −6? Type 1 for yes, 0 for no.',
      a: '1',
      steps: ['Substitute −2: −1 ≥ −6 is true.', 'Answer: 1'],
    },
    {
      q: 'Solve −4x − 9 < −6. What is the boundary number?',
      a: '-3/4',
      form: 'fraction',
      steps: [
        'Start with −4x − 9 < −6.',
        'Move −9: −4x < 3.',
        'Divide by −4. Reverse the inequality because the divisor is negative.',
        'The bound is −3/4.',
        'Answer: −3/4',
      ],
    },
  ],
  or: [
    {
      q: 'Solve −2x + 4 > 10. In −2x + 4 > 10 or 2x + 8 < 0, what is this first boundary number?',
      a: '-3',
      steps: ['Solve each part on its own. −2x + 4 > 10 has bound −3.', 'Answer: −3'],
    },
    {
      q: 'Solve 2x + 8 < 0. In −2x + 4 > 10 or 2x + 8 < 0, what is this second boundary number?',
      a: '-4',
      steps: ['Solve each part on its own. 2x + 8 < 0 has bound −4.', 'Answer: −4'],
    },
    {
      q: 'How many integers from −6 to 12 satisfy −2x + 4 > 10 or 2x + 8 < 0?',
      a: '3',
      steps: [
        'OR keeps a number if it works in either part.',
        'Count the integers from −6 to 12 that work.',
        'Answer: 3',
      ],
    },
    {
      q: 'Is x = −3 a solution of −2x + 4 > 10 or 2x + 8 < 0? Type 1 for yes, 0 for no.',
      a: '0',
      steps: ['−2x + 4 > 10 at −3 is false.', '2x + 8 < 0 at −3 is false.', 'Answer: 0'],
    },
    {
      q: 'Solve −2x + 4 > 10. In −2x + 4 > 10 or −3x ≥ 9, what is this first boundary number?',
      a: '-3',
      steps: ['Solve each part on its own. −2x + 4 > 10 has bound −3.', 'Answer: −3'],
    },
    {
      q: 'Solve −3x ≥ 9. In −2x + 4 > 10 or −3x ≥ 9, what is this second boundary number?',
      a: '-3',
      steps: ['Solve each part on its own. −3x ≥ 9 has bound −3.', 'Answer: −3'],
    },
    {
      q: 'How many integers from −6 to 12 satisfy −2x + 4 > 10 or −3x ≥ 9?',
      a: '4',
      steps: [
        'OR keeps a number if it works in either part.',
        'Count the integers from −6 to 12 that work.',
        'Answer: 4',
      ],
    },
    {
      q: 'Is x = −3 a solution of −2x + 4 > 10 or −3x ≥ 9? Type 1 for yes, 0 for no.',
      a: '1',
      steps: ['−2x + 4 > 10 at −3 is false.', '−3x ≥ 9 at −3 is true.', 'Answer: 1'],
    },
    {
      q: 'Solve −2x + 4 > 10. In −2x + 4 > 10 or x − 7 ≤ 1, what is this first boundary number?',
      a: '-3',
      steps: ['Solve each part on its own. −2x + 4 > 10 has bound −3.', 'Answer: −3'],
    },
    {
      q: 'Solve x − 7 ≤ 1. In −2x + 4 > 10 or x − 7 ≤ 1, what is this second boundary number?',
      a: '8',
      steps: ['Solve each part on its own. x − 7 ≤ 1 has bound 8.', 'Answer: 8'],
    },
    {
      q: 'How many integers from −6 to 12 satisfy −2x + 4 > 10 or x − 7 ≤ 1?',
      a: '15',
      steps: [
        'OR keeps a number if it works in either part.',
        'Count the integers from −6 to 12 that work.',
        'Answer: 15',
      ],
    },
    {
      q: 'Is x = 3 a solution of −2x + 4 > 10 or x − 7 ≤ 1? Type 1 for yes, 0 for no.',
      a: '1',
      steps: ['−2x + 4 > 10 at 3 is false.', 'x − 7 ≤ 1 at 3 is true.', 'Answer: 1'],
    },
    {
      q: 'Solve −2x + 4 > 10. In −2x + 4 > 10 or 4x + 4 > 20, what is this first boundary number?',
      a: '-3',
      steps: ['Solve each part on its own. −2x + 4 > 10 has bound −3.', 'Answer: −3'],
    },
    {
      q: 'Solve 4x + 4 > 20. In −2x + 4 > 10 or 4x + 4 > 20, what is this second boundary number?',
      a: '4',
      steps: ['Solve each part on its own. 4x + 4 > 20 has bound 4.', 'Answer: 4'],
    },
    {
      q: 'How many integers from −6 to 12 satisfy −2x + 4 > 10 or 4x + 4 > 20?',
      a: '11',
      steps: [
        'OR keeps a number if it works in either part.',
        'Count the integers from −6 to 12 that work.',
        'Answer: 11',
      ],
    },
    {
      q: 'Is x = 1 a solution of −2x + 4 > 10 or 4x + 4 > 20? Type 1 for yes, 0 for no.',
      a: '0',
      steps: ['−2x + 4 > 10 at 1 is false.', '4x + 4 > 20 at 1 is false.', 'Answer: 0'],
    },
    {
      q: 'Solve −2x + 4 > 10. In −2x + 4 > 10 or −2x − 2 < 8, what is this first boundary number?',
      a: '-3',
      steps: ['Solve each part on its own. −2x + 4 > 10 has bound −3.', 'Answer: −3'],
    },
    {
      q: 'Solve −2x − 2 < 8. In −2x + 4 > 10 or −2x − 2 < 8, what is this second boundary number?',
      a: '-5',
      steps: ['Solve each part on its own. −2x − 2 < 8 has bound −5.', 'Answer: −5'],
    },
    {
      q: 'How many integers from −6 to 12 satisfy −2x + 4 > 10 or −2x − 2 < 8?',
      a: '19',
      steps: [
        'OR keeps a number if it works in either part.',
        'Count the integers from −6 to 12 that work.',
        'Answer: 19',
      ],
    },
    {
      q: 'Is x = −4 a solution of −2x + 4 > 10 or −2x − 2 < 8? Type 1 for yes, 0 for no.',
      a: '1',
      steps: ['−2x + 4 > 10 at −4 is true.', '−2x − 2 < 8 at −4 is true.', 'Answer: 1'],
    },
    {
      q: 'Solve 3x − 6 ≤ 9. In 3x − 6 ≤ 9 or 2x + 8 < 0, what is this first boundary number?',
      a: '5',
      steps: ['Solve each part on its own. 3x − 6 ≤ 9 has bound 5.', 'Answer: 5'],
    },
    {
      q: 'Solve 2x + 8 < 0. In 3x − 6 ≤ 9 or 2x + 8 < 0, what is this second boundary number?',
      a: '-4',
      steps: ['Solve each part on its own. 2x + 8 < 0 has bound −4.', 'Answer: −4'],
    },
    {
      q: 'How many integers from −6 to 12 satisfy 3x − 6 ≤ 9 or 2x + 8 < 0?',
      a: '12',
      steps: [
        'OR keeps a number if it works in either part.',
        'Count the integers from −6 to 12 that work.',
        'Answer: 12',
      ],
    },
    {
      q: 'Is x = 1 a solution of 3x − 6 ≤ 9 or 2x + 8 < 0? Type 1 for yes, 0 for no.',
      a: '1',
      steps: ['3x − 6 ≤ 9 at 1 is true.', '2x + 8 < 0 at 1 is false.', 'Answer: 1'],
    },
    {
      q: 'Solve 3x − 6 ≤ 9. In 3x − 6 ≤ 9 or −3x ≥ 9, what is this first boundary number?',
      a: '5',
      steps: ['Solve each part on its own. 3x − 6 ≤ 9 has bound 5.', 'Answer: 5'],
    },
  ],
  and: [
    {
      q: 'Solve −3x + 6 ≤ 0. In −3x + 6 ≤ 0 and x > −4, what is this first boundary number?',
      a: '2',
      steps: ['Solve each part on its own. −3x + 6 ≤ 0 has bound 2.', 'Answer: 2'],
    },
    {
      q: 'Solve x > −4. In −3x + 6 ≤ 0 and x > −4, what is this second boundary number?',
      a: '-4',
      steps: ['Solve each part on its own. x > −4 has bound −4.', 'Answer: −4'],
    },
    {
      q: 'How many integers from −6 to 12 satisfy −3x + 6 ≤ 0 and x > −4?',
      a: '11',
      steps: [
        'AND keeps a number only if it works in both parts.',
        'Count the integers from −6 to 12 that work.',
        'Answer: 11',
      ],
    },
    {
      q: 'Is x = −1 a solution of −3x + 6 ≤ 0 and x > −4? Type 1 for yes, 0 for no.',
      a: '0',
      steps: ['−3x + 6 ≤ 0 at −1 is false.', 'x > −4 at −1 is true.', 'Answer: 0'],
    },
    {
      q: 'Solve −3x + 6 ≤ 0. In −3x + 6 ≤ 0 and 3x − 3 < 15, what is this first boundary number?',
      a: '2',
      steps: ['Solve each part on its own. −3x + 6 ≤ 0 has bound 2.', 'Answer: 2'],
    },
    {
      q: 'Solve 3x − 3 < 15. In −3x + 6 ≤ 0 and 3x − 3 < 15, what is this second boundary number?',
      a: '6',
      steps: ['Solve each part on its own. 3x − 3 < 15 has bound 6.', 'Answer: 6'],
    },
    {
      q: 'How many integers from −6 to 12 satisfy −3x + 6 ≤ 0 and 3x − 3 < 15?',
      a: '4',
      steps: [
        'AND keeps a number only if it works in both parts.',
        'Count the integers from −6 to 12 that work.',
        'Answer: 4',
      ],
    },
    {
      q: 'Is x = 4 a solution of −3x + 6 ≤ 0 and 3x − 3 < 15? Type 1 for yes, 0 for no.',
      a: '1',
      steps: ['−3x + 6 ≤ 0 at 4 is true.', '3x − 3 < 15 at 4 is true.', 'Answer: 1'],
    },
    {
      q: 'Solve −3x + 6 ≤ 0. In −3x + 6 ≤ 0 and −2x + 2 ≥ −10, what is this first boundary number?',
      a: '2',
      steps: ['Solve each part on its own. −3x + 6 ≤ 0 has bound 2.', 'Answer: 2'],
    },
    {
      q: 'Solve −2x + 2 ≥ −10. In −3x + 6 ≤ 0 and −2x + 2 ≥ −10, what is this second boundary number?',
      a: '6',
      steps: ['Solve each part on its own. −2x + 2 ≥ −10 has bound 6.', 'Answer: 6'],
    },
    {
      q: 'How many integers from −6 to 12 satisfy −3x + 6 ≤ 0 and −2x + 2 ≥ −10?',
      a: '5',
      steps: [
        'AND keeps a number only if it works in both parts.',
        'Count the integers from −6 to 12 that work.',
        'Answer: 5',
      ],
    },
    {
      q: 'Is x = 4 a solution of −3x + 6 ≤ 0 and −2x + 2 ≥ −10? Type 1 for yes, 0 for no.',
      a: '1',
      steps: ['−3x + 6 ≤ 0 at 4 is true.', '−2x + 2 ≥ −10 at 4 is true.', 'Answer: 1'],
    },
    {
      q: 'Solve −3x + 6 ≤ 0. In −3x + 6 ≤ 0 and 2x + 6 ≤ 18, what is this first boundary number?',
      a: '2',
      steps: ['Solve each part on its own. −3x + 6 ≤ 0 has bound 2.', 'Answer: 2'],
    },
    {
      q: 'Solve 2x + 6 ≤ 18. In −3x + 6 ≤ 0 and 2x + 6 ≤ 18, what is this second boundary number?',
      a: '6',
      steps: ['Solve each part on its own. 2x + 6 ≤ 18 has bound 6.', 'Answer: 6'],
    },
    {
      q: 'How many integers from −6 to 12 satisfy −3x + 6 ≤ 0 and 2x + 6 ≤ 18?',
      a: '5',
      steps: [
        'AND keeps a number only if it works in both parts.',
        'Count the integers from −6 to 12 that work.',
        'Answer: 5',
      ],
    },
    {
      q: 'Is x = 4 a solution of −3x + 6 ≤ 0 and 2x + 6 ≤ 18? Type 1 for yes, 0 for no.',
      a: '1',
      steps: ['−3x + 6 ≤ 0 at 4 is true.', '2x + 6 ≤ 18 at 4 is true.', 'Answer: 1'],
    },
    {
      q: 'Solve −3x + 6 ≤ 0. In −3x + 6 ≤ 0 and x − 9 > −3, what is this first boundary number?',
      a: '2',
      steps: ['Solve each part on its own. −3x + 6 ≤ 0 has bound 2.', 'Answer: 2'],
    },
    {
      q: 'Solve x − 9 > −3. In −3x + 6 ≤ 0 and x − 9 > −3, what is this second boundary number?',
      a: '6',
      steps: ['Solve each part on its own. x − 9 > −3 has bound 6.', 'Answer: 6'],
    },
    {
      q: 'How many integers from −6 to 12 satisfy −3x + 6 ≤ 0 and x − 9 > −3?',
      a: '6',
      steps: [
        'AND keeps a number only if it works in both parts.',
        'Count the integers from −6 to 12 that work.',
        'Answer: 6',
      ],
    },
    {
      q: 'Is x = 4 a solution of −3x + 6 ≤ 0 and x − 9 > −3? Type 1 for yes, 0 for no.',
      a: '0',
      steps: ['−3x + 6 ≤ 0 at 4 is true.', 'x − 9 > −3 at 4 is false.', 'Answer: 0'],
    },
    {
      q: 'Solve 2x − 8 ≥ 0. In 2x − 8 ≥ 0 and x > −4, what is this first boundary number?',
      a: '4',
      steps: ['Solve each part on its own. 2x − 8 ≥ 0 has bound 4.', 'Answer: 4'],
    },
    {
      q: 'Solve x > −4. In 2x − 8 ≥ 0 and x > −4, what is this second boundary number?',
      a: '-4',
      steps: ['Solve each part on its own. x > −4 has bound −4.', 'Answer: −4'],
    },
    {
      q: 'How many integers from −6 to 12 satisfy 2x − 8 ≥ 0 and x > −4?',
      a: '9',
      steps: [
        'AND keeps a number only if it works in both parts.',
        'Count the integers from −6 to 12 that work.',
        'Answer: 9',
      ],
    },
    {
      q: 'Is x = 0 a solution of 2x − 8 ≥ 0 and x > −4? Type 1 for yes, 0 for no.',
      a: '0',
      steps: ['2x − 8 ≥ 0 at 0 is false.', 'x > −4 at 0 is true.', 'Answer: 0'],
    },
    {
      q: 'Solve 2x − 8 ≥ 0. In 2x − 8 ≥ 0 and 3x − 3 < 15, what is this first boundary number?',
      a: '4',
      steps: ['Solve each part on its own. 2x − 8 ≥ 0 has bound 4.', 'Answer: 4'],
    },
  ],
  abs: [
    {
      q: 'For |x + 3| > 3, what is the centre of the interval or of the two rays?',
      a: '-3',
      steps: ['|x + 3| measures distance from −3.', 'Answer: −3'],
    },
    {
      q: 'For |x + 3| > 3, what is the left critical number?',
      a: '-6',
      steps: ['|x + 3| > 3 splits at −3 − 3 and −3 + 3.', 'The left number is −6.', 'Answer: −6'],
    },
    {
      q: 'For |x + 3| > 3, what is the right critical number?',
      a: '0',
      steps: ['|x + 3| > 3 splits at −3 − 3 and −3 + 3.', 'The right number is 0.', 'Answer: 0'],
    },
    {
      q: 'How many integers from −9 to 3 satisfy |x + 3| > 3?',
      a: '6',
      steps: [
        'A greater-than absolute value is an OR: two rays.',
        'Count the integers that lie at distance at least 3 from −3.',
        'Answer: 6',
      ],
    },
    {
      q: 'For |x + 3| ≥ 3, what is the centre of the interval or of the two rays?',
      a: '-3',
      steps: ['|x + 3| measures distance from −3.', 'Answer: −3'],
    },
    {
      q: 'For |x + 3| ≥ 3, what is the left critical number?',
      a: '-6',
      steps: ['|x + 3| ≥ 3 splits at −3 − 3 and −3 + 3.', 'The left number is −6.', 'Answer: −6'],
    },
    {
      q: 'For |x + 3| ≥ 3, what is the right critical number?',
      a: '0',
      steps: ['|x + 3| ≥ 3 splits at −3 − 3 and −3 + 3.', 'The right number is 0.', 'Answer: 0'],
    },
    {
      q: 'How many integers from −9 to 3 satisfy |x + 3| ≥ 3?',
      a: '8',
      steps: [
        'A greater-than absolute value is an OR: two rays.',
        'Count the integers that lie at distance at least 3 from −3.',
        'Answer: 8',
      ],
    },
    {
      q: 'For |x + 3| ≤ 3, what is the centre of the interval or of the two rays?',
      a: '-3',
      steps: ['|x + 3| measures distance from −3.', 'Answer: −3'],
    },
    {
      q: 'For |x + 3| ≤ 3, what is the left critical number?',
      a: '-6',
      steps: ['|x + 3| ≤ 3 splits at −3 − 3 and −3 + 3.', 'The left number is −6.', 'Answer: −6'],
    },
    {
      q: 'For |x + 3| ≤ 3, what is the right critical number?',
      a: '0',
      steps: ['|x + 3| ≤ 3 splits at −3 − 3 and −3 + 3.', 'The right number is 0.', 'Answer: 0'],
    },
    {
      q: 'How many integers from −9 to 3 satisfy |x + 3| ≤ 3?',
      a: '7',
      steps: [
        'A less-than absolute value is an AND: a segment.',
        'Count the integers that lie at distance at most 3 from −3.',
        'Answer: 7',
      ],
    },
    {
      q: 'For |x + 3| < 3, what is the centre of the interval or of the two rays?',
      a: '-3',
      steps: ['|x + 3| measures distance from −3.', 'Answer: −3'],
    },
    {
      q: 'For |x + 3| < 3, what is the left critical number?',
      a: '-6',
      steps: ['|x + 3| < 3 splits at −3 − 3 and −3 + 3.', 'The left number is −6.', 'Answer: −6'],
    },
    {
      q: 'For |x + 3| < 3, what is the right critical number?',
      a: '0',
      steps: ['|x + 3| < 3 splits at −3 − 3 and −3 + 3.', 'The right number is 0.', 'Answer: 0'],
    },
    {
      q: 'How many integers from −9 to 3 satisfy |x + 3| < 3?',
      a: '5',
      steps: [
        'A less-than absolute value is an AND: a segment.',
        'Count the integers that lie at distance at most 3 from −3.',
        'Answer: 5',
      ],
    },
    {
      q: 'For |x + 3| > 4, what is the centre of the interval or of the two rays?',
      a: '-3',
      steps: ['|x + 3| measures distance from −3.', 'Answer: −3'],
    },
    {
      q: 'For |x + 3| > 4, what is the left critical number?',
      a: '-7',
      steps: ['|x + 3| > 4 splits at −3 − 4 and −3 + 4.', 'The left number is −7.', 'Answer: −7'],
    },
    {
      q: 'For |x + 3| > 4, what is the right critical number?',
      a: '1',
      steps: ['|x + 3| > 4 splits at −3 − 4 and −3 + 4.', 'The right number is 1.', 'Answer: 1'],
    },
    {
      q: 'How many integers from −10 to 4 satisfy |x + 3| > 4?',
      a: '6',
      steps: [
        'A greater-than absolute value is an OR: two rays.',
        'Count the integers that lie at distance at least 4 from −3.',
        'Answer: 6',
      ],
    },
    {
      q: 'For |x + 3| ≥ 4, what is the centre of the interval or of the two rays?',
      a: '-3',
      steps: ['|x + 3| measures distance from −3.', 'Answer: −3'],
    },
    {
      q: 'For |x + 3| ≥ 4, what is the left critical number?',
      a: '-7',
      steps: ['|x + 3| ≥ 4 splits at −3 − 4 and −3 + 4.', 'The left number is −7.', 'Answer: −7'],
    },
    {
      q: 'For |x + 3| ≥ 4, what is the right critical number?',
      a: '1',
      steps: ['|x + 3| ≥ 4 splits at −3 − 4 and −3 + 4.', 'The right number is 1.', 'Answer: 1'],
    },
    {
      q: 'How many integers from −10 to 4 satisfy |x + 3| ≥ 4?',
      a: '8',
      steps: [
        'A greater-than absolute value is an OR: two rays.',
        'Count the integers that lie at distance at least 4 from −3.',
        'Answer: 8',
      ],
    },
    {
      q: 'For |x + 3| ≤ 4, what is the centre of the interval or of the two rays?',
      a: '-3',
      steps: ['|x + 3| measures distance from −3.', 'Answer: −3'],
    },
  ],
  twovar: [
    {
      q: 'The boundary of y > 3x − 4 has y-intercept at what number?',
      a: '-4',
      steps: ['When x = 0 the boundary is y = −4.', 'Answer: −4'],
      fig: {
        kind: 'grid',
        x: [-2, 8],
        y: [-30, 30],
        fn: [
          {
            m: 3,
            b: -4,
            label: 'y = 3x − 4',
          },
        ],
      },
    },
    {
      q: 'The boundary of y > 3x − 4 has slope equal to what number?',
      a: '3',
      steps: ['The slope of y = 3x − 4 is 3.', 'Answer: 3'],
    },
    {
      q: 'Is (0, 0) a solution of y > 3x − 4? Type 1 for yes, 0 for no.',
      a: '1',
      steps: ['Plug in: 0 > −4 is true.', 'Answer: 1'],
    },
    {
      q: 'When graphing y > 3x − 4, is the boundary dashed (type 0) or solid (type 1)?',
      a: '0',
      steps: ['Strict inequalities use a dashed boundary.', 'Answer: 0'],
    },
    {
      q: 'On the boundary of y > 3x − 4, what is y when x = 2?',
      a: '2',
      steps: ['y = 3 · 2 − 4 = 2.', 'Answer: 2'],
    },
    {
      q: 'The boundary of y ≥ 3x − 4 has y-intercept at what number?',
      a: '-4',
      steps: ['When x = 0 the boundary is y = −4.', 'Answer: −4'],
      fig: {
        kind: 'grid',
        x: [-2, 8],
        y: [-30, 30],
        fn: [
          {
            m: 3,
            b: -4,
            label: 'y = 3x − 4',
          },
        ],
      },
    },
    {
      q: 'The boundary of y ≥ 3x − 4 has slope equal to what number?',
      a: '3',
      steps: ['The slope of y = 3x − 4 is 3.', 'Answer: 3'],
    },
    {
      q: 'Is (0, 0) a solution of y ≥ 3x − 4? Type 1 for yes, 0 for no.',
      a: '1',
      steps: ['Plug in: 0 ≥ −4 is true.', 'Answer: 1'],
    },
    {
      q: 'When graphing y ≥ 3x − 4, is the boundary dashed (type 0) or solid (type 1)?',
      a: '1',
      steps: ['≤ and ≥ use a solid boundary.', 'Answer: 1'],
    },
    {
      q: 'On the boundary of y ≥ 3x − 4, what is y when x = 2?',
      a: '2',
      steps: ['y = 3 · 2 − 4 = 2.', 'Answer: 2'],
    },
    {
      q: 'The boundary of y < 3x − 4 has y-intercept at what number?',
      a: '-4',
      steps: ['When x = 0 the boundary is y = −4.', 'Answer: −4'],
      fig: {
        kind: 'grid',
        x: [-2, 8],
        y: [-30, 30],
        fn: [
          {
            m: 3,
            b: -4,
            label: 'y = 3x − 4',
          },
        ],
      },
    },
    {
      q: 'The boundary of y < 3x − 4 has slope equal to what number?',
      a: '3',
      steps: ['The slope of y = 3x − 4 is 3.', 'Answer: 3'],
    },
    {
      q: 'Is (0, 0) a solution of y < 3x − 4? Type 1 for yes, 0 for no.',
      a: '0',
      steps: ['Plug in: 0 < −4 is false.', 'Answer: 0'],
    },
    {
      q: 'When graphing y < 3x − 4, is the boundary dashed (type 0) or solid (type 1)?',
      a: '0',
      steps: ['Strict inequalities use a dashed boundary.', 'Answer: 0'],
    },
    {
      q: 'On the boundary of y < 3x − 4, what is y when x = 2?',
      a: '2',
      steps: ['y = 3 · 2 − 4 = 2.', 'Answer: 2'],
    },
    {
      q: 'The boundary of y ≤ 3x − 4 has y-intercept at what number?',
      a: '-4',
      steps: ['When x = 0 the boundary is y = −4.', 'Answer: −4'],
      fig: {
        kind: 'grid',
        x: [-2, 8],
        y: [-30, 30],
        fn: [
          {
            m: 3,
            b: -4,
            label: 'y = 3x − 4',
          },
        ],
      },
    },
    {
      q: 'The boundary of y ≤ 3x − 4 has slope equal to what number?',
      a: '3',
      steps: ['The slope of y = 3x − 4 is 3.', 'Answer: 3'],
    },
    {
      q: 'Is (0, 0) a solution of y ≤ 3x − 4? Type 1 for yes, 0 for no.',
      a: '0',
      steps: ['Plug in: 0 ≤ −4 is false.', 'Answer: 0'],
    },
    {
      q: 'When graphing y ≤ 3x − 4, is the boundary dashed (type 0) or solid (type 1)?',
      a: '1',
      steps: ['≤ and ≥ use a solid boundary.', 'Answer: 1'],
    },
    {
      q: 'On the boundary of y ≤ 3x − 4, what is y when x = 2?',
      a: '2',
      steps: ['y = 3 · 2 − 4 = 2.', 'Answer: 2'],
    },
    {
      q: 'The boundary of y > 3x − 1 has y-intercept at what number?',
      a: '-1',
      steps: ['When x = 0 the boundary is y = −1.', 'Answer: −1'],
      fig: {
        kind: 'grid',
        x: [-2, 8],
        y: [-27, 27],
        fn: [
          {
            m: 3,
            b: -1,
            label: 'y = 3x − 1',
          },
        ],
      },
    },
    {
      q: 'The boundary of y > 3x − 1 has slope equal to what number?',
      a: '3',
      steps: ['The slope of y = 3x − 1 is 3.', 'Answer: 3'],
    },
    {
      q: 'Is (0, 0) a solution of y > 3x − 1? Type 1 for yes, 0 for no.',
      a: '1',
      steps: ['Plug in: 0 > −1 is true.', 'Answer: 1'],
    },
    {
      q: 'When graphing y > 3x − 1, is the boundary dashed (type 0) or solid (type 1)?',
      a: '0',
      steps: ['Strict inequalities use a dashed boundary.', 'Answer: 0'],
    },
    {
      q: 'On the boundary of y > 3x − 1, what is y when x = 2?',
      a: '5',
      steps: ['y = 3 · 2 − 1 = 5.', 'Answer: 5'],
    },
  ],
  systems: [
    {
      q: 'In the system y ≥ 2x − 3 and y ≤ −2x + 7, what is the y-intercept of the first boundary?',
      a: '-3',
      steps: ['The first boundary crosses the y-axis at −3.', 'Answer: −3'],
      fig: {
        kind: 'grid',
        x: [-2, 8],
        y: [-6, 10],
        fn: [
          {
            m: 2,
            b: -3,
            label: 'first',
          },
          {
            m: -2,
            b: 7,
            label: 'second',
          },
        ],
      },
    },
    {
      q: 'Is (0, 0) in the solution of y ≥ 2x − 3 and y ≤ −2x + 7? Type 1 for yes, 0 for no.',
      a: '1',
      steps: ['(0, 0) in the first: yes.', '(0, 0) in the second: yes.', 'Answer: 1'],
    },
    {
      q: 'How many of the points (0, 2), (2, 0), (2, 4), (4, 2) and (1, 1) lie in both y ≥ 2x − 3 and y ≤ −2x + 7?',
      a: '2',
      steps: [
        'A point is in the system only when it sits in both shaded regions.',
        'Check each listed point.',
        'Answer: 2',
      ],
    },
    {
      q: 'In the system y ≥ 2x − 3 and y ≤ −2x + 7, what is the y-intercept of the second boundary?',
      a: '7',
      steps: ['The second boundary crosses the y-axis at 7.', 'Answer: 7'],
    },
    {
      q: 'In the system y < −x + 6 and y > 3x − 4, what is the y-intercept of the first boundary?',
      a: '6',
      steps: ['The first boundary crosses the y-axis at 6.', 'Answer: 6'],
      fig: {
        kind: 'grid',
        x: [-2, 8],
        y: [-6, 10],
        fn: [
          {
            m: -1,
            b: 6,
            label: 'first',
          },
          {
            m: 3,
            b: -4,
            label: 'second',
          },
        ],
      },
    },
    {
      q: 'Is (0, 0) in the solution of y < −x + 6 and y > 3x − 4? Type 1 for yes, 0 for no.',
      a: '1',
      steps: ['(0, 0) in the first: yes.', '(0, 0) in the second: yes.', 'Answer: 1'],
    },
    {
      q: 'How many of the points (0, 2), (2, 0), (2, 4), (4, 2) and (1, 1) lie in both y < −x + 6 and y > 3x − 4?',
      a: '2',
      steps: [
        'A point is in the system only when it sits in both shaded regions.',
        'Check each listed point.',
        'Answer: 2',
      ],
    },
    {
      q: 'In the system y < −x + 6 and y > 3x − 4, what is the y-intercept of the second boundary?',
      a: '-4',
      steps: ['The second boundary crosses the y-axis at −4.', 'Answer: −4'],
    },
    {
      q: 'In the system y ≤ 5 and y ≥ 2x − 2, what is the y-intercept of the first boundary?',
      a: '5',
      steps: ['The first boundary crosses the y-axis at 5.', 'Answer: 5'],
      fig: {
        kind: 'grid',
        x: [-2, 8],
        y: [-6, 10],
        fn: [
          {
            m: 0,
            b: 5,
            label: 'first',
          },
          {
            m: 2,
            b: -2,
            label: 'second',
          },
        ],
      },
    },
    {
      q: 'Is (0, 0) in the solution of y ≤ 5 and y ≥ 2x − 2? Type 1 for yes, 0 for no.',
      a: '1',
      steps: ['(0, 0) in the first: yes.', '(0, 0) in the second: yes.', 'Answer: 1'],
    },
    {
      q: 'How many of the points (0, 2), (2, 0), (2, 4), (4, 2) and (1, 1) lie in both y ≤ 5 and y ≥ 2x − 2?',
      a: '3',
      steps: [
        'A point is in the system only when it sits in both shaded regions.',
        'Check each listed point.',
        'Answer: 3',
      ],
    },
    {
      q: 'In the system y ≤ 5 and y ≥ 2x − 2, what is the y-intercept of the second boundary?',
      a: '-2',
      steps: ['The second boundary crosses the y-axis at −2.', 'Answer: −2'],
    },
    {
      q: 'In the system y > 4x and y < −x + 8, what is the y-intercept of the first boundary?',
      a: '0',
      steps: ['The first boundary crosses the y-axis at 0.', 'Answer: 0'],
      fig: {
        kind: 'grid',
        x: [-2, 8],
        y: [-6, 10],
        fn: [
          {
            m: 4,
            b: 0,
            label: 'first',
          },
          {
            m: -1,
            b: 8,
            label: 'second',
          },
        ],
      },
    },
    {
      q: 'Is (0, 0) in the solution of y > 4x and y < −x + 8? Type 1 for yes, 0 for no.',
      a: '0',
      steps: ['(0, 0) in the first: no.', '(0, 0) in the second: yes.', 'Answer: 0'],
    },
    {
      q: 'How many of the points (0, 2), (2, 0), (2, 4), (4, 2) and (1, 1) lie in both y > 4x and y < −x + 8?',
      a: '1',
      steps: [
        'A point is in the system only when it sits in both shaded regions.',
        'Check each listed point.',
        'Answer: 1',
      ],
    },
    {
      q: 'In the system y > 4x and y < −x + 8, what is the y-intercept of the second boundary?',
      a: '8',
      steps: ['The second boundary crosses the y-axis at 8.', 'Answer: 8'],
    },
    {
      q: 'In the system y ≥ x − 5 and y ≤ 3, what is the y-intercept of the first boundary?',
      a: '-5',
      steps: ['The first boundary crosses the y-axis at −5.', 'Answer: −5'],
      fig: {
        kind: 'grid',
        x: [-2, 8],
        y: [-6, 10],
        fn: [
          {
            m: 1,
            b: -5,
            label: 'first',
          },
          {
            m: 0,
            b: 3,
            label: 'second',
          },
        ],
      },
    },
    {
      q: 'Is (0, 0) in the solution of y ≥ x − 5 and y ≤ 3? Type 1 for yes, 0 for no.',
      a: '1',
      steps: ['(0, 0) in the first: yes.', '(0, 0) in the second: yes.', 'Answer: 1'],
    },
    {
      q: 'How many of the points (0, 2), (2, 0), (2, 4), (4, 2) and (1, 1) lie in both y ≥ x − 5 and y ≤ 3?',
      a: '4',
      steps: [
        'A point is in the system only when it sits in both shaded regions.',
        'Check each listed point.',
        'Answer: 4',
      ],
    },
    {
      q: 'In the system y ≥ x − 5 and y ≤ 3, what is the y-intercept of the second boundary?',
      a: '3',
      steps: ['The second boundary crosses the y-axis at 3.', 'Answer: 3'],
    },
    {
      q: 'In the system y ≤ −3x + 4 and y > x + 1, what is the y-intercept of the first boundary?',
      a: '4',
      steps: ['The first boundary crosses the y-axis at 4.', 'Answer: 4'],
      fig: {
        kind: 'grid',
        x: [-2, 8],
        y: [-6, 10],
        fn: [
          {
            m: -3,
            b: 4,
            label: 'first',
          },
          {
            m: 1,
            b: 1,
            label: 'second',
          },
        ],
      },
    },
    {
      q: 'Is (0, 0) in the solution of y ≤ −3x + 4 and y > x + 1? Type 1 for yes, 0 for no.',
      a: '0',
      steps: ['(0, 0) in the first: yes.', '(0, 0) in the second: no.', 'Answer: 0'],
    },
    {
      q: 'How many of the points (0, 2), (2, 0), (2, 4), (4, 2) and (1, 1) lie in both y ≤ −3x + 4 and y > x + 1?',
      a: '1',
      steps: [
        'A point is in the system only when it sits in both shaded regions.',
        'Check each listed point.',
        'Answer: 1',
      ],
    },
    {
      q: 'In the system y ≤ −3x + 4 and y > x + 1, what is the y-intercept of the second boundary?',
      a: '1',
      steps: ['The second boundary crosses the y-axis at 1.', 'Answer: 1'],
    },
    {
      q: 'In the system y < 2x + 2 and y ≥ −2x + 4, what is the y-intercept of the first boundary?',
      a: '2',
      steps: ['The first boundary crosses the y-axis at 2.', 'Answer: 2'],
      fig: {
        kind: 'grid',
        x: [-2, 8],
        y: [-6, 10],
        fn: [
          {
            m: 2,
            b: 2,
            label: 'first',
          },
          {
            m: -2,
            b: 4,
            label: 'second',
          },
        ],
      },
    },
  ],
  poly: [
    {
      q: 'The polynomial in (x + 6)(x + 2)(x − 4) ≥ 0 has a root at what smallest number?',
      a: '-6',
      steps: ['Set each factor to 0. The smallest root is −6.', 'Answer: −6'],
    },
    {
      q: 'The polynomial in (x + 6)(x + 2)(x − 4) ≥ 0 has a root at what largest number?',
      a: '4',
      steps: ['Set each factor to 0. The largest root is 4.', 'Answer: 4'],
    },
    {
      q: 'How many integers from −9 to 7 satisfy (x + 6)(x + 2)(x − 4) ≥ 0?',
      a: '9',
      steps: [
        'The roots split the line into intervals. Test a point in each interval.',
        'Count the integers from −9 to 7 whose sign matches ≥ 0.',
        'Answer: 9',
      ],
    },
    {
      q: 'Is x = −7 a solution of (x + 6)(x + 2)(x − 4) ≥ 0? Type 1 for yes, 0 for no.',
      a: '0',
      steps: ['At x = −7 the product is −55, and −55 ≥ 0 is false.', 'Answer: 0'],
    },
    {
      q: 'The polynomial in (x + 6)(x + 2)(x − 4) > 0 has a root at what smallest number?',
      a: '-6',
      steps: ['Set each factor to 0. The smallest root is −6.', 'Answer: −6'],
    },
    {
      q: 'The polynomial in (x + 6)(x + 2)(x − 4) > 0 has a root at what largest number?',
      a: '4',
      steps: ['Set each factor to 0. The largest root is 4.', 'Answer: 4'],
    },
    {
      q: 'How many integers from −9 to 7 satisfy (x + 6)(x + 2)(x − 4) > 0?',
      a: '6',
      steps: [
        'The roots split the line into intervals. Test a point in each interval.',
        'Count the integers from −9 to 7 whose sign matches > 0.',
        'Answer: 6',
      ],
    },
    {
      q: 'Is x = −7 a solution of (x + 6)(x + 2)(x − 4) > 0? Type 1 for yes, 0 for no.',
      a: '0',
      steps: ['At x = −7 the product is −55, and −55 > 0 is false.', 'Answer: 0'],
    },
    {
      q: 'The polynomial in (x + 6)(x + 2)(x − 4) ≤ 0 has a root at what smallest number?',
      a: '-6',
      steps: ['Set each factor to 0. The smallest root is −6.', 'Answer: −6'],
    },
    {
      q: 'The polynomial in (x + 6)(x + 2)(x − 4) ≤ 0 has a root at what largest number?',
      a: '4',
      steps: ['Set each factor to 0. The largest root is 4.', 'Answer: 4'],
    },
    {
      q: 'How many integers from −9 to 7 satisfy (x + 6)(x + 2)(x − 4) ≤ 0?',
      a: '11',
      steps: [
        'The roots split the line into intervals. Test a point in each interval.',
        'Count the integers from −9 to 7 whose sign matches ≤ 0.',
        'Answer: 11',
      ],
    },
    {
      q: 'Is x = −7 a solution of (x + 6)(x + 2)(x − 4) ≤ 0? Type 1 for yes, 0 for no.',
      a: '1',
      steps: ['At x = −7 the product is −55, and −55 ≤ 0 is true.', 'Answer: 1'],
    },
    {
      q: 'The polynomial in (x + 6)(x + 2)(x − 4) < 0 has a root at what smallest number?',
      a: '-6',
      steps: ['Set each factor to 0. The smallest root is −6.', 'Answer: −6'],
    },
    {
      q: 'The polynomial in (x + 6)(x + 2)(x − 4) < 0 has a root at what largest number?',
      a: '4',
      steps: ['Set each factor to 0. The largest root is 4.', 'Answer: 4'],
    },
    {
      q: 'How many integers from −9 to 7 satisfy (x + 6)(x + 2)(x − 4) < 0?',
      a: '8',
      steps: [
        'The roots split the line into intervals. Test a point in each interval.',
        'Count the integers from −9 to 7 whose sign matches < 0.',
        'Answer: 8',
      ],
    },
    {
      q: 'Is x = −7 a solution of (x + 6)(x + 2)(x − 4) < 0? Type 1 for yes, 0 for no.',
      a: '1',
      steps: ['At x = −7 the product is −55, and −55 < 0 is true.', 'Answer: 1'],
    },
    {
      q: 'The polynomial in (x + 3)(x − 1)(x − 7) ≥ 0 has a root at what smallest number?',
      a: '-3',
      steps: ['Set each factor to 0. The smallest root is −3.', 'Answer: −3'],
    },
    {
      q: 'The polynomial in (x + 3)(x − 1)(x − 7) ≥ 0 has a root at what largest number?',
      a: '7',
      steps: ['Set each factor to 0. The largest root is 7.', 'Answer: 7'],
    },
    {
      q: 'How many integers from −6 to 10 satisfy (x + 3)(x − 1)(x − 7) ≥ 0?',
      a: '9',
      steps: [
        'The roots split the line into intervals. Test a point in each interval.',
        'Count the integers from −6 to 10 whose sign matches ≥ 0.',
        'Answer: 9',
      ],
    },
    {
      q: 'Is x = −4 a solution of (x + 3)(x − 1)(x − 7) ≥ 0? Type 1 for yes, 0 for no.',
      a: '0',
      steps: ['At x = −4 the product is −55, and −55 ≥ 0 is false.', 'Answer: 0'],
    },
    {
      q: 'The polynomial in (x + 3)(x − 1)(x − 7) > 0 has a root at what smallest number?',
      a: '-3',
      steps: ['Set each factor to 0. The smallest root is −3.', 'Answer: −3'],
    },
    {
      q: 'The polynomial in (x + 3)(x − 1)(x − 7) > 0 has a root at what largest number?',
      a: '7',
      steps: ['Set each factor to 0. The largest root is 7.', 'Answer: 7'],
    },
    {
      q: 'How many integers from −6 to 10 satisfy (x + 3)(x − 1)(x − 7) > 0?',
      a: '6',
      steps: [
        'The roots split the line into intervals. Test a point in each interval.',
        'Count the integers from −6 to 10 whose sign matches > 0.',
        'Answer: 6',
      ],
    },
    {
      q: 'Is x = −4 a solution of (x + 3)(x − 1)(x − 7) > 0? Type 1 for yes, 0 for no.',
      a: '0',
      steps: ['At x = −4 the product is −55, and −55 > 0 is false.', 'Answer: 0'],
    },
    {
      q: 'The polynomial in (x + 3)(x − 1)(x − 7) ≤ 0 has a root at what smallest number?',
      a: '-3',
      steps: ['Set each factor to 0. The smallest root is −3.', 'Answer: −3'],
    },
  ],
  rational: [
    {
      q: 'For (x + 6)/(x − 2) < 0, what x-value makes the denominator 0?',
      a: '2',
      steps: [
        'The denominator is 0 at x = 2. That vertical asymptote is never a solution.',
        'Answer: 2',
      ],
    },
    {
      q: 'For (x + 6)/(x − 2) < 0, what x-value makes the numerator 0?',
      a: '-6',
      steps: [
        'The numerator is 0 at x = −6. That is a root, included only when equals is allowed.',
        'Answer: −6',
      ],
    },
    {
      q: 'How many integers from −10 to 6 satisfy (x + 6)/(x − 2) < 0?',
      a: '7',
      steps: [
        'Critical numbers −6 and 2 split the line.',
        '2 is never included. Count the integers whose value is < 0.',
        'Answer: 7',
      ],
    },
    {
      q: 'Is x = 3 a solution of (x + 6)/(x − 2) < 0? Type 1 for yes, 0 for no.',
      a: '0',
      steps: ['At x = 3 the value is 9, and that < 0 is false.', 'Answer: 0'],
    },
    {
      q: 'For (x + 6)/(x − 2) > 0, what x-value makes the denominator 0?',
      a: '2',
      steps: [
        'The denominator is 0 at x = 2. That vertical asymptote is never a solution.',
        'Answer: 2',
      ],
    },
    {
      q: 'For (x + 6)/(x − 2) > 0, what x-value makes the numerator 0?',
      a: '-6',
      steps: [
        'The numerator is 0 at x = −6. That is a root, included only when equals is allowed.',
        'Answer: −6',
      ],
    },
    {
      q: 'How many integers from −10 to 6 satisfy (x + 6)/(x − 2) > 0?',
      a: '8',
      steps: [
        'Critical numbers −6 and 2 split the line.',
        '2 is never included. Count the integers whose value is > 0.',
        'Answer: 8',
      ],
    },
    {
      q: 'Is x = 3 a solution of (x + 6)/(x − 2) > 0? Type 1 for yes, 0 for no.',
      a: '1',
      steps: ['At x = 3 the value is 9, and that > 0 is true.', 'Answer: 1'],
    },
    {
      q: 'For (x + 6)/(x − 2) ≤ 0, what x-value makes the denominator 0?',
      a: '2',
      steps: [
        'The denominator is 0 at x = 2. That vertical asymptote is never a solution.',
        'Answer: 2',
      ],
    },
    {
      q: 'For (x + 6)/(x − 2) ≤ 0, what x-value makes the numerator 0?',
      a: '-6',
      steps: [
        'The numerator is 0 at x = −6. That is a root, included only when equals is allowed.',
        'Answer: −6',
      ],
    },
    {
      q: 'How many integers from −10 to 6 satisfy (x + 6)/(x − 2) ≤ 0?',
      a: '8',
      steps: [
        'Critical numbers −6 and 2 split the line.',
        '2 is never included. Count the integers whose value is ≤ 0.',
        'Answer: 8',
      ],
    },
    {
      q: 'Is x = 3 a solution of (x + 6)/(x − 2) ≤ 0? Type 1 for yes, 0 for no.',
      a: '0',
      steps: ['At x = 3 the value is 9, and that ≤ 0 is false.', 'Answer: 0'],
    },
    {
      q: 'For (x + 6)/(x − 2) ≥ 0, what x-value makes the denominator 0?',
      a: '2',
      steps: [
        'The denominator is 0 at x = 2. That vertical asymptote is never a solution.',
        'Answer: 2',
      ],
    },
    {
      q: 'For (x + 6)/(x − 2) ≥ 0, what x-value makes the numerator 0?',
      a: '-6',
      steps: [
        'The numerator is 0 at x = −6. That is a root, included only when equals is allowed.',
        'Answer: −6',
      ],
    },
    {
      q: 'How many integers from −10 to 6 satisfy (x + 6)/(x − 2) ≥ 0?',
      a: '9',
      steps: [
        'Critical numbers −6 and 2 split the line.',
        '2 is never included. Count the integers whose value is ≥ 0.',
        'Answer: 9',
      ],
    },
    {
      q: 'Is x = 3 a solution of (x + 6)/(x − 2) ≥ 0? Type 1 for yes, 0 for no.',
      a: '1',
      steps: ['At x = 3 the value is 9, and that ≥ 0 is true.', 'Answer: 1'],
    },
    {
      q: 'For (x − 8)/(x + 4) < 0, what x-value makes the denominator 0?',
      a: '-4',
      steps: [
        'The denominator is 0 at x = −4. That vertical asymptote is never a solution.',
        'Answer: −4',
      ],
    },
    {
      q: 'For (x − 8)/(x + 4) < 0, what x-value makes the numerator 0?',
      a: '8',
      steps: [
        'The numerator is 0 at x = 8. That is a root, included only when equals is allowed.',
        'Answer: 8',
      ],
    },
    {
      q: 'How many integers from −8 to 12 satisfy (x − 8)/(x + 4) < 0?',
      a: '11',
      steps: [
        'Critical numbers 8 and −4 split the line.',
        '−4 is never included. Count the integers whose value is < 0.',
        'Answer: 11',
      ],
    },
    {
      q: 'Is x = −5 a solution of (x − 8)/(x + 4) < 0? Type 1 for yes, 0 for no.',
      a: '0',
      steps: ['At x = −5 the value is 13, and that < 0 is false.', 'Answer: 0'],
    },
    {
      q: 'For (x − 8)/(x + 4) > 0, what x-value makes the denominator 0?',
      a: '-4',
      steps: [
        'The denominator is 0 at x = −4. That vertical asymptote is never a solution.',
        'Answer: −4',
      ],
    },
    {
      q: 'For (x − 8)/(x + 4) > 0, what x-value makes the numerator 0?',
      a: '8',
      steps: [
        'The numerator is 0 at x = 8. That is a root, included only when equals is allowed.',
        'Answer: 8',
      ],
    },
    {
      q: 'How many integers from −8 to 12 satisfy (x − 8)/(x + 4) > 0?',
      a: '8',
      steps: [
        'Critical numbers 8 and −4 split the line.',
        '−4 is never included. Count the integers whose value is > 0.',
        'Answer: 8',
      ],
    },
    {
      q: 'Is x = −5 a solution of (x − 8)/(x + 4) > 0? Type 1 for yes, 0 for no.',
      a: '1',
      steps: ['At x = −5 the value is 13, and that > 0 is true.', 'Answer: 1'],
    },
    {
      q: 'For (x − 8)/(x + 4) ≤ 0, what x-value makes the denominator 0?',
      a: '-4',
      steps: [
        'The denominator is 0 at x = −4. That vertical asymptote is never a solution.',
        'Answer: −4',
      ],
    },
  ],
};
