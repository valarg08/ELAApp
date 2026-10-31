// Generates the PSAT algebra study-guide diagrams (original drawings) into the dir given as argv[2].
import fs from 'node:fs';
import { svg, poly, line, text, chevron } from './svg-kit.mjs';

fs.mkdirSync(process.argv[2], { recursive: true });

/** A grid: returns [body, X, Y] for x in [x0, x1], y in [y0, y1] at scale s, top-left at (left, top). */
const grid = (x0, x1, y0, y1, s, left, top, step = 1) => {
  const X = (x) => left + s * (x - x0),
    Y = (y) => top + s * (y1 - y);
  let b = '';
  for (let x = x0; x <= x1; x += step)
    b += line([X(x), Y(y1)], [X(x), Y(y0)], x === 0 ? 'ax' : 'g');
  for (let y = y0; y <= y1; y += step)
    b += line([X(x0), Y(y)], [X(x1), Y(y)], y === 0 ? 'ax' : 'g');
  return [b, X, Y];
};
const dot = (P, cls = 'dot', r = 5) =>
  `<circle class="${cls}" cx="${P[0]}" cy="${P[1]}" r="${r}"/>`;
const path = (pts, cls) => `<path class="${cls}" d="M${pts.map((p) => p.join(',')).join(' L')}"/>`;
const box = (x, y, w, h, cls) =>
  `<rect class="${cls}" x="${x}" y="${y}" width="${w}" height="${h}" rx="6"/>`;

// 1. Expressions: sorting like terms, and the distributive property.
{
  let b = text(190, 24, 'Collect like terms', 't');
  b += text(190, 56, '4x² + 3x − 6x² + 5 − x', '', 'middle');
  const groups = [
    ['fa', 'at', ['4x²', '−6x²'], '−2x²'],
    ['fh', 'ht', ['3x', '−x'], '+2x'],
    ['fv', 'vt', ['5'], '+5'],
  ];
  groups.forEach(([f, t, terms, sum], i) => {
    const x = 30 + i * 120;
    b += box(x, 76, 100, 70, `l ${f}`);
    b += text(x + 50, 116, terms.join('  '), t);
    b +=
      line([x + 50, 150], [x + 50, 170]) +
      `<path class="l" d="M${x + 44},164 L${x + 50},172 L${x + 56},164"/>`;
    b += text(x + 50, 194, sum, t);
  });
  b +=
    text(190, 232, '= −2x² + 2x + 5', 't') +
    text(190, 254, 'same variable part → add the coefficients', 's');
  // Distributive property
  b += text(560, 24, 'Distribute', 't');
  b +=
    text(480, 100, '2', 'ht') +
    text(500, 100, '(') +
    text(518, 100, 'x') +
    text(540, 100, '+') +
    text(562, 100, '5') +
    text(580, 100, ')');
  b += `<path class="h" d="M482,84 Q500,52 516,84"/><path class="h" d="M482,84 Q522,30 560,84"/>`;
  b += text(560, 150, '= 2·x + 2·5 = 2x + 10', '', 'middle');
  b += text(560, 196, '−3(x − 1) = −3x + 3', 'ht');
  b += text(560, 220, 'the sign goes in with the number', 's');
  svg(
    'expressions',
    720,
    265,
    'Like terms sorted into groups and collected to −2x² + 2x + 5; the distributive property 2(x + 5) = 2x + 10',
    b,
  );
}

// 2. Equations: the balance method.
{
  let b = text(170, 24, 'Keep it balanced', 't');
  b += poly(
    [
      [170, 150],
      [150, 190],
      [190, 190],
    ],
    'l fa',
  );
  b += line([50, 150], [290, 150]);
  b += line([70, 150], [70, 120]) + line([270, 150], [270, 120]);
  b += box(25, 80, 90, 40, 'l fh') + box(225, 80, 90, 40, 'l fh');
  b += text(70, 106, '3x − 4', 'ht') + text(270, 106, '11', 'ht');
  b += text(170, 222, 'do the same to both sides', 's');
  const steps = [
    ['3x − 4 = 11', ''],
    ['3x = 15', '+4 both sides'],
    ['x = 5', '÷3 both sides'],
    ['Check: 3(5) − 4 = 11 ✓', ''],
  ];
  steps.forEach(([eq, op], i) => {
    const y = 70 + i * 44;
    b += text(380, y, eq, i === 2 ? 'at' : i === 3 ? 's' : 't', 'start');
    if (op) b += text(560, y, op, 'ht', 'start');
  });
  b += text(380, 40, 'Undo + and − first, then × and ÷', 's', 'start');
  svg(
    'equations',
    720,
    240,
    'A balance scale with 3x − 4 on one pan and 11 on the other; adding 4 then dividing by 3 on both sides gives x = 5',
    b,
  );
}

// 3. Inequalities on number lines.
{
  let b = '';
  const s = 50,
    L = 70;
  const X = (x) => L + s * (x + 5);
  const nl = (y, title, at, closed, interval, cls) => {
    let o =
      text(20, y - 34, title, 't', 'start') +
      text(640, y - 34, interval, cls === 'h' ? 'ht' : 'at', 'end');
    o += line([X(-5) - 20, y], [X(6) + 20, y]) + chevron(X(6) + 22, y);
    for (let x = -5; x <= 6; x++)
      o +=
        line([X(x), y - 6], [X(x), y + 6]) + text(X(x), y + 26, String(x).replace('-', '−'), 's');
    o +=
      line([X(at) + (closed ? 0 : 8), y], [X(6) + 16, y], cls) +
      chevron(X(6) + 18, y).replace('class="l"', `class="${cls}"`);
    // Open: a ring with the page showing through (the line stops at its edge); closed: filled.
    o += closed
      ? `<circle class="${cls === 'h' ? 'fh' : 'fa'}" cx="${X(at)}" cy="${y}" r="8" style="fill-opacity:1"/>`
      : `<circle class="${cls}" cx="${X(at)}" cy="${y}" r="8"/>`;
    return o;
  };
  b += nl(80, '3x − 2 > 7  →  x > 3', 3, false, 'open circle · (3, ∞)', 'h');
  b += nl(
    190,
    '−2x + 5 ≤ 11  →  x ≥ −3 (÷ by −2 flips the sign)',
    -3,
    true,
    'closed circle · [−3, ∞)',
    'a',
  );
  svg(
    'inequalities',
    680,
    240,
    'Number lines: x > 3 with an open circle at 3 and an arrow right; x ≥ −3 with a closed circle at −3 and an arrow right',
    b,
  );
}

// 4. Functions: f(x) = x² − 1 and the vertical line test.
{
  const [g, X, Y] = grid(-3, 3, -2, 5, 32, 30, 20);
  let b = g;
  const pts = [];
  for (let x = -2.45; x <= 2.45; x += 0.05)
    pts.push([Math.round(X(x) * 10) / 10, Math.round(Y(x * x - 1) * 10) / 10]);
  b += path(pts, 'a');
  for (const x of [-2, -1, 0, 1, 2]) b += dot([X(x), Y(x * x - 1)]);
  b += line([X(1.5), Y(5)], [X(1.5), Y(-2)], 'h') + dot([X(1.5), Y(1.25)], 'dot', 4);
  b += text(X(1.5) + 6, Y(-1.5), 'crosses once', 'ht', 'start');
  b += text(X(2) + 8, Y(3) + 4, '(2, 3)', 's', 'start');
  const tx = 290;
  b += text(tx, 40, 'f(x) = x² − 1', 't', 'start');
  const xs = [-2, -1, 0, 1, 2];
  b += text(tx, 74, 'x', 's', 'start') + text(tx, 100, 'f(x)', 's', 'start');
  xs.forEach((x, i) => {
    b +=
      text(tx + 60 + i * 44, 74, String(x).replace('-', '−')) +
      text(tx + 60 + i * 44, 100, String(x * x - 1).replace('-', '−'), 'at');
  });
  b += line([tx, 82], [tx + 270, 82]);
  b += text(tx, 140, 'f(2) = 2² − 1 = 3: input 2, output 3', '', 'start');
  b += text(tx, 172, 'Vertical line test: no vertical line', 's', 'start');
  b += text(tx, 192, 'crosses the graph twice → a function', 's', 'start');
  svg(
    'functions',
    600,
    260,
    'The parabola f(x) = x² − 1 from a table of values, with a vertical line crossing it only once',
    b,
  );
}

// 5. Linear functions: y = (2/3)x − 1.
{
  const [g, X, Y] = grid(-4, 5, -4, 3, 30, 30, 20);
  let b = g;
  b += line([X(-4), Y(-11 / 3)], [X(5), Y(7 / 3)], 'a');
  b += path(
    [
      [X(0), Y(-1)],
      [X(0), Y(1)],
      [X(3), Y(1)],
    ],
    'h',
  );
  b += text(X(0) - 6, Y(0), 'rise 2', 'ht', 'end') + text(X(1.5), Y(1) - 8, 'run 3', 'ht');
  for (const [x, y] of [
    [0, -1],
    [3, 1],
    [-3, -3],
  ])
    b += dot([X(x), Y(y)]);
  b +=
    text(X(0) + 8, Y(-1) + 18, '(0, −1)', 's', 'start') +
    text(X(3) + 8, Y(1) + 18, '(3, 1)', 's', 'start');
  b += text(X(-3) + 8, Y(-3) + 18, '(−3, −3)', 's', 'start');
  const tx = 340;
  b += text(tx, 50, 'y = mx + b', 't', 'start');
  b += text(tx, 80, 'y = (2/3)x − 1', 'at', 'start');
  b += text(tx, 116, 'b = −1: start at (0, −1)', '', 'start');
  b += text(tx, 142, 'm = 2/3: up 2, right 3', 'ht', 'start');
  b += text(tx, 178, 'slope = rise ÷ run', 's', 'start');
  svg(
    'linear',
    600,
    270,
    'The line y = (2/3)x − 1 starting at the y-intercept (0, −1), with a rise of 2 and run of 3 to (3, 1)',
    b,
  );
}

// 6. Systems: two lines crossing at (3, 3).
{
  const [g, X, Y] = grid(-1, 6, -3, 7, 25, 30, 20);
  let b = g;
  b += line([X(-1), Y(7)], [X(6), Y(0)], 'a') + line([X(0), Y(-3)], [X(5), Y(7)], 'h');
  b += dot([X(3), Y(3)], 'dot', 6) + text(X(3) + 10, Y(3) + 5, '(3, 3)', 't', 'start');
  const tx = 250;
  b += text(tx, 50, 'x + y = 6  →  y = −x + 6', 'at', 'start');
  b += text(tx, 78, '2x − y = 3  →  y = 2x − 3', 'ht', 'start');
  b += text(tx, 120, 'They cross at (3, 3), so x = 3, y = 3', 't', 'start');
  b += text(tx, 156, 'Elimination: add the equations', 's', 'start');
  b += text(tx, 176, '3x = 9 → x = 3, then y = 3', 's', 'start');
  b += text(tx, 206, 'Substitution: y = 6 − x into the other', 's', 'start');
  b += text(tx, 226, '2x − (6 − x) = 3 → x = 3', 's', 'start');
  svg(
    'systems',
    580,
    285,
    'The lines y = −x + 6 and y = 2x − 3 crossing at (3, 3), the solution of the system',
    b,
  );
}

// 7. Exponents: counting factors.
{
  let b = '';
  const tiles = (x, y, n, cls, lab) => {
    let o = '';
    for (let i = 0; i < n; i++)
      o += box(x + i * 34, y, 28, 28, `l ${cls}`) + text(x + i * 34 + 14, y + 19, lab, '');
    return o;
  };
  b += text(20, 30, 'Product: add the exponents', 't', 'start');
  b += tiles(20, 44, 2, 'fa', '3') + text(100, 64, '×') + tiles(116, 44, 3, 'fh', '3');
  b += text(240, 64, '= 3⁵   (2 + 3 = 5 threes)', '', 'start');
  b += text(20, 116, 'Quotient: subtract the exponents', 't', 'start');
  b += tiles(20, 130, 6, 'fa', '5') + text(230, 150, '÷') + tiles(248, 130, 4, 'fh', '5');
  b += text(390, 150, '= 5²   (4 cancel)', '', 'start');
  b += text(20, 202, 'Power of a power: multiply', 't', 'start');
  for (let g2 = 0; g2 < 3; g2++) {
    b += `<rect class="d" x="${16 + g2 * 84}" y="212" width="76" height="40" rx="8"/>`;
    b += tiles(22 + g2 * 84, 218, 2, 'fv', '2');
  }
  b += text(272, 238, '= (2²)³ = 2⁶', '', 'start');
  b += text(20, 286, 'Brackets decide the base: (−4)² = 16 but −4² = −16', 'ht', 'start');
  svg(
    'exponents',
    560,
    300,
    'Exponent rules shown with tiles: 3² × 3³ = 3⁵, 5⁶ ÷ 5⁴ = 5², and (2²)³ = 2⁶',
    b,
  );
}

// 8. Multiplying: the area model for (x + 2)(x + 6).
{
  let b = text(180, 24, '(x + 2)(x + 6)', 't');
  const x0 = 70,
    y0 = 50,
    X = 120,
    S = 36,
    W6 = 150;
  b += box(x0, y0, X, X, 'l fa') + box(x0 + X, y0, W6, X, 'l fh');
  b += box(x0, y0 + X, X, S * 1.4, 'l fh') + box(x0 + X, y0 + X, W6, S * 1.4, 'l fv');
  b += text(x0 + X / 2, 40, 'x', 's') + text(x0 + X + W6 / 2, 40, '+6', 's');
  b += text(x0 - 10, y0 + X / 2, 'x', 's', 'end') + text(x0 - 10, y0 + X + 30, '+2', 's', 'end');
  b +=
    text(x0 + X / 2, y0 + X / 2 + 5, 'x²', 'at') +
    text(x0 + X + W6 / 2, y0 + X / 2 + 5, '6x', 'ht');
  b += text(x0 + X / 2, y0 + X + 30, '2x', 'ht') + text(x0 + X + W6 / 2, y0 + X + 30, '12', 'vt');
  b += text(400, 100, 'x² + 6x + 2x + 12', '', 'start');
  b += text(400, 130, '= x² + 8x + 12', 't', 'start');
  b +=
    text(400, 170, 'FOIL: First, Outside,', 's', 'start') +
    text(400, 190, 'Inside, Last', 's', 'start');
  svg(
    'multiplying',
    620,
    240,
    'An area model for (x + 2)(x + 6) with boxes x², 6x, 2x and 12, giving x² + 8x + 12',
    b,
  );
}

// 9. Factoring: sum-product diamond and a reverse area model.
{
  let b = text(120, 24, 'x² + x − 12', 't');
  const c = [120, 130];
  b += poly(
    [
      [c[0], c[1] - 70],
      [c[0] + 70, c[1]],
      [c[0], c[1] + 70],
      [c[0] - 70, c[1]],
    ],
    'l fa',
  );
  // An X through the diamond's edge midpoints makes four cells: top, right, bottom, left.
  b +=
    line([c[0] - 35, c[1] - 35], [c[0] + 35, c[1] + 35]) +
    line([c[0] + 35, c[1] - 35], [c[0] - 35, c[1] + 35]);
  b += text(c[0], c[1] - 30, '−12', 'ht') + text(c[0], c[1] + 42, '+1', 'at');
  b += text(c[0] - 38, c[1] + 6, '4', 't') + text(c[0] + 38, c[1] + 6, '−3', 't');
  b +=
    text(c[0], 228, 'product −12 (top), sum 1 (bottom)', 's') +
    text(c[0], 248, '→ (x + 4)(x − 3)', 'at');
  // Reverse area model 3x² + 10x + 8
  b += text(470, 24, '3x² + 10x + 8', 't');
  const x0 = 380,
    y0 = 60;
  b += box(x0, y0, 110, 70, 'l fa') + box(x0 + 110, y0, 70, 70, 'l fh');
  b += box(x0, y0 + 70, 110, 50, 'l fh') + box(x0 + 110, y0 + 70, 70, 50, 'l fv');
  b += text(x0 + 55, y0 + 40, '3x²', 'at') + text(x0 + 145, y0 + 40, '6x', 'ht');
  b += text(x0 + 55, y0 + 100, '4x', 'ht') + text(x0 + 145, y0 + 100, '8', 'vt');
  b += text(x0 + 55, y0 - 8, 'x', 's') + text(x0 + 145, y0 - 8, '+2', 's');
  b += text(x0 - 8, y0 + 40, '3x', 's', 'end') + text(x0 - 8, y0 + 100, '+4', 's', 'end');
  b +=
    text(470, 210, 'ac = 24 → 6 and 4 (sum 10)', 's') + text(470, 232, '= (3x + 4)(x + 2)', 'at');
  svg(
    'factoring',
    600,
    260,
    'Factoring: a sum-product diamond for x² + x − 12 giving (x + 4)(x − 3), and an area model splitting 3x² + 10x + 8 into (3x + 4)(x + 2)',
    b,
  );
}

// 10. Quadratics: y = x² − 4x + 3.
{
  const [g, X, Y] = grid(-1, 5, -2, 6, 30, 30, 20);
  let b = g;
  const pts = [];
  for (let x = -0.6; x <= 4.6; x += 0.05)
    pts.push([Math.round(X(x) * 10) / 10, Math.round(Y(x * x - 4 * x + 3) * 10) / 10]);
  b += path(pts, 'a');
  b += line([X(2), Y(6)], [X(2), Y(-2)], 'd');
  b += dot([X(2), Y(-1)], 'dot', 6) + dot([X(1), Y(0)], 'dot', 6) + dot([X(3), Y(0)], 'dot', 6);
  b += text(X(2) + 10, Y(-1) + 18, 'vertex (2, −1)', 'ht', 'start');
  b +=
    text(X(1) - 8, Y(0) - 10, '(1, 0)', 's', 'end') +
    text(X(3) + 8, Y(0) - 10, '(3, 0)', 's', 'start');
  const tx = 260;
  b += text(tx, 40, 'y = x² − 4x + 3', 't', 'start');
  b += text(tx, 74, 'Vertex: x = −b ÷ 2a = 4 ÷ 2 = 2', '', 'start');
  b += text(tx, 98, 'y = 4 − 8 + 3 = −1', '', 'start');
  b += text(tx, 134, 'Roots: (x − 1)(x − 3) = 0', 'at', 'start');
  b += text(tx, 158, 'x = 1 or x = 3', 'at', 'start');
  b += text(tx, 194, 'a > 0: opens up, vertex is the minimum', 's', 'start');
  b += text(tx, 214, 'the dashed line x = 2 is the axis of symmetry', 's', 'start');
  svg(
    'quadratics',
    600,
    275,
    'The parabola y = x² − 4x + 3 with vertex (2, −1), roots at x = 1 and x = 3, and axis of symmetry x = 2',
    b,
  );
}

console.log(fs.readdirSync(process.argv[2]).join(' '));
