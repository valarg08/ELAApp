import type { GuideProblem } from './guide-problem';

/** 25 problems per Functions chapter, simple to complex: 1–8 warm-up, 9–17 core, 18–25 challenge. Generated from small templates, so every answer is computed. */
export const FUNCTIONS_PROBLEMS: Record<string, GuideProblem[]> = {
  whatis: [
    {
      q: 'f(x) = −7x + 15: what is f(5)?',
      a: '-20',
      steps: ['Replace x with 5: −7 × 5 + 15.', 'That is −20.', 'Answer: −20'],
    },
    {
      q: 'Is y a function of x for the relation y = x² + 4? Type 1 for yes, 0 for no.',
      a: '1',
      steps: ['Each x gives one number x² + 4, so one y.', 'Answer: 1'],
    },
    {
      q: 'Is y a function of x for the relation x² + y² = 25? Type 1 for yes, 0 for no.',
      a: '0',
      steps: [
        'x = 3 gives both y = 4 and y = −4. One input with two outputs is not a function.',
        'Answer: 0',
      ],
    },
    {
      q: 'Is the set of pairs {(1, 5), (2, −1), (3, 0), (5, 2), (5, 3)} a function from x to y? Type 1 for yes, 0 for no.',
      a: '0',
      steps: [
        'A function gives each input x exactly one output y.',
        'One x-value is paired with two different y-values.',
        'Answer: 0',
      ],
    },
    {
      q: 'f(x) = −3x + 10: what is f(−5)?',
      a: '25',
      steps: ['Replace x with (−5): −3 × (−5) + 10.', 'That is 25.', 'Answer: 25'],
    },
    {
      q: 'Is y a function of x for the relation y = |x − 3|? Type 1 for yes, 0 for no.',
      a: '1',
      steps: ['Each x gives one absolute value.', 'Answer: 1'],
    },
    {
      q: 'Is y a function of x for the relation x = |y|? Type 1 for yes, 0 for no.',
      a: '0',
      steps: [
        'x = 2 gives both y = 2 and y = −2. One input with two outputs is not a function.',
        'Answer: 0',
      ],
    },
    {
      q: 'Is the set of pairs {(1, −1), (2, 6), (3, −1), (5, 7)} a function from x to y? Type 1 for yes, 0 for no.',
      a: '1',
      steps: [
        'A function gives each input x exactly one output y.',
        'No x-value is paired with two different y-values.',
        'Answer: 1',
      ],
    },
    {
      q: 'f(x) = 4x² + 3x + 8: what is f(−2)?',
      a: '18',
      steps: ['Replace x with (−2): 4 × (−2)² + 3 × (−2) + 8.', 'That is 18.', 'Answer: 18'],
    },
    {
      q: 'How many points does the vertical line x = 3 share with the graph of x² + y² = 25?',
      a: '2',
      steps: [
        'Put x = 3 in: y² = 16.',
        'Two values of y, so two points: the circle fails the vertical line test.',
        'Answer: 2',
      ],
    },
    {
      q: 'f(x) = 2x − 12: for what x is f(x) = −22?',
      a: '-5',
      steps: ['Set 2x − 12 = −22.', '2x = −10, so x = −5.', 'Answer: −5'],
    },
    {
      q: 'f is a linear function with f(0) = −15 and f(1) = −23. What is f(8)?',
      a: '-79',
      steps: [
        'The slope is (−23 − (−15)) / (1 − 0) = −8.',
        'Then f(x) = −8x − 15, so f(8) = −79.',
        'Answer: −79',
      ],
    },
    {
      q: 'f(x) = 4x² + x − 7: what is f(4)?',
      a: '61',
      steps: ['Replace x with 4: 4 × 4² + 4 − 7.', 'That is 61.', 'Answer: 61'],
    },
    {
      q: 'How many points does the vertical line x = 0 share with the graph of x² + y² = 25?',
      a: '2',
      steps: [
        'Put x = 0 in: y² = 25.',
        'Two values of y, so two points: the circle fails the vertical line test.',
        'Answer: 2',
      ],
    },
    {
      q: 'f(x) = −7x + 15: for what x is f(x) = 36?',
      a: '-3',
      steps: ['Set −7x + 15 = 36.', '−7x = 21, so x = −3.', 'Answer: −3'],
    },
    {
      q: 'f is a linear function with f(3) = −13 and f(5) = −31. What is f(7)?',
      a: '-49',
      steps: [
        'The slope is (−31 − (−13)) / (5 − 3) = −9.',
        'Then f(x) = −9x + 14, so f(7) = −49.',
        'Answer: −49',
      ],
    },
    {
      q: 'f(x) = x² + 5x − 1: what is f(2)?',
      a: '13',
      steps: ['Replace x with 2: 2² + 5 × 2 − 1.', 'That is 13.', 'Answer: 13'],
    },
    {
      q: 'f(x) = x² − 6x + 8. Then f(x − 3) = x² + px + q. What is q?',
      a: '35',
      steps: [
        'q is the constant term, which is f(0 + −3) = f(−3).',
        'f(−3) = (−3)² − 6 × (−3) + 8 = 35.',
        'Answer: 35',
      ],
    },
    {
      q: 'f(x) = 3x² − 2x: what is (f(6) − f(−3)) / (6 − (−3))? Write a fraction if needed.',
      a: '7',
      steps: ['f(6) = 96 and f(−3) = 33.', '(96 − 33) / 9 = 7.', 'Answer: 7'],
    },
    {
      q: 'f(x) = −3x² − 5x + 4: what is f(5) + f(−5)?',
      a: '-142',
      steps: [
        'f(5) = −3 × 5² − 5 × 5 + 4 = −96.',
        'f(−5) = −3 × (−5)² − 5 × (−5) + 4 = −46.',
        'Answer: −142',
      ],
    },
    {
      q: 'f(x) = x² − 8x + 9. If f(9) = f(t) and t ≠ 9, what is t?',
      a: '-1',
      steps: [
        'The parabola is symmetric about x = 4, the midpoint of 9 and t.',
        't = 2 × 4 − 9 = −1.',
        'Answer: −1',
      ],
    },
    {
      q: 'f(x) = x² − 3x − 6. Then f(x + 4) = x² + px + q. What is q?',
      a: '-2',
      steps: [
        'q is the constant term, which is f(0 + 4) = f(4).',
        'f(4) = 4² − 3 × 4 − 6 = −2.',
        'Answer: −2',
      ],
    },
    {
      q: 'f(x) = −2x² − 2x + 1: what is (f(5) − f(0)) / (5 − 0)? Write a fraction if needed.',
      a: '-12',
      steps: ['f(5) = −59 and f(0) = 1.', '(−59 − 1) / 5 = −12.', 'Answer: −12'],
    },
    {
      q: 'f(x) = x² − 2x − 2: what is f(1) + f(−1)?',
      a: '-2',
      steps: ['f(1) = 1² − 2 × 1 − 2 = −3.', 'f(−1) = (−1)² − 2 × (−1) − 2 = 1.', 'Answer: −2'],
    },
    {
      q: 'f(x) = x² − 2x + 2. If f(2) = f(t) and t ≠ 2, what is t?',
      a: '0',
      steps: [
        'The parabola is symmetric about x = 1, the midpoint of 2 and t.',
        't = 2 × 1 − 2 = 0.',
        'Answer: 0',
      ],
    },
  ],
  domain: [
    {
      q: 'f(x) = x² + 3: what is the smallest output value of f?',
      a: '3',
      steps: [
        'x² is never below 0, and it is 0 at x = 0.',
        'So the smallest output is 0 + 3 = 3.',
        'Answer: 3',
      ],
    },
    {
      q: 'f(x) = −x² + 8: what is the largest output value of f?',
      a: '8',
      steps: [
        '−x² is never above 0, and it is 0 at x = 0.',
        'So the largest output is 8.',
        'Answer: 8',
      ],
    },
    {
      q: 'f(x) = 1/(x + 1): which x-value is not in the domain?',
      a: '-1',
      steps: [
        'A fraction has no value when its denominator is 0.',
        'x + 1 = 0 when x = −1.',
        'Answer: −1',
      ],
    },
    {
      q: 'f(x) = √(x − 5): what is the smallest x in the domain?',
      a: '5',
      steps: [
        'The number under a square root cannot be negative.',
        'x − 5 ≥ 0 gives x ≥ 5.',
        'Answer: 5',
      ],
    },
    {
      q: 'f(x) = x² + 2: what is the smallest output value of f?',
      a: '2',
      steps: [
        'x² is never below 0, and it is 0 at x = 0.',
        'So the smallest output is 0 + 2 = 2.',
        'Answer: 2',
      ],
    },
    {
      q: 'f(x) = −x² + 4: what is the largest output value of f?',
      a: '4',
      steps: [
        '−x² is never above 0, and it is 0 at x = 0.',
        'So the largest output is 4.',
        'Answer: 4',
      ],
    },
    {
      q: 'f(x) = 1/(x − 3): which x-value is not in the domain?',
      a: '3',
      steps: [
        'A fraction has no value when its denominator is 0.',
        'x − 3 = 0 when x = 3.',
        'Answer: 3',
      ],
    },
    {
      q: 'f(x) = √(x − 7): what is the smallest x in the domain?',
      a: '7',
      steps: [
        'The number under a square root cannot be negative.',
        'x − 7 ≥ 0 gives x ≥ 7.',
        'Answer: 7',
      ],
    },
    {
      q: 'f(x) = √(6x + 10): what is the smallest x in the domain? Write a fraction if needed.',
      a: '-5/3',
      form: 'fraction',
      steps: ['Need 6x + 10 ≥ 0.', '6x ≥ −10, so x ≥ −5/3.', 'Answer: −5/3'],
    },
    {
      q: 'f(x) = 1/((x + 6)(x + 2)): what is the sum of the x-values not in the domain?',
      a: '-8',
      steps: ['The denominator is 0 at x = −6 and x = −2.', '−6 + (−2) = −8.', 'Answer: −8'],
    },
    {
      q: 'f(x) = x + 6 with the domain −6 ≤ x ≤ 2. What is the largest output value?',
      a: '8',
      steps: [
        'A line is monotone, so the extremes are at the ends: f(−6) = 0 and f(2) = 8.',
        'The larger is 8.',
        'Answer: 8',
      ],
    },
    {
      q: 'How many integers x from −5 to 10 are in the domain of f(x) = √(x − 4)?',
      a: '7',
      steps: ['The domain is x ≥ 4.', 'The integers from 4 to 10 number 7.', 'Answer: 7'],
    },
    {
      q: 'f(x) = √(5x + 1): what is the smallest x in the domain? Write a fraction if needed.',
      a: '-1/5',
      form: 'fraction',
      steps: ['Need 5x + 1 ≥ 0.', '5x ≥ −1, so x ≥ −1/5.', 'Answer: −1/5'],
    },
    {
      q: 'f(x) = 1/((x − 5)(x − 3)): what is the sum of the x-values not in the domain?',
      a: '8',
      steps: ['The denominator is 0 at x = 5 and x = 3.', '5 + 3 = 8.', 'Answer: 8'],
    },
    {
      q: 'f(x) = 4x − 1 with the domain −1 ≤ x ≤ 7. What is the largest output value?',
      a: '27',
      steps: [
        'A line is monotone, so the extremes are at the ends: f(−1) = −5 and f(7) = 27.',
        'The larger is 27.',
        'Answer: 27',
      ],
    },
    {
      q: 'How many integers x from −5 to 10 are in the domain of f(x) = √(x + 1)?',
      a: '12',
      steps: ['The domain is x ≥ −1.', 'The integers from −1 to 10 number 12.', 'Answer: 12'],
    },
    {
      q: 'f(x) = √(3x − 9): what is the smallest x in the domain? Write a fraction if needed.',
      a: '3',
      steps: ['Need 3x − 9 ≥ 0.', '3x ≥ 9, so x ≥ 3.', 'Answer: 3'],
    },
    {
      q: 'f(x) = 2x²: what is the smallest output value of f?',
      a: '0',
      steps: [
        'Complete the square: 2x² = 2(x)² + 0.',
        'The square is at least 0, so the smallest value is 0.',
        'Answer: 0',
      ],
    },
    {
      q: 'How many integers from −10 to 10 are in the domain of f(x) = √(x² − 4)?',
      a: '18',
      steps: [
        'Need x² ≥ 4, so x ≤ −2 or x ≥ 2.',
        'That is 9 integers on the right and 9 on the left, 18 in all.',
        'Answer: 18',
      ],
    },
    {
      q: 'f(x) = 1/√(x + 3): what is the smallest integer in the domain?',
      a: '-2',
      steps: [
        'Need x + 3 > 0 (it is in a denominator), so x > −3.',
        'The smallest integer is −2.',
        'Answer: −2',
      ],
    },
    {
      q: 'How many integers from −10 to 10 are in the domain of f(x) = √(x − 2) / x?',
      a: '9',
      steps: [
        'The root needs x − 2 ≥ 0, so x ≥ 2.',
        'The fraction needs x ≠ 0. Counting the integers that pass both gives 9.',
        'Answer: 9',
      ],
    },
    {
      q: 'f(x) = x² − 3 with the domain −3 ≤ x ≤ 1. What is the largest output value?',
      a: '6',
      steps: ['x² is largest at the end farther from 0: x = −3.', 'That gives 6.', 'Answer: 6'],
    },
    {
      q: 'f(x) = 3x² − 6x − 5: what is the smallest output value of f?',
      a: '-8',
      steps: [
        'Complete the square: 3x² − 6x − 5 = 3(x − 1)² − 8.',
        'The square is at least 0, so the smallest value is −8.',
        'Answer: −8',
      ],
    },
    {
      q: 'How many integers from −10 to 10 are in the domain of f(x) = √(x² − 36)?',
      a: '10',
      steps: [
        'Need x² ≥ 36, so x ≤ −6 or x ≥ 6.',
        'That is 5 integers on the right and 5 on the left, 10 in all.',
        'Answer: 10',
      ],
    },
    {
      q: 'f(x) = 1/√(x − 1): what is the smallest integer in the domain?',
      a: '2',
      steps: [
        'Need x − 1 > 0 (it is in a denominator), so x > 1.',
        'The smallest integer is 2.',
        'Answer: 2',
      ],
    },
  ],
  common: [
    {
      q: 'h(x) = x³: what is h(−5)?',
      a: '-125',
      steps: ['(−5) × (−5) × (−5) = −125.', 'Answer: −125'],
    },
    {
      q: 'What is log₃ 3?',
      a: '1',
      steps: ['log₃ 3 asks: 3 to what power is 3?', '3^1 = 3.', 'Answer: 1'],
    },
    {
      q: 'What is sin 0°?',
      a: '0',
      steps: ['Read it off the sine or cosine wave (the unit circle).', 'Answer: 0'],
    },
    {
      q: 'h(x) = x³: what is h(3)?',
      a: '27',
      steps: ['3 × 3 × 3 = 27.', 'Answer: 27'],
    },
    {
      q: 'f(x) = 4^x: what is f(5)?',
      a: '1024',
      steps: ['4^5 = 1024.', 'Answer: 1024'],
    },
    {
      q: 'What is log₂ 2?',
      a: '1',
      steps: ['log₂ 2 asks: 2 to what power is 2?', '2^1 = 2.', 'Answer: 1'],
    },
    {
      q: 'What is cos 0°?',
      a: '1',
      steps: ['Read it off the sine or cosine wave (the unit circle).', 'Answer: 1'],
    },
    {
      q: 'h(x) = x³: what is h(−4)?',
      a: '-64',
      steps: ['(−4) × (−4) × (−4) = −64.', 'Answer: −64'],
    },
    {
      q: 'f(x) = 4^x: what is f(−2)? Write a fraction.',
      a: '1/16',
      form: 'fraction',
      steps: [
        'A negative exponent means a reciprocal: 4^−2 = 1/4^2.',
        'That is 1/16.',
        'Answer: 1/16',
      ],
    },
    {
      q: 'f(x) = 3^x + 1: what is its y-intercept?',
      a: '2',
      steps: ['At x = 0, 3^0 = 1.', '1 + 1 = 2.', 'Answer: 2'],
    },
    {
      q: 'The graph of f(x) = 2^x − 6 has a horizontal asymptote y = c. What is c?',
      a: '-6',
      steps: [
        '2^x gets closer and closer to 0 but never reaches it.',
        'So the graph approaches y = −6.',
        'Answer: −6',
      ],
    },
    {
      q: 'The graph of f(x) = log₂ (x + 1) has a vertical asymptote x = a. What is a?',
      a: '-1',
      steps: [
        'A logarithm needs a positive input, so x + 1 > 0.',
        'The graph approaches the line x = −1.',
        'Answer: −1',
      ],
    },
    {
      q: 'g(x) = 1/x: what is g(3) + g(5)? Write a fraction.',
      a: '8/15',
      form: 'fraction',
      steps: ['g(3) = 1/3 and g(5) = 1/5.', '1/3 + 1/5 = 8/15.', 'Answer: 8/15'],
    },
    {
      q: 'f(x) = 3^x: what is f(−2)? Write a fraction.',
      a: '1/9',
      form: 'fraction',
      steps: [
        'A negative exponent means a reciprocal: 3^−2 = 1/3^2.',
        'That is 1/9.',
        'Answer: 1/9',
      ],
    },
    {
      q: 'f(x) = 2^x + 5: what is its y-intercept?',
      a: '6',
      steps: ['At x = 0, 2^0 = 1.', '1 + 5 = 6.', 'Answer: 6'],
    },
    {
      q: 'The graph of f(x) = 2^x + 4 has a horizontal asymptote y = c. What is c?',
      a: '4',
      steps: [
        '2^x gets closer and closer to 0 but never reaches it.',
        'So the graph approaches y = 4.',
        'Answer: 4',
      ],
    },
    {
      q: 'The graph of f(x) = log₂ (x + 6) has a vertical asymptote x = a. What is a?',
      a: '-6',
      steps: [
        'A logarithm needs a positive input, so x + 6 > 0.',
        'The graph approaches the line x = −6.',
        'Answer: −6',
      ],
    },
    {
      q: 'What x makes 2^x = 1/8?',
      a: '-3',
      steps: ['1/8 = 2^−3.', 'So x = −3.', 'Answer: −3'],
    },
    {
      q: 'What is log₃ 3 + log₃ 27?',
      a: '4',
      steps: ['log₃ 3 = 1 and log₃ 27 = 3.', '1 + 3 = 4.', 'Answer: 4'],
    },
    {
      q: 'The point (2, 4) is on the graph of y = 2^x. The matching point on y = log₂ x is (m, n). What is m + n?',
      a: '6',
      steps: [
        'The two functions are inverses, so the coordinates swap.',
        'The point is (4, 2), and 4 + 2 = 6.',
        'Answer: 6',
      ],
    },
    {
      q: 'How many real numbers x satisfy 2^x = −4?',
      a: '0',
      steps: ['2^x is always positive.', 'Answer: 0'],
    },
    {
      q: 'f(x) = 5 · 3^x. What is f(4) − f(3)?',
      a: '270',
      steps: ['f(4) = 5 × 81 = 405.', 'f(3) = 5 × 27 = 135.', 'Answer: 270'],
    },
    {
      q: 'What x makes 4^x = 1/64?',
      a: '-3',
      steps: ['1/64 = 4^−3.', 'So x = −3.', 'Answer: −3'],
    },
    {
      q: 'What is log₃ 9 + log₃ 27?',
      a: '5',
      steps: ['log₃ 9 = 2 and log₃ 27 = 3.', '2 + 3 = 5.', 'Answer: 5'],
    },
    {
      q: 'The point (1, 2) is on the graph of y = 2^x. The matching point on y = log₂ x is (m, n). What is m + n?',
      a: '3',
      steps: [
        'The two functions are inverses, so the coordinates swap.',
        'The point is (2, 1), and 2 + 1 = 3.',
        'Answer: 3',
      ],
    },
  ],
  transform: [
    {
      q: 'The point (1, 6) is on the graph of y = f(x). g(x) = f(x − 4) + 4. What is the x-coordinate of the matching point on g?',
      a: '5',
      steps: ['x − 4 replaces x, so every point moves 4 units right.', '1 + 4 = 5.', 'Answer: 5'],
    },
    {
      q: 'The point (−4, −3) is on the graph of y = f(x). g(x) = f(x − 7) − 5. What is the y-coordinate of the matching point on g?',
      a: '-8',
      steps: ['Adding −5 outside moves every point 5 units down.', '−3 + (−5) = −8.', 'Answer: −8'],
    },
    {
      q: 'g(x) = f(x + 1): does the graph of f shift right or left? Type 1 for right, 0 for left.',
      a: '0',
      steps: [
        'f(x + 1) is f(x − (−1)), so the shift is −1.',
        'A negative shift means left.',
        'Answer: 0',
      ],
    },
    {
      q: 'g(x) = 3f(x): by what factor is the graph of f stretched vertically?',
      a: '3',
      steps: ['Every output is multiplied by 3.', 'Answer: 3'],
    },
    {
      q: 'The point (4, −1) is on the graph of y = f(x). g(x) = f(x − 7) + 5. What is the x-coordinate of the matching point on g?',
      a: '11',
      steps: ['x − 7 replaces x, so every point moves 7 units right.', '4 + 7 = 11.', 'Answer: 11'],
    },
    {
      q: 'The point (−3, −4) is on the graph of y = f(x). g(x) = f(x + 5) + 4. What is the y-coordinate of the matching point on g?',
      a: '0',
      steps: ['Adding 4 outside moves every point 4 units up.', '−4 + 4 = 0.', 'Answer: 0'],
    },
    {
      q: 'g(x) = f(x − 6): does the graph of f shift right or left? Type 1 for right, 0 for left.',
      a: '1',
      steps: [
        'f(x − 6) is f(x − (6)), so the shift is 6.',
        'A positive shift means right.',
        'Answer: 1',
      ],
    },
    {
      q: 'g(x) = 4f(x): by what factor is the graph of f stretched vertically?',
      a: '4',
      steps: ['Every output is multiplied by 4.', 'Answer: 4'],
    },
    {
      q: 'The point (−6, 5) is on the graph of y = f(x). g(x) = f(−x). What is the x-coordinate of the matching point on g? Write a fraction if needed.',
      a: '6',
      steps: ['g(x) = 5 when −x = −6.', 'x = 6.', 'Answer: 6'],
    },
    {
      q: 'The point (−4, 4) is on the graph of y = f(x). g(x) = 3f(x + 8) − 7. What is the sum of the coordinates of the matching point on g?',
      a: '-7',
      steps: [
        'x moves to −4 + (−8) = −12.',
        'y becomes 3 × 4 + (−7) = 5.',
        '−12 + 5 = −7.',
        'Answer: −7',
      ],
    },
    {
      q: 'f(−2) = 9. g(x) = 2f(x + 3) + 1. What is g(−5)?',
      a: '19',
      steps: [
        'g(−5) = 2f(−5 + 3) + 1',
        '−5 + 3 = −2, so f(−2) = 9.',
        '2 × 9 + 1 = 19.',
        'Answer: 19',
      ],
    },
    {
      q: 'The graph of y = 2(x + 5)² + 6 is the parabola y = 2x² moved. What is the x-coordinate of its vertex?',
      a: '-5',
      steps: [
        'The vertex form 2(x − h)² + k has its vertex at (h, k).',
        'Here h = −5 and k = 6.',
        'Answer: −5',
      ],
      fig: {
        kind: 'grid',
        x: [-9, -1],
        y: [-1, 18],
        quad: [
          {
            a: 2,
            b: 20,
            c: 56,
          },
        ],
        free: true,
      },
    },
    {
      q: 'The point (−3, 5) is on the graph of y = f(x). g(x) = f(4x). What is the x-coordinate of the matching point on g? Write a fraction if needed.',
      a: '-3/4',
      form: 'fraction',
      steps: ['g(x) = 5 when 4x = −3.', 'x = −3/4.', 'Answer: −3/4'],
    },
    {
      q: 'The point (5, 6) is on the graph of y = f(x). g(x) = −3f(x + 5) − 3. What is the sum of the coordinates of the matching point on g?',
      a: '-21',
      steps: [
        'x moves to 5 + (−5) = 0.',
        'y becomes (−3) × 6 + (−3) = −21.',
        '0 + (−21) = −21.',
        'Answer: −21',
      ],
    },
    {
      q: 'f(−3) = −1. g(x) = 2f(x − 4) − 3. What is g(1)?',
      a: '-5',
      steps: [
        'g(1) = 2f(1 − 4) − 3',
        '1 − 4 = −3, so f(−3) = −1.',
        '2 × (−1) + (−3) = −5.',
        'Answer: −5',
      ],
    },
    {
      q: 'The graph of y = 2(x − 8)² + 6 is the parabola y = 2x² moved. What is the x-coordinate of its vertex?',
      a: '8',
      steps: [
        'The vertex form 2(x − h)² + k has its vertex at (h, k).',
        'Here h = 8 and k = 6.',
        'Answer: 8',
      ],
      fig: {
        kind: 'grid',
        x: [4, 12],
        y: [-1, 18],
        quad: [
          {
            a: 2,
            b: -32,
            c: 134,
          },
        ],
        free: true,
      },
    },
    {
      q: 'The point (−6, 5) is on the graph of y = f(x). g(x) = f(4x). What is the x-coordinate of the matching point on g? Write a fraction if needed.',
      a: '-3/2',
      form: 'fraction',
      steps: ['g(x) = 5 when 4x = −6.', 'x = −3/2.', 'Answer: −3/2'],
    },
    {
      q: 'f(x) = x². g(x) = −f(x − 3) − 6. What is g(1)?',
      a: '-10',
      steps: ['g(1) = −f(−2) − 6.', 'f(−2) = 4.', '(−1) × 4 + (−6) = −10.', 'Answer: −10'],
    },
    {
      q: 'h(x) = x³. g(x) = 2h(x − 3) − 4, with h as the parent. What is g(1)?',
      a: '-20',
      steps: ['g(1) = 2h(−2) − 4.', '−2³ = −8.', '2 × (−8) + (−4) = −20.', 'Answer: −20'],
    },
    {
      q: '(−2, 3) is on y = f(x). g(x) = 2f(2x) − 2. The matching point on g is (m, n). What is n?',
      a: '4',
      steps: [
        'The inside 2x only changes the x-coordinate, to m = −1.',
        'The outside changes y: 2 × 3 + (−2) = 4.',
        'Answer: 4',
      ],
    },
    {
      q: 'f(x) = x². g(x) = 2f(x − 1). What is g(−1)?',
      a: '8',
      steps: ['g(−1) = 2f(−2) + 0.', 'f(−2) = 4.', '2 × 4 + 0 = 8.', 'Answer: 8'],
    },
    {
      q: 'h(x) = x³. g(x) = 2h(x − 3) + 4, with h as the parent. What is g(−3)?',
      a: '-428',
      steps: ['g(−3) = 2h(−6) + 4.', '−6³ = −216.', '2 × (−216) + 4 = −428.', 'Answer: −428'],
    },
    {
      q: '(4, 3) is on y = f(x). g(x) = 3f(3x) − 2. The matching point on g is (m, n). What is n?',
      a: '7',
      steps: [
        'The inside 3x only changes the x-coordinate, to m = 4/3.',
        'The outside changes y: 3 × 3 + (−2) = 7.',
        'Answer: 7',
      ],
    },
    {
      q: 'f(x) = |x|. g(x) = 2f(x) − 5. What is g(−3)?',
      a: '1',
      steps: ['g(−3) = 2f(−3) − 5.', 'f(−3) = 3.', '2 × 3 + (−5) = 1.', 'Answer: 1'],
    },
    {
      q: 'h(x) = x³. g(x) = 3h(x + 2) + 1, with h as the parent. What is g(0)?',
      a: '25',
      steps: ['g(0) = 3h(2) + 1.', '2³ = 8.', '3 × 8 + 1 = 25.', 'Answer: 25'],
    },
  ],
  inverse: [
    {
      q: 'f(−2) = 6. What is the inverse of f, f⁻¹, at 6?',
      a: '-2',
      steps: ['An inverse undoes f: if f(−2) = 6, then f⁻¹(6) = −2.', 'Answer: −2'],
    },
    {
      q: 'f(x) = x − 3: what is f⁻¹(6)?',
      a: '9',
      steps: ['f adds −3, so f⁻¹ subtracts −3.', '6 + 3 = 9.', 'Answer: 9'],
    },
    {
      q: 'The point (−5, 6) is on the graph of f. The point (m, n) is on the graph of f⁻¹ with m = 6. What is n?',
      a: '-5',
      steps: [
        'An inverse swaps the coordinates: (x, y) becomes (y, x).',
        'So (6, −5) is on f⁻¹.',
        'Answer: −5',
      ],
    },
    {
      q: 'f(−6) = 8. What is the inverse of f, f⁻¹, at 8?',
      a: '-6',
      steps: ['An inverse undoes f: if f(−6) = 8, then f⁻¹(8) = −6.', 'Answer: −6'],
    },
    {
      q: 'f(x) = x + 8: what is f⁻¹(−2)?',
      a: '-10',
      steps: ['f adds 8, so f⁻¹ subtracts 8.', '−2 − 8 = −10.', 'Answer: −10'],
    },
    {
      q: 'The point (3, 2) is on the graph of f. The point (m, n) is on the graph of f⁻¹ with m = 2. What is n?',
      a: '3',
      steps: [
        'An inverse swaps the coordinates: (x, y) becomes (y, x).',
        'So (2, 3) is on f⁻¹.',
        'Answer: 3',
      ],
    },
    {
      q: 'f(4) = −9. What is the inverse of f, f⁻¹, at −9?',
      a: '4',
      steps: ['An inverse undoes f: if f(4) = −9, then f⁻¹(−9) = 4.', 'Answer: 4'],
    },
    {
      q: 'f(x) = x − 7: what is f⁻¹(−3)?',
      a: '4',
      steps: ['f adds −7, so f⁻¹ subtracts −7.', '−3 + 7 = 4.', 'Answer: 4'],
    },
    {
      q: 'f(x) = 8x + 2: what is f⁻¹(−22)?',
      a: '-3',
      steps: ['Solve 8x + 2 = −22.', '8x = −24, so x = −3.', 'Answer: −3'],
    },
    {
      q: 'f(x) = 4x + 2. Its inverse is f⁻¹(x) = mx + n. What is m? Write a fraction.',
      a: '1/4',
      form: 'fraction',
      steps: [
        'Swap x and y: x = 4y + 2, then solve for y.',
        'y = (x − 2)/4, so m = 1/4.',
        'Answer: 1/4',
      ],
    },
    {
      q: 'f(x) = −2x − 7. Its inverse is f⁻¹(x) = mx + n. What is n? Write a fraction if needed.',
      a: '-7/2',
      form: 'fraction',
      steps: ['Swap x and y and solve: y = (x + 7)/-2.', 'n = 7/-2 = −7/2.', 'Answer: −7/2'],
    },
    {
      q: 'g(x) = x³: what is g⁻¹(−64)?',
      a: '-4',
      steps: ['Solve x³ + 0 = −64.', 'x³ = −64, so x = −4.', 'Answer: −4'],
    },
    {
      q: 'h(x) = 2^x: what is h⁻¹(16)?',
      a: '4',
      steps: ['h⁻¹(x) = log₂ x.', 'log₂ 16 = 4.', 'Answer: 4'],
    },
    {
      q: 'Does f(x) = x² for all real x have an inverse function? Type 1 for yes, 0 for no.',
      a: '0',
      steps: [
        'An inverse function needs f to be one-to-one (pass the horizontal line test).',
        'f(2) = f(−2) = 4, so f is not one-to-one.',
        'Answer: 0',
      ],
    },
    {
      q: 'f(x) = −5x − 5: what is f⁻¹(−25)?',
      a: '4',
      steps: ['Solve −5x − 5 = −25.', '−5x = −20, so x = 4.', 'Answer: 4'],
    },
    {
      q: 'f(x) = −2x + 5. Its inverse is f⁻¹(x) = mx + n. What is m? Write a fraction.',
      a: '-1/2',
      form: 'fraction',
      steps: [
        'Swap x and y: x = -2y + 5, then solve for y.',
        'y = (x − 5)/-2, so m = −1/2.',
        'Answer: −1/2',
      ],
    },
    {
      q: 'f(x) = 4x − 8. Its inverse is f⁻¹(x) = mx + n. What is n? Write a fraction if needed.',
      a: '2',
      steps: ['Swap x and y and solve: y = (x + 8)/4.', 'n = 8/4 = 2.', 'Answer: 2'],
    },
    {
      q: 'f(x) = 2x − 6 and g(x) = x − 4. What x gives f(g(x)) = −14?',
      a: '0',
      steps: ['f(g(x)) = 2(x − 4) − 6.', 'Set it equal to −14 and solve: x = 0.', 'Answer: 0'],
    },
    {
      q: 'f(x) = 4x + 1. The graphs of f and f⁻¹ meet on the line y = x. At what x does f(x) = x? Write a fraction if needed.',
      a: '-1/3',
      form: 'fraction',
      steps: ['Solve 4x + 1 = x.', '3x = −1, so x = −1/3.', 'Answer: −1/3'],
    },
    {
      q: 'f(x) = √x + 4: what is f⁻¹(9)?',
      a: '25',
      steps: ['Undo the steps: subtract 4, then square.', '(9 − 4)² = 5² = 25.', 'Answer: 25'],
    },
    {
      q: 'f(x) = 5x + 2: what is f⁻¹(f⁻¹(12))?',
      a: '0',
      steps: [
        'Apply the inverse twice. First: f⁻¹(12) = 2, since 5x + 2 = 12 at x = 2.',
        'Then f⁻¹(2) = 0.',
        'Answer: 0',
      ],
    },
    {
      q: 'f(x) = (x − 1)² for x ≥ 1. What is f⁻¹(1)?',
      a: '2',
      steps: ['Solve (x − 1)² = 1 with x ≥ 1.', 'x − 1 = 1, so x = 2.', 'Answer: 2'],
    },
    {
      q: 'f(x) = 3x − 2 and g(x) = x − 5. What x gives f(g(x)) = 1?',
      a: '6',
      steps: ['f(g(x)) = 3(x − 5) − 2.', 'Set it equal to 1 and solve: x = 6.', 'Answer: 6'],
    },
    {
      q: 'f(x) = 4x + 4. The graphs of f and f⁻¹ meet on the line y = x. At what x does f(x) = x? Write a fraction if needed.',
      a: '-4/3',
      form: 'fraction',
      steps: ['Solve 4x + 4 = x.', '3x = −4, so x = −4/3.', 'Answer: −4/3'],
    },
    {
      q: 'f(x) = √x − 4: what is f⁻¹(−3)?',
      a: '1',
      steps: ['Undo the steps: subtract −4, then square.', '(−3 + 4)² = 1² = 1.', 'Answer: 1'],
    },
  ],
  combine: [
    {
      q: 'f(x) = −6x + 4 and g(x) = 3x − 7. What is (f + g)(5)?',
      a: '-18',
      steps: ['f(5) = −26 and g(5) = 8.', '(f + g)(5) = f(5) + g(5) = −18.', 'Answer: −18'],
    },
    {
      q: 'f(x) = −x − 5 and g(x) = x − 8. What is (f − g)(−3)?',
      a: '9',
      steps: ['f(−3) = −2 and g(−3) = −11.', '(f − g)(−3) = f(−3) − g(−3) = 9.', 'Answer: 9'],
    },
    {
      q: 'f(x) = −x − 3 and g(x) = 2x + 5. What is (f · g)(4)?',
      a: '-91',
      steps: ['f(4) = −7 and g(4) = 13.', '(f · g)(4) = f(4) × g(4) = −91.', 'Answer: −91'],
    },
    {
      q: 'f(x) = −5x − 3 and g(x) = 3x − 6. What is (f / g)(0)? Write a fraction if needed.',
      a: '1/2',
      form: 'fraction',
      steps: ['f(0) = −3 and g(0) = −6.', '(f / g)(0) = f(0) ÷ g(0) = 1/2.', 'Answer: 1/2'],
    },
    {
      q: 'f(x) = 5x + 6 and g(x) = 5x + 6. What is (f + g)(−2)?',
      a: '-8',
      steps: ['f(−2) = −4 and g(−2) = −4.', '(f + g)(−2) = f(−2) + g(−2) = −8.', 'Answer: −8'],
    },
    {
      q: 'f(x) = 5x − 1 and g(x) = 4x + 8. What is (f − g)(0)?',
      a: '-9',
      steps: ['f(0) = −1 and g(0) = 8.', '(f − g)(0) = f(0) − g(0) = −9.', 'Answer: −9'],
    },
    {
      q: 'f(x) = −x − 6 and g(x) = 6x + 2. What is (f · g)(−4)?',
      a: '44',
      steps: ['f(−4) = −2 and g(−4) = −22.', '(f · g)(−4) = f(−4) × g(−4) = 44.', 'Answer: 44'],
    },
    {
      q: 'f(x) = −x + 1 and g(x) = x − 4. What is (f / g)(−1)? Write a fraction if needed.',
      a: '-2/5',
      form: 'fraction',
      steps: ['f(−1) = 2 and g(−1) = −5.', '(f / g)(−1) = f(−1) ÷ g(−1) = −2/5.', 'Answer: −2/5'],
    },
    {
      q: 'f(x) = −x + 7 and g(x) = 3x − 8. (f + g)(x) = px + q. What is p?',
      a: '2',
      steps: ['Add like terms: (−x + 7) + (3x − 8).', 'The x-terms add to 2x.', 'Answer: 2'],
    },
    {
      q: 'f(x) = x² + 3x + 7 and g(x) = x − 6. (f + g)(x) = ax² + bx + c. What is c?',
      a: '1',
      steps: [
        'Add: (x² + 3x + 7) + (x − 6) = x² + 4x + 1.',
        'The constant term is 1.',
        'Answer: 1',
      ],
    },
    {
      q: 'f(x) = −8x + 1 and g(x) = −3x² − 3. (f · g)(x) has constant term c. What is c?',
      a: '-3',
      steps: [
        'The constant term of a product is the product of the constant terms.',
        '1 × (−3) = −3.',
        'Answer: −3',
      ],
    },
    {
      q: 'f(x) = x² + 4 and g(x) = 3x − 6. (f / g)(x) has no value at one x-value. What is it? Write a fraction if needed.',
      a: '2',
      steps: [
        'A quotient has no value when the divisor g(x) is 0.',
        '3x − 6 = 0 gives x = 2.',
        'Answer: 2',
      ],
    },
    {
      q: 'f(x) = −x + 1 and g(x) = −3x + 3. (f + g)(x) = px + q. What is p?',
      a: '-4',
      steps: ['Add like terms: (−x + 1) + (−3x + 3).', 'The x-terms add to −4x.', 'Answer: −4'],
    },
    {
      q: 'f(x) = 4x² + 2x − 1 and g(x) = −7x − 8. (f + g)(x) = ax² + bx + c. What is c?',
      a: '-9',
      steps: [
        'Add: (4x² + 2x − 1) + (−7x − 8) = 4x² − 5x − 9.',
        'The constant term is −9.',
        'Answer: −9',
      ],
    },
    {
      q: 'f(x) = 8x − 4 and g(x) = −x² + 4x + 3. (f · g)(x) has constant term c. What is c?',
      a: '-12',
      steps: [
        'The constant term of a product is the product of the constant terms.',
        '(−4) × 3 = −12.',
        'Answer: −12',
      ],
    },
    {
      q: 'f(x) = x² + 4 and g(x) = −3x − 2. (f / g)(x) has no value at one x-value. What is it? Write a fraction if needed.',
      a: '-2/3',
      form: 'fraction',
      steps: [
        'A quotient has no value when the divisor g(x) is 0.',
        '−3x − 2 = 0 gives x = −2/3.',
        'Answer: −2/3',
      ],
    },
    {
      q: 'f(x) = x − 6 and g(x) = −3x − 8. (f + g)(x) = px + q. What is p?',
      a: '-2',
      steps: ['Add like terms: (x − 6) + (−3x − 8).', 'The x-terms add to −2x.', 'Answer: −2'],
    },
    {
      q: 'f(x) = x² + 10x + 16 and g(x) = −2x − 4. What is the x-coordinate of the vertex of (f + g)(x)?',
      a: '-4',
      steps: [
        '(f + g)(x) = x² + 8x + 12, with x-intercepts −6 and −2.',
        'The vertex is halfway between them: (−6 + (−2))/2 = −4.',
        'Answer: −4',
      ],
    },
    {
      q: 'f(x) = x² − 7 and g(x) = 2x − 1. What is the minimum value of (f + g)(x)?',
      a: '-9',
      steps: [
        '(f + g)(x) = x² + 2x − 8. Its vertex is at x = −1.',
        '(f + g)(−1) = −9.',
        'Answer: −9',
      ],
    },
    {
      q: 'f(x) = x² + 2x + 4 and g(x) = −x − 4. How many x satisfy f(x) = g(x)?',
      a: '0',
      steps: [
        'f(x) = g(x) means (f − g)(x) = x² + 3x + 8 = 0.',
        'The discriminant is −23, so there are 0 solutions.',
        'Answer: 0',
      ],
    },
    {
      q: 'f(x) = x² + x − 4 and g(x) = x + 1. What is the larger x-intercept of (f + g)(x)?',
      a: '1',
      steps: [
        '(f + g)(x) = x² + 2x − 3 = (x + 3)(x − 1).',
        'The x-intercepts are −3 and 1; the larger is 1.',
        'Answer: 1',
      ],
    },
    {
      q: 'f(x) = x² − 9x + 14 and g(x) = −x + 2. What is the x-coordinate of the vertex of (f + g)(x)?',
      a: '5',
      steps: [
        '(f + g)(x) = x² − 10x + 16, with x-intercepts 2 and 8.',
        'The vertex is halfway between them: (2 + 8)/2 = 5.',
        'Answer: 5',
      ],
    },
    {
      q: 'f(x) = x² + 6x + 6 and g(x) = −4x − 6. What is the minimum value of (f + g)(x)?',
      a: '-1',
      steps: ['(f + g)(x) = x² + 2x. Its vertex is at x = −1.', '(f + g)(−1) = −1.', 'Answer: −1'],
    },
    {
      q: 'f(x) = x² + 4x − 1 and g(x) = −x − 5. How many x satisfy f(x) = g(x)?',
      a: '2',
      steps: [
        'f(x) = g(x) means (f − g)(x) = x² + 5x + 4 = 0.',
        'The discriminant is 9, so there are 2 solutions.',
        'Answer: 2',
      ],
    },
    {
      q: 'f(x) = 2x² − 6x − 3 and g(x) = 4x − 1. What is the larger x-intercept of (f + g)(x)?',
      a: '2',
      steps: [
        '(f + g)(x) = 2x² − 2x − 4 = 2(x + 1)(x − 2).',
        'The x-intercepts are −1 and 2; the larger is 2.',
        'Answer: 2',
      ],
    },
  ],
  composite: [
    {
      q: 'f(x) = 2x² − 3x − 3 and g(x) = 4x + 6. What is f(g(−1))?',
      a: '-1',
      steps: ['g(−1) = 4 × (−1) + 6 = 2.', 'f(2) = 2 × 2² − 3 × 2 − 3 = −1.', 'Answer: −1'],
    },
    {
      q: 'f(x) = 4x + 6 and g(x) = 2x² + x − 3. What is g(f(−3))?',
      a: '63',
      steps: ['f(−3) = 4 × (−3) + 6 = −6.', 'g(−6) = 2 × (−6)² + (−6) − 3 = 63.', 'Answer: 63'],
    },
    {
      q: 'f(x) = 4x + 5: what is f(f(−2))?',
      a: '-7',
      steps: ['f(−2) = −3.', 'f(−3) = −7.', 'Answer: −7'],
    },
    {
      q: 'g(2) = −1, and f(x) = x² − 3. What is f(g(2))?',
      a: '-2',
      steps: ['f(g(2)) = f(−1).', '(−1)² − 3 = −2.', 'Answer: −2'],
    },
    {
      q: 'f(x) = −x² + 6 and g(x) = 5x − 2. What is f(g(1))?',
      a: '-3',
      steps: ['g(1) = 5 × 1 − 2 = 3.', 'f(3) = −3² + 6 = −3.', 'Answer: −3'],
    },
    {
      q: 'f(x) = 4x − 7 and g(x) = 2x² + 4x + 2. What is g(f(1))?',
      a: '8',
      steps: ['f(1) = 4 × 1 − 7 = −3.', 'g(−3) = 2 × (−3)² + 4 × (−3) + 2 = 8.', 'Answer: 8'],
    },
    {
      q: 'f(x) = −6x + 5: what is f(f(5))?',
      a: '155',
      steps: ['f(5) = −25.', 'f(−25) = 155.', 'Answer: 155'],
    },
    {
      q: 'g(2) = 2, and f(x) = x² − 2. What is f(g(2))?',
      a: '2',
      steps: ['f(g(2)) = f(2).', '2² − 2 = 2.', 'Answer: 2'],
    },
    {
      q: 'f(x) = x² − 3x + 1 and g(x) = x − 2. f(g(x)) = x² + px + q. What is p?',
      a: '-7',
      steps: [
        'f(g(x)) = (x − 2)² − 3(x − 2) + 1.',
        'Expanded: x² − 7x + 11, so p = −7.',
        'Answer: −7',
      ],
    },
    {
      q: 'f(x) = x² − x − 3 and g(x) = x − 4. f(g(x)) = x² + px + q. What is q?',
      a: '17',
      steps: [
        'The constant term is f(g(0)) = f(−4).',
        'f(−4) = (−4)² − (−4) − 3 = 17.',
        'Answer: 17',
      ],
    },
    {
      q: 'f(x) = −3x + 4 and g(x) = 6x + 1. What x gives f(g(x)) = −17?',
      a: '1',
      steps: ['f(g(x)) = −18x + 1.', 'Set −18x + 1 = −17: x = 1.', 'Answer: 1'],
    },
    {
      q: 'f(x) = x² + 3x + 3 and g(x) = x − 2. f(g(x)) = x² + px + q. What is q?',
      a: '1',
      steps: [
        'The constant term is f(g(0)) = f(−2).',
        'f(−2) = (−2)² + 3 × (−2) + 3 = 1.',
        'Answer: 1',
      ],
    },
    {
      q: 'f(x) = −3x + 1 and g(x) = 3x. What x gives f(g(x)) = 37?',
      a: '-4',
      steps: ['f(g(x)) = −9x + 1.', 'Set −9x + 1 = 37: x = −4.', 'Answer: −4'],
    },
    {
      q: 'f(x) = x² + 4x + 1 and g(x) = x + 5. f(g(x)) = x² + px + q. What is p?',
      a: '14',
      steps: [
        'f(g(x)) = (x + 5)² + 4(x + 5) + 1.',
        'Expanded: x² + 14x + 46, so p = 14.',
        'Answer: 14',
      ],
    },
    {
      q: 'f(x) = −6x − 6 and g(x) = −3x + 3. What x gives f(g(x)) = −6?',
      a: '1',
      steps: ['f(g(x)) = 18x − 24.', 'Set 18x − 24 = −6: x = 1.', 'Answer: 1'],
    },
    {
      q: 'f(x) = x² − 3x − 3 and g(x) = x + 5. f(g(x)) = x² + px + q. What is q?',
      a: '7',
      steps: ['The constant term is f(g(0)) = f(5).', 'f(5) = 5² − 3 × 5 − 3 = 7.', 'Answer: 7'],
    },
    {
      q: 'f(x) = 5x + 1 and g(x) = −x − 3. What x gives f(g(x)) = −39?',
      a: '5',
      steps: ['f(g(x)) = −5x − 14.', 'Set −5x − 14 = −39: x = 5.', 'Answer: 5'],
    },
    {
      q: 'f(x) = 4x + 2 and g(x) = 4x + d. If f(g(x)) = g(f(x)) for every x, what is d?',
      a: '2',
      steps: [
        'f(g(x)) = 4(4x + d) + 2 = 16x + 4d + 2.',
        'g(f(x)) = 4(4x + 2) + d = 16x + 8 + d.',
        'Match constants: 4d + 2 = 8 + d, so d = 2.',
        'Answer: 2',
      ],
    },
    {
      q: 'f(x) = −7x − 4, g(x) = −7x − 6 and h(x) = 3x + 5. What is f(g(h(2)))?',
      a: '577',
      steps: ['h(2) = 11.', 'g(11) = −83.', 'f(−83) = 577.', 'Answer: 577'],
    },
    {
      q: 'f(x) = −2x² + 2x and g(x) = −2x + 2. f(g(x)) = Ax² + Bx + C. What is A + B + C?',
      a: '0',
      steps: [
        'A + B + C is the value of f(g(x)) at x = 1.',
        'g(1) = 0, and f(0) = 0.',
        'Answer: 0',
      ],
    },
    {
      q: 'f(x) = x² and g(x) = 3x − 1. What is f(g(2)) − g(f(2))?',
      a: '14',
      steps: ['f(g(2)) = f(5) = 25.', 'g(f(2)) = g(4) = 11.', '25 − 11 = 14.', 'Answer: 14'],
    },
    {
      q: 'f(x) = 2x − 2 and g(x) = 5x + d. If f(g(x)) = g(f(x)) for every x, what is d?',
      a: '-8',
      steps: [
        'f(g(x)) = 2(5x + d) − 2 = 10x + 2d − 2.',
        'g(f(x)) = 5(2x − 2) + d = 10x − 10 + d.',
        'Match constants: 2d − 2 = −10 + d, so d = −8.',
        'Answer: −8',
      ],
    },
    {
      q: 'f(x) = −2x + 7, g(x) = 6x − 3 and h(x) = 6x + 4. What is f(g(h(1)))?',
      a: '-107',
      steps: ['h(1) = 10.', 'g(10) = 57.', 'f(57) = −107.', 'Answer: −107'],
    },
    {
      q: 'f(x) = −x² − 2x − 1 and g(x) = −x − 2. f(g(x)) = Ax² + Bx + C. What is A + B + C?',
      a: '-4',
      steps: [
        'A + B + C is the value of f(g(x)) at x = 1.',
        'g(1) = −3, and f(−3) = −4.',
        'Answer: −4',
      ],
    },
    {
      q: 'f(x) = x² − 1 and g(x) = −2x − 3. What is f(g(0)) − g(f(0))?',
      a: '9',
      steps: ['f(g(0)) = f(−3) = 8.', 'g(f(0)) = g(−1) = −1.', '8 − (−1) = 9.', 'Answer: 9'],
    },
  ],
  piecewise: [
    {
      q: 'f(x) = 3x − 4 for x < 3, and f(x) = −2x + 3 for x ≥ 3. What is f(2)?',
      a: '2',
      steps: ['2 < 3, so use the first rule: 3x − 4.', '3 × 2 − 4 = 2.', 'Answer: 2'],
    },
    {
      q: 'f(x) = 3x − 3 for x < −1, and f(x) = −4x − 4 for x ≥ −1. What is f(0)?',
      a: '-4',
      steps: ['0 ≥ −1, so use the second rule: −4x − 4.', '−4 × 0 − 4 = −4.', 'Answer: −4'],
    },
    {
      q: 'f(x) = x² + 2 for x < −1, and f(x) = −3x + 6 for x ≥ −1. What is f(−3)?',
      a: '11',
      steps: ['−3 < −1, so use the first rule.', '(−3)² + 2 = 11.', 'Answer: 11'],
    },
    {
      q: 'f(x) = 4 for x < 1, and f(x) = 4x + 1 for x ≥ 1. What is f(0)?',
      a: '4',
      steps: ['0 < 1, so use the first rule.', 'The first rule is the constant 4.', 'Answer: 4'],
    },
    {
      q: 'f(x) = 6x − 2 for x < −1, and f(x) = 7x + 3 for x ≥ −1. What is f(−5)?',
      a: '-32',
      steps: ['−5 < −1, so use the first rule: 6x − 2.', '6 × (−5) − 2 = −32.', 'Answer: −32'],
    },
    {
      q: 'f(x) = −3x + 7 for x < 2, and f(x) = 6x + 5 for x ≥ 2. What is f(4)?',
      a: '29',
      steps: ['4 ≥ 2, so use the second rule: 6x + 5.', '6 × 4 + 5 = 29.', 'Answer: 29'],
    },
    {
      q: 'f(x) = 6 for x < −1, and f(x) = −x − 5 for x ≥ −1. What is f(−1)?',
      a: '-4',
      steps: ['−1 ≥ −1, so use the second rule.', '−(−1) − 5 = −4.', 'Answer: −4'],
    },
    {
      q: 'f(x) = 6x + 7 for x < −1, and f(x) = −7x + 4 for x ≥ −1. What is f(−3)?',
      a: '-11',
      steps: ['−3 < −1, so use the first rule: 6x + 7.', '6 × (−3) + 7 = −11.', 'Answer: −11'],
    },
    {
      q: 'f(x) = x for x < −1, and f(x) = 2x² − 4 for x ≥ −1. What is f(−3) + f(2)?',
      a: '1',
      steps: [
        'f(−3) = −3 using the first rule.',
        'f(2) = 4 using the second rule.',
        '−3 + 4 = 1.',
        'Answer: 1',
      ],
    },
    {
      q: 'f(x) = −7x + 7 for x < 2, and f(x) = −2x − 7 for x ≥ 2. For what x ≥ 2 is f(x) = −19?',
      a: '6',
      steps: ['Use the second rule: −2x − 7 = −19.', 'x = 6.', 'Answer: 6'],
    },
    {
      q: 'f(x) = x + 1 for x < 2, and f(x) = 6x − 3 for x ≥ 2. For what x < 2 is f(x) = 2?',
      a: '1',
      steps: ['Use the first rule: x + 1 = 2.', 'x = 1.', 'Answer: 1'],
    },
    {
      q: 'f(x) = 3x − 5 for x < 1, and f(x) = −3x + k for x ≥ 1. For the two pieces to meet at x = 1, what is k?',
      a: '1',
      steps: [
        'The first rule at x = 1 gives −2.',
        'The second rule at x = 1 gives −3 + k.',
        'Set them equal: k = −2 − (−3) = 1.',
        'Answer: 1',
      ],
    },
    {
      q: 'f(x) = −6x + 4 for x < 3, and f(x) = 2x² + 6 for x ≥ 3. What is f(2) + f(5)?',
      a: '48',
      steps: [
        'f(2) = −8 using the first rule.',
        'f(5) = 56 using the second rule.',
        '−8 + 56 = 48.',
        'Answer: 48',
      ],
    },
    {
      q: 'f(x) = 7x + 1 for x < 0, and f(x) = 4x − 6 for x ≥ 0. For what x ≥ 0 is f(x) = −6?',
      a: '0',
      steps: ['Use the second rule: 4x − 6 = −6.', 'x = 0.', 'Answer: 0'],
    },
    {
      q: 'f(x) = 2x + 6 for x < 2, and f(x) = 5x + 7 for x ≥ 2. For what x < 2 is f(x) = 4?',
      a: '-1',
      steps: ['Use the first rule: 2x + 6 = 4.', 'x = −1.', 'Answer: −1'],
    },
    {
      q: 'f(x) = −2x − 1 for x < −2, and f(x) = x + k for x ≥ −2. For the two pieces to meet at x = −2, what is k?',
      a: '5',
      steps: [
        'The first rule at x = −2 gives 3.',
        'The second rule at x = −2 gives −2 + k.',
        'Set them equal: k = 3 − (−2) = 5.',
        'Answer: 5',
      ],
    },
    {
      q: 'f(x) = −5x for x < −2, and f(x) = −x² − 5 for x ≥ −2. What is f(−5) + f(1)?',
      a: '19',
      steps: [
        'f(−5) = 25 using the first rule.',
        'f(1) = −6 using the second rule.',
        '25 + (−6) = 19.',
        'Answer: 19',
      ],
    },
    {
      q: 'f(x) = 2x² + 4 for x < −2, and f(x) = 5x + 1 for x ≥ −2. How many whole numbers x from −10 to 10 give the same output as x = −3?',
      a: '1',
      steps: [
        'f(−3) = 22.',
        'Test each rule on its own part of the number line: 1 whole number work.',
        'Answer: 1',
      ],
    },
    {
      q: 'f(x) = −3x − 5 for x < −1, and f(x) = x − 2 for x ≥ −1. What is f(f(−4))?',
      a: '5',
      steps: ['f(−4) = 7.', 'f(7) = 5, with the rule chosen by comparing 7 to −1.', 'Answer: 5'],
    },
    {
      q: 'f(x) = 3x for x < 2, and f(x) = −2x for x ≥ 2. What is the smallest value of f(x) over the whole numbers x from −4 to 5?',
      a: '-12',
      steps: [
        'Compute f at each whole number from -4 to 5.',
        'The smallest output is −12.',
        'Answer: −12',
      ],
    },
    {
      q: 'f(x) = 3|x − 4| + 1. What is f(−2)?',
      a: '19',
      steps: ['−2 − 4 = −6, and |−6| = 6.', '3 × 6 + 1 = 19.', 'Answer: 19'],
    },
    {
      q: 'f(x) = −x − 1 for x < 2, and f(x) = 2x + 2 for x ≥ 2. What is f(f(1))?',
      a: '1',
      steps: ['f(1) = −2.', 'f(−2) = 1, with the rule chosen by comparing −2 to 2.', 'Answer: 1'],
    },
    {
      q: 'f(x) = 3x for x < 0, and f(x) = 4x − 3 for x ≥ 0. What is the smallest value of f(x) over the whole numbers x from −4 to 5?',
      a: '-12',
      steps: [
        'Compute f at each whole number from -4 to 5.',
        'The smallest output is −12.',
        'Answer: −12',
      ],
    },
    {
      q: 'f(x) = 3|x − 4| + 5. What is f(5)?',
      a: '8',
      steps: ['5 − 4 = 1, and |1| = 1.', '3 × 1 + 5 = 8.', 'Answer: 8'],
    },
    {
      q: 'f(x) = −x² for x < 3, and f(x) = −x + 4 for x ≥ 3. How many whole numbers x from −10 to 10 give the same output as x = 2?',
      a: '3',
      steps: [
        'f(2) = −4.',
        'Test each rule on its own part of the number line: 3 whole numbers work.',
        'Answer: 3',
      ],
    },
  ],
  evenodd: [
    {
      q: 'Is f(x) = x⁴ − 5x² + 2 even, odd or neither? Type 1 for even, 2 for odd, 0 for neither.',
      a: '1',
      steps: [
        'Compare f(−x) with f(x). Test x = 2: f(2) = −2 and f(−2) = −2.',
        'The values match for every x, so f is even.',
        'Answer: 1',
      ],
    },
    {
      q: 'Is f(x) = x³ − 4x even, odd or neither? Type 1 for even, 2 for odd, 0 for neither.',
      a: '2',
      steps: [
        'Compare f(−x) with f(x). Test x = 2: f(2) = 0 and f(−2) = 0.',
        'The values are opposites for every x, so f is odd.',
        'Answer: 2',
      ],
    },
    {
      q: 'Is f(x) = x² + 3x even, odd or neither? Type 1 for even, 2 for odd, 0 for neither.',
      a: '0',
      steps: [
        'Compare f(−x) with f(x). Test x = 2: f(2) = 10 and f(−2) = −2.',
        'The values are neither equal nor opposite, so f is neither.',
        'Answer: 0',
      ],
    },
    {
      q: 'f is an even function and f(4) = −3. What is f(−4)?',
      a: '-3',
      steps: ['An even function has f(−x) = f(x): symmetric about the y-axis.', 'Answer: −3'],
    },
    {
      q: 'f is an odd function and f(6) = 2. What is f(−6)?',
      a: '-2',
      steps: [
        'An odd function has f(−x) = −f(x): symmetric about the origin.',
        'So f(−6) = −(2) = −2.',
        'Answer: −2',
      ],
    },
    {
      q: 'Is f(x) = |x| + 6 even, odd or neither? Type 1 for even, 2 for odd, 0 for neither.',
      a: '1',
      steps: [
        'Compare f(−x) with f(x). Test x = 2: f(2) = 8 and f(−2) = 8.',
        'The values match for every x, so f is even.',
        'Answer: 1',
      ],
    },
    {
      q: 'Is f(x) = x³ + 2x² even, odd or neither? Type 1 for even, 2 for odd, 0 for neither.',
      a: '0',
      steps: [
        'Compare f(−x) with f(x). Test x = 2: f(2) = 16 and f(−2) = 0.',
        'The values are neither equal nor opposite, so f is neither.',
        'Answer: 0',
      ],
    },
    {
      q: 'f is an even function and f(2) = 1. What is f(−2)?',
      a: '1',
      steps: ['An even function has f(−x) = f(x): symmetric about the y-axis.', 'Answer: 1'],
    },
    {
      q: 'Is f(x) = 4 even, odd or neither? Type 1 for even, 2 for odd, 0 for neither.',
      a: '1',
      steps: [
        'Compare f(−x) with f(x). Test x = 2: f(2) = 4 and f(−2) = 4.',
        'The values match for every x, so f is even.',
        'Answer: 1',
      ],
    },
    {
      q: 'Is f(x) = x⁵ − x even, odd or neither? Type 1 for even, 2 for odd, 0 for neither.',
      a: '2',
      steps: [
        'Compare f(−x) with f(x). Test x = 2: f(2) = 30 and f(−2) = −30.',
        'The values are opposites for every x, so f is odd.',
        'Answer: 2',
      ],
    },
    {
      q: 'Is f(x) = x² · (x − 1) even, odd or neither? Type 1 for even, 2 for odd, 0 for neither.',
      a: '0',
      steps: [
        'Compare f(−x) with f(x). Test x = 2: f(2) = 4 and f(−2) = −12.',
        'The values are neither equal nor opposite, so f is neither.',
        'Answer: 0',
      ],
    },
    {
      q: 'f is odd and f(6) = 3. What is f(6) + f(−6)?',
      a: '0',
      steps: ['f(−6) = −f(6) = −3.', '3 + (−3) = 0.', 'Answer: 0'],
    },
    {
      q: 'f is even and f(−6) = 7. What is f(6) + f(−6)?',
      a: '14',
      steps: ['f(6) = f(−6) = 7.', '7 + 7 = 14.', 'Answer: 14'],
    },
    {
      q: 'Suppose an odd function f is defined at x = 0. What is f(0)?',
      a: '0',
      steps: ['f(0) = −f(0), so f(0) = 0.', 'Answer: 0'],
    },
    {
      q: 'f(x) = x⁴ − 5x² + 4. Is f even, odd or neither? Type 1 for even, 2 for odd, 0 for neither.',
      a: '1',
      steps: ['Every power of x is even, so f(−x) = f(x).', 'f is even.', 'Answer: 1'],
    },
    {
      q: 'Is f(x) = x⁶ − x⁴ + 1 even, odd or neither? Type 1 for even, 2 for odd, 0 for neither.',
      a: '1',
      steps: [
        'Compare f(−x) with f(x). Test x = 2: f(2) = 49 and f(−2) = 49.',
        'The values match for every x, so f is even.',
        'Answer: 1',
      ],
    },
    {
      q: 'Is f(x) = x · |x| even, odd or neither? Type 1 for even, 2 for odd, 0 for neither.',
      a: '2',
      steps: [
        'Compare f(−x) with f(x). Test x = 2: f(2) = 4 and f(−2) = −4.',
        'The values are opposites for every x, so f is odd.',
        'Answer: 2',
      ],
    },
    {
      q: 'f(x) = x³ + 2x. What is f(4) + f(−4)?',
      a: '0',
      steps: [
        'f is odd (only odd powers), so f(−4) = −f(4) = −72.',
        'f(4) = 72, and the sum is 0.',
        'Answer: 0',
      ],
    },
    {
      q: 'f is even with f(5) = 3, and g is odd with g(5) = −5. What is f(−5) + g(−5)?',
      a: '8',
      steps: ['f(−5) = 3.', 'g(−5) = −g(5) = 5.', '3 + 5 = 8.', 'Answer: 8'],
    },
    {
      q: 'f is even with f(5) = −9, and g is odd with g(5) = −7. What is f(−5) × g(−5)?',
      a: '-63',
      steps: ['f(−5) = −9 and g(−5) = 7.', '(−9) × 7 = −63.', 'Answer: −63'],
    },
    {
      q: 'How many of these functions are even? x³ − 4x;  5x − 7;  x⁶ − x⁴ + 1;  x · |x|;  3x',
      a: '1',
      steps: [
        'x³ − 4x is odd.',
        '5x − 7 is neither.',
        'x⁶ − x⁴ + 1 is even.',
        'x · |x| is odd.',
        '3x is odd.',
        'Answer: 1',
      ],
    },
    {
      q: 'f(x) = −2x³ + 5x. What is f(3) + f(−3)?',
      a: '0',
      steps: [
        'f is odd (only odd powers), so f(−3) = −f(3) = 39.',
        'f(3) = −39, and the sum is 0.',
        'Answer: 0',
      ],
    },
    {
      q: 'f is even with f(5) = −7, and g is odd with g(5) = −6. What is f(−5) + g(−5)?',
      a: '-1',
      steps: ['f(−5) = −7.', 'g(−5) = −g(5) = 6.', '−7 + 6 = −1.', 'Answer: −1'],
    },
    {
      q: 'f is even with f(2) = −8, and g is odd with g(2) = −3. What is f(−2) × g(−2)?',
      a: '-24',
      steps: ['f(−2) = −8 and g(−2) = 3.', '(−8) × 3 = −24.', 'Answer: −24'],
    },
    {
      q: 'How many of these functions are even? x⁴ − 5x² + 2;  x² − 9;  x⁶ − x⁴ + 1;  x³ − 4x;  x² + 3x',
      a: '3',
      steps: [
        'x⁴ − 5x² + 2 is even.',
        'x² − 9 is even.',
        'x⁶ − x⁴ + 1 is even.',
        'x³ − 4x is odd.',
        'x² + 3x is neither.',
        'Answer: 3',
      ],
    },
  ],
  asymptotes: [
    {
      q: 'f(x) = 1/(x − 2): what is the vertical asymptote x = a?',
      a: '2',
      steps: ['The denominator is 0 when x = 2, and the numerator is not 0 there.', 'Answer: 2'],
    },
    {
      q: 'f(x) = 1/(x + 2) + 4: what is the horizontal asymptote y = b?',
      a: '4',
      steps: ['As x grows large, 1/(x + 2) approaches 0.', 'So f approaches 4.', 'Answer: 4'],
    },
    {
      q: 'f(x) = −2/(x + 1). As x approaches −1 from the left, does f(x) go to +∞ or −∞? Type 1 for +∞, −1 for −∞.',
      a: '1',
      steps: [
        'Near x = −1 the denominator is a small negative number.',
        '−2 divided by it is large and positive.',
        'Answer: 1',
      ],
    },
    {
      q: 'f(x) = (2x + 1)/(4x + 3): what is the horizontal asymptote y = b? Write a fraction if needed.',
      a: '1/2',
      form: 'fraction',
      steps: ['Compare the leading terms: 2x over 4x.', 'The ratio is 1/2.', 'Answer: 1/2'],
    },
    {
      q: 'f(x) = 2/(x + 4): what is the vertical asymptote x = a?',
      a: '-4',
      steps: ['The denominator is 0 when x = −4, and the numerator is not 0 there.', 'Answer: −4'],
    },
    {
      q: 'f(x) = 1/(x − 5) + 2: what is the horizontal asymptote y = b?',
      a: '2',
      steps: ['As x grows large, 1/(x − 5) approaches 0.', 'So f approaches 2.', 'Answer: 2'],
    },
    {
      q: 'f(x) = 2/(x + 4). As x approaches −4 from the left, does f(x) go to +∞ or −∞? Type 1 for +∞, −1 for −∞.',
      a: '-1',
      steps: [
        'Near x = −4 the denominator is a small negative number.',
        '2 divided by it is large and negative.',
        'Answer: −1',
      ],
    },
    {
      q: 'f(x) = (−x + 1)/(−2x + 3): what is the horizontal asymptote y = b? Write a fraction if needed.',
      a: '1/2',
      form: 'fraction',
      steps: ['Compare the leading terms: −1x over −2x.', 'The ratio is 1/2.', 'Answer: 1/2'],
    },
    {
      q: 'f(x) = 1/((x + 7)(x − 1)): what is the sum of the x-values of its vertical asymptotes?',
      a: '-6',
      steps: ['The denominator is 0 at x = −7 and x = 1.', '−7 + 1 = −6.', 'Answer: −6'],
    },
    {
      q: 'f(x) = (−2x + 1)/(3x + 4): what is its vertical asymptote x = a? Write a fraction if needed.',
      a: '-4/3',
      form: 'fraction',
      steps: ['The denominator is 0 when 3x + 4 = 0.', 'x = −4/3.', 'Answer: −4/3'],
    },
    {
      q: 'f(x) = (−x² + 3)/(−5x² + x + 4): what is the horizontal asymptote y = b? Write a fraction if needed.',
      a: '1/5',
      form: 'fraction',
      steps: [
        'The top and the bottom both have degree 2.',
        'Divide the leading coefficients: −1/−5 = 1/5.',
        'Answer: 1/5',
      ],
    },
    {
      q: 'f(x) = (3x + 2)/(−2x² + 1): what is the horizontal asymptote y = b?',
      a: '0',
      steps: [
        'The top has degree 1 and the bottom has degree 2.',
        'When the bottom grows faster, the fraction approaches 0.',
        'Answer: 0',
      ],
    },
    {
      q: 'f(x) = 1/((x − 6)(x + 6)): what is the sum of the x-values of its vertical asymptotes?',
      a: '0',
      steps: ['The denominator is 0 at x = 6 and x = −6.', '6 + (−6) = 0.', 'Answer: 0'],
    },
    {
      q: 'f(x) = (x + 1)/(4x − 9): what is its vertical asymptote x = a? Write a fraction if needed.',
      a: '9/4',
      form: 'fraction',
      steps: ['The denominator is 0 when 4x − 9 = 0.', 'x = 9/4.', 'Answer: 9/4'],
    },
    {
      q: 'f(x) = (−2x² + 3)/(−x² + x + 4): what is the horizontal asymptote y = b? Write a fraction if needed.',
      a: '2',
      steps: [
        'The top and the bottom both have degree 2.',
        'Divide the leading coefficients: −2/−1 = 2.',
        'Answer: 2',
      ],
    },
    {
      q: 'f(x) = (x + 2)/(2x² + 1): what is the horizontal asymptote y = b?',
      a: '0',
      steps: [
        'The top has degree 1 and the bottom has degree 2.',
        'When the bottom grows faster, the fraction approaches 0.',
        'Answer: 0',
      ],
    },
    {
      q: 'f(x) = 1/((x − 3)(x − 4)): what is the sum of the x-values of its vertical asymptotes?',
      a: '7',
      steps: ['The denominator is 0 at x = 3 and x = 4.', '3 + 4 = 7.', 'Answer: 7'],
    },
    {
      q: 'f(x) = (x + 1)/((x + 1)(x − 7)): how many vertical asymptotes does the graph have?',
      a: '1',
      steps: [
        'The factor x + 1 cancels, leaving a hole at x = −1.',
        'Only x = 7 remains as a vertical asymptote.',
        'Answer: 1',
      ],
    },
    {
      q: 'f(x) = (−6x² + 4)/(4x² + 5) + 3. What is its horizontal asymptote y = b? Write a fraction if needed.',
      a: '3/2',
      form: 'fraction',
      steps: ['The fraction part approaches −3/2.', 'Adding 3 gives 3/2.', 'Answer: 3/2'],
    },
    {
      q: 'f(x) = (2x + 1)/(−3x + 7). The horizontal asymptote is y = b and the vertical asymptote is x = h. What is b + h? Write a fraction if needed.',
      a: '5/3',
      form: 'fraction',
      steps: [
        'b = −2/3 (ratio of the leading coefficients).',
        'h = 7/3 (where the denominator is 0).',
        'b + h = 5/3.',
        'Answer: 5/3',
      ],
    },
    {
      q: 'f(x) = 2/(x − 2) + 5: the two asymptotes are x = h and y = b. What is h + b?',
      a: '7',
      steps: [
        'The vertical asymptote is x = 2.',
        'The horizontal asymptote is y = 5.',
        '2 + 5 = 7.',
        'Answer: 7',
      ],
    },
    {
      q: 'f(x) = (x + 1)/((x + 1)(x + 8)): how many vertical asymptotes does the graph have?',
      a: '1',
      steps: [
        'The factor x + 1 cancels, leaving a hole at x = −1.',
        'Only x = −8 remains as a vertical asymptote.',
        'Answer: 1',
      ],
    },
    {
      q: 'f(x) = (−6x² + 1)/(2x² + 5) + 4. What is its horizontal asymptote y = b? Write a fraction if needed.',
      a: '1',
      steps: ['The fraction part approaches −3.', 'Adding 4 gives 1.', 'Answer: 1'],
    },
    {
      q: 'f(x) = (−3x + 1)/(2x + 7). The horizontal asymptote is y = b and the vertical asymptote is x = h. What is b + h? Write a fraction if needed.',
      a: '-5',
      steps: [
        'b = −3/2 (ratio of the leading coefficients).',
        'h = −7/2 (where the denominator is 0).',
        'b + h = −5.',
        'Answer: −5',
      ],
    },
    {
      q: 'f(x) = 4/(x + 2): the two asymptotes are x = h and y = b. What is h + b?',
      a: '-2',
      steps: [
        'The vertical asymptote is x = −2.',
        'The horizontal asymptote is y = 0.',
        '−2 + 0 = −2.',
        'Answer: −2',
      ],
    },
  ],
};
