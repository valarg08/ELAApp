import type { GuideProblem } from './guide-problem';

/** 25 problems per Powers chapter, simple to complex: 1–8 warm-up, 9–17 core, 18–25 challenge. Generated from small templates, so every answer is computed. */
export const POWERS_PROBLEMS: Record<string, GuideProblem[]> = {
  powers: [
    {
      q: 'What is 6⁵?',
      a: '7776',
      steps: ['6⁵ means 5 factors of 6: 6 × 6 × 6 × 6 × 6.', 'That equals 7776.', 'Answer: 7776'],
    },
    {
      q: 'In the power 7², what is the base?',
      a: '7',
      steps: ['The base is the number being multiplied by itself.', 'Answer: 7'],
    },
    {
      q: 'What is 4 × 4 × 4 × 4?',
      a: '256',
      steps: ['Multiply the 4 factors of 4 one at a time.', '4 × 4 × 4 × 4 = 256.', 'Answer: 256'],
    },
    {
      q: 'What is 6⁴?',
      a: '1296',
      steps: ['6⁴ means 4 factors of 6: 6 × 6 × 6 × 6.', 'That equals 1296.', 'Answer: 1296'],
    },
    {
      q: 'How many factors of 6 are multiplied together in 6⁶?',
      a: '6',
      steps: ['The exponent 6 tells how many factors of the base 6 there are.', 'Answer: 6'],
    },
    {
      q: 'What is 12 × 12 × 12 × 12 × 12?',
      a: '248832',
      steps: [
        'Multiply the 5 factors of 12 one at a time.',
        '12 × 12 × 12 × 12 × 12 = 248832.',
        'Answer: 248832',
      ],
    },
    {
      q: 'What is 3³?',
      a: '27',
      steps: ['3³ means 3 factors of 3: 3 × 3 × 3.', 'That equals 27.', 'Answer: 27'],
    },
    {
      q: 'How many factors of 3 are multiplied together in 3⁹?',
      a: '9',
      steps: ['The exponent 9 tells how many factors of the base 3 there are.', 'Answer: 9'],
    },
    {
      q: 'What is 11³ − 6⁴?',
      a: '35',
      steps: ['11³ = 1331 and 6⁴ = 1296.', '1331 − 1296 = 35.', 'Answer: 35'],
    },
    {
      q: 'What is 8 × 9⁴?',
      a: '52488',
      steps: ['Powers come before multiplying: 9⁴ = 6561.', '8 × 6561 = 52488.', 'Answer: 52488'],
    },
    {
      q: 'What positive whole number b makes b² = 36?',
      a: '6',
      steps: [
        'Find the number that, used as a factor 2 times, gives 36.',
        '6 × 6 = 36, so b = 6.',
        'Answer: 6',
      ],
    },
    {
      q: 'What exponent n makes 3ⁿ = 9?',
      a: '2',
      steps: [
        'Multiply 3 by itself until you reach 9.',
        'It takes 2 factors: 3² = 9.',
        'Answer: 2',
      ],
    },
    {
      q: 'What is 9⁴ + 4²?',
      a: '6577',
      steps: ['9⁴ = 6561 and 4² = 16.', '6561 + 16 = 6577.', 'Answer: 6577'],
    },
    {
      q: 'What is 6 × 3³?',
      a: '162',
      steps: ['Powers come before multiplying: 3³ = 27.', '6 × 27 = 162.', 'Answer: 162'],
    },
    {
      q: 'What positive whole number b makes b² = 64?',
      a: '8',
      steps: [
        'Find the number that, used as a factor 2 times, gives 64.',
        '8 × 8 = 64, so b = 8.',
        'Answer: 8',
      ],
    },
    {
      q: 'What exponent n makes 6ⁿ = 1,296?',
      a: '4',
      steps: [
        'Multiply 6 by itself until you reach 1,296.',
        'It takes 4 factors: 6⁴ = 1,296.',
        'Answer: 4',
      ],
    },
    {
      q: 'What is 4² + 2⁵?',
      a: '48',
      steps: ['4² = 16 and 2⁵ = 32.', '16 + 32 = 48.', 'Answer: 48'],
    },
    {
      q: 'What is the last digit of 5¹³?',
      a: '5',
      steps: [
        'The last digits of 5, 5², 5³, … repeat every 1 powers: 5.',
        '13 is position 1 in the repeating list, so the last digit is 5.',
        'Answer: 5',
      ],
    },
    {
      q: 'One number is 4⁶ and the other is 12⁴. How much larger is the bigger number?',
      a: '16640',
      steps: ['4⁶ = 4096 and 12⁴ = 20736.', '20736 − 4096 = 16640.', 'Answer: 16640'],
    },
    {
      q: 'How many zeros are in the number 10⁴?',
      a: '4',
      steps: ['10⁴ = 1 followed by 4 zeros: 10,000.', 'Answer: 4'],
    },
    {
      q: 'What is (6 × 6)³?',
      a: '46656',
      steps: ['Brackets first: 6 × 6 = 36.', '36³ = 46656.', 'Answer: 46656'],
    },
    {
      q: 'What is the last digit of 7¹²?',
      a: '1',
      steps: [
        'The last digits of 7, 7², 7³, … repeat every 4 powers: 7, 9, 3, 1.',
        '12 is position 4 in the repeating list, so the last digit is 1.',
        'Answer: 1',
      ],
    },
    {
      q: 'One number is 9³ and the other is 2². How much larger is the bigger number?',
      a: '725',
      steps: ['9³ = 729 and 2² = 4.', '729 − 4 = 725.', 'Answer: 725'],
    },
    {
      q: 'How many zeros are in the number 10⁵?',
      a: '5',
      steps: ['10⁵ = 1 followed by 5 zeros: 100,000.', 'Answer: 5'],
    },
    {
      q: 'What is (5 × 5)²?',
      a: '625',
      steps: ['Brackets first: 5 × 5 = 25.', '25² = 625.', 'Answer: 625'],
    },
  ],
  negzero: [
    {
      q: 'What is (−6)⁰?',
      a: '1',
      steps: [
        'The bracket makes the base −6, and a base that is not 0 to the power 0 is 1.',
        'Answer: 1',
      ],
    },
    {
      q: 'What is 9⁻¹? Write it as a fraction.',
      a: '1/9',
      form: 'fraction',
      steps: [
        'A negative exponent means the reciprocal: 9⁻¹ = 1/9¹.',
        '9¹ = 9, so the value is 1/9.',
        'Answer: 1/9',
      ],
    },
    {
      q: 'Write 10⁻³ as a decimal.',
      a: '0.001',
      form: 'decimal',
      steps: ['10⁻³ = 1/1,000.', 'As a decimal, 1/1,000 = 0.001.', 'Answer: 0.001'],
    },
    {
      q: 'Is 0⁰ defined? Type 1 for yes, 0 for no.',
      a: '0',
      steps: ['0⁰ is not defined. It is not 0 and not 1.', 'Answer: 0'],
    },
    {
      q: 'What is 100⁰?',
      a: '1',
      steps: ['Any number except 0 raised to the power 0 is 1.', 'Answer: 1'],
    },
    {
      q: 'What is 5⁻²? Write it as a fraction.',
      a: '1/25',
      form: 'fraction',
      steps: [
        'A negative exponent means the reciprocal: 5⁻² = 1/5².',
        '5² = 25, so the value is 1/25.',
        'Answer: 1/25',
      ],
    },
    {
      q: 'Write 10⁻⁶ as a decimal.',
      a: '0.000001',
      form: 'decimal',
      steps: ['10⁻⁶ = 1/1,000,000.', 'As a decimal, 1/1,000,000 = 0.000001.', 'Answer: 0.000001'],
    },
    {
      q: 'What is 25⁰?',
      a: '1',
      steps: ['Any number except 0 raised to the power 0 is 1.', 'Answer: 1'],
    },
    {
      q: '10³ = 1000, 10² = 100, 10¹ = 10, 10⁰ = 1. Each step down divides by 10. Following the pattern, what is 10⁻³? Write it as a fraction.',
      a: '1/1000',
      form: 'fraction',
      steps: [
        'Dividing by 10 each step, 1 becomes 1/10, then 1/100, and so on.',
        '10⁻³ = 1/1000.',
        'Answer: 1/1000',
      ],
    },
    {
      q: '1/81 = 9ᵏ. What is k?',
      a: '-2',
      steps: [
        '1/81 is the reciprocal of 9².',
        'The reciprocal of 9² is 9⁻², so k = −2.',
        'Answer: −2',
      ],
    },
    {
      q: 'What is (−2)⁻¹? Write it as a fraction.',
      a: '-1/2',
      form: 'fraction',
      steps: ['(−2)⁻¹ = 1/(−2)¹.', '(−2)¹ = −2, so the value is −1/2.', 'Answer: −1/2'],
    },
    {
      q: 'Write 5 × 10⁻² as a decimal.',
      a: '0.05',
      form: 'decimal',
      steps: ['10⁻² = 1/100 = 0.01.', '5 × 0.01 = 0.05.', 'Answer: 0.05'],
    },
    {
      q: '6³ = 216, 6² = 36, 6¹ = 6, 6⁰ = 1. Each step down divides by 6. Following the pattern, what is 6⁻¹? Write it as a fraction.',
      a: '1/6',
      form: 'fraction',
      steps: [
        'Dividing by 6 each step, 1 becomes 1/6, then 1/36, and so on.',
        '6⁻¹ = 1/6.',
        'Answer: 1/6',
      ],
    },
    {
      q: '1/9 = 9ᵏ. What is k?',
      a: '-1',
      steps: [
        '1/9 is the reciprocal of 9¹.',
        'The reciprocal of 9¹ is 9⁻¹, so k = −1.',
        'Answer: −1',
      ],
    },
    {
      q: 'What is (−6)⁻²? Write it as a fraction.',
      a: '1/36',
      form: 'fraction',
      steps: ['(−6)⁻² = 1/(−6)².', '(−6)² = 36, so the value is 1/36.', 'Answer: 1/36'],
    },
    {
      q: 'Write 4 × 10⁻³ as a decimal.',
      a: '0.004',
      form: 'decimal',
      steps: ['10⁻³ = 1/1,000 = 0.001.', '4 × 0.001 = 0.004.', 'Answer: 0.004'],
    },
    {
      q: 'What is 3⁰ + 5⁻²? Write it as a fraction.',
      a: '26/25',
      form: 'fraction',
      steps: ['3⁰ = 1 and 5⁻² = 1/25.', '1 + 1/25 = 26/25.', 'Answer: 26/25'],
    },
    {
      q: 'What is (5/6)⁻³? Write it as a fraction.',
      a: '216/125',
      form: 'fraction',
      steps: [
        'A negative exponent flips the fraction: (5/6)⁻³ = (6/5)³.',
        '(6/5)³ = 216/125.',
        'Answer: 216/125',
      ],
    },
    {
      q: 'What is 7³ ÷ 7⁴? Write it as a fraction.',
      a: '1/7',
      form: 'fraction',
      steps: ['7³ = 343 and 7⁴ = 2401.', '343/2401 = 1/7.', 'Answer: 1/7'],
    },
    {
      q: 'What is 6³ × 6⁻²?',
      a: '6',
      steps: ['6³ = 216 and 6⁻² = 1/36.', '216 ÷ 36 = 6.', 'Answer: 6'],
    },
    {
      q: 'What is the sum of 16 copies of 4⁻²?',
      a: '1',
      steps: ['4⁻² = 1/16.', '16 copies of 1/16 add up to 1.', 'Answer: 1'],
    },
    {
      q: 'What is 5 × 4⁻²? Write it as a fraction.',
      a: '5/16',
      form: 'fraction',
      steps: ['4⁻² = 1/16.', '5 × 1/16 = 5/16.', 'Answer: 5/16'],
    },
    {
      q: 'What is (4/3)⁻²? Write it as a fraction.',
      a: '9/16',
      form: 'fraction',
      steps: [
        'A negative exponent flips the fraction: (4/3)⁻² = (3/4)².',
        '(3/4)² = 9/16.',
        'Answer: 9/16',
      ],
    },
    {
      q: 'What is 6¹ ÷ 6³? Write it as a fraction.',
      a: '1/36',
      form: 'fraction',
      steps: ['6¹ = 6 and 6³ = 216.', '6/216 = 1/36.', 'Answer: 1/36'],
    },
    {
      q: 'What is 6⁵ × 6⁻²?',
      a: '216',
      steps: ['6⁵ = 7776 and 6⁻² = 1/36.', '7776 ÷ 36 = 216.', 'Answer: 216'],
    },
  ],
  writing: [
    {
      q: 'Write 7 × 7 as a power 7ⁿ. What is n?',
      a: '2',
      steps: ['Count the factors of 7: there are 2.', '7 × 7 = 7², so n = 2.', 'Answer: 2'],
    },
    {
      q: 'Write w × w × w × w × w × w × w × w as a power wᵏ. What is k?',
      a: '8',
      steps: [
        'Count the factors of w: there are 8.',
        'w × w × w × w × w × w × w × w = w⁸, so k = 8.',
        'Answer: 8',
      ],
    },
    {
      q: 'How many multiplication signs are in the expanded form of 9³?',
      a: '2',
      steps: [
        '9³ = 9 × 9 × 9.',
        '3 factors have 2 multiplication signs between them.',
        'Answer: 2',
      ],
    },
    {
      q: 'What is 3 × 3 × 3?',
      a: '27',
      steps: ['Multiply the factors in order.', '3 × 3 × 3 = 27.', 'Answer: 27'],
    },
    {
      q: 'Write 9 × 9 × 9 × 9 as a power 9ⁿ. What is n?',
      a: '4',
      steps: ['Count the factors of 9: there are 4.', '9 × 9 × 9 × 9 = 9⁴, so n = 4.', 'Answer: 4'],
    },
    {
      q: 'Write r × r × r as a power rᵏ. What is k?',
      a: '3',
      steps: ['Count the factors of r: there are 3.', 'r × r × r = r³, so k = 3.', 'Answer: 3'],
    },
    {
      q: 'How many multiplication signs are in the expanded form of 6⁵?',
      a: '4',
      steps: [
        '6⁵ = 6 × 6 × 6 × 6 × 6.',
        '5 factors have 4 multiplication signs between them.',
        'Answer: 4',
      ],
    },
    {
      q: 'What is 11 × 11?',
      a: '121',
      steps: ['Multiply the factors in order.', '11 × 11 = 121.', 'Answer: 121'],
    },
    {
      q: 'What is (1/4)³? Write it as a fraction.',
      a: '1/64',
      form: 'fraction',
      steps: [
        '3 factors of 1/4: multiply the tops and multiply the bottoms.',
        '1³/4³ = 1/64.',
        'Answer: 1/64',
      ],
    },
    {
      q: 'What is 1.5³? Write it as a decimal.',
      a: '3.375',
      form: 'decimal',
      steps: [
        '1.5³ = 1.5 × 1.5 × 1.5.',
        'Multiply the digits (15 × 15 × 15 = 3375), then place the decimal point 3 places from the right: 3.375.',
        'Answer: 3.375',
      ],
    },
    {
      q: 'What is 4 × 4 × 4 × 4 × 2 × 2 × 2?',
      a: '2048',
      steps: [
        '4 × 4 × 4 × 4 = 4⁴ = 256 and 2 × 2 × 2 = 2³ = 8.',
        '256 × 8 = 2048.',
        'Answer: 2048',
      ],
    },
    {
      q: 'Write a × a × a × a × b × b × b × b × b × b as aᵖbᵠ. What is p + q?',
      a: '10',
      steps: [
        'a appears 4 times and b appears 6 times.',
        'So the expression is a⁴b⁶, and p + q = 4 + 6 = 10.',
        'Answer: 10',
      ],
    },
    {
      q: 'What is (3/4)²? Write it as a fraction.',
      a: '9/16',
      form: 'fraction',
      steps: [
        '2 factors of 3/4: multiply the tops and multiply the bottoms.',
        '3²/4² = 9/16.',
        'Answer: 9/16',
      ],
    },
    {
      q: 'What is 0.7³? Write it as a decimal.',
      a: '0.343',
      form: 'decimal',
      steps: [
        '0.7³ = 0.7 × 0.7 × 0.7.',
        'Multiply the digits (7 × 7 × 7 = 343), then place the decimal point 3 places from the right: 0.343.',
        'Answer: 0.343',
      ],
    },
    {
      q: 'What is 4 × 4 × 5 × 5 × 5?',
      a: '2000',
      steps: ['4 × 4 = 4² = 16 and 5 × 5 × 5 = 5³ = 125.', '16 × 125 = 2000.', 'Answer: 2000'],
    },
    {
      q: 'Write r × r × r × s × s × s × s as rᵖsᵠ. What is p + q?',
      a: '7',
      steps: [
        'r appears 3 times and s appears 4 times.',
        'So the expression is r³s⁴, and p + q = 3 + 4 = 7.',
        'Answer: 7',
      ],
    },
    {
      q: 'What is (1/3)⁴? Write it as a fraction.',
      a: '1/81',
      form: 'fraction',
      steps: [
        '4 factors of 1/3: multiply the tops and multiply the bottoms.',
        '1⁴/3⁴ = 1/81.',
        'Answer: 1/81',
      ],
    },
    {
      q: 'How many zeros are in the standard form of 10⁷?',
      a: '7',
      steps: [
        '10⁷ = 10 × 10 × … (7 factors of 10).',
        'Each factor of 10 adds a zero, so there are 7 zeros.',
        'Answer: 7',
      ],
    },
    {
      q: 'A square has sides 15 cm long. Its area is 15² cm². What is the number of square centimetres?',
      a: '225',
      steps: ['15² = 15 × 15.', '15 × 15 = 225.', 'Answer: 225'],
    },
    {
      q: 'A colony starts with 1 cell and triples every hour. How many cells are there after 4 hours?',
      a: '81',
      steps: [
        'Each hour multiplies by 3, so after 4 hours there are 4 factors of 3.',
        '3⁴ = 81.',
        'Answer: 81',
      ],
    },
    {
      q: '3⁴ × 3³ is written out as a product of 3s. How many factors of 3 are there in total?',
      a: '7',
      steps: ['3⁴ has 4 factors and 3³ has 3 factors.', '4 + 3 = 7.', 'Answer: 7'],
    },
    {
      q: 'How many zeros are in the standard form of 10¹⁰?',
      a: '10',
      steps: [
        '10¹⁰ = 10 × 10 × … (10 factors of 10).',
        'Each factor of 10 adds a zero, so there are 10 zeros.',
        'Answer: 10',
      ],
    },
    {
      q: 'A colony starts with 1 cell and doubles every hour. How many cells are there after 4 hours?',
      a: '16',
      steps: [
        'Each hour multiplies by 2, so after 4 hours there are 4 factors of 2.',
        '2⁴ = 16.',
        'Answer: 16',
      ],
    },
    {
      q: '4² × 4⁵ is written out as a product of 4s. How many factors of 4 are there in total?',
      a: '7',
      steps: ['4² has 2 factors and 4⁵ has 5 factors.', '2 + 5 = 7.', 'Answer: 7'],
    },
    {
      q: 'How many zeros are in the standard form of 10³?',
      a: '3',
      steps: [
        '10³ = 10 × 10 × … (3 factors of 10).',
        'Each factor of 10 adds a zero, so there are 3 zeros.',
        'Answer: 3',
      ],
    },
  ],
  signs: [
    {
      q: 'What is (−7)⁵?',
      a: '-16807',
      steps: [
        'The bracket puts the exponent on −7: (−7) × (−7) × (−7) × (−7) × (−7).',
        '5 is odd, so the answer is negative: −16807.',
        'Answer: −16807',
      ],
    },
    {
      q: 'Is (−6)⁷ positive or negative? Type 1 for positive, 0 for negative.',
      a: '0',
      steps: ['A negative base to an odd exponent is negative.', '7 is odd.', 'Answer: 0'],
    },
    {
      q: 'What is (−1)²⁶?',
      a: '1',
      steps: [
        'Powers of −1 alternate: −1, 1, −1, 1, …',
        '26 is even, so the answer is 1.',
        'Answer: 1',
      ],
    },
    {
      q: 'What is (−8)⁴?',
      a: '4096',
      steps: [
        'The bracket puts the exponent on −8: (−8) × (−8) × (−8) × (−8).',
        '4 is even, so the answer is positive: 4096.',
        'Answer: 4096',
      ],
    },
    {
      q: 'Is (−2)¹⁵ positive or negative? Type 1 for positive, 0 for negative.',
      a: '0',
      steps: ['A negative base to an odd exponent is negative.', '15 is odd.', 'Answer: 0'],
    },
    {
      q: 'What is (−1)⁴⁰?',
      a: '1',
      steps: [
        'Powers of −1 alternate: −1, 1, −1, 1, …',
        '40 is even, so the answer is 1.',
        'Answer: 1',
      ],
    },
    {
      q: 'What is (−5)²?',
      a: '25',
      steps: [
        'The bracket puts the exponent on −5: (−5) × (−5).',
        '2 is even, so the answer is positive: 25.',
        'Answer: 25',
      ],
    },
    {
      q: 'What is −8³?',
      a: '-512',
      steps: [
        'There is no bracket, so the exponent is only on 8: −8³ = −1 × 8³.',
        '8³ = 512, so the answer is −512.',
        'Answer: −512',
      ],
    },
    {
      q: 'What is (−5)² − (−5²)?',
      a: '50',
      steps: ['(−5)² = 25 and −5² = −25.', '25 − (−25) = 50.', 'Answer: 50'],
    },
    {
      q: 'What is (−1/3)⁴? Write it as a fraction.',
      a: '1/81',
      form: 'fraction',
      steps: [
        '4 factors of −1/3: the sign is positive because 4 is even.',
        '1/81 with that sign is 1/81.',
        'Answer: 1/81',
      ],
    },
    {
      q: 'What is (−3)² × (−4)³?',
      a: '-576',
      steps: ['(−3)² = 9 and (−4)³ = −64.', '9 × (−64) = −576.', 'Answer: −576'],
    },
    {
      q: 'What exponent n makes (−6)ⁿ = −7776?',
      a: '5',
      steps: [
        '7776 is 5 factors of 6.',
        'The answer is negative, so n is odd: n = 5.',
        'Answer: 5',
      ],
    },
    {
      q: 'What is (−3)³ − (−3³)?',
      a: '0',
      steps: ['(−3)³ = −27 and −3³ = −27.', '−27 − (−27) = 0.', 'Answer: 0'],
    },
    {
      q: 'What is −(−3)³?',
      a: '27',
      steps: ['(−3)³ = −27.', 'The negative in front flips the sign: 27.', 'Answer: 27'],
    },
    {
      q: 'What is (−1/2)²? Write it as a fraction.',
      a: '1/4',
      form: 'fraction',
      steps: [
        '2 factors of −1/2: the sign is positive because 2 is even.',
        '1/4 with that sign is 1/4.',
        'Answer: 1/4',
      ],
    },
    {
      q: 'What exponent n makes (−5)ⁿ = −3125?',
      a: '5',
      steps: [
        '3125 is 5 factors of 5.',
        'The answer is negative, so n is odd: n = 5.',
        'Answer: 5',
      ],
    },
    {
      q: 'What is (−4)⁴ − (−4⁴)?',
      a: '512',
      steps: ['(−4)⁴ = 256 and −4⁴ = −256.', '256 − (−256) = 512.', 'Answer: 512'],
    },
    {
      q: 'What is −7⁴ − (−7)⁴?',
      a: '-4802',
      steps: ['−7⁴ = −2401 and (−7)⁴ = 2401.', '−2401 − 2401 = −4802.', 'Answer: −4802'],
    },
    {
      q: 'What is (−1)¹ + (−1)² + (−1)³ + … + (−1)³⁴?',
      a: '0',
      steps: [
        'The terms alternate −1, 1, −1, 1, … and each pair adds to 0.',
        '34 terms: all in pairs, so the total is 0.',
        'Answer: 0',
      ],
    },
    {
      q: 'What is (−5)² − 5² + (−5)³?',
      a: '-125',
      steps: ['(−5)² = 25, 5² = 25 and (−5)³ = −125.', '25 − 25 + (−125) = −125.', 'Answer: −125'],
    },
    {
      q: 'What is (−6)² + (−6)⁴?',
      a: '1332',
      steps: ['(−6)² = 36 and (−6)⁴ = 1296.', '36 + 1296 = 1332.', 'Answer: 1332'],
    },
    {
      q: 'What is −5² − (−5)²?',
      a: '-50',
      steps: ['−5² = −25 and (−5)² = 25.', '−25 − 25 = −50.', 'Answer: −50'],
    },
    {
      q: 'What is (−1)¹ + (−1)² + (−1)³ + … + (−1)³²?',
      a: '0',
      steps: [
        'The terms alternate −1, 1, −1, 1, … and each pair adds to 0.',
        '32 terms: all in pairs, so the total is 0.',
        'Answer: 0',
      ],
    },
    {
      q: 'What is (−4)² − 4² + (−4)³?',
      a: '-64',
      steps: ['(−4)² = 16, 4² = 16 and (−4)³ = −64.', '16 − 16 + (−64) = −64.', 'Answer: −64'],
    },
    {
      q: 'What is (−6)³ + (−6)⁴?',
      a: '1080',
      steps: ['(−6)³ = −216 and (−6)⁴ = 1296.', '−216 + 1296 = 1080.', 'Answer: 1080'],
    },
  ],
  substitute: [
    {
      q: 'Evaluate 11x² when x = 9.',
      a: '891',
      steps: [
        'Replace x with (9), keeping the brackets: 11(9)².',
        'Evaluate the power first, then multiply: 891.',
        'Answer: 891',
      ],
    },
    {
      q: 'Evaluate x² when x = 7.',
      a: '49',
      steps: ['Substitute with brackets: (7)².', '(7)² = 49.', 'Answer: 49'],
    },
    {
      q: 'Evaluate 7x³ when x = 7.',
      a: '2401',
      steps: [
        'Replace x with (7), keeping the brackets: 7(7)³.',
        'Evaluate the power first, then multiply: 2401.',
        'Answer: 2401',
      ],
    },
    {
      q: 'Evaluate x³ when x = −2.',
      a: '-8',
      steps: [
        'Replace x with (−2), keeping the brackets: (−2)³.',
        'Evaluate the power first, then multiply: −8.',
        'Answer: −8',
      ],
    },
    {
      q: 'Evaluate (−x)² when x = −2.',
      a: '4',
      steps: ['Replace x with (−2): (−(−2))².', '−(−2) = 2, and (2)² = 4.', 'Answer: 4'],
    },
    {
      q: 'Evaluate 4x³ when x = 2.',
      a: '32',
      steps: [
        'Replace x with (2), keeping the brackets: 4(2)³.',
        'Evaluate the power first, then multiply: 32.',
        'Answer: 32',
      ],
    },
    {
      q: 'Evaluate 6x³ when x = −7.',
      a: '-2058',
      steps: [
        'Replace x with (−7), keeping the brackets: 6(−7)³.',
        'Evaluate the power first, then multiply: −2058.',
        'Answer: −2058',
      ],
    },
    {
      q: 'Evaluate x² when x = −8.',
      a: '64',
      steps: ['Substitute with brackets: (−8)².', '(−8)² = 64.', 'Answer: 64'],
    },
    {
      q: 'Evaluate 7x² − 9x + 10 when x = 8.',
      a: '386',
      steps: [
        'Replace x with (8), keeping the brackets: 7(8)² − 9(8) + 10.',
        'Powers first, then multiply. The terms are 448, −72, 10.',
        'Add them: 448 − 72 + 10 = 386.',
        'Answer: 386',
      ],
    },
    {
      q: 'Evaluate −7x³ + 10 when x = 4.',
      a: '-438',
      steps: [
        'Replace x with (4), keeping the brackets: −7(4)³ + 10.',
        'Powers first, then multiply. The terms are −448, 10.',
        'Add them: −448 + 10 = −438.',
        'Answer: −438',
      ],
    },
    {
      q: 'Evaluate x² + y² when x = 4 and y = 2.',
      a: '20',
      steps: ['Replace x and y with brackets: (4)² + (2)².', '16 + 4 = 20.', 'Answer: 20'],
    },
    {
      q: 'If 7x² = 1008 and x is positive, what is x?',
      a: '12',
      steps: ['Divide both sides by 7: x² = 144.', 'x is positive, so x = 12.', 'Answer: 12'],
    },
    {
      q: 'Evaluate −3x³ + 6 when x = −4.',
      a: '198',
      steps: [
        'Replace x with (−4), keeping the brackets: −3(−4)³ + 6.',
        'Powers first, then multiply. The terms are 192, 6.',
        'Add them: 192 + 6 = 198.',
        'Answer: 198',
      ],
    },
    {
      q: 'Evaluate x² − y² when x = −5 and y = 3.',
      a: '16',
      steps: ['Replace x and y with brackets: (−5)² − (3)².', '25 − 9 = 16.', 'Answer: 16'],
    },
    {
      q: 'If 8x² = 200 and x is positive, what is x?',
      a: '5',
      steps: ['Divide both sides by 8: x² = 25.', 'x is positive, so x = 5.', 'Answer: 5'],
    },
    {
      q: 'Evaluate 2x² − 3x − 11 when x = 4.',
      a: '9',
      steps: [
        'Replace x with (4), keeping the brackets: 2(4)² − 3(4) − 11.',
        'Powers first, then multiply. The terms are 32, −12, −11.',
        'Add them: 32 − 12 − 11 = 9.',
        'Answer: 9',
      ],
    },
    {
      q: 'Evaluate x² + y² when x = 5 and y = −5.',
      a: '50',
      steps: ['Replace x and y with brackets: (5)² + (−5)².', '25 + 25 = 50.', 'Answer: 50'],
    },
    {
      q: 'Evaluate 4x³ + x² − 2 when x = −3.',
      a: '-101',
      steps: [
        'Replace x with (−3), keeping the brackets: 4(−3)³ + (−3)² − 2.',
        'Powers first, then multiply. The terms are −108, 9, −2.',
        'Add them: −108 + 9 − 2 = −101.',
        'Answer: −101',
      ],
    },
    {
      q: 'Evaluate x⁴ − x² + 8 when x = 2.',
      a: '20',
      steps: [
        'Replace x with (2), keeping the brackets: (2)⁴ − (2)² + 8.',
        'Powers first, then multiply. The terms are 16, −4, 8.',
        'Add them: 16 − 4 + 8 = 20.',
        'Answer: 20',
      ],
    },
    {
      q: 'Evaluate x⁻³ when x = 4. Write it as a fraction.',
      a: '1/64',
      form: 'fraction',
      steps: ['Replace x with 4: 4⁻³ = 1/4³.', '4³ = 64, so the value is 1/64.', 'Answer: 1/64'],
    },
    {
      q: 'Let x = 2 and y = −2. What is (x − y)² − (x² − y²)?',
      a: '16',
      steps: [
        '(x − y)² = (2 − (−2))² = 4² = 16.',
        'x² − y² = 4 − 4 = 0.',
        '16 − 0 = 16.',
        'Answer: 16',
      ],
    },
    {
      q: 'Evaluate −2x³ + 2x² − 9 when x = −3.',
      a: '63',
      steps: [
        'Replace x with (−3), keeping the brackets: −2(−3)³ + 2(−3)² − 9.',
        'Powers first, then multiply. The terms are 54, 18, −9.',
        'Add them: 54 + 18 − 9 = 63.',
        'Answer: 63',
      ],
    },
    {
      q: 'Evaluate x⁴ + x² + 3 when x = −1.',
      a: '5',
      steps: [
        'Replace x with (−1), keeping the brackets: (−1)⁴ + (−1)² + 3.',
        'Powers first, then multiply. The terms are 1, 1, 3.',
        'Add them: 1 + 1 + 3 = 5.',
        'Answer: 5',
      ],
    },
    {
      q: 'Evaluate x⁻¹ when x = 5. Write it as a fraction.',
      a: '1/5',
      form: 'fraction',
      steps: ['Replace x with 5: 5⁻¹ = 1/5¹.', '5¹ = 5, so the value is 1/5.', 'Answer: 1/5'],
    },
    {
      q: 'Let x = 5 and y = −6. What is (x − y)² − (x² − y²)?',
      a: '132',
      steps: [
        '(x − y)² = (5 − (−6))² = 11² = 121.',
        'x² − y² = 25 − 36 = -11.',
        '121 − -11 = 132.',
        'Answer: 132',
      ],
    },
  ],
  sci: [
    {
      q: 'Is 3.7 × 5⁶ in scientific notation? Type 1 for yes, 0 for no.',
      a: '0',
      steps: [
        'Scientific notation multiplies the coefficient by a power of 10, not by a power of another number.',
        'Answer: 0',
      ],
    },
    {
      q: 'In 8 × 10⁹, what is the coefficient?',
      a: '8',
      steps: ['The coefficient is the number multiplying the power of 10: 8.', 'Answer: 8'],
    },
    {
      q: 'Is 7.7 × 10⁻² greater than 1 or between 0 and 1? Type 1 for greater than 1, 0 for between 0 and 1.',
      a: '0',
      steps: [
        'A negative exponent divides by 10 2 times, so the number is between 0 and 1.',
        'Answer: 0',
      ],
    },
    {
      q: 'Is 75.5 × 10⁻⁸ in scientific notation? Type 1 for yes, 0 for no.',
      a: '0',
      steps: [
        'The coefficient 75.5 is 10 or more. It needs exactly one digit before the decimal point.',
        'Answer: 0',
      ],
    },
    {
      q: 'In 4.88 × 10⁹, what is the coefficient?',
      a: '4.88',
      form: 'decimal',
      steps: ['The coefficient is the number multiplying the power of 10: 4.88.', 'Answer: 4.88'],
    },
    {
      q: 'Is 9 × 10⁷ greater than 1 or between 0 and 1? Type 1 for greater than 1, 0 for between 0 and 1.',
      a: '1',
      steps: ['A positive exponent multiplies by 10 7 times, so the number is large.', 'Answer: 1'],
    },
    {
      q: 'Is 0.96 × 10⁻¹ in scientific notation? Type 1 for yes, 0 for no.',
      a: '0',
      steps: [
        'The coefficient 0.96 is less than 1. It needs one non-zero digit before the decimal point.',
        'Answer: 0',
      ],
    },
    {
      q: 'In 7.1 × 10⁻⁵, what is the coefficient?',
      a: '7.1',
      form: 'decimal',
      steps: ['The coefficient is the number multiplying the power of 10: 7.1.', 'Answer: 7.1'],
    },
    {
      q: 'Rewrite 6600 × 10⁻⁵ in scientific notation a × 10ⁿ. What is n?',
      a: '-2',
      steps: [
        '6600 = 6.6 × 10³.',
        'Combine the powers of 10: −5 + 3 = −2, so n = −2.',
        'Answer: −2',
      ],
    },
    {
      q: 'Which is greater, 9.28 × 10⁻⁸ or 5 × 10⁻³? Type 1 for the first, 2 for the second.',
      a: '2',
      steps: [
        'The larger exponent wins when both coefficients are between 1 and 10: −8 against −3.',
        'The second number is greater.',
        'Answer: 2',
      ],
    },
    {
      q: 'How many times larger is 9 × 10⁹ than 9 × 10⁸?',
      a: '10',
      steps: [
        'The coefficients are the same, so divide the powers of 10.',
        '10⁹ ÷ 10⁸ = 10¹ = 10.',
        'Answer: 10',
      ],
    },
    {
      q: 'Rewrite 0.5 × 10⁴ in scientific notation a × 10ⁿ. What is a?',
      a: '5',
      steps: [
        '0.5 is 5 × 10⁻¹, so a = 5.',
        'The coefficient must have one digit before the decimal point.',
        'Answer: 5',
      ],
    },
    {
      q: 'Rewrite 74 × 10⁻⁶ in scientific notation a × 10ⁿ. What is n?',
      a: '-5',
      steps: ['74 = 7.4 × 10¹.', 'Combine the powers of 10: −6 + 1 = −5, so n = −5.', 'Answer: −5'],
    },
    {
      q: 'Which is greater, 1 × 10⁹ or 1.65 × 10⁻³? Type 1 for the first, 2 for the second.',
      a: '1',
      steps: [
        'The larger exponent wins when both coefficients are between 1 and 10: 9 against −3.',
        'The first number is greater.',
        'Answer: 1',
      ],
    },
    {
      q: 'How many times larger is 3 × 10⁷ than 3 × 10⁶?',
      a: '10',
      steps: [
        'The coefficients are the same, so divide the powers of 10.',
        '10⁷ ÷ 10⁶ = 10¹ = 10.',
        'Answer: 10',
      ],
    },
    {
      q: 'Rewrite 90000 × 10⁴ in scientific notation a × 10ⁿ. What is a?',
      a: '9',
      steps: [
        '90000 is 9 × 10⁴, so a = 9.',
        'The coefficient must have one digit before the decimal point.',
        'Answer: 9',
      ],
    },
    {
      q: 'Rewrite 0.00079 × 10² in scientific notation a × 10ⁿ. What is n?',
      a: '-2',
      steps: [
        '0.00079 = 7.9 × 10⁻⁴.',
        'Combine the powers of 10: 2 − 4 = −2, so n = −2.',
        'Answer: −2',
      ],
    },
    {
      q: 'Which is greater, 0.52 × 10³ or 0.07 × 10⁹? Type 1 for the first, 2 for the second.',
      a: '2',
      steps: [
        'Put both in scientific notation: 0.52 × 10³ = 5.2 × 10² and 0.07 × 10⁹ = 7 × 10⁷.',
        'Compare: the second is greater.',
        'Answer: 2',
      ],
    },
    {
      q: 'Rewrite 0.0703 × 10¹ in scientific notation a × 10ⁿ. What is a?',
      a: '7.03',
      form: 'decimal',
      steps: [
        '0.0703 is 7.03 × 10⁻², so a = 7.03.',
        'The coefficient must have one digit before the decimal point.',
        'Answer: 7.03',
      ],
    },
    {
      q: 'How many times larger is 4 × 10⁸ than 2 × 10⁶?',
      a: '200',
      steps: [
        'Divide the coefficients: 4 ÷ 2 = 2.',
        'Divide the powers of 10: 10⁸ ÷ 10⁶ = 10².',
        '2 × 100 = 200.',
        'Answer: 200',
      ],
    },
    {
      q: 'How many powers 10ⁿ (n a whole number) are greater than 600 and less than 600,000,000?',
      a: '6',
      steps: [
        'List the powers of 10: 1, 10, 100, 1,000, 10,000, …',
        'Count the ones between 600 and 600,000,000: 6.',
        'Answer: 6',
      ],
    },
    {
      q: 'Which is greater, 60 × 10⁶ or 0.18 × 10⁸? Type 1 for the first, 2 for the second.',
      a: '1',
      steps: [
        'Put both in scientific notation: 60 × 10⁶ = 6 × 10⁷ and 0.18 × 10⁸ = 1.8 × 10⁷.',
        'Compare: the first is greater.',
        'Answer: 1',
      ],
    },
    {
      q: 'Rewrite 0.0001 × 10⁻⁵ in scientific notation a × 10ⁿ. What is a?',
      a: '1',
      steps: [
        '0.0001 is 1 × 10⁻⁴, so a = 1.',
        'The coefficient must have one digit before the decimal point.',
        'Answer: 1',
      ],
    },
    {
      q: 'How many times larger is 8 × 10⁶ than 2 × 10³?',
      a: '4000',
      steps: [
        'Divide the coefficients: 8 ÷ 2 = 4.',
        'Divide the powers of 10: 10⁶ ÷ 10³ = 10³.',
        '4 × 1,000 = 4,000.',
        'Answer: 4000',
      ],
    },
    {
      q: 'How many powers 10ⁿ (n a whole number) are greater than 600 and less than 60,000,000?',
      a: '5',
      steps: [
        'List the powers of 10: 1, 10, 100, 1,000, 10,000, …',
        'Count the ones between 600 and 60,000,000: 5.',
        'Answer: 5',
      ],
    },
  ],
  tostd: [
    {
      q: 'Write 7.8 × 10⁹ in standard form (no commas).',
      a: '7800000000',
      steps: [
        'The exponent is 9, so move the decimal point 9 places to the right.',
        'Fill in the missing zeros: 7,800,000,000.',
        'Answer: 7800000000',
      ],
    },
    {
      q: 'Write 7 × 10⁻⁹ in standard form as a decimal.',
      a: '0.000000007',
      form: 'decimal',
      steps: [
        'The exponent is −9, so move the decimal point 9 places to the left.',
        'Fill in the missing zeros: 0.000000007.',
        'Answer: 0.000000007',
      ],
    },
    {
      q: 'To write 6 × 10⁷ in standard form, how many places does the decimal point move?',
      a: '7',
      steps: ['The number of places is the size of the exponent: 7.', 'Answer: 7'],
    },
    {
      q: 'Write 9.0837 × 10¹ in standard form (no commas).',
      a: '90.837',
      form: 'decimal',
      steps: [
        'The exponent is 1, so move the decimal point 1 places to the right.',
        'Fill in the missing zeros: 90.837.',
        'Answer: 90.837',
      ],
    },
    {
      q: 'Write 1 × 10⁻⁵ in standard form as a decimal.',
      a: '0.00001',
      form: 'decimal',
      steps: [
        'The exponent is −5, so move the decimal point 5 places to the left.',
        'Fill in the missing zeros: 0.00001.',
        'Answer: 0.00001',
      ],
    },
    {
      q: 'To write 8 × 10⁻⁶ in standard form, how many places does the decimal point move?',
      a: '6',
      steps: ['The number of places is the size of the exponent: 6.', 'Answer: 6'],
    },
    {
      q: 'Write 9.17 × 10¹ in standard form (no commas).',
      a: '91.7',
      form: 'decimal',
      steps: [
        'The exponent is 1, so move the decimal point 1 places to the right.',
        'Fill in the missing zeros: 91.7.',
        'Answer: 91.7',
      ],
    },
    {
      q: 'Write 5.672 × 10⁻⁷ in standard form as a decimal.',
      a: '0.0000005672',
      form: 'decimal',
      steps: [
        'The exponent is −7, so move the decimal point 7 places to the left.',
        'Fill in the missing zeros: 0.0000005672.',
        'Answer: 0.0000005672',
      ],
    },
    {
      q: 'Write 7.9 × 10⁸ in standard form (no commas).',
      a: '790000000',
      steps: [
        'The exponent is 8, so move the decimal point 8 places to the right.',
        'Fill in the missing zeros: 790,000,000.',
        'Answer: 790000000',
      ],
    },
    {
      q: 'Write 4.58 × 10⁻³ in standard form as a decimal.',
      a: '0.00458',
      form: 'decimal',
      steps: [
        'The exponent is −3, so move the decimal point 3 places to the left.',
        'Fill in the missing zeros: 0.00458.',
        'Answer: 0.00458',
      ],
    },
    {
      q: 'How many zeros are in the standard form of 7 × 10²?',
      a: '2',
      steps: [
        'Move the decimal point 2 places to the right: 700.',
        'That gives 2 zeros after the digits 7.',
        'Answer: 2',
      ],
    },
    {
      q: 'A sheet of paper is 4 × 10⁻⁸ metres thick. Write this number in standard form (no commas).',
      a: '0.00000004',
      form: 'decimal',
      steps: [
        'The exponent is −8, so move the decimal point 8 places to the left.',
        '0.00000004.',
        'Answer: 0.00000004',
      ],
    },
    {
      q: 'How many digits does the standard form of 5.4 × 10⁹ have?',
      a: '10',
      steps: [
        'Move the decimal point 9 places to the right: 5,400,000,000.',
        'A number below 10 times 10⁹ has 10 digits.',
        'Answer: 10',
      ],
    },
    {
      q: 'Write 6 × 10⁶ in standard form (no commas).',
      a: '6000000',
      steps: [
        'The exponent is 6, so move the decimal point 6 places to the right.',
        'Fill in the missing zeros: 6,000,000.',
        'Answer: 6000000',
      ],
    },
    {
      q: 'Write 7.0117 × 10⁻⁷ in standard form as a decimal.',
      a: '0.00000070117',
      form: 'decimal',
      steps: [
        'The exponent is −7, so move the decimal point 7 places to the left.',
        'Fill in the missing zeros: 0.00000070117.',
        'Answer: 0.00000070117',
      ],
    },
    {
      q: 'How many zeros are in the standard form of 2 × 10³?',
      a: '3',
      steps: [
        'Move the decimal point 3 places to the right: 2,000.',
        'That gives 3 zeros after the digits 2.',
        'Answer: 3',
      ],
    },
    {
      q: 'A virus particle is 2.5 × 10⁻⁴ metres wide. Write this number in standard form (no commas).',
      a: '0.00025',
      form: 'decimal',
      steps: [
        'The exponent is −4, so move the decimal point 4 places to the left.',
        '0.00025.',
        'Answer: 0.00025',
      ],
    },
    {
      q: 'How many digits are after the decimal point in the standard form of 1.48 × 10⁻³?',
      a: '5',
      steps: [
        '1.48 × 10⁻³ = 0.00148.',
        'Count the digits after the decimal point: 5.',
        'Answer: 5',
      ],
    },
    {
      q: 'What is 6.2 × 10⁵ − 6 × 10²? Write it in standard form (no commas).',
      a: '619400',
      steps: [
        '6.2 × 10⁵ = 620,000 and 6 × 10² = 600.',
        '620,000 − 600 = 619,400.',
        'Answer: 619400',
      ],
    },
    {
      q: 'How many zeros are between the decimal point and the first non-zero digit of 3.34 × 10⁻¹⁰ in standard form?',
      a: '9',
      steps: [
        '3.34 × 10⁻¹⁰ = 0.000000000334.',
        'There are 9 zeros before the digit 3.',
        'Answer: 9',
      ],
    },
    {
      q: 'What is the sum of the digits of the standard form of 7.8198 × 10⁵?',
      a: '33',
      steps: [
        '7.8198 × 10⁵ = 781,980.',
        'The zeros add nothing, so add 7 + 8 + 1 + 9 + 8 = 33.',
        'Answer: 33',
      ],
    },
    {
      q: 'How many digits are after the decimal point in the standard form of 8.5 × 10⁻⁴?',
      a: '5',
      steps: ['8.5 × 10⁻⁴ = 0.00085.', 'Count the digits after the decimal point: 5.', 'Answer: 5'],
    },
    {
      q: 'What is 3.7 × 10⁶ − 5.6 × 10²? Write it in standard form (no commas).',
      a: '3699440',
      steps: [
        '3.7 × 10⁶ = 3,700,000 and 5.6 × 10² = 560.',
        '3,700,000 − 560 = 3,699,440.',
        'Answer: 3699440',
      ],
    },
    {
      q: 'How many zeros are between the decimal point and the first non-zero digit of 7 × 10⁻⁷ in standard form?',
      a: '6',
      steps: ['7 × 10⁻⁷ = 0.0000007.', 'There are 6 zeros before the digit 7.', 'Answer: 6'],
    },
    {
      q: 'What is the sum of the digits of the standard form of 5.977 × 10⁹?',
      a: '28',
      steps: [
        '5.977 × 10⁹ = 5,977,000,000.',
        'The zeros add nothing, so add 5 + 9 + 7 + 7 = 28.',
        'Answer: 28',
      ],
    },
  ],
  tosci: [
    {
      q: 'Write 244,000 in scientific notation a × 10ⁿ. What is n?',
      a: '5',
      steps: [
        'Put the decimal point after the first non-zero digit: 2.44.',
        'The decimal point moved 5 places to the left, so n = 5.',
        'Answer: 5',
      ],
    },
    {
      q: 'Write 0.04941 in scientific notation a × 10ⁿ. What is n?',
      a: '-2',
      steps: [
        'Put the decimal point after the first non-zero digit: 4.941.',
        'The decimal point moved 2 places to the right, so n = −2.',
        'Answer: −2',
      ],
    },
    {
      q: 'Write 407,000,000 in scientific notation a × 10ⁿ. What is a?',
      a: '4.07',
      form: 'decimal',
      steps: [
        'Write the non-zero digits 407 and put the decimal point after the first one: 4.07.',
        'So a = 4.07.',
        'Answer: 4.07',
      ],
    },
    {
      q: 'Write 0.00265 in scientific notation a × 10ⁿ. What is a?',
      a: '2.65',
      form: 'decimal',
      steps: [
        'The first non-zero digit is 2, so put the decimal point after it: 2.65.',
        'So a = 2.65.',
        'Answer: 2.65',
      ],
    },
    {
      q: 'Write 5,000 in scientific notation a × 10ⁿ. What is n?',
      a: '3',
      steps: [
        'Put the decimal point after the first non-zero digit: 5.',
        'The decimal point moved 3 places to the left, so n = 3.',
        'Answer: 3',
      ],
    },
    {
      q: 'Write 0.08841 in scientific notation a × 10ⁿ. What is n?',
      a: '-2',
      steps: [
        'Put the decimal point after the first non-zero digit: 8.841.',
        'The decimal point moved 2 places to the right, so n = −2.',
        'Answer: −2',
      ],
    },
    {
      q: 'Write 1,140,000,000 in scientific notation a × 10ⁿ. What is a?',
      a: '1.14',
      form: 'decimal',
      steps: [
        'Write the non-zero digits 114 and put the decimal point after the first one: 1.14.',
        'So a = 1.14.',
        'Answer: 1.14',
      ],
    },
    {
      q: 'Write 0.00617 in scientific notation a × 10ⁿ. What is a?',
      a: '6.17',
      form: 'decimal',
      steps: [
        'The first non-zero digit is 6, so put the decimal point after it: 6.17.',
        'So a = 6.17.',
        'Answer: 6.17',
      ],
    },
    {
      q: 'Is the exponent n positive or negative when 400,000 is written in scientific notation? Type 1 for positive, 0 for negative.',
      a: '1',
      steps: ['A number of 10 or more has a positive exponent.', 'Answer: 1'],
    },
    {
      q: 'Write 661,000,000,000 in scientific notation a × 10ⁿ. What is n?',
      a: '11',
      steps: [
        'Put the decimal point after the first non-zero digit: 6.61.',
        'The decimal point moved 11 places to the left, so n = 11.',
        'Answer: 11',
      ],
    },
    {
      q: 'Write 0.0000003799 in scientific notation a × 10ⁿ. What is n?',
      a: '-7',
      steps: [
        'Put the decimal point after the first non-zero digit: 3.799.',
        'The decimal point moved 7 places to the right, so n = −7.',
        'Answer: −7',
      ],
    },
    {
      q: 'How many places does the decimal point move to write 0.00086 in scientific notation?',
      a: '4',
      steps: [
        'The scientific form is 8.6 × 10⁻⁴.',
        'The decimal point moves 4 places.',
        'Answer: 4',
      ],
    },
    {
      q: 'A bacterium is 0.00002 metres long. In scientific notation a × 10ⁿ, what is n?',
      a: '-5',
      steps: [
        'Put the decimal point after the first non-zero digit: 2.',
        'It moved 5 places to the right, so n = −5.',
        'Answer: −5',
      ],
    },
    {
      q: 'Is the exponent n positive or negative when 55,000 is written in scientific notation? Type 1 for positive, 0 for negative.',
      a: '1',
      steps: ['A number of 10 or more has a positive exponent.', 'Answer: 1'],
    },
    {
      q: 'Write 86,600,000 in scientific notation a × 10ⁿ. What is n?',
      a: '7',
      steps: [
        'Put the decimal point after the first non-zero digit: 8.66.',
        'The decimal point moved 7 places to the left, so n = 7.',
        'Answer: 7',
      ],
    },
    {
      q: 'Write 0.00007709 in scientific notation a × 10ⁿ. What is n?',
      a: '-5',
      steps: [
        'Put the decimal point after the first non-zero digit: 7.709.',
        'The decimal point moved 5 places to the right, so n = −5.',
        'Answer: −5',
      ],
    },
    {
      q: 'How many places does the decimal point move to write 0.7 in scientific notation?',
      a: '1',
      steps: ['The scientific form is 7 × 10⁻¹.', 'The decimal point moves 1 places.', 'Answer: 1'],
    },
    {
      q: 'N = 5 × 10⁻². When N is divided by 100 and written in scientific notation a × 10ⁿ, what is n?',
      a: '-4',
      steps: ['Dividing by 100 subtracts 2 from the exponent.', '−2 − 2 = −4.', 'Answer: −4'],
    },
    {
      q: 'N = 5 × 10⁶. When N is multiplied by 9 and written in scientific notation a × 10ⁿ, what is n?',
      a: '7',
      steps: [
        '5 × 10⁶ × 9 = 45 × 10⁶ = 4.5 × 10⁷.',
        'The coefficient must be below 10, so n = 7.',
        'Answer: 7',
      ],
    },
    {
      q: 'Write 400,000,000 in scientific notation a × 10ⁿ. What is a?',
      a: '4',
      steps: [
        'Write the non-zero digits 4 and put the decimal point after the first one: 4.',
        'So a = 4.',
        'Answer: 4',
      ],
    },
    {
      q: 'Write 0.0009 in scientific notation a × 10ⁿ. What is a?',
      a: '9',
      steps: [
        'The first non-zero digit is 9, so put the decimal point after it: 9.',
        'So a = 9.',
        'Answer: 9',
      ],
    },
    {
      q: 'N = 7.8 × 10⁻⁵. When N is divided by 100 and written in scientific notation a × 10ⁿ, what is n?',
      a: '-7',
      steps: ['Dividing by 100 subtracts 2 from the exponent.', '−5 − 2 = −7.', 'Answer: −7'],
    },
    {
      q: 'N = 8 × 10⁷. When N is multiplied by 5 and written in scientific notation a × 10ⁿ, what is n?',
      a: '8',
      steps: [
        '8 × 10⁷ × 5 = 40 × 10⁷ = 4 × 10⁸.',
        'The coefficient must be below 10, so n = 8.',
        'Answer: 8',
      ],
    },
    {
      q: 'Write 590,300,000,000 in scientific notation a × 10ⁿ. What is a?',
      a: '5.903',
      form: 'decimal',
      steps: [
        'Write the non-zero digits 5903 and put the decimal point after the first one: 5.903.',
        'So a = 5.903.',
        'Answer: 5.903',
      ],
    },
    {
      q: 'Write 0.000000002964 in scientific notation a × 10ⁿ. What is a?',
      a: '2.964',
      form: 'decimal',
      steps: [
        'The first non-zero digit is 2, so put the decimal point after it: 2.964.',
        'So a = 2.964.',
        'Answer: 2.964',
      ],
    },
  ],
};
