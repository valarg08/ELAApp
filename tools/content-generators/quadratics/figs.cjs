// Our own diagrams for the Quadratics guide: one SVG per chapter, drawn from small specs.
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, '../../..', 'apps/web/public/guides/quadratics');
fs.mkdirSync(OUT, { recursive: true });
const M = '−';
const sg = (n) => (n < 0 ? M + -n : String(n));

const STYLE = `<style>
.l{stroke:#334155;stroke-width:2;fill:none;stroke-linejoin:round}
.d{stroke:#334155;stroke-width:1.5;fill:none;stroke-dasharray:5 4}
.a{stroke:#0d9488;stroke-width:3;fill:none;stroke-linejoin:round}
.h{stroke:#ea580c;stroke-width:3.5;fill:none;stroke-linejoin:round;stroke-linecap:round}
.v{stroke:#7c3aed;stroke-width:3;fill:none;stroke-linejoin:round}
.b{stroke:#2563eb;stroke-width:3;fill:none;stroke-linejoin:round}
.g{stroke:#cbd5e1;stroke-width:1}
.ax{stroke:#64748b;stroke-width:1.5}
.fa{fill:#0d9488;fill-opacity:.14}
.fh{fill:#ea580c;fill-opacity:.16}
.fv{fill:#7c3aed;fill-opacity:.12}
.fb{fill:#2563eb;fill-opacity:.12}
.dot{fill:#334155}
.dh{fill:#ea580c}
text{font:15px system-ui,-apple-system,'Segoe UI',sans-serif;fill:#334155}
.t{font-weight:700;font-size:15px}
.s{font-size:13px;fill:#64748b}
.ht{fill:#c2410c;font-weight:700}
.at{fill:#0f766e;font-weight:700}
.vt{fill:#6d28d9;font-weight:700}
.bt{fill:#1d4ed8;font-weight:700}
@media (prefers-color-scheme:dark){
.l,.d{stroke:#cbd5e1}.dot{fill:#cbd5e1}text{fill:#e2e8f0}.s{fill:#94a3b8}
.a{stroke:#2dd4bf}.h{stroke:#fb923c}.v{stroke:#a78bfa}.b{stroke:#60a5fa}
.g{stroke:#334155}.ax{stroke:#94a3b8}
.ht{fill:#fb923c}.at{fill:#2dd4bf}.vt{fill:#a78bfa}.bt{fill:#60a5fa}}
</style>`;

const r1 = (n) => Math.round(n * 10) / 10;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const svg = (alt, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 275" width="600" height="275" role="img" aria-label="${esc(alt)}">\n<title>${esc(alt)}</title>\n${STYLE}\n${body}\n</svg>\n`;
const text = (x, y, s, cls = '', anchor = 'start') =>
  `<text${cls ? ` class="${cls}"` : ''} x="${r1(x)}" y="${r1(y)}" text-anchor="${anchor}">${esc(s)}</text>`;

/** A small plot area: math ranges mapped to a rectangle of the canvas. */
function plot({
  x,
  y,
  w,
  h,
  xr,
  yr,
  f,
  curve = 'a',
  dots = [],
  vlines = [],
  hlines = [],
  xs = 1,
  ys = 1,
  labels = [],
}) {
  const X = (v) => x + ((v - xr[0]) / (xr[1] - xr[0])) * w;
  const Y = (v) => y + h - ((v - yr[0]) / (yr[1] - yr[0])) * h;
  let s = '';
  for (let v = Math.ceil(xr[0] / xs) * xs; v <= xr[1] + 1e-9; v += xs)
    s += `<line class="${v === 0 ? 'ax' : 'g'}" x1="${r1(X(v))}" y1="${y}" x2="${r1(X(v))}" y2="${y + h}"/>`;
  for (let v = Math.ceil(yr[0] / ys) * ys; v <= yr[1] + 1e-9; v += ys)
    s += `<line class="${v === 0 ? 'ax' : 'g'}" x1="${x}" y1="${r1(Y(v))}" x2="${x + w}" y2="${r1(Y(v))}"/>`;
  const pts = [];
  for (let v = xr[0]; v <= xr[1] + 1e-9; v += (xr[1] - xr[0]) / 120) {
    const yy = f(v);
    if (yy >= yr[0] - 1e-9 && yy <= yr[1] + 1e-9) pts.push(`${r1(X(v))},${r1(Y(yy))}`);
  }
  s += `<polyline class="${curve}" fill="none" points="${pts.join(' ')}"/>`;
  for (const v of vlines)
    s += `<line class="d" x1="${r1(X(v))}" y1="${y}" x2="${r1(X(v))}" y2="${y + h}"/>`;
  for (const v of hlines)
    s += `<line class="d" x1="${x}" y1="${r1(Y(v))}" x2="${x + w}" y2="${r1(Y(v))}"/>`;
  for (const [dx, dy, cls = 'dot'] of dots)
    s += `<circle class="${cls}" cx="${r1(X(dx))}" cy="${r1(Y(dy))}" r="5.5"/>`;
  for (const [lx, ly, t, cls = 's', anchor = 'start'] of labels)
    s += text(X(lx), Y(ly), t, cls, anchor);
  return s;
}
const write = (name, alt, body) => fs.writeFileSync(path.join(OUT, `${name}.svg`), svg(alt, body));
const lines = (x, y0, gap, items) =>
  items.map(([t, cls = ''], i) => text(x, y0 + i * gap, t, cls)).join('');

// 1 ─ recognizing a quadratic: table with finite differences and the graph
{
  const f = (v) => v * v - 6 * v + 8;
  const xs = [0, 1, 2, 3, 4, 5];
  const ys = xs.map(f);
  const d1 = ys.slice(1).map((v, i) => v - ys[i]);
  const d2 = d1.slice(1).map((v, i) => v - d1[i]);
  let b = text(20, 28, 'y = x² − 6x + 8', 't');
  b +=
    text(20, 56, 'x', 'at') +
    xs.map((v, i) => text(70 + i * 30, 56, String(v), '', 'middle')).join('');
  b +=
    text(20, 84, 'y', 'at') + ys.map((v, i) => text(70 + i * 30, 84, sg(v), '', 'middle')).join('');
  b +=
    text(20, 118, '1st diff', 'bt') +
    d1.map((v, i) => text(85 + i * 30, 118, sg(v), 'bt', 'middle')).join('');
  b +=
    text(20, 150, '2nd diff', 'ht') +
    d2.map((v, i) => text(100 + i * 30, 150, sg(v), 'ht', 'middle')).join('');
  b +=
    text(20, 186, 'The second differences are constant,', 's') +
    text(20, 204, 'so the relationship is quadratic.', 's');
  b +=
    text(20, 232, 'The graph is a parabola: it has a vertex', 's') +
    text(20, 250, 'and an axis of symmetry.', 's');
  b += plot({
    x: 300,
    y: 20,
    w: 270,
    h: 225,
    xr: [-1, 7],
    yr: [-3, 10],
    f,
    curve: 'a',
    dots: [[3, -1, 'dh']],
    vlines: [3],
    labels: [
      [3.15, -1.8, 'vertex (3, −1)', 'ht'],
      [3.15, 9, 'axis x = 3', 's'],
    ],
  });
  write(
    'recognize',
    'A table of values for y = x² − 6x + 8 with constant second differences of 2, and its U-shaped graph with the vertex (3, −1) and the axis of symmetry x = 3.',
    b,
  );
}

// 2 ─ standard form
{
  const f = (v) => 2 * v * v + 4 * v - 5;
  let b = text(20, 30, 'y = ax² + bx + c', 't') + text(20, 60, 'y = 2x² + 4x − 5', 't');
  b += lines(20, 96, 26, [
    ['a = 2   b = 4   c = −5', ''],
    ['a > 0: opens up', 'at'],
    ['c = −5: y-intercept (0, −5)', 'ht'],
  ]);
  b +=
    text(20, 190, 'a < 0 would open down.', 's') +
    text(20, 210, 'Best way to graph it: make a table of values.', 's');
  b += plot({
    x: 320,
    y: 20,
    w: 250,
    h: 230,
    xr: [-4, 3],
    yr: [-8, 14],
    f,
    curve: 'a',
    dots: [[0, -5, 'dh']],
    xs: 1,
    ys: 2,
    labels: [[0.3, -5.8, '(0, −5)', 'ht']],
  });
  write(
    'standard',
    'The parabola y = 2x² + 4x − 5 opening up because a = 2, crossing the y-axis at (0, −5) because c = −5.',
    b,
  );
}

// 3 ─ vertex form
{
  const f = (v) => -2 * (v - 5) ** 2 + 39;
  let b = text(20, 30, 'y = a(x − h)² + k', 't') + text(20, 58, 'vertex (h, k), axis x = h', 'ht');
  b +=
    text(20, 98, 'y = −2x² + 20x − 11', '') +
    text(20, 124, '= −2(x² − 10x) − 11', 's') +
    text(20, 144, '= −2(x² − 10x + 25) + 50 − 11', 's') +
    text(20, 164, '= −2(x − 5)² + 39', 'vt');
  b +=
    text(20, 196, 'vertex (5, 39), axis x = 5', 'ht') +
    text(20, 216, 'a = −2 < 0: opens down, so', 's') +
    text(20, 234, 'the vertex is a maximum.', 's');
  b += plot({
    x: 330,
    y: 20,
    w: 245,
    h: 235,
    xr: [-1, 11],
    yr: [-15, 45],
    f,
    curve: 'v',
    dots: [
      [5, 39, 'dh'],
      [0, -11],
    ],
    vlines: [5],
    xs: 1,
    ys: 10,
    labels: [
      [5.3, 36, '(5, 39)', 'ht'],
      [0.4, -9, '(0, −11)', 's'],
    ],
  });
  write(
    'vertex-form',
    'The parabola y = −2(x − 5)² + 39 opening down with its vertex (5, 39) at the top, the axis of symmetry x = 5, and the y-intercept (0, −11).',
    b,
  );
}

// 4 ─ factored form
{
  const f = (v) => 0.5 * (v + 2) * (v - 6);
  let b =
    text(20, 30, 'y = a(x − m)(x − n)', 't') +
    text(20, 58, 'x-intercepts m and n', 'at') +
    text(20, 80, 'axis x = (m + n) ÷ 2', 'ht');
  b +=
    text(20, 118, 'y = ½(x + 2)(x − 6)', '') +
    text(20, 144, 'y = 0: x = −2 or x = 6', 'at') +
    text(20, 166, 'axis: (−2 + 6) ÷ 2 = 2', 'ht') +
    text(20, 188, 'x = 2: ½(4)(−4) = −8', 'vt') +
    text(20, 214, 'vertex (2, −8)', 'vt');
  b += plot({
    x: 330,
    y: 20,
    w: 245,
    h: 235,
    xr: [-4, 8],
    yr: [-10, 8],
    f,
    curve: 'b',
    dots: [
      [-2, 0, 'dot'],
      [6, 0, 'dot'],
      [2, -8, 'dh'],
    ],
    vlines: [2],
    xs: 1,
    ys: 2,
    labels: [
      [-2, 1.6, '−2', 's', 'middle'],
      [6, 1.6, '6', 's', 'middle'],
      [2.3, -8.7, '(2, −8)', 'vt'],
    ],
  });
  write(
    'factored-form',
    'The parabola y = ½(x + 2)(x − 6) crossing the x-axis at −2 and 6, with the axis of symmetry x = 2 halfway between and the vertex (2, −8).',
    b,
  );
}

// 5 ─ factoring three ways
{
  let b = text(20, 24, 'Factoring three ways', 't');
  // a = 1: sum and product
  b +=
    `<rect class="fa" x="20" y="36" width="170" height="108" rx="8"/>` +
    text(105, 56, 'x² + 11x + 24', 'at', 'middle');
  b +=
    text(105, 80, 'product 24, sum 11', 's', 'middle') +
    text(105, 102, '8 and 3', '', 'middle') +
    text(105, 128, '(x + 8)(x + 3)', 'at', 'middle');
  // a ≠ 1: split and group
  b +=
    `<rect class="fh" x="215" y="36" width="170" height="108" rx="8"/>` +
    text(300, 56, '2x² + 7x − 4', 'ht', 'middle');
  b +=
    text(300, 78, 'product −8, sum 7: 8, −1', 's', 'middle') +
    text(300, 98, '2x² + 8x − x − 4', '', 'middle') +
    text(300, 118, '2x(x + 4) − (x + 4)', 's', 'middle') +
    text(300, 138, '(x + 4)(2x − 1)', 'ht', 'middle');
  // difference of squares
  b +=
    `<rect class="fv" x="410" y="36" width="170" height="108" rx="8"/>` +
    text(495, 56, 'x² − 9', 'vt', 'middle');
  b +=
    text(495, 80, '9 = 3²', 's', 'middle') +
    text(495, 102, 'a² − b² = (a − b)(a + b)', 's', 'middle') +
    text(495, 128, '(x − 3)(x + 3)', 'vt', 'middle');
  b +=
    text(20, 178, 'Always take out a common factor first:', 's') +
    text(20, 200, '2x² − 2x − 24 = 2(x² − x − 12) = 2(x − 4)(x + 3)', '');
  b += text(20, 232, 'Check by expanding: the factors must multiply back to the original.', 's');
  write(
    'factoring',
    'Three ways to factor: a sum and product pair for x² + 11x + 24 giving (x + 8)(x + 3), splitting and grouping for 2x² + 7x − 4 giving (x + 4)(2x − 1), and the difference of squares x² − 9 = (x − 3)(x + 3).',
    b,
  );
}

// 6 ─ solving by factoring
{
  const f = (v) => 2 * (v - 4) * (v + 3);
  let b =
    text(20, 30, '2x² − 2x − 24 = 0', 't') +
    text(20, 58, '2(x² − x − 12) = 0', 's') +
    text(20, 80, '2(x − 4)(x + 3) = 0', '');
  b +=
    text(20, 110, 'Zero product rule:', 'at') +
    text(20, 132, 'x − 4 = 0  or  x + 3 = 0', '') +
    text(20, 160, 'x = 4  or  x = −3', 'ht');
  b +=
    text(20, 196, 'Always set the equation equal to', 's') +
    text(20, 214, '0 before you factor.', 's');
  b += plot({
    x: 320,
    y: 20,
    w: 255,
    h: 235,
    xr: [-6, 7],
    yr: [-60, 40],
    f,
    curve: 'h',
    dots: [
      [-3, 0, 'dh'],
      [4, 0, 'dh'],
    ],
    xs: 1,
    ys: 10,
    labels: [
      [-3, 12, '−3', 'ht', 'middle'],
      [4, 12, '4', 'ht', 'middle'],
    ],
  });
  write(
    'solve-factoring',
    'The parabola y = 2x² − 2x − 24 crossing the x-axis at x = −3 and x = 4, the two solutions found by factoring 2(x − 4)(x + 3) = 0.',
    b,
  );
}

// 7 ─ completing the square with an area model
{
  let b = text(20, 28, 'Solve x² − 6x − 8 = 0', 't');
  // area model: x by x square, two 3 x x strips, 3 x 3 corner (drawn as (x - 3)² inside x²)
  b += `<rect class="fb" x="30" y="46" width="150" height="150" /><rect class="l" x="30" y="46" width="150" height="150"/>`;
  b += `<rect class="fh" x="30" y="46" width="105" height="105"/><rect class="l" x="30" y="46" width="105" height="105"/>`;
  b +=
    text(82, 104, '(x − 3)²', 'ht', 'middle') +
    text(157, 104, '3', 's', 'middle') +
    text(82, 176, '3', 's', 'middle') +
    text(157, 176, '9', 's', 'middle');
  b += text(105, 214, 'x', 's', 'middle') + text(18, 124, 'x', 's');
  b += text(20, 236, 'x² − 6x + 9 = (x − 3)²', 's') + text(20, 254, 'adding 9 makes a square', 's');
  b += lines(220, 60, 26, [
    ['x² − 6x = 8', ''],
    ['x² − 6x + 9 = 8 + 9', ''],
    ['(x − 3)² = 17', 'ht'],
    ['x − 3 = ±√17', ''],
    ['x = 3 ± √17', 'vt'],
  ]);
  b +=
    text(220, 212, 'Add half the x-coefficient squared', 's') +
    text(220, 232, 'to both sides: (−6 ÷ 2)² = 9.', 's');
  write(
    'complete-square',
    'An area model for completing the square: the square (x − 3)² plus two strips of 3 and a corner of 9 make up x², leading from x² − 6x − 8 = 0 to (x − 3)² = 17 and x = 3 ± √17.',
    b,
  );
}

// 8 ─ the quadratic formula
{
  let b = text(20, 30, 'ax² + bx + c = 0', 't');
  b +=
    text(20, 78, 'x =', 'ht') +
    text(60, 66, '−b ± √(b² − 4ac)', 'ht') +
    `<line class="h" x1="58" y1="76" x2="215" y2="76"/>` +
    text(137, 98, '2a', 'ht', 'middle');
  b += text(20, 140, 'Example: x² − 6x − 8 = 0', 't') + text(20, 164, 'a = 1, b = −6, c = −8', 's');
  b +=
    text(20, 190, 'x = (6 ± √(36 + 32)) ÷ 2', '') +
    text(20, 212, 'x = (6 ± 2√17) ÷ 2', '') +
    text(20, 236, 'x = 3 ± √17', 'vt');
  b +=
    text(330, 66, 'It comes from completing the', 's') +
    text(330, 86, 'square on the general quadratic.', 's');
  b +=
    text(330, 130, 'Steps:', 'at') +
    lines(330, 154, 24, [
      ['1. Set the equation equal to 0', 's'],
      ['2. Read a, b and c with signs', 's'],
      ['3. Work out b² − 4ac first', 's'],
      ['4. Simplify the root, then divide', 's'],
    ]);
  write(
    'formula',
    'The quadratic formula x = (−b ± √(b² − 4ac)) ÷ 2a, with the example x² − 6x − 8 = 0 giving x = 3 ± √17.',
    b,
  );
}

// 9 ─ the discriminant: three parabolas
{
  const xr = [-4, 4];
  let b = text(20, 24, 'The discriminant  b² − 4ac', 't');
  const box = (x0, title, sub, f, yr, dots, cls) =>
    text(x0 + 85, 50, title, cls, 'middle') +
    text(x0 + 85, 68, sub, 's', 'middle') +
    plot({
      x: x0,
      y: 80,
      w: 170,
      h: 150,
      xr,
      yr,
      f,
      curve: cls === 'at' ? 'a' : cls === 'ht' ? 'h' : 'v',
      dots,
      xs: 2,
      ys: 2,
    });
  b += box(
    20,
    '> 0',
    'two real solutions',
    (v) => v * v - 4,
    [-6, 6],
    [
      [-2, 0, 'dh'],
      [2, 0, 'dh'],
    ],
    'at',
  );
  b += box(215, '= 0', 'one real solution', (v) => v * v, [-2, 10], [[0, 0, 'dh']], 'ht');
  b += box(410, '< 0', 'no real solutions', (v) => v * v + 2, [-2, 10], [], 'vt');
  b +=
    text(105, 250, 'cuts the x-axis twice', 's', 'middle') +
    text(300, 250, 'vertex on the x-axis', 's', 'middle') +
    text(495, 250, 'never reaches the x-axis', 's', 'middle');
  write(
    'discriminant',
    'Three parabolas: a positive discriminant gives two x-intercepts, a zero discriminant touches the x-axis once at the vertex, and a negative discriminant never reaches the x-axis.',
    b,
  );
}

// 10 ─ finding the vertex three ways
{
  const f = (v) => 2 * v * v - 12 * v + 10;
  let b = text(20, 28, 'y = 2x² − 12x + 10', 't');
  b +=
    text(20, 58, '1. Complete the square', 'at') +
    text(20, 78, '2(x² − 6x + 9) − 18 + 10', 's') +
    text(20, 96, '= 2(x − 3)² − 8', '');
  b +=
    text(20, 126, '2. Average the x-intercepts', 'bt') +
    text(20, 146, '2(x − 1)(x − 5): (1 + 5) ÷ 2 = 3', 's');
  b += text(20, 176, '3. x = −b ÷ 2a', 'ht') + text(20, 196, '12 ÷ 4 = 3', 's');
  b += text(20, 228, 'Then y = 2(9) − 36 + 10 = −8', 's') + text(20, 250, 'vertex (3, −8)', 'vt');
  b += plot({
    x: 330,
    y: 20,
    w: 245,
    h: 235,
    xr: [-1, 7],
    yr: [-12, 40],
    f,
    curve: 'v',
    dots: [
      [3, -8, 'dh'],
      [1, 0],
      [5, 0],
    ],
    vlines: [3],
    xs: 1,
    ys: 10,
    labels: [[3.3, -8, '(3, −8)', 'ht']],
  });
  write(
    'find-vertex',
    'The parabola y = 2x² − 12x + 10 with vertex (3, −8) found three ways: completing the square, averaging the x-intercepts 1 and 5, and using x = −b ÷ 2a.',
    b,
  );
}
console.log(fs.readdirSync(OUT).join(' '));
