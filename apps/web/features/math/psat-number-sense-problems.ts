import type { GuideProblem } from './study-guide';

/** One problem: the question, the accepted answer (a math-check expression), the worked steps. */
const p = (q: string, a: string, steps: string[], form?: GuideProblem['form']): GuideProblem => ({
  q,
  a,
  steps,
  ...(form ? { form } : {}),
});

/** 25 problems per Number Sense chapter, simple to complex: 1–8 warm-up, 9–17 core, 18–25 challenge. */
export const NUMBER_SENSE_PROBLEMS: Record<string, GuideProblem[]> = {
  integers: [
    p('−4 + 9', '5', [
      'Start at −4 on the number line.',
      'Adding 9 means 9 steps right: −4 → 5.',
      'Answer: 5',
    ]),
    p('3 − 8', '-5', ['Start at 3.', 'Subtracting 8 means 8 steps left: 3 → −5.', 'Answer: −5']),
    p('−6 − 2', '-8', ['Start at −6.', 'Subtract 2: 2 steps left lands on −8.', 'Answer: −8']),
    p('7 + (−10)', '-3', [
      '+ and − side by side combine to −: 7 − 10.',
      'Start at 7 and move 10 left: −3.',
      'Answer: −3',
    ]),
    p('−5 − (−8)', '3', [
      '− and − side by side combine to +: −5 + 8.',
      'Start at −5 and move 8 right: 3.',
      'Answer: 3',
    ]),
    p('(−7)(3)', '-21', [
      '7 × 3 = 21.',
      'Opposite signs (− and +) give a negative product.',
      'Answer: −21',
    ]),
    p('(−8)(−6)', '48', ['8 × 6 = 48.', 'Same signs give a positive product.', 'Answer: 48']),
    p('−45 ÷ 9', '-5', ['45 ÷ 9 = 5.', 'Opposite signs give a negative quotient.', 'Answer: −5']),
    p('−12 + (−15)', '-27', [
      '+ − combines to −: −12 − 15.',
      'Start at −12 and move 15 more left: −27.',
      'Answer: −27',
    ]),
    p('14 − (−6) − 25', '-5', [
      '− − becomes +: 14 + 6 − 25.',
      'Left to right: 14 + 6 = 20, then 20 − 25 = −5.',
      'Answer: −5',
    ]),
    p('(−2)(−3)(−4)', '-24', [
      '2 × 3 × 4 = 24.',
      'Three negative signs: an odd number, so the product is negative.',
      'Answer: −24',
    ]),
    p('(−56) ÷ (−7) + (−3)', '5', [
      'Divide first: (−56) ÷ (−7) = 8 (same signs → positive).',
      '8 + (−3) = 8 − 3 = 5.',
      'Answer: 5',
    ]),
    p('−3 − 4 − (−9) + 1', '3', [
      '− − becomes +: −3 − 4 + 9 + 1.',
      'Left to right: −3 − 4 = −7; −7 + 9 = 2; 2 + 1 = 3.',
      'Answer: 3',
    ]),
    p('(−5)(4) − (−6)(2)', '-8', [
      'Multiply first: (−5)(4) = −20 and (−6)(2) = −12.',
      '−20 − (−12) = −20 + 12 = −8.',
      'Answer: −8',
    ]),
    p(
      'At 6 a.m. it is −7 °C. By noon the temperature rises 12 degrees, then by night it falls 9 degrees. What is the night temperature in °C?',
      '-4',
      [
        'Rises means add, falls means subtract: −7 + 12 − 9.',
        '−7 + 12 = 5; 5 − 9 = −4.',
        'Answer: −4 °C',
      ],
    ),
    p('(−1)(−1)(−1)(−1)(−1)(2)', '-2', [
      'Five factors of −1 multiply to −1 (an odd number of negatives).',
      '−1 × 2 = −2.',
      'Answer: −2',
    ]),
    p('(−72) ÷ 8 ÷ (−3)', '3', [
      'Left to right: (−72) ÷ 8 = −9.',
      '(−9) ÷ (−3) = 3 (same signs → positive).',
      'Answer: 3',
    ]),
    p('−18 ÷ (−3) × (−2) − (−7)', '-5', [
      '÷ and × left to right: −18 ÷ (−3) = 6, then 6 × (−2) = −12.',
      '−12 − (−7) = −12 + 7 = −5.',
      'Answer: −5',
    ]),
    p(
      'A submarine is at −120 m. It rises 45 m, then dives 3 times as far as it rose. At what depth (in m, as an integer) does it end?',
      '-210',
      ['It dives 3 × 45 = 135 m.', '−120 + 45 − 135 = −75 − 135 = −210.', 'Answer: −210 m'],
    ),
    p('Add all the integers from −10 to 12.', '23', [
      'Each number from −10 to 10 cancels its opposite (−10 + 10 = 0, …).',
      'Only 11 and 12 are left: 11 + 12 = 23.',
      'Answer: 23',
    ]),
    p('If a = −3 and b = 5, find (a − b) − (b − a).', '-16', [
      'a − b = −3 − 5 = −8.',
      'b − a = 5 − (−3) = 8.',
      '−8 − 8 = −16.',
      'Answer: −16',
    ]),
    p('If a = −4, b = −2 and c = 6, find a × b − c ÷ b.', '11', [
      '× and ÷ first: a × b = (−4)(−2) = 8; c ÷ b = 6 ÷ (−2) = −3.',
      '8 − (−3) = 8 + 3 = 11.',
      'Answer: 11',
    ]),
    p('(−1)(−2)(−3)(−4)(−5)', '-120', [
      '1 × 2 × 3 × 4 × 5 = 120.',
      'Five negative factors: odd, so the product is negative.',
      'Answer: −120',
    ]),
    p(
      'An account has $35. Two payments of $50 and $28 go out, then $40 is paid in. What is the balance in dollars?',
      '-3',
      [
        'Money out is subtracted, money in is added: 35 − 50 − 28 + 40.',
        '35 − 50 = −15; −15 − 28 = −43; −43 + 40 = −3.',
        'Answer: −$3 (overdrawn by $3)',
      ],
    ),
    p('Find the mean of −8, 3, −5, 10 and −10.', '-2', [
      'Sum: −8 + 3 − 5 + 10 − 10 = −10.',
      'Mean = sum ÷ count = −10 ÷ 5 = −2.',
      'Answer: −2',
    ]),
  ],

  'absolute-value': [
    p('|−13|', '13', ['−13 is 13 units from 0.', 'Answer: 13']),
    p('|8|', '8', ['8 is 8 units from 0.', 'Answer: 8']),
    p('−|−6|', '-6', [
      'Inside first: |−6| = 6.',
      'The minus sign outside the bars stays: −6.',
      'Answer: −6',
    ]),
    p('|−3| + |5|', '8', ['|−3| = 3 and |5| = 5.', '3 + 5 = 8.', 'Answer: 8']),
    p('|4 − 11|', '7', ['Inside the bars first: 4 − 11 = −7.', '|−7| = 7.', 'Answer: 7']),
    p('|−9| − |−2|', '7', ['|−9| = 9 and |−2| = 2.', '9 − 2 = 7.', 'Answer: 7']),
    p('How far apart are 3 and −5 on the number line?', '8', [
      'Distance = |3 − (−5)| = |3 + 5|.',
      '|8| = 8.',
      'Answer: 8',
    ]),
    p('|0|', '0', ['0 is 0 units from itself.', 'Answer: 0']),
    p('|−4| × |−5|', '20', ['|−4| = 4 and |−5| = 5.', '4 × 5 = 20.', 'Answer: 20']),
    p('|−20| ÷ |−4|', '5', ['|−20| = 20 and |−4| = 4.', '20 ÷ 4 = 5.', 'Answer: 5']),
    p('|−7 + 2|', '5', ['Inside first: −7 + 2 = −5.', '|−5| = 5.', 'Answer: 5']),
    p('|2 − 9| − |9 − 2|', '0', [
      '|2 − 9| = |−7| = 7.',
      '|9 − 2| = |7| = 7.',
      '7 − 7 = 0.',
      'Answer: 0',
    ]),
    p('−|8 − 15|', '-7', [
      'Inside: 8 − 15 = −7, and |−7| = 7.',
      'The minus outside makes it −7.',
      'Answer: −7',
    ]),
    p('|−3 × 4| + |−3| × |4|', '24', [
      '|−3 × 4| = |−12| = 12.',
      '|−3| × |4| = 3 × 4 = 12.',
      '12 + 12 = 24.',
      'Answer: 24',
    ]),
    p('How far apart are −12 and −4 on the number line?', '8', [
      'Distance = |−12 − (−4)| = |−12 + 4|.',
      '|−8| = 8.',
      'Answer: 8',
    ]),
    p('|−6| − |−10|', '-4', [
      '|−6| = 6 and |−10| = 10.',
      '6 − 10 = −4 (the answer can be negative; only each |…| cannot).',
      'Answer: −4',
    ]),
    p('3|−2| − |−9|', '-3', ['3|−2| = 3 × 2 = 6.', '|−9| = 9, so 6 − 9 = −3.', 'Answer: −3']),
    p('|−2 − |−7||', '9', [
      'Innermost bars first: |−7| = 7.',
      'Then −2 − 7 = −9, and |−9| = 9.',
      'Answer: 9',
    ]),
    p('|x| = 6 has two solutions. What is the negative one?', '-6', [
      'Numbers 6 units from 0: 6 and −6.',
      'Answer: −6',
    ]),
    p('What is the sum of the two solutions of |x − 3| = 5?', '6', [
      'x − 3 is 5 or −5.',
      'x − 3 = 5 → x = 8; x − 3 = −5 → x = −2.',
      '8 + (−2) = 6.',
      'Answer: 6',
    ]),
    p('What is the larger solution of |2x + 1| = 9?', '4', [
      '2x + 1 = 9 → 2x = 8 → x = 4.',
      '2x + 1 = −9 → 2x = −10 → x = −5.',
      'The larger is 4.',
      'Answer: 4',
    ]),
    p('How many integers x satisfy |x| < 4?', '7', [
      '|x| < 4 means x is less than 4 units from 0: −4 < x < 4.',
      'The integers are −3, −2, −1, 0, 1, 2, 3.',
      'Answer: 7',
    ]),
    p('A point is 5 units from −2 on the number line, to the left of −2. Where is it?', '-7', [
      'Left means subtract: −2 − 5.',
      '−2 − 5 = −7.',
      'Answer: −7',
    ]),
    p('If a = −8 and b = 7, find |a − b|.', '15', [
      'a − b = −8 − 7 = −15.',
      '|−15| = 15.',
      'Answer: 15',
    ]),
    p('Add all the integers x with |x − 2| ≤ 3.', '14', [
      '|x − 2| ≤ 3 means x is within 3 of 2: −1 ≤ x ≤ 5.',
      'The integers are −1, 0, 1, 2, 3, 4, 5.',
      'Sum: −1 + 0 + 1 + 2 + 3 + 4 + 5 = 14.',
      'Answer: 14',
    ]),
  ],

  fractions: [
    p(
      '1/4 + 2/4',
      '3/4',
      ['Same denominator: add the tops, keep the bottom.', '(1 + 2)/4 = 3/4.', 'Answer: 3/4'],
      'fraction',
    ),
    p(
      '5/7 − 2/7',
      '3/7',
      ['Same denominator: subtract the tops.', '(5 − 2)/7 = 3/7.', 'Answer: 3/7'],
      'fraction',
    ),
    p(
      '2/3 × 1/5',
      '2/15',
      ['Tops × tops: 2 × 1 = 2. Bottoms × bottoms: 3 × 5 = 15.', 'Answer: 2/15'],
      'fraction',
    ),
    p(
      '3/8 × 4 (simplify)',
      '3/2',
      [
        'Write 4 as 4/1: 3/8 × 4/1 = 12/8.',
        'Divide top and bottom by 4: 12/8 = 3/2.',
        'Answer: 3/2',
      ],
      'fraction',
    ),
    p(
      'Simplify 6/10.',
      '3/5',
      ['The greatest common factor of 6 and 10 is 2.', '6 ÷ 2 = 3 and 10 ÷ 2 = 5.', 'Answer: 3/5'],
      'fraction',
    ),
    p(
      '1/2 + 1/4',
      '3/4',
      ['Common denominator 4: 1/2 = 2/4.', '2/4 + 1/4 = 3/4.', 'Answer: 3/4'],
      'fraction',
    ),
    p(
      '3/5 ÷ 3',
      '1/5',
      ['Keep, change, flip: 3/5 × 1/3.', '3/15 = 1/5.', 'Answer: 1/5'],
      'fraction',
    ),
    p(
      'Simplify 12/18.',
      '2/3',
      [
        'The greatest common factor of 12 and 18 is 6.',
        '12 ÷ 6 = 2 and 18 ÷ 6 = 3.',
        'Answer: 2/3',
      ],
      'fraction',
    ),
    p(
      '2/3 + 1/4',
      '11/12',
      [
        'Common denominator 12: 2/3 = 8/12 and 1/4 = 3/12.',
        '8/12 + 3/12 = 11/12.',
        'Answer: 11/12',
      ],
      'fraction',
    ),
    p(
      '5/6 − 1/4',
      '7/12',
      [
        'Common denominator 12: 5/6 = 10/12 and 1/4 = 3/12.',
        '10/12 − 3/12 = 7/12.',
        'Answer: 7/12',
      ],
      'fraction',
    ),
    p(
      '4/9 × 3/8 (simplify)',
      '1/6',
      ['4 × 3 = 12 and 9 × 8 = 72, so 12/72.', 'Divide by 12: 12/72 = 1/6.', 'Answer: 1/6'],
      'fraction',
    ),
    p(
      '5/8 ÷ 5/12',
      '3/2',
      ['Keep, change, flip: 5/8 × 12/5.', '60/40 = 3/2.', 'Answer: 3/2'],
      'fraction',
    ),
    p(
      '7/10 − 2/5',
      '3/10',
      ['Common denominator 10: 2/5 = 4/10.', '7/10 − 4/10 = 3/10.', 'Answer: 3/10'],
      'fraction',
    ),
    p('2 1/2 × 4/5', '2', [
      'Change the mixed number: 2 1/2 = 5/2.',
      '5/2 × 4/5 = 20/10 = 2.',
      'Answer: 2',
    ]),
    p('What is 3/4 of 60?', '45', [
      '“Of” means multiply: 3/4 × 60.',
      '60 ÷ 4 = 15, and 15 × 3 = 45.',
      'Answer: 45',
    ]),
    p('1 ÷ 3/7', '7/3', ['Keep, change, flip: 1 × 7/3.', 'Answer: 7/3'], 'fraction'),
    p(
      '1/3 + 1/6 + 1/9',
      '11/18',
      [
        'Least common denominator of 3, 6 and 9 is 18.',
        '1/3 = 6/18, 1/6 = 3/18, 1/9 = 2/18.',
        '6 + 3 + 2 = 11, so 11/18.',
        'Answer: 11/18',
      ],
      'fraction',
    ),
    p(
      '(2/3 + 1/6) ÷ 5/4',
      '2/3',
      [
        'Brackets first: 2/3 = 4/6, so 4/6 + 1/6 = 5/6.',
        'Keep, change, flip: 5/6 × 4/5 = 20/30.',
        'Simplify: 20/30 = 2/3.',
        'Answer: 2/3',
      ],
      'fraction',
    ),
    p('3 1/3 − 1 3/4 (as a fraction)', '19/12', [
      'Change to fractions: 3 1/3 = 10/3 and 1 3/4 = 7/4.',
      'Common denominator 12: 40/12 − 21/12.',
      '= 19/12.',
      'Answer: 19/12 (or 1 7/12)',
    ]),
    p('A batch of muffins uses 3/4 cup of sugar. How many batches can you make with 6 cups?', '8', [
      'Divide: 6 ÷ 3/4.',
      'Keep, change, flip: 6 × 4/3 = 24/3 = 8.',
      'Answer: 8 batches',
    ]),
    p(
      'A tank is 2/5 full. After 12 liters are added it is 4/5 full. How many liters does the full tank hold?',
      '30',
      [
        'The 12 liters filled 4/5 − 2/5 = 2/5 of the tank.',
        'If 2/5 is 12 liters, 1/5 is 6 liters.',
        'The whole tank is 5 × 6 = 30 liters.',
        'Answer: 30',
      ],
    ),
    p(
      '(1/2)(2/3)(3/4)(4/5)(5/6)',
      '1/6',
      [
        'Each top cancels the bottom before it: 2, 3, 4 and 5 all cancel.',
        'Only 1 on top and 6 on the bottom remain.',
        'Answer: 1/6',
      ],
      'fraction',
    ),
    p(
      '1 ÷ (1/2 + 1/3)',
      '6/5',
      ['Brackets first: 1/2 + 1/3 = 3/6 + 2/6 = 5/6.', '1 ÷ 5/6 = 1 × 6/5 = 6/5.', 'Answer: 6/5'],
      'fraction',
    ),
    p(
      'A student spends 1/3 of their money on a book, then 1/4 of what is left on lunch. What fraction of the money is left?',
      '1/2',
      [
        'After the book, 2/3 is left.',
        'Lunch costs 1/4 of 2/3 = 2/12 = 1/6.',
        '2/3 − 1/6 = 4/6 − 1/6 = 3/6 = 1/2.',
        'Answer: 1/2',
      ],
      'fraction',
    ),
    p(
      '5/6 − 2/3 × 3/4',
      '1/3',
      [
        'Multiply first: 2/3 × 3/4 = 6/12 = 1/2.',
        '5/6 − 1/2 = 5/6 − 3/6 = 2/6.',
        'Simplify: 2/6 = 1/3.',
        'Answer: 1/3',
      ],
      'fraction',
    ),
  ],

  percent: [
    p(
      'Write 47% as a decimal.',
      '0.47',
      ['Percent → decimal: move the point 2 places left.', '47% → 0.47.', 'Answer: 0.47'],
      'decimal',
    ),
    p('Write 0.8 as a percent (type the number without %).', '80', [
      'Decimal → percent: move the point 2 places right.',
      '0.8 → 80.',
      'Answer: 80%',
    ]),
    p(
      'Write 6% as a decimal.',
      '0.06',
      [
        'Move the point 2 places left: 6 → 0.06.',
        'A single digit needs a zero in front: 0.06, not 0.6.',
        'Answer: 0.06',
      ],
      'decimal',
    ),
    p('What is 10% of 90?', '9', ['10% = 0.1.', '0.1 × 90 = 9.', 'Answer: 9']),
    p('What is 50% of 46?', '23', ['50% is one half.', '46 ÷ 2 = 23.', 'Answer: 23']),
    p('What is 25% of 80?', '20', ['25% is one quarter.', '80 ÷ 4 = 20.', 'Answer: 20']),
    p('Write 3/4 as a percent (type the number).', '75', [
      '3/4 = 3 ÷ 4 = 0.75.',
      'Move the point 2 places right: 75.',
      'Answer: 75%',
    ]),
    p(
      'Write 125% as a decimal.',
      '1.25',
      ['Move the point 2 places left: 125 → 1.25.', 'Answer: 1.25'],
      'decimal',
    ),
    p('What is 15% of 60?', '9', ['15% = 0.15.', '0.15 × 60 = 9.', 'Answer: 9']),
    p('What is 8% of 250?', '20', ['8% = 0.08.', '0.08 × 250 = 20.', 'Answer: 20']),
    p('18 is what percent of 72?', '25', [
      'Part ÷ whole: 18 ÷ 72 = 0.25.',
      '0.25 = 25%.',
      'Answer: 25%',
    ]),
    p('30% of what number is 24?', '80', ['0.3 × n = 24.', 'n = 24 ÷ 0.3 = 80.', 'Answer: 80']),
    p('A $40 shirt is 20% off. What is the sale price in dollars?', '32', [
      'Discount: 0.2 × 40 = 8.',
      '40 − 8 = 32.',
      'Answer: $32',
    ]),
    p('A meal costs $80. With a 15% tip, what is the total in dollars?', '92', [
      'Tip: 0.15 × 80 = 12.',
      '80 + 12 = 92.',
      'Answer: $92',
    ]),
    p(
      'Write 0.5% as a decimal.',
      '0.005',
      ['Move the point 2 places left: 0.5 → 0.005.', 'Answer: 0.005'],
      'decimal',
    ),
    p('A town of 2,000 people grows by 12%. What is the new population?', '2240', [
      'Growth: 0.12 × 2000 = 240.',
      '2000 + 240 = 2240.',
      'Answer: 2,240',
    ]),
    p('A price rises from $50 to $65. What is the percent increase?', '30', [
      'Change: 65 − 50 = 15.',
      'Percent change = change ÷ original = 15 ÷ 50 = 0.3.',
      'Answer: 30%',
    ]),
    p('A price drops from $80 to $68. What is the percent decrease?', '15', [
      'Change: 80 − 68 = 12.',
      '12 ÷ 80 = 0.15 — always divide by the original.',
      'Answer: 15%',
    ]),
    p(
      'A $200 jacket is 25% off, then an extra 10% off the sale price. What is the final price in dollars?',
      '135',
      [
        '25% off leaves 75%: 0.75 × 200 = 150.',
        'Extra 10% off leaves 90% of 150: 0.9 × 150 = 135.',
        'Not 35% off: the second discount is taken from the lower price.',
        'Answer: $135',
      ],
    ),
    p('After a 20% raise, a salary is $54,000. What was it before the raise?', '45000', [
      'After the raise it is 120% of the original: 1.2 × s = 54000.',
      's = 54000 ÷ 1.2 = 45000.',
      'Answer: $45,000',
    ]),
    p('What is 40% of 30% of 500?', '60', [
      '30% of 500 = 0.3 × 500 = 150.',
      '40% of 150 = 0.4 × 150 = 60.',
      'Answer: 60',
    ]),
    p(
      'A number goes up by 25%, then the result goes down by 20%. The final number is what percent of the original?',
      '100',
      [
        'Up 25%: multiply by 1.25. Down 20%: multiply by 0.8.',
        '1.25 × 0.8 = 1, so the number is back where it started.',
        'Answer: 100%',
      ],
    ),
    p('In a class of 30, 12 students wear glasses. What percent do not?', '60', [
      '30 − 12 = 18 do not.',
      '18 ÷ 30 = 0.6.',
      'Answer: 60%',
    ]),
    p('A test has 40 questions and a student scores 85%. How many questions were right?', '34', [
      '85% of 40 = 0.85 × 40.',
      '= 34.',
      'Answer: 34',
    ]),
    p(
      'A shop buys a lamp for $60, marks it up 40%, then sells it at 25% off. What is the sale price in dollars?',
      '63',
      ['Markup: 1.4 × 60 = 84.', '25% off leaves 75%: 0.75 × 84 = 63.', 'Answer: $63'],
    ),
  ],

  ratios: [
    p(
      'Simplify the ratio 12 : 18. Type it as a fraction a/b.',
      '2/3',
      [
        'Divide both parts by their greatest common factor, 6.',
        '12 : 18 = 2 : 3 = 2/3.',
        'Answer: 2/3',
      ],
      'fraction',
    ),
    p('A car travels 150 miles in 3 hours. What is its speed in miles per hour?', '50', [
      'Unit rate: divide by the hours.',
      '150 ÷ 3 = 50.',
      'Answer: 50 mph',
    ]),
    p('6 apples cost $4.20. What does one apple cost in dollars?', '0.7', [
      '4.20 ÷ 6 = 0.70.',
      'Answer: $0.70',
    ]),
    p('Solve x/5 = 12/20.', '3', [
      '20 is 5 × 4, so the scale factor is 4.',
      'x = 12 ÷ 4 = 3.',
      'Answer: 3',
    ]),
    p('The ratio of boys to girls is 3 : 4. There are 12 boys. How many girls are there?', '16', [
      '12 boys is 3 × 4, so the scale factor is 4.',
      'Girls: 4 × 4 = 16.',
      'Answer: 16',
    ]),
    p('Solve 2/3 = x/12.', '8', [
      '3 × 4 = 12, so multiply the top by 4 too.',
      'x = 2 × 4 = 8.',
      'Answer: 8',
    ]),
    p('3 pounds of grapes cost $9. What is the price per pound in dollars?', '3', [
      '9 ÷ 3 = 3.',
      'Answer: $3 per pound',
    ]),
    p('4 pens cost $6. How much do 10 pens cost in dollars?', '15', [
      'One pen: 6 ÷ 4 = 1.50.',
      '10 pens: 10 × 1.50 = 15.',
      'Answer: $15',
    ]),
    p('Solve 7/x = 21/30.', '10', [
      '21 is 7 × 3, so the scale factor is 3.',
      'x = 30 ÷ 3 = 10.',
      'Answer: 10',
    ]),
    p('A map scale is 1 cm : 25 km. How many km is 6.4 cm on the map?', '160', [
      'Each cm is 25 km.',
      '6.4 × 25 = 160.',
      'Answer: 160 km',
    ]),
    p('16 ounces of cereal cost $4.80. What is the price per ounce in dollars?', '0.3', [
      '4.80 ÷ 16 = 0.30.',
      'Answer: $0.30 per ounce',
    ]),
    p('A car uses 8 gallons to drive 240 miles. How far can it go on 13 gallons?', '390', [
      'Unit rate: 240 ÷ 8 = 30 miles per gallon.',
      '13 × 30 = 390.',
      'Answer: 390 miles',
    ]),
    p(
      'Red and blue marbles are in the ratio 5 : 3, and there are 64 marbles. How many are red?',
      '40',
      ['5 + 3 = 8 parts in all; each part is 64 ÷ 8 = 8.', 'Red: 5 × 8 = 40.', 'Answer: 40'],
    ),
    p('Solve (x + 2)/6 = 5/3.', '8', [
      'Cross-multiply: 3(x + 2) = 30.',
      'x + 2 = 10, so x = 8.',
      'Answer: 8',
    ]),
    p('Someone types 45 words per minute. How many minutes does 1,350 words take?', '30', [
      'Time = words ÷ rate.',
      '1350 ÷ 45 = 30.',
      'Answer: 30 minutes',
    ]),
    p('2 cups of flour make 12 cookies. How many cups make 30 cookies?', '5', [
      'Flour per cookie: 2/12 = 1/6 cup.',
      '30 × 1/6 = 5.',
      'Answer: 5 cups',
    ]),
    p('A runner moves at 18 meters per second. What is that in km per hour?', '64.8', [
      'In one hour: 18 × 3600 = 64,800 m.',
      '64,800 m ÷ 1000 = 64.8 km.',
      'Answer: 64.8 km/h',
    ]),
    p(
      'a : b = 2 : 3 and b : c = 4 : 5. Find a : c as a fraction.',
      '8/15',
      ['a/c = (a/b) × (b/c).', '= 2/3 × 4/5 = 8/15.', 'Answer: 8/15'],
      'fraction',
    ),
    p('$360 is shared in the ratio 2 : 3 : 4. What is the largest share in dollars?', '160', [
      '2 + 3 + 4 = 9 parts; each part is 360 ÷ 9 = 40.',
      'Largest: 4 × 40 = 160.',
      'Answer: $160',
    ]),
    p(
      'Cats and dogs at a shelter are in the ratio 5 : 7. After 4 more cats arrive the ratio is 1 : 1. How many dogs are there?',
      '14',
      [
        'Write cats = 5k and dogs = 7k.',
        'After 4 more cats: 5k + 4 = 7k, so 2k = 4 and k = 2.',
        'Dogs: 7 × 2 = 14.',
        'Answer: 14',
      ],
    ),
    p('Solve (2x − 1)/5 = (x + 4)/3.', '23', [
      'Cross-multiply: 3(2x − 1) = 5(x + 4).',
      '6x − 3 = 5x + 20.',
      'x = 23.',
      'Answer: 23',
    ]),
    p('A pump fills 3/4 of a tank in 9 minutes. How many minutes for the whole tank?', '12', [
      '3/4 of the tank takes 9 minutes, so 1/4 takes 3 minutes.',
      'The whole tank: 4 × 3 = 12.',
      'Answer: 12 minutes',
    ]),
    p(
      '4 printers print 240 pages in 6 minutes. How many pages do 6 printers print in 10 minutes?',
      '600',
      [
        'Rate per printer per minute: 240 ÷ (4 × 6) = 10 pages.',
        '6 printers × 10 minutes × 10 pages = 600.',
        'Answer: 600 pages',
      ],
    ),
    p(
      'A model car is built at a scale of 1 : 24. The model is 18 cm long. How long is the real car in meters?',
      '4.32',
      ['Real length: 18 × 24 = 432 cm.', '432 cm ÷ 100 = 4.32 m.', 'Answer: 4.32 m'],
    ),
    p(
      'You walk at 4 km/h for 1.5 hours, then cycle at 15 km/h for 2 hours. What is your average speed for the whole trip in km/h? (A fraction is fine.)',
      '72/7',
      [
        'Distance: 4 × 1.5 + 15 × 2 = 6 + 30 = 36 km.',
        'Time: 1.5 + 2 = 3.5 hours.',
        'Average speed = total distance ÷ total time = 36 ÷ 3.5 = 72/7 ≈ 10.3.',
        'Answer: 72/7 km/h (not the average of 4 and 15)',
      ],
    ),
  ],

  powers: [
    p('2⁵', '32', ['Five factors of 2: 2 × 2 × 2 × 2 × 2.', '= 32.', 'Answer: 32']),
    p('4³', '64', ['4 × 4 × 4 = 64.', 'Answer: 64']),
    p('10⁴', '10000', ['10 × 10 × 10 × 10: a 1 followed by four zeros.', 'Answer: 10,000']),
    p('(−3)²', '9', ['The base is −3 (it is in brackets): (−3)(−3).', '= 9.', 'Answer: 9']),
    p('−3²', '-9', ['No brackets, so the base is 3: −(3 × 3).', '= −9.', 'Answer: −9']),
    p('7³ ÷ 7³', '1', [
      'Anything divided by itself is 1.',
      'With the quotient rule: 7³⁻³ = 7⁰ = 1.',
      'Answer: 1',
    ]),
    p('2³ × 2² (as a number)', '32', [
      'Same base, so add the exponents: 2³⁺² = 2⁵.',
      '2⁵ = 32.',
      'Answer: 32',
    ]),
    p('5⁴ ÷ 5²', '25', [
      'Same base, so subtract the exponents: 5⁴⁻² = 5².',
      '5² = 25.',
      'Answer: 25',
    ]),
    p('(2³)²', '64', [
      'Power of a power: multiply the exponents, 2³ˣ² = 2⁶.',
      '2⁶ = 64.',
      'Answer: 64',
    ]),
    p('(−2)⁵', '-32', [
      'Five factors of −2: an odd number of negatives.',
      '2⁵ = 32, so the answer is −32.',
      'Answer: −32',
    ]),
    p('−(−2)⁴', '-16', [
      '(−2)⁴ = 16 (even number of negatives).',
      'The minus outside: −16.',
      'Answer: −16',
    ]),
    p('3² + 4²', '25', ['Exponents first: 9 + 16.', '= 25.', 'Answer: 25']),
    p('3⁴ × 3 ÷ 3³ (as a number)', '9', [
      '3 is 3¹. Add then subtract exponents: 3⁴⁺¹⁻³ = 3².',
      '3² = 9.',
      'Answer: 9',
    ]),
    p('(−1)¹⁰⁰', '1', [
      '100 factors of −1: an even number of negatives.',
      'The product is 1.',
      'Answer: 1',
    ]),
    p('2³ × 2ⁿ = 2⁹. Find n.', '6', ['Product rule: 3 + n = 9.', 'n = 6.', 'Answer: 6']),
    p('(5²)ⁿ = 5¹⁰. Find n.', '5', ['Power of a power: 2 × n = 10.', 'n = 5.', 'Answer: 5']),
    p('10⁶ ÷ 10² ÷ 10', '1000', [
      'Subtract the exponents: 6 − 2 − 1 = 3.',
      '10³ = 1000.',
      'Answer: 1,000',
    ]),
    p('2¹⁰ ÷ 2⁷ − 3²', '-1', ['2¹⁰ ÷ 2⁷ = 2³ = 8.', '3² = 9.', '8 − 9 = −1.', 'Answer: −1']),
    p('(2²)³ × 2 ÷ 2⁵ (as a number)', '4', [
      '(2²)³ = 2⁶.',
      '2⁶ × 2¹ ÷ 2⁵ = 2⁶⁺¹⁻⁵ = 2².',
      '2² = 4.',
      'Answer: 4',
    ]),
    p('4³ = 2ⁿ. Find n.', '6', ['Write 4 as 2²: (2²)³ = 2⁶.', 'n = 6.', 'Answer: 6']),
    p('8² × 4 = 2ⁿ. Find n.', '8', [
      '8 = 2³ and 4 = 2².',
      '(2³)² × 2² = 2⁶ × 2² = 2⁸.',
      'Answer: 8',
    ]),
    p('9⁴ ÷ 27²', '9', [
      'Make the bases match: 9 = 3² and 27 = 3³.',
      '(3²)⁴ ÷ (3³)² = 3⁸ ÷ 3⁶ = 3².',
      '3² = 9.',
      'Answer: 9',
    ]),
    p('(−2)³ − (−3)²', '-17', [
      '(−2)³ = −8 (odd number of negatives).',
      '(−3)² = 9.',
      '−8 − 9 = −17.',
      'Answer: −17',
    ]),
    p('2ⁿ⁺¹ = 64. Find n.', '5', ['64 = 2⁶.', 'n + 1 = 6, so n = 5.', 'Answer: 5']),
    p('5¹⁰⁰ ÷ 5⁹⁸', '25', [
      'Same base: subtract the exponents, 100 − 98 = 2.',
      '5² = 25.',
      'Answer: 25',
    ]),
  ],

  'scientific-notation': [
    p('Write 4.2 × 10³ in standard form.', '4200', [
      'n = 3 > 0: move the point 3 places right.',
      '4.2 → 4200.',
      'Answer: 4,200',
    ]),
    p('Write 7 × 10⁻² in standard form.', '0.07', [
      'n = −2 < 0: move the point 2 places left.',
      '7 → 0.07.',
      'Answer: 0.07',
    ]),
    p('5,000 = 5 × 10ⁿ. Find n.', '3', [
      'The point moves from after 5000 to after the 5: 3 places left.',
      'Moved left → positive n.',
      'Answer: 3',
    ]),
    p('0.006 = 6 × 10ⁿ. Find n.', '-3', [
      'The point moves from before the zeros to after the 6: 3 places right.',
      'Moved right → negative n.',
      'Answer: −3',
    ]),
    p('Write 3.1 × 10⁵ in standard form.', '310000', [
      'Move the point 5 places right, filling with zeros.',
      '3.1 → 310,000.',
      'Answer: 310,000',
    ]),
    p('Write 9.5 × 10⁻¹ in standard form.', '0.95', [
      'Move the point 1 place left.',
      '9.5 → 0.95.',
      'Answer: 0.95',
    ]),
    p('82,000 = a × 10⁴. Find a.', '8.2', [
      'Put the point after the first non-zero digit: 8.2.',
      'Check: 8.2 × 10⁴ = 82,000.',
      'Answer: 8.2',
    ]),
    p('0.0045 = 4.5 × 10ⁿ. Find n.', '-3', [
      'Move the point to sit after the 4: 3 places right.',
      'Moved right → n = −3.',
      'Answer: −3',
    ]),
    p('Write 6.03 × 10⁶ in standard form.', '6030000', [
      'Move the point 6 places right.',
      '6.03 → 6,030,000.',
      'Answer: 6,030,000',
    ]),
    p('Write 2.7 × 10⁻⁴ in standard form.', '0.00027', [
      'Move the point 4 places left.',
      '2.7 → 0.00027.',
      'Answer: 0.00027',
    ]),
    p('459,000,000 = 4.59 × 10ⁿ. Find n.', '8', [
      'Count the places from the end of the number to after the 4: 8 places left.',
      'Answer: 8',
    ]),
    p('0.0000712 = 7.12 × 10ⁿ. Find n.', '-5', [
      'Move the point to after the 7: 5 places right.',
      'Moved right → n = −5.',
      'Answer: −5',
    ]),
    p('38 × 10⁴ is not in scientific notation. Rewrite it as 3.8 × 10ⁿ. Find n.', '5', [
      '38 = 3.8 × 10¹.',
      '3.8 × 10¹ × 10⁴ = 3.8 × 10⁵.',
      'Answer: 5',
    ]),
    p('0.52 × 10⁻³ = 5.2 × 10ⁿ. Find n.', '-4', [
      '0.52 = 5.2 × 10⁻¹.',
      '5.2 × 10⁻¹ × 10⁻³ = 5.2 × 10⁻⁴.',
      'Answer: −4',
    ]),
    p('(2 × 10³)(4 × 10⁵) = 8 × 10ⁿ. Find n.', '8', [
      'Multiply the coefficients: 2 × 4 = 8.',
      'Add the exponents: 3 + 5 = 8.',
      'Answer: 8',
    ]),
    p('(9 × 10⁸) ÷ (3 × 10²) = 3 × 10ⁿ. Find n.', '6', [
      'Divide the coefficients: 9 ÷ 3 = 3.',
      'Subtract the exponents: 8 − 2 = 6.',
      'Answer: 6',
    ]),
    p('How many times larger is 6 × 10⁹ than 3 × 10⁷?', '200', [
      'Divide: (6 ÷ 3) × 10⁹⁻⁷ = 2 × 10².',
      '= 200.',
      'Answer: 200',
    ]),
    p('(5 × 10⁴)(6 × 10³) = 3 × 10ⁿ. Find n.', '8', [
      '5 × 6 = 30 and 10⁴ × 10³ = 10⁷: 30 × 10⁷.',
      '30 is not between 1 and 10: 30 = 3 × 10¹.',
      '3 × 10¹ × 10⁷ = 3 × 10⁸.',
      'Answer: 8',
    ]),
    p('(1.2 × 10⁻³)(4 × 10⁻²) = 4.8 × 10ⁿ. Find n.', '-5', [
      '1.2 × 4 = 4.8.',
      'Exponents: −3 + (−2) = −5.',
      'Answer: −5',
    ]),
    p('(8.4 × 10⁶) ÷ (2.1 × 10⁹) = 4 × 10ⁿ. Find n.', '-3', [
      '8.4 ÷ 2.1 = 4.',
      'Exponents: 6 − 9 = −3.',
      'Answer: −3',
    ]),
    p(
      'Light travels about 3 × 10⁵ km each second. In 500 seconds it travels 1.5 × 10ⁿ km. Find n.',
      '8',
      [
        '500 = 5 × 10².',
        '(3 × 10⁵)(5 × 10²) = 15 × 10⁷.',
        '15 = 1.5 × 10¹, so 1.5 × 10⁸.',
        'Answer: 8',
      ],
    ),
    p('2.5 × 10⁴ + 3 × 10³ in standard form.', '28000', [
      'Change both to standard form: 25,000 + 3,000.',
      '= 28,000.',
      'Answer: 28,000 (you cannot just add the coefficients when the powers differ)',
    ]),
    p('A cell is 8 × 10⁻⁶ m wide. How many cells side by side make 0.02 m?', '2500', [
      '0.02 = 2 × 10⁻².',
      '(2 × 10⁻²) ÷ (8 × 10⁻⁶) = 0.25 × 10⁴.',
      '= 2,500.',
      'Answer: 2,500',
    ]),
    p('(3 × 10⁴)² = 9 × 10ⁿ. Find n.', '8', [
      'Square each part: 3² = 9 and (10⁴)² = 10⁸.',
      'Answer: 8',
    ]),
    p(
      'A country uses 4.2 × 10⁹ liters of water a day for 3 × 10⁷ people. How many liters is that per person per day?',
      '140',
      ['Divide: (4.2 ÷ 3) × 10⁹⁻⁷ = 1.4 × 10².', '= 140.', 'Answer: 140 liters'],
    ),
  ],

  rounding: [
    p('Round 68 to the nearest ten.', '70', [
      'The tens digit is 6; the digit to its right is 8.',
      '8 is 5–9: round up to 70.',
      'Answer: 70',
    ]),
    p('Round 342 to the nearest hundred.', '300', [
      'The hundreds digit is 3; the next digit is 4.',
      '4 is 0–4: round down to 300.',
      'Answer: 300',
    ]),
    p('Round 4.36 to the nearest tenth.', '4.4', [
      'The tenths digit is 3; the next digit is 6.',
      '6 is 5–9: round up to 4.4.',
      'Answer: 4.4',
    ]),
    p('Round 7,825 to the nearest thousand.', '8000', [
      'The thousands digit is 7; the next digit is 8.',
      'Round up: 8,000.',
      'Answer: 8,000',
    ]),
    p('Round 2.71 to the nearest whole number.', '3', [
      'The ones digit is 2; the tenths digit is 7.',
      'Round up: 3.',
      'Answer: 3',
    ]),
    p('Round 1,449 to the nearest hundred.', '1400', [
      'The hundreds digit is 4; the next digit is 4.',
      'Round down: 1,400. (Only the digit right after counts, not the 9.)',
      'Answer: 1,400',
    ]),
    p('Round 0.583 to the nearest hundredth.', '0.58', [
      'The hundredths digit is 8; the next digit is 3.',
      'Round down: 0.58.',
      'Answer: 0.58',
    ]),
    p('Round 95 to the nearest ten.', '100', [
      'The tens digit is 9; the next digit is 5.',
      'Round up: 9 tens + 1 ten = 10 tens = 100.',
      'Answer: 100',
    ]),
    p('Round 3.14159 to the nearest thousandth.', '3.142', [
      'The thousandths digit is 1; the next digit is 5.',
      'Round up: 3.142.',
      'Answer: 3.142',
    ]),
    p('Round 6,951 to the nearest hundred.', '7000', [
      'The hundreds digit is 9; the next digit is 5.',
      'Round up: 69 hundreds + 1 = 70 hundreds = 7,000.',
      'Answer: 7,000',
    ]),
    p('Round 12.995 to the nearest hundredth.', '13', [
      'The hundredths digit is 9; the next digit is 5.',
      'Round up: 12.99 + 0.01 = 13.00.',
      'Answer: 13.00 (= 13)',
    ]),
    p('Round 249,999 to the nearest thousand.', '250000', [
      'The thousands digit is 9; the next digit is 9.',
      'Round up: 249 thousands + 1 = 250 thousands.',
      'Answer: 250,000',
    ]),
    p('Round 0.0467 to the nearest hundredth.', '0.05', [
      'The hundredths digit is 4; the next digit is 6.',
      'Round up: 0.05.',
      'Answer: 0.05',
    ]),
    p('Round 18.25 to the nearest tenth.', '18.3', [
      'The tenths digit is 2; the next digit is 5.',
      '5 rounds up: 18.3.',
      'Answer: 18.3',
    ]),
    p('Work out 5.6 × 3.1, then round to the nearest whole number.', '17', [
      '5.6 × 3.1 = 17.36.',
      'The tenths digit is 3: round down to 17.',
      'Answer: 17',
    ]),
    p('Write 2/3 as a decimal rounded to the nearest hundredth.', '0.67', [
      '2 ÷ 3 = 0.6666…',
      'The hundredths digit is 6; the next is 6: round up to 0.67.',
      'Answer: 0.67',
    ]),
    p('Round 84,350 to the nearest ten thousand.', '80000', [
      'The ten-thousands digit is 8; the next digit is 4.',
      'Round down: 80,000.',
      'Answer: 80,000',
    ]),
    p('Round 9.9962 to the nearest hundredth.', '10', [
      'The hundredths digit is 9; the next digit is 6.',
      'Round up: 9.99 + 0.01 = 10.00.',
      'Answer: 10.00 (= 10)',
    ]),
    p(
      'What is the smallest whole number that rounds to 500 when rounded to the nearest hundred?',
      '450',
      ['Numbers from 450 up to 549 round to 500.', '449 rounds down to 400.', 'Answer: 450'],
    ),
    p(
      'What is the largest whole number that rounds to 3,000 when rounded to the nearest thousand?',
      '3499',
      ['3,500 would round up to 4,000.', 'So the largest is 3,499.', 'Answer: 3,499'],
    ),
    p('Write 7/9 as a decimal rounded to the nearest thousandth.', '0.778', [
      '7 ÷ 9 = 0.7777…',
      'The thousandths digit is 7; the next is 7: round up.',
      'Answer: 0.778',
    ]),
    p('Round 47.48 to the nearest whole number.', '47', [
      'Look only at the tenths digit: 4.',
      '0–4: round down to 47.',
      'Rounding twice (47.48 → 47.5 → 48) gives the wrong answer.',
      'Answer: 47',
    ]),
    p('Estimate 398 × 51 by first rounding each number to the nearest ten.', '20000', [
      '398 → 400 and 51 → 50.',
      '400 × 50 = 20,000.',
      'Answer: 20,000',
    ]),
    p(
      'A number with two decimal places rounds to 6.3 (nearest tenth). What is the smallest it can be?',
      '6.25',
      [
        'Numbers from 6.25 up to 6.34 round to 6.3.',
        '6.24 would round down to 6.2.',
        'Answer: 6.25',
      ],
    ),
    p('Write 1/7 as a decimal rounded to the nearest ten-thousandth.', '0.1429', [
      '1 ÷ 7 = 0.142857…',
      'The ten-thousandths digit is 8; the next is 5: round up.',
      'Answer: 0.1429',
    ]),
  ],

  factors: [
    p('How many factors does 12 have?', '6', [
      'List the factor pairs: 1 × 12, 2 × 6, 3 × 4.',
      'Factors: 1, 2, 3, 4, 6, 12.',
      'Answer: 6',
    ]),
    p('What is the largest factor of 45 other than 45?', '15', [
      'Factor pairs of 45: 1 × 45, 3 × 15, 5 × 9.',
      'The largest besides 45 is 15.',
      'Answer: 15',
    ]),
    p('What is the smallest prime number?', '2', [
      '1 is not prime (only one factor).',
      '2 has exactly two factors, 1 and 2.',
      'Answer: 2',
    ]),
    p('What is the 5th multiple of 7?', '35', ['Multiples of 7: 7, 14, 21, 28, 35.', 'Answer: 35']),
    p('Add up all the factors of 10.', '18', [
      'Factors of 10: 1, 2, 5, 10.',
      '1 + 2 + 5 + 10 = 18.',
      'Answer: 18',
    ]),
    p('What is the least common multiple of 3 and 5?', '15', [
      'Multiples of 3: 3, 6, 9, 12, 15…',
      'Multiples of 5: 5, 10, 15…',
      'The first shared one is 15.',
      'Answer: 15',
    ]),
    p('What is the greatest common factor of 12 and 18?', '6', [
      'Factors of 12: 1, 2, 3, 4, 6, 12.',
      'Factors of 18: 1, 2, 3, 6, 9, 18.',
      'The largest shared one is 6.',
      'Answer: 6',
    ]),
    p('What is the largest prime factor of 30?', '5', ['30 = 2 × 3 × 5.', 'Answer: 5']),
    p('72 = 2ᵃ × 3ᵇ. What is a + b?', '5', [
      'Factor tree: 72 = 8 × 9 = 2 × 2 × 2 × 3 × 3.',
      'So a = 3 and b = 2.',
      'a + b = 5.',
      'Answer: 5',
    ]),
    p('What is the least common multiple of 6 and 10?', '30', [
      'Multiples of 10: 10, 20, 30…',
      '30 is the first that 6 also divides.',
      'Answer: 30',
    ]),
    p('What is the least common multiple of 8 and 12?', '24', [
      'Multiples of 12: 12, 24…',
      '8 does not divide 12, but it divides 24.',
      'Answer: 24',
    ]),
    p(
      'Simplify 42/56 using prime factors.',
      '3/4',
      ['42 = 2 × 3 × 7 and 56 = 2 × 2 × 2 × 7.', 'Cancel a 2 and the 7: 3/(2 × 2).', 'Answer: 3/4'],
      'fraction',
    ),
    p(
      '1/4 + 1/10',
      '7/20',
      [
        'The LCM of 4 and 10 is 20.',
        '1/4 = 5/20 and 1/10 = 2/20.',
        '5/20 + 2/20 = 7/20.',
        'Answer: 7/20',
      ],
      'fraction',
    ),
    p('How many multiples of 6 are there from 1 to 100?', '16', [
      '100 ÷ 6 = 16.67, so 6 × 16 = 96 is the last one.',
      'Answer: 16',
    ]),
    p('2² × 3 × 5²', '300', ['4 × 3 × 25.', '= 12 × 25 = 300.', 'Answer: 300']),
    p('How many factors does 36 have?', '9', [
      'Pairs: 1 × 36, 2 × 18, 3 × 12, 4 × 9, 6 × 6.',
      '6 × 6 counts once: 1, 2, 3, 4, 6, 9, 12, 18, 36.',
      'Answer: 9',
    ]),
    p('What is the largest prime factor of 91?', '13', [
      '91 is not divisible by 2, 3 or 5; try 7: 91 = 7 × 13.',
      'Both are prime; the larger is 13.',
      'Answer: 13',
    ]),
    p('What is the least common multiple of 12, 15 and 20?', '60', [
      '12 = 2² × 3, 15 = 3 × 5, 20 = 2² × 5.',
      'Take each prime at its highest power: 2² × 3 × 5 = 60.',
      'Answer: 60',
    ]),
    p(
      'One bus leaves every 12 minutes and another every 18 minutes. Both leave at 8:00. After how many minutes do they next leave together?',
      '36',
      [
        'We need the LCM of 12 and 18.',
        'Multiples of 18: 18, 36 — and 12 divides 36.',
        'Answer: 36 minutes (8:36)',
      ],
    ),
    p('What is the greatest common factor of 84 and 126?', '42', [
      '84 = 2² × 3 × 7 and 126 = 2 × 3² × 7.',
      'Take the shared primes at their lowest power: 2 × 3 × 7 = 42.',
      'Answer: 42',
    ]),
    p('What is the smallest positive number divisible by 2, 3, 4, 5 and 6?', '60', [
      'LCM: 4 = 2² needs 2², then 3 and 5 (6 is already covered).',
      '2² × 3 × 5 = 60.',
      'Answer: 60',
    ]),
    p('What is the smallest positive integer n that makes 90n a perfect square?', '10', [
      '90 = 2 × 3² × 5.',
      'A perfect square needs every prime to an even power: 2 and 5 each need one more.',
      'n = 2 × 5 = 10 (90 × 10 = 900 = 30²).',
      'Answer: 10',
    ]),
    p(
      '5/12 − 7/18',
      '1/36',
      [
        'The LCM of 12 and 18 is 36.',
        '5/12 = 15/36 and 7/18 = 14/36.',
        '15/36 − 14/36 = 1/36.',
        'Answer: 1/36',
      ],
      'fraction',
    ),
    p('How many positive factors does 2³ × 3² have?', '12', [
      'A factor is 2ᵃ × 3ᵇ with a from 0 to 3 (4 choices) and b from 0 to 2 (3 choices).',
      '4 × 3 = 12.',
      'Answer: 12',
    ]),
    p('What is the sum of the different prime factors of 2,310?', '28', [
      '2310 = 2 × 1155 = 2 × 3 × 385 = 2 × 3 × 5 × 77 = 2 × 3 × 5 × 7 × 11.',
      '2 + 3 + 5 + 7 + 11 = 28.',
      'Answer: 28',
    ]),
  ],

  'order-of-operations': [
    p('6 + 4 × 2', '14', ['Multiply before adding: 4 × 2 = 8.', '6 + 8 = 14.', 'Answer: 14']),
    p('(6 + 4) × 2', '20', ['Brackets first: 6 + 4 = 10.', '10 × 2 = 20.', 'Answer: 20']),
    p('20 − 8 ÷ 4', '18', ['Divide first: 8 ÷ 4 = 2.', '20 − 2 = 18.', 'Answer: 18']),
    p('3 × 5 − 2', '13', ['Multiply first: 15.', '15 − 2 = 13.', 'Answer: 13']),
    p('12 ÷ 4 × 3', '9', [
      '÷ and × are one step: go left to right.',
      '12 ÷ 4 = 3, then 3 × 3 = 9.',
      'Answer: 9',
    ]),
    p('10 − 4 + 3', '9', [
      '− and + are one step: go left to right.',
      '10 − 4 = 6, then 6 + 3 = 9.',
      'Answer: 9',
    ]),
    p('2 + 3²', '11', ['Exponent first: 3² = 9.', '2 + 9 = 11.', 'Answer: 11']),
    p('(2 + 3)²', '25', ['Brackets first: 5.', '5² = 25.', 'Answer: 25']),
    p('18 ÷ (2 + 4) × 5', '15', [
      'Brackets: 2 + 4 = 6.',
      'Left to right: 18 ÷ 6 = 3, then 3 × 5 = 15.',
      'Answer: 15',
    ]),
    p('4² − 3 × 5', '1', ['Exponent: 16. Multiply: 15.', '16 − 15 = 1.', 'Answer: 1']),
    p('30 − 2 × (4 + 3)', '16', [
      'Brackets: 7.',
      'Multiply: 2 × 7 = 14.',
      '30 − 14 = 16.',
      'Answer: 16',
    ]),
    p('7 + 24 ÷ 6 × 2', '15', [
      '÷ and × left to right: 24 ÷ 6 = 4, then 4 × 2 = 8.',
      '7 + 8 = 15.',
      'Answer: 15',
    ]),
    p('5 × 2³ − 10', '30', ['Exponent: 2³ = 8.', '5 × 8 = 40, then 40 − 10 = 30.', 'Answer: 30']),
    p('(9 − 3)² ÷ 4', '9', ['Brackets: 6. Exponent: 36.', '36 ÷ 4 = 9.', 'Answer: 9']),
    p('50 − 3 × 4²', '2', [
      'Exponent: 4² = 16.',
      'Multiply: 3 × 16 = 48.',
      '50 − 48 = 2.',
      'Answer: 2',
    ]),
    p('2 × [3 + (8 − 5)²]', '24', [
      'Innermost brackets: 8 − 5 = 3.',
      'Exponent: 3² = 9; then 3 + 9 = 12.',
      '2 × 12 = 24.',
      'Answer: 24',
    ]),
    p('−3² + 4 × 2', '-1', ['−3² means −(3²) = −9.', '4 × 2 = 8.', '−9 + 8 = −1.', 'Answer: −1']),
    p('8 − 2 × 3 + 12 ÷ 4 × 2', '8', [
      '× and ÷ left to right: 2 × 3 = 6; 12 ÷ 4 = 3, then 3 × 2 = 6.',
      'Now 8 − 6 + 6, left to right: 2 + 6 = 8.',
      'Answer: 8',
    ]),
    p('[20 − (3 + 2)²] × (−2)', '10', [
      'Inner brackets: 5, and 5² = 25.',
      '20 − 25 = −5.',
      '−5 × (−2) = 10.',
      'Answer: 10',
    ]),
    p('(4 + 2²) ÷ 2 − 3 × (1 − 4)', '13', [
      'Brackets: 4 + 4 = 8 and 1 − 4 = −3.',
      '8 ÷ 2 = 4 and 3 × (−3) = −9.',
      '4 − (−9) = 13.',
      'Answer: 13',
    ]),
    p('1/2 + 3/4 × 2/3', '1', [
      'Multiply first: 3/4 × 2/3 = 6/12 = 1/2.',
      '1/2 + 1/2 = 1.',
      'Answer: 1',
    ]),
    p('(−2)³ + 6 ÷ (−3) × 4', '-16', [
      'Exponent: (−2)³ = −8.',
      '÷ and × left to right: 6 ÷ (−3) = −2, then −2 × 4 = −8.',
      '−8 + (−8) = −16.',
      'Answer: −16',
    ]),
    p('100 ÷ 5² × (7 − 3) − 2³', '8', [
      'Brackets: 4. Exponents: 25 and 8.',
      'Left to right: 100 ÷ 25 = 4, then 4 × 4 = 16.',
      '16 − 8 = 8.',
      'Answer: 8',
    ]),
    p('|3 − 8| × 2 − (6 − 10)² ÷ 8', '8', [
      'Grouping first: |3 − 8| = 5 and 6 − 10 = −4.',
      'Exponent: (−4)² = 16.',
      '5 × 2 = 10 and 16 ÷ 8 = 2.',
      '10 − 2 = 8.',
      'Answer: 8',
    ]),
    p('3 + 2 × {12 − [4 + (6 ÷ 2)²]}', '1', [
      'Innermost: 6 ÷ 2 = 3, and 3² = 9.',
      'Next: 4 + 9 = 13, then 12 − 13 = −1.',
      '2 × (−1) = −2, then 3 + (−2) = 1.',
      'Answer: 1',
    ]),
  ],
};
