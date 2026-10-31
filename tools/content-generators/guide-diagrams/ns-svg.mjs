// Generates the PSAT number sense study-guide diagrams (original drawings) into the dir given as argv[2].
import fs from 'node:fs';
import { svg, line, text, chevron } from './svg-kit.mjs';

fs.mkdirSync(process.argv[2], { recursive: true });

const box = (x, y, w, h, cls) =>
  `<rect class="${cls}" x="${x}" y="${y}" width="${w}" height="${h}" rx="6"/>`;
const rect = (x, y, w, h, cls) =>
  `<rect class="${cls}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
const dot = (x, y, cls = 'dot', r = 5) => `<circle class="${cls}" cx="${x}" cy="${y}" r="${r}"/>`;
const neg = (n) => String(n).replace('-', '−');
const arrowHead = (x, y, dirn, cls) =>
  `<path class="${cls}" d="M${x - 7 * dirn},${y - 6} L${x},${y} L${x - 7 * dirn},${y + 6}"/>`;
/** A number line from a to b; returns [body, X]. */
const numberLine = (a, b, y, left, s) => {
  const X = (x) => left + s * (x - a);
  let o =
    line([X(a) - 16, y], [X(b) + 16, y]) +
    chevron(X(b) + 18, y) +
    `<path class="l" d="M${X(a) - 13},${y - 6} L${X(a) - 21},${y} L${X(a) - 13},${y + 6}"/>`;
  for (let x = a; x <= b; x++)
    o += line([X(x), y - 6], [X(x), y + 6]) + text(X(x), y + 24, neg(x), x === 0 ? 't' : 's');
  return [o, X];
};
/** A hop arc above the line from x1 to x2. */
const hop = (X, x1, x2, y, h, cls) => {
  const a = X(x1),
    c = X(x2);
  return (
    `<path class="${cls}" d="M${a},${y - 8} Q${(a + c) / 2},${y - h} ${c},${y - 8}"/>` +
    arrowHead(c, y - 9, c > a ? 1 : -1, cls).replace(/L(\S+),(\S+) L/, (m) => m)
  );
};

// 1. Integers: hops on a number line and the sign rules.
{
  let b = text(20, 26, 'Combine signs, then move: add → right, subtract → left', 't', 'start');
  const [nl, X] = numberLine(-6, 6, 170, 50, 44);
  b += nl;
  b +=
    `<path class="a" d="M${X(-2)},162 Q${(X(-2) + X(3)) / 2},70 ${X(3)},162"/>` +
    dot(X(-2), 170, 'dot') +
    dot(X(3), 170, 'dot');
  b += text((X(-2) + X(3)) / 2, 96, '−2 − (−5) = −2 + 5 = 3', 'at');
  b +=
    `<path class="h" d="M${X(3)},202 Q${(X(3) + X(-4)) / 2},290 ${X(-4)},202"/>` +
    dot(X(-4), 170, 'dot');
  b += text((X(3) + X(-4)) / 2, 280, '3 + (−7) = 3 − 7 = −4', 'ht');
  b += `<path class="a" d="M${X(3) - 11},${157} L${X(3)},${162} L${X(3) + 1},${150}"/>`;
  b += `<path class="h" d="M${X(-4) + 12},${206} L${X(-4)},${202} L${X(-4) + 1},${214}"/>`;
  // Sign table
  const tx = 660;
  b += text(tx + 70, 60, '× or ÷', 't');
  const rows = [
    ['+', '+', '+'],
    ['−', '−', '+'],
    ['+', '−', '−'],
    ['−', '+', '−'],
  ];
  rows.forEach((r, i) => {
    const y = 96 + i * 34;
    b +=
      text(tx + 20, y, r[0]) +
      text(tx + 50, y, r[1]) +
      text(tx + 80, y, '→') +
      text(tx + 115, y, r[2], r[2] === '+' ? 'at' : 'ht');
  });
  b += line([tx, 70], [tx + 140, 70]);
  b += text(tx + 70, 244, 'same → +', 'at') + text(tx + 70, 266, 'opposite → −', 'ht');
  svg(
    'integers',
    820,
    300,
    'A number line from −6 to 6 with −2 − (−5) = 3 as a jump right and 3 + (−7) = −4 as a jump left, and a sign table for products',
    b,
  );
}

// 2. Absolute value: distance from zero.
{
  let b = text(20, 26, 'Absolute value = distance from 0', 't', 'start');
  const [nl, X] = numberLine(-6, 6, 150, 50, 46);
  b += nl;
  const brace = (x1, x2, cls) =>
    `<path class="${cls}" d="M${x1},128 L${x1},112 L${x2},112 L${x2},128"/>`;
  b += brace(X(-4), X(0), 'h') + brace(X(0), X(4), 'a');
  b += dot(X(-4), 150) + dot(X(4), 150);
  b +=
    text((X(-4) + X(0)) / 2, 100, '4 units', 'ht') + text((X(0) + X(4)) / 2, 100, '4 units', 'at');
  b += text(X(-4), 66, '|−4| = 4', 'ht') + text(X(4), 66, '|4| = 4', 'at');
  b += text(350, 214, 'A distance is never negative: |a| ≥ 0 and |−a| = |a|', 's');
  svg(
    'absolute-value',
    700,
    230,
    'A number line with −4 and 4 each 4 units from 0, so |−4| = |4| = 4',
    b,
  );
}

// 3. Fractions: common denominators with bars, and keep-change-flip.
{
  let b = text(20, 26, 'Add: make the pieces the same size', 't', 'start');
  const bar = (x, y, w, parts, shaded, cls, label) => {
    let o = '';
    const pw = w / parts;
    for (let i = 0; i < parts; i++)
      o += rect(x + i * pw, y, pw, 30, `l${i < shaded ? ` ${cls}` : ''}`);
    return o + text(x - 10, y + 21, label, '', 'end');
  };
  b += bar(80, 50, 240, 3, 1, 'fh', '1/3') + bar(80, 90, 240, 2, 1, 'fa', '1/2');
  b += text(200, 146, '↓ cut into sixths', 's');
  b += bar(80, 160, 240, 6, 2, 'fh', '2/6') + bar(80, 200, 240, 6, 3, 'fa', '3/6');
  // 5/6: 2 orange + 3 teal
  let five = '';
  for (let i = 0; i < 6; i++)
    five += rect(80 + i * 40, 250, 40, 30, `l${i < 2 ? ' fh' : i < 5 ? ' fa' : ''}`);
  b += five + text(70, 271, '5/6', 'at', 'end');
  b += text(200, 306, '1/3 + 1/2 = 2/6 + 3/6 = 5/6', 't');
  // Divide
  const dx = 420;
  b += text(dx, 26, 'Divide: keep, change, flip', 't', 'start');
  b +=
    text(dx + 10, 90, '3/4', 't', 'start') +
    text(dx + 60, 90, '÷', '', 'start') +
    text(dx + 86, 90, '2/5', 'ht', 'start');
  b +=
    text(dx + 10, 150, '3/4', 't', 'start') +
    text(dx + 60, 150, '×', 'at', 'start') +
    text(dx + 86, 150, '5/2', 'ht', 'start');
  b +=
    text(dx + 10, 118, 'keep', 's', 'start') +
    text(dx + 56, 118, 'change', 's', 'start') +
    text(dx + 104, 118, 'flip', 's', 'start');
  b += text(dx + 10, 200, '= 15/8', 'at', 'start');
  b +=
    text(dx + 10, 250, 'Multiply: tops × tops,', 's', 'start') +
    text(dx + 10, 270, 'bottoms × bottoms', 's', 'start');
  svg(
    'fractions',
    640,
    320,
    'Fraction bars: 1/3 + 1/2 rewritten as 2/6 + 3/6 = 5/6, and 3/4 ÷ 2/5 = 3/4 × 5/2 = 15/8 by keep-change-flip',
    b,
  );
}

// 4. Percent: a hundred grid.
{
  let b = text(20, 26, 'Percent = per hundred', 't', 'start');
  const s = 20,
    L = 30,
    T = 44;
  for (let i = 0; i < 100; i++) {
    const r = Math.floor(i / 10),
      c = i % 10;
    b += rect(L + c * s, T + r * s, s, s, i < 35 ? 'g fh' : 'g').replace(
      '/>',
      i < 35 ? '/>' : ' style="fill:none"/>',
    );
  }
  b += `<rect class="l" x="${L}" y="${T}" width="${10 * s}" height="${10 * s}"/>`;
  b += text(L + 5 * s, T + 10 * s + 26, '35 of 100 squares', 's');
  const tx = 280;
  b += text(tx, 80, '35%  =  35/100  =  0.35', 't', 'start');
  b +=
    text(tx, 136, '35%', 'ht', 'start') +
    text(tx + 70, 136, '→', '', 'start') +
    text(tx + 100, 136, '0.35', 'at', 'start');
  b += text(tx, 160, 'percent → decimal: point 2 places left', 's', 'start');
  b +=
    text(tx, 206, '0.6', 'at', 'start') +
    text(tx + 70, 206, '→', '', 'start') +
    text(tx + 100, 206, '60%', 'ht', 'start');
  b += text(tx, 230, 'decimal → percent: 2 places right', 's', 'start');
  b += text(tx, 268, '15% of 80 = 0.15 × 80 = 12', '', 'start');
  svg(
    'percent',
    600,
    300,
    'A 10 by 10 grid with 35 squares shaded: 35% = 35/100 = 0.35, and 0.6 = 60%',
    b,
  );
}

// 5. Ratios: a double number line.
{
  let b = text(20, 26, 'Equal ratios: flour : eggs = 3 : 2', 't', 'start');
  const L = 140,
    s = 150;
  const top = 80,
    bot = 160;
  b += line([L - 20, top], [L + 3 * s + 30, top]) + line([L - 20, bot], [L + 3 * s + 30, bot]);
  b +=
    text(L - 30, top + 5, 'cups of flour', 's', 'end') + text(L - 30, bot + 5, 'eggs', 's', 'end');
  [
    [0, 0],
    [3, 2],
    [6, 4],
    [9, 6],
  ].forEach(([f, e], i) => {
    const x = L + i * s;
    const cls = i === 3 ? 'ht' : i === 1 ? 'at' : '';
    b += line([x, top - 7], [x, top + 7]) + line([x, bot - 7], [x, bot + 7]);
    b += text(x, top - 14, i === 3 ? 'x = 9' : String(f), cls) + text(x, bot + 26, String(e), cls);
  });
  b +=
    `<path class="d" d="M${L + s},${bot + 38} Q${L + 2 * s},${bot + 78} ${L + 3 * s},${bot + 38}"/>` +
    text(L + 2 * s, bot + 74, '× 3', 'ht');
  b += text(
    20,
    270,
    '3/2 = x/6  →  scale factor 3, so x = 9   (or cross-multiply: 2x = 18)',
    '',
    'start',
  );
  svg(
    'ratios',
    700,
    290,
    'A double number line matching 3 cups of flour to 2 eggs, 6 to 4 and 9 to 6: 3/2 = x/6 gives x = 9',
    b,
  );
}

// 6. Powers: base and exponent, brackets, and the rules.
{
  let b = '';
  b += `<text x="60" y="90" style="font-size:44px;font-weight:700" class="at">5</text><text x="88" y="62" style="font-size:24px;font-weight:700" class="ht">3</text>`;
  b += text(74, 124, 'base', 'at') + text(100, 36, 'exponent', 'ht');
  b += text(130, 80, '= 5 × 5 × 5 = 125', '', 'start');
  b += text(130, 104, 'three factors of the base', 's', 'start');
  b += text(30, 170, 'Brackets decide the base', 't', 'start');
  b += text(30, 202, '(−2)⁴ = (−2)(−2)(−2)(−2) = 16', 'at', 'start');
  b += text(30, 232, '−2⁴ = −(2 · 2 · 2 · 2) = −16', 'ht', 'start');
  const rx = 420;
  b += text(rx, 40, 'Same base rules', 't', 'start');
  const rules = [
    ['aᵐ × aⁿ = aᵐ⁺ⁿ', '3² × 3³ = 3⁵'],
    ['aᵐ ÷ aⁿ = aᵐ⁻ⁿ', '7⁶ ÷ 7⁴ = 7²'],
    ['(aᵐ)ⁿ = aᵐⁿ', '(5²)³ = 5⁶'],
  ];
  rules.forEach(([r, e], i) => {
    const y = 64 + i * 58;
    b +=
      box(rx, y, 260, 46, 'l fv') +
      text(rx + 14, y + 29, r, 'vt', 'start') +
      text(rx + 150, y + 29, e, '', 'start');
  });
  svg(
    'powers',
    700,
    260,
    '5³ = 5 × 5 × 5 with base and exponent labelled; (−2)⁴ = 16 but −2⁴ = −16; the product, quotient and power-of-a-power rules',
    b,
  );
}

// 7. Scientific notation: decimal hops.
{
  let b = text(20, 26, 'a × 10ⁿ with 1 ≤ a &lt; 10', 't', 'start');
  const hops = (x0, y, n, w, cls, dirn) => {
    let o = '';
    for (let i = 0; i < n; i++) {
      const a = x0 + dirn * i * w,
        c = a + dirn * w;
      o += `<path class="${cls}" d="M${a},${y} Q${(a + c) / 2},${y - 22} ${c},${y}"/>`;
    }
    return o;
  };
  // 3.2 × 10^5 → 320000
  const w = 22,
    y1 = 96,
    x1 = 60;
  const digs1 = ['3', '2', '0', '0', '0', '0'];
  digs1.forEach((d, i) => (b += text(x1 + i * w + w / 2, y1 + 22, d, i < 2 ? 't' : 's')));
  b +=
    dot(x1 + w, y1 + 24, 'dot', 3) +
    hops(x1 + w, y1, 5, w, 'h', 1) +
    dot(x1 + 6 * w, y1 + 24, 'ht', 4);
  b += text(x1 + 6 * w + 20, y1 + 22, '3.2 × 10⁵ = 320,000', '', 'start');
  b += text(x1 + 6 * w + 20, y1 + 44, 'n = 5 > 0 → point moves 5 right', 's', 'start');
  // 0.00061 → 6.1 × 10^-4
  const y2 = 196,
    x2 = 60;
  const digs2 = ['0', '0', '0', '0', '6', '1'];
  digs2.forEach((d, i) => (b += text(x2 + i * w + w / 2, y2 + 22, d, i < 4 ? 's' : 't')));
  b +=
    dot(x2 + w, y2 + 24, 'dot', 3) +
    hops(x2 + w, y2, 4, w, 'a', 1) +
    dot(x2 + 5 * w, y2 + 24, 'at', 4);
  b += text(x2 + 6 * w + 20, y2 + 22, '0.00061 = 6.1 × 10⁻⁴', '', 'start');
  b += text(x2 + 6 * w + 20, y2 + 44, 'point moved 4 right → n = −4', 's', 'start');
  b += text(
    20,
    290,
    'Big numbers → positive n; numbers between 0 and 1 → negative n',
    's',
    'start',
  );
  svg(
    'scientific-notation',
    600,
    310,
    '3.2 × 10⁵ = 320,000 with the decimal point hopping 5 places right, and 0.00061 = 6.1 × 10⁻⁴ with the point hopping 4 places',
    b,
  );
}

// 8. Rounding: place values and look-one-right.
{
  let b = text(20, 26, 'Place values', 't', 'start');
  const digits = ['5', '7', '2', '9', '3', '8', '.', '1', '6', '4'];
  const names = [
    'hundred thousands',
    'ten thousands',
    'thousands',
    'hundreds',
    'tens',
    'ones',
    '',
    'tenths',
    'hundredths',
    'thousandths',
  ];
  const w = 62,
    L = 60;
  digits.forEach((d, i) => {
    const x = L + i * w;
    b += text(x, 70, d, 't');
    if (names[i])
      b += `<text class="s" transform="translate(${x + 4},86) rotate(40)" text-anchor="start">${names[i]}</text>`;
  });
  const y = 236;
  b += text(20, y - 20, 'Round 4.6283 to the nearest hundredth', 't', 'start');
  ['4', '.', '6', '2', '8', '3'].forEach((d, i) => {
    const x = 60 + i * 30;
    b += text(x, y + 20, d, i === 3 ? 'at' : i === 4 ? 'ht' : '');
  });
  b += box(60 + 3 * 30 - 13, y - 2, 26, 30, 'l fa') + box(60 + 4 * 30 - 13, y - 2, 26, 30, 'l fh');
  b += text(60 + 4 * 30, y + 52, '8 ≥ 5', 'ht');
  b += text(290, y + 12, 'digit to the right is 5–9 → round up', '', 'start');
  b += text(290, y + 36, '4.6283 ≈ 4.63', 'at', 'start');
  b += text(290, y + 60, '(0–4 → round down: keep the digit)', 's', 'start');
  svg(
    'rounding',
    700,
    300,
    'Place values of 572,938.164, and 4.6283 rounded to the nearest hundredth: the next digit 8 is 5 or more, so 4.63',
    b,
  );
}

// 9. Factors: a factor tree and the LCM.
{
  let b = text(20, 26, 'Factor tree', 't', 'start');
  const node = (x, y, s, prime) =>
    (prime ? `<circle class="a fa" cx="${x}" cy="${y - 5}" r="17"/>` : '') +
    text(x, y, s, prime ? 'at' : 't');
  b += node(170, 70, '84') + line([160, 80], [110, 116]) + line([180, 80], [230, 116]);
  b += node(100, 136, '4') + node(240, 136, '21');
  b +=
    line([92, 146], [70, 182]) +
    line([108, 146], [130, 182]) +
    line([232, 146], [210, 182]) +
    line([248, 146], [270, 182]);
  b +=
    node(64, 202, '2', true) +
    node(136, 202, '2', true) +
    node(204, 202, '3', true) +
    node(276, 202, '7', true);
  b += text(170, 252, '84 = 2 × 2 × 3 × 7 = 2² × 3 × 7', 't');
  b += text(170, 276, 'every branch ends in a prime', 's');
  const lx = 380;
  b += text(lx, 26, 'Least common multiple', 't', 'start');
  const m6 = [6, 12, 18, 24, 30],
    m8 = [8, 16, 24, 32, 40];
  b += text(lx, 74, '6:', 't', 'start') + text(lx, 124, '8:', 't', 'start');
  m6.forEach((m, i) => (b += text(lx + 50 + i * 46, 74, String(m), m === 24 ? 'ht' : '')));
  m8.forEach((m, i) => (b += text(lx + 50 + i * 46, 124, String(m), m === 24 ? 'ht' : '')));
  b += `<circle class="h" cx="${lx + 50 + 3 * 46}" cy="69" r="18"/><circle class="h" cx="${lx + 50 + 2 * 46}" cy="119" r="18"/>`;
  b += text(lx, 176, 'LCM(6, 8) = 24, the first shared multiple', '', 'start');
  b += text(lx, 214, '1/6 + 3/8 = 4/24 + 9/24 = 13/24', 'at', 'start');
  svg(
    'factors',
    680,
    295,
    'A factor tree for 84 = 2² × 3 × 7, and the multiples of 6 and 8 meeting first at 24, their LCM',
    b,
  );
}

// 10. Order of operations: PEMDAS steps and a worked example.
{
  let b = text(20, 26, 'PEMDAS', 't', 'start');
  const steps = [
    ['P', 'Parentheses', 'fv', 'vt'],
    ['E', 'Exponents', 'fb', 'bt'],
    ['M D', '× and ÷, left to right', 'fh', 'ht'],
    ['A S', '+ and −, left to right', 'fa', 'at'],
  ];
  steps.forEach(([k, n, f, t], i) => {
    const x = 20 + i * 24,
      y = 44 + i * 50;
    b +=
      box(x, y, 250, 40, `l ${f}`) +
      text(x + 14, y + 26, k, t, 'start') +
      text(x + 62, y + 26, n, '', 'start');
  });
  const wx = 400;
  b += text(wx, 26, 'Work it one step at a time', 't', 'start');
  const lines = [
    ['18 − 2 × (1 + 3)² ÷ 4', '', ''],
    ['= 18 − 2 × 4² ÷ 4', 'P', 'vt'],
    ['= 18 − 2 × 16 ÷ 4', 'E', 'bt'],
    ['= 18 − 32 ÷ 4', '× comes first', 'ht'],
    ['= 18 − 8', '÷', 'ht'],
    ['= 10', '−', 'at'],
  ];
  lines.forEach(([e, s, c], i) => {
    const y = 64 + i * 36;
    b += text(wx, y, e, i === 5 ? 'at' : '', 'start') + (s ? text(wx + 220, y, s, c, 'start') : '');
  });
  svg(
    'order-of-operations',
    720,
    290,
    'PEMDAS as steps with × ÷ together and + − together, and 18 − 2 × (1 + 3)² ÷ 4 worked to 10',
    b,
  );
}
