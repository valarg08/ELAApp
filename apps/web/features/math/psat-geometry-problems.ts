import { guideProblem as p, type GuideProblem } from './guide-problem';

/** 25 problems per Geometry chapter, simple to complex: 1–8 warm-up, 9–17 core, 18–25 challenge. */
export const GEOMETRY_PROBLEMS: Record<string, GuideProblem[]> = {
  angles: [
    p('What is the complement of 35° (in degrees)?', '55', [
      'Complementary angles add to 90°.',
      '90 − 35 = 55.',
      'Answer: 55°',
    ]),
    p('What is the supplement of 110°?', '70', [
      'Supplementary angles add to 180°.',
      '180 − 110 = 70.',
      'Answer: 70°',
    ]),
    p('Two lines cross. One angle is 48°. What is the angle vertically opposite it?', '48', [
      'Vertical angles are equal.',
      'Answer: 48°',
    ]),
    p('Angles x and 125° sit together on a straight line. Find x.', '55', [
      'Angles on a straight line add to 180°.',
      'x = 180 − 125 = 55.',
      'Answer: 55°',
    ]),
    p('What is the complement of 72°?', '18', ['90 − 72 = 18.', 'Answer: 18°']),
    p('Three angles meet at a point: 100°, 120° and x. Find x.', '140', [
      'Angles around a point add to 360°.',
      'x = 360 − 100 − 120 = 140.',
      'Answer: 140°',
    ]),
    p(
      'Two parallel lines are cut by a transversal. An alternate interior angle is 63°. What is its partner?',
      '63',
      [
        'Alternate interior angles (the Z shape) are equal when the lines are parallel.',
        'Answer: 63°',
      ],
    ),
    p(
      'Two parallel lines are cut by a transversal. One co-interior angle is 115°. What is the other?',
      '65',
      ['Co-interior angles (the C shape) add to 180°.', '180 − 115 = 65.', 'Answer: 65°'],
    ),
    p('Angles x and 2x are supplementary. Find x.', '60', [
      'x + 2x = 180.',
      '3x = 180, so x = 60.',
      'Answer: 60',
    ]),
    p('Two complementary angles are in the ratio 2 : 3. What is the larger angle?', '54', [
      '2 + 3 = 5 parts make 90°, so one part is 18°.',
      'Larger: 3 × 18 = 54.',
      'Answer: 54°',
    ]),
    p('Vertical angles measure (3x + 10)° and (5x − 30)°. Find x.', '20', [
      'Vertical angles are equal: 3x + 10 = 5x − 30.',
      '40 = 2x, so x = 20.',
      'Answer: 20',
    ]),
    p('Parallel lines: corresponding angles are (4x − 5)° and (3x + 20)°. Find x.', '25', [
      'Corresponding angles (the F shape) are equal: 4x − 5 = 3x + 20.',
      'x = 25.',
      'Answer: 25',
    ]),
    p('Parallel lines: co-interior angles are (2x + 10)° and (3x − 5)°. Find x.', '35', [
      'Co-interior angles add to 180: 5x + 5 = 180.',
      '5x = 175, so x = 35.',
      'Answer: 35',
    ]),
    p('An angle is 24° more than its complement. Find the angle.', '57', [
      'Call it a; its complement is 90 − a.',
      'a = (90 − a) + 24 → 2a = 114.',
      'a = 57.',
      'Answer: 57°',
    ]),
    p('The supplement of an angle is 4 times the angle. Find the angle.', '36', [
      '180 − a = 4a.',
      '180 = 5a, so a = 36.',
      'Answer: 36°',
    ]),
    p('Two lines cross and one angle is 72°. What is the sum of the two obtuse angles?', '216', [
      'Each obtuse angle is the supplement of 72°: 108°.',
      'The two obtuse angles are vertical angles, so both are 108°.',
      '108 + 108 = 216.',
      'Answer: 216°',
    ]),
    p('Parallel lines: alternate interior angles are (x/2 + 20)° and (x − 10)°. Find x.', '60', [
      'Alternate interior angles are equal: x/2 + 20 = x − 10.',
      '30 = x/2, so x = 60.',
      'Answer: 60',
    ]),
    p('The complement of an angle is one third of its supplement. Find the angle.', '45', [
      '90 − a = (180 − a)/3.',
      'Multiply by 3: 270 − 3a = 180 − a.',
      '90 = 2a, so a = 45.',
      'Answer: 45°',
    ]),
    p(
      'Parallel lines: one angle is (5x + 15)° and its co-interior partner is (4x − 15)°. What is the larger angle?',
      '115',
      [
        'Co-interior angles add to 180: 9x = 180, so x = 20.',
        'The angles are 5(20) + 15 = 115 and 4(20) − 15 = 65.',
        'Answer: 115°',
      ],
    ),
    p('What is the supplement of the complement of 50°?', '140', [
      'Complement of 50: 90 − 50 = 40.',
      'Supplement of 40: 180 − 40 = 140.',
      'Answer: 140°',
    ]),
    p('Three angles x, 2x and 3x sit together on a straight line. What is the largest?', '90', [
      'x + 2x + 3x = 180, so 6x = 180 and x = 30.',
      'Largest: 3x = 90.',
      'Answer: 90°',
    ]),
    p('Four angles around a point are x, x + 20, 2x and 2x − 20. What is the largest?', '120', [
      'They add to 360: 6x = 360, so x = 60.',
      'The angles are 60, 80, 120 and 100.',
      'Answer: 120°',
    ]),
    p('Two angles are complementary and differ by 28°. What is the larger?', '59', [
      'a + b = 90 and a − b = 28.',
      'Add: 2a = 118, so a = 59.',
      'Answer: 59°',
    ]),
    p(
      'A zigzag runs between two parallel lines, making 40° with the top line and 65° with the bottom line. What is the angle at the bend?',
      '105',
      [
        'Draw a third line through the bend, parallel to the other two.',
        'It splits the bend into two alternate-interior angles: 40° and 65°.',
        '40 + 65 = 105.',
        'Answer: 105°',
      ],
    ),
    p('An angle and its supplement differ by 40°. What is the smaller of the two?', '70', [
      'a + b = 180 and b − a = 40.',
      'Subtract: 2a = 140, so a = 70.',
      'Answer: 70°',
    ]),
  ],

  triangles: [
    p('A triangle has angles 40° and 75°. Find the third angle.', '65', [
      'The angles add to 180°.',
      '180 − 40 − 75 = 65.',
      'Answer: 65°',
    ]),
    p('What is each angle of an equilateral triangle?', '60', [
      'Three equal angles add to 180°.',
      '180 ÷ 3 = 60.',
      'Answer: 60°',
    ]),
    p('A right triangle has an acute angle of 34°. Find the other acute angle.', '56', [
      'The right angle uses 90°, so the acute angles add to 90°.',
      '90 − 34 = 56.',
      'Answer: 56°',
    ]),
    p('An isosceles triangle has a vertex angle of 40°. What is each base angle?', '70', [
      'The base angles are equal and share 180 − 40 = 140°.',
      '140 ÷ 2 = 70.',
      'Answer: 70°',
    ]),
    p('An isosceles triangle has base angles of 50°. What is the vertex angle?', '80', [
      '180 − 50 − 50 = 80.',
      'Answer: 80°',
    ]),
    p('An exterior angle is outside two interior angles of 45° and 60°. How big is it?', '105', [
      'An exterior angle equals the sum of the two interior angles not next to it.',
      '45 + 60 = 105.',
      'Answer: 105°',
    ]),
    p('An exterior angle of a triangle is 120°. What is the interior angle next to it?', '60', [
      'They sit on a straight line: 180 − 120 = 60.',
      'Answer: 60°',
    ]),
    p('An isosceles right triangle has two equal acute angles. How big is each?', '45', [
      'The acute angles add to 90° and are equal.',
      '90 ÷ 2 = 45.',
      'Answer: 45°',
    ]),
    p('A triangle’s angles are x, 2x and 3x. What is the largest?', '90', [
      '6x = 180, so x = 30.',
      'Largest: 3x = 90.',
      'Answer: 90°',
    ]),
    p('A triangle’s angles are (x + 10)°, 2x° and (3x − 10)°. Find x.', '30', [
      'They add to 180: 6x = 180.',
      'x = 30.',
      'Answer: 30',
    ]),
    p(
      'An exterior angle is (4x + 2)°. The two interior angles not next to it are (2x + 10)° and (x + 22)°. Find x.',
      '30',
      [
        'Exterior angle = sum of the two remote interior angles: 4x + 2 = 3x + 32.',
        'x = 30.',
        'Answer: 30',
      ],
    ),
    p(
      'An isosceles triangle has equal sides 3x + 1 and 5x − 7. How long is each equal side?',
      '13',
      ['3x + 1 = 5x − 7 → 8 = 2x → x = 4.', '3(4) + 1 = 13.', 'Answer: 13'],
    ),
    p(
      'In an isosceles triangle each base angle is twice the vertex angle. Find the vertex angle.',
      '36',
      ['v + 2v + 2v = 180.', '5v = 180, so v = 36.', 'Answer: 36°'],
    ),
    p('What do a triangle’s three exterior angles (one at each corner) add to?', '360', [
      'Each exterior angle is 180° minus its interior angle.',
      '3 × 180 − 180 = 360.',
      'Answer: 360°',
    ]),
    p('An equilateral triangle has sides 2x + 3 and 4x − 5. What is its perimeter?', '33', [
      '2x + 3 = 4x − 5 → x = 4.',
      'Each side is 11; perimeter 3 × 11 = 33.',
      'Answer: 33',
    ]),
    p('A triangle’s angles are in the ratio 2 : 3 : 4. What is the largest?', '80', [
      '9 parts make 180°, so one part is 20°.',
      'Largest: 4 × 20 = 80.',
      'Answer: 80°',
    ]),
    p('In △ABC, ∠A = 52° and the exterior angle at C is 115°. Find ∠B.', '63', [
      'Exterior angle at C = ∠A + ∠B.',
      '∠B = 115 − 52 = 63.',
      'Answer: 63°',
    ]),
    p('An isosceles triangle has one angle of 100°. What is its smallest angle?', '40', [
      '100° cannot be a base angle (two of them would pass 180°), so it is the vertex.',
      'Base angles: (180 − 100) ÷ 2 = 40.',
      'Answer: 40°',
    ]),
    p(
      'An isosceles triangle has one angle of 70°. Add up all the possible values of its vertex angle.',
      '110',
      [
        'If 70° is a base angle, the vertex is 180 − 140 = 40°.',
        'If 70° is the vertex, it is 70°.',
        '40 + 70 = 110.',
        'Answer: 110',
      ],
    ),
    p(
      'In a right triangle one acute angle is 4 times the other. What is the smaller angle?',
      '18',
      ['a + 4a = 90.', 'a = 18.', 'Answer: 18°'],
    ),
    p('A triangle’s exterior angles at A and B are 110° and 130°. Find ∠C.', '60', [
      'Interior angles: ∠A = 180 − 110 = 70, ∠B = 180 − 130 = 50.',
      '∠C = 180 − 70 − 50 = 60.',
      'Answer: 60°',
    ]),
    p('In △ABC, ∠A = 2∠B and ∠C = ∠B + 20°. Find ∠A.', '80', [
      '2B + B + (B + 20) = 180.',
      '4B = 160, so B = 40.',
      '∠A = 2 × 40 = 80.',
      'Answer: 80°',
    ]),
    p('In △ABC, AB = AC and ∠A = 44°. BC is extended past C to D. Find ∠ACD.', '112', [
      'Base angles: (180 − 44) ÷ 2 = 68, so ∠ACB = 68.',
      '∠ACD is on a straight line with it: 180 − 68 = 112.',
      'Answer: 112°',
    ]),
    p('A quadrilateral has angles 80°, 95°, 110° and x. Find x.', '75', [
      'A diagonal splits it into two triangles: 2 × 180 = 360°.',
      'x = 360 − 80 − 95 − 110 = 75.',
      'Answer: 75°',
    ]),
    p('Each angle of a regular pentagon is how many degrees?', '108', [
      'Two diagonals split a pentagon into 3 triangles: 3 × 180 = 540°.',
      '540 ÷ 5 = 108.',
      'Answer: 108°',
    ]),
  ],

  congruent: [
    p('△ABC ≅ △DEF and AB = 9. Find DE.', '9', [
      'Matching letters match: A↔D and B↔E, so AB ↔ DE.',
      'Congruent sides are equal.',
      'Answer: 9',
    ]),
    p('△ABC ≅ △DEF and ∠B = 47°. Find ∠E.', '47', [
      'B matches E (second letter of each).',
      'Answer: 47°',
    ]),
    p('△PQR ≅ △XYZ and QR = 12. Find YZ.', '12', ['Q↔Y and R↔Z, so QR ↔ YZ.', 'Answer: 12']),
    p('△ABC ≅ △DEF with ∠A = 50° and ∠B = 60°. Find ∠F.', '70', [
      '∠C = 180 − 50 − 60 = 70.',
      'C matches F.',
      'Answer: 70°',
    ]),
    p('△ABC ≅ △DEF and △ABC has perimeter 30. What is the perimeter of △DEF?', '30', [
      'Every side matches, so the perimeters are equal.',
      'Answer: 30',
    ]),
    p('How many pairs of equal sides does the SSS test need?', '3', [
      'SSS = side, side, side: all three pairs.',
      'Answer: 3',
    ]),
    p('The HL test works only for triangles with an angle of how many degrees?', '90', [
      'HL (hypotenuse–leg) is for right triangles.',
      'Answer: 90°',
    ]),
    p('△JKL ≅ △MNO and JL = 6.5. Find MO.', '6.5', ['J↔M and L↔O, so JL ↔ MO.', 'Answer: 6.5']),
    p('△ABC ≅ △DEF, AB = 2x + 3 and DE = 15. Find x.', '6', [
      'Matching sides are equal: 2x + 3 = 15.',
      '2x = 12, so x = 6.',
      'Answer: 6',
    ]),
    p('△ABC ≅ △DEF, ∠C = (3x − 10)° and ∠F = (2x + 15)°. Find x.', '25', [
      '3x − 10 = 2x + 15.',
      'x = 25.',
      'Answer: 25',
    ]),
    p('△ABC ≅ △DEF with AB = 7, BC = 9 and AC = 11. Find DE + EF.', '16', [
      'DE = AB = 7 and EF = BC = 9.',
      '7 + 9 = 16.',
      'Answer: 16',
    ]),
    p(
      'Quadrilateral ABCD has △ABC ≅ △CDA, with AB = 8 and BC = 5. Find the perimeter of ABCD.',
      '26',
      ['A↔C, B↔D, C↔A: so CD = AB = 8 and DA = BC = 5.', '8 + 5 + 8 + 5 = 26.', 'Answer: 26'],
    ),
    p(
      'Two congruent right triangles; one has legs 6 and 8. Find the hypotenuse of the other.',
      '10',
      ['Congruent → same hypotenuse.', '√(36 + 64) = √100 = 10.', 'Answer: 10'],
    ),
    p('△ABC ≅ △DEF and the area of △ABC is 24. Find the area of △DEF.', '24', [
      'Same size and shape, so the same area.',
      'Answer: 24',
    ]),
    p(
      'In kite ABCD (AB = AD, CB = CD), diagonal AC makes △ABC ≅ △ADC. ∠ABC = 110°. Find ∠ADC.',
      '110',
      ['SSS: AB = AD, CB = CD and AC is shared.', 'B matches D, so ∠ADC = ∠ABC.', 'Answer: 110°'],
    ),
    p('△ABC ≅ △ADC (AC shared), with ∠BAC = 35°. Find ∠BAD.', '70', [
      '∠DAC = ∠BAC = 35°.',
      '∠BAD = 35 + 35 = 70.',
      'Answer: 70°',
    ]),
    p('In △ABC, AB = AC and M is the midpoint of BC, so △ABM ≅ △ACM. Find ∠AMB.', '90', [
      '∠AMB = ∠AMC (matching angles).',
      'They sit on the straight line BC: together 180°.',
      '180 ÷ 2 = 90.',
      'Answer: 90°',
    ]),
    p('△ABC ≅ △DEF with AB = 3x − 1, DE = 2x + 4 and BC = x + 6. Find EF.', '11', [
      '3x − 1 = 2x + 4 → x = 5.',
      'EF = BC = 5 + 6 = 11.',
      'Answer: 11',
    ]),
    p('△ABC ≅ △DEF with ∠A = (x + 20)°, ∠D = (2x − 10)° and ∠B = 50°. Find ∠C.', '80', [
      'x + 20 = 2x − 10 → x = 30, so ∠A = 50.',
      '∠C = 180 − 50 − 50 = 80.',
      'Answer: 80°',
    ]),
    p(
      'Diagonal AC splits square ABCD (side 6) into two congruent triangles. What is the area of one?',
      '18',
      ['Square area: 6 × 6 = 36.', 'Two congruent halves: 36 ÷ 2 = 18.', 'Answer: 18'],
    ),
    p('△ABC ≅ △DEF and △DEF ≅ △GHI. GI = 4y − 3 and AC = 2y + 9. Find AC.', '21', [
      'AC = DF = GI, so 2y + 9 = 4y − 3.',
      '12 = 2y → y = 6.',
      'AC = 2(6) + 9 = 21.',
      'Answer: 21',
    ]),
    p(
      'In parallelogram ABCD, diagonal AC gives △ABC ≅ △CDA (ASA). AB = 3t + 2 and CD = 5t − 6. Find AB.',
      '14',
      ['AB matches CD: 3t + 2 = 5t − 6.', '8 = 2t → t = 4.', 'AB = 3(4) + 2 = 14.', 'Answer: 14'],
    ),
    p(
      'Triangle A(0, 0), B(4, 0), C(0, 3) is reflected to a congruent image. What is the image’s perimeter?',
      '12',
      [
        'AB = 4, AC = 3, BC = √(16 + 9) = 5.',
        'A reflection keeps every length: 4 + 3 + 5 = 12.',
        'Answer: 12',
      ],
    ),
    p('△ABC ≅ △DEF with AB = x + y, BC = 10, DE = 12 and EF = x − y. Find x.', '11', [
      'x + y = 12 and x − y = 10.',
      'Add: 2x = 22 → x = 11.',
      'Answer: 11',
    ]),
    p(
      'Isosceles △ABC has AB = AC = 13 and BC = 10. The altitude AM makes two congruent right triangles. Find AM.',
      '12',
      [
        'M is the midpoint of BC, so BM = 5.',
        'AM² = 13² − 5² = 169 − 25 = 144.',
        'AM = 12.',
        'Answer: 12',
      ],
    ),
  ],

  similar: [
    p('A side of 4 matches a side of 12 in a similar triangle. What is the scale factor?', '3', [
      'k = 12 ÷ 4.',
      'Answer: 3',
    ]),
    p('△ABC ~ △DEF with AB = 5, DE = 10 and BC = 7. Find EF.', '14', [
      'k = 10 ÷ 5 = 2.',
      'EF = 2 × 7 = 14.',
      'Answer: 14',
    ]),
    p('△ABC ~ △DEF and ∠A = 40°. Find ∠D.', '40', [
      'Matching angles in similar triangles are equal.',
      'Answer: 40°',
    ]),
    p(
      'Triangle 1 has angles 50° and 60°. Triangle 2 has angles 60° and 70°. What is triangle 2’s third angle?',
      '50',
      [
        '180 − 60 − 70 = 50.',
        'Both triangles have angles 50°, 60° and 70°: similar by AA.',
        'Answer: 50°',
      ],
    ),
    p('A triangle is shrunk by a scale factor of 1/2. A side of 18 becomes what?', '9', [
      '18 × 1/2 = 9.',
      'Answer: 9',
    ]),
    p('△ABC ~ △DEF with AB = 6 and DE = 9. What is the scale factor from ABC to DEF?', '3/2', [
      'k = DE ÷ AB = 9/6.',
      '= 3/2.',
      'Answer: 3/2',
    ]),
    p('A triangle with perimeter 20 is enlarged by a scale factor of 3. New perimeter?', '60', [
      'Every side triples, so the perimeter triples.',
      '3 × 20 = 60.',
      'Answer: 60',
    ]),
    p('A 3-4-5 triangle is similar to one whose shortest side is 9. Find its longest side.', '15', [
      'k = 9 ÷ 3 = 3.',
      '5 × 3 = 15.',
      'Answer: 15',
    ]),
    p('△ABC ~ △DEF with AB = 8, DE = 12 and AC = 10. Find DF.', '15', [
      'k = 12 ÷ 8 = 1.5.',
      'DF = 1.5 × 10 = 15.',
      'Answer: 15',
    ]),
    p(
      'A 6 ft person casts a 4 ft shadow. At the same time a tree casts a 30 ft shadow. How tall is the tree?',
      '45',
      [
        'Sun rays make similar triangles: height/shadow is the same.',
        '6/4 = h/30 → h = 30 × 1.5 = 45.',
        'Answer: 45 ft',
      ],
    ),
    p('In △ABC, DE ∥ BC with D on AB and E on AC. AD = 4, AB = 10, DE = 6. Find BC.', '15', [
      'DE ∥ BC gives △ADE ~ △ABC (AA).',
      'k = AB/AD = 10/4 = 2.5.',
      'BC = 2.5 × 6 = 15.',
      'Answer: 15',
    ]),
    p('Sides 5 and x of one triangle match sides 15 and 21 of a similar triangle. Find x.', '7', [
      '5/15 = x/21.',
      'x = 21 ÷ 3 = 7.',
      'Answer: 7',
    ]),
    p(
      'Two similar triangles have scale factor 2. How many times larger is the bigger one’s area?',
      '4',
      ['Areas scale by k².', '2² = 4.', 'Answer: 4'],
    ),
    p('△ABC ~ △XYZ with AB = x + 2, XY = 12, BC = 6 and YZ = 9. Find x.', '6', [
      'AB/XY = BC/YZ: (x + 2)/12 = 6/9 = 2/3.',
      'x + 2 = 8 → x = 6.',
      'Answer: 6',
    ]),
    p('A triangle of area 10 is enlarged by a scale factor of 3. New area?', '90', [
      'Area scales by k² = 9.',
      '10 × 9 = 90.',
      'Answer: 90',
    ]),
    p('Bow-tie: AD and BE cross at C with AB ∥ DE. AC = 6, CD = 9 and AB = 8. Find DE.', '12', [
      '△ABC ~ △DEC by AA (alternate interior angles).',
      'k = CD/AC = 9/6 = 1.5.',
      'DE = 1.5 × 8 = 12.',
      'Answer: 12',
    ]),
    p('A 6-8-10 triangle is similar to one with perimeter 72. Find its longest side.', '30', [
      'The first perimeter is 24, so k = 72 ÷ 24 = 3.',
      '10 × 3 = 30.',
      'Answer: 30',
    ]),
    p('In △ABC, DE ∥ BC, AD = 3, DB = 6 and DE = 5. Find BC.', '15', [
      'AB = AD + DB = 9 (not 6!).',
      'k = AB/AD = 9/3 = 3.',
      'BC = 3 × 5 = 15.',
      'Answer: 15',
    ]),
    p(
      'Two similar triangles have areas 16 and 36. A side of the smaller is 10. Find the matching side of the larger.',
      '15',
      ['Area ratio 36/16 = 9/4 = k².', 'k = 3/2.', '10 × 3/2 = 15.', 'Answer: 15'],
    ),
    p(
      'In a right triangle, the altitude to the hypotenuse splits it into lengths 4 and 9. Find the altitude.',
      '6',
      ['The altitude makes two similar triangles: 4/h = h/9.', 'h² = 36.', 'h = 6.', 'Answer: 6'],
    ),
    p(
      'A 1.5 m stick casts a 2 m shadow. A building casts a 36 m shadow. How tall is the building in meters?',
      '27',
      ['1.5/2 = h/36.', 'h = 36 × 0.75 = 27.', 'Answer: 27 m'],
    ),
    p('In △ABC, DE ∥ BC, AD = x, DB = 4, AE = 6 and EC = 8. Find x.', '3', [
      'A line parallel to one side cuts the other two in the same ratio: AD/DB = AE/EC.',
      'x/4 = 6/8.',
      'x = 3.',
      'Answer: 3',
    ]),
    p(
      'In △ABC, AB = 12. A line parallel to BC cuts off a small triangle at A with 1/4 of the area. How long is the small triangle’s side along AB?',
      '6',
      ['Area ratio 1/4 = k², so k = 1/2.', '12 × 1/2 = 6.', 'Answer: 6'],
    ),
    p(
      'Two similar triangles have perimeters 24 and 40. The smaller has area 18. Find the larger area.',
      '50',
      ['k = 40/24 = 5/3.', 'Area scales by k² = 25/9.', '18 × 25/9 = 50.', 'Answer: 50'],
    ),
    p('△ABC ~ △DEF with scale factor 3/2 (from ABC to DEF), AB = 2x and DE = x + 8. Find x.', '4', [
      'DE = 3/2 × AB: x + 8 = 3/2 × 2x = 3x.',
      '8 = 2x → x = 4.',
      'Answer: 4',
    ]),
  ],

  pythagoras: [
    p('Legs 3 and 4. Find the hypotenuse.', '5', ['c² = 9 + 16 = 25.', 'c = 5.', 'Answer: 5']),
    p('Legs 6 and 8. Find the hypotenuse.', '10', ['c² = 36 + 64 = 100.', 'c = 10.', 'Answer: 10']),
    p('Legs 5 and 12. Find the hypotenuse.', '13', [
      'c² = 25 + 144 = 169.',
      'c = 13.',
      'Answer: 13',
    ]),
    p('Hypotenuse 10, one leg 6. Find the other leg.', '8', [
      'b² = 100 − 36 = 64.',
      'b = 8.',
      'Answer: 8',
    ]),
    p('Hypotenuse 13, one leg 5. Find the other leg.', '12', [
      'b² = 169 − 25 = 144.',
      'b = 12.',
      'Answer: 12',
    ]),
    p('Legs 8 and 15. Find the hypotenuse.', '17', [
      'c² = 64 + 225 = 289.',
      'c = 17.',
      'Answer: 17',
    ]),
    p(
      'Legs 1 and 1. Find the hypotenuse.',
      'sqrt(2)',
      ['c² = 1 + 1 = 2.', 'c = √2.', 'Answer: √2'],
      'radical',
    ),
    p('Is 7-24-25 a right triangle? Work out 7² + 24².', '625', [
      '49 + 576 = 625.',
      'That equals 25², so yes, it is a right triangle.',
      'Answer: 625',
    ]),
    p(
      'Legs 2 and 3. Find the hypotenuse.',
      'sqrt(13)',
      ['c² = 4 + 9 = 13.', 'c = √13.', 'Answer: √13'],
      'radical',
    ),
    p(
      'Hypotenuse 9, one leg 6. Find the other leg (simplest radical form).',
      '3*sqrt(5)',
      ['b² = 81 − 36 = 45.', '√45 = √(9 × 5) = 3√5.', 'Answer: 3√5'],
      'radical',
    ),
    p(
      'A 10 m ladder leans on a wall with its foot 6 m from the wall. How high up the wall does it reach?',
      '8',
      ['The ladder is the hypotenuse: h² = 100 − 36 = 64.', 'h = 8.', 'Answer: 8 m'],
    ),
    p('Find the diagonal of a 9 by 12 rectangle.', '15', [
      'd² = 81 + 144 = 225.',
      'd = 15.',
      'Answer: 15',
    ]),
    p(
      'Find the diagonal of a square with side 5.',
      '5*sqrt(2)',
      ['d² = 25 + 25 = 50.', '√50 = √(25 × 2) = 5√2.', 'Answer: 5√2'],
      'radical',
    ),
    p(
      'A right triangle has hypotenuse 25 and legs in the ratio 3 : 4. Find the shorter leg.',
      '15',
      [
        'It is a 3-4-5 triangle scaled by 5 (5 × 5 = 25).',
        'Shorter leg: 3 × 5 = 15.',
        'Answer: 15',
      ],
    ),
    p('A screen is 32 inches wide and 24 inches tall. How long is its diagonal?', '40', [
      'd² = 1024 + 576 = 1600.',
      'd = 40.',
      'Answer: 40 inches',
    ]),
    p('You walk 5 km north, then 12 km east. How far are you from the start?', '13', [
      'North and east make a right angle.',
      'd² = 25 + 144 = 169 → d = 13.',
      'Answer: 13 km',
    ]),
    p('Legs 4 and 4√3. Find the hypotenuse.', '8', [
      '(4√3)² = 16 × 3 = 48.',
      'c² = 16 + 48 = 64 → c = 8.',
      'Answer: 8',
    ]),
    p('An isosceles triangle has sides 10, 10 and 12. Find its height to the base.', '8', [
      'The height cuts the base in half: 6.',
      'h² = 100 − 36 = 64.',
      'h = 8.',
      'Answer: 8',
    ]),
    p(
      'Find the height of an equilateral triangle with side 6.',
      '3*sqrt(3)',
      ['The height halves the base: 3.', 'h² = 36 − 9 = 27.', '√27 = 3√3.', 'Answer: 3√3'],
      'radical',
    ),
    p(
      'A box is 3 by 4 by 12. How long is the diagonal from one corner to the opposite corner?',
      '13',
      [
        'Floor diagonal: √(9 + 16) = 5.',
        'Then with the height: √(25 + 144) = √169 = 13.',
        'Answer: 13',
      ],
    ),
    p('A right triangle has legs x and x + 7 and hypotenuse 13. Find x.', '5', [
      'x² + (x + 7)² = 169 → 2x² + 14x + 49 = 169.',
      'x² + 7x − 60 = 0 → (x + 12)(x − 5) = 0.',
      'Lengths are positive: x = 5.',
      'Answer: 5',
    ]),
    p('A rhombus has diagonals 10 and 24. Find its side.', '13', [
      'The diagonals bisect each other at right angles: halves 5 and 12.',
      'side² = 25 + 144 = 169.',
      'side = 13.',
      'Answer: 13',
    ]),
    p('A right triangle has hypotenuse 2√10 and one leg 2. Find the other leg.', '6', [
      '(2√10)² = 4 × 10 = 40.',
      'b² = 40 − 4 = 36.',
      'b = 6.',
      'Answer: 6',
    ]),
    p('A boat goes 7 km east, 12 km south, then 9 km east. How far is it from the start?', '20', [
      'Total east: 7 + 9 = 16; total south: 12.',
      'd² = 256 + 144 = 400.',
      'd = 20.',
      'Answer: 20 km',
    ]),
    p(
      'A 25 ft ladder reaches 24 ft up a wall. Its foot is pulled 8 ft farther from the wall. How many feet does the top slide down?',
      '4',
      [
        'Foot at first: √(625 − 576) = 7 ft.',
        'Now 7 + 8 = 15 ft: height √(625 − 225) = 20 ft.',
        '24 − 20 = 4.',
        'Answer: 4 ft',
      ],
    ),
  ],

  coordinates: [
    p('What is the x-coordinate of the midpoint of (2, 4) and (6, 8)?', '4', [
      'Average the x-values: (2 + 6)/2.',
      '= 4.',
      'Answer: 4',
    ]),
    p('What is the y-coordinate of the midpoint of (2, 4) and (6, 8)?', '6', [
      '(4 + 8)/2 = 6.',
      'Answer: 6',
    ]),
    p('Find the distance from (0, 0) to (3, 4).', '5', ['√(3² + 4²) = √25.', 'Answer: 5']),
    p('Find the distance from (1, 2) to (1, 9).', '7', [
      'Same x, so the distance is the gap in y: 9 − 2.',
      'Answer: 7',
    ]),
    p('Find the distance from (−3, 5) to (4, 5).', '7', [
      'Same y, so the distance is the gap in x: 4 − (−3).',
      'Answer: 7',
    ]),
    p('What is the x-coordinate of the midpoint of (−2, 3) and (4, −7)?', '1', [
      '(−2 + 4)/2 = 1.',
      'Answer: 1',
    ]),
    p('What is the y-coordinate of the midpoint of (−2, 3) and (4, −7)?', '-2', [
      '(3 + (−7))/2 = −4/2.',
      'Answer: −2',
    ]),
    p('Find the distance from (0, 0) to (6, 8).', '10', ['√(36 + 64) = √100.', 'Answer: 10']),
    p('Find the distance from (1, 1) to (4, 5).', '5', [
      'Gaps: 3 across, 4 up.',
      '√(9 + 16) = 5.',
      'Answer: 5',
    ]),
    p('Find the distance from (−2, −3) to (3, 9).', '13', [
      'Gaps: 5 across, 12 up.',
      '√(25 + 144) = 13.',
      'Answer: 13',
    ]),
    p(
      'Find the distance from (2, 3) to (5, 6).',
      '3*sqrt(2)',
      ['Gaps: 3 and 3.', '√(9 + 9) = √18 = 3√2.', 'Answer: 3√2'],
      'radical',
    ),
    p('M(3, −1) is the midpoint of A(1, 4) and B. What is B’s x-coordinate?', '5', [
      '(1 + x)/2 = 3 → 1 + x = 6.',
      'x = 5.',
      'Answer: 5',
    ]),
    p('M(3, −1) is the midpoint of A(1, 4) and B. What is B’s y-coordinate?', '-6', [
      '(4 + y)/2 = −1 → 4 + y = −2.',
      'y = −6.',
      'Answer: −6',
    ]),
    p('Find the distance from (−1, 4) to (5, −4).', '10', [
      'Gaps: 6 across, 8 down.',
      '√(36 + 64) = 10.',
      'Answer: 10',
    ]),
    p(
      'Find the distance from (0, 0) to (5, 5).',
      '5*sqrt(2)',
      ['√(25 + 25) = √50.', '= 5√2.', 'Answer: 5√2'],
      'radical',
    ),
    p('The midpoint of (a, 6) and (8, b) is (5, 1). Find a.', '2', [
      '(a + 8)/2 = 5 → a + 8 = 10.',
      'a = 2.',
      'Answer: 2',
    ]),
    p('The midpoint of (a, 6) and (8, b) is (5, 1). Find b.', '-4', [
      '(6 + b)/2 = 1 → 6 + b = 2.',
      'b = −4.',
      'Answer: −4',
    ]),
    p('Find the perimeter of the triangle with corners (0, 0), (6, 0) and (6, 8).', '24', [
      'Sides: 6 (along the x-axis), 8 (up), and √(36 + 64) = 10.',
      '6 + 8 + 10 = 24.',
      'Answer: 24',
    ]),
    p('The distance from (1, 2) to (4, k) is 5, and k > 2. Find k.', '6', [
      '3² + (k − 2)² = 25 → (k − 2)² = 16.',
      'k − 2 = 4 (k > 2).',
      'k = 6.',
      'Answer: 6',
    ]),
    p('A circle has diameter from A(−3, 2) to B(5, −4). Find its radius.', '5', [
      'AB = √(8² + 6²) = √100 = 10.',
      'Radius = 10 ÷ 2 = 5.',
      'Answer: 5',
    ]),
    p('Find the area of the triangle with corners (0, 0), (8, 0) and (3, 6).', '24', [
      'Base along the x-axis: 8. Height: the y of (3, 6), which is 6.',
      'Area = ½ × 8 × 6 = 24.',
      'Answer: 24',
    ]),
    p(
      'P is on the line y = 4 and is the same distance from (0, 0) and (6, 0). How far is P from the origin?',
      '5',
      [
        'Equal distances from (0, 0) and (6, 0) means x = 3, halfway.',
        'P = (3, 4): √(9 + 16) = 5.',
        'Answer: 5',
      ],
    ),
    p(
      'A rectangle has corners (−2, 1), (4, 1), (4, 9) and (−2, 9). How long is a diagonal?',
      '10',
      ['Width 4 − (−2) = 6; height 9 − 1 = 8.', '√(36 + 64) = 10.', 'Answer: 10'],
    ),
    p('M is the midpoint of A(2, 1) and B(10, 7). Find AM.', '5', [
      'AB = √(8² + 6²) = 10.',
      'M is halfway, so AM = 5.',
      'Answer: 5',
    ]),
    p('Triangle A(1, 1), B(7, 1), C(4, 5) is isosceles. Find AC.', '5', [
      'Gaps from A to C: 3 across, 4 up.',
      '√(9 + 16) = 5 (and BC is also 5).',
      'Answer: 5',
    ]),
  ],

  circles: [
    p('A circle has radius 7. What is its diameter?', '14', ['d = 2r = 14.', 'Answer: 14']),
    p('A circle has diameter 18. What is its radius?', '9', ['r = d ÷ 2 = 9.', 'Answer: 9']),
    p(
      'The angle at the centre is 80°. What is the angle at the circumference on the same arc?',
      '40',
      ['The centre angle is twice the circumference angle.', '80 ÷ 2 = 40.', 'Answer: 40°'],
    ),
    p(
      'Find the circumference of a circle with radius 5, in terms of π.',
      '10*pi',
      ['C = 2πr = 2π × 5.', 'Answer: 10π'],
      'pi',
    ),
    p(
      'An angle at the circumference is 25°. What is the angle at the centre on the same arc?',
      '50',
      ['Centre angle = 2 × 25.', 'Answer: 50°'],
    ),
    p(
      'A triangle in a circle has one side as a diameter. What is the angle opposite the diameter?',
      '90',
      [
        'The angle at the centre on a diameter is 180°.',
        'Half of 180 = 90: the angle in a semicircle is a right angle.',
        'Answer: 90°',
      ],
    ),
    p(
      'Two angles at the circumference stand on the same chord, on the same side. One is 38°. The other?',
      '38',
      ['Angles on the same chord and same side are equal.', 'Answer: 38°'],
    ),
    p('What angle does a tangent make with the radius at the point where it touches?', '90', [
      'A tangent is always perpendicular to the radius at that point.',
      'Answer: 90°',
    ]),
    p(
      'Find the circumference of a circle with diameter 12, in terms of π.',
      '12*pi',
      ['C = πd = 12π.', 'Answer: 12π'],
      'pi',
    ),
    p(
      'The centre angle is (3x + 10)° and the angle at the circumference on the same arc is 50°. Find x.',
      '30',
      ['Centre angle = 2 × 50 = 100.', '3x + 10 = 100 → x = 30.', 'Answer: 30'],
    ),
    p('A circle has circumference 20π. Find its radius.', '10', [
      '2πr = 20π.',
      'r = 10.',
      'Answer: 10',
    ]),
    p(
      'A tangent and a chord make an angle of 65°. What is the angle in the opposite segment?',
      '65',
      ['Tangent–chord angle = angle in the opposite segment.', 'Answer: 65°'],
    ),
    p(
      'Two circumference angles on the same chord (same side) are (2x + 5)° and (3x − 15)°. Find x.',
      '20',
      ['They are equal: 2x + 5 = 3x − 15.', 'x = 20.', 'Answer: 20'],
    ),
    p(
      'A triangle in a circle has a diameter as one side, and one angle is 35°. Find the other acute angle.',
      '55',
      ['The angle opposite the diameter is 90°.', '180 − 90 − 35 = 55.', 'Answer: 55°'],
    ),
    p(
      'Radius 6 and a central angle of 90°. Find the arc length in terms of π.',
      '3*pi',
      ['90° is a quarter of the circle.', 'Circumference 12π ÷ 4 = 3π.', 'Answer: 3π'],
      'pi',
    ),
    p('A chord of length 16 is in a circle of radius 10. How far is it from the centre?', '6', [
      'The perpendicular from the centre halves the chord: 8.',
      'd² = 10² − 8² = 36.',
      'd = 6.',
      'Answer: 6',
    ]),
    p(
      'A point is 13 from the centre of a circle of radius 5. How long is a tangent from the point to the circle?',
      '12',
      [
        'Radius ⟂ tangent makes a right triangle with hypotenuse 13.',
        't² = 169 − 25 = 144.',
        't = 12.',
        'Answer: 12',
      ],
    ),
    p(
      'A chord makes a 140° angle at the centre. Find the angle at the circumference standing on that chord, on the major-arc side.',
      '70',
      [
        'The circumference angle on that side stands on the same 140° arc.',
        'Half of 140 = 70.',
        'Answer: 70°',
      ],
    ),
    p('A circle’s circumference and area have the same number value. Find the radius.', '2', [
      '2πr = πr².',
      'Divide by πr: 2 = r.',
      'Answer: 2',
    ]),
    p(
      'Two radii make a 50° angle at the centre and the chord joins their ends. Find each base angle of that triangle.',
      '65',
      ['Two radii are equal, so the triangle is isosceles.', '(180 − 50) ÷ 2 = 65.', 'Answer: 65°'],
    ),
    p('O is the centre, and the angle ACB at the circumference is 28°. Find ∠OAB.', '62', [
      'Centre angle AOB = 2 × 28 = 56.',
      'OA = OB (radii): base angles (180 − 56) ÷ 2.',
      '= 62.',
      'Answer: 62°',
    ]),
    p(
      'A wheel of diameter 0.5 m turns 100 times. How far does it roll, in meters, in terms of π?',
      '50*pi',
      ['One turn = circumference = 0.5π.', '100 × 0.5π = 50π.', 'Answer: 50π m'],
      'pi',
    ),
    p('A tangent at A and chord AB make a 72° angle. Find the centre angle AOB.', '144', [
      'Angle in the opposite segment = 72° (tangent–chord rule).',
      'That is a circumference angle on chord AB, so the centre angle is 2 × 72.',
      'Answer: 144°',
    ]),
    p('A circle has radius 13 and a chord 5 units from the centre. How long is the chord?', '24', [
      'Half the chord: √(169 − 25) = 12.',
      'Whole chord: 24.',
      'Answer: 24',
    ]),
    p('Tangents from P touch a circle (centre O) at A and B, and ∠APB = 50°. Find ∠AOB.', '130', [
      'OAPB has two right angles (tangent ⟂ radius).',
      'A quadrilateral has 360°: 360 − 90 − 90 − 50.',
      '= 130.',
      'Answer: 130°',
    ]),
  ],

  area: [
    p('Area of an 8 by 5 rectangle?', '40', ['A = lw = 8 × 5.', 'Answer: 40']),
    p('Perimeter of an 8 by 5 rectangle?', '26', ['P = 2l + 2w = 16 + 10.', 'Answer: 26']),
    p('Area of a square with side 7?', '49', ['7 × 7 = 49.', 'Answer: 49']),
    p('Area of a triangle with base 10 and height 6?', '30', [
      'A = ½ × base × height = ½ × 60.',
      'Answer: 30',
    ]),
    p(
      'Area of a circle with radius 3, in terms of π?',
      '9*pi',
      ['A = πr² = π × 9.', 'Answer: 9π'],
      'pi',
    ),
    p(
      'Circumference of a circle with radius 3, in terms of π?',
      '6*pi',
      ['C = 2πr = 6π.', 'Answer: 6π'],
      'pi',
    ),
    p('A square has perimeter 36. How long is each side?', '9', ['36 ÷ 4 = 9.', 'Answer: 9']),
    p('A rectangle has area 48 and length 8. Find its width.', '6', ['w = 48 ÷ 8.', 'Answer: 6']),
    p(
      'Area of a circle with diameter 10, in terms of π?',
      '25*pi',
      ['Halve the diameter first: r = 5.', 'πr² = 25π.', 'Answer: 25π'],
      'pi',
    ),
    p('Area of a parallelogram with base 9 and height 4?', '36', [
      'A = base × height (the perpendicular height).',
      '9 × 4 = 36.',
      'Answer: 36',
    ]),
    p('Area of a trapezoid with parallel sides 6 and 10 and height 5?', '40', [
      'A = ½(a + b)h = ½ × 16 × 5.',
      'Answer: 40',
    ]),
    p('A circle has area 49π. Find its radius.', '7', [
      'πr² = 49π → r² = 49.',
      'r = 7.',
      'Answer: 7',
    ]),
    p('A rectangle has perimeter 30 and length 9. Find its area.', '54', [
      '2(9 + w) = 30 → w = 6.',
      'A = 9 × 6 = 54.',
      'Answer: 54',
    ]),
    p('A right triangle has legs 7 and 24. Find its perimeter.', '56', [
      'Hypotenuse: √(49 + 576) = 25.',
      '7 + 24 + 25 = 56.',
      'Answer: 56',
    ]),
    p('A square has area 64. Find its perimeter.', '32', [
      'Side = √64 = 8.',
      '4 × 8 = 32.',
      'Answer: 32',
    ]),
    p(
      'Area of a semicircle with radius 4, in terms of π?',
      '8*pi',
      ['Full circle: 16π.', 'Half: 8π.', 'Answer: 8π'],
      'pi',
    ),
    p('A 10 by 8 rectangle has a 4 by 3 rectangle cut from one corner. Find the area left.', '68', [
      '80 − 12 = 68.',
      'Answer: 68',
    ]),
    p(
      'A circle fits exactly inside a square of side 10. Find the area of the square outside the circle (in terms of π).',
      '100 - 25*pi',
      [
        'Square: 100. The circle’s diameter is 10, so r = 5 and its area is 25π.',
        'Left over: 100 − 25π.',
        'Answer: 100 − 25π',
      ],
      'pi',
    ),
    p(
      'A circle has circumference 16π. Find its area in terms of π.',
      '64*pi',
      ['2πr = 16π → r = 8.', 'πr² = 64π.', 'Answer: 64π'],
      'pi',
    ),
    p(
      'A rectangle’s length is 3 more than its width and its area is 40. Find its perimeter.',
      '26',
      [
        'w(w + 3) = 40 → w² + 3w − 40 = 0 → (w + 8)(w − 5) = 0.',
        'w = 5, l = 8.',
        'P = 2(5 + 8) = 26.',
        'Answer: 26',
      ],
    ),
    p('If a circle’s radius doubles, its area is multiplied by what?', '4', [
      'π(2r)² = 4πr².',
      'Answer: 4',
    ]),
    p(
      'A track is a 100 by 20 rectangle with a semicircle on each short end (diameter 20). Find the outside perimeter in terms of π.',
      '200 + 20*pi',
      [
        'Two straight sides: 2 × 100 = 200.',
        'Two semicircles make one circle of diameter 20: 20π.',
        'Total: 200 + 20π.',
        'Answer: 200 + 20π',
      ],
      'pi',
    ),
    p(
      'Find the area of an equilateral triangle with side 4.',
      '4*sqrt(3)',
      ['Height: √(16 − 4) = √12 = 2√3.', 'A = ½ × 4 × 2√3 = 4√3.', 'Answer: 4√3'],
      'radical',
    ),
    p('A square has a diagonal of 8. Find its area.', '32', [
      's² + s² = 64, so s² = 32.',
      'Area = s² = 32.',
      'Answer: 32',
    ]),
    p(
      'Find the area of the ring between circles of radius 5 and 3, in terms of π.',
      '16*pi',
      ['Big circle 25π, small circle 9π.', '25π − 9π = 16π.', 'Answer: 16π'],
      'pi',
    ),
  ],

  solids: [
    p('Volume of a cube with side 3?', '27', ['V = s³ = 27.', 'Answer: 27']),
    p('Surface area of a cube with side 3?', '54', [
      '6 faces of 3 × 3 = 9.',
      '6 × 9 = 54.',
      'Answer: 54',
    ]),
    p('Volume of a 2 × 3 × 4 box?', '24', ['V = lwh = 24.', 'Answer: 24']),
    p('Surface area of a 2 × 3 × 4 box?', '52', [
      '2(lw + lh + wh) = 2(6 + 8 + 12).',
      '= 52.',
      'Answer: 52',
    ]),
    p(
      'Volume of a cylinder with radius 2 and height 5, in terms of π?',
      '20*pi',
      ['V = πr²h = π × 4 × 5.', 'Answer: 20π'],
      'pi',
    ),
    p('A cube has volume 64. How long is each edge?', '4', ['s³ = 64 → s = 4.', 'Answer: 4']),
    p('A prism has base area 15 and height 4. Find its volume.', '60', [
      'V = base area × height.',
      '15 × 4 = 60.',
      'Answer: 60',
    ]),
    p(
      'A cylinder has radius 3 and height 10. Find the area of its curved side, in terms of π.',
      '60*pi',
      ['The side unrolls into a rectangle 2πr by h.', '2π × 3 × 10 = 60π.', 'Answer: 60π'],
      'pi',
    ),
    p(
      'A cylinder has radius 3 and height 10. Find its total surface area, in terms of π.',
      '78*pi',
      ['Two circles: 2 × 9π = 18π.', 'Curved side: 60π.', '18π + 60π = 78π.', 'Answer: 78π'],
      'pi',
    ),
    p('A box is 5 by 4 by h with volume 100. Find h.', '5', ['20h = 100.', 'h = 5.', 'Answer: 5']),
    p('A cylinder of radius 3 has volume 72π. Find its height.', '8', [
      'π × 9 × h = 72π.',
      'h = 8.',
      'Answer: 8',
    ]),
    p('How many 2 cm cubes fit in a 6 × 4 × 8 cm box?', '24', [
      'Along each edge: 6 ÷ 2 = 3, 4 ÷ 2 = 2, 8 ÷ 2 = 4.',
      '3 × 2 × 4 = 24.',
      'Answer: 24',
    ]),
    p('A cube has surface area 150. How long is each edge?', '5', [
      '6s² = 150 → s² = 25.',
      's = 5.',
      'Answer: 5',
    ]),
    p(
      'Volume of a cylinder with diameter 8 and height 5, in terms of π?',
      '80*pi',
      ['r = 4.', 'π × 16 × 5 = 80π.', 'Answer: 80π'],
      'pi',
    ),
    p(
      'A prism has a right-triangle base with legs 3 and 4, and length 10. Find its volume.',
      '60',
      ['Base area: ½ × 3 × 4 = 6.', '6 × 10 = 60.', 'Answer: 60'],
    ),
    p('Every edge of a box is doubled. Its volume is multiplied by what?', '8', [
      'Each of length, width and height doubles: 2 × 2 × 2.',
      'Answer: 8',
    ]),
    p('Surface area of a 3 × 4 × 12 box?', '192', ['2(12 + 36 + 48) = 2 × 96.', 'Answer: 192']),
    p('A cube’s surface area and volume have the same number value. Find its edge.', '6', [
      '6s² = s³.',
      'Divide by s²: s = 6.',
      'Answer: 6',
    ]),
    p(
      'Total surface area of a cylinder with radius 4 and height 6, in terms of π?',
      '80*pi',
      [
        'Two circles: 2 × 16π = 32π.',
        'Curved side: 2π × 4 × 6 = 48π.',
        '32π + 48π = 80π.',
        'Answer: 80π',
      ],
      'pi',
    ),
    p('A tank is 2 m by 3 m by 1.5 m. How many liters does it hold? (1 m³ = 1000 L)', '9000', [
      'V = 2 × 3 × 1.5 = 9 m³.',
      '9 × 1000 = 9000.',
      'Answer: 9,000 L',
    ]),
    p(
      'A cylinder’s radius is tripled and its height halved. Its volume is multiplied by what?',
      '9/2',
      ['π(3r)²(h/2) = 9 × ½ × πr²h.', '= 9/2.', 'Answer: 9/2 (4.5)'],
    ),
    p(
      'A cube of edge 4 has a cylindrical hole of radius 1 drilled straight through. Find the volume left, in terms of π.',
      '64 - 4*pi',
      ['Cube: 64.', 'Hole: π × 1² × 4 = 4π.', '64 − 4π.', 'Answer: 64 − 4π'],
      'pi',
    ),
    p('An open-top box is 5 by 4 by 3 (5 by 4 base). Find its outside area.', '74', [
      'Base: 20 (no top).',
      'Sides: 2 × (5 × 3) + 2 × (4 × 3) = 30 + 24.',
      '20 + 54 = 74.',
      'Answer: 74',
    ]),
    p('A cylinder of height 6 has curved area 48π. Find its radius.', '4', [
      '2πr × 6 = 48π.',
      '12r = 48 → r = 4.',
      'Answer: 4',
    ]),
    p('A square-based prism has volume 200 and height 8. Find the side of the base.', '5', [
      'Base area: 200 ÷ 8 = 25.',
      'Side: √25 = 5.',
      'Answer: 5',
    ]),
  ],

  transformations: [
    p('Translate (2, 3) by (4, 1). What is the image’s x-coordinate?', '6', [
      '(x + 4, y + 1) = (6, 4).',
      'Answer: 6',
    ]),
    p('Reflect (5, −2) in the x-axis. What is the image’s y-coordinate?', '2', [
      'Reflection in the x-axis: (x, −y) = (5, 2).',
      'Answer: 2',
    ]),
    p('Reflect (5, −2) in the y-axis. What is the image’s x-coordinate?', '-5', [
      'Reflection in the y-axis: (−x, y) = (−5, −2).',
      'Answer: −5',
    ]),
    p('Dilate (3, 4) by 2 from the origin. What is the image’s y-coordinate?', '8', [
      '(kx, ky) = (6, 8).',
      'Answer: 8',
    ]),
    p('Translate (−1, 6) by (0, −4). What is the image’s y-coordinate?', '2', [
      '6 + (−4) = 2.',
      'Answer: 2',
    ]),
    p('Reflect (2, 7) in the line y = x. What is the image’s x-coordinate?', '7', [
      'Reflection in y = x swaps the coordinates: (7, 2).',
      'Answer: 7',
    ]),
    p('A segment of length 4 is dilated by 3. How long is the image?', '12', [
      'Dilation multiplies every length by k.',
      '4 × 3 = 12.',
      'Answer: 12',
    ]),
    p('A triangle with a side of 9 is translated. How long is that side in the image?', '9', [
      'Translations (and reflections) keep every length.',
      'Answer: 9',
    ]),
    p('Move (−3, 5) 6 right and 2 down. What is the image’s y-coordinate?', '3', [
      'Down 2: 5 − 2 = 3.',
      'Answer: 3',
    ]),
    p('Move (−3, 5) 6 right and 2 down. What is the image’s x-coordinate?', '3', [
      'Right 6: −3 + 6 = 3.',
      'Answer: 3',
    ]),
    p('Reflect (−4, −1) in the x-axis, then in the y-axis. What is the final x-coordinate?', '4', [
      'x-axis: (−4, 1).',
      'y-axis: (4, 1).',
      'Answer: 4',
    ]),
    p('Dilate (6, 8) by 1/2 from the origin. What is the image’s x-coordinate?', '3', [
      '½ × 6 = 3.',
      'Answer: 3',
    ]),
    p('A translation takes A(1, 2) to A′(4, −1). How many units right does it move points?', '3', [
      '4 − 1 = 3.',
      'Answer: 3',
    ]),
    p('A triangle of area 5 is dilated by 2. What is the image’s area?', '20', [
      'Lengths double, so areas multiply by 2² = 4.',
      '5 × 4 = 20.',
      'Answer: 20',
    ]),
    p('Reflect (3, −8) in y = x, then translate by (1, 1). What is the final x-coordinate?', '-7', [
      'y = x: (−8, 3).',
      'Translate: (−7, 4).',
      'Answer: −7',
    ]),
    p(
      'A point reflected in the y-axis lands on (−2, 5). What was the original x-coordinate?',
      '2',
      ['Reflection in the y-axis flips the sign of x.', '−(−2) = 2.', 'Answer: 2'],
    ),
    p('A dilation from the origin takes (4, 6) to (10, 15). What is the scale factor?', '5/2', [
      'k = 10 ÷ 4 = 2.5 (and 15 ÷ 6 = 2.5).',
      'Answer: 5/2',
    ]),
    p('The square (0, 0), (2, 0), (2, 2), (0, 2) is dilated by 3. Find the image’s area.', '36', [
      'Sides become 6.',
      '6 × 6 = 36.',
      'Answer: 36',
    ]),
    p(
      '(x, y) is translated by (3, −2), then reflected in the x-axis, landing on (5, 4). Find the original y.',
      '-2',
      [
        'Undo the reflection: before it, the point was (5, −4).',
        'Undo the translation: y − 2 = −4 → y = −2.',
        'Answer: −2',
      ],
    ),
    p('A(3, 4) is reflected in the y-axis to A′. Find AA′.', '6', [
      'A′ = (−3, 4).',
      'Same y, so AA′ = 3 − (−3) = 6.',
      'Answer: 6',
    ]),
    p('P(2, 5) is reflected in the x-axis to P′. Find PP′.', '10', [
      'P′ = (2, −5).',
      '5 − (−5) = 10.',
      'Answer: 10',
    ]),
    p('A triangle of perimeter 12 is dilated by 2.5. Find the image’s perimeter.', '30', [
      'Every side × 2.5, so the perimeter × 2.5.',
      '12 × 2.5 = 30.',
      'Answer: 30',
    ]),
    p('P(1, 6) is reflected in y = x to P′. Find the x-coordinate of the midpoint of PP′.', '7/2', [
      'P′ = (6, 1).',
      'Midpoint x: (1 + 6)/2 = 3.5.',
      'Answer: 3.5',
    ]),
    p(
      'A translation takes (2, −1) to (−3, 4). Where does it take (0, 0)? Give the y-coordinate.',
      '5',
      ['The move is (−5, +5).', '(0, 0) → (−5, 5).', 'Answer: 5'],
    ),
    p(
      'Dilate (4, −2) by 3 from the origin, then reflect in the x-axis. Find the final y-coordinate.',
      '6',
      ['Dilate: (12, −6).', 'Reflect in the x-axis: (12, 6).', 'Answer: 6'],
    ),
  ],
};
