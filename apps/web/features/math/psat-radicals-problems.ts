import type { GuideProblem } from './guide-problem';

/** 25 problems per Radicals chapter, simple to complex: 1–8 warm-up, 9–17 core, 18–25 challenge. Generated from small templates, so every answer is computed. */
export const RADICALS_PROBLEMS: Record<string, GuideProblem[]> = {
  whatis: [
    {
      q: 'What is √196?',
      a: '14',
      steps: ['Find the number that squares to 196.', '14 × 14 = 196.', 'Answer: 14'],
    },
    {
      q: 'What is ∛343?',
      a: '7',
      steps: ['Find the number that cubes to 343.', '7 × 7 × 7 = 343.', 'Answer: 7'],
    },
    {
      q: 'What is −√196? Remember the sign in front.',
      a: '-14',
      steps: [
        'The principal root of 196 is 14.',
        'The minus sign in front makes it −14.',
        'Answer: −14',
      ],
    },
    {
      q: 'How many real numbers x satisfy x² = 196?',
      a: '2',
      steps: ['Both 14 and −14 square to 196.', 'Answer: 2'],
    },
    {
      q: 'What is √225?',
      a: '15',
      steps: ['Find the number that squares to 225.', '15 × 15 = 225.', 'Answer: 15'],
    },
    {
      q: 'What is ∛729?',
      a: '9',
      steps: ['Find the number that cubes to 729.', '9 × 9 × 9 = 729.', 'Answer: 9'],
    },
    {
      q: 'What is −√225? Remember the sign in front.',
      a: '-15',
      steps: [
        'The principal root of 225 is 15.',
        'The minus sign in front makes it −15.',
        'Answer: −15',
      ],
    },
    {
      q: 'How many real numbers x satisfy x² = 225?',
      a: '2',
      steps: ['Both 15 and −15 square to 225.', 'Answer: 2'],
    },
    {
      q: 'Is √(−49) a real number? Type 1 for yes, 0 for no.',
      a: '0',
      steps: [
        'The index 2 is even and the radicand −49 is negative.',
        'No real number squares to a negative.',
        'Answer: 0',
      ],
    },
    {
      q: 'Is ∛(−64) a real number? Type 1 for yes, 0 for no.',
      a: '1',
      steps: [
        'The index 3 is odd, so the radicand can be negative.',
        '−4 cubed is −64.',
        'Answer: 1',
      ],
    },
    {
      q: '∜x = x^(1/m). What is m?',
      a: '4',
      steps: [
        'The radicand becomes the base and the index becomes the denominator of the exponent.',
        'So the root is x^(1/4).',
        'Answer: 4',
      ],
    },
    {
      q: 'What is ∜256?',
      a: '4',
      steps: ['Find the number whose power 4 is 256.', '4^4 = 256.', 'Answer: 4'],
    },
    {
      q: 'What is 81^(1/2)?',
      a: '9',
      steps: ['A power of 1/2 is a square root.', '√81 = 9.', 'Answer: 9'],
    },
    {
      q: 'Is √(−81) a real number? Type 1 for yes, 0 for no.',
      a: '0',
      steps: [
        'The index 2 is even and the radicand −81 is negative.',
        'No real number squares to a negative.',
        'Answer: 0',
      ],
    },
    {
      q: 'Is ∛(−216) a real number? Type 1 for yes, 0 for no.',
      a: '1',
      steps: [
        'The index 3 is odd, so the radicand can be negative.',
        '−6 cubed is −216.',
        'Answer: 1',
      ],
    },
    {
      q: 'the 5th root of x = x^(1/m). What is m?',
      a: '5',
      steps: [
        'The radicand becomes the base and the index becomes the denominator of the exponent.',
        'So the root is x^(1/5).',
        'Answer: 5',
      ],
    },
    {
      q: 'What is ∜625?',
      a: '5',
      steps: ['Find the number whose power 4 is 625.', '5^4 = 625.', 'Answer: 5'],
    },
    {
      q: 'What is 8^(2/3)?',
      a: '4',
      steps: [
        'Take the cube root first: 2.',
        'Then raise it to the power 2: 2^2 = 4.',
        'Answer: 4',
      ],
    },
    {
      q: 'What is 36^(3/2)?',
      a: '216',
      steps: [
        'Take the square root first: 6.',
        'Then raise it to the power 3: 6^3 = 216.',
        'Answer: 216',
      ],
    },
    {
      q: 'What is 8^(−2/3)? Write a fraction.',
      a: '1/4',
      form: 'fraction',
      steps: ['A negative exponent means the reciprocal.', '8^(2/3) = 2^2 = 4.', 'Answer: 1/4'],
    },
    {
      q: '√(x − 3) is a real number only when x ≥ what number?',
      a: '3',
      steps: ['The radicand must be at least 0, so x − 3 ≥ 0.', 'That gives x ≥ 3.', 'Answer: 3'],
    },
    {
      q: 'How many whole numbers x from −10 to 10 make √(x + 3) a real number?',
      a: '14',
      steps: [
        'The radicand must satisfy x + 3 ≥ 0, so x ≥ −3.',
        'Count the integers from −3 to 10.',
        'Answer: 14',
      ],
    },
    {
      q: 'What is the cube root of −27?',
      a: '-3',
      steps: [
        'The index 3 is odd, so a negative radicand is allowed.',
        '−3 × −3 × −3 = −27.',
        'Answer: −3',
      ],
    },
    {
      q: 'What is 27^(4/3)?',
      a: '81',
      steps: [
        'Take the cube root first: 3.',
        'Then raise it to the power 4: 3^4 = 81.',
        'Answer: 81',
      ],
    },
    {
      q: 'What is 9^(5/2)?',
      a: '243',
      steps: [
        'Take the square root first: 3.',
        'Then raise it to the power 5: 3^5 = 243.',
        'Answer: 243',
      ],
    },
  ],
  perfect: [
    {
      q: 'What is 16²?',
      a: '256',
      steps: ['16 × 16 = 256.', 'Answer: 256'],
    },
    {
      q: 'What is 7³?',
      a: '343',
      steps: ['7 × 7 × 7 = 343.', 'Answer: 343'],
    },
    {
      q: 'Is 196 a perfect square? Type 1 for yes, 0 for no.',
      a: '1',
      steps: ['14 × 14 = 196.', 'Answer: 1'],
    },
    {
      q: 'Is 343 a perfect cube? Type 1 for yes, 0 for no.',
      a: '1',
      steps: ['7³ = 343.', 'Answer: 1'],
    },
    {
      q: 'What is 17²?',
      a: '289',
      steps: ['17 × 17 = 289.', 'Answer: 289'],
    },
    {
      q: 'What is 8³?',
      a: '512',
      steps: ['8 × 8 × 8 = 512.', 'Answer: 512'],
    },
    {
      q: 'Is 200 a perfect square? Type 1 for yes, 0 for no.',
      a: '0',
      steps: ['14² = 196 and 15² = 225, so 200 is between squares.', 'Answer: 0'],
    },
    {
      q: 'Is 344 a perfect cube? Type 1 for yes, 0 for no.',
      a: '0',
      steps: ['7³ = 343 and 8³ = 512, so 344 is between cubes.', 'Answer: 0'],
    },
    {
      q: 'What is the next perfect square after 200?',
      a: '225',
      steps: ['14² = 196 is not above 200.', '15² = 225 is the next one.', 'Answer: 225'],
    },
    {
      q: 'How many perfect squares are there from 1 to 500?',
      a: '22',
      steps: [
        '22² = 484 ≤ 500 but 23² = 529 is too big.',
        'The squares are 1², 2², …, 22².',
        'Answer: 22',
      ],
    },
    {
      q: 'How many perfect cubes are there from 1 to 2000?',
      a: '12',
      steps: [
        'Cube 1, 2, 3, … until the cube passes 2000.',
        '12³ = 1728 ≤ 2000 but 13³ = 2197 is too big.',
        'Answer: 12',
      ],
    },
    {
      q: 'What is the largest perfect square that divides 288?',
      a: '144',
      steps: [
        'Check the perfect squares 4, 9, 16, 25, … that divide 288.',
        'The largest is 144, since 288 = 144 × 2.',
        'Answer: 144',
      ],
    },
    {
      q: 'What is the next perfect square after 450?',
      a: '484',
      steps: ['21² = 441 is not above 450.', '22² = 484 is the next one.', 'Answer: 484'],
    },
    {
      q: 'How many perfect squares are there from 1 to 1000?',
      a: '31',
      steps: [
        '31² = 961 ≤ 1000 but 32² = 1024 is too big.',
        'The squares are 1², 2², …, 31².',
        'Answer: 31',
      ],
    },
    {
      q: 'How many perfect cubes are there from 1 to 5000?',
      a: '17',
      steps: [
        'Cube 1, 2, 3, … until the cube passes 5000.',
        '17³ = 4913 ≤ 5000 but 18³ = 5832 is too big.',
        'Answer: 17',
      ],
    },
    {
      q: 'What is the largest perfect square that divides 432?',
      a: '144',
      steps: [
        'Check the perfect squares 4, 9, 16, 25, … that divide 432.',
        'The largest is 144, since 432 = 144 × 3.',
        'Answer: 144',
      ],
    },
    {
      q: 'What is the next perfect square after 600?',
      a: '625',
      steps: ['24² = 576 is not above 600.', '25² = 625 is the next one.', 'Answer: 625'],
    },
    {
      q: 'What is the smallest positive whole number you can multiply 180 by to get a perfect square?',
      a: '5',
      steps: [
        'Factor 180 and look for primes with an odd power.',
        '180 × 5 = 900 = 30².',
        'Answer: 5',
      ],
    },
    {
      q: 'What is the smallest positive whole number you can multiply 18 by to get a perfect cube?',
      a: '12',
      steps: [
        'Factor 18 and look for primes whose power is not a multiple of 3.',
        '18 × 12 = 216 = 6³.',
        'Answer: 12',
      ],
    },
    {
      q: 'How many whole numbers from 1 to 200 are both a perfect square and a perfect cube?',
      a: '2',
      steps: [
        'A number that is both is a sixth power: 1⁶, 2⁶, 3⁶, ….',
        '2⁶ = 64 ≤ 200.',
        'Answer: 2',
      ],
    },
    {
      q: 'What is the largest whole number n for which n² is less than 300?',
      a: '17',
      steps: ['17² = 289 < 300, but 18² = 324 is not.', 'Answer: 17'],
    },
    {
      q: 'What is the smallest positive whole number you can multiply 252 by to get a perfect square?',
      a: '7',
      steps: [
        'Factor 252 and look for primes with an odd power.',
        '252 × 7 = 1764 = 42².',
        'Answer: 7',
      ],
    },
    {
      q: 'What is the smallest positive whole number you can multiply 24 by to get a perfect cube?',
      a: '9',
      steps: [
        'Factor 24 and look for primes whose power is not a multiple of 3.',
        '24 × 9 = 216 = 6³.',
        'Answer: 9',
      ],
    },
    {
      q: 'How many whole numbers from 1 to 1000 are both a perfect square and a perfect cube?',
      a: '3',
      steps: [
        'A number that is both is a sixth power: 1⁶, 2⁶, 3⁶, ….',
        '3⁶ = 729 ≤ 1000.',
        'Answer: 3',
      ],
    },
    {
      q: 'What is the largest whole number n for which n² is less than 500?',
      a: '22',
      steps: ['22² = 484 < 500, but 23² = 529 is not.', 'Answer: 22'],
    },
  ],
  simplify: [
    {
      q: 'What is the largest perfect square that divides 180?',
      a: '36',
      steps: ['Check 4, 9, 16, 25, … for factors of 180.', '180 = 36 × 5.', 'Answer: 36'],
    },
    {
      q: 'Simplify √180 to c√r with r as small as possible. What is c?',
      a: '6',
      steps: ['180 = 36 × 5.', '√180 = √36 × √5 = 6√5.', 'Answer: 6'],
    },
    {
      q: 'What is the largest perfect square that divides 200?',
      a: '100',
      steps: ['Check 4, 9, 16, 25, … for factors of 200.', '200 = 100 × 2.', 'Answer: 100'],
    },
    {
      q: 'Simplify √200 to c√r with r as small as possible. What is c?',
      a: '10',
      steps: ['200 = 100 × 2.', '√200 = √100 × √2 = 10√2.', 'Answer: 10'],
    },
    {
      q: 'What is the largest perfect square that divides 242?',
      a: '121',
      steps: ['Check 4, 9, 16, 25, … for factors of 242.', '242 = 121 × 2.', 'Answer: 121'],
    },
    {
      q: 'Simplify √242 to c√r with r as small as possible. What is c?',
      a: '11',
      steps: ['242 = 121 × 2.', '√242 = √121 × √2 = 11√2.', 'Answer: 11'],
    },
    {
      q: 'What is the largest perfect square that divides 245?',
      a: '49',
      steps: ['Check 4, 9, 16, 25, … for factors of 245.', '245 = 49 × 5.', 'Answer: 49'],
    },
    {
      q: 'Simplify √245 to c√r with r as small as possible. What is c?',
      a: '7',
      steps: ['245 = 49 × 5.', '√245 = √49 × √5 = 7√5.', 'Answer: 7'],
    },
    {
      q: 'Write √363 in simplest radical form.',
      a: '11*sqrt(3)',
      form: 'radical',
      steps: [
        '363 = 121 × 3, and 121 is a perfect square.',
        '√363 = √121 × √3 = 11√3.',
        'Answer: 11√3',
      ],
    },
    {
      q: 'Simplify √363 to c√r with r as small as possible. What is r?',
      a: '3',
      steps: [
        '363 = 121 × 3.',
        'The 121 comes out as 11, and 3 stays under the radical.',
        'Answer: 3',
      ],
    },
    {
      q: 'Write √392 in simplest radical form.',
      a: '14*sqrt(2)',
      form: 'radical',
      steps: [
        '392 = 196 × 2, and 196 is a perfect square.',
        '√392 = √196 × √2 = 14√2.',
        'Answer: 14√2',
      ],
    },
    {
      q: 'Simplify √392 to c√r with r as small as possible. What is r?',
      a: '2',
      steps: [
        '392 = 196 × 2.',
        'The 196 comes out as 14, and 2 stays under the radical.',
        'Answer: 2',
      ],
    },
    {
      q: 'Write √396 in simplest radical form.',
      a: '6*sqrt(11)',
      form: 'radical',
      steps: [
        '396 = 36 × 11, and 36 is a perfect square.',
        '√396 = √36 × √11 = 6√11.',
        'Answer: 6√11',
      ],
    },
    {
      q: 'Simplify √396 to c√r with r as small as possible. What is r?',
      a: '11',
      steps: [
        '396 = 36 × 11.',
        'The 36 comes out as 6, and 11 stays under the radical.',
        'Answer: 11',
      ],
    },
    {
      q: 'Write √432 in simplest radical form.',
      a: '12*sqrt(3)',
      form: 'radical',
      steps: [
        '432 = 144 × 3, and 144 is a perfect square.',
        '√432 = √144 × √3 = 12√3.',
        'Answer: 12√3',
      ],
    },
    {
      q: 'Simplify √432 to c√r with r as small as possible. What is r?',
      a: '3',
      steps: [
        '432 = 144 × 3.',
        'The 144 comes out as 12, and 3 stays under the radical.',
        'Answer: 3',
      ],
    },
    {
      q: 'Write √450 in simplest radical form.',
      a: '15*sqrt(2)',
      form: 'radical',
      steps: [
        '450 = 225 × 2, and 225 is a perfect square.',
        '√450 = √225 × √2 = 15√2.',
        'Answer: 15√2',
      ],
    },
    {
      q: 'Simplify ∛54 to c∛r with r as small as possible. What is c?',
      a: '3',
      steps: ['Look for a perfect cube factor: 54 = 27 × 2.', '∛54 = ∛27 × ∛2 = 3∛2.', 'Answer: 3'],
    },
    {
      q: 'Simplify ∛54 to c∛r with r as small as possible. What is r?',
      a: '2',
      steps: [
        'Look for a perfect cube factor: 54 = 27 × 2.',
        'The 27 comes out as 3, and 2 stays under the cube root.',
        'Answer: 2',
      ],
    },
    {
      q: '√605 in simplest radical form is c√r. What is c + r?',
      a: '16',
      steps: ['605 = 121 × 5, so √605 = 11√5.', '11 + 5 = 16.', 'Answer: 16'],
    },
    {
      q: '∛(−54) = −c∛r in simplest form. What is c × r?',
      a: '6',
      steps: [
        '∛(−54) = −∛54 because the index is odd.',
        '54 = 27 × 2, so ∛54 = 3∛2.',
        '3 × 2 = 6.',
        'Answer: 6',
      ],
    },
    {
      q: 'Simplify ∛108 to c∛r with r as small as possible. What is c?',
      a: '3',
      steps: [
        'Look for a perfect cube factor: 108 = 27 × 4.',
        '∛108 = ∛27 × ∛4 = 3∛4.',
        'Answer: 3',
      ],
    },
    {
      q: 'Simplify ∛108 to c∛r with r as small as possible. What is r?',
      a: '4',
      steps: [
        'Look for a perfect cube factor: 108 = 27 × 4.',
        'The 27 comes out as 3, and 4 stays under the cube root.',
        'Answer: 4',
      ],
    },
    {
      q: '√675 in simplest radical form is c√r. What is c + r?',
      a: '18',
      steps: ['675 = 225 × 3, so √675 = 15√3.', '15 + 3 = 18.', 'Answer: 18'],
    },
    {
      q: '∛(−108) = −c∛r in simplest form. What is c × r?',
      a: '12',
      steps: [
        '∛(−108) = −∛108 because the index is odd.',
        '108 = 27 × 4, so ∛108 = 3∛4.',
        '3 × 4 = 12.',
        'Answer: 12',
      ],
    },
  ],
  muldiv: [
    {
      q: '√3 · √5 = √n. What is n?',
      a: '15',
      steps: ['Same index, so multiply the radicands.', '3 × 5 = 15.', 'Answer: 15'],
    },
    {
      q: 'What is √2 · √72?',
      a: '12',
      steps: ['Multiply the radicands: 2 × 72 = 144.', '√144 = 12.', 'Answer: 12'],
    },
    {
      q: 'What is ∛4 · ∛16?',
      a: '4',
      steps: ['Multiply the radicands: 4 × 16 = 64.', '∛64 = 4.', 'Answer: 4'],
    },
    {
      q: 'What is √288 / √2?',
      a: '12',
      steps: ['Divide the radicands: 288 ÷ 2 = 144.', '√144 = 12.', 'Answer: 12'],
    },
    {
      q: '√2 · √7 = √n. What is n?',
      a: '14',
      steps: ['Same index, so multiply the radicands.', '2 × 7 = 14.', 'Answer: 14'],
    },
    {
      q: 'What is √3 · √48?',
      a: '12',
      steps: ['Multiply the radicands: 3 × 48 = 144.', '√144 = 12.', 'Answer: 12'],
    },
    {
      q: 'What is ∛9 · ∛24?',
      a: '6',
      steps: ['Multiply the radicands: 9 × 24 = 216.', '∛216 = 6.', 'Answer: 6'],
    },
    {
      q: 'What is √180 / √5?',
      a: '6',
      steps: ['Divide the radicands: 180 ÷ 5 = 36.', '√36 = 6.', 'Answer: 6'],
    },
    {
      q: 'Write √6 · √14 in simplest radical form.',
      a: '2*sqrt(21)',
      form: 'radical',
      steps: [
        'Multiply the radicands: 6 × 14 = 84.',
        '84 = 4 × 21, so √84 = 2√21.',
        'Answer: 2√21',
      ],
    },
    {
      q: 'Write (3√6)(5√10) in simplest radical form.',
      a: '30*sqrt(15)',
      form: 'radical',
      steps: [
        'Multiply the coefficients: 3 × 5 = 15.',
        'Multiply the radicands: 6 × 10 = 60 = 4 × 15.',
        '15 × 2√15 = 30√15.',
        'Answer: 30√15',
      ],
    },
    {
      q: 'Write √360 / √5 in simplest radical form.',
      a: '6*sqrt(2)',
      form: 'radical',
      steps: ['Divide the radicands: 360 ÷ 5 = 72.', '72 = 36 × 2, so √72 = 6√2.', 'Answer: 6√2'],
    },
    {
      q: 'Write (42√90)/(6√5) in simplest radical form.',
      a: '21*sqrt(2)',
      form: 'radical',
      steps: [
        'Divide the coefficients: 42 ÷ 6 = 7.',
        'Divide the radicands: 90 ÷ 5 = 18 = 9 × 2.',
        '7 × 3√2 = 21√2.',
        'Answer: 21√2',
      ],
    },
    {
      q: 'Write √10 · √15 in simplest radical form.',
      a: '5*sqrt(6)',
      form: 'radical',
      steps: [
        'Multiply the radicands: 10 × 15 = 150.',
        '150 = 25 × 6, so √150 = 5√6.',
        'Answer: 5√6',
      ],
    },
    {
      q: 'Write (4√3)(6√21) in simplest radical form.',
      a: '72*sqrt(7)',
      form: 'radical',
      steps: [
        'Multiply the coefficients: 4 × 6 = 24.',
        'Multiply the radicands: 3 × 21 = 63 = 9 × 7.',
        '24 × 3√7 = 72√7.',
        'Answer: 72√7',
      ],
    },
    {
      q: 'Write √270 / √5 in simplest radical form.',
      a: '3*sqrt(6)',
      form: 'radical',
      steps: ['Divide the radicands: 270 ÷ 5 = 54.', '54 = 9 × 6, so √54 = 3√6.', 'Answer: 3√6'],
    },
    {
      q: 'Write (35√280)/(7√5) in simplest radical form.',
      a: '10*sqrt(14)',
      form: 'radical',
      steps: [
        'Divide the coefficients: 35 ÷ 7 = 5.',
        'Divide the radicands: 280 ÷ 5 = 56 = 4 × 14.',
        '5 × 2√14 = 10√14.',
        'Answer: 10√14',
      ],
    },
    {
      q: 'Write √14 · √21 in simplest radical form.',
      a: '7*sqrt(6)',
      form: 'radical',
      steps: [
        'Multiply the radicands: 14 × 21 = 294.',
        '294 = 49 × 6, so √294 = 7√6.',
        'Answer: 7√6',
      ],
    },
    {
      q: 'What is (3∛4)(−5∛2)?',
      a: '-30',
      steps: [
        'Multiply the coefficients: 3 × −5 = −15.',
        'Multiply the radicands: 4 × 2 = 8, and ∛8 = 2.',
        '−15 × 2 = −30.',
        'Answer: −30',
      ],
    },
    {
      q: 'What is √2 · √5 · √10?',
      a: '10',
      steps: ['Multiply the three radicands: 2 × 5 × 10 = 100.', '√100 = 10.', 'Answer: 10'],
    },
    {
      q: 'What is (7√3)²?',
      a: '147',
      steps: [
        'Square the coefficient and the root: 7² = 49 and (√3)² = 3.',
        '49 × 3 = 147.',
        'Answer: 147',
      ],
    },
    {
      q: 'Write √12 · √15 in simplest radical form.',
      a: '6*sqrt(5)',
      form: 'radical',
      steps: [
        'Multiply the radicands: 12 × 15 = 180.',
        '180 = 36 × 5, so √180 = 6√5.',
        'Answer: 6√5',
      ],
    },
    {
      q: 'What is (2∛3)(5∛9)?',
      a: '30',
      steps: [
        'Multiply the coefficients: 2 × 5 = 10.',
        'Multiply the radicands: 3 × 9 = 27, and ∛27 = 3.',
        '10 × 3 = 30.',
        'Answer: 30',
      ],
    },
    {
      q: 'What is √3 · √7 · √21?',
      a: '21',
      steps: ['Multiply the three radicands: 3 × 7 × 21 = 441.', '√441 = 21.', 'Answer: 21'],
    },
    {
      q: 'What is (5√6)²?',
      a: '150',
      steps: [
        'Square the coefficient and the root: 5² = 25 and (√6)² = 6.',
        '25 × 6 = 150.',
        'Answer: 150',
      ],
    },
    {
      q: 'Write √18 · √30 in simplest radical form.',
      a: '6*sqrt(15)',
      form: 'radical',
      steps: [
        'Multiply the radicands: 18 × 30 = 540.',
        '540 = 36 × 15, so √540 = 6√15.',
        'Answer: 6√15',
      ],
    },
  ],
  addsub: [
    {
      q: '7√2 + 4√2 = c√2. What is c?',
      a: '11',
      steps: [
        'The radical parts match, so these are like terms.',
        'Add the coefficients: 7 + 4 = 11.',
        'Answer: 11',
      ],
    },
    {
      q: '11√5 − 4√5 = c√5. What is c?',
      a: '7',
      steps: [
        'The radical parts match, so these are like terms.',
        'Subtract the coefficients: 11 − 4 = 7.',
        'Answer: 7',
      ],
    },
    {
      q: 'Can 3√2 + 4√3 be combined into one term? Type 1 for yes, 0 for no.',
      a: '0',
      steps: ['The radicands 2 and 3 are different, so they are not like terms.', 'Answer: 0'],
    },
    {
      q: 'Can 5∛11 − 2∛11 be combined into one term? Type 1 for yes, 0 for no.',
      a: '1',
      steps: ['Same index 3 and same radicand 11: like terms.', 'Answer: 1'],
    },
    {
      q: '9√3 + 5√3 = c√3. What is c?',
      a: '14',
      steps: [
        'The radical parts match, so these are like terms.',
        'Add the coefficients: 9 + 5 = 14.',
        'Answer: 14',
      ],
    },
    {
      q: '14√6 − 5√6 = c√6. What is c?',
      a: '9',
      steps: [
        'The radical parts match, so these are like terms.',
        'Subtract the coefficients: 14 − 5 = 9.',
        'Answer: 9',
      ],
    },
    {
      q: 'Can 3√5 + 4√7 be combined into one term? Type 1 for yes, 0 for no.',
      a: '0',
      steps: ['The radicands 5 and 7 are different, so they are not like terms.', 'Answer: 0'],
    },
    {
      q: 'Can 5∛6 − 2∛9 be combined into one term? Type 1 for yes, 0 for no.',
      a: '0',
      steps: ['The radicands 6 and 9 differ, so they are not like terms.', 'Answer: 0'],
    },
    {
      q: 'Simplify 7√2 + 4√2.',
      a: '11*sqrt(2)',
      form: 'radical',
      steps: ['Like terms: add the coefficients 7 + 4 = 11.', 'Keep √2.', 'Answer: 11√2'],
    },
    {
      q: 'Simplify √18 + √32.',
      a: '7*sqrt(2)',
      form: 'radical',
      steps: ['√18 = 3√2 and √32 = 4√2.', 'Now they are like terms: 3 + 4 = 7.', 'Answer: 7√2'],
    },
    {
      q: 'Simplify 11√2 − 4√2.',
      a: '7*sqrt(2)',
      form: 'radical',
      steps: ['Like terms: subtract the coefficients 11 − 4 = 7.', 'Keep √2.', 'Answer: 7√2'],
    },
    {
      q: 'Simplify √18 − √32.',
      a: '-sqrt(2)',
      form: 'radical',
      steps: ['√18 = 3√2 and √32 = 4√2.', 'Now they are like terms: 3 − 4 = −1.', 'Answer: −√2'],
    },
    {
      q: 'Simplify 9√3 + 5√3.',
      a: '14*sqrt(3)',
      form: 'radical',
      steps: ['Like terms: add the coefficients 9 + 5 = 14.', 'Keep √3.', 'Answer: 14√3'],
    },
    {
      q: 'Simplify √12 + √75.',
      a: '7*sqrt(3)',
      form: 'radical',
      steps: ['√12 = 2√3 and √75 = 5√3.', 'Now they are like terms: 2 + 5 = 7.', 'Answer: 7√3'],
    },
    {
      q: 'Simplify 14√3 − 5√3.',
      a: '9*sqrt(3)',
      form: 'radical',
      steps: ['Like terms: subtract the coefficients 14 − 5 = 9.', 'Keep √3.', 'Answer: 9√3'],
    },
    {
      q: 'Simplify √12 − √75.',
      a: '-3*sqrt(3)',
      form: 'radical',
      steps: ['√12 = 2√3 and √75 = 5√3.', 'Now they are like terms: 2 − 5 = −3.', 'Answer: −3√3'],
    },
    {
      q: 'Simplify 12√5 + 7√5.',
      a: '19*sqrt(5)',
      form: 'radical',
      steps: ['Like terms: add the coefficients 12 + 7 = 19.', 'Keep √5.', 'Answer: 19√5'],
    },
    {
      q: 'What is (√5 + 6)(√5 − 6)?',
      a: '-31',
      steps: [
        'A sum times a difference: (x + y)(x − y) = x² − y².',
        '5 − 36 = −31.',
        'Answer: −31',
      ],
    },
    {
      q: 'Write (5 + √2)² in the form m + n√2.',
      a: '27+10*sqrt(2)',
      form: 'radical',
      steps: ['(5 + √2)² = 25 + 2 × 5 × √2 + 2.', 'That is 27 + 10√2.', 'Answer: 27 + 10√2'],
    },
    {
      q: 'Write (3√3 + 2)(2√3 + 5) in simplest form.',
      a: '28+19*sqrt(3)',
      form: 'radical',
      steps: ['FOIL: 6·3 + 15√3 + 4√3 + 10.', '18 + 10 = 28 and 15 + 4 = 19.', 'Answer: 28 + 19√3'],
    },
    {
      q: 'Simplify √48 + √12 − √27.',
      a: '3*sqrt(3)',
      form: 'radical',
      steps: ['Simplify each: 4√3, 2√3, 3√3.', 'Combine: 4 + 2 − 3 = 3.', 'Answer: 3√3'],
    },
    {
      q: 'What is (√7 + 4)(√7 − 4)?',
      a: '-9',
      steps: ['A sum times a difference: (x + y)(x − y) = x² − y².', '7 − 16 = −9.', 'Answer: −9'],
    },
    {
      q: 'Write (6 + √3)² in the form m + n√3.',
      a: '39+12*sqrt(3)',
      form: 'radical',
      steps: ['(6 + √3)² = 36 + 2 × 6 × √3 + 3.', 'That is 39 + 12√3.', 'Answer: 39 + 12√3'],
    },
    {
      q: 'Write (2√7 + 5)(3√7 + 1) in simplest form.',
      a: '47+17*sqrt(7)',
      form: 'radical',
      steps: ['FOIL: 6·7 + 2√7 + 15√7 + 5.', '42 + 5 = 47 and 2 + 15 = 17.', 'Answer: 47 + 17√7'],
    },
    {
      q: 'Simplify √54 + √150 − √24.',
      a: '6*sqrt(6)',
      form: 'radical',
      steps: ['Simplify each: 3√6, 5√6, 2√6.', 'Combine: 3 + 5 − 2 = 6.', 'Answer: 6√6'],
    },
  ],
  rationalize: [
    {
      q: 'To rationalize 1/√2, multiply top and bottom by √2. What is the new denominator?',
      a: '2',
      steps: ['√2 × √2 = 2.', 'Answer: 2'],
    },
    {
      q: 'What is (5 + √3)(5 − √3)?',
      a: '22',
      steps: ['x² − y² with x = 5 and y = √3.', '25 − 3 = 22.', 'Answer: 22'],
    },
    {
      q: 'To rationalize 1/(5 + √3), you multiply top and bottom by 5 − √3. What is the new denominator?',
      a: '22',
      steps: ['(5 + √3)(5 − √3) = 25 − 3.', 'That is 22.', 'Answer: 22'],
    },
    {
      q: 'To rationalize 1/√3, multiply top and bottom by √3. What is the new denominator?',
      a: '3',
      steps: ['√3 × √3 = 3.', 'Answer: 3'],
    },
    {
      q: 'What is (7 + √2)(7 − √2)?',
      a: '47',
      steps: ['x² − y² with x = 7 and y = √2.', '49 − 2 = 47.', 'Answer: 47'],
    },
    {
      q: 'To rationalize 1/(7 + √2), you multiply top and bottom by 7 − √2. What is the new denominator?',
      a: '47',
      steps: ['(7 + √2)(7 − √2) = 49 − 2.', 'That is 47.', 'Answer: 47'],
    },
    {
      q: 'To rationalize 1/√5, multiply top and bottom by √5. What is the new denominator?',
      a: '5',
      steps: ['√5 × √5 = 5.', 'Answer: 5'],
    },
    {
      q: 'What is (6 + √5)(6 − √5)?',
      a: '31',
      steps: ['x² − y² with x = 6 and y = √5.', '36 − 5 = 31.', 'Answer: 31'],
    },
    {
      q: 'Rationalize the denominator of 4/√2.',
      a: '2*sqrt(2)',
      form: 'radical',
      steps: ['Multiply top and bottom by √2.', '4√2 / 2.', 'Reduce: 2√2.', 'Answer: 2√2'],
    },
    {
      q: 'Rationalize the denominator of √5/√7.',
      a: 'sqrt(35)/7',
      form: 'radical',
      steps: [
        'Multiply top and bottom by √7.',
        '√5 × √7 = √35, and √7 × √7 = 7.',
        'Reduce: √35/7.',
        'Answer: √35/7',
      ],
    },
    {
      q: 'Rationalize the denominator of 4/√3.',
      a: '4*sqrt(3)/3',
      form: 'radical',
      steps: ['Multiply top and bottom by √3.', '4√3 / 3.', 'Reduce: 4√3/3.', 'Answer: 4√3/3'],
    },
    {
      q: 'Rationalize the denominator of √3/√11.',
      a: 'sqrt(33)/11',
      form: 'radical',
      steps: [
        'Multiply top and bottom by √11.',
        '√3 × √11 = √33, and √11 × √11 = 11.',
        'Reduce: √33/11.',
        'Answer: √33/11',
      ],
    },
    {
      q: 'Rationalize the denominator of 4/√5.',
      a: '4*sqrt(5)/5',
      form: 'radical',
      steps: ['Multiply top and bottom by √5.', '4√5 / 5.', 'Reduce: 4√5/5.', 'Answer: 4√5/5'],
    },
    {
      q: 'Rationalize the denominator of √7/√5.',
      a: 'sqrt(35)/5',
      form: 'radical',
      steps: [
        'Multiply top and bottom by √5.',
        '√7 × √5 = √35, and √5 × √5 = 5.',
        'Reduce: √35/5.',
        'Answer: √35/5',
      ],
    },
    {
      q: 'Rationalize the denominator of 4/√6.',
      a: '2*sqrt(6)/3',
      form: 'radical',
      steps: ['Multiply top and bottom by √6.', '4√6 / 6.', 'Reduce: 2√6/3.', 'Answer: 2√6/3'],
    },
    {
      q: 'Rationalize the denominator of √2/√13.',
      a: 'sqrt(26)/13',
      form: 'radical',
      steps: [
        'Multiply top and bottom by √13.',
        '√2 × √13 = √26, and √13 × √13 = 13.',
        'Reduce: √26/13.',
        'Answer: √26/13',
      ],
    },
    {
      q: 'Rationalize the denominator of 4/√7.',
      a: '4*sqrt(7)/7',
      form: 'radical',
      steps: ['Multiply top and bottom by √7.', '4√7 / 7.', 'Reduce: 4√7/7.', 'Answer: 4√7/7'],
    },
    {
      q: 'Rationalize the denominator of 6/(5 + √2).',
      a: '(30-6*sqrt(2))/23',
      form: 'radical',
      steps: [
        'Multiply top and bottom by the conjugate 5 − √2.',
        'Top: 30 − 6√2. Bottom: 25 − 2 = 23.',
        'Reduce: (30 − 6√2)/23.',
        'Answer: (30 − 6√2)/23',
      ],
    },
    {
      q: 'After rationalizing 6/(5 − √2), what is the new denominator?',
      a: '23',
      steps: [
        'Multiply top and bottom by 5 + √2.',
        '(5 − √2)(5 + √2) = 25 − 2 = 23.',
        'Answer: 23',
      ],
    },
    {
      q: 'In 6/(√7 + √3), you multiply top and bottom by √7 − √3. What is the new denominator?',
      a: '4',
      steps: ['(√7 + √3)(√7 − √3) = 7 − 3.', '7 − 3 = 4.', 'Answer: 4'],
    },
    {
      q: 'Rationalize the denominator of 10/(4 + √3).',
      a: '(40-10*sqrt(3))/13',
      form: 'radical',
      steps: [
        'Multiply top and bottom by the conjugate 4 − √3.',
        'Top: 40 − 10√3. Bottom: 16 − 3 = 13.',
        'Reduce: (40 − 10√3)/13.',
        'Answer: (40 − 10√3)/13',
      ],
    },
    {
      q: 'After rationalizing 10/(4 − √3), what is the new denominator?',
      a: '13',
      steps: [
        'Multiply top and bottom by 4 + √3.',
        '(4 − √3)(4 + √3) = 16 − 3 = 13.',
        'Answer: 13',
      ],
    },
    {
      q: 'In 10/(√5 + √2), you multiply top and bottom by √5 − √2. What is the new denominator?',
      a: '3',
      steps: ['(√5 + √2)(√5 − √2) = 5 − 2.', '5 − 2 = 3.', 'Answer: 3'],
    },
    {
      q: 'Rationalize the denominator of 12/(5 + √3).',
      a: '(30-6*sqrt(3))/11',
      form: 'radical',
      steps: [
        'Multiply top and bottom by the conjugate 5 − √3.',
        'Top: 60 − 12√3. Bottom: 25 − 3 = 22.',
        'Reduce: (30 − 6√3)/11.',
        'Answer: (30 − 6√3)/11',
      ],
    },
    {
      q: 'After rationalizing 12/(5 − √3), what is the new denominator?',
      a: '22',
      steps: [
        'Multiply top and bottom by 5 + √3.',
        '(5 − √3)(5 + √3) = 25 − 3 = 22.',
        'Answer: 22',
      ],
    },
  ],
  equations: [
    {
      q: 'Solve √x = 6.',
      a: '36',
      steps: ['Square both sides.', 'x = 6² = 36.', 'Answer: 36'],
    },
    {
      q: 'Solve √(x − 11) = 6.',
      a: '47',
      steps: ['Square both sides: x − 11 = 36.', 'x = 36 + 11 = 47.', 'Answer: 47'],
    },
    {
      q: 'Solve ∛(x − 11) = −4.',
      a: '-53',
      steps: ['Cube both sides: x − 11 = −64.', 'x = −64 + 11 = −53.', 'Answer: −53'],
    },
    {
      q: 'Is x = 92 a solution of √(x − 11) = 9? Type 1 for yes, 0 for no.',
      a: '1',
      steps: [
        'Square both sides: x − 11 should equal 81.',
        'At x = 92 the radicand is 81 = 81, so x = 92 works.',
        'Answer: 1',
      ],
    },
    {
      q: 'Solve √x = 7.',
      a: '49',
      steps: ['Square both sides.', 'x = 7² = 49.', 'Answer: 49'],
    },
    {
      q: 'Solve √(x − 7) = 7.',
      a: '56',
      steps: ['Square both sides: x − 7 = 49.', 'x = 49 + 7 = 56.', 'Answer: 56'],
    },
    {
      q: 'Solve ∛(x − 7) = −3.',
      a: '-20',
      steps: ['Cube both sides: x − 7 = −27.', 'x = −27 + 7 = −20.', 'Answer: −20'],
    },
    {
      q: 'Is x = 129 a solution of √(x − 7) = 11? Type 1 for yes, 0 for no.',
      a: '0',
      steps: [
        'Square both sides: x − 7 should equal 121.',
        'At x = 129 the radicand is 122, not 121, so x = 129 does not work.',
        'Answer: 0',
      ],
    },
    {
      q: 'Solve √(x − 11) + 1 = 6.',
      a: '36',
      steps: [
        'Isolate the radical: √(x − 11) = 5.',
        'Square both sides: x − 11 = 25.',
        'x = 36.',
        'Answer: 36',
      ],
    },
    {
      q: 'How many solutions does √(x + 2) = −6 have?',
      a: '0',
      steps: [
        'A principal square root is never negative.',
        'It cannot equal −6, so there are 0 solutions.',
        'Answer: 0',
      ],
    },
    {
      q: 'Solve √(3x + 2) = √(x + 8).',
      a: '3',
      steps: [
        'Square both sides: 3x + 2 = x + 8.',
        '2x = 6, so x = 3.',
        'Check: both radicals equal √11. ✓',
        'Answer: 3',
      ],
    },
    {
      q: 'Solve √(x − 7) + 2 = 7.',
      a: '32',
      steps: [
        'Isolate the radical: √(x − 7) = 5.',
        'Square both sides: x − 7 = 25.',
        'x = 32.',
        'Answer: 32',
      ],
    },
    {
      q: 'How many solutions does √(x + 4) = −7 have?',
      a: '0',
      steps: [
        'A principal square root is never negative.',
        'It cannot equal −7, so there are 0 solutions.',
        'Answer: 0',
      ],
    },
    {
      q: 'Solve √(5x + 1) = √(2x + 13).',
      a: '4',
      steps: [
        'Square both sides: 5x + 1 = 2x + 13.',
        '3x = 12, so x = 4.',
        'Check: both radicals equal √21. ✓',
        'Answer: 4',
      ],
    },
    {
      q: 'Solve √(2x + 3) = 7.',
      a: '23',
      steps: [
        'Square both sides: 2x + 3 = 49.',
        '2x = 46, so x = 23.',
        'Check: √49 = 7. ✓',
        'Answer: 23',
      ],
    },
    {
      q: 'Solve √(x − 4) + 3 = 8.',
      a: '29',
      steps: [
        'Isolate the radical: √(x − 4) = 5.',
        'Square both sides: x − 4 = 25.',
        'x = 29.',
        'Answer: 29',
      ],
    },
    {
      q: 'How many solutions does √(x + 6) = −8 have?',
      a: '0',
      steps: [
        'A principal square root is never negative.',
        'It cannot equal −8, so there are 0 solutions.',
        'Answer: 0',
      ],
    },
    {
      q: 'Solve √(x + 9) = x − 3. Check for extraneous roots.',
      a: '7',
      steps: [
        'Square both sides: x + 9 = (x − 3)².',
        'Move everything to one side and factor: x(x − 7) = 0.',
        'x = 7 works. x = 0 makes x − 3 = −3, which is negative, so it is extraneous.',
        'Answer: 7',
      ],
    },
    {
      q: 'Squaring √(x + 9) = x − 3 gives two roots. What is the extraneous root?',
      a: '0',
      steps: [
        'Square both sides: x + 9 = (x − 3)², so x(x − 7) = 0.',
        'x = 7 gives x − 3 = 4 ≥ 0, so it works.',
        'x = 0 gives x − 3 = −3 < 0, so it is extraneous.',
        'Answer: 0',
      ],
    },
    {
      q: 'Solve x − √x = 12. Only x ≥ 0 is allowed.',
      a: '16',
      steps: [
        'Let u = √x, so u² − u = 12, which is (u − 4)(u + 3) = 0.',
        'u = 4 works. u = −3 is impossible because √x is not negative.',
        'x = u² = 16.',
        'Answer: 16',
      ],
    },
    {
      q: 'Solve √(x + 8) = x − 4. Check for extraneous roots.',
      a: '8',
      steps: [
        'Square both sides: x + 8 = (x − 4)².',
        'Move everything to one side and factor: (x − 1)(x − 8) = 0.',
        'x = 8 works. x = 1 makes x − 4 = −3, which is negative, so it is extraneous.',
        'Answer: 8',
      ],
    },
    {
      q: 'Squaring √(x + 8) = x − 4 gives two roots. What is the extraneous root?',
      a: '1',
      steps: [
        'Square both sides: x + 8 = (x − 4)², so (x − 1)(x − 8) = 0.',
        'x = 8 gives x − 4 = 4 ≥ 0, so it works.',
        'x = 1 gives x − 4 = −3 < 0, so it is extraneous.',
        'Answer: 1',
      ],
    },
    {
      q: 'Solve x − √x = 20. Only x ≥ 0 is allowed.',
      a: '25',
      steps: [
        'Let u = √x, so u² − u = 20, which is (u − 5)(u + 4) = 0.',
        'u = 5 works. u = −4 is impossible because √x is not negative.',
        'x = u² = 25.',
        'Answer: 25',
      ],
    },
    {
      q: 'Solve √(x + 7) = x − 5. Check for extraneous roots.',
      a: '9',
      steps: [
        'Square both sides: x + 7 = (x − 5)².',
        'Move everything to one side and factor: (x − 2)(x − 9) = 0.',
        'x = 9 works. x = 2 makes x − 5 = −3, which is negative, so it is extraneous.',
        'Answer: 9',
      ],
    },
    {
      q: 'Squaring √(x + 7) = x − 5 gives two roots. What is the extraneous root?',
      a: '2',
      steps: [
        'Square both sides: x + 7 = (x − 5)², so (x − 2)(x − 9) = 0.',
        'x = 9 gives x − 5 = 4 ≥ 0, so it works.',
        'x = 2 gives x − 5 = −3 < 0, so it is extraneous.',
        'Answer: 2',
      ],
    },
  ],
  function: [
    {
      q: 'f(x) = √(x + 7): the graph starts at what x-value?',
      a: '-7',
      steps: [
        'The radicand x + 7 must be at least 0.',
        'So x ≥ −7, and the graph starts at x = −7.',
        'Answer: −7',
      ],
      fig: {
        kind: 'grid',
        x: [-10, 2],
        y: [-2, 5],
        lines: [
          {
            pts: [
              [-7, 0],
              [-6.5, 0.71],
              [-6, 1],
              [-5.5, 1.22],
              [-5, 1.41],
              [-4.5, 1.58],
              [-4, 1.73],
              [-3.5, 1.87],
              [-3, 2],
              [-2.5, 2.12],
              [-2, 2.24],
              [-1.5, 2.35],
              [-1, 2.45],
              [-0.5, 2.55],
              [0, 2.65],
              [0.5, 2.74],
              [1, 2.83],
            ],
            label: 'f',
          },
        ],
        pts: [
          {
            at: [-7, 0],
            label: '(−7, 0)',
          },
        ],
        free: true,
      },
    },
    {
      q: 'f(x) = √(x + 7) − 6: what is f(−7)?',
      a: '-6',
      steps: ['Substitute x = −7: the radicand is 0.', 'f(−7) = 0 + −6 = −6.', 'Answer: −6'],
    },
    {
      q: 'f(x) = √(x + 7) − 6: what is the smallest output value of f?',
      a: '-6',
      steps: [
        'The square root part is never below 0, and it is 0 at x = −7.',
        'So the smallest value is −6.',
        'Answer: −6',
      ],
    },
    {
      q: 'f(x) = √(x + 7): what is f(−3)?',
      a: '2',
      steps: ['x + 7 = −3 + 7 = 4.', '√4 = 2.', 'Answer: 2'],
    },
    {
      q: 'f(x) = √(x + 4): the graph starts at what x-value?',
      a: '-4',
      steps: [
        'The radicand x + 4 must be at least 0.',
        'So x ≥ −4, and the graph starts at x = −4.',
        'Answer: −4',
      ],
      fig: {
        kind: 'grid',
        x: [-7, 5],
        y: [-2, 5],
        lines: [
          {
            pts: [
              [-4, 0],
              [-3.5, 0.71],
              [-3, 1],
              [-2.5, 1.22],
              [-2, 1.41],
              [-1.5, 1.58],
              [-1, 1.73],
              [-0.5, 1.87],
              [0, 2],
              [0.5, 2.12],
              [1, 2.24],
              [1.5, 2.35],
              [2, 2.45],
              [2.5, 2.55],
              [3, 2.65],
              [3.5, 2.74],
              [4, 2.83],
            ],
            label: 'f',
          },
        ],
        pts: [
          {
            at: [-4, 0],
            label: '(−4, 0)',
          },
        ],
        free: true,
      },
    },
    {
      q: 'f(x) = √(x + 4) − 4: what is f(−4)?',
      a: '-4',
      steps: ['Substitute x = −4: the radicand is 0.', 'f(−4) = 0 + −4 = −4.', 'Answer: −4'],
    },
    {
      q: 'f(x) = √(x + 4) − 4: what is the smallest output value of f?',
      a: '-4',
      steps: [
        'The square root part is never below 0, and it is 0 at x = −4.',
        'So the smallest value is −4.',
        'Answer: −4',
      ],
    },
    {
      q: 'f(x) = √(x + 4): what is f(5)?',
      a: '3',
      steps: ['x + 4 = 5 + 4 = 9.', '√9 = 3.', 'Answer: 3'],
    },
    {
      q: 'The graph of f(x) = √(x + 7) − 6 starts at the point (h, k). What is h + k?',
      a: '-13',
      steps: [
        'The graph starts where the radicand is 0: x = −7, and there y = −6.',
        '−7 + −6 = −13.',
        'Answer: −13',
      ],
      fig: {
        kind: 'grid',
        x: [-10, 2],
        y: [-8, -1],
        lines: [
          {
            pts: [
              [-7, -6],
              [-6.5, -5.29],
              [-6, -5],
              [-5.5, -4.78],
              [-5, -4.59],
              [-4.5, -4.42],
              [-4, -4.27],
              [-3.5, -4.13],
              [-3, -4],
              [-2.5, -3.88],
              [-2, -3.76],
              [-1.5, -3.65],
              [-1, -3.55],
              [-0.5, -3.45],
              [0, -3.35],
              [0.5, -3.26],
              [1, -3.17],
            ],
            label: 'f',
          },
        ],
        pts: [
          {
            at: [-7, -6],
            label: '(−7, −6)',
          },
        ],
        free: true,
      },
    },
    {
      q: 'f(x) = √(x + 7) − 6: what is f(2)?',
      a: '-3',
      steps: ['The radicand is 2 + 7 = 9, so the root is 3.', 'f = 3 − 6 = −3.', 'Answer: −3'],
    },
    {
      q: 'What is the smallest x for which √(2x + 6) is a real number? Write a fraction if needed.',
      a: '-3',
      steps: ['Need 2x + 6 ≥ 0.', '2x ≥ −6, so x ≥ −3.', 'Answer: −3'],
    },
    {
      q: 'What is the largest x for which √(6 − x) is a real number? Write a fraction if needed.',
      a: '6',
      steps: ['Need 6 − x ≥ 0.', 'x ≤ 6, so x ≤ 6.', 'Answer: 6'],
    },
    {
      q: 'The graph of f(x) = √(x + 4) − 4 starts at the point (h, k). What is h + k?',
      a: '-8',
      steps: [
        'The graph starts where the radicand is 0: x = −4, and there y = −4.',
        '−4 + −4 = −8.',
        'Answer: −8',
      ],
      fig: {
        kind: 'grid',
        x: [-7, 5],
        y: [-6, 1],
        lines: [
          {
            pts: [
              [-4, -4],
              [-3.5, -3.29],
              [-3, -3],
              [-2.5, -2.78],
              [-2, -2.59],
              [-1.5, -2.42],
              [-1, -2.27],
              [-0.5, -2.13],
              [0, -2],
              [0.5, -1.88],
              [1, -1.76],
              [1.5, -1.65],
              [2, -1.55],
              [2.5, -1.45],
              [3, -1.35],
              [3.5, -1.26],
              [4, -1.17],
            ],
            label: 'f',
          },
        ],
        pts: [
          {
            at: [-4, -4],
            label: '(−4, −4)',
          },
        ],
        free: true,
      },
    },
    {
      q: 'f(x) = √(x + 4) − 4: what is f(0)?',
      a: '-2',
      steps: ['The radicand is 0 + 4 = 4, so the root is 2.', 'f = 2 − 4 = −2.', 'Answer: −2'],
    },
    {
      q: 'What is the smallest x for which √(3x + 5) is a real number? Write a fraction if needed.',
      a: '-5/3',
      form: 'fraction',
      steps: ['Need 3x + 5 ≥ 0.', '3x ≥ −5, so x ≥ −5/3.', 'Answer: −5/3'],
    },
    {
      q: 'What is the largest x for which √(8 − 2x) is a real number? Write a fraction if needed.',
      a: '4',
      steps: ['Need 8 − 2x ≥ 0.', '2x ≤ 8, so x ≤ 4.', 'Answer: 4'],
    },
    {
      q: 'The graph of f(x) = √(x − 5) + 3 starts at the point (h, k). What is h + k?',
      a: '8',
      steps: [
        'The graph starts where the radicand is 0: x = 5, and there y = 3.',
        '5 + 3 = 8.',
        'Answer: 8',
      ],
      fig: {
        kind: 'grid',
        x: [2, 14],
        y: [1, 8],
        lines: [
          {
            pts: [
              [5, 3],
              [5.5, 3.71],
              [6, 4],
              [6.5, 4.22],
              [7, 4.41],
              [7.5, 4.58],
              [8, 4.73],
              [8.5, 4.87],
              [9, 5],
              [9.5, 5.12],
              [10, 5.24],
              [10.5, 5.35],
              [11, 5.45],
              [11.5, 5.55],
              [12, 5.65],
              [12.5, 5.74],
              [13, 5.83],
            ],
            label: 'f',
          },
        ],
        pts: [
          {
            at: [5, 3],
            label: '(5, 3)',
          },
        ],
        free: true,
      },
    },
    {
      q: 'f(x) = −√(x + 7): what is the largest output value of f?',
      a: '0',
      steps: [
        'The root is never below 0, so −√ is never above 0.',
        'It equals 0 at x = −7, so the largest value is 0.',
        'Answer: 0',
      ],
    },
    {
      q: 'f(x) = √(x + 7) − 6: f(t) = −4. What is t?',
      a: '-3',
      steps: [
        'Isolate the root: √(t + 7) = 2.',
        'Square both sides: t + 7 = 4.',
        't = −3.',
        'Answer: −3',
      ],
    },
    {
      q: 'How many whole numbers x from −10 to 20 give a whole-number output for f(x) = √(x + 7)?',
      a: '6',
      steps: [
        'The radicand must be at least 0 and a perfect square.',
        'x + 7 is a perfect square for 6 whole numbers in that range.',
        'Answer: 6',
      ],
    },
    {
      q: 'f(x) = 2√(x + 7) − 6: what is f(−6)?',
      a: '-4',
      steps: ['The radicand is 1, so the root is 1.', 'f = 2 × 1 − 6 = −4.', 'Answer: −4'],
    },
    {
      q: 'f(x) = −√(x + 4): what is the largest output value of f?',
      a: '0',
      steps: [
        'The root is never below 0, so −√ is never above 0.',
        'It equals 0 at x = −4, so the largest value is 0.',
        'Answer: 0',
      ],
    },
    {
      q: 'f(x) = √(x + 4) − 4: f(t) = −1. What is t?',
      a: '5',
      steps: [
        'Isolate the root: √(t + 4) = 3.',
        'Square both sides: t + 4 = 9.',
        't = 5.',
        'Answer: 5',
      ],
    },
    {
      q: 'How many whole numbers x from −10 to 20 give a whole-number output for f(x) = √(x + 4)?',
      a: '5',
      steps: [
        'The radicand must be at least 0 and a perfect square.',
        'x + 4 is a perfect square for 5 whole numbers in that range.',
        'Answer: 5',
      ],
    },
    {
      q: 'f(x) = 3√(x + 4) − 4: what is f(0)?',
      a: '2',
      steps: ['The radicand is 4, so the root is 2.', 'f = 3 × 2 − 4 = 2.', 'Answer: 2'],
    },
  ],
  imaginary: [
    {
      q: 'What is i²?',
      a: '-1',
      steps: ['By definition i = √(−1), so i² = −1.', 'Answer: −1'],
    },
    {
      q: '√(−36) = c·i. What is c?',
      a: '6',
      steps: ['√(−36) = √36 × √(−1) = 6 × i.', 'So c = 6.', 'Answer: 6'],
    },
    {
      q: 'What is the real part of 5 + 7i?',
      a: '5',
      steps: ['In a + bi the real part is a.', 'Answer: 5'],
    },
    {
      q: 'What is the imaginary part (the number multiplying i) of 5 + 7i?',
      a: '7',
      steps: ['In a + bi the imaginary part is b.', 'Answer: 7'],
    },
    {
      q: 'What is i⁴?',
      a: '1',
      steps: ['i⁴ = (i²)² = (−1)² = 1.', 'Answer: 1'],
    },
    {
      q: '√(−49) = c·i. What is c?',
      a: '7',
      steps: ['√(−49) = √49 × √(−1) = 7 × i.', 'So c = 7.', 'Answer: 7'],
    },
    {
      q: 'What is the real part of −3 + 11i?',
      a: '-3',
      steps: ['In a + bi the real part is a.', 'Answer: −3'],
    },
    {
      q: 'What is the imaginary part (the number multiplying i) of −3 + 11i?',
      a: '11',
      steps: ['In a + bi the imaginary part is b.', 'Answer: 11'],
    },
    {
      q: 'i^13 = c·i. What is c?',
      a: '1',
      steps: [
        'The powers of i repeat every 4: i, −1, −i, 1.',
        '13 ÷ 4 leaves remainder 1, so i^13 = i.',
        'Answer: 1',
      ],
    },
    {
      q: 'What is the remainder when 101 is divided by 4? (It decides i^101.)',
      a: '1',
      steps: ['101 = 4 × 25 + 1.', 'Answer: 1'],
    },
    {
      q: '√(−72) = c·i·√r in simplest form. What is c?',
      a: '6',
      steps: ['√(−72) = i × √72 and 72 = 36 × 2.', 'So it is 6√2·i, and c = 6.', 'Answer: 6'],
    },
    {
      q: 'What is the real part of (3 + 5i) + (4 − 2i)?',
      a: '7',
      steps: ['Add the real parts: 3 + 4 = 7.', 'Answer: 7'],
    },
    {
      q: 'What is i^22?',
      a: '-1',
      steps: [
        'The powers of i repeat every 4: i, −1, −i, 1.',
        '22 ÷ 4 leaves remainder 2, so i^22 = −1.',
        'Answer: −1',
      ],
    },
    {
      q: 'What is the remainder when 154 is divided by 4? (It decides i^154.)',
      a: '2',
      steps: ['154 = 4 × 38 + 2.', 'Answer: 2'],
    },
    {
      q: '√(−147) = c·i·√r in simplest form. What is c?',
      a: '7',
      steps: ['√(−147) = i × √147 and 147 = 49 × 3.', 'So it is 7√3·i, and c = 7.', 'Answer: 7'],
    },
    {
      q: 'What is the imaginary part of (3 + 5i) + (4 − 2i)?',
      a: '3',
      steps: ['Add the imaginary parts: 5 + −2 = 3.', 'Answer: 3'],
    },
    {
      q: 'i^35 = c·i. What is c?',
      a: '-1',
      steps: [
        'The powers of i repeat every 4: i, −1, −i, 1.',
        '35 ÷ 4 leaves remainder 3, so i^35 = −i.',
        'Answer: −1',
      ],
    },
    {
      q: 'What is the real part of (3 + 2i)(4 − 5i)?',
      a: '22',
      steps: [
        'FOIL: 3·4 + 3·−5i + 2i·4 + 2i·−5i.',
        'The i² term is −1 times −10. Real part: 12 − (−10) = 22.',
        'Answer: 22',
      ],
    },
    {
      q: 'What is (5 + 7i)(5 − 7i)?',
      a: '74',
      steps: ['A conjugate pair: (a + bi)(a − bi) = a² + b².', '25 + 49 = 74.', 'Answer: 74'],
    },
    {
      q: 'What is the discriminant b² − 4ac of x² + 4x + 13 = 0?',
      a: '-36',
      steps: ['a = 1, b = 4, c = 13.', '16 − 52 = −36.', 'Answer: −36'],
    },
    {
      q: 'What is the imaginary part of (3 + 2i)(4 − 5i)?',
      a: '-7',
      steps: ['The i terms are 3·−5 and 2·4.', '−15 + 8 = −7.', 'Answer: −7'],
    },
    {
      q: 'What is (6 + 8i)(6 − 8i)?',
      a: '100',
      steps: ['A conjugate pair: (a + bi)(a − bi) = a² + b².', '36 + 64 = 100.', 'Answer: 100'],
    },
    {
      q: 'The solutions of x² + 4x + 13 = 0 are x = p ± q·i. What is p?',
      a: '-2',
      steps: [
        'Use x = (−b ± √(b² − 4ac)) / (2a) with discriminant −36.',
        'The real part is −b/(2a) = −2.',
        'Answer: −2',
      ],
    },
    {
      q: 'What is the real part of (2 − 3i)(5 + i)?',
      a: '13',
      steps: [
        'FOIL: 2·5 + 2·1i + −3i·5 + −3i·1i.',
        'The i² term is −1 times −3. Real part: 10 − (−3) = 13.',
        'Answer: 13',
      ],
    },
    {
      q: 'What is (9 + 4i)(9 − 4i)?',
      a: '97',
      steps: ['A conjugate pair: (a + bi)(a − bi) = a² + b².', '81 + 16 = 97.', 'Answer: 97'],
    },
  ],
  uses: [
    {
      q: 'A right triangle has legs 6 and 8. What is the hypotenuse?',
      a: '10',
      steps: ['c = √(a² + b²) = √(36 + 64).', '√100 = 10.', 'Answer: 10'],
      fig: {
        kind: 'poly',
        pts: [
          [0, 0],
          [6, 0],
          [0, 8],
        ],
        s: ['6', '?', '8'],
        right: [0],
      },
    },
    {
      q: 'A right triangle has hypotenuse 10 and one leg 6. What is the other leg?',
      a: '8',
      steps: ['b = √(c² − a²) = √(100 − 36).', '√64 = 8.', 'Answer: 8'],
    },
    {
      q: 'A square has area 49 square units. What is its side length?',
      a: '7',
      steps: ['side = √area = √49.', 'That is 7.', 'Answer: 7'],
    },
    {
      q: 'Free fall: t = √(2h/g). With g = 10 m/s², how many seconds does it take to fall 20 m?',
      a: '2',
      steps: ['t = √(2 × 20 / 10) = √4.', '√4 = 2.', 'Answer: 2'],
    },
    {
      q: 'A right triangle has legs 9 and 12. What is the hypotenuse?',
      a: '15',
      steps: ['c = √(a² + b²) = √(81 + 144).', '√225 = 15.', 'Answer: 15'],
      fig: {
        kind: 'poly',
        pts: [
          [0, 0],
          [9, 0],
          [0, 12],
        ],
        s: ['9', '?', '12'],
        right: [0],
      },
    },
    {
      q: 'A right triangle has hypotenuse 15 and one leg 9. What is the other leg?',
      a: '12',
      steps: ['b = √(c² − a²) = √(225 − 81).', '√144 = 12.', 'Answer: 12'],
    },
    {
      q: 'A square has area 81 square units. What is its side length?',
      a: '9',
      steps: ['side = √area = √81.', 'That is 9.', 'Answer: 9'],
    },
    {
      q: 'Free fall: t = √(2h/g). With g = 10 m/s², how many seconds does it take to fall 45 m?',
      a: '3',
      steps: ['t = √(2 × 45 / 10) = √9.', '√9 = 3.', 'Answer: 3'],
    },
    {
      q: 'A right triangle has legs 1 and 7. Write the hypotenuse in simplest radical form.',
      a: '5*sqrt(2)',
      form: 'radical',
      steps: ['c = √(1 + 49) = √50.', '50 = 25 × 2, so c = 5√2.', 'Answer: 5√2'],
      fig: {
        kind: 'poly',
        pts: [
          [0, 0],
          [1, 0],
          [0, 7],
        ],
        s: ['1', '?', '7'],
        right: [0],
      },
    },
    {
      q: 'What is the distance between (−3, −2) and (3, 6)? Simplest radical form if needed.',
      a: '10',
      steps: ['Δx = 6, Δy = 8.', 'd = √(36 + 64) = √100.', 'That is 10.', 'Answer: 10'],
    },
    {
      q: 'What is the diagonal of a square with side 7? Simplest radical form.',
      a: '7*sqrt(2)',
      form: 'radical',
      steps: ['d = √(7² + 7²) = √98.', '98 = 49 × 2, so d = 7√2.', 'Answer: 7√2'],
    },
    {
      q: 'A square has area 30. What is its side length in simplest radical form?',
      a: 'sqrt(30)',
      form: 'radical',
      steps: ['side = √30.', '30 = 1 × 30, so side = √30.', 'Answer: √30'],
    },
    {
      q: 'A right triangle has legs 2 and 6. Write the hypotenuse in simplest radical form.',
      a: '2*sqrt(10)',
      form: 'radical',
      steps: ['c = √(4 + 36) = √40.', '40 = 4 × 10, so c = 2√10.', 'Answer: 2√10'],
      fig: {
        kind: 'poly',
        pts: [
          [0, 0],
          [2, 0],
          [0, 6],
        ],
        s: ['2', '?', '6'],
        right: [0],
      },
    },
    {
      q: 'What is the distance between (1, −4) and (4, −2)? Simplest radical form if needed.',
      a: 'sqrt(13)',
      form: 'radical',
      steps: ['Δx = 3, Δy = 2.', 'd = √(9 + 4) = √13.', '13 = 1 × 13, so d = √13.', 'Answer: √13'],
    },
    {
      q: 'What is the diagonal of a square with side 9? Simplest radical form.',
      a: '9*sqrt(2)',
      form: 'radical',
      steps: ['d = √(9² + 9²) = √162.', '162 = 81 × 2, so d = 9√2.', 'Answer: 9√2'],
    },
    {
      q: 'A square has area 50. What is its side length in simplest radical form?',
      a: '5*sqrt(2)',
      form: 'radical',
      steps: ['side = √50.', '50 = 25 × 2, so side = 5√2.', 'Answer: 5√2'],
    },
    {
      q: 'A right triangle has legs 3 and 9. Write the hypotenuse in simplest radical form.',
      a: '3*sqrt(10)',
      form: 'radical',
      steps: ['c = √(9 + 81) = √90.', '90 = 9 × 10, so c = 3√10.', 'Answer: 3√10'],
      fig: {
        kind: 'poly',
        pts: [
          [0, 0],
          [3, 0],
          [0, 9],
        ],
        s: ['3', '?', '9'],
        right: [0],
      },
    },
    {
      q: 'For the data 2, 6, 10, what is the sample variance? (Sum of squared deviations ÷ (n − 1).)',
      a: '16',
      steps: ['The mean is 6.', 'The squared deviations add to 32.', '32 ÷ 2 = 16.', 'Answer: 16'],
    },
    {
      q: 'What is the sample standard deviation of 2, 6, 10? Simplest radical form if needed.',
      a: '4',
      steps: [
        'The mean is 6, and the squared deviations add to 32.',
        'Variance = 32 ÷ 2 = 16.',
        's = √16 = 4.',
        'Answer: 4',
      ],
    },
    {
      q: 'Free fall: t = √(2h/g), g = 10 m/s². How many seconds to fall 30 m? Simplest radical form if needed.',
      a: 'sqrt(6)',
      form: 'radical',
      steps: ['t = √(2 × 30 / 10) = √6.', '6 = 1 × 6, so t = √6.', 'Answer: √6'],
    },
    {
      q: 'A 26-foot ladder leans on a wall with its foot 10 feet from the wall. How high does it reach?',
      a: '24',
      steps: ['The ladder is the hypotenuse: h = √(676 − 100).', '√576 = 24.', 'Answer: 24'],
      fig: {
        kind: 'poly',
        pts: [
          [0, 0],
          [10, 0],
          [0, 24],
        ],
        s: ['10', '26', '?'],
        right: [0],
      },
    },
    {
      q: 'For the data 1, 3, 5, 7, 9, what is the sample variance? (Sum of squared deviations ÷ (n − 1).)',
      a: '10',
      steps: ['The mean is 5.', 'The squared deviations add to 40.', '40 ÷ 4 = 10.', 'Answer: 10'],
    },
    {
      q: 'What is the sample standard deviation of 1, 3, 5, 7, 9? Simplest radical form if needed.',
      a: 'sqrt(10)',
      form: 'radical',
      steps: [
        'The mean is 5, and the squared deviations add to 40.',
        'Variance = 40 ÷ 4 = 10.',
        's = √10 = √10.',
        'Answer: √10',
      ],
    },
    {
      q: 'Free fall: t = √(2h/g), g = 10 m/s². How many seconds to fall 70 m? Simplest radical form if needed.',
      a: 'sqrt(14)',
      form: 'radical',
      steps: ['t = √(2 × 70 / 10) = √14.', '14 = 1 × 14, so t = √14.', 'Answer: √14'],
    },
    {
      q: 'A 25-foot ladder leans on a wall with its foot 7 feet from the wall. How high does it reach?',
      a: '24',
      steps: ['The ladder is the hypotenuse: h = √(625 − 49).', '√576 = 24.', 'Answer: 24'],
      fig: {
        kind: 'poly',
        pts: [
          [0, 0],
          [7, 0],
          [0, 24],
        ],
        s: ['7', '25', '?'],
        right: [0],
      },
    },
  ],
};
