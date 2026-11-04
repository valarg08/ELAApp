import type { GuideProblem } from './guide-problem';

/**
 * 50 problems per Exponent Rules chapter, simple to complex (1–16 warm-up, 17–34 core, 35–50 challenge), and a
 * 50-problem final test that mixes every rule. Generated from small templates, so every answer is computed.
 */
export const EXPONENT_RULES_PROBLEMS: Record<string, GuideProblem[]> = {
  whatis: [
    {
      q: 'What is 3⁴?',
      a: '81',
      steps: [
        'The exponent 4 says to multiply the base 3 by itself, 4 factors in all.',
        '3⁴ = 3 · 3 · 3 · 3 = 81.',
        'Answer: 81',
      ],
    },
    {
      q: 'What is 5³?',
      a: '125',
      steps: [
        'The exponent 3 says to multiply the base 5 by itself, 3 factors in all.',
        '5³ = 5 · 5 · 5 = 125.',
        'Answer: 125',
      ],
    },
    {
      q: 'What is 4³?',
      a: '64',
      steps: [
        'The exponent 3 says to multiply the base 4 by itself, 3 factors in all.',
        '4³ = 4 · 4 · 4 = 64.',
        'Answer: 64',
      ],
    },
    {
      q: 'What is 6²?',
      a: '36',
      steps: [
        'The exponent 2 says to multiply the base 6 by itself, 2 factors in all.',
        '6² = 6 · 6 = 36.',
        'Answer: 36',
      ],
    },
    {
      q: 'What is 10³?',
      a: '1000',
      steps: [
        'The exponent 3 says to multiply the base 10 by itself, 3 factors in all.',
        '10³ = 10 · 10 · 10 = 1000.',
        'Answer: 1000',
      ],
    },
    {
      q: 'What is 2⁶?',
      a: '64',
      steps: [
        'The exponent 6 says to multiply the base 2 by itself, 6 factors in all.',
        '2⁶ = 64.',
        'Answer: 64',
      ],
    },
    {
      q: 'How many factors of 6 are multiplied together in 6⁵?',
      a: '5',
      steps: [
        'In 6⁵ the base is 6 and the exponent is 5.',
        'The exponent tells how many times the base is a factor: 6 · 6 · 6 · 6 · 6.',
        'Answer: 5',
      ],
    },
    {
      q: 'How many factors of 7 are multiplied together in 7⁴?',
      a: '4',
      steps: [
        'In 7⁴ the base is 7 and the exponent is 4.',
        'The exponent tells how many times the base is a factor: 7 · 7 · 7 · 7.',
        'Answer: 4',
      ],
    },
    {
      q: 'How many factors of 8 are multiplied together in 8³?',
      a: '3',
      steps: [
        'In 8³ the base is 8 and the exponent is 3.',
        'The exponent tells how many times the base is a factor: 8 · 8 · 8.',
        'Answer: 3',
      ],
    },
    {
      q: 'What is the base in 9⁵?',
      a: '9',
      steps: [
        'In a power, the base is the number being multiplied by itself.',
        'In 9⁵ the base is 9 and the exponent is 5.',
        'Answer: 9',
      ],
    },
    {
      q: 'What is the base in 3⁸?',
      a: '3',
      steps: [
        'In a power, the base is the number being multiplied by itself.',
        'In 3⁸ the base is 3 and the exponent is 8.',
        'Answer: 3',
      ],
    },
    {
      q: 'What is the base in 11³?',
      a: '11',
      steps: [
        'In a power, the base is the number being multiplied by itself.',
        'In 11³ the base is 11 and the exponent is 3.',
        'Answer: 11',
      ],
    },
    {
      q: '5 · 5 · 5 · 5 = 5^n. What is n?',
      a: '4',
      steps: [
        'Count the factors of 5: there are 4.',
        'Repeated multiplication of 4 equal factors is the power 5⁴, so n = 4.',
        'Answer: 4',
      ],
    },
    {
      q: '9 · 9 · 9 = 9^n. What is n?',
      a: '3',
      steps: [
        'Count the factors of 9: there are 3.',
        'Repeated multiplication of 3 equal factors is the power 9³, so n = 3.',
        'Answer: 3',
      ],
    },
    {
      q: '7 · 7 · 7 · 7 · 7 · 7 = 7^n. What is n?',
      a: '6',
      steps: [
        'Count the factors of 7: there are 6.',
        'Repeated multiplication of 6 equal factors is the power 7⁶, so n = 6.',
        'Answer: 6',
      ],
    },
    {
      q: 'What is 7³?',
      a: '343',
      steps: [
        'The exponent 3 says to multiply the base 7 by itself, 3 factors in all.',
        '7³ = 7 · 7 · 7 = 343.',
        'Answer: 343',
      ],
    },
    {
      q: 'What is 12²?',
      a: '144',
      steps: [
        'The exponent 2 says to multiply the base 12 by itself, 2 factors in all.',
        '12² = 12 · 12 = 144.',
        'Answer: 144',
      ],
    },
    {
      q: 'What is 9³?',
      a: '729',
      steps: [
        'The exponent 3 says to multiply the base 9 by itself, 3 factors in all.',
        '9³ = 9 · 9 · 9 = 729.',
        'Answer: 729',
      ],
    },
    {
      q: 'What is 4⁵?',
      a: '1024',
      steps: [
        'The exponent 5 says to multiply the base 4 by itself, 5 factors in all.',
        '4⁵ = 4 · 4 · 4 · 4 · 4 = 1024.',
        'Answer: 1024',
      ],
    },
    {
      q: 'What is 3⁵?',
      a: '243',
      steps: [
        'The exponent 5 says to multiply the base 3 by itself, 5 factors in all.',
        '3⁵ = 3 · 3 · 3 · 3 · 3 = 243.',
        'Answer: 243',
      ],
    },
    {
      q: 'What is 6⁴?',
      a: '1296',
      steps: [
        'The exponent 4 says to multiply the base 6 by itself, 4 factors in all.',
        '6⁴ = 6 · 6 · 6 · 6 = 1296.',
        'Answer: 1296',
      ],
    },
    {
      q: 'What is 5⁴?',
      a: '625',
      steps: [
        'The exponent 4 says to multiply the base 5 by itself, 4 factors in all.',
        '5⁴ = 5 · 5 · 5 · 5 = 625.',
        'Answer: 625',
      ],
    },
    {
      q: 'What is 8³?',
      a: '512',
      steps: [
        'The exponent 3 says to multiply the base 8 by itself, 3 factors in all.',
        '8³ = 8 · 8 · 8 = 512.',
        'Answer: 512',
      ],
    },
    {
      q: 'What is (−3)⁴?',
      a: '81',
      steps: [
        'The exponent 4 says to multiply the base −3 by itself, 4 factors in all.',
        '(−3)⁴ = (−3) · (−3) · (−3) · (−3) = 81.',
        'Answer: 81',
      ],
    },
    {
      q: 'What is (−2)⁵?',
      a: '-32',
      steps: [
        'The exponent 5 says to multiply the base −2 by itself, 5 factors in all.',
        '(−2)⁵ = (−2) · (−2) · (−2) · (−2) · (−2) = −32.',
        'Answer: −32',
      ],
    },
    {
      q: 'What is (−5)²?',
      a: '25',
      steps: [
        'The exponent 2 says to multiply the base −5 by itself, 2 factors in all.',
        '(−5)² = (−5) · (−5) = 25.',
        'Answer: 25',
      ],
    },
    {
      q: 'What is (−4)³?',
      a: '-64',
      steps: [
        'The exponent 3 says to multiply the base −4 by itself, 3 factors in all.',
        '(−4)³ = (−4) · (−4) · (−4) = −64.',
        'Answer: −64',
      ],
    },
    {
      q: 'What is −3⁴?',
      a: '-81',
      steps: [
        'Without parentheses the exponent applies only to 3, not to the minus sign.',
        '−3⁴ = −(3⁴) = −81.',
        'Answer: −81',
      ],
    },
    {
      q: 'What is −5²?',
      a: '-25',
      steps: [
        'Without parentheses the exponent applies only to 5, not to the minus sign.',
        '−5² = −(5²) = −25.',
        'Answer: −25',
      ],
    },
    {
      q: 'What is −7²?',
      a: '-49',
      steps: [
        'Without parentheses the exponent applies only to 7, not to the minus sign.',
        '−7² = −(7²) = −49.',
        'Answer: −49',
      ],
    },
    {
      q: 'What is −6³?',
      a: '-216',
      steps: [
        'Without parentheses the exponent applies only to 6, not to the minus sign.',
        '−6³ = −(6³) = −216.',
        'Answer: −216',
      ],
    },
    {
      q: 'What is (1/3)⁴?',
      a: '1/81',
      form: 'fraction',
      steps: [
        'Multiply 1/3 by itself 4 times: numerator 1⁴ = 1, denominator 3⁴ = 81.',
        '(1/3)⁴ = 1/81.',
        'Answer: 1/81',
      ],
    },
    {
      q: 'What is (3/2)²?',
      a: '9/4',
      form: 'fraction',
      steps: [
        'Multiply 3/2 by itself 2 times: numerator 3² = 9, denominator 2² = 4.',
        '(3/2)² = 9/4.',
        'Answer: 9/4',
      ],
    },
    {
      q: 'What is 2³ + 3²?',
      a: '17',
      steps: ['Work out each power first: 2³ = 8 and 3² = 9.', '8 + 9 = 17.', 'Answer: 17'],
    },
    {
      q: 'What is 5² + 2⁴?',
      a: '41',
      steps: ['Work out each power first: 5² = 25 and 2⁴ = 16.', '25 + 16 = 41.', 'Answer: 41'],
    },
    {
      q: 'What is 10³ + 10²?',
      a: '1100',
      steps: [
        'Work out each power first: 10³ = 1000 and 10² = 100.',
        '1000 + 100 = 1100.',
        'Answer: 1100',
      ],
    },
    {
      q: 'What is 3³ + 2³?',
      a: '35',
      steps: ['Work out each power first: 3³ = 27 and 2³ = 8.', '27 + 8 = 35.', 'Answer: 35'],
    },
    {
      q: 'What is 4² + 2²?',
      a: '20',
      steps: ['Work out each power first: 4² = 16 and 2² = 4.', '16 + 4 = 20.', 'Answer: 20'],
    },
    {
      q: 'What is 7² + 3¹?',
      a: '52',
      steps: ['Work out each power first: 7² = 49 and 3¹ = 3.', '49 + 3 = 52.', 'Answer: 52'],
    },
    {
      q: 'What is 6² + 2⁵?',
      a: '68',
      steps: ['Work out each power first: 6² = 36 and 2⁵ = 32.', '36 + 32 = 68.', 'Answer: 68'],
    },
    {
      q: '2^n = 128. What is n?',
      a: '7',
      steps: [
        'Multiply 2s until you reach 128: 2, 4, 8, 16, 32, 64, 128.',
        'That took 7 factors of 2, so n = 7.',
        'Answer: 7',
      ],
    },
    {
      q: '3^n = 243. What is n?',
      a: '5',
      steps: [
        'Multiply 3s until you reach 243: 3, 9, 27, 81, 243.',
        'That took 5 factors of 3, so n = 5.',
        'Answer: 5',
      ],
    },
    {
      q: '5^n = 625. What is n?',
      a: '4',
      steps: [
        'Multiply 5s until you reach 625: 5, 25, 125, 625.',
        'That took 4 factors of 5, so n = 4.',
        'Answer: 4',
      ],
    },
    {
      q: 'n³ = 216, and n is a positive whole number. What is n?',
      a: '6',
      steps: [
        'Find the number that multiplied by itself 3 times gives 216.',
        '6³ = 216, so n = 6.',
        'Answer: 6',
      ],
    },
    {
      q: 'n⁴ = 81, and n is a positive whole number. What is n?',
      a: '3',
      steps: [
        'Find the number that multiplied by itself 4 times gives 81.',
        '3⁴ = 81, so n = 3.',
        'Answer: 3',
      ],
    },
    {
      q: 'Which is larger, 2⁶ or 6²? Type the larger value.',
      a: '64',
      steps: ['2⁶ = 64 and 6² = 36.', 'The larger value is 64.', 'Answer: 64'],
    },
    {
      q: 'Which is larger, 3⁴ or 4³? Type the larger value.',
      a: '81',
      steps: ['3⁴ = 81 and 4³ = 64.', 'The larger value is 81.', 'Answer: 81'],
    },
    {
      q: 'What is the units digit of 7⁴?',
      a: '1',
      steps: [
        'Only the units digit matters, so multiply units digits one power at a time.',
        'The units digits of 7, 7², … are 7, 9, 3, 1; the units digit of 7⁴ is 1.',
        'Answer: 1',
      ],
    },
    {
      q: 'What is the units digit of 3⁵?',
      a: '3',
      steps: [
        'Only the units digit matters, so multiply units digits one power at a time.',
        'The units digits of 3, 3², … are 3, 9, 7, 1, 3; the units digit of 3⁵ is 3.',
        'Answer: 3',
      ],
    },
    {
      q: 'What is the units digit of 2¹⁰?',
      a: '4',
      steps: [
        'Only the units digit matters, so multiply units digits one power at a time.',
        'The units digits of 2, 2², … are 2, 4, 8, 6, 2, 4, 8, 6, 2, 4; the units digit of 2¹⁰ is 4.',
        'Answer: 4',
      ],
    },
  ],
  product: [
    {
      q: 'What is 2² · 2³?',
      a: '32',
      steps: [
        'Same base 2: keep the base and add the exponents.',
        '2² · 2³ = 2^(2 + 3) = 2⁵.',
        '2⁵ = 32.',
        'Answer: 32',
      ],
    },
    {
      q: 'What is 3² · 3²?',
      a: '81',
      steps: [
        'Same base 3: keep the base and add the exponents.',
        '3² · 3² = 3^(2 + 2) = 3⁴.',
        '3⁴ = 81.',
        'Answer: 81',
      ],
    },
    {
      q: 'What is 10² · 10³?',
      a: '100000',
      steps: [
        'Same base 10: keep the base and add the exponents.',
        '10² · 10³ = 10^(2 + 3) = 10⁵.',
        '10⁵ = 100000.',
        'Answer: 100000',
      ],
    },
    {
      q: 'What is 5² · 5²?',
      a: '625',
      steps: [
        'Same base 5: keep the base and add the exponents.',
        '5² · 5² = 5^(2 + 2) = 5⁴.',
        '5⁴ = 625.',
        'Answer: 625',
      ],
    },
    {
      q: 'What is 2⁶ · 2²?',
      a: '256',
      steps: [
        'Same base 2: keep the base and add the exponents.',
        '2⁶ · 2² = 2^(6 + 2) = 2⁸.',
        '2⁸ = 256.',
        'Answer: 256',
      ],
    },
    {
      q: 'What is 4² · 4³?',
      a: '1024',
      steps: [
        'Same base 4: keep the base and add the exponents.',
        '4² · 4³ = 4^(2 + 3) = 4⁵.',
        '4⁵ = 1024.',
        'Answer: 1024',
      ],
    },
    {
      q: 'x²·x³ = x^n. What is n?',
      a: '5',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: x²·x³ = x⁵.',
        'So x²·x³ = x⁵, and n = 5.',
        'Answer: 5',
      ],
    },
    {
      q: 'x⁴·x⁵ = x^n. What is n?',
      a: '9',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: x⁴·x⁵ = x⁹.',
        'So x⁴·x⁵ = x⁹, and n = 9.',
        'Answer: 9',
      ],
    },
    {
      q: 'x⁶·x³ = x^n. What is n?',
      a: '9',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: x⁶·x³ = x⁹.',
        'So x⁶·x³ = x⁹, and n = 9.',
        'Answer: 9',
      ],
    },
    {
      q: 'x⁷·x⁸ = x^n. What is n?',
      a: '15',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: x⁷·x⁸ = x¹⁵.',
        'So x⁷·x⁸ = x¹⁵, and n = 15.',
        'Answer: 15',
      ],
    },
    {
      q: 'x¹⁰·x² = x^n. What is n?',
      a: '12',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: x¹⁰·x² = x¹².',
        'So x¹⁰·x² = x¹², and n = 12.',
        'Answer: 12',
      ],
    },
    {
      q: 'x⁵·x⁹ = x^n. What is n?',
      a: '14',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: x⁵·x⁹ = x¹⁴.',
        'So x⁵·x⁹ = x¹⁴, and n = 14.',
        'Answer: 14',
      ],
    },
    {
      q: 'x²·x³·x⁴ = x^n. What is n?',
      a: '9',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: x²·x³·x⁴ = x⁹.',
        'So x²·x³·x⁴ = x⁹, and n = 9.',
        'Answer: 9',
      ],
    },
    {
      q: 'x³·x⁴·x⁶ = x^n. What is n?',
      a: '13',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: x³·x⁴·x⁶ = x¹³.',
        'So x³·x⁴·x⁶ = x¹³, and n = 13.',
        'Answer: 13',
      ],
    },
    {
      q: 'x⁵·x³·x² = x^n. What is n?',
      a: '10',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: x⁵·x³·x² = x¹⁰.',
        'So x⁵·x³·x² = x¹⁰, and n = 10.',
        'Answer: 10',
      ],
    },
    {
      q: 'x⁷·x²·x⁸ = x^n. What is n?',
      a: '17',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: x⁷·x²·x⁸ = x¹⁷.',
        'So x⁷·x²·x⁸ = x¹⁷, and n = 17.',
        'Answer: 17',
      ],
    },
    {
      q: '3x²·4x⁵ = c·x^n. What is c?',
      a: '12',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: 3x²·4x⁵ = 12x⁷.',
        'So 3x²·4x⁵ = 12x⁷, and c = 12.',
        'Answer: 12',
      ],
    },
    {
      q: '2x³·5x⁴ = c·x^n. What is c?',
      a: '10',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: 2x³·5x⁴ = 10x⁷.',
        'So 2x³·5x⁴ = 10x⁷, and c = 10.',
        'Answer: 10',
      ],
    },
    {
      q: '−3x⁴·2x³ = c·x^n. What is c?',
      a: '-6',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: −3x⁴·2x³ = −6x⁷.',
        'So −3x⁴·2x³ = −6x⁷, and c = −6.',
        'Answer: −6',
      ],
    },
    {
      q: '6x²·(−2)x⁷ = c·x^n. What is c?',
      a: '-12',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: 6x²·(−2)x⁷ = −12x⁹.',
        'So 6x²·(−2)x⁷ = −12x⁹, and c = −12.',
        'Answer: −12',
      ],
    },
    {
      q: '5x⁴·3x² = c·x^n. What is n?',
      a: '6',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: 5x⁴·3x² = 15x⁶.',
        'So 5x⁴·3x² = 15x⁶, and n = 6.',
        'Answer: 6',
      ],
    },
    {
      q: '7x⁶·2x⁹ = c·x^n. What is n?',
      a: '15',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: 7x⁶·2x⁹ = 14x¹⁵.',
        'So 7x⁶·2x⁹ = 14x¹⁵, and n = 15.',
        'Answer: 15',
      ],
    },
    {
      q: '−4x⁵·(−3)x⁸ = c·x^n. What is c + n?',
      a: '25',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: −4x⁵·(−3)x⁸ = 12x¹³.',
        'So −4x⁵·(−3)x⁸ = 12x¹³, and c + n = 12 + 13 = 25.',
        'Answer: 25',
      ],
    },
    {
      q: 'x²y³·x⁴y² = x^m·y^n. What is n?',
      a: '5',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: x²y³·x⁴y² = x⁶y⁵.',
        'So x²y³·x⁴y² = x⁶y⁵, and n = 5.',
        'Answer: 5',
      ],
    },
    {
      q: 'x⁵y²·x³y⁶ = x^m·y^n. What is m?',
      a: '8',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: x⁵y²·x³y⁶ = x⁸y⁸.',
        'So x⁵y²·x³y⁶ = x⁸y⁸, and m = 8.',
        'Answer: 8',
      ],
    },
    {
      q: 'x³y⁴·x⁶y⁵ = x^m·y^n. What is m + n?',
      a: '18',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: x³y⁴·x⁶y⁵ = x⁹y⁹.',
        'So x³y⁴·x⁶y⁵ = x⁹y⁹, and m + n = 9 + 9 = 18.',
        'Answer: 18',
      ],
    },
    {
      q: '2x³y²·4x²y⁵ = c·x^m·y^n. What is c?',
      a: '8',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: 2x³y²·4x²y⁵ = 8x⁵y⁷.',
        'So 2x³y²·4x²y⁵ = 8x⁵y⁷, and c = 8.',
        'Answer: 8',
      ],
    },
    {
      q: 'What is 2⁵ · 2³?',
      a: '256',
      steps: [
        'Same base 2: keep the base and add the exponents.',
        '2⁵ · 2³ = 2^(5 + 3) = 2⁸.',
        '2⁸ = 256.',
        'Answer: 256',
      ],
    },
    {
      q: 'What is 3³ · 3²?',
      a: '243',
      steps: [
        'Same base 3: keep the base and add the exponents.',
        '3³ · 3² = 3^(3 + 2) = 3⁵.',
        '3⁵ = 243.',
        'Answer: 243',
      ],
    },
    {
      q: 'What is 10⁴ · 10²?',
      a: '1000000',
      steps: [
        'Same base 10: keep the base and add the exponents.',
        '10⁴ · 10² = 10^(4 + 2) = 10⁶.',
        '10⁶ = 1000000.',
        'Answer: 1000000',
      ],
    },
    {
      q: 'x^m · x⁴ = x⁹. What is m?',
      a: '5',
      steps: ['Same base x: the exponents add, so m + 4 = 9.', 'm = 9 − 4 = 5.', 'Answer: 5'],
    },
    {
      q: '2^m · 2³ = 2⁸. What is m?',
      a: '5',
      steps: ['Same base 2: the exponents add, so m + 3 = 8.', 'm = 8 − 3 = 5.', 'Answer: 5'],
    },
    {
      q: 'y^m · y^m = y¹⁴. What is m?',
      a: '7',
      steps: [
        'Both factors have the same exponent m, so the exponents add to m + m = 2m.',
        '2m = 14, so m = 7.',
        'Answer: 7',
      ],
    },
    {
      q: '3^m · 3⁵ = 3¹². What is m?',
      a: '7',
      steps: ['Same base 3: the exponents add, so m + 5 = 12.', 'm = 12 − 5 = 7.', 'Answer: 7'],
    },
    {
      q: '4 · 2³ = 2^n. What is n?',
      a: '5',
      steps: [
        'Write 4 as a power of 2: 4 = 2².',
        '2² · 2³ = 2^(2 + 3) = 2⁵, so n = 5.',
        'Answer: 5',
      ],
    },
    {
      q: '9 · 3⁴ = 3^n. What is n?',
      a: '6',
      steps: [
        'Write 9 as a power of 3: 9 = 3².',
        '3² · 3⁴ = 3^(2 + 4) = 3⁶, so n = 6.',
        'Answer: 6',
      ],
    },
    {
      q: '8 · 2⁴ = 2^n. What is n?',
      a: '7',
      steps: [
        'Write 8 as a power of 2: 8 = 2³.',
        '2³ · 2⁴ = 2^(3 + 4) = 2⁷, so n = 7.',
        'Answer: 7',
      ],
    },
    {
      q: '25 · 5³ = 5^n. What is n?',
      a: '5',
      steps: [
        'Write 25 as a power of 5: 25 = 5².',
        '5² · 5³ = 5^(2 + 3) = 5⁵, so n = 5.',
        'Answer: 5',
      ],
    },
    {
      q: '27 · 3² = 3^n. What is n?',
      a: '5',
      steps: [
        'Write 27 as a power of 3: 27 = 3³.',
        '3³ · 3² = 3^(3 + 2) = 3⁵, so n = 5.',
        'Answer: 5',
      ],
    },
    {
      q: '2^(x + 1) · 2^(x + 2) = 2⁹. What is x?',
      a: '3',
      steps: [
        'Same base 2: add the exponents, (x + 1) + (x + 2) = 2x + 3.',
        'So 2x + 3 = 9, which gives 2x = 6.',
        'x = 3.',
        'Answer: 3',
      ],
    },
    {
      q: '3^(x) · 3^(x − 1) = 3⁷. What is x?',
      a: '4',
      steps: [
        'Same base 3: add the exponents, (x) + (x − 1) = 2x − 1.',
        'So 2x − 1 = 7, which gives 2x = 8.',
        'x = 4.',
        'Answer: 4',
      ],
    },
    {
      q: '5^(2x) · 5^(x + 1) = 5¹⁰. What is x?',
      a: '3',
      steps: [
        'Same base 5: add the exponents, (2x) + (x + 1) = 3x + 1.',
        'So 3x + 1 = 10, which gives 3x = 9.',
        'x = 3.',
        'Answer: 3',
      ],
    },
    {
      q: '7^(x − 2) · 7^(x + 4) = 7¹⁰. What is x?',
      a: '4',
      steps: [
        'Same base 7: add the exponents, (x − 2) + (x + 4) = 2x + 2.',
        'So 2x + 2 = 10, which gives 2x = 8.',
        'x = 4.',
        'Answer: 4',
      ],
    },
    {
      q: 'Assume x ≠ 0. x⁷·x⁻³ = x^n. What is n?',
      a: '4',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: x⁷·x⁻³ = x⁴.',
        'So x⁷·x⁻³ = x⁴, and n = 4.',
        'Answer: 4',
      ],
    },
    {
      q: 'Assume x ≠ 0. x⁻²·x⁻⁵ = x^n. What is n?',
      a: '-7',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: x⁻²·x⁻⁵ = x⁻⁷.',
        'So x⁻²·x⁻⁵ = x⁻⁷, and n = −7.',
        'Answer: −7',
      ],
    },
    {
      q: 'Assume y ≠ 0. y⁻⁴·y⁹ = y^n. What is n?',
      a: '5',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: y⁻⁴·y⁹ = y⁵.',
        'So y⁻⁴·y⁹ = y⁵, and n = 5.',
        'Answer: 5',
      ],
    },
    {
      q: 'What is 2⁻³ · 2⁷?',
      a: '16',
      steps: ['Same base 2: add the exponents, −3 + 7 = 4.', '2⁻³ · 2⁷ = 2⁴ = 16.', 'Answer: 16'],
    },
    {
      q: '2x³·(−5)x⁴·3x = c·x^n. What is c?',
      a: '-30',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: 2x³·(−5)x⁴·3x = −30x⁸.',
        'So 2x³·(−5)x⁴·3x = −30x⁸, and c = −30.',
        'Answer: −30',
      ],
    },
    {
      q: '−x²y·3xy⁴·2y = c·x^m·y^n. What is m + n?',
      a: '9',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: −x²y·3xy⁴·2y = −6x³y⁶.',
        'So −x²y·3xy⁴·2y = −6x³y⁶, and m + n = 3 + 6 = 9.',
        'Answer: 9',
      ],
    },
    {
      q: 'x²y³·x⁴y·x³y² = x^m·y^n. What is m + n?',
      a: '15',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: x²y³·x⁴y·x³y² = x⁹y⁶.',
        'So x²y³·x⁴y·x³y² = x⁹y⁶, and m + n = 9 + 6 = 15.',
        'Answer: 15',
      ],
    },
  ],
  quotient: [
    {
      q: 'What is 2⁸/2⁵?',
      a: '8',
      steps: [
        'Same base 2: keep the base and subtract the exponents.',
        '2⁸/2⁵ = 2^(8 − 5) = 2³.',
        '2³ = 8.',
        'Answer: 8',
      ],
    },
    {
      q: 'What is 3⁶/3⁴?',
      a: '9',
      steps: [
        'Same base 3: keep the base and subtract the exponents.',
        '3⁶/3⁴ = 3^(6 − 4) = 3².',
        '3² = 9.',
        'Answer: 9',
      ],
    },
    {
      q: 'What is 10⁷/10⁴?',
      a: '1000',
      steps: [
        'Same base 10: keep the base and subtract the exponents.',
        '10⁷/10⁴ = 10^(7 − 4) = 10³.',
        '10³ = 1000.',
        'Answer: 1000',
      ],
    },
    {
      q: 'What is 5⁵/5²?',
      a: '125',
      steps: [
        'Same base 5: keep the base and subtract the exponents.',
        '5⁵/5² = 5^(5 − 2) = 5³.',
        '5³ = 125.',
        'Answer: 125',
      ],
    },
    {
      q: 'What is 4⁶/4³?',
      a: '64',
      steps: [
        'Same base 4: keep the base and subtract the exponents.',
        '4⁶/4³ = 4^(6 − 3) = 4³.',
        '4³ = 64.',
        'Answer: 64',
      ],
    },
    {
      q: 'What is 6⁴/6²?',
      a: '36',
      steps: [
        'Same base 6: keep the base and subtract the exponents.',
        '6⁴/6² = 6^(4 − 2) = 6².',
        '6² = 36.',
        'Answer: 36',
      ],
    },
    {
      q: 'Assume x ≠ 0. x⁸/x³ = x^n. What is n?',
      a: '5',
      steps: [
        'Quotient of powers: divide the numbers and subtract the exponents: x⁸/x³ = x⁵.',
        'So x⁸/x³ = x⁵, and n = 5.',
        'Answer: 5',
      ],
    },
    {
      q: 'Assume x ≠ 0. x¹⁰/x⁶ = x^n. What is n?',
      a: '4',
      steps: [
        'Quotient of powers: divide the numbers and subtract the exponents: x¹⁰/x⁶ = x⁴.',
        'So x¹⁰/x⁶ = x⁴, and n = 4.',
        'Answer: 4',
      ],
    },
    {
      q: 'Assume x ≠ 0. x¹²/x⁵ = x^n. What is n?',
      a: '7',
      steps: [
        'Quotient of powers: divide the numbers and subtract the exponents: x¹²/x⁵ = x⁷.',
        'So x¹²/x⁵ = x⁷, and n = 7.',
        'Answer: 7',
      ],
    },
    {
      q: 'Assume x ≠ 0. x⁷/x² = x^n. What is n?',
      a: '5',
      steps: [
        'Quotient of powers: divide the numbers and subtract the exponents: x⁷/x² = x⁵.',
        'So x⁷/x² = x⁵, and n = 5.',
        'Answer: 5',
      ],
    },
    {
      q: 'Assume x ≠ 0. x¹⁵/x⁹ = x^n. What is n?',
      a: '6',
      steps: [
        'Quotient of powers: divide the numbers and subtract the exponents: x¹⁵/x⁹ = x⁶.',
        'So x¹⁵/x⁹ = x⁶, and n = 6.',
        'Answer: 6',
      ],
    },
    {
      q: 'Assume x ≠ 0. x²⁰/x¹¹ = x^n. What is n?',
      a: '9',
      steps: [
        'Quotient of powers: divide the numbers and subtract the exponents: x²⁰/x¹¹ = x⁹.',
        'So x²⁰/x¹¹ = x⁹, and n = 9.',
        'Answer: 9',
      ],
    },
    {
      q: 'Assume x ≠ 0. (x⁵·x⁴)/x³ = x^n. What is n?',
      a: '6',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: x⁵·x⁴ = x⁹.',
        'Quotient of powers: divide the numbers and subtract the exponents: (x⁵·x⁴)/x³ = x⁶.',
        'So (x⁵·x⁴)/x³ = x⁶, and n = 6.',
        'Answer: 6',
      ],
    },
    {
      q: 'Assume x ≠ 0. (x²·x⁸)/x⁴ = x^n. What is n?',
      a: '6',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: x²·x⁸ = x¹⁰.',
        'Quotient of powers: divide the numbers and subtract the exponents: (x²·x⁸)/x⁴ = x⁶.',
        'So (x²·x⁸)/x⁴ = x⁶, and n = 6.',
        'Answer: 6',
      ],
    },
    {
      q: 'Assume x ≠ 0. (x⁶·x⁷)/x⁵ = x^n. What is n?',
      a: '8',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: x⁶·x⁷ = x¹³.',
        'Quotient of powers: divide the numbers and subtract the exponents: (x⁶·x⁷)/x⁵ = x⁸.',
        'So (x⁶·x⁷)/x⁵ = x⁸, and n = 8.',
        'Answer: 8',
      ],
    },
    {
      q: 'Assume x ≠ 0. (x³·x³)/x² = x^n. What is n?',
      a: '4',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: x³·x³ = x⁶.',
        'Quotient of powers: divide the numbers and subtract the exponents: (x³·x³)/x² = x⁴.',
        'So (x³·x³)/x² = x⁴, and n = 4.',
        'Answer: 4',
      ],
    },
    {
      q: 'Assume x ≠ 0. (12x⁸)/(3x²) = c·x^n. What is c?',
      a: '4',
      steps: [
        'Quotient of powers: divide the numbers and subtract the exponents: (12x⁸)/(3x²) = 4x⁶.',
        'So (12x⁸)/(3x²) = 4x⁶, and c = 4.',
        'Answer: 4',
      ],
    },
    {
      q: 'Assume x ≠ 0. (20x⁹)/(4x⁵) = c·x^n. What is c?',
      a: '5',
      steps: [
        'Quotient of powers: divide the numbers and subtract the exponents: (20x⁹)/(4x⁵) = 5x⁴.',
        'So (20x⁹)/(4x⁵) = 5x⁴, and c = 5.',
        'Answer: 5',
      ],
    },
    {
      q: 'Assume x ≠ 0. (−18x⁷)/(6x³) = c·x^n. What is c?',
      a: '-3',
      steps: [
        'Quotient of powers: divide the numbers and subtract the exponents: (−18x⁷)/(6x³) = −3x⁴.',
        'So (−18x⁷)/(6x³) = −3x⁴, and c = −3.',
        'Answer: −3',
      ],
    },
    {
      q: 'Assume x ≠ 0. (30x¹¹)/(5x⁴) = c·x^n. What is c + n?',
      a: '13',
      steps: [
        'Quotient of powers: divide the numbers and subtract the exponents: (30x¹¹)/(5x⁴) = 6x⁷.',
        'So (30x¹¹)/(5x⁴) = 6x⁷, and c + n = 6 + 7 = 13.',
        'Answer: 13',
      ],
    },
    {
      q: 'Assume x ≠ 0. (15x¹⁰)/(5x⁴) = c·x^n. What is n?',
      a: '6',
      steps: [
        'Quotient of powers: divide the numbers and subtract the exponents: (15x¹⁰)/(5x⁴) = 3x⁶.',
        'So (15x¹⁰)/(5x⁴) = 3x⁶, and n = 6.',
        'Answer: 6',
      ],
    },
    {
      q: 'Assume x ≠ 0. (24x⁹)/(8x⁶) = c·x^n. What is n?',
      a: '3',
      steps: [
        'Quotient of powers: divide the numbers and subtract the exponents: (24x⁹)/(8x⁶) = 3x³.',
        'So (24x⁹)/(8x⁶) = 3x³, and n = 3.',
        'Answer: 3',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. (x⁸y⁵)/(x³y²) = x^m·y^n. What is m + n?',
      a: '8',
      steps: [
        'Quotient of powers: divide the numbers and subtract the exponents: (x⁸y⁵)/(x³y²) = x⁵y³.',
        'So (x⁸y⁵)/(x³y²) = x⁵y³, and m + n = 5 + 3 = 8.',
        'Answer: 8',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. (x⁹y⁷)/(x⁴y³) = x^m·y^n. What is n?',
      a: '4',
      steps: [
        'Quotient of powers: divide the numbers and subtract the exponents: (x⁹y⁷)/(x⁴y³) = x⁵y⁴.',
        'So (x⁹y⁷)/(x⁴y³) = x⁵y⁴, and n = 4.',
        'Answer: 4',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. (x¹²y⁶)/(x⁵y¹) = x^m·y^n. What is m + n?',
      a: '12',
      steps: [
        'One exponent: a number to the power 1 is itself: y¹ = y.',
        'Product of powers: multiply the numbers and add the exponents of each variable: x⁵y¹ = x⁵y.',
        'Quotient of powers: divide the numbers and subtract the exponents: (x¹²y⁶)/(x⁵y¹) = x⁷y⁵.',
        'So (x¹²y⁶)/(x⁵y¹) = x⁷y⁵, and m + n = 7 + 5 = 12.',
        'Answer: 12',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. (14x⁶y⁸)/(7x²y³) = c·x^m·y^n. What is c?',
      a: '2',
      steps: [
        'Quotient of powers: divide the numbers and subtract the exponents: (14x⁶y⁸)/(7x²y³) = 2x⁴y⁵.',
        'So (14x⁶y⁸)/(7x²y³) = 2x⁴y⁵, and c = 2.',
        'Answer: 2',
      ],
    },
    {
      q: 'What is 2¹⁰/2⁶?',
      a: '16',
      steps: [
        'Same base 2: keep the base and subtract the exponents.',
        '2¹⁰/2⁶ = 2^(10 − 6) = 2⁴.',
        '2⁴ = 16.',
        'Answer: 16',
      ],
    },
    {
      q: 'What is 3⁹/3⁶?',
      a: '27',
      steps: [
        'Same base 3: keep the base and subtract the exponents.',
        '3⁹/3⁶ = 3^(9 − 6) = 3³.',
        '3³ = 27.',
        'Answer: 27',
      ],
    },
    {
      q: 'What is 10⁹/10⁵?',
      a: '10000',
      steps: [
        'Same base 10: keep the base and subtract the exponents.',
        '10⁹/10⁵ = 10^(9 − 5) = 10⁴.',
        '10⁴ = 10000.',
        'Answer: 10000',
      ],
    },
    {
      q: 'What is 5⁸/5⁵?',
      a: '125',
      steps: [
        'Same base 5: keep the base and subtract the exponents.',
        '5⁸/5⁵ = 5^(8 − 5) = 5³.',
        '5³ = 125.',
        'Answer: 125',
      ],
    },
    {
      q: 'x^m/x³ = x⁷. What is m?',
      a: '10',
      steps: ['Same base x: m − 3 = 7.', 'm = 7 + 3 = 10.', 'Answer: 10'],
    },
    {
      q: '2^m/2⁴ = 2⁵. What is m?',
      a: '9',
      steps: ['Same base 2: m − 4 = 5.', 'm = 5 + 4 = 9.', 'Answer: 9'],
    },
    {
      q: 'x⁹/x^m = x⁴. What is m?',
      a: '5',
      steps: ['Same base x: 9 − m = 4.', 'm = 9 − 4 = 5.', 'Answer: 5'],
    },
    {
      q: '5⁸/5^m = 5³. What is m?',
      a: '5',
      steps: ['Same base 5: 8 − m = 3.', 'm = 8 − 3 = 5.', 'Answer: 5'],
    },
    {
      q: '2⁹/8 = 2^n. What is n?',
      a: '6',
      steps: ['Write 8 as a power of 2: 8 = 2³.', '2⁹/2³ = 2^(9 − 3) = 2⁶, so n = 6.', 'Answer: 6'],
    },
    {
      q: '3⁷/9 = 3^n. What is n?',
      a: '5',
      steps: ['Write 9 as a power of 3: 9 = 3².', '3⁷/3² = 3^(7 − 2) = 3⁵, so n = 5.', 'Answer: 5'],
    },
    {
      q: '5⁸/25 = 5^n. What is n?',
      a: '6',
      steps: [
        'Write 25 as a power of 5: 25 = 5².',
        '5⁸/5² = 5^(8 − 2) = 5⁶, so n = 6.',
        'Answer: 6',
      ],
    },
    {
      q: '10⁶/100 = 10^n. What is n?',
      a: '4',
      steps: [
        'Write 100 as a power of 10: 100 = 10².',
        '10⁶/10² = 10^(6 − 2) = 10⁴, so n = 4.',
        'Answer: 4',
      ],
    },
    {
      q: '7⁵/49 = 7^n. What is n?',
      a: '3',
      steps: [
        'Write 49 as a power of 7: 49 = 7².',
        '7⁵/7² = 7^(5 − 2) = 7³, so n = 3.',
        'Answer: 3',
      ],
    },
    {
      q: 'Assume x ≠ 0. x³/x⁸ = x^n. What is n?',
      a: '-5',
      steps: [
        'Quotient of powers: divide the numbers and subtract the exponents: x³/x⁸ = x⁻⁵.',
        'So x³/x⁸ = x⁻⁵, and n = −5.',
        'Answer: −5',
      ],
    },
    {
      q: 'Assume y ≠ 0. y²/y⁹ = y^n. What is n?',
      a: '-7',
      steps: [
        'Quotient of powers: divide the numbers and subtract the exponents: y²/y⁹ = y⁻⁷.',
        'So y²/y⁹ = y⁻⁷, and n = −7.',
        'Answer: −7',
      ],
    },
    {
      q: 'What is 2³/2⁷?',
      a: '1/16',
      form: 'fraction',
      steps: [
        'Same base 2: subtract the exponents, 3 − 7 = −4.',
        '2⁻⁴ means 1/2⁴ = 1/16.',
        'Answer: 1/16',
      ],
    },
    {
      q: 'Assume x ≠ 0. x⁴/x¹⁰ = x^n. What is n?',
      a: '-6',
      steps: [
        'Quotient of powers: divide the numbers and subtract the exponents: x⁴/x¹⁰ = x⁻⁶.',
        'So x⁴/x¹⁰ = x⁻⁶, and n = −6.',
        'Answer: −6',
      ],
    },
    {
      q: '2^(3x)/2^(x − 1) = 2⁹. What is x?',
      a: '4',
      steps: [
        'Same base 2: subtract the exponents, (3x) − (x − 1) = 2x + 1.',
        'So 2x + 1 = 9, which gives 2x = 8.',
        'x = 4.',
        'Answer: 4',
      ],
    },
    {
      q: '3^(2x + 5)/3^(x + 1) = 3¹⁰. What is x?',
      a: '6',
      steps: [
        'Same base 3: subtract the exponents, (2x + 5) − (x + 1) = x + 4.',
        'So x + 4 = 10, which gives x = 6.',
        'x = 6.',
        'Answer: 6',
      ],
    },
    {
      q: '7^(4x)/7^(x + 3) = 7¹². What is x?',
      a: '5',
      steps: [
        'Same base 7: subtract the exponents, (4x) − (x + 3) = 3x − 3.',
        'So 3x − 3 = 12, which gives 3x = 15.',
        'x = 5.',
        'Answer: 5',
      ],
    },
    {
      q: '5^(x + 9)/5^(2x − 1) = 5³. What is x?',
      a: '7',
      steps: [
        'Same base 5: subtract the exponents, (x + 9) − (2x − 1) = -1x + 10.',
        'So -1x + 10 = 3, which gives -1x = -7.',
        'x = 7.',
        'Answer: 7',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. (18x⁹y⁴)/(6x³y) = c·x^m·y^n. What is m + n?',
      a: '9',
      steps: [
        'Quotient of powers: divide the numbers and subtract the exponents: (18x⁹y⁴)/(6x³y) = 3x⁶y³.',
        'So (18x⁹y⁴)/(6x³y) = 3x⁶y³, and m + n = 6 + 3 = 9.',
        'Answer: 9',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. (x⁷y³)/(x²y⁵) = x^m·y^n. What is m + n?',
      a: '3',
      steps: [
        'Quotient of powers: divide the numbers and subtract the exponents: (x⁷y³)/(x²y⁵) = x⁵y⁻².',
        'So (x⁷y³)/(x²y⁵) = x⁵y⁻², and m + n = 5 + (−2) = 3.',
        'Answer: 3',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. (−36x⁶y⁵)/(9x⁴y²) = c·x^m·y^n. What is c?',
      a: '-4',
      steps: [
        'Quotient of powers: divide the numbers and subtract the exponents: (−36x⁶y⁵)/(9x⁴y²) = −4x²y³.',
        'So (−36x⁶y⁵)/(9x⁴y²) = −4x²y³, and c = −4.',
        'Answer: −4',
      ],
    },
  ],
  powerpower: [
    {
      q: 'What is (2²)³?',
      a: '64',
      steps: [
        'Power of a power: keep the base and multiply the exponents.',
        '(2²)³ = 2^(2·3) = 2⁶.',
        '2⁶ = 64.',
        'Answer: 64',
      ],
    },
    {
      q: 'What is (3²)²?',
      a: '81',
      steps: [
        'Power of a power: keep the base and multiply the exponents.',
        '(3²)² = 3^(2·2) = 3⁴.',
        '3⁴ = 81.',
        'Answer: 81',
      ],
    },
    {
      q: 'What is (10²)³?',
      a: '1000000',
      steps: [
        'Power of a power: keep the base and multiply the exponents.',
        '(10²)³ = 10^(2·3) = 10⁶.',
        '10⁶ = 1000000.',
        'Answer: 1000000',
      ],
    },
    {
      q: 'What is (2³)³?',
      a: '512',
      steps: [
        'Power of a power: keep the base and multiply the exponents.',
        '(2³)³ = 2^(3·3) = 2⁹.',
        '2⁹ = 512.',
        'Answer: 512',
      ],
    },
    {
      q: 'What is (5²)²?',
      a: '625',
      steps: [
        'Power of a power: keep the base and multiply the exponents.',
        '(5²)² = 5^(2·2) = 5⁴.',
        '5⁴ = 625.',
        'Answer: 625',
      ],
    },
    {
      q: 'What is (4²)³?',
      a: '4096',
      steps: [
        'Power of a power: keep the base and multiply the exponents.',
        '(4²)³ = 4^(2·3) = 4⁶.',
        '4⁶ = 4096.',
        'Answer: 4096',
      ],
    },
    {
      q: '(x²)⁵ = x^n. What is n?',
      a: '10',
      steps: [
        'Power of a power: multiply the exponents: (x²)⁵ = x^(2·5) = x¹⁰.',
        'So (x²)⁵ = x¹⁰, and n = 10.',
        'Answer: 10',
      ],
    },
    {
      q: '(x³)⁴ = x^n. What is n?',
      a: '12',
      steps: [
        'Power of a power: multiply the exponents: (x³)⁴ = x^(3·4) = x¹².',
        'So (x³)⁴ = x¹², and n = 12.',
        'Answer: 12',
      ],
    },
    {
      q: '(x⁶)² = x^n. What is n?',
      a: '12',
      steps: [
        'Power of a power: multiply the exponents: (x⁶)² = x^(6·2) = x¹².',
        'So (x⁶)² = x¹², and n = 12.',
        'Answer: 12',
      ],
    },
    {
      q: '(x⁷)³ = x^n. What is n?',
      a: '21',
      steps: [
        'Power of a power: multiply the exponents: (x⁷)³ = x^(7·3) = x²¹.',
        'So (x⁷)³ = x²¹, and n = 21.',
        'Answer: 21',
      ],
    },
    {
      q: '(x⁵)⁵ = x^n. What is n?',
      a: '25',
      steps: [
        'Power of a power: multiply the exponents: (x⁵)⁵ = x^(5·5) = x²⁵.',
        'So (x⁵)⁵ = x²⁵, and n = 25.',
        'Answer: 25',
      ],
    },
    {
      q: '(x⁸)² = x^n. What is n?',
      a: '16',
      steps: [
        'Power of a power: multiply the exponents: (x⁸)² = x^(8·2) = x¹⁶.',
        'So (x⁸)² = x¹⁶, and n = 16.',
        'Answer: 16',
      ],
    },
    {
      q: '((x²)³)² = x^n. What is n?',
      a: '12',
      steps: [
        'Power of a power: multiply the exponents: (x²)³ = x^(2·3) = x⁶.',
        'Power of a power: multiply the exponents: ((x²)³)² = x^(2·3·2) = x¹².',
        'So ((x²)³)² = x¹², and n = 12.',
        'Answer: 12',
      ],
    },
    {
      q: '((x³)²)⁴ = x^n. What is n?',
      a: '24',
      steps: [
        'Power of a power: multiply the exponents: (x³)² = x^(3·2) = x⁶.',
        'Power of a power: multiply the exponents: ((x³)²)⁴ = x^(3·2·4) = x²⁴.',
        'So ((x³)²)⁴ = x²⁴, and n = 24.',
        'Answer: 24',
      ],
    },
    {
      q: '((x²)²)⁵ = x^n. What is n?',
      a: '20',
      steps: [
        'Power of a power: multiply the exponents: (x²)² = x^(2·2) = x⁴.',
        'Power of a power: multiply the exponents: ((x²)²)⁵ = x^(2·2·5) = x²⁰.',
        'So ((x²)²)⁵ = x²⁰, and n = 20.',
        'Answer: 20',
      ],
    },
    {
      q: '((x⁴)²)² = x^n. What is n?',
      a: '16',
      steps: [
        'Power of a power: multiply the exponents: (x⁴)² = x^(4·2) = x⁸.',
        'Power of a power: multiply the exponents: ((x⁴)²)² = x^(4·2·2) = x¹⁶.',
        'So ((x⁴)²)² = x¹⁶, and n = 16.',
        'Answer: 16',
      ],
    },
    {
      q: '(x²)³·x⁴ = x^n. What is n?',
      a: '10',
      steps: [
        'Power of a power: multiply the exponents: (x²)³ = x^(2·3) = x⁶.',
        'Product of powers: multiply the numbers and add the exponents of each variable: (x²)³·x⁴ = x¹⁰.',
        'So (x²)³·x⁴ = x¹⁰, and n = 10.',
        'Answer: 10',
      ],
    },
    {
      q: '(x⁴)²·x³ = x^n. What is n?',
      a: '11',
      steps: [
        'Power of a power: multiply the exponents: (x⁴)² = x^(4·2) = x⁸.',
        'Product of powers: multiply the numbers and add the exponents of each variable: (x⁴)²·x³ = x¹¹.',
        'So (x⁴)²·x³ = x¹¹, and n = 11.',
        'Answer: 11',
      ],
    },
    {
      q: '(x⁵)³·x² = x^n. What is n?',
      a: '17',
      steps: [
        'Power of a power: multiply the exponents: (x⁵)³ = x^(5·3) = x¹⁵.',
        'Product of powers: multiply the numbers and add the exponents of each variable: (x⁵)³·x² = x¹⁷.',
        'So (x⁵)³·x² = x¹⁷, and n = 17.',
        'Answer: 17',
      ],
    },
    {
      q: '(x³)⁴·x⁷ = x^n. What is n?',
      a: '19',
      steps: [
        'Power of a power: multiply the exponents: (x³)⁴ = x^(3·4) = x¹².',
        'Product of powers: multiply the numbers and add the exponents of each variable: (x³)⁴·x⁷ = x¹⁹.',
        'So (x³)⁴·x⁷ = x¹⁹, and n = 19.',
        'Answer: 19',
      ],
    },
    {
      q: 'Assume x ≠ 0. (x³)⁴/x⁵ = x^n. What is n?',
      a: '7',
      steps: [
        'Power of a power: multiply the exponents: (x³)⁴ = x^(3·4) = x¹².',
        'Quotient of powers: divide the numbers and subtract the exponents: (x³)⁴/x⁵ = x⁷.',
        'So (x³)⁴/x⁵ = x⁷, and n = 7.',
        'Answer: 7',
      ],
    },
    {
      q: 'Assume x ≠ 0. (x²)⁶/x⁷ = x^n. What is n?',
      a: '5',
      steps: [
        'Power of a power: multiply the exponents: (x²)⁶ = x^(2·6) = x¹².',
        'Quotient of powers: divide the numbers and subtract the exponents: (x²)⁶/x⁷ = x⁵.',
        'So (x²)⁶/x⁷ = x⁵, and n = 5.',
        'Answer: 5',
      ],
    },
    {
      q: 'Assume x ≠ 0. (x⁵)³/x⁴ = x^n. What is n?',
      a: '11',
      steps: [
        'Power of a power: multiply the exponents: (x⁵)³ = x^(5·3) = x¹⁵.',
        'Quotient of powers: divide the numbers and subtract the exponents: (x⁵)³/x⁴ = x¹¹.',
        'So (x⁵)³/x⁴ = x¹¹, and n = 11.',
        'Answer: 11',
      ],
    },
    {
      q: '(x²)³·(x³)² = x^n. What is n?',
      a: '12',
      steps: [
        'Power of a power: multiply the exponents: (x²)³ = x^(2·3) = x⁶.',
        'Power of a power: multiply the exponents: (x³)² = x^(3·2) = x⁶.',
        'Product of powers: multiply the numbers and add the exponents of each variable: (x²)³·(x³)² = x¹².',
        'So (x²)³·(x³)² = x¹², and n = 12.',
        'Answer: 12',
      ],
    },
    {
      q: '(x⁴)²·(x²)⁵ = x^n. What is n?',
      a: '18',
      steps: [
        'Power of a power: multiply the exponents: (x⁴)² = x^(4·2) = x⁸.',
        'Power of a power: multiply the exponents: (x²)⁵ = x^(2·5) = x¹⁰.',
        'Product of powers: multiply the numbers and add the exponents of each variable: (x⁴)²·(x²)⁵ = x¹⁸.',
        'So (x⁴)²·(x²)⁵ = x¹⁸, and n = 18.',
        'Answer: 18',
      ],
    },
    {
      q: '(x³)³·(x⁵)² = x^n. What is n?',
      a: '19',
      steps: [
        'Power of a power: multiply the exponents: (x³)³ = x^(3·3) = x⁹.',
        'Power of a power: multiply the exponents: (x⁵)² = x^(5·2) = x¹⁰.',
        'Product of powers: multiply the numbers and add the exponents of each variable: (x³)³·(x⁵)² = x¹⁹.',
        'So (x³)³·(x⁵)² = x¹⁹, and n = 19.',
        'Answer: 19',
      ],
    },
    {
      q: '(x^m)⁴ = x²⁰. What is m?',
      a: '5',
      steps: [
        'Power of a power: multiply the exponents, so m · 4 = 20.',
        'm = 20 ÷ 4 = 5.',
        'Answer: 5',
      ],
    },
    {
      q: '(x³)^n = x²¹. What is n?',
      a: '7',
      steps: [
        'Power of a power: multiply the exponents, so 3 · n = 21.',
        'n = 21 ÷ 3 = 7.',
        'Answer: 7',
      ],
    },
    {
      q: '(2^m)³ = 2¹². What is m?',
      a: '4',
      steps: [
        'Power of a power: multiply the exponents, so m · 3 = 12.',
        'm = 12 ÷ 3 = 4.',
        'Answer: 4',
      ],
    },
    {
      q: '(3²)^n = 3¹⁰. What is n?',
      a: '5',
      steps: [
        'Power of a power: multiply the exponents, so 2 · n = 10.',
        'n = 10 ÷ 2 = 5.',
        'Answer: 5',
      ],
    },
    {
      q: 'What is (6²)²?',
      a: '1296',
      steps: [
        'Power of a power: keep the base and multiply the exponents.',
        '(6²)² = 6^(2·2) = 6⁴.',
        '6⁴ = 1296.',
        'Answer: 1296',
      ],
    },
    {
      q: 'What is (2⁵)²?',
      a: '1024',
      steps: [
        'Power of a power: keep the base and multiply the exponents.',
        '(2⁵)² = 2^(5·2) = 2¹⁰.',
        '2¹⁰ = 1024.',
        'Answer: 1024',
      ],
    },
    {
      q: 'What is (9²)²?',
      a: '6561',
      steps: [
        'Power of a power: keep the base and multiply the exponents.',
        '(9²)² = 9^(2·2) = 9⁴.',
        '9⁴ = 6561.',
        'Answer: 6561',
      ],
    },
    {
      q: 'Assume x ≠ 0. (x⁻²)⁵ = x^n. What is n?',
      a: '-10',
      steps: [
        'Power of a power: multiply the exponents: (x⁻²)⁵ = x^((−2)·5) = x⁻¹⁰.',
        'So (x⁻²)⁵ = x⁻¹⁰, and n = −10.',
        'Answer: −10',
      ],
    },
    {
      q: 'Assume x ≠ 0. (x³)⁻² = x^n. What is n?',
      a: '-6',
      steps: [
        'Power of a power: multiply the exponents: (x³)⁻² = x^(3·(−2)) = x⁻⁶.',
        'So (x³)⁻² = x⁻⁶, and n = −6.',
        'Answer: −6',
      ],
    },
    {
      q: '4³ = 2^m. What is m?',
      a: '6',
      steps: ['Write 4 as a power of 2: 4 = 2².', '(2²)³ = 2^(2·3) = 2⁶, so m = 6.', 'Answer: 6'],
    },
    {
      q: '9² = 3^m. What is m?',
      a: '4',
      steps: ['Write 9 as a power of 3: 9 = 3².', '(3²)² = 3^(2·2) = 3⁴, so m = 4.', 'Answer: 4'],
    },
    {
      q: '8² = 2^m. What is m?',
      a: '6',
      steps: ['Write 8 as a power of 2: 8 = 2³.', '(2³)² = 2^(3·2) = 2⁶, so m = 6.', 'Answer: 6'],
    },
    {
      q: '25³ = 5^m. What is m?',
      a: '6',
      steps: ['Write 25 as a power of 5: 25 = 5².', '(5²)³ = 5^(2·3) = 5⁶, so m = 6.', 'Answer: 6'],
    },
    {
      q: '27² = 3^m. What is m?',
      a: '6',
      steps: ['Write 27 as a power of 3: 27 = 3³.', '(3³)² = 3^(3·2) = 3⁶, so m = 6.', 'Answer: 6'],
    },
    {
      q: '(2^(x + 1))³ = 2¹⁵. What is x?',
      a: '4',
      steps: [
        'Power of a power: multiply the exponents, so 3(x + 1) = 15.',
        'x + 1 = 5, so x = 4.',
        'x = 4.',
        'Answer: 4',
      ],
    },
    {
      q: '(3^(2x))² = 3²⁰. What is x?',
      a: '5',
      steps: [
        'Power of a power: multiply the exponents, so 2(2x) = 20.',
        '2x = 10, so 2x = 10.',
        'x = 5.',
        'Answer: 5',
      ],
    },
    {
      q: '(5^(x − 2))⁴ = 5²⁰. What is x?',
      a: '7',
      steps: [
        'Power of a power: multiply the exponents, so 4(x − 2) = 20.',
        'x − 2 = 5, so x = 7.',
        'x = 7.',
        'Answer: 7',
      ],
    },
    {
      q: 'Assume x ≠ 0. ((x²)³·(x⁴)²)/x⁵ = x^n. What is n?',
      a: '9',
      steps: [
        'Power of a power: multiply the exponents: (x²)³ = x^(2·3) = x⁶.',
        'Power of a power: multiply the exponents: (x⁴)² = x^(4·2) = x⁸.',
        'Product of powers: multiply the numbers and add the exponents of each variable: (x²)³·(x⁴)² = x¹⁴.',
        'Quotient of powers: divide the numbers and subtract the exponents: ((x²)³·(x⁴)²)/x⁵ = x⁹.',
        'So ((x²)³·(x⁴)²)/x⁵ = x⁹, and n = 9.',
        'Answer: 9',
      ],
    },
    {
      q: 'Assume x ≠ 0. ((x²)⁴)³/(x⁵)⁴ = x^n. What is n?',
      a: '4',
      steps: [
        'Power of a power: multiply the exponents: (x⁵)⁴ = x^(5·4) = x²⁰.',
        'Power of a power: multiply the exponents: (x²)⁴ = x^(2·4) = x⁸.',
        'Power of a power: multiply the exponents: ((x²)⁴)³ = x^(2·4·3) = x²⁴.',
        'Quotient of powers: divide the numbers and subtract the exponents: ((x²)⁴)³/(x⁵)⁴ = x⁴.',
        'So ((x²)⁴)³/(x⁵)⁴ = x⁴, and n = 4.',
        'Answer: 4',
      ],
    },
    {
      q: 'Assume x ≠ 0. ((x³)⁴·(x²)⁵)/(x⁶)³ = x^n. What is n?',
      a: '4',
      steps: [
        'Power of a power: multiply the exponents: (x⁶)³ = x^(6·3) = x¹⁸.',
        'Power of a power: multiply the exponents: (x³)⁴ = x^(3·4) = x¹².',
        'Power of a power: multiply the exponents: (x²)⁵ = x^(2·5) = x¹⁰.',
        'Product of powers: multiply the numbers and add the exponents of each variable: (x³)⁴·(x²)⁵ = x²².',
        'Quotient of powers: divide the numbers and subtract the exponents: ((x³)⁴·(x²)⁵)/(x⁶)³ = x⁴.',
        'So ((x³)⁴·(x²)⁵)/(x⁶)³ = x⁴, and n = 4.',
        'Answer: 4',
      ],
    },
    {
      q: 'Assume x ≠ 0. ((x³)²)²/(x²·x³) = x^n. What is n?',
      a: '7',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: x²·x³ = x⁵.',
        'Power of a power: multiply the exponents: (x³)² = x^(3·2) = x⁶.',
        'Power of a power: multiply the exponents: ((x³)²)² = x^(3·2·2) = x¹².',
        'Quotient of powers: divide the numbers and subtract the exponents: ((x³)²)²/(x²·x³) = x⁷.',
        'So ((x³)²)²/(x²·x³) = x⁷, and n = 7.',
        'Answer: 7',
      ],
    },
    {
      q: '(x²)⁵·(y³)⁴ = x^m·y^n. What is m + n?',
      a: '22',
      steps: [
        'Power of a power: multiply the exponents: (x²)⁵ = x^(2·5) = x¹⁰.',
        'Power of a power: multiply the exponents: (y³)⁴ = y^(3·4) = y¹².',
        'Product of powers: multiply the numbers and add the exponents of each variable: (x²)⁵·(y³)⁴ = x¹⁰y¹².',
        'So (x²)⁵·(y³)⁴ = x¹⁰y¹², and m + n = 10 + 12 = 22.',
        'Answer: 22',
      ],
    },
    {
      q: '(x⁴)²·(y²)⁶ = x^m·y^n. What is m + n?',
      a: '20',
      steps: [
        'Power of a power: multiply the exponents: (x⁴)² = x^(4·2) = x⁸.',
        'Power of a power: multiply the exponents: (y²)⁶ = y^(2·6) = y¹².',
        'Product of powers: multiply the numbers and add the exponents of each variable: (x⁴)²·(y²)⁶ = x⁸y¹².',
        'So (x⁴)²·(y²)⁶ = x⁸y¹², and m + n = 8 + 12 = 20.',
        'Answer: 20',
      ],
    },
    {
      q: 'What is (2²)³ · (2³)² / 2⁵?',
      a: '128',
      steps: [
        'Power of a power: (2²)³ = 2⁶ and (2³)² = 2⁶.',
        'Product and quotient of powers: 2⁶ · 2⁶ / 2⁵ = 2^(6 + 6 − 5) = 2⁷.',
        '2⁷ = 128.',
        'Answer: 128',
      ],
    },
  ],
  powerproduct: [
    {
      q: 'What is (2 · 3)²?',
      a: '36',
      steps: [
        'Power of a product: raise each factor to the power 2.',
        '(2 · 3)² = 2² · 3² = 4 · 9 = 36.',
        'Answer: 36',
      ],
    },
    {
      q: 'What is (2 · 5)³?',
      a: '1000',
      steps: [
        'Power of a product: raise each factor to the power 3.',
        '(2 · 5)³ = 2³ · 5³ = 8 · 125 = 1000.',
        'Answer: 1000',
      ],
    },
    {
      q: 'What is (3 · 4)²?',
      a: '144',
      steps: [
        'Power of a product: raise each factor to the power 2.',
        '(3 · 4)² = 3² · 4² = 9 · 16 = 144.',
        'Answer: 144',
      ],
    },
    {
      q: 'What is (2 · 4)³?',
      a: '512',
      steps: [
        'Power of a product: raise each factor to the power 3.',
        '(2 · 4)³ = 2³ · 4³ = 8 · 64 = 512.',
        'Answer: 512',
      ],
    },
    {
      q: 'What is (2 · 3)³?',
      a: '216',
      steps: [
        'Power of a product: raise each factor to the power 3.',
        '(2 · 3)³ = 2³ · 3³ = 8 · 27 = 216.',
        'Answer: 216',
      ],
    },
    {
      q: 'What is (3 · 5)²?',
      a: '225',
      steps: [
        'Power of a product: raise each factor to the power 2.',
        '(3 · 5)² = 3² · 5² = 9 · 25 = 225.',
        'Answer: 225',
      ],
    },
    {
      q: '(2x)³ = c·x^n. What is c?',
      a: '8',
      steps: [
        'Power of a product: raise every factor to the power: (2x)³ = 2³·x³ = 8x³.',
        'So (2x)³ = 8x³, and c = 8.',
        'Answer: 8',
      ],
    },
    {
      q: '(5x)² = c·x^n. What is c?',
      a: '25',
      steps: [
        'Power of a product: raise every factor to the power: (5x)² = 5²·x² = 25x².',
        'So (5x)² = 25x², and c = 25.',
        'Answer: 25',
      ],
    },
    {
      q: '(3x)³ = c·x^n. What is c?',
      a: '27',
      steps: [
        'Power of a product: raise every factor to the power: (3x)³ = 3³·x³ = 27x³.',
        'So (3x)³ = 27x³, and c = 27.',
        'Answer: 27',
      ],
    },
    {
      q: '(4x)² = c·x^n. What is c?',
      a: '16',
      steps: [
        'Power of a product: raise every factor to the power: (4x)² = 4²·x² = 16x².',
        'So (4x)² = 16x², and c = 16.',
        'Answer: 16',
      ],
    },
    {
      q: '(xy)⁵ = x^m·y^n. What is m?',
      a: '5',
      steps: [
        'Power of a product: raise every factor to the power: (xy)⁵ = x⁵·y⁵ = x⁵y⁵.',
        'So (xy)⁵ = x⁵y⁵, and m = 5.',
        'Answer: 5',
      ],
    },
    {
      q: '(xy)⁷ = x^m·y^n. What is m?',
      a: '7',
      steps: [
        'Power of a product: raise every factor to the power: (xy)⁷ = x⁷·y⁷ = x⁷y⁷.',
        'So (xy)⁷ = x⁷y⁷, and m = 7.',
        'Answer: 7',
      ],
    },
    {
      q: '(xy)³ = x^m·y^n. What is m?',
      a: '3',
      steps: [
        'Power of a product: raise every factor to the power: (xy)³ = x³·y³ = x³y³.',
        'So (xy)³ = x³y³, and m = 3.',
        'Answer: 3',
      ],
    },
    {
      q: '(xy)⁶ = x^m·y^n. What is m + n?',
      a: '12',
      steps: [
        'Power of a product: raise every factor to the power: (xy)⁶ = x⁶·y⁶ = x⁶y⁶.',
        'So (xy)⁶ = x⁶y⁶, and m + n = 6 + 6 = 12.',
        'Answer: 12',
      ],
    },
    {
      q: '(xy)⁴ = x^m·y^n. What is m + n?',
      a: '8',
      steps: [
        'Power of a product: raise every factor to the power: (xy)⁴ = x⁴·y⁴ = x⁴y⁴.',
        'So (xy)⁴ = x⁴y⁴, and m + n = 4 + 4 = 8.',
        'Answer: 8',
      ],
    },
    {
      q: '(xy)⁸ = x^m·y^n. What is m + n?',
      a: '16',
      steps: [
        'Power of a product: raise every factor to the power: (xy)⁸ = x⁸·y⁸ = x⁸y⁸.',
        'So (xy)⁸ = x⁸y⁸, and m + n = 8 + 8 = 16.',
        'Answer: 16',
      ],
    },
    {
      q: '(−3x)² = c·x^n. What is c?',
      a: '9',
      steps: [
        'Power of a product: raise every factor to the power: (−3x)² = (−3)²·x² = 9x².',
        'So (−3x)² = 9x², and c = 9.',
        'Answer: 9',
      ],
    },
    {
      q: '(−2x)³ = c·x^n. What is c?',
      a: '-8',
      steps: [
        'Power of a product: raise every factor to the power: (−2x)³ = (−2)³·x³ = −8x³.',
        'So (−2x)³ = −8x³, and c = −8.',
        'Answer: −8',
      ],
    },
    {
      q: '(−5x)² = c·x^n. What is c?',
      a: '25',
      steps: [
        'Power of a product: raise every factor to the power: (−5x)² = (−5)²·x² = 25x².',
        'So (−5x)² = 25x², and c = 25.',
        'Answer: 25',
      ],
    },
    {
      q: '(2x³)² = c·x^n. What is n?',
      a: '6',
      steps: [
        'Power of a product: raise every factor to the power: (2x³)² = 2²·(x³)² = 4x⁶.',
        'So (2x³)² = 4x⁶, and n = 6.',
        'Answer: 6',
      ],
    },
    {
      q: '(3x²)³ = c·x^n. What is c?',
      a: '27',
      steps: [
        'Power of a product: raise every factor to the power: (3x²)³ = 3³·(x²)³ = 27x⁶.',
        'So (3x²)³ = 27x⁶, and c = 27.',
        'Answer: 27',
      ],
    },
    {
      q: '(5x⁴)² = c·x^n. What is n?',
      a: '8',
      steps: [
        'Power of a product: raise every factor to the power: (5x⁴)² = 5²·(x⁴)² = 25x⁸.',
        'So (5x⁴)² = 25x⁸, and n = 8.',
        'Answer: 8',
      ],
    },
    {
      q: '(−2x²)³ = c·x^n. What is c?',
      a: '-8',
      steps: [
        'Power of a product: raise every factor to the power: (−2x²)³ = (−2)³·(x²)³ = −8x⁶.',
        'So (−2x²)³ = −8x⁶, and c = −8.',
        'Answer: −8',
      ],
    },
    {
      q: '(4x³)² = c·x^n. What is c?',
      a: '16',
      steps: [
        'Power of a product: raise every factor to the power: (4x³)² = 4²·(x³)² = 16x⁶.',
        'So (4x³)² = 16x⁶, and c = 16.',
        'Answer: 16',
      ],
    },
    {
      q: '(2x⁵)⁴ = c·x^n. What is n?',
      a: '20',
      steps: [
        'Power of a product: raise every factor to the power: (2x⁵)⁴ = 2⁴·(x⁵)⁴ = 16x²⁰.',
        'So (2x⁵)⁴ = 16x²⁰, and n = 20.',
        'Answer: 20',
      ],
    },
    {
      q: '(x²y³)⁴ = x^m·y^n. What is m?',
      a: '8',
      steps: [
        'Power of a product: raise every factor to the power: (x²y³)⁴ = (x²)⁴·(y³)⁴ = x⁸y¹².',
        'So (x²y³)⁴ = x⁸y¹², and m = 8.',
        'Answer: 8',
      ],
    },
    {
      q: '(x²y³)⁴ = x^m·y^n. What is n?',
      a: '12',
      steps: [
        'Power of a product: raise every factor to the power: (x²y³)⁴ = (x²)⁴·(y³)⁴ = x⁸y¹².',
        'So (x²y³)⁴ = x⁸y¹², and n = 12.',
        'Answer: 12',
      ],
    },
    {
      q: '(x³y⁵)² = x^m·y^n. What is m + n?',
      a: '16',
      steps: [
        'Power of a product: raise every factor to the power: (x³y⁵)² = (x³)²·(y⁵)² = x⁶y¹⁰.',
        'So (x³y⁵)² = x⁶y¹⁰, and m + n = 6 + 10 = 16.',
        'Answer: 16',
      ],
    },
    {
      q: '(x⁴y)⁵ = x^m·y^n. What is m + n?',
      a: '25',
      steps: [
        'Power of a product: raise every factor to the power: (x⁴y)⁵ = (x⁴)⁵·y⁵ = x²⁰y⁵.',
        'So (x⁴y)⁵ = x²⁰y⁵, and m + n = 20 + 5 = 25.',
        'Answer: 25',
      ],
    },
    {
      q: '(2xy²)³ = c·x^m·y^n. What is c?',
      a: '8',
      steps: [
        'Power of a product: raise every factor to the power: (2xy²)³ = 2³·x³·(y²)³ = 8x³y⁶.',
        'So (2xy²)³ = 8x³y⁶, and c = 8.',
        'Answer: 8',
      ],
    },
    {
      q: '(2xy²)³ = c·x^m·y^n. What is m + n?',
      a: '9',
      steps: [
        'Power of a product: raise every factor to the power: (2xy²)³ = 2³·x³·(y²)³ = 8x³y⁶.',
        'So (2xy²)³ = 8x³y⁶, and m + n = 3 + 6 = 9.',
        'Answer: 9',
      ],
    },
    {
      q: '(10x)³ = c·x^n. What is c?',
      a: '1000',
      steps: [
        'Power of a product: raise every factor to the power: (10x)³ = 10³·x³ = 1000x³.',
        'So (10x)³ = 1000x³, and c = 1000.',
        'Answer: 1000',
      ],
    },
    {
      q: '(10x²)⁴ = c·x^n. What is c + n?',
      a: '10008',
      steps: [
        'Power of a product: raise every factor to the power: (10x²)⁴ = 10⁴·(x²)⁴ = 10000x⁸.',
        'So (10x²)⁴ = 10000x⁸, and c + n = 10000 + 8 = 10008.',
        'Answer: 10008',
      ],
    },
    {
      q: '(3x²y)³ = c·x^m·y^n. What is c?',
      a: '27',
      steps: [
        'Power of a product: raise every factor to the power: (3x²y)³ = 3³·(x²)³·y³ = 27x⁶y³.',
        'So (3x²y)³ = 27x⁶y³, and c = 27.',
        'Answer: 27',
      ],
    },
    {
      q: '(3x²y)³ = c·x^m·y^n. What is m + n?',
      a: '9',
      steps: [
        'Power of a product: raise every factor to the power: (3x²y)³ = 3³·(x²)³·y³ = 27x⁶y³.',
        'So (3x²y)³ = 27x⁶y³, and m + n = 6 + 3 = 9.',
        'Answer: 9',
      ],
    },
    {
      q: '(2x³y)⁵ = c·x^m·y^n. What is c?',
      a: '32',
      steps: [
        'Power of a product: raise every factor to the power: (2x³y)⁵ = 2⁵·(x³)⁵·y⁵ = 32x¹⁵y⁵.',
        'So (2x³y)⁵ = 32x¹⁵y⁵, and c = 32.',
        'Answer: 32',
      ],
    },
    {
      q: '(2x²y)³·(xy)² = c·x^m·y^n. What is m + n?',
      a: '13',
      steps: [
        'Power of a product: raise every factor to the power: (2x²y)³ = 2³·(x²)³·y³ = 8x⁶y³.',
        'Power of a product: raise every factor to the power: (xy)² = x²·y² = x²y².',
        'Product of powers: multiply the numbers and add the exponents of each variable: (2x²y)³·(xy)² = 8x⁸y⁵.',
        'So (2x²y)³·(xy)² = 8x⁸y⁵, and m + n = 8 + 5 = 13.',
        'Answer: 13',
      ],
    },
    {
      q: '(2x²y)³·(xy)² = c·x^m·y^n. What is c?',
      a: '8',
      steps: [
        'Power of a product: raise every factor to the power: (2x²y)³ = 2³·(x²)³·y³ = 8x⁶y³.',
        'Power of a product: raise every factor to the power: (xy)² = x²·y² = x²y².',
        'Product of powers: multiply the numbers and add the exponents of each variable: (2x²y)³·(xy)² = 8x⁸y⁵.',
        'So (2x²y)³·(xy)² = 8x⁸y⁵, and c = 8.',
        'Answer: 8',
      ],
    },
    {
      q: '(−3x²)³ = c·x^n. What is c?',
      a: '-27',
      steps: [
        'Power of a product: raise every factor to the power: (−3x²)³ = (−3)³·(x²)³ = −27x⁶.',
        'So (−3x²)³ = −27x⁶, and c = −27.',
        'Answer: −27',
      ],
    },
    {
      q: '(2x³y²)⁴ = c·x^m·y^n. What is n?',
      a: '8',
      steps: [
        'Power of a product: raise every factor to the power: (2x³y²)⁴ = 2⁴·(x³)⁴·(y²)⁴ = 16x¹²y⁸.',
        'So (2x³y²)⁴ = 16x¹²y⁸, and n = 8.',
        'Answer: 8',
      ],
    },
    {
      q: '(2x³y²)⁴ = c·x^m·y^n. What is c?',
      a: '16',
      steps: [
        'Power of a product: raise every factor to the power: (2x³y²)⁴ = 2⁴·(x³)⁴·(y²)⁴ = 16x¹²y⁸.',
        'So (2x³y²)⁴ = 16x¹²y⁸, and c = 16.',
        'Answer: 16',
      ],
    },
    {
      q: '(2x³y²)⁴ = c·x^m·y^n. What is m + n?',
      a: '20',
      steps: [
        'Power of a product: raise every factor to the power: (2x³y²)⁴ = 2⁴·(x³)⁴·(y²)⁴ = 16x¹²y⁸.',
        'So (2x³y²)⁴ = 16x¹²y⁸, and m + n = 12 + 8 = 20.',
        'Answer: 20',
      ],
    },
    {
      q: '(2x^m)³ = 8x¹⁵. What is m?',
      a: '5',
      steps: [
        'Power of a product: (2x^m)³ = 2³ · x^(3m) = 8x^(3m).',
        'So 3m = 15 and m = 5.',
        'Answer: 5',
      ],
    },
    {
      q: '(cx²)³ = 125x⁶. What is c?',
      a: '5',
      steps: [
        'Power of a product: (cx²)³ = c³ · x⁶.',
        'So c³ = 125, and c = 5 because 5³ = 125.',
        'Answer: 5',
      ],
    },
    {
      q: '(3x^m)² = 9x¹⁴. What is m?',
      a: '7',
      steps: [
        'Power of a product: (3x^m)² = 3² · x^(2m) = 9x^(2m).',
        'So 2m = 14 and m = 7.',
        'Answer: 7',
      ],
    },
    {
      q: '(2x)^n = 32x⁵. What is n?',
      a: '5',
      steps: [
        'Power of a product: (2x)^n = 2^n · x^n.',
        'The power of x gives n = 5, and 2⁵ = 32 agrees.',
        'Answer: 5',
      ],
    },
    {
      q: 'What is (4 · 25)²?',
      a: '10000',
      steps: [
        'Multiply inside the parentheses first: 4 · 25 = 100.',
        '100² = 10000. (Or raise each factor: 4² · 25² = 16 · 625 = 10000.)',
        'Answer: 10000',
      ],
    },
    {
      q: 'What is (5 · 4)²?',
      a: '400',
      steps: [
        'Multiply inside the parentheses first: 5 · 4 = 20.',
        '20² = 400. (Or raise each factor: 5² · 4² = 25 · 16 = 400.)',
        'Answer: 400',
      ],
    },
    {
      q: '(−x²y³)⁵ = c·x^m·y^n. What is m + n?',
      a: '25',
      steps: [
        'Power of a product: raise every factor to the power: (−x²y³)⁵ = (−1)⁵·(x²)⁵·(y³)⁵ = −x¹⁰y¹⁵.',
        'So (−x²y³)⁵ = −x¹⁰y¹⁵, and m + n = 10 + 15 = 25.',
        'Answer: 25',
      ],
    },
    {
      q: '(−2xy²)⁴ = c·x^m·y^n. What is c?',
      a: '16',
      steps: [
        'Power of a product: raise every factor to the power: (−2xy²)⁴ = (−2)⁴·x⁴·(y²)⁴ = 16x⁴y⁸.',
        'So (−2xy²)⁴ = 16x⁴y⁸, and c = 16.',
        'Answer: 16',
      ],
    },
  ],
  powerquotient: [
    {
      q: 'What is (1/2)³?',
      a: '1/8',
      form: 'fraction',
      steps: [
        'Power of a quotient: raise the numerator and the denominator to the power 3.',
        '(1/2)³ = 1³/2³ = 1/8.',
        'Answer: 1/8',
      ],
    },
    {
      q: 'What is (3/4)²?',
      a: '9/16',
      form: 'fraction',
      steps: [
        'Power of a quotient: raise the numerator and the denominator to the power 2.',
        '(3/4)² = 3²/4² = 9/16.',
        'Answer: 9/16',
      ],
    },
    {
      q: 'What is (2/3)³?',
      a: '8/27',
      form: 'fraction',
      steps: [
        'Power of a quotient: raise the numerator and the denominator to the power 3.',
        '(2/3)³ = 2³/3³ = 8/27.',
        'Answer: 8/27',
      ],
    },
    {
      q: 'What is (4/5)²?',
      a: '16/25',
      form: 'fraction',
      steps: [
        'Power of a quotient: raise the numerator and the denominator to the power 2.',
        '(4/5)² = 4²/5² = 16/25.',
        'Answer: 16/25',
      ],
    },
    {
      q: 'What is (7/2)²?',
      a: '49/4',
      form: 'fraction',
      steps: [
        'Power of a quotient: raise the numerator and the denominator to the power 2.',
        '(7/2)² = 7²/2² = 49/4.',
        'Answer: 49/4',
      ],
    },
    {
      q: 'What is (5/3)²?',
      a: '25/9',
      form: 'fraction',
      steps: [
        'Power of a quotient: raise the numerator and the denominator to the power 2.',
        '(5/3)² = 5²/3² = 25/9.',
        'Answer: 25/9',
      ],
    },
    {
      q: '(2/3)⁴ = p/q in lowest terms. What is p + q?',
      a: '97',
      steps: [
        'Power of a quotient: (2/3)⁴ = 16/81.',
        'That fraction is already in lowest terms (2 and 3 share no factor), so p + q = 16 + 81 = 97.',
        'Answer: 97',
      ],
    },
    {
      q: '(3/4)² = p/q in lowest terms. What is p + q?',
      a: '25',
      steps: [
        'Power of a quotient: (3/4)² = 9/16.',
        'That fraction is already in lowest terms (3 and 4 share no factor), so p + q = 9 + 16 = 25.',
        'Answer: 25',
      ],
    },
    {
      q: '(1/2)⁵ = p/q in lowest terms. What is p + q?',
      a: '33',
      steps: [
        'Power of a quotient: (1/2)⁵ = 1/32.',
        'That fraction is already in lowest terms (1 and 2 share no factor), so p + q = 1 + 32 = 33.',
        'Answer: 33',
      ],
    },
    {
      q: '(3/5)³ = p/q in lowest terms. What is p + q?',
      a: '152',
      steps: [
        'Power of a quotient: (3/5)³ = 27/125.',
        'That fraction is already in lowest terms (3 and 5 share no factor), so p + q = 27 + 125 = 152.',
        'Answer: 152',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. Write (x/y)⁵ as a fraction in lowest terms with only positive exponents. What is the sum of the exponents in the numerator and the denominator?',
      a: '10',
      steps: [
        'Power of a quotient: raise the top and the bottom to the power: (x/y)⁵ = x⁵/y⁵ = x⁵y⁻⁵.',
        'With positive exponents, (x/y)⁵ = x⁵/y⁵. The exponents are 5 and 5, which add to 10.',
        'Answer: 10',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. Write (x/y)⁸ as a fraction in lowest terms with only positive exponents. What is the sum of the exponents in the numerator and the denominator?',
      a: '16',
      steps: [
        'Power of a quotient: raise the top and the bottom to the power: (x/y)⁸ = x⁸/y⁸ = x⁸y⁻⁸.',
        'With positive exponents, (x/y)⁸ = x⁸/y⁸. The exponents are 8 and 8, which add to 16.',
        'Answer: 16',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. Write (x/y)³ as a fraction in lowest terms with only positive exponents. What is the sum of the exponents in the numerator and the denominator?',
      a: '6',
      steps: [
        'Power of a quotient: raise the top and the bottom to the power: (x/y)³ = x³/y³ = x³y⁻³.',
        'With positive exponents, (x/y)³ = x³/y³. The exponents are 3 and 3, which add to 6.',
        'Answer: 6',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. Write (x/y)¹⁰ as a fraction in lowest terms with only positive exponents. What is the sum of the exponents in the numerator and the denominator?',
      a: '20',
      steps: [
        'Power of a quotient: raise the top and the bottom to the power: (x/y)¹⁰ = x¹⁰/y¹⁰ = x¹⁰y⁻¹⁰.',
        'With positive exponents, (x/y)¹⁰ = x¹⁰/y¹⁰. The exponents are 10 and 10, which add to 20.',
        'Answer: 20',
      ],
    },
    {
      q: 'Assume x ≠ 0. Write (x/3)² as a fraction in lowest terms with only positive exponents. What is the number in the denominator?',
      a: '9',
      steps: [
        'Power of a quotient: raise the top and the bottom to the power: (x/3)² = x²/3² = (1/9)x².',
        "With positive exponents, (x/3)² = x²/9. The denominator's number is 9.",
        'Answer: 9',
      ],
    },
    {
      q: 'Assume x ≠ 0. Write (x/3)³ as a fraction in lowest terms with only positive exponents. What is the number in the denominator?',
      a: '27',
      steps: [
        'Power of a quotient: raise the top and the bottom to the power: (x/3)³ = x³/3³ = (1/27)x³.',
        "With positive exponents, (x/3)³ = x³/27. The denominator's number is 27.",
        'Answer: 27',
      ],
    },
    {
      q: 'Assume x ≠ 0. Write (x/3)⁴ as a fraction in lowest terms with only positive exponents. What is the number in the denominator?',
      a: '81',
      steps: [
        'Power of a quotient: raise the top and the bottom to the power: (x/3)⁴ = x⁴/3⁴ = (1/81)x⁴.',
        "With positive exponents, (x/3)⁴ = x⁴/81. The denominator's number is 81.",
        'Answer: 81',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. Write ((2x)/(3y))³ as a fraction in lowest terms with only positive exponents. What is the number in the numerator?',
      a: '8',
      steps: [
        'Power of a quotient: raise the top and the bottom to the power: ((2x)/(3y))³ = (2x)³/(3y)³ = (8/27)x³y⁻³.',
        "With positive exponents, ((2x)/(3y))³ = (8x³)/(27y³). The numerator's number is 8.",
        'Answer: 8',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. Write ((2x)/(3y))³ as a fraction in lowest terms with only positive exponents. What is the number in the denominator?',
      a: '27',
      steps: [
        'Power of a quotient: raise the top and the bottom to the power: ((2x)/(3y))³ = (2x)³/(3y)³ = (8/27)x³y⁻³.',
        "With positive exponents, ((2x)/(3y))³ = (8x³)/(27y³). The denominator's number is 27.",
        'Answer: 27',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. Write ((3x)/(2y))⁴ as a fraction in lowest terms with only positive exponents. What is the number in the numerator?',
      a: '81',
      steps: [
        'Power of a quotient: raise the top and the bottom to the power: ((3x)/(2y))⁴ = (3x)⁴/(2y)⁴ = (81/16)x⁴y⁻⁴.',
        "With positive exponents, ((3x)/(2y))⁴ = (81x⁴)/(16y⁴). The numerator's number is 81.",
        'Answer: 81',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. Write ((3x)/(2y))⁴ as a fraction in lowest terms with only positive exponents. What is the number in the denominator?',
      a: '16',
      steps: [
        'Power of a quotient: raise the top and the bottom to the power: ((3x)/(2y))⁴ = (3x)⁴/(2y)⁴ = (81/16)x⁴y⁻⁴.',
        "With positive exponents, ((3x)/(2y))⁴ = (81x⁴)/(16y⁴). The denominator's number is 16.",
        'Answer: 16',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. Write ((5x)/(2y))² as a fraction in lowest terms with only positive exponents. What is the number in the denominator?',
      a: '4',
      steps: [
        'Power of a quotient: raise the top and the bottom to the power: ((5x)/(2y))² = (5x)²/(2y)² = (25/4)x²y⁻².',
        "With positive exponents, ((5x)/(2y))² = (25x²)/(4y²). The denominator's number is 4.",
        'Answer: 4',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. Write ((4x)/(3y))³ as a fraction in lowest terms with only positive exponents. What is the number in the numerator?',
      a: '64',
      steps: [
        'Power of a quotient: raise the top and the bottom to the power: ((4x)/(3y))³ = (4x)³/(3y)³ = (64/27)x³y⁻³.',
        "With positive exponents, ((4x)/(3y))³ = (64x³)/(27y³). The numerator's number is 64.",
        'Answer: 64',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. Write (x²/y³)⁴ as a fraction in lowest terms with only positive exponents. What is the sum of the exponents in the numerator and the denominator?',
      a: '20',
      steps: [
        'Power of a quotient: raise the top and the bottom to the power: (x²/y³)⁴ = (x²)⁴/(y³)⁴ = x⁸y⁻¹².',
        'With positive exponents, (x²/y³)⁴ = x⁸/y¹². The exponents are 8 and 12, which add to 20.',
        'Answer: 20',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. Write (x³/y²)⁵ as a fraction in lowest terms with only positive exponents. What is the sum of the exponents in the numerator and the denominator?',
      a: '25',
      steps: [
        'Power of a quotient: raise the top and the bottom to the power: (x³/y²)⁵ = (x³)⁵/(y²)⁵ = x¹⁵y⁻¹⁰.',
        'With positive exponents, (x³/y²)⁵ = x¹⁵/y¹⁰. The exponents are 15 and 10, which add to 25.',
        'Answer: 25',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. Write (x⁴/y⁵)³ as a fraction in lowest terms with only positive exponents. What is the sum of the exponents in the numerator and the denominator?',
      a: '27',
      steps: [
        'Power of a quotient: raise the top and the bottom to the power: (x⁴/y⁵)³ = (x⁴)³/(y⁵)³ = x¹²y⁻¹⁵.',
        'With positive exponents, (x⁴/y⁵)³ = x¹²/y¹⁵. The exponents are 12 and 15, which add to 27.',
        'Answer: 27',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. Write (x²/y⁷)² as a fraction in lowest terms with only positive exponents. What is the sum of the exponents in the numerator and the denominator?',
      a: '18',
      steps: [
        'Power of a quotient: raise the top and the bottom to the power: (x²/y⁷)² = (x²)²/(y⁷)² = x⁴y⁻¹⁴.',
        'With positive exponents, (x²/y⁷)² = x⁴/y¹⁴. The exponents are 4 and 14, which add to 18.',
        'Answer: 18',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. Write (x/y²)⁵ as a fraction in lowest terms with only positive exponents. What is the sum of the exponents in the numerator and the denominator?',
      a: '15',
      steps: [
        'Power of a quotient: raise the top and the bottom to the power: (x/y²)⁵ = x⁵/(y²)⁵ = x⁵y⁻¹⁰.',
        'With positive exponents, (x/y²)⁵ = x⁵/y¹⁰. The exponents are 5 and 10, which add to 15.',
        'Answer: 15',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. Write (x/y³)⁶ as a fraction in lowest terms with only positive exponents. What is the sum of the exponents in the numerator and the denominator?',
      a: '24',
      steps: [
        'Power of a quotient: raise the top and the bottom to the power: (x/y³)⁶ = x⁶/(y³)⁶ = x⁶y⁻¹⁸.',
        'With positive exponents, (x/y³)⁶ = x⁶/y¹⁸. The exponents are 6 and 18, which add to 24.',
        'Answer: 24',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. Write ((2x²)/y)³ as a fraction in lowest terms with only positive exponents. What is the number in the numerator?',
      a: '8',
      steps: [
        'Power of a quotient: raise the top and the bottom to the power: ((2x²)/y)³ = (2x²)³/y³ = 8x⁶y⁻³.',
        "With positive exponents, ((2x²)/y)³ = (8x⁶)/y³. The numerator's number is 8.",
        'Answer: 8',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. Write ((2x²)/y)³ as a fraction in lowest terms with only positive exponents. What is the sum of the exponents in the numerator and the denominator?',
      a: '9',
      steps: [
        'Power of a quotient: raise the top and the bottom to the power: ((2x²)/y)³ = (2x²)³/y³ = 8x⁶y⁻³.',
        'With positive exponents, ((2x²)/y)³ = (8x⁶)/y³. The exponents are 6 and 3, which add to 9.',
        'Answer: 9',
      ],
    },
    {
      q: 'What is (3/5)³?',
      a: '27/125',
      form: 'fraction',
      steps: [
        'Power of a quotient: raise the numerator and the denominator to the power 3.',
        '(3/5)³ = 3³/5³ = 27/125.',
        'Answer: 27/125',
      ],
    },
    {
      q: 'What is (4/3)⁴?',
      a: '256/81',
      form: 'fraction',
      steps: [
        'Power of a quotient: raise the numerator and the denominator to the power 4.',
        '(4/3)⁴ = 4⁴/3⁴ = 256/81.',
        'Answer: 256/81',
      ],
    },
    {
      q: 'What is (2/7)²?',
      a: '4/49',
      form: 'fraction',
      steps: [
        'Power of a quotient: raise the numerator and the denominator to the power 2.',
        '(2/7)² = 2²/7² = 4/49.',
        'Answer: 4/49',
      ],
    },
    {
      q: 'What is (5/2)³?',
      a: '125/8',
      form: 'fraction',
      steps: [
        'Power of a quotient: raise the numerator and the denominator to the power 3.',
        '(5/2)³ = 5³/2³ = 125/8.',
        'Answer: 125/8',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. Write ((x³y)/(2y²))² as a fraction in lowest terms with only positive exponents. What is the number in the denominator?',
      a: '4',
      steps: [
        'Power of a quotient: raise the top and the bottom to the power: ((x³y)/(2y²))² = (x³y)²/(2y²)² = (1/4)x⁶y⁻².',
        "With positive exponents, ((x³y)/(2y²))² = x⁶/(4y²). The denominator's number is 4.",
        'Answer: 4',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. Write ((x³y)/(2y²))² as a fraction in lowest terms with only positive exponents. What is the sum of the exponents in the numerator and the denominator?',
      a: '8',
      steps: [
        'Power of a quotient: raise the top and the bottom to the power: ((x³y)/(2y²))² = (x³y)²/(2y²)² = (1/4)x⁶y⁻².',
        'With positive exponents, ((x³y)/(2y²))² = x⁶/(4y²). The exponents are 6 and 2, which add to 8.',
        'Answer: 8',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. Write ((2xy²)/(3x²y))³ as a fraction in lowest terms with only positive exponents. What is the number in the numerator?',
      a: '8',
      steps: [
        'Power of a quotient: raise the top and the bottom to the power: ((2xy²)/(3x²y))³ = (2xy²)³/(3x²y)³ = (8/27)x⁻³y³.',
        "With positive exponents, ((2xy²)/(3x²y))³ = (8y³)/(27x³). The numerator's number is 8.",
        'Answer: 8',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. Write ((2xy²)/(3x²y))³ as a fraction in lowest terms with only positive exponents. What is the number in the denominator?',
      a: '27',
      steps: [
        'Power of a quotient: raise the top and the bottom to the power: ((2xy²)/(3x²y))³ = (2xy²)³/(3x²y)³ = (8/27)x⁻³y³.',
        "With positive exponents, ((2xy²)/(3x²y))³ = (8y³)/(27x³). The denominator's number is 27.",
        'Answer: 27',
      ],
    },
    {
      q: '(x/3)^n = x⁴/81. What is n?',
      a: '4',
      steps: [
        'Power of a quotient: (x/3)^n = x^n/3^n.',
        'The power of x gives n = 4, and 3⁴ = 81 agrees.',
        'Answer: 4',
      ],
    },
    {
      q: '(2/x)^n = 32/x⁵. What is n?',
      a: '5',
      steps: [
        'Power of a quotient: (2/x)^n = 2^n/x^n.',
        'The power of x gives n = 5, and 2⁵ = 32 agrees.',
        'Answer: 5',
      ],
    },
    {
      q: '(x/y)^n = x⁷/y⁷. What is n?',
      a: '7',
      steps: [
        'Power of a quotient: (x/y)^n = x^n/y^n.',
        'Matching x⁷/y⁷ gives n = 7.',
        'Answer: 7',
      ],
    },
    {
      q: '(a/3)³ = 8/27. What is a?',
      a: '2',
      steps: [
        'Power of a quotient: (a/3)³ = a³/27.',
        'So a³ = 8, and a = 2 because 2³ = 8.',
        'Answer: 2',
      ],
    },
    {
      q: '(2/b)⁴ = 16/81. What is b?',
      a: '3',
      steps: [
        'Power of a quotient: (2/b)⁴ = 16/b⁴.',
        'So b⁴ = 81, and b = 3 because 3⁴ = 81.',
        'Answer: 3',
      ],
    },
    {
      q: '(5/c)² = 25/49. What is c?',
      a: '7',
      steps: [
        'Power of a quotient: (5/c)² = 25/c².',
        'So c² = 49, and c = 7 because 7² = 49.',
        'Answer: 7',
      ],
    },
    {
      q: 'What is (2/3)³ · (3/2)²?',
      a: '2/3',
      form: 'fraction',
      steps: [
        'Power of a quotient: (2/3)³ = 8/27 and (3/2)² = 9/4.',
        'Multiply the fractions: 8/27 · 9/4 = 72/108 = 2/3.',
        'Answer: 2/3',
      ],
    },
    {
      q: 'What is (3/2)² · (2/3)³?',
      a: '2/3',
      form: 'fraction',
      steps: [
        'Power of a quotient: (3/2)² = 9/4 and (2/3)³ = 8/27.',
        'Multiply the fractions: 9/4 · 8/27 = 72/108 = 2/3.',
        'Answer: 2/3',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. (x²/y)³/(x/y²)² = x^m·y^n. What is m?',
      a: '4',
      steps: [
        'Power of a quotient: raise the top and the bottom to the power: (x/y²)² = x²/(y²)² = x²y⁻⁴.',
        'Power of a quotient: raise the top and the bottom to the power: (x²/y)³ = (x²)³/y³ = x⁶y⁻³.',
        'Quotient of powers: divide the numbers and subtract the exponents: (x²/y)³/(x/y²)² = x⁴y.',
        'So (x²/y)³/(x/y²)² = x⁴y, and m = 4.',
        'Answer: 4',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. (x²/y)³/(x/y²)² = x^m·y^n. What is n?',
      a: '1',
      steps: [
        'Power of a quotient: raise the top and the bottom to the power: (x/y²)² = x²/(y²)² = x²y⁻⁴.',
        'Power of a quotient: raise the top and the bottom to the power: (x²/y)³ = (x²)³/y³ = x⁶y⁻³.',
        'Quotient of powers: divide the numbers and subtract the exponents: (x²/y)³/(x/y²)² = x⁴y.',
        'So (x²/y)³/(x/y²)² = x⁴y, and n = 1.',
        'Answer: 1',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. (x³/y²)²/(x/y)³ = x^m·y^n. What is m + n?',
      a: '2',
      steps: [
        'Power of a quotient: raise the top and the bottom to the power: (x/y)³ = x³/y³ = x³y⁻³.',
        'Power of a quotient: raise the top and the bottom to the power: (x³/y²)² = (x³)²/(y²)² = x⁶y⁻⁴.',
        'Quotient of powers: divide the numbers and subtract the exponents: (x³/y²)²/(x/y)³ = x³y⁻¹.',
        'So (x³/y²)²/(x/y)³ = x³y⁻¹, and m + n = 3 + (−1) = 2.',
        'Answer: 2',
      ],
    },
  ],
  one: [
    {
      q: 'What is 8¹?',
      a: '8',
      steps: ['A number to the power 1 is the number itself.', '8¹ = 8.', 'Answer: 8'],
    },
    {
      q: 'What is 15¹?',
      a: '15',
      steps: ['A number to the power 1 is the number itself.', '15¹ = 15.', 'Answer: 15'],
    },
    {
      q: 'What is 100¹?',
      a: '100',
      steps: ['A number to the power 1 is the number itself.', '100¹ = 100.', 'Answer: 100'],
    },
    {
      q: 'What is (−6)¹?',
      a: '-6',
      steps: ['A number to the power 1 is the number itself.', '(−6)¹ = −6.', 'Answer: −6'],
    },
    {
      q: 'What is (3/4)¹?',
      a: '3/4',
      form: 'fraction',
      steps: ['A number to the power 1 is the number itself.', '(3/4)¹ = 3/4.', 'Answer: 3/4'],
    },
    {
      q: 'What is 0.5¹?',
      a: '0.5',
      form: 'decimal',
      steps: ['A number to the power 1 is the number itself.', '0.5¹ = 0.5.', 'Answer: 0.5'],
    },
    {
      q: 'x⁶·x = x^n. What is n?',
      a: '7',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: x⁶·x = x⁷.',
        'So x⁶·x = x⁷, and n = 7.',
        'Answer: 7',
      ],
    },
    {
      q: 'x²·x = x^n. What is n?',
      a: '3',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: x²·x = x³.',
        'So x²·x = x³, and n = 3.',
        'Answer: 3',
      ],
    },
    {
      q: 'x¹⁰·x = x^n. What is n?',
      a: '11',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: x¹⁰·x = x¹¹.',
        'So x¹⁰·x = x¹¹, and n = 11.',
        'Answer: 11',
      ],
    },
    {
      q: 'x¹·x = x^n. What is n?',
      a: '2',
      steps: [
        'One exponent: a number to the power 1 is itself: x¹ = x.',
        'Product of powers: multiply the numbers and add the exponents of each variable: x¹·x = x².',
        'So x¹·x = x², and n = 2.',
        'Answer: 2',
      ],
    },
    {
      q: 'x·x⁷ = x^n. What is n?',
      a: '8',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: x·x⁷ = x⁸.',
        'So x·x⁷ = x⁸, and n = 8.',
        'Answer: 8',
      ],
    },
    {
      q: 'x·x·x = x^n. What is n?',
      a: '3',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: x·x·x = x³.',
        'So x·x·x = x³, and n = 3.',
        'Answer: 3',
      ],
    },
    {
      q: 'x·x·x·x·x = x^n. What is n?',
      a: '5',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: x·x·x·x·x = x⁵.',
        'So x·x·x·x·x = x⁵, and n = 5.',
        'Answer: 5',
      ],
    },
    {
      q: 'y·y·y·y·y·y·y = y^n. What is n?',
      a: '7',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: y·y·y·y·y·y·y = y⁷.',
        'So y·y·y·y·y·y·y = y⁷, and n = 7.',
        'Answer: 7',
      ],
    },
    {
      q: 'x = x^n. What is n?',
      a: '1',
      steps: [
        'A variable with no written exponent has exponent 1.',
        'x = x¹, so n = 1.',
        'Answer: 1',
      ],
    },
    {
      q: 'y = y^n. What is n?',
      a: '1',
      steps: [
        'A variable with no written exponent has exponent 1.',
        'y = y¹, so n = 1.',
        'Answer: 1',
      ],
    },
    {
      q: '7 = 7^n. What is n?',
      a: '1',
      steps: [
        'A number with no written exponent has exponent 1.',
        '7 = 7¹, so n = 1.',
        'Answer: 1',
      ],
    },
    {
      q: 'Assume x ≠ 0. x⁵/x = x^n. What is n?',
      a: '4',
      steps: [
        'Quotient of powers: divide the numbers and subtract the exponents: x⁵/x = x⁴.',
        'So x⁵/x = x⁴, and n = 4.',
        'Answer: 4',
      ],
    },
    {
      q: 'Assume x ≠ 0. x⁹/x = x^n. What is n?',
      a: '8',
      steps: [
        'Quotient of powers: divide the numbers and subtract the exponents: x⁹/x = x⁸.',
        'So x⁹/x = x⁸, and n = 8.',
        'Answer: 8',
      ],
    },
    {
      q: 'Assume x ≠ 0. x²/x = x^n. What is n?',
      a: '1',
      steps: [
        'Quotient of powers: divide the numbers and subtract the exponents: x²/x = x.',
        'So x²/x = x, and n = 1.',
        'Answer: 1',
      ],
    },
    {
      q: 'Assume x ≠ 0. x¹¹/x = x^n. What is n?',
      a: '10',
      steps: [
        'Quotient of powers: divide the numbers and subtract the exponents: x¹¹/x = x¹⁰.',
        'So x¹¹/x = x¹⁰, and n = 10.',
        'Answer: 10',
      ],
    },
    {
      q: 'x·x²·x³ = x^n. What is n?',
      a: '6',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: x·x²·x³ = x⁶.',
        'So x·x²·x³ = x⁶, and n = 6.',
        'Answer: 6',
      ],
    },
    {
      q: 'y·y⁴·y⁵ = y^n. What is n?',
      a: '10',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: y·y⁴·y⁵ = y¹⁰.',
        'So y·y⁴·y⁵ = y¹⁰, and n = 10.',
        'Answer: 10',
      ],
    },
    {
      q: 'x·x⁶·x⁷ = x^n. What is n?',
      a: '14',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: x·x⁶·x⁷ = x¹⁴.',
        'So x·x⁶·x⁷ = x¹⁴, and n = 14.',
        'Answer: 14',
      ],
    },
    {
      q: '(x¹)⁵ = x^n. What is n?',
      a: '5',
      steps: [
        'One exponent: a number to the power 1 is itself: x¹ = x.',
        'Power of a power: multiply the exponents: (x¹)⁵ = x^(1·5) = x⁵.',
        'So (x¹)⁵ = x⁵, and n = 5.',
        'Answer: 5',
      ],
    },
    {
      q: 'What is (5¹)³?',
      a: '125',
      steps: ['5¹ = 5.', '5³ = 125.', 'Answer: 125'],
    },
    {
      q: 'What is (3¹)²?',
      a: '9',
      steps: ['3¹ = 3.', '3² = 9.', 'Answer: 9'],
    },
    {
      q: 'What is 7¹ · 7¹ · 7¹?',
      a: '343',
      steps: [
        '7¹ = 7, so the product is 7 · 7 · 7.',
        'Same base: 7^(1 + 1 + 1) = 7³ = 343.',
        'Answer: 343',
      ],
    },
    {
      q: 'What is 4¹ · 4¹?',
      a: '16',
      steps: ['4¹ = 4, so the product is 4 · 4.', 'Same base: 4^(1 + 1) = 4² = 16.', 'Answer: 16'],
    },
    {
      q: '5x·3x² = c·x^n. What is c?',
      a: '15',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: 5x·3x² = 15x³.',
        'So 5x·3x² = 15x³, and c = 15.',
        'Answer: 15',
      ],
    },
    {
      q: '5x·3x² = c·x^n. What is n?',
      a: '3',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: 5x·3x² = 15x³.',
        'So 5x·3x² = 15x³, and n = 3.',
        'Answer: 3',
      ],
    },
    {
      q: '7x·2x⁵ = c·x^n. What is c + n?',
      a: '20',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: 7x·2x⁵ = 14x⁶.',
        'So 7x·2x⁵ = 14x⁶, and c + n = 14 + 6 = 20.',
        'Answer: 20',
      ],
    },
    {
      q: '−4y·3y³ = c·y^n. What is c?',
      a: '-12',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: −4y·3y³ = −12y⁴.',
        'So −4y·3y³ = −12y⁴, and c = −12.',
        'Answer: −12',
      ],
    },
    {
      q: 'x^n · x = x⁸. What is n?',
      a: '7',
      steps: ['x = x¹, so the exponents add: n + 1 = 8.', 'n = 7.', 'Answer: 7'],
    },
    {
      q: 'y^n · y = y¹². What is n?',
      a: '11',
      steps: ['y = y¹, so the exponents add: n + 1 = 12.', 'n = 11.', 'Answer: 11'],
    },
    {
      q: 'x·x²·x³·x⁴ = x^n. What is n?',
      a: '10',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: x·x²·x³·x⁴ = x¹⁰.',
        'So x·x²·x³·x⁴ = x¹⁰, and n = 10.',
        'Answer: 10',
      ],
    },
    {
      q: '(x·x³)² = x^n. What is n?',
      a: '8',
      steps: [
        'Power of a product: raise every factor to the power: (x·x³)² = x²·(x³)² = x⁸.',
        'So (x·x³)² = x⁸, and n = 8.',
        'Answer: 8',
      ],
    },
    {
      q: '2x·3x·4x = c·x^n. What is c?',
      a: '24',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: 2x·3x·4x = 24x³.',
        'So 2x·3x·4x = 24x³, and c = 24.',
        'Answer: 24',
      ],
    },
    {
      q: '2x·3x·4x = c·x^n. What is c + n?',
      a: '27',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: 2x·3x·4x = 24x³.',
        'So 2x·3x·4x = 24x³, and c + n = 24 + 3 = 27.',
        'Answer: 27',
      ],
    },
    {
      q: 'x^n · x · x² = x⁹. What is n?',
      a: '6',
      steps: ['x = x¹, so the exponents add: n + 1 + 2 = 9.', 'n = 9 − 3 = 6.', 'Answer: 6'],
    },
    {
      q: 'y^n · y³ · y = y¹⁰. What is n?',
      a: '6',
      steps: ['y = y¹, so the exponents add: n + 3 + 1 = 10.', 'n = 10 − 4 = 6.', 'Answer: 6'],
    },
    {
      q: 'Assume x ≠ 0. x⁷/(x·x²) = x^n. What is n?',
      a: '4',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: x·x² = x³.',
        'Quotient of powers: divide the numbers and subtract the exponents: x⁷/(x·x²) = x⁴.',
        'So x⁷/(x·x²) = x⁴, and n = 4.',
        'Answer: 4',
      ],
    },
    {
      q: 'Assume x ≠ 0. x⁹/(x·x³) = x^n. What is n?',
      a: '5',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: x·x³ = x⁴.',
        'Quotient of powers: divide the numbers and subtract the exponents: x⁹/(x·x³) = x⁵.',
        'So x⁹/(x·x³) = x⁵, and n = 5.',
        'Answer: 5',
      ],
    },
    {
      q: 'Assume x ≠ 0. x·x⁻³ = x^n. What is n?',
      a: '-2',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: x·x⁻³ = x⁻².',
        'So x·x⁻³ = x⁻², and n = −2.',
        'Answer: −2',
      ],
    },
    {
      q: 'Assume y ≠ 0. y·y⁻⁵ = y^n. What is n?',
      a: '-4',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: y·y⁻⁵ = y⁻⁴.',
        'So y·y⁻⁵ = y⁻⁴, and n = −4.',
        'Answer: −4',
      ],
    },
    {
      q: '(3x)·(2x) = c·x^n. What is c?',
      a: '6',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: (3x)·(2x) = 6x².',
        'So (3x)·(2x) = 6x², and c = 6.',
        'Answer: 6',
      ],
    },
    {
      q: 'What is 5 · 5² · 5³?',
      a: '15625',
      steps: [
        '5 = 5¹, so the bases match.',
        'Add the exponents: 5^(1 + 2 + 3) = 5⁶ = 15625.',
        'Answer: 15625',
      ],
    },
    {
      q: 'What is 2 · 2 · 2² · 2³?',
      a: '128',
      steps: [
        '2 = 2¹, so every base is 2.',
        'Add the exponents: 2^(1 + 1 + 2 + 3) = 2⁷ = 128.',
        'Answer: 128',
      ],
    },
    {
      q: '(xy)·(x²y)·(xy³) = x^m·y^n. What is m + n?',
      a: '9',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: (xy)·(x²y)·(xy³) = x⁴y⁵.',
        'So (xy)·(x²y)·(xy³) = x⁴y⁵, and m + n = 4 + 5 = 9.',
        'Answer: 9',
      ],
    },
    {
      q: 'Assume x ≠ 0. x⁹/(x·x³·x) = x^n. What is n?',
      a: '4',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: x·x³·x = x⁵.',
        'Quotient of powers: divide the numbers and subtract the exponents: x⁹/(x·x³·x) = x⁴.',
        'So x⁹/(x·x³·x) = x⁴, and n = 4.',
        'Answer: 4',
      ],
    },
  ],
  zero: [
    {
      q: 'What is 3⁰?',
      a: '1',
      steps: ['Any non-zero base to the power 0 is 1.', '3⁰ = 1.', 'Answer: 1'],
    },
    {
      q: 'What is 9⁰?',
      a: '1',
      steps: ['Any non-zero base to the power 0 is 1.', '9⁰ = 1.', 'Answer: 1'],
    },
    {
      q: 'What is 10⁰?',
      a: '1',
      steps: ['Any non-zero base to the power 0 is 1.', '10⁰ = 1.', 'Answer: 1'],
    },
    {
      q: 'What is 100⁰?',
      a: '1',
      steps: ['Any non-zero base to the power 0 is 1.', '100⁰ = 1.', 'Answer: 1'],
    },
    {
      q: 'What is (−4)⁰?',
      a: '1',
      steps: [
        'Any non-zero base to the power 0 is 1, even a negative one.',
        '(−4)⁰ = 1.',
        'Answer: 1',
      ],
    },
    {
      q: 'What is (3/5)⁰?',
      a: '1',
      steps: ['Any non-zero base to the power 0 is 1.', '(3/5)⁰ = 1.', 'Answer: 1'],
    },
    {
      q: 'What is x⁰ when x = 7?',
      a: '1',
      steps: ['Any non-zero base to the power 0 is 1.', 'x⁰ = 7⁰ = 1.', 'Answer: 1'],
    },
    {
      q: 'What is y⁰ when y = −2?',
      a: '1',
      steps: ['Any non-zero base to the power 0 is 1.', 'y⁰ = (−2)⁰ = 1.', 'Answer: 1'],
    },
    {
      q: 'What is −3⁰?',
      a: '-1',
      steps: [
        'The exponent 0 belongs to 3, not to the minus sign.',
        '−3⁰ = −(3⁰) = −1.',
        'Answer: −1',
      ],
    },
    {
      q: 'What is −7⁰?',
      a: '-1',
      steps: [
        'The exponent 0 belongs to 7, not to the minus sign.',
        '−7⁰ = −(7⁰) = −1.',
        'Answer: −1',
      ],
    },
    {
      q: 'What is −(2)⁰?',
      a: '-1',
      steps: ['Evaluate the power first: (2)⁰ = 1.', 'Then apply the minus: −1.', 'Answer: −1'],
    },
    {
      q: 'What is 5⁰ + 5¹?',
      a: '6',
      steps: ['5⁰ = 1 and 5¹ = 5.', '1 + 5 = 6.', 'Answer: 6'],
    },
    {
      q: 'What is 9⁰ + 9⁰?',
      a: '2',
      steps: ['9⁰ = 1.', '1 + 1 = 2.', 'Answer: 2'],
    },
    {
      q: 'What is 4⁰ + 4¹ + 4²?',
      a: '21',
      steps: ['4⁰ = 1, 4¹ = 4 and 4² = 16.', '1 + 4 + 16 = 21.', 'Answer: 21'],
    },
    {
      q: 'What is 10⁰ + 10¹ + 10²?',
      a: '111',
      steps: ['10⁰ = 1, 10¹ = 10 and 10² = 100.', '1 + 10 + 100 = 111.', 'Answer: 111'],
    },
    {
      q: 'What is 6⁰ · 6²?',
      a: '36',
      steps: ['6⁰ = 1 and 6² = 36.', '1 · 36 = 36.', 'Answer: 36'],
    },
    {
      q: 'What is 6⁰ + 6⁰ + 6⁰?',
      a: '3',
      steps: ['6⁰ = 1.', '1 + 1 + 1 = 3.', 'Answer: 3'],
    },
    {
      q: 'What is 12⁰ − 1?',
      a: '0',
      steps: ['12⁰ = 1.', '1 − 1 = 0.', 'Answer: 0'],
    },
    {
      q: 'Assume x ≠ 0. 5x⁰ = c·x^n. What is c?',
      a: '5',
      steps: [
        'Zero exponent: any non-zero base to the power 0 is 1: x⁰ = 1.',
        'Product of powers: multiply the numbers and add the exponents of each variable: 5x⁰ = 5.',
        'So 5x⁰ = 5, and c = 5.',
        'Answer: 5',
      ],
    },
    {
      q: 'Assume x ≠ 0. 12x⁰ = c·x^n. What is c?',
      a: '12',
      steps: [
        'Zero exponent: any non-zero base to the power 0 is 1: x⁰ = 1.',
        'Product of powers: multiply the numbers and add the exponents of each variable: 12x⁰ = 12.',
        'So 12x⁰ = 12, and c = 12.',
        'Answer: 12',
      ],
    },
    {
      q: 'Assume y ≠ 0. −3y⁰ = c·y^n. What is c?',
      a: '-3',
      steps: [
        'Zero exponent: any non-zero base to the power 0 is 1: y⁰ = 1.',
        'Product of powers: multiply the numbers and add the exponents of each variable: −3y⁰ = −3.',
        'So −3y⁰ = −3, and c = −3.',
        'Answer: −3',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. 8x⁰y⁰ = c·x^m·y^n. What is c?',
      a: '8',
      steps: [
        'Zero exponent: any non-zero base to the power 0 is 1: x⁰ = 1.',
        'Zero exponent: any non-zero base to the power 0 is 1: y⁰ = 1.',
        'Product of powers: multiply the numbers and add the exponents of each variable: 8x⁰y⁰ = 8.',
        'So 8x⁰y⁰ = 8, and c = 8.',
        'Answer: 8',
      ],
    },
    {
      q: 'Assume x ≠ 0. What is (5x)⁰?',
      a: '1',
      steps: [
        'Power of a product: raise every factor to the power: (5x)⁰ = 5⁰·x⁰ = 1.',
        'The value is 1.',
        'Answer: 1',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. What is (3xy)⁰?',
      a: '1',
      steps: [
        'Power of a product: raise every factor to the power: (3xy)⁰ = 3⁰·x⁰·y⁰ = 1.',
        'The value is 1.',
        'Answer: 1',
      ],
    },
    {
      q: 'Assume x ≠ 0. What is (−4x²)⁰?',
      a: '1',
      steps: [
        'Power of a product: raise every factor to the power: (−4x²)⁰ = (−4)⁰·(x²)⁰ = 1.',
        'The value is 1.',
        'Answer: 1',
      ],
    },
    {
      q: 'Assume x ≠ 0. x⁸/x⁸ = x^n. What is n?',
      a: '0',
      steps: [
        'Quotient of powers: divide the numbers and subtract the exponents: x⁸/x⁸ = 1.',
        'So x⁸/x⁸ = 1, and n = 0.',
        'Answer: 0',
      ],
    },
    {
      q: 'Assume x ≠ 0. x¹²/x¹² = x^n. What is n?',
      a: '0',
      steps: [
        'Quotient of powers: divide the numbers and subtract the exponents: x¹²/x¹² = 1.',
        'So x¹²/x¹² = 1, and n = 0.',
        'Answer: 0',
      ],
    },
    {
      q: 'What is 2x⁰ + 3y⁰ when x = 4 and y = 5?',
      a: '5',
      steps: ['x⁰ = 1 and y⁰ = 1.', '2 · 1 + 3 · 1 = 5.', 'Answer: 5'],
    },
    {
      q: 'What is 7⁰ − 7¹?',
      a: '-6',
      steps: ['7⁰ = 1 and 7¹ = 7.', '1 − 7 = −6.', 'Answer: −6'],
    },
    {
      q: 'What is (x⁰)³ when x = 9?',
      a: '1',
      steps: ['x⁰ = 1.', '1³ = 1.', 'Answer: 1'],
    },
    {
      q: 'What is 100⁰ + 0⁵?',
      a: '1',
      steps: ['100⁰ = 1 and 0⁵ = 0.', '1 + 0 = 1.', 'Answer: 1'],
    },
    {
      q: 'What is (1/2)⁰ + (1/3)⁰?',
      a: '2',
      steps: ['Each non-zero base to the power 0 is 1.', '1 + 1 = 2.', 'Answer: 2'],
    },
    {
      q: 'What is 3⁰ · 4⁰ · 5⁰?',
      a: '1',
      steps: ['3⁰ = 4⁰ = 5⁰ = 1.', '1 · 1 · 1 = 1.', 'Answer: 1'],
    },
    {
      q: 'What is (−1)⁰ + (−1)¹ + (−1)²?',
      a: '1',
      steps: ['(−1)⁰ = 1, (−1)¹ = −1 and (−1)² = 1.', '1 − 1 + 1 = 1.', 'Answer: 1'],
    },
    {
      q: 'What is −4⁰ + (−4)⁰?',
      a: '0',
      steps: ['−4⁰ = −(4⁰) = −1, while (−4)⁰ = 1.', '−1 + 1 = 0.', 'Answer: 0'],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. What is (2x³y)⁰·4?',
      a: '4',
      steps: [
        'Power of a product: raise every factor to the power: (2x³y)⁰ = 2⁰·(x³)⁰·y⁰ = 1.',
        'Product of powers: multiply the numbers and add the exponents of each variable: (2x³y)⁰·4 = 4.',
        'The value is 4.',
        'Answer: 4',
      ],
    },
    {
      q: 'What is (2x³y)⁰ + 4x⁰ when x and y are not 0?',
      a: '5',
      steps: ['(2x³y)⁰ = 1 and 4x⁰ = 4 · 1 = 4.', '1 + 4 = 5.', 'Answer: 5'],
    },
    {
      q: 'What is 5(3x)⁰ − 2x⁰ when x is not 0?',
      a: '3',
      steps: ['(3x)⁰ = 1 and x⁰ = 1.', '5 · 1 − 2 · 1 = 3.', 'Answer: 3'],
    },
    {
      q: 'Assume x ≠ 0. x³·x⁻³ = x^n. What is n?',
      a: '0',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: x³·x⁻³ = 1.',
        'So x³·x⁻³ = 1, and n = 0.',
        'Answer: 0',
      ],
    },
    {
      q: 'Assume y ≠ 0. y⁷·y⁻⁷ = y^n. What is n?',
      a: '0',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: y⁷·y⁻⁷ = 1.',
        'So y⁷·y⁻⁷ = 1, and n = 0.',
        'Answer: 0',
      ],
    },
    {
      q: '2^n = 1. What is n?',
      a: '0',
      steps: ['Only the exponent 0 turns 2 into 1.', 'n = 0.', 'Answer: 0'],
    },
    {
      q: '5^n = 1. What is n?',
      a: '0',
      steps: ['Only the exponent 0 turns 5 into 1.', 'n = 0.', 'Answer: 0'],
    },
    {
      q: '10^(x − 3) = 1. What is x?',
      a: '3',
      steps: ['A power equals 1 only when its exponent is 0.', 'x − 3 = 0, so x = 3.', 'Answer: 3'],
    },
    {
      q: '3^(2x − 8) = 1. What is x?',
      a: '4',
      steps: [
        'A power equals 1 only when its exponent is 0.',
        '2x − 8 = 0, so x = 4.',
        'Answer: 4',
      ],
    },
    {
      q: 'Is 0⁰ defined? Type 1 for yes, 0 for no.',
      a: '0',
      steps: [
        'The zero exponent rule only works for a non-zero base.',
        '0⁰ is not defined, so the answer is 0.',
        'Answer: 0',
      ],
    },
    {
      q: 'Is (3² − 9)⁰ defined? Type 1 for yes, 0 for no.',
      a: '0',
      steps: [
        '3² − 9 = 0, so the base is 0.',
        '0⁰ is not defined, so the answer is 0.',
        'Answer: 0',
      ],
    },
    {
      q: 'What is (x − 5)⁰ when x = 9?',
      a: '1',
      steps: ['The base is 9 − 5 = 4, which is not 0.', '4⁰ = 1.', 'Answer: 1'],
    },
    {
      q: 'What is (2⁰ + 3⁰)²?',
      a: '4',
      steps: ['2⁰ = 1 and 3⁰ = 1, so the bracket is 2.', '2² = 4.', 'Answer: 4'],
    },
    {
      q: 'What is (5⁰ + 1)³?',
      a: '8',
      steps: ['5⁰ = 1, so the bracket is 1 + 1 = 2.', '2³ = 8.', 'Answer: 8'],
    },
    {
      q: 'What is 7x⁰ + (7x)⁰ + 7 when x is not 0?',
      a: '15',
      steps: ['7x⁰ = 7 · 1 = 7 and (7x)⁰ = 1.', '7 + 1 + 7 = 15.', 'Answer: 15'],
    },
  ],
  negative: [
    {
      q: 'What is 3⁻²?',
      a: '1/9',
      form: 'fraction',
      steps: [
        'Negative exponent: take the reciprocal and make the exponent positive.',
        '3⁻² = 1/3² = 1/9.',
        'Answer: 1/9',
      ],
    },
    {
      q: 'What is 5⁻²?',
      a: '1/25',
      form: 'fraction',
      steps: [
        'Negative exponent: take the reciprocal and make the exponent positive.',
        '5⁻² = 1/5² = 1/25.',
        'Answer: 1/25',
      ],
    },
    {
      q: 'What is 2⁻⁴?',
      a: '1/16',
      form: 'fraction',
      steps: [
        'Negative exponent: take the reciprocal and make the exponent positive.',
        '2⁻⁴ = 1/2⁴ = 1/16.',
        'Answer: 1/16',
      ],
    },
    {
      q: 'What is 10⁻³?',
      a: '1/1000',
      form: 'fraction',
      steps: [
        'Negative exponent: take the reciprocal and make the exponent positive.',
        '10⁻³ = 1/10³ = 1/1000.',
        'Answer: 1/1000',
      ],
    },
    {
      q: 'What is 4⁻²?',
      a: '1/16',
      form: 'fraction',
      steps: [
        'Negative exponent: take the reciprocal and make the exponent positive.',
        '4⁻² = 1/4² = 1/16.',
        'Answer: 1/16',
      ],
    },
    {
      q: 'What is 6⁻²?',
      a: '1/36',
      form: 'fraction',
      steps: [
        'Negative exponent: take the reciprocal and make the exponent positive.',
        '6⁻² = 1/6² = 1/36.',
        'Answer: 1/36',
      ],
    },
    {
      q: 'x⁻⁷ = 1/x^n. What is n?',
      a: '7',
      steps: [
        'Negative exponent: take the reciprocal and make the exponent positive.',
        'x⁻⁷ = 1/x⁷, so n = 7.',
        'Answer: 7',
      ],
    },
    {
      q: 'x⁻² = 1/x^n. What is n?',
      a: '2',
      steps: [
        'Negative exponent: take the reciprocal and make the exponent positive.',
        'x⁻² = 1/x², so n = 2.',
        'Answer: 2',
      ],
    },
    {
      q: 'x⁻⁹ = 1/x^n. What is n?',
      a: '9',
      steps: [
        'Negative exponent: take the reciprocal and make the exponent positive.',
        'x⁻⁹ = 1/x⁹, so n = 9.',
        'Answer: 9',
      ],
    },
    {
      q: 'x⁻¹¹ = 1/x^n. What is n?',
      a: '11',
      steps: [
        'Negative exponent: take the reciprocal and make the exponent positive.',
        'x⁻¹¹ = 1/x¹¹, so n = 11.',
        'Answer: 11',
      ],
    },
    {
      q: 'What is 1/3⁻²?',
      a: '9',
      steps: [
        'Negative exponent in the denominator: take the reciprocal and make the exponent positive.',
        '1/3⁻² = 3² = 9.',
        'Answer: 9',
      ],
    },
    {
      q: 'What is 1/5⁻²?',
      a: '25',
      steps: [
        'Negative exponent in the denominator: take the reciprocal and make the exponent positive.',
        '1/5⁻² = 5² = 25.',
        'Answer: 25',
      ],
    },
    {
      q: 'What is 1/2⁻⁴?',
      a: '16',
      steps: [
        'Negative exponent in the denominator: take the reciprocal and make the exponent positive.',
        '1/2⁻⁴ = 2⁴ = 16.',
        'Answer: 16',
      ],
    },
    {
      q: 'What is (1/3)⁻²?',
      a: '9',
      steps: [
        'Negative exponent: flip the fraction and make the exponent positive.',
        '(1/3)⁻² = (3/1)² = 9.',
        'Answer: 9',
      ],
    },
    {
      q: 'What is (1/2)⁻⁴?',
      a: '16',
      steps: [
        'Negative exponent: flip the fraction and make the exponent positive.',
        '(1/2)⁻⁴ = (2/1)⁴ = 16.',
        'Answer: 16',
      ],
    },
    {
      q: 'What is (1/5)⁻²?',
      a: '25',
      steps: [
        'Negative exponent: flip the fraction and make the exponent positive.',
        '(1/5)⁻² = (5/1)² = 25.',
        'Answer: 25',
      ],
    },
    {
      q: 'What is 1/10⁻³?',
      a: '1000',
      steps: [
        'Negative exponent in the denominator: take the reciprocal and make the exponent positive.',
        '1/10⁻³ = 10³ = 1000.',
        'Answer: 1000',
      ],
    },
    {
      q: 'What is (2/3)⁻²?',
      a: '9/4',
      form: 'fraction',
      steps: [
        'Negative exponent: flip the fraction and make the exponent positive.',
        '(2/3)⁻² = (3/2)² = 9/4.',
        'Answer: 9/4',
      ],
    },
    {
      q: 'What is (3/4)⁻²?',
      a: '16/9',
      form: 'fraction',
      steps: [
        'Negative exponent: flip the fraction and make the exponent positive.',
        '(3/4)⁻² = (4/3)² = 16/9.',
        'Answer: 16/9',
      ],
    },
    {
      q: 'What is (5/2)⁻³?',
      a: '8/125',
      form: 'fraction',
      steps: [
        'Negative exponent: flip the fraction and make the exponent positive.',
        '(5/2)⁻³ = (2/5)³ = 8/125.',
        'Answer: 8/125',
      ],
    },
    {
      q: 'What is (3/5)⁻²?',
      a: '25/9',
      form: 'fraction',
      steps: [
        'Negative exponent: flip the fraction and make the exponent positive.',
        '(3/5)⁻² = (5/3)² = 25/9.',
        'Answer: 25/9',
      ],
    },
    {
      q: 'What is (1/2)⁻⁵?',
      a: '32',
      steps: [
        'Negative exponent: flip the fraction and make the exponent positive.',
        '(1/2)⁻⁵ = 2⁵ = 32.',
        'Answer: 32',
      ],
    },
    {
      q: '3x⁻² = 3/x^m. What is m?',
      a: '2',
      steps: [
        'Negative exponent: only x moves to the denominator, the 3 stays on top.',
        '3x⁻² = 3/x², so m = 2.',
        'Answer: 2',
      ],
    },
    {
      q: '5x⁻⁴ = 5/x^m. What is m?',
      a: '4',
      steps: [
        'Negative exponent: only x moves to the denominator, the 5 stays on top.',
        '5x⁻⁴ = 5/x⁴, so m = 4.',
        'Answer: 4',
      ],
    },
    {
      q: '7x⁻³ = 7/x^m. What is m?',
      a: '3',
      steps: [
        'Negative exponent: only x moves to the denominator, the 7 stays on top.',
        '7x⁻³ = 7/x³, so m = 3.',
        'Answer: 3',
      ],
    },
    {
      q: 'What is 2⁻¹ + 2⁻²?',
      a: '3/4',
      form: 'fraction',
      steps: ['2⁻¹ = 1/2 and 2⁻² = 1/4.', '1/2 + 1/4 = 3/4.', 'Answer: 3/4'],
    },
    {
      q: 'What is 3⁻¹ + 3⁻²?',
      a: '4/9',
      form: 'fraction',
      steps: ['3⁻¹ = 1/3 and 3⁻² = 1/9.', '1/3 + 1/9 = 3/9 + 1/9 = 4/9.', 'Answer: 4/9'],
    },
    {
      q: 'What is 5⁻¹ + 5⁻²?',
      a: '6/25',
      form: 'fraction',
      steps: ['5⁻¹ = 1/5 and 5⁻² = 1/25.', '1/5 + 1/25 = 5/25 + 1/25 = 6/25.', 'Answer: 6/25'],
    },
    {
      q: 'Assume x ≠ 0. x⁻³·x⁷ = x^n. What is n?',
      a: '4',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: x⁻³·x⁷ = x⁴.',
        'So x⁻³·x⁷ = x⁴, and n = 4.',
        'Answer: 4',
      ],
    },
    {
      q: 'Assume y ≠ 0. y⁻⁶·y² = y^n. What is n?',
      a: '-4',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: y⁻⁶·y² = y⁻⁴.',
        'So y⁻⁶·y² = y⁻⁴, and n = −4.',
        'Answer: −4',
      ],
    },
    {
      q: 'Assume x ≠ 0. x⁵·x⁻⁹ = x^n. What is n?',
      a: '-4',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: x⁵·x⁻⁹ = x⁻⁴.',
        'So x⁵·x⁻⁹ = x⁻⁴, and n = −4.',
        'Answer: −4',
      ],
    },
    {
      q: 'Assume x ≠ 0. x⁻⁸/x⁻³ = x^n. What is n?',
      a: '-5',
      steps: [
        'Quotient of powers: divide the numbers and subtract the exponents: x⁻⁸/x⁻³ = x⁻⁵.',
        'So x⁻⁸/x⁻³ = x⁻⁵, and n = −5.',
        'Answer: −5',
      ],
    },
    {
      q: 'Assume y ≠ 0. y⁻²/y⁻⁹ = y^n. What is n?',
      a: '7',
      steps: [
        'Quotient of powers: divide the numbers and subtract the exponents: y⁻²/y⁻⁹ = y⁷.',
        'So y⁻²/y⁻⁹ = y⁷, and n = 7.',
        'Answer: 7',
      ],
    },
    {
      q: 'Assume x ≠ 0. (x²)⁻³ = x^n. What is n?',
      a: '-6',
      steps: [
        'Power of a power: multiply the exponents: (x²)⁻³ = x^(2·(−3)) = x⁻⁶.',
        'So (x²)⁻³ = x⁻⁶, and n = −6.',
        'Answer: −6',
      ],
    },
    {
      q: 'Assume y ≠ 0. (y⁴)⁻² = y^n. What is n?',
      a: '-8',
      steps: [
        'Power of a power: multiply the exponents: (y⁴)⁻² = y^(4·(−2)) = y⁻⁸.',
        'So (y⁴)⁻² = y⁻⁸, and n = −8.',
        'Answer: −8',
      ],
    },
    {
      q: 'Assume x ≠ 0. Write (2x)⁻³ as a fraction in lowest terms with only positive exponents. What is the number in the denominator?',
      a: '8',
      steps: [
        'Power of a product: raise every factor to the power: (2x)⁻³ = 2⁻³·x⁻³ = (1/8)x⁻³.',
        "With positive exponents, (2x)⁻³ = 1/(8x³). The denominator's number is 8.",
        'Answer: 8',
      ],
    },
    {
      q: 'Assume x ≠ 0. Write (3x)⁻² as a fraction in lowest terms with only positive exponents. What is the number in the denominator?',
      a: '9',
      steps: [
        'Power of a product: raise every factor to the power: (3x)⁻² = 3⁻²·x⁻² = (1/9)x⁻².',
        "With positive exponents, (3x)⁻² = 1/(9x²). The denominator's number is 9.",
        'Answer: 9',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. Write (5xy)⁻² as a fraction in lowest terms with only positive exponents. What is the number in the denominator?',
      a: '25',
      steps: [
        'Power of a product: raise every factor to the power: (5xy)⁻² = 5⁻²·x⁻²·y⁻² = (1/25)x⁻²y⁻².',
        "With positive exponents, (5xy)⁻² = 1/(25x²y²). The denominator's number is 25.",
        'Answer: 25',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. (x⁻²y³)⁻² = x^m·y^n. What is m + n?',
      a: '-2',
      steps: [
        'Power of a product: raise every factor to the power: (x⁻²y³)⁻² = (x⁻²)⁻²·(y³)⁻² = x⁴y⁻⁶.',
        'So (x⁻²y³)⁻² = x⁴y⁻⁶, and m + n = 4 + (−6) = −2.',
        'Answer: −2',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. (x⁻³y⁻¹)⁻² = x^m·y^n. What is m + n?',
      a: '8',
      steps: [
        'Power of a product: raise every factor to the power: (x⁻³y⁻¹)⁻² = (x⁻³)⁻²·(y⁻¹)⁻² = x⁶y².',
        'So (x⁻³y⁻¹)⁻² = x⁶y², and m + n = 6 + 2 = 8.',
        'Answer: 8',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. (x⁴y⁻²)⁻³ = x^m·y^n. What is m + n?',
      a: '-6',
      steps: [
        'Power of a product: raise every factor to the power: (x⁴y⁻²)⁻³ = (x⁴)⁻³·(y⁻²)⁻³ = x⁻¹²y⁶.',
        'So (x⁴y⁻²)⁻³ = x⁻¹²y⁶, and m + n = (−12) + 6 = −6.',
        'Answer: −6',
      ],
    },
    {
      q: 'Assume x ≠ 0. (2x⁻³)² = c·x^n. What is c?',
      a: '4',
      steps: [
        'Power of a product: raise every factor to the power: (2x⁻³)² = 2²·(x⁻³)² = 4x⁻⁶.',
        'So (2x⁻³)² = 4x⁻⁶, and c = 4.',
        'Answer: 4',
      ],
    },
    {
      q: 'Assume x ≠ 0. (2x⁻³)² = c·x^n. What is n?',
      a: '-6',
      steps: [
        'Power of a product: raise every factor to the power: (2x⁻³)² = 2²·(x⁻³)² = 4x⁻⁶.',
        'So (2x⁻³)² = 4x⁻⁶, and n = −6.',
        'Answer: −6',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. Write (3x⁻²y)⁻³ as a fraction in lowest terms with only positive exponents. What is the number in the denominator?',
      a: '27',
      steps: [
        'Power of a product: raise every factor to the power: (3x⁻²y)⁻³ = 3⁻³·(x⁻²)⁻³·y⁻³ = (1/27)x⁶y⁻³.',
        "With positive exponents, (3x⁻²y)⁻³ = x⁶/(27y³). The denominator's number is 27.",
        'Answer: 27',
      ],
    },
    {
      q: 'What is (2⁻³ · 2⁵)/2⁻²?',
      a: '16',
      steps: [
        'Product of powers on top: 2^(−3 + 5) = 2².',
        'Quotient of powers: 2²/2⁻² = 2^(2 − (−2)) = 2⁴.',
        '2⁴ = 16.',
        'Answer: 16',
      ],
    },
    {
      q: 'What is (5⁻² · 5⁴)/5⁻¹?',
      a: '125',
      steps: [
        'Product of powers on top: 5^(−2 + 4) = 5².',
        'Quotient of powers: 5²/5⁻¹ = 5^(2 − (−1)) = 5³.',
        '5³ = 125.',
        'Answer: 125',
      ],
    },
    {
      q: 'What is (3⁻¹ + 6⁻¹)⁻¹?',
      a: '2',
      steps: [
        '3⁻¹ = 1/3 and 6⁻¹ = 1/6, so the bracket is 1/3 + 1/6 = 1/2.',
        '(1/2)⁻¹ = 2.',
        'Answer: 2',
      ],
    },
    {
      q: 'What is (2⁻¹ + 4⁻¹)⁻¹?',
      a: '4/3',
      form: 'fraction',
      steps: [
        '2⁻¹ = 1/2 and 4⁻¹ = 1/4, so the bracket is 1/2 + 1/4 = 3/4.',
        '(3/4)⁻¹ = 4/3.',
        'Answer: 4/3',
      ],
    },
    {
      q: '2^x = 1/32. What is x?',
      a: '-5',
      steps: ['1/32 = 1/2⁵ = 2⁻⁵.', 'So x = −5.', 'Answer: −5'],
    },
    {
      q: '3^x = 1/81. What is x?',
      a: '-4',
      steps: ['1/81 = 1/3⁴ = 3⁻⁴.', 'So x = −4.', 'Answer: −4'],
    },
  ],
  final: [
    {
      q: 'What is (2³ · 2⁴)/2⁵?',
      a: '4',
      steps: [
        'Product of powers on top: 2³ · 2⁴ = 2^(3 + 4) = 2⁷.',
        'Quotient of powers: 2⁷/2⁵ = 2^(7 − 5) = 2².',
        '2² = 4.',
        'Answer: 4',
      ],
    },
    {
      q: 'What is (3²)² · 3²?',
      a: '729',
      steps: [
        'Power of a power: (3²)² = 3^(2·2) = 3⁴.',
        'Product of powers: 3⁴ · 3² = 3^(4 + 2) = 3⁶.',
        '3⁶ = 729.',
        'Answer: 729',
      ],
    },
    {
      q: 'Assume x ≠ 0. (x⁵·x³)/x⁴ = x^n. What is n?',
      a: '4',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: x⁵·x³ = x⁸.',
        'Quotient of powers: divide the numbers and subtract the exponents: (x⁵·x³)/x⁴ = x⁴.',
        'So (x⁵·x³)/x⁴ = x⁴, and n = 4.',
        'Answer: 4',
      ],
    },
    {
      q: '(x³)²·x⁵ = x^n. What is n?',
      a: '11',
      steps: [
        'Power of a power: multiply the exponents: (x³)² = x^(3·2) = x⁶.',
        'Product of powers: multiply the numbers and add the exponents of each variable: (x³)²·x⁵ = x¹¹.',
        'So (x³)²·x⁵ = x¹¹, and n = 11.',
        'Answer: 11',
      ],
    },
    {
      q: 'Assume x ≠ 0. (x²)⁵/x³ = x^n. What is n?',
      a: '7',
      steps: [
        'Power of a power: multiply the exponents: (x²)⁵ = x^(2·5) = x¹⁰.',
        'Quotient of powers: divide the numbers and subtract the exponents: (x²)⁵/x³ = x⁷.',
        'So (x²)⁵/x³ = x⁷, and n = 7.',
        'Answer: 7',
      ],
    },
    {
      q: '(2x³)² = c·x^n. What is c?',
      a: '4',
      steps: [
        'Power of a product: raise every factor to the power: (2x³)² = 2²·(x³)² = 4x⁶.',
        'So (2x³)² = 4x⁶, and c = 4.',
        'Answer: 4',
      ],
    },
    {
      q: '(3xy)² = c·x^m·y^n. What is m + n?',
      a: '4',
      steps: [
        'Power of a product: raise every factor to the power: (3xy)² = 3²·x²·y² = 9x²y².',
        'So (3xy)² = 9x²y², and m + n = 2 + 2 = 4.',
        'Answer: 4',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. Write (x²/y³)² as a fraction in lowest terms with only positive exponents. What is the sum of the exponents in the numerator and the denominator?',
      a: '10',
      steps: [
        'Power of a quotient: raise the top and the bottom to the power: (x²/y³)² = (x²)²/(y³)² = x⁴y⁻⁶.',
        'With positive exponents, (x²/y³)² = x⁴/y⁶. The exponents are 4 and 6, which add to 10.',
        'Answer: 10',
      ],
    },
    {
      q: 'What is (2³)²/2⁴?',
      a: '4',
      steps: [
        'Power of a power: (2³)² = 2⁶.',
        'Quotient of powers: 2⁶/2⁴ = 2².',
        '2² = 4.',
        'Answer: 4',
      ],
    },
    {
      q: '2x·3x⁴ = c·x^n. What is c + n?',
      a: '11',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: 2x·3x⁴ = 6x⁵.',
        'So 2x·3x⁴ = 6x⁵, and c + n = 6 + 5 = 11.',
        'Answer: 11',
      ],
    },
    {
      q: 'Assume x ≠ 0. (8x⁶)/(2x²) = c·x^n. What is c + n?',
      a: '8',
      steps: [
        'Quotient of powers: divide the numbers and subtract the exponents: (8x⁶)/(2x²) = 4x⁴.',
        'So (8x⁶)/(2x²) = 4x⁴, and c + n = 4 + 4 = 8.',
        'Answer: 8',
      ],
    },
    {
      q: '(x²)²·(x³)² = x^n. What is n?',
      a: '10',
      steps: [
        'Power of a power: multiply the exponents: (x²)² = x^(2·2) = x⁴.',
        'Power of a power: multiply the exponents: (x³)² = x^(3·2) = x⁶.',
        'Product of powers: multiply the numbers and add the exponents of each variable: (x²)²·(x³)² = x¹⁰.',
        'So (x²)²·(x³)² = x¹⁰, and n = 10.',
        'Answer: 10',
      ],
    },
    {
      q: 'What is 5⁰ + 2⁻¹ + 3¹?',
      a: '9/2',
      form: 'fraction',
      steps: ['5⁰ = 1, 2⁻¹ = 1/2 and 3¹ = 3.', '1 + 1/2 + 3 = 9/2.', 'Answer: 9/2'],
    },
    {
      q: 'Assume x ≠ 0. x⁶·x⁻⁴ = x^n. What is n?',
      a: '2',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: x⁶·x⁻⁴ = x².',
        'So x⁶·x⁻⁴ = x², and n = 2.',
        'Answer: 2',
      ],
    },
    {
      q: 'What is (1/2)⁻³ · 2⁻¹?',
      a: '4',
      steps: ['Negative exponent: (1/2)⁻³ = 2³ = 8.', '8 · 2⁻¹ = 8 · 1/2 = 4.', 'Answer: 4'],
    },
    {
      q: '(x²y)³ = x^m·y^n. What is m + n?',
      a: '9',
      steps: [
        'Power of a product: raise every factor to the power: (x²y)³ = (x²)³·y³ = x⁶y³.',
        'So (x²y)³ = x⁶y³, and m + n = 6 + 3 = 9.',
        'Answer: 9',
      ],
    },
    {
      q: 'Assume x ≠ 0. (x³)²/(x²·x) = x^n. What is n?',
      a: '3',
      steps: [
        'Product of powers: multiply the numbers and add the exponents of each variable: x²·x = x³.',
        'Power of a power: multiply the exponents: (x³)² = x^(3·2) = x⁶.',
        'Quotient of powers: divide the numbers and subtract the exponents: (x³)²/(x²·x) = x³.',
        'So (x³)²/(x²·x) = x³, and n = 3.',
        'Answer: 3',
      ],
    },
    {
      q: 'Assume x ≠ 0. ((x²)³·x⁵)/(x⁴)² = x^n. What is n?',
      a: '3',
      steps: [
        'Power of a power: multiply the exponents: (x⁴)² = x^(4·2) = x⁸.',
        'Power of a power: multiply the exponents: (x²)³ = x^(2·3) = x⁶.',
        'Product of powers: multiply the numbers and add the exponents of each variable: (x²)³·x⁵ = x¹¹.',
        'Quotient of powers: divide the numbers and subtract the exponents: ((x²)³·x⁵)/(x⁴)² = x³.',
        'So ((x²)³·x⁵)/(x⁴)² = x³, and n = 3.',
        'Answer: 3',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. (x²y)³/(x⁴y²) = x^m·y^n. What is m + n?',
      a: '3',
      steps: [
        'Power of a product: raise every factor to the power: (x²y)³ = (x²)³·y³ = x⁶y³.',
        'Quotient of powers: divide the numbers and subtract the exponents: (x²y)³/(x⁴y²) = x²y.',
        'So (x²y)³/(x⁴y²) = x²y, and m + n = 2 + 1 = 3.',
        'Answer: 3',
      ],
    },
    {
      q: '(x²y³)²·(xy) = x^m·y^n. What is m + n?',
      a: '12',
      steps: [
        'Power of a product: raise every factor to the power: (x²y³)² = (x²)²·(y³)² = x⁴y⁶.',
        'Product of powers: multiply the numbers and add the exponents of each variable: (x²y³)²·(xy) = x⁵y⁷.',
        'So (x²y³)²·(xy) = x⁵y⁷, and m + n = 5 + 7 = 12.',
        'Answer: 12',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. (6x⁵y³)/(2x²y) = c·x^m·y^n. What is c?',
      a: '3',
      steps: [
        'Quotient of powers: divide the numbers and subtract the exponents: (6x⁵y³)/(2x²y) = 3x³y².',
        'So (6x⁵y³)/(2x²y) = 3x³y², and c = 3.',
        'Answer: 3',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. (6x⁵y³)/(2x²y) = c·x^m·y^n. What is m + n?',
      a: '5',
      steps: [
        'Quotient of powers: divide the numbers and subtract the exponents: (6x⁵y³)/(2x²y) = 3x³y².',
        'So (6x⁵y³)/(2x²y) = 3x³y², and m + n = 3 + 2 = 5.',
        'Answer: 5',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. Write ((3x²)/y)² as a fraction in lowest terms with only positive exponents. What is the number in the numerator?',
      a: '9',
      steps: [
        'Power of a quotient: raise the top and the bottom to the power: ((3x²)/y)² = (3x²)²/y² = 9x⁴y⁻².',
        "With positive exponents, ((3x²)/y)² = (9x⁴)/y². The numerator's number is 9.",
        'Answer: 9',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. Write ((3x²)/y)² as a fraction in lowest terms with only positive exponents. What is the sum of the exponents in the numerator and the denominator?',
      a: '6',
      steps: [
        'Power of a quotient: raise the top and the bottom to the power: ((3x²)/y)² = (3x²)²/y² = 9x⁴y⁻².',
        'With positive exponents, ((3x²)/y)² = (9x⁴)/y². The exponents are 4 and 2, which add to 6.',
        'Answer: 6',
      ],
    },
    {
      q: 'Assume x ≠ 0. (2x)³/(4x²) = c·x^n. What is c?',
      a: '2',
      steps: [
        'Power of a product: raise every factor to the power: (2x)³ = 2³·x³ = 8x³.',
        'Quotient of powers: divide the numbers and subtract the exponents: (2x)³/(4x²) = 2x.',
        'So (2x)³/(4x²) = 2x, and c = 2.',
        'Answer: 2',
      ],
    },
    {
      q: 'Assume x ≠ 0. (2x)³/(4x²) = c·x^n. What is n?',
      a: '1',
      steps: [
        'Power of a product: raise every factor to the power: (2x)³ = 2³·x³ = 8x³.',
        'Quotient of powers: divide the numbers and subtract the exponents: (2x)³/(4x²) = 2x.',
        'So (2x)³/(4x²) = 2x, and n = 1.',
        'Answer: 1',
      ],
    },
    {
      q: '(3x)²·(2x²)³ = c·x^n. What is c?',
      a: '72',
      steps: [
        'Power of a product: raise every factor to the power: (3x)² = 3²·x² = 9x².',
        'Power of a product: raise every factor to the power: (2x²)³ = 2³·(x²)³ = 8x⁶.',
        'Product of powers: multiply the numbers and add the exponents of each variable: (3x)²·(2x²)³ = 72x⁸.',
        'So (3x)²·(2x²)³ = 72x⁸, and c = 72.',
        'Answer: 72',
      ],
    },
    {
      q: '(3x)²·(2x²)³ = c·x^n. What is n?',
      a: '8',
      steps: [
        'Power of a product: raise every factor to the power: (3x)² = 3²·x² = 9x².',
        'Power of a product: raise every factor to the power: (2x²)³ = 2³·(x²)³ = 8x⁶.',
        'Product of powers: multiply the numbers and add the exponents of each variable: (3x)²·(2x²)³ = 72x⁸.',
        'So (3x)²·(2x²)³ = 72x⁸, and n = 8.',
        'Answer: 8',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. (x⁻²y⁵)/(x⁻⁵y²) = x^m·y^n. What is m + n?',
      a: '6',
      steps: [
        'Quotient of powers: divide the numbers and subtract the exponents: (x⁻²y⁵)/(x⁻⁵y²) = x³y³.',
        'So (x⁻²y⁵)/(x⁻⁵y²) = x³y³, and m + n = 3 + 3 = 6.',
        'Answer: 6',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. (x⁻²y³)⁻² = x^m·y^n. What is m?',
      a: '4',
      steps: [
        'Power of a product: raise every factor to the power: (x⁻²y³)⁻² = (x⁻²)⁻²·(y³)⁻² = x⁴y⁻⁶.',
        'So (x⁻²y³)⁻² = x⁴y⁻⁶, and m = 4.',
        'Answer: 4',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. (x⁻²y³)⁻² = x^m·y^n. What is n?',
      a: '-6',
      steps: [
        'Power of a product: raise every factor to the power: (x⁻²y³)⁻² = (x⁻²)⁻²·(y³)⁻² = x⁴y⁻⁶.',
        'So (x⁻²y³)⁻² = x⁴y⁻⁶, and n = −6.',
        'Answer: −6',
      ],
    },
    {
      q: 'Assume x ≠ 0. (x³)⁻²·x⁸ = x^n. What is n?',
      a: '2',
      steps: [
        'Power of a power: multiply the exponents: (x³)⁻² = x^(3·(−2)) = x⁻⁶.',
        'Product of powers: multiply the numbers and add the exponents of each variable: (x³)⁻²·x⁸ = x².',
        'So (x³)⁻²·x⁸ = x², and n = 2.',
        'Answer: 2',
      ],
    },
    {
      q: 'Assume x ≠ 0. (x²)⁻³/(x⁻¹)² = x^n. What is n?',
      a: '-4',
      steps: [
        'Power of a power: multiply the exponents: (x⁻¹)² = x^((−1)·2) = x⁻².',
        'Power of a power: multiply the exponents: (x²)⁻³ = x^(2·(−3)) = x⁻⁶.',
        'Quotient of powers: divide the numbers and subtract the exponents: (x²)⁻³/(x⁻¹)² = x⁻⁴.',
        'So (x²)⁻³/(x⁻¹)² = x⁻⁴, and n = −4.',
        'Answer: −4',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. Write (2xy⁻¹)³·y as a fraction in lowest terms with only positive exponents. What is the number in the denominator?',
      a: '1',
      steps: [
        'Power of a product: raise every factor to the power: (2xy⁻¹)³ = 2³·x³·(y⁻¹)³ = 8x³y⁻³.',
        'Product of powers: multiply the numbers and add the exponents of each variable: (2xy⁻¹)³·y = 8x³y⁻².',
        "With positive exponents, (2xy⁻¹)³·y = (8x³)/y². The denominator's number is 1.",
        'Answer: 1',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. (2x³y)⁴/(2x²y³)² = c·x^m·y^n. What is c?',
      a: '4',
      steps: [
        'Power of a product: raise every factor to the power: (2x²y³)² = 2²·(x²)²·(y³)² = 4x⁴y⁶.',
        'Power of a product: raise every factor to the power: (2x³y)⁴ = 2⁴·(x³)⁴·y⁴ = 16x¹²y⁴.',
        'Quotient of powers: divide the numbers and subtract the exponents: (2x³y)⁴/(2x²y³)² = 4x⁸y⁻².',
        'So (2x³y)⁴/(2x²y³)² = 4x⁸y⁻², and c = 4.',
        'Answer: 4',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. (2x³y)⁴/(2x²y³)² = c·x^m·y^n. What is m + n?',
      a: '6',
      steps: [
        'Power of a product: raise every factor to the power: (2x²y³)² = 2²·(x²)²·(y³)² = 4x⁴y⁶.',
        'Power of a product: raise every factor to the power: (2x³y)⁴ = 2⁴·(x³)⁴·y⁴ = 16x¹²y⁴.',
        'Quotient of powers: divide the numbers and subtract the exponents: (2x³y)⁴/(2x²y³)² = 4x⁸y⁻².',
        'So (2x³y)⁴/(2x²y³)² = 4x⁸y⁻², and m + n = 8 + (−2) = 6.',
        'Answer: 6',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. (x²y³)⁴/(x⁵y)² = x^m·y^n. What is m + n?',
      a: '8',
      steps: [
        'Power of a product: raise every factor to the power: (x⁵y)² = (x⁵)²·y² = x¹⁰y².',
        'Power of a product: raise every factor to the power: (x²y³)⁴ = (x²)⁴·(y³)⁴ = x⁸y¹².',
        'Quotient of powers: divide the numbers and subtract the exponents: (x²y³)⁴/(x⁵y)² = x⁻²y¹⁰.',
        'So (x²y³)⁴/(x⁵y)² = x⁻²y¹⁰, and m + n = (−2) + 10 = 8.',
        'Answer: 8',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. (x²/y)³·(y/x)² = x^m·y^n. What is m + n?',
      a: '3',
      steps: [
        'Power of a quotient: raise the top and the bottom to the power: (x²/y)³ = (x²)³/y³ = x⁶y⁻³.',
        'Power of a quotient: raise the top and the bottom to the power: (y/x)² = y²/x² = x⁻²y².',
        'Product of powers: multiply the numbers and add the exponents of each variable: (x²/y)³·(y/x)² = x⁴y⁻¹.',
        'So (x²/y)³·(y/x)² = x⁴y⁻¹, and m + n = 4 + (−1) = 3.',
        'Answer: 3',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. Write ((2x⁻¹y²)/(3xy⁻²))² as a fraction in lowest terms with only positive exponents. What is the number in the numerator?',
      a: '4',
      steps: [
        'Power of a quotient: raise the top and the bottom to the power: ((2x⁻¹y²)/(3xy⁻²))² = (2x⁻¹y²)²/(3xy⁻²)² = (4/9)x⁻⁴y⁸.',
        "With positive exponents, ((2x⁻¹y²)/(3xy⁻²))² = (4y⁸)/(9x⁴). The numerator's number is 4.",
        'Answer: 4',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. Write ((2x⁻¹y²)/(3xy⁻²))² as a fraction in lowest terms with only positive exponents. What is the number in the denominator?',
      a: '9',
      steps: [
        'Power of a quotient: raise the top and the bottom to the power: ((2x⁻¹y²)/(3xy⁻²))² = (2x⁻¹y²)²/(3xy⁻²)² = (4/9)x⁻⁴y⁸.',
        "With positive exponents, ((2x⁻¹y²)/(3xy⁻²))² = (4y⁸)/(9x⁴). The denominator's number is 9.",
        'Answer: 9',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. Write ((2x⁻¹y²)/(3xy⁻²))² as a fraction in lowest terms with only positive exponents. What is the sum of the exponents in the numerator and the denominator?',
      a: '12',
      steps: [
        'Power of a quotient: raise the top and the bottom to the power: ((2x⁻¹y²)/(3xy⁻²))² = (2x⁻¹y²)²/(3xy⁻²)² = (4/9)x⁻⁴y⁸.',
        'With positive exponents, ((2x⁻¹y²)/(3xy⁻²))² = (4y⁸)/(9x⁴). The exponents are 4 and 8, which add to 12.',
        'Answer: 12',
      ],
    },
    {
      q: 'Assume x ≠ 0. ((x³)²·(x⁻⁴)²)/x⁻¹ = x^n. What is n?',
      a: '-1',
      steps: [
        'Power of a power: multiply the exponents: (x³)² = x^(3·2) = x⁶.',
        'Power of a power: multiply the exponents: (x⁻⁴)² = x^((−4)·2) = x⁻⁸.',
        'Product of powers: multiply the numbers and add the exponents of each variable: (x³)²·(x⁻⁴)² = x⁻².',
        'Quotient of powers: divide the numbers and subtract the exponents: ((x³)²·(x⁻⁴)²)/x⁻¹ = x⁻¹.',
        'So ((x³)²·(x⁻⁴)²)/x⁻¹ = x⁻¹, and n = −1.',
        'Answer: −1',
      ],
    },
    {
      q: 'Assume x ≠ 0. (−2x²)³/(4x⁻¹) = c·x^n. What is c?',
      a: '-2',
      steps: [
        'Power of a product: raise every factor to the power: (−2x²)³ = (−2)³·(x²)³ = −8x⁶.',
        'Quotient of powers: divide the numbers and subtract the exponents: (−2x²)³/(4x⁻¹) = −2x⁷.',
        'So (−2x²)³/(4x⁻¹) = −2x⁷, and c = −2.',
        'Answer: −2',
      ],
    },
    {
      q: 'Assume x ≠ 0. (−2x²)³/(4x⁻¹) = c·x^n. What is n?',
      a: '7',
      steps: [
        'Power of a product: raise every factor to the power: (−2x²)³ = (−2)³·(x²)³ = −8x⁶.',
        'Quotient of powers: divide the numbers and subtract the exponents: (−2x²)³/(4x⁻¹) = −2x⁷.',
        'So (−2x²)³/(4x⁻¹) = −2x⁷, and n = 7.',
        'Answer: 7',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. (x²y⁻¹)⁰·x⁵ = x^m·y^n. What is m?',
      a: '5',
      steps: [
        'Power of a product: raise every factor to the power: (x²y⁻¹)⁰ = (x²)⁰·(y⁻¹)⁰ = 1.',
        'Product of powers: multiply the numbers and add the exponents of each variable: (x²y⁻¹)⁰·x⁵ = x⁵.',
        'So (x²y⁻¹)⁰·x⁵ = x⁵, and m = 5.',
        'Answer: 5',
      ],
    },
    {
      q: 'Assume x ≠ 0 and y ≠ 0. ((x³y²)²·(x²)⁰)/(x⁴y⁻¹) = x^m·y^n. What is m + n?',
      a: '7',
      steps: [
        'Power of a product: raise every factor to the power: (x³y²)² = (x³)²·(y²)² = x⁶y⁴.',
        'Power of a power: multiply the exponents: (x²)⁰ = x^(2·0) = 1.',
        'Product of powers: multiply the numbers and add the exponents of each variable: (x³y²)²·(x²)⁰ = x⁶y⁴.',
        'Quotient of powers: divide the numbers and subtract the exponents: ((x³y²)²·(x²)⁰)/(x⁴y⁻¹) = x²y⁵.',
        'So ((x³y²)²·(x²)⁰)/(x⁴y⁻¹) = x²y⁵, and m + n = 2 + 5 = 7.',
        'Answer: 7',
      ],
    },
    {
      q: 'What is (2³)² · 2⁻⁴ / (2²)⁰?',
      a: '4',
      steps: [
        'Power of a power: (2³)² = 2⁶. Zero exponent: (2²)⁰ = 1.',
        'Product of powers: 2⁶ · 2⁻⁴ = 2^(6 − 4) = 2².',
        'Dividing by 1 changes nothing: 2² = 4.',
        'Answer: 4',
      ],
    },
    {
      q: 'What is (3⁻² · 3⁵)² / 3⁴?',
      a: '9',
      steps: [
        'Product of powers inside: 3^(−2 + 5) = 3³.',
        'Power of a power: (3³)² = 3⁶.',
        'Quotient of powers: 3⁶/3⁴ = 3^(6 − 4) = 3².',
        '3² = 9.',
        'Answer: 9',
      ],
    },
    {
      q: 'What is (2/3)⁻² · (3/2)² · 2⁰?',
      a: '81/16',
      form: 'fraction',
      steps: [
        'Negative exponent: (2/3)⁻² = (3/2)² = 9/4.',
        'Power of a quotient: (3/2)² = 9/4, and 2⁰ = 1.',
        '9/4 · 9/4 · 1 = 81/16.',
        'Answer: 81/16',
      ],
    },
    {
      q: 'What is (4⁻¹ + 2⁻¹)⁻²?',
      a: '16/9',
      form: 'fraction',
      steps: [
        '4⁻¹ = 1/4 and 2⁻¹ = 1/2, so the bracket is 1/4 + 1/2 = 3/4.',
        'Negative exponent: (3/4)⁻² = (4/3)² = 16/9.',
        'Answer: 16/9',
      ],
    },
  ],
};
