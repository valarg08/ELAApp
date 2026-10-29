import { guideProblem as p, type GuideProblem } from './guide-problem';

/** 25 problems per Algebra chapter, simple to complex: 1–8 warm-up, 9–17 core, 18–25 challenge. */
export const ALGEBRA_PROBLEMS: Record<string, GuideProblem[]> = {
  expressions: [
    p('3x + 5x = kx. Find k.', '8', [
      '3x and 5x are like terms: add the coefficients.',
      '3 + 5 = 8, so 8x.',
      'Answer: 8',
    ]),
    p('7y − 2y = ky. Find k.', '5', ['7 − 2 = 5, so 5y.', 'Answer: 5']),
    p('Evaluate 4x + 3 when x = 5.', '23', ['4 × 5 + 3 = 20 + 3.', 'Answer: 23']),
    p('2(x + 4) = 2x + k. Find k.', '8', [
      'The 2 multiplies every term inside: 2 × 4 = 8.',
      'Answer: 8',
    ]),
    p('Evaluate 3a − 2b when a = 4 and b = 5.', '2', ['3 × 4 − 2 × 5 = 12 − 10.', 'Answer: 2']),
    p('5x + 3 − 2x + 1 = ax + b. Find a.', '3', ['x-terms: 5x − 2x = 3x.', 'Answer: 3']),
    p('5x + 3 − 2x + 1 = ax + b. Find b.', '4', ['Numbers: 3 + 1 = 4.', 'Answer: 4']),
    p('−(x − 6) = −x + k. Find k.', '6', [
      'A minus in front changes every sign inside: −x + 6.',
      'Answer: 6',
    ]),
    p('3(2x − 5) − 4x = ax + b. Find b.', '-15', [
      'Distribute: 6x − 15 − 4x.',
      'Collect: 2x − 15.',
      'Answer: −15',
    ]),
    p('In 4x² + 3x − x² + 2x, what is the coefficient of x² after simplifying?', '3', [
      'x² terms: 4x² − x² = 3x².',
      'Answer: 3',
    ]),
    p('Evaluate 2x² − 3x + 1 when x = −2.', '15', [
      'x² = (−2)² = 4, so 2x² = 8.',
      '−3x = −3(−2) = 6.',
      '8 + 6 + 1 = 15.',
      'Answer: 15',
    ]),
    p('5(a − 2) − 3(a − 4) = 2a + k. Find k.', '2', [
      '5a − 10 − 3a + 12 (−3 × −4 = +12).',
      'Numbers: −10 + 12 = 2.',
      'Answer: 2',
    ]),
    p('−2(3x − 1) + 4(x + 2) = ax + b. Find a.', '-2', [
      '−6x + 2 + 4x + 8.',
      'x-terms: −6x + 4x = −2x.',
      'Answer: −2',
    ]),
    p('−2(3x − 1) + 4(x + 2) = ax + b. Find b.', '10', [
      '−6x + 2 + 4x + 8.',
      'Numbers: 2 + 8 = 10.',
      'Answer: 10',
    ]),
    p('A rectangle has sides 2x + 1 and x + 3. Find its perimeter when x = 4.', '32', [
      'Sides: 9 and 7.',
      'P = 2(9 + 7) = 32.',
      'Answer: 32',
    ]),
    p('Evaluate (x + 3)/(x − 1) when x = 5.', '2', ['(5 + 3)/(5 − 1) = 8/4.', 'Answer: 2']),
    p('0.5(4x − 6) + 3 = ax + b. Find b.', '0', [
      '0.5 × 4x = 2x and 0.5 × (−6) = −3.',
      '2x − 3 + 3 = 2x + 0.',
      'Answer: 0',
    ]),
    p('Simplify 3x − 2(x − (4 − x)), then evaluate it at x = 3.', '5', [
      'Innermost: x − (4 − x) = 2x − 4.',
      '−2(2x − 4) = −4x + 8, so 3x − 4x + 8 = −x + 8.',
      'At x = 3: −3 + 8 = 5.',
      'Answer: 5',
    ]),
    p('If a + b = 7, find 3a + 3b − 4.', '17', [
      '3a + 3b = 3(a + b) = 21.',
      '21 − 4 = 17.',
      'Answer: 17',
    ]),
    p('If 2x − y = 5, find 6x − 3y + 1.', '16', [
      '6x − 3y = 3(2x − y) = 15.',
      '15 + 1 = 16.',
      'Answer: 16',
    ]),
    p('What is the coefficient of x in 4(x − 3) − 2(5 − 3x) + x?', '11', [
      '4x − 12 − 10 + 6x + x.',
      'x-terms: 4 + 6 + 1 = 11.',
      'Answer: 11',
    ]),
    p('Evaluate x² − y² when x = 7 and y = −3.', '40', ['49 − (−3)² = 49 − 9.', 'Answer: 40']),
    p('Simplify (6x² + 9x) ÷ 3x, then evaluate it at x = 2.', '7', [
      'Divide each term: 6x²/3x = 2x and 9x/3x = 3.',
      '2x + 3 at x = 2: 7.',
      'Answer: 7',
    ]),
    p('Evaluate −x² − 3x when x = −2.', '2', [
      '−x² = −(4) = −4 (square first, then the minus).',
      '−3x = 6.',
      '−4 + 6 = 2.',
      'Answer: 2',
    ]),
    p('a(x + 3) − 2x simplifies to 5x + 3a. Find a.', '7', [
      'a(x + 3) − 2x = (a − 2)x + 3a.',
      'a − 2 = 5 → a = 7.',
      'Answer: 7',
    ]),
  ],

  equations: [
    p('Solve x + 7 = 12.', '5', ['Subtract 7 from both sides.', 'x = 5.', 'Answer: 5']),
    p('Solve 3x = 21.', '7', ['Divide both sides by 3.', 'Answer: 7']),
    p('Solve x − 4 = −9.', '-5', ['Add 4: x = −9 + 4.', 'Answer: −5']),
    p('Solve x/5 = 6.', '30', ['Multiply both sides by 5.', 'Answer: 30']),
    p('Solve 2x + 3 = 11.', '4', ['Subtract 3: 2x = 8.', 'Divide by 2: x = 4.', 'Answer: 4']),
    p('Solve 5x − 4 = 21.', '5', ['Add 4: 5x = 25.', 'x = 5.', 'Answer: 5']),
    p('Solve 10 − x = 3.', '7', ['Subtract 10: −x = −7.', 'x = 7.', 'Answer: 7']),
    p('Solve 4x + 1 = −11.', '-3', ['Subtract 1: 4x = −12.', 'x = −3.', 'Answer: −3']),
    p('Solve 3(x − 2) = 15.', '7', [
      'Divide by 3: x − 2 = 5 (or distribute: 3x − 6 = 15).',
      'x = 7.',
      'Answer: 7',
    ]),
    p('Solve 6x + 5 = 2x − 7.', '-3', [
      'x-terms left, numbers right: 6x − 2x = −7 − 5.',
      '4x = −12 → x = −3.',
      'Answer: −3',
    ]),
    p('Solve x/3 + 4 = 10.', '18', [
      'Subtract 4: x/3 = 6.',
      'Multiply by 3: x = 18.',
      'Answer: 18',
    ]),
    p('Solve 2(x + 5) = 3(x − 1).', '13', ['2x + 10 = 3x − 3.', '13 = x.', 'Answer: 13']),
    p('Solve 7 − 2x = 3x + 22.', '-3', ['7 − 22 = 3x + 2x.', '−15 = 5x → x = −3.', 'Answer: −3']),
    p('Solve (2x − 1)/3 = 5.', '8', [
      'Multiply by 3: 2x − 1 = 15.',
      '2x = 16 → x = 8.',
      'Answer: 8',
    ]),
    p('Solve 0.4x + 1.2 = 3.6.', '6', [
      'Subtract 1.2: 0.4x = 2.4.',
      'x = 2.4 ÷ 0.4 = 6.',
      'Answer: 6',
    ]),
    p('Two consecutive integers add to 51. What is the smaller one?', '25', [
      'n + (n + 1) = 51 → 2n = 50.',
      'n = 25.',
      'Answer: 25',
    ]),
    p(
      'A phone plan costs $20 plus $0.10 a minute. A bill is $35. How many minutes were used?',
      '150',
      ['20 + 0.1m = 35 → 0.1m = 15.', 'm = 150.', 'Answer: 150'],
    ),
    p('Solve x/2 + x/3 = 10.', '12', [
      'Multiply everything by 6: 3x + 2x = 60.',
      '5x = 60 → x = 12.',
      'Answer: 12',
    ]),
    p('Solve 3(2x − 1) − 2(x + 4) = 9.', '5', [
      '6x − 3 − 2x − 8 = 9.',
      '4x − 11 = 9 → 4x = 20.',
      'x = 5.',
      'Answer: 5',
    ]),
    p('Solve (x + 1)/4 = (x − 2)/3.', '11', [
      'Cross-multiply: 3(x + 1) = 4(x − 2).',
      '3x + 3 = 4x − 8.',
      'x = 11.',
      'Answer: 11',
    ]),
    p('Solve ax + 5 = 17 when a = 4.', '3', ['4x + 5 = 17 → 4x = 12.', 'x = 3.', 'Answer: 3']),
    p('Three consecutive even integers add to 78. What is the largest?', '28', [
      'n + (n + 2) + (n + 4) = 78 → 3n + 6 = 78.',
      'n = 24: the numbers are 24, 26, 28.',
      'Answer: 28',
    ]),
    p(
      'Plan A costs $15 plus $3 an hour; plan B costs $5 an hour. After how many hours do they cost the same?',
      '15/2',
      ['15 + 3h = 5h.', '15 = 2h → h = 7.5.', 'Answer: 7.5 hours'],
    ),
    p(
      'A parent is 3 times as old as a child. In 12 years the parent will be twice as old. How old is the child now?',
      '12',
      [
        'Child c, parent 3c. In 12 years: 3c + 12 = 2(c + 12).',
        '3c + 12 = 2c + 24 → c = 12.',
        'Answer: 12',
      ],
    ),
    p('Solve 1.5(x − 4) = 0.5x + 2.', '8', ['1.5x − 6 = 0.5x + 2.', 'x = 8.', 'Answer: 8']),
  ],

  inequalities: [
    p('Solve x + 3 > 7. The answer is x > k. Find k.', '4', [
      'Subtract 3 from both sides.',
      'x > 4.',
      'Answer: 4',
    ]),
    p('Solve 2x ≤ 10. The answer is x ≤ k. Find k.', '5', [
      'Divide by 2 (positive, no flip).',
      'Answer: 5',
    ]),
    p('Solve x − 5 < −2. The answer is x < k. Find k.', '3', ['Add 5: x < 3.', 'Answer: 3']),
    p('Solve −x > 4. The answer is x < k. Find k.', '-4', [
      'Multiply by −1 and flip the sign: x < −4.',
      'Answer: −4',
    ]),
    p('What is the smallest integer with x > 6.5?', '7', [
      '6.5 itself is not allowed, and 7 is the first integer above it.',
      'Answer: 7',
    ]),
    p('What is the largest integer with x ≤ −2?', '-2', ['≤ includes −2 itself.', 'Answer: −2']),
    p('Solve 3x ≥ −12. The answer is x ≥ k. Find k.', '-4', [
      'Divide by 3 (positive, no flip).',
      'Answer: −4',
    ]),
    p('Solve x/2 < 3. The answer is x < k. Find k.', '6', ['Multiply by 2.', 'Answer: 6']),
    p('Solve 3x − 2 > 13. The answer is x > k. Find k.', '5', [
      'Add 2: 3x > 15.',
      'Divide by 3: x > 5.',
      'Answer: 5',
    ]),
    p('Solve −2x + 5 ≤ 11. The answer is x ≥ k. Find k.', '-3', [
      'Subtract 5: −2x ≤ 6.',
      'Divide by −2 and flip: x ≥ −3.',
      'Answer: −3',
    ]),
    p('Solve 5 − 3x < 20. The answer is x > k. Find k.', '-5', [
      'Subtract 5: −3x < 15.',
      'Divide by −3 and flip: x > −5.',
      'Answer: −5',
    ]),
    p('What is the smallest integer that satisfies 4x + 1 > 18?', '5', [
      '4x > 17 → x > 4.25.',
      'The first integer above 4.25 is 5.',
      'Answer: 5',
    ]),
    p('What is the largest integer that satisfies −3x + 2 ≥ −10?', '4', [
      '−3x ≥ −12.',
      'Divide by −3 and flip: x ≤ 4.',
      'Answer: 4',
    ]),
    p('How many integers satisfy −2 < x ≤ 3?', '5', [
      '−2 is left out (open end), 3 is included.',
      '−1, 0, 1, 2, 3.',
      'Answer: 5',
    ]),
    p('Solve 2(x − 1) ≥ x + 4. The answer is x ≥ k. Find k.', '6', [
      '2x − 2 ≥ x + 4.',
      'x ≥ 6.',
      'Answer: 6',
    ]),
    p('Movie tickets cost $7.50 and you have $40. What is the most tickets you can buy?', '5', [
      '7.5t ≤ 40 → t ≤ 5.33.',
      'Whole tickets only: 5.',
      'Answer: 5',
    ]),
    p('Solve x/(−4) > 2. The answer is x < k. Find k.', '-8', [
      'Multiply by −4 and flip: x < −8.',
      'Answer: −8',
    ]),
    p('How many integers satisfy −1 < 2x + 3 ≤ 9?', '5', [
      'Subtract 3 everywhere: −4 < 2x ≤ 6.',
      'Divide by 2: −2 < x ≤ 3.',
      'Integers: −1, 0, 1, 2, 3.',
      'Answer: 5',
    ]),
    p('What is the smallest integer with 3(x + 2) < 5x − 8?', '8', [
      '3x + 6 < 5x − 8.',
      '14 < 2x → x > 7.',
      'The first integer above 7 is 8.',
      'Answer: 8',
    ]),
    p(
      'A taxi charges $3 plus $2 a mile. You have $25. What is the most whole miles you can ride?',
      '11',
      ['3 + 2m ≤ 25 → 2m ≤ 22.', 'm ≤ 11.', 'Answer: 11'],
    ),
    p('Solve (x − 4)/3 ≥ (x + 2)/5. The answer is x ≥ k. Find k.', '13', [
      'Multiply by 15: 5(x − 4) ≥ 3(x + 2).',
      '5x − 20 ≥ 3x + 6 → 2x ≥ 26.',
      'x ≥ 13.',
      'Answer: 13',
    ]),
    p('Add up all the integers x with 4 ≤ 3x − 2 < 13.', '9', [
      'Add 2: 6 ≤ 3x < 15.',
      'Divide by 3: 2 ≤ x < 5.',
      'Integers 2, 3, 4: sum 9.',
      'Answer: 9',
    ]),
    p(
      'Test scores so far: 78, 85, 90. What is the lowest fourth score for an average of at least 85?',
      '87',
      [
        'The four scores must total at least 4 × 85 = 340.',
        'So far: 78 + 85 + 90 = 253.',
        '340 − 253 = 87.',
        'Answer: 87',
      ],
    ),
    p('What is the largest integer with −4x + 7 > 2x − 11?', '2', [
      '−6x > −18.',
      'Divide by −6 and flip: x < 3.',
      'The largest integer below 3 is 2.',
      'Answer: 2',
    ]),
    p(
      'Plan A: $30 plus $0.05 a text. Plan B: $10 plus $0.15 a text. B is cheaper when texts < k. Find k.',
      '200',
      ['10 + 0.15t < 30 + 0.05t.', '0.1t < 20 → t < 200.', 'Answer: 200'],
    ),
  ],

  functions: [
    p('f(x) = 2x + 3. Find f(4).', '11', ['Replace x with 4: 2(4) + 3.', 'Answer: 11']),
    p('f(x) = x² − 1. Find f(3).', '8', ['3² − 1 = 9 − 1.', 'Answer: 8']),
    p('g(x) = 5 − x. Find g(−2).', '7', ['5 − (−2) = 7.', 'Answer: 7']),
    p('f(x) = 3x. Find f(0).', '0', ['3 × 0 = 0.', 'Answer: 0']),
    p('h(t) = t² + t. Find h(2).', '6', ['4 + 2 = 6.', 'Answer: 6']),
    p('f(x) = 4x − 1. For which x is f(x) = 11?', '3', [
      '4x − 1 = 11 → 4x = 12.',
      'x = 3.',
      'Answer: 3',
    ]),
    p('f(x) = x/2 + 1. Find f(10).', '6', ['10/2 + 1 = 6.', 'Answer: 6']),
    p('f(x) = −x². Find f(3).', '-9', ['Square first: 3² = 9, then the minus: −9.', 'Answer: −9']),
    p('f(x) = x² − 1. Find f(−2).', '3', [
      '(−2)² − 1 = 4 − 1.',
      'Brackets around the −2 matter.',
      'Answer: 3',
    ]),
    p('f(x) = 2x − 5 and f(a) = 9. Find a.', '7', ['2a − 5 = 9 → 2a = 14.', 'a = 7.', 'Answer: 7']),
    p('f(x) = 3x + 1 and g(x) = x². Find f(2) + g(3).', '16', [
      'f(2) = 7 and g(3) = 9.',
      '7 + 9 = 16.',
      'Answer: 16',
    ]),
    p('f(x) = x² − 4x. Find f(−1).', '5', ['(−1)² − 4(−1) = 1 + 4.', 'Answer: 5']),
    p('f(x) = 2x + 1. Find f(f(1)).', '7', ['Inside first: f(1) = 3.', 'f(3) = 7.', 'Answer: 7']),
    p('f(x) = (x + 6)/2. Find f(4).', '5', ['(4 + 6)/2 = 5.', 'Answer: 5']),
    p('A linear function passes through (1, 4), (2, 7) and (3, 10). Find f(10).', '31', [
      'Each step of 1 in x adds 3: f(x) = 3x + b.',
      '4 = 3(1) + b → b = 1, so f(x) = 3x + 1.',
      'f(10) = 31.',
      'Answer: 31',
    ]),
    p('f(x) = kx + 2 and f(3) = 14. Find k.', '4', [
      '3k + 2 = 14 → 3k = 12.',
      'k = 4.',
      'Answer: 4',
    ]),
    p('f(x) = x² + 1. Add up all the x-values with f(x) = 10.', '0', [
      'x² + 1 = 10 → x² = 9.',
      'x = 3 or −3.',
      '3 + (−3) = 0.',
      'Answer: 0',
    ]),
    p('f(x) = 2x − 3 and g(x) = x². Find f(g(−3)).', '15', [
      'Inside first: g(−3) = 9.',
      'f(9) = 18 − 3 = 15.',
      'Answer: 15',
    ]),
    p('f(x) = ax + b, f(1) = 5 and f(3) = 11. Find f(5).', '17', [
      'a + b = 5 and 3a + b = 11.',
      'Subtract: 2a = 6 → a = 3, b = 2.',
      'f(5) = 15 + 2 = 17.',
      'Answer: 17',
    ]),
    p('f(x + 1) = 2x + 7. Find f(4).', '13', [
      'x + 1 = 4 means x = 3.',
      '2(3) + 7 = 13.',
      'Answer: 13',
    ]),
    p('f(x) = x² − 6x + 10. What is its smallest output?', '1', [
      'The vertex is at x = −b/2a = 6/2 = 3.',
      'f(3) = 9 − 18 + 10 = 1.',
      'Answer: 1',
    ]),
    p('A plumber charges C(n) = 12 + 4n. For what n is C(n) = 60?', '12', [
      '12 + 4n = 60 → 4n = 48.',
      'n = 12.',
      'Answer: 12',
    ]),
    p('f(x) = 3 − 2x and f(a) = f(2) + 6. Find a.', '-1', [
      'f(2) = 3 − 4 = −1, so f(a) = 5.',
      '3 − 2a = 5 → a = −1.',
      'Answer: −1',
    ]),
    p('f(x) = x². Find f(a + 1) − f(a) when a = 4.', '9', ['f(5) − f(4) = 25 − 16.', 'Answer: 9']),
    p('A ball’s height is h(t) = −5t² + 20t meters. Find h(2).', '20', [
      '−5(4) + 20(2) = −20 + 40.',
      'Answer: 20 m',
    ]),
  ],

  linear: [
    p('Find the slope through (0, 0) and (2, 6).', '3', [
      'Slope = rise ÷ run = (6 − 0)/(2 − 0).',
      'Answer: 3',
    ]),
    p('What is the y-intercept of y = 4x − 7?', '-7', [
      'In y = mx + b, b is the y-intercept.',
      'Answer: −7',
    ]),
    p('What is the slope of y = −2x + 5?', '-2', ['In y = mx + b, m is the slope.', 'Answer: −2']),
    p('Find the slope through (1, 2) and (3, 8).', '3', ['(8 − 2)/(3 − 1) = 6/2.', 'Answer: 3']),
    p('y = 3x + 1. Find y when x = 2.', '7', ['3(2) + 1 = 7.', 'Answer: 7']),
    p('A line with slope 2 crosses the y-axis at (0, 4). What is its y-intercept?', '4', [
      'The y-intercept is the y where x = 0.',
      'Answer: 4',
    ]),
    p('What is the slope of the horizontal line y = 5?', '0', [
      'A horizontal line has no rise.',
      'Answer: 0',
    ]),
    p('Where does y = 2x − 6 cross the x-axis? Give x.', '3', [
      'On the x-axis, y = 0: 2x − 6 = 0.',
      'x = 3.',
      'Answer: 3',
    ]),
    p('Find the slope through (−2, 5) and (4, −1).', '-1', [
      '(−1 − 5)/(4 − (−2)) = −6/6.',
      'Answer: −1',
    ]),
    p('A line has slope 2 and passes through (3, 1). Find its y-intercept.', '-5', [
      '1 = 2(3) + b.',
      'b = 1 − 6 = −5.',
      'Answer: −5',
    ]),
    p('What is the slope of 2x + 3y = 12?', '-2/3', [
      'Solve for y: 3y = −2x + 12.',
      'y = −(2/3)x + 4.',
      'Answer: −2/3',
    ]),
    p('What is the y-intercept of 2x + 3y = 12?', '4', [
      'Set x = 0: 3y = 12.',
      'y = 4.',
      'Answer: 4',
    ]),
    p('Find the slope through (0, −1) and (3, 1).', '2/3', [
      '(1 − (−1))/(3 − 0) = 2/3.',
      'Answer: 2/3',
    ]),
    p('What is the slope of any line parallel to y = 5x − 2?', '5', [
      'Parallel lines have equal slopes.',
      'Answer: 5',
    ]),
    p('What is the slope of a line perpendicular to y = 2x + 1?', '-1/2', [
      'Perpendicular slopes multiply to −1: flip and change the sign.',
      '2 → −1/2.',
      'Answer: −1/2',
    ]),
    p('Where does 3x − 4y = 12 cross the x-axis? Give x.', '4', [
      'Set y = 0: 3x = 12.',
      'x = 4.',
      'Answer: 4',
    ]),
    p('A taxi costs $4 plus $2.50 a mile. What does a 6-mile ride cost in dollars?', '19', [
      'y = 2.5x + 4 at x = 6.',
      '15 + 4 = 19.',
      'Answer: $19',
    ]),
    p('A line passes through (2, 3) and (6, 11). Find its y-intercept.', '-1', [
      'Slope: (11 − 3)/(6 − 2) = 2.',
      '3 = 2(2) + b → b = −1.',
      'Answer: −1',
    ]),
    p('The line through (1, k) and (4, 10) has slope 2. Find k.', '4', [
      '(10 − k)/(4 − 1) = 2.',
      '10 − k = 6 → k = 4.',
      'Answer: 4',
    ]),
    p(
      'A line is perpendicular to y = −3x + 2 and passes through (3, 4). Find its y-intercept.',
      '3',
      ['Perpendicular slope: 1/3.', '4 = (1/3)(3) + b = 1 + b.', 'b = 3.', 'Answer: 3'],
    ),
    p('y = ax + 3 is parallel to y = 6x − 1. Find a.', '6', [
      'Parallel lines have the same slope.',
      'Answer: 6',
    ]),
    p('Find the area of the triangle made by y = −x + 6 and the two axes.', '18', [
      'Intercepts: (0, 6) and (6, 0).',
      'Area = ½ × 6 × 6 = 18.',
      'Answer: 18',
    ]),
    p('A plumber charges $50 plus $40 an hour. A bill is $210. How many hours?', '4', [
      '50 + 40h = 210 → 40h = 160.',
      'h = 4.',
      'Answer: 4',
    ]),
    p('A line passes through (−1, 2) and (3, −6). Find y when x = 5.', '-10', [
      'Slope: (−6 − 2)/(3 − (−1)) = −8/4 = −2.',
      '2 = −2(−1) + b → b = 0, so y = −2x.',
      'At x = 5: y = −10.',
      'Answer: −10',
    ]),
    p('The point (a, 7) lies on 3x − 2y = 4. Find a.', '6', [
      '3a − 14 = 4.',
      '3a = 18 → a = 6.',
      'Answer: 6',
    ]),
  ],

  systems: [
    p('x + y = 10 and x − y = 2. Find x.', '6', [
      'Add the equations: 2x = 12.',
      'x = 6.',
      'Answer: 6',
    ]),
    p('x + y = 10 and x − y = 2. Find y.', '4', [
      'x = 6 (add the equations), so 6 + y = 10.',
      'y = 4.',
      'Answer: 4',
    ]),
    p('y = 2x and x + y = 9. Find x.', '3', [
      'Substitute: x + 2x = 9.',
      '3x = 9 → x = 3.',
      'Answer: 3',
    ]),
    p('y = x + 1 and y = 5. Find x.', '4', ['5 = x + 1.', 'x = 4.', 'Answer: 4']),
    p('x = 3 and 2x + y = 10. Find y.', '4', ['6 + y = 10.', 'y = 4.', 'Answer: 4']),
    p('x + y = 7 and y = 2. Find x.', '5', ['x + 2 = 7.', 'Answer: 5']),
    p('2x = 8 and x + y = 9. Find y.', '5', ['x = 4, so 4 + y = 9.', 'y = 5.', 'Answer: 5']),
    p('y = 3x and y = 12. Find x.', '4', ['3x = 12.', 'Answer: 4']),
    p('y = −x + 6 and y = 2x − 3. Find x.', '3', [
      'Set them equal: −x + 6 = 2x − 3.',
      '9 = 3x → x = 3.',
      'Answer: 3',
    ]),
    p('2x + y = 11 and x − y = 1. Find x.', '4', ['Add: 3x = 12.', 'x = 4.', 'Answer: 4']),
    p('3x + 2y = 16 and x − 2y = 0. Find y.', '2', [
      'Add: 4x = 16 → x = 4.',
      '4 − 2y = 0 → y = 2.',
      'Answer: 2',
    ]),
    p('x + 2y = 10 and 3x − 2y = 6. Find y.', '3', [
      'Add: 4x = 16 → x = 4.',
      '4 + 2y = 10 → y = 3.',
      'Answer: 3',
    ]),
    p('y = 4x − 5 and y = x + 4. Find y.', '7', [
      '4x − 5 = x + 4 → 3x = 9 → x = 3.',
      'y = 3 + 4 = 7.',
      'Answer: 7',
    ]),
    p('2x + 3y = 13 and x + y = 5. Find x.', '2', [
      'x = 5 − y. Substitute: 2(5 − y) + 3y = 13.',
      '10 + y = 13 → y = 3.',
      'x = 5 − 3 = 2.',
      'Answer: 2',
    ]),
    p(
      'Adult tickets cost $8 and child tickets $5. 10 tickets cost $65. How many adult tickets?',
      '5',
      [
        'a + c = 10 and 8a + 5c = 65.',
        '8a + 5(10 − a) = 65 → 3a + 50 = 65.',
        'a = 5.',
        'Answer: 5',
      ],
    ),
    p('Two numbers add to 30 and differ by 8. What is the larger?', '19', [
      'a + b = 30 and a − b = 8.',
      'Add: 2a = 38 → a = 19.',
      'Answer: 19',
    ]),
    p('3x − y = 7 and 2x + y = 8. Find y.', '2', [
      'Add: 5x = 15 → x = 3.',
      '2(3) + y = 8 → y = 2.',
      'Answer: 2',
    ]),
    p('2x + 3y = 12 and 5x − 2y = 11. Find x.', '3', [
      'Make the y-terms cancel: ×2 gives 4x + 6y = 24; ×3 gives 15x − 6y = 33.',
      'Add: 19x = 57.',
      'x = 3.',
      'Answer: 3',
    ]),
    p('20 coins are dimes and quarters, worth $3.50 in all. How many dimes?', '10', [
      'd + q = 20 and 0.10d + 0.25q = 3.50.',
      '0.10d + 0.25(20 − d) = 3.50 → 5 − 0.15d = 3.50.',
      '0.15d = 1.50 → d = 10.',
      'Answer: 10',
    ]),
    p('y = 3x + 2 and y = kx − 1 have no solution. Find k.', '3', [
      'No solution means parallel lines: same slope, different intercepts.',
      'k = 3 (intercepts 2 and −1 differ).',
      'Answer: 3',
    ]),
    p('2x + 4y = 10 and x + ky = 5 have infinitely many solutions. Find k.', '2', [
      'Infinitely many means the same line.',
      'Halve the first: x + 2y = 5.',
      'k = 2.',
      'Answer: 2',
    ]),
    p('x/2 + y/3 = 4 and x − y = 3. Find x.', '6', [
      '×6: 3x + 2y = 24. And x = y + 3.',
      '3(y + 3) + 2y = 24 → 5y = 15 → y = 3.',
      'x = 6.',
      'Answer: 6',
    ]),
    p(
      'Mix a 10% solution and a 30% solution to make 20 L of a 25% solution. How many liters of the 30% solution?',
      '15',
      [
        'a + b = 20 and 0.10a + 0.30b = 0.25 × 20 = 5.',
        '0.10(20 − b) + 0.30b = 5 → 2 + 0.20b = 5.',
        'b = 15.',
        'Answer: 15 L',
      ],
    ),
    p(
      'A boat goes 24 km downstream in 2 hours and back upstream in 3 hours. What is the boat’s speed in still water (km/h)?',
      '10',
      [
        'Downstream: b + c = 24 ÷ 2 = 12. Upstream: b − c = 24 ÷ 3 = 8.',
        'Add: 2b = 20.',
        'b = 10.',
        'Answer: 10 km/h',
      ],
    ),
    p('4x − 3y = 1 and 3x + 4y = 7. Find x + y.', '2', [
      '×4 and ×3: 16x − 12y = 4 and 9x + 12y = 21.',
      'Add: 25x = 25 → x = 1; then 3 + 4y = 7 → y = 1.',
      'x + y = 2.',
      'Answer: 2',
    ]),
  ],

  exponents: [
    p('x³ · x⁴ = xⁿ. Find n.', '7', [
      'Product rule: add the exponents.',
      '3 + 4 = 7.',
      'Answer: 7',
    ]),
    p('x⁹ ÷ x³ = xⁿ. Find n.', '6', [
      'Quotient rule: subtract the exponents.',
      '9 − 3 = 6.',
      'Answer: 6',
    ]),
    p('(x²)⁵ = xⁿ. Find n.', '10', [
      'Power of a power: multiply the exponents.',
      '2 × 5 = 10.',
      'Answer: 10',
    ]),
    p('3⁴', '81', ['3 × 3 × 3 × 3 = 81.', 'Answer: 81']),
    p('(−4)²', '16', ['The base is −4: (−4)(−4).', 'Answer: 16']),
    p('−4²', '-16', ['The base is 4: −(4 × 4).', 'Answer: −16']),
    p('a⁵ · a = aⁿ. Find n.', '6', ['a is a¹: 5 + 1 = 6.', 'Answer: 6']),
    p('2³ · 2²', '32', ['2⁵ = 32.', 'Answer: 32']),
    p('(2x³)² = kxⁿ. Find k.', '4', ['Square every factor: 2² = 4.', 'Answer: 4']),
    p('(2x³)² = kxⁿ. Find n.', '6', ['(x³)² = x⁶.', 'Answer: 6']),
    p('12x⁶ ÷ 4x² = kxⁿ. Find k.', '3', ['Divide the numbers: 12 ÷ 4 = 3.', 'Answer: 3']),
    p('12x⁶ ÷ 4x² = kxⁿ. Find n.', '4', ['Subtract the exponents: 6 − 2 = 4.', 'Answer: 4']),
    p('(x⁴y²)³ = xᵃyᵇ. Find a + b.', '18', [
      'Multiply each exponent by 3: x¹²y⁶.',
      '12 + 6 = 18.',
      'Answer: 18',
    ]),
    p('x² · x³ · x⁴ = xⁿ. Find n.', '9', ['2 + 3 + 4 = 9.', 'Answer: 9']),
    p('7⁵ ÷ 7³', '49', ['7² = 49.', 'Answer: 49']),
    p('(3²)²', '81', ['3⁴ = 81.', 'Answer: 81']),
    p('5³ ÷ 5³', '1', [
      'Anything (not 0) divided by itself is 1.',
      'Quotient rule: 5⁰ = 1.',
      'Answer: 1',
    ]),
    p('Use the quotient rule: 2² ÷ 2⁵ = 2ⁿ. What is its value?', '1/8', [
      '2² ÷ 2⁵ = 4/32.',
      '= 1/8 (that is 2⁻³).',
      'Answer: 1/8',
    ]),
    p('4ˣ = 2¹⁰. Find x.', '5', ['4 = 2², so (2²)ˣ = 2²ˣ.', '2x = 10 → x = 5.', 'Answer: 5']),
    p('3ˣ⁺¹ = 81. Find x.', '3', ['81 = 3⁴.', 'x + 1 = 4 → x = 3.', 'Answer: 3']),
    p('(2a²b)³ ÷ (4a⁴b) = k·aᵐ·bⁿ. Find k + m + n.', '6', [
      '(2a²b)³ = 8a⁶b³.',
      '8a⁶b³ ÷ 4a⁴b = 2a²b².',
      '2 + 2 + 2 = 6.',
      'Answer: 6',
    ]),
    p('27² ÷ 9³', '1', ['27 = 3³ and 9 = 3²: 3⁶ ÷ 3⁶.', '= 1.', 'Answer: 1']),
    p('(x³)ⁿ · x² = x¹⁴. Find n.', '4', ['3n + 2 = 14.', 'n = 4.', 'Answer: 4']),
    p('Evaluate (−2x²)³ when x = 1.', '-8', ['(−2 · 1)³ = (−2)³.', '= −8.', 'Answer: −8']),
    p('2ⁿ + 2ⁿ = 2⁷. Find n.', '6', [
      '2ⁿ + 2ⁿ = 2 · 2ⁿ = 2ⁿ⁺¹.',
      'n + 1 = 7 → n = 6.',
      'Answer: 6',
    ]),
  ],

  multiplying: [
    p('3(x + 4) = 3x + k. Find k.', '12', ['3 × 4 = 12.', 'Answer: 12']),
    p('x(x + 5) = x² + kx. Find k.', '5', ['x · x = x² and x · 5 = 5x.', 'Answer: 5']),
    p('(x + 2)(x + 3) = x² + bx + c. Find b.', '5', [
      'FOIL: x² + 3x + 2x + 6.',
      'Outside + inside: 3x + 2x = 5x.',
      'Answer: 5',
    ]),
    p('(x + 2)(x + 3) = x² + bx + c. Find c.', '6', ['Last: 2 × 3 = 6.', 'Answer: 6']),
    p('2x(3x − 1) = 6x² + kx. Find k.', '-2', ['2x × (−1) = −2x.', 'Answer: −2']),
    p('(x + 1)(x + 1) = x² + bx + 1. Find b.', '2', ['x² + x + x + 1.', 'Answer: 2']),
    p('(x − 4)(x + 4) = x² + c. Find c.', '-16', [
      'The middle terms cancel: −4x + 4x = 0.',
      '−4 × 4 = −16.',
      'Answer: −16',
    ]),
    p('(x + 5)(x − 2) = x² + bx + c. Find c.', '-10', ['5 × (−2) = −10.', 'Answer: −10']),
    p('(x + 5)(x − 2) = x² + bx + c. Find b.', '3', ['−2x + 5x = 3x.', 'Answer: 3']),
    p('(2x + 3)(x + 4) = 2x² + bx + c. Find b.', '11', [
      'Outside: 8x. Inside: 3x.',
      '8x + 3x = 11x.',
      'Answer: 11',
    ]),
    p('(2x + 3)(x + 4) = 2x² + bx + c. Find c.', '12', ['3 × 4 = 12.', 'Answer: 12']),
    p('(x − 3)² = x² + bx + 9. Find b.', '-6', [
      '(x − 3)(x − 3) = x² − 3x − 3x + 9.',
      'Answer: −6',
    ]),
    p('(3x − 2)(2x + 5) = 6x² + bx + c. Find b.', '11', [
      'Outside: 15x. Inside: −4x.',
      '15x − 4x = 11x.',
      'Answer: 11',
    ]),
    p('(3x − 2)(2x + 5) = 6x² + bx + c. Find c.', '-10', ['−2 × 5 = −10.', 'Answer: −10']),
    p('(x + 7)² = x² + 14x + c. Find c.', '49', ['7 × 7 = 49.', 'Answer: 49']),
    p(
      'How many products do you write when expanding (x² + 3x − 1)(x + 2), before collecting?',
      '6',
      ['Every term times every term: 3 × 2.', 'Answer: 6'],
    ),
    p('Evaluate (x + 2)(x + 6) at x = 1.', '21', [
      '3 × 7 = 21 (or x² + 8x + 12 = 1 + 8 + 12).',
      'Answer: 21',
    ]),
    p('Expand (x² + 2x − 3)(x − 1). What is the coefficient of x?', '-5', [
      'Products with x: 2x × (−1) = −2x and −3 × x = −3x.',
      '−2x − 3x = −5x.',
      'Answer: −5',
    ]),
    p('Expand (2x − 1)³. What is the coefficient of x²?', '-12', [
      '(2x − 1)² = 4x² − 4x + 1.',
      '× (2x − 1): x² terms are 4x² × (−1) and −4x × 2x: −4x² − 8x².',
      '= −12x².',
      'Answer: −12',
    ]),
    p('(x + a)(x + 3) = x² + 7x + 12. Find a.', '4', [
      '3a = 12 (and a + 3 = 7).',
      'a = 4.',
      'Answer: 4',
    ]),
    p('(x + 4)(x − k) = x² + x − 12. Find k.', '3', [
      '−4k = −12 → k = 3.',
      'Check the middle: 4x − 3x = x ✓.',
      'Answer: 3',
    ]),
    p('(ax + 2)(x + 5) = 3x² + bx + 10. Find b.', '17', [
      'a · 1 = 3, so a = 3.',
      'Middle: 3x × 5 + 2 × x = 15x + 2x.',
      'b = 17.',
      'Answer: 17',
    ]),
    p('A rectangle is (x + 3) by (2x − 1). Expand its area: what is the constant term?', '-3', [
      '(x + 3)(2x − 1) = 2x² − x + 6x − 3.',
      'Constant: 3 × (−1) = −3.',
      'Answer: −3',
    ]),
    p('(x − 1)(x + 1)(x² + 1) = x⁴ + c. Find c.', '-1', [
      '(x − 1)(x + 1) = x² − 1.',
      '(x² − 1)(x² + 1) = x⁴ − 1.',
      'Answer: −1',
    ]),
    p('(x + y)² − (x − y)² = kxy. Find k.', '4', [
      '(x² + 2xy + y²) − (x² − 2xy + y²).',
      '= 4xy.',
      'Answer: 4',
    ]),
  ],

  factoring: [
    p('What is the greatest common factor of 6x + 9?', '3', [
      'GCF of 6 and 9 is 3: 6x + 9 = 3(2x + 3).',
      'Answer: 3',
    ]),
    p('x² + 5x + 6 = (x + 2)(x + k). Find k.', '3', [
      'Two numbers with product 6 and sum 5: 2 and 3.',
      'Answer: 3',
    ]),
    p('x² − 9 = (x − 3)(x + k). Find k.', '3', [
      'Difference of squares: a² − b² = (a − b)(a + b).',
      'Answer: 3',
    ]),
    p('4x² + 8x = 4x(x + k). Find k.', '2', ['8x ÷ 4x = 2.', 'Answer: 2']),
    p('x² + 7x + 10 = (x + 2)(x + k). Find k.', '5', ['Product 10, sum 7: 2 and 5.', 'Answer: 5']),
    p('x² − x − 6 = (x − 3)(x + k). Find k.', '2', ['Product −6, sum −1: −3 and 2.', 'Answer: 2']),
    p('x² − 8x + 16 = (x − k)². Find k.', '4', ['Product 16, sum −8: −4 and −4.', 'Answer: 4']),
    p('5x³ + 10x² = 5x²(x + k). Find k.', '2', ['10x² ÷ 5x² = 2.', 'Answer: 2']),
    p('x² + x − 12 = (x + a)(x − 3). Find a.', '4', ['Product −12, sum 1: 4 and −3.', 'Answer: 4']),
    p('x² − 5x − 14 = (x − 7)(x + k). Find k.', '2', [
      'Product −14, sum −5: −7 and 2.',
      'Answer: 2',
    ]),
    p('Two numbers have sum −9 and product 20. What is the larger?', '-4', [
      '−4 + (−5) = −9 and (−4)(−5) = 20.',
      'The larger is −4.',
      'Answer: −4',
    ]),
    p('x² − 49 = 0. What is the positive solution?', '7', [
      '(x − 7)(x + 7) = 0.',
      'x = 7 or −7.',
      'Answer: 7',
    ]),
    p('2x² + 7x + 3 = (2x + 1)(x + k). Find k.', '3', [
      'ac = 6; numbers with product 6 and sum 7: 6 and 1.',
      '2x² + 6x + x + 3 = 2x(x + 3) + 1(x + 3) = (2x + 1)(x + 3).',
      'Answer: 3',
    ]),
    p('3x² + 10x + 8 = (3x + a)(x + 2). Find a.', '4', [
      'ac = 24; product 24, sum 10: 6 and 4.',
      '3x² + 6x + 4x + 8 = 3x(x + 2) + 4(x + 2).',
      'Answer: 4',
    ]),
    p('6x²y + 9xy² = 3xy(2x + ky). Find k.', '3', ['9xy² ÷ 3xy = 3y.', 'Answer: 3']),
    p('x² + 2x − 15 = 0. What is the positive solution?', '3', [
      '(x + 5)(x − 3) = 0.',
      'x = −5 or 3.',
      'Answer: 3',
    ]),
    p('x² − 10x + 21 = 0. Add the two solutions.', '10', [
      '(x − 3)(x − 7) = 0.',
      'x = 3 or 7; 3 + 7 = 10.',
      'Answer: 10',
    ]),
    p('6x² − x − 2 = (3x − 2)(2x + k). Find k.', '1', [
      'Expand to check: (3x − 2)(2x + k) = 6x² + (3k − 4)x − 2k.',
      '−2k = −2 → k = 1 (and 3 − 4 = −1 ✓).',
      'Answer: 1',
    ]),
    p('4x² − 25 = (2x − 5)(2x + k). Find k.', '5', [
      'Difference of squares: (2x)² − 5².',
      'Answer: 5',
    ]),
    p('2x³ − 8x = 2x(x − 2)(x + k). Find k.', '2', [
      'Common factor first: 2x(x² − 4).',
      'Then x² − 4 = (x − 2)(x + 2).',
      'Answer: 2',
    ]),
    p('x² + kx + 24 = (x + 4)(x + 6). Find k.', '10', ['4 + 6 = 10.', 'Answer: 10']),
    p('12x² + 7x − 10 = (4x + 5)(3x − k). Find k.', '2', [
      '−10 = 5 × (−k) → k = 2.',
      'Check the middle: 4x(−2) + 5(3x) = −8x + 15x = 7x ✓.',
      'Answer: 2',
    ]),
    p('x⁴ − 16 = (x² + 4)(x + 2)(x − k). Find k.', '2', [
      'x⁴ − 16 = (x² − 4)(x² + 4).',
      'x² − 4 = (x − 2)(x + 2).',
      'Answer: 2',
    ]),
    p('3x² − 12x + 12 = 3(x − k)². Find k.', '2', [
      'Common factor: 3(x² − 4x + 4).',
      'x² − 4x + 4 = (x − 2)².',
      'Answer: 2',
    ]),
    p('Work out 101² − 99² by factoring.', '400', [
      'a² − b² = (a − b)(a + b).',
      '(101 − 99)(101 + 99) = 2 × 200.',
      'Answer: 400',
    ]),
  ],

  quadratics: [
    p('What is the y-coordinate of the vertex of y = x²?', '0', [
      'y = x² is smallest at x = 0, where y = 0.',
      'Answer: 0',
    ]),
    p('(x − 2)(x − 5) = 0. What is the larger solution?', '5', [
      'Zero product rule: x − 2 = 0 or x − 5 = 0.',
      'x = 2 or 5.',
      'Answer: 5',
    ]),
    p('Where does y = x² − 4 cross the positive x-axis? Give x.', '2', [
      'x² − 4 = 0 → x² = 4.',
      'x = ±2; positive: 2.',
      'Answer: 2',
    ]),
    p('y = 2x² + 1 opens up. What is its smallest y-value?', '1', [
      '2x² is never negative, smallest at x = 0.',
      'y = 1.',
      'Answer: 1',
    ]),
    p('x² = 49. What is the positive solution?', '7', ['√49 = 7.', 'Answer: 7']),
    p('What is the axis of symmetry of y = x² − 6x + 5? Give x.', '3', [
      'x = −b ÷ 2a = 6 ÷ 2.',
      'Answer: 3',
    ]),
    p('y = −x² + 4 opens down. What is its largest y-value?', '4', [
      '−x² is never positive, largest at x = 0.',
      'y = 4.',
      'Answer: 4',
    ]),
    p('(x + 3)(x − 1) = 0. What is the smaller solution?', '-3', [
      'x + 3 = 0 → x = −3; x − 1 = 0 → x = 1.',
      'Answer: −3',
    ]),
    p('Find the y-coordinate of the vertex of y = x² − 4x + 3.', '-1', [
      'x = −b/2a = 4/2 = 2.',
      'y = 4 − 8 + 3 = −1.',
      'Answer: −1',
    ]),
    p('y = x² + 2x − 8. What is the larger root?', '2', [
      '(x + 4)(x − 2) = 0.',
      'x = −4 or 2.',
      'Answer: 2',
    ]),
    p('Find the x-coordinate of the vertex of y = 2x² − 8x + 1.', '2', [
      'x = −b/2a = 8/4.',
      'Answer: 2',
    ]),
    p('Find the y-coordinate of the vertex of y = 2x² − 8x + 1.', '-7', [
      'The vertex is at x = 2.',
      'y = 2(4) − 16 + 1 = −7.',
      'Answer: −7',
    ]),
    p('x² − 5x + 6 = 0. Add the two solutions.', '5', [
      '(x − 2)(x − 3) = 0.',
      '2 + 3 = 5.',
      'Answer: 5',
    ]),
    p('Find the discriminant b² − 4ac of x² + 4x + 7.', '-12', [
      '16 − 4(1)(7) = 16 − 28.',
      'Negative, so no real roots.',
      'Answer: −12',
    ]),
    p('What is the y-intercept of y = 3x² − 2x + 5?', '5', ['At x = 0, y = c.', 'Answer: 5']),
    p('A parabola has roots 2 and 6. What is its axis of symmetry? Give x.', '4', [
      'The vertex sits halfway between the roots.',
      '(2 + 6)/2 = 4.',
      'Answer: 4',
    ]),
    p(
      'Use the quadratic formula: what is the positive root of x² + 2x − 2 = 0?',
      '-1 + sqrt(3)',
      [
        'x = (−2 ± √(4 + 8))/2 = (−2 ± √12)/2.',
        '√12 = 2√3, so x = −1 ± √3.',
        'Positive: −1 + √3 ≈ 0.73.',
        'Answer: −1 + √3',
      ],
      'radical',
    ),
    p('2x² + 3x − 2 = 0. What is the positive solution?', '1/2', [
      'ac = −4; product −4, sum 3: 4 and −1.',
      '2x² + 4x − x − 2 = (2x − 1)(x + 2).',
      'x = 1/2 or −2.',
      'Answer: 1/2',
    ]),
    p('A ball’s height is h = −16t² + 64t feet. What is its greatest height?', '64', [
      'Vertex: t = −64/(2 × −16) = 2.',
      'h(2) = −64 + 128 = 64.',
      'Answer: 64 ft',
    ]),
    p('The ball in the last problem (h = −16t² + 64t): after how many seconds does it land?', '4', [
      'h = 0: −16t(t − 4) = 0.',
      't = 0 (launch) or t = 4.',
      'Answer: 4',
    ]),
    p('x² + kx + 9 = 0 has exactly one solution and k > 0. Find k.', '6', [
      'One solution means the discriminant is 0: k² − 36 = 0.',
      'k = 6 (it is (x + 3)²).',
      'Answer: 6',
    ]),
    p('What is the largest value of y = −2x² + 12x − 10?', '8', [
      'Vertex: x = −12/(2 × −2) = 3.',
      'y = −18 + 36 − 10 = 8.',
      'Answer: 8',
    ]),
    p('A rectangle has area 60 and its length is 4 more than its width. Find the width.', '6', [
      'w(w + 4) = 60 → w² + 4w − 60 = 0.',
      '(w + 10)(w − 6) = 0.',
      'Widths are positive: 6.',
      'Answer: 6',
    ]),
    p('The roots of x² − 6x + k = 0 differ by 2. Find k.', '8', [
      'The roots add to 6 and differ by 2: 4 and 2.',
      'k is their product: 8.',
      'Answer: 8',
    ]),
    p('What is the sum of the roots of 3x² − 12x + 7 = 0?', '4', [
      'The vertex is at x = −b/2a = 12/6 = 2, halfway between the roots.',
      'So the roots add to 2 × 2 = 4 (that is −b/a).',
      'Answer: 4',
    ]),
  ],
};
