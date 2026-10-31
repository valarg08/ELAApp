// Generates the PSAT geometry study-guide diagrams (original drawings) into the dir given as argv[2].
import fs from 'node:fs';
import path from 'node:path';

const out = process.argv[2];
fs.mkdirSync(out, { recursive: true });

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

const svg = (name, w, h, title, body) => {
  const s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${title}">
<title>${title}</title>
${STYLE}
${body}
</svg>
`;
  fs.writeFileSync(path.join(out, `${name}.svg`), s);
};

const r1 = (n) => Math.round(n * 10) / 10;
const pt = (cx, cy, r, deg) => [
  r1(cx + r * Math.cos((deg * Math.PI) / 180)),
  r1(cy + r * Math.sin((deg * Math.PI) / 180)),
];
/** An angle arc at (cx, cy) from direction a1 to a2 (degrees, SVG's clockwise-from-x), the short way. */
const arc = (cx, cy, r, a1, a2, cls = 'h') => {
  let d = a2 - a1;
  while (d > 180) d -= 360;
  while (d < -180) d += 360;
  const [x1, y1] = pt(cx, cy, r, a1);
  const [x2, y2] = pt(cx, cy, r, a1 + d);
  return `<path class="${cls}" d="M${x1},${y1} A${r},${r} 0 0 ${d > 0 ? 1 : 0} ${x2},${y2}"/>`;
};
const dir = (x1, y1, x2, y2) => (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
/** Arc for the angle at vertex V between rays to P and Q. */
const angleAt = (V, P, Q, r, cls = 'h') =>
  arc(V[0], V[1], r, dir(...V, ...P), dir(...V, ...Q), cls);
const label = (V, P, Q, r, text, cls = 'ht') => {
  let a1 = dir(...V, ...P);
  let d = dir(...V, ...Q) - a1;
  while (d > 180) d -= 360;
  while (d < -180) d += 360;
  const [x, y] = pt(V[0], V[1], r, a1 + d / 2);
  return `<text class="${cls}" x="${x}" y="${y + 5}" text-anchor="middle">${text}</text>`;
};
const poly = (pts, cls) =>
  `<polygon class="${cls}" points="${pts.map((p) => p.join(',')).join(' ')}"/>`;
const line = (A, B, cls = 'l') =>
  `<line class="${cls}" x1="${A[0]}" y1="${A[1]}" x2="${B[0]}" y2="${B[1]}"/>`;
const text = (x, y, s, cls = '', anchor = 'middle') =>
  `<text${cls ? ` class="${cls}"` : ''} x="${x}" y="${y}" text-anchor="${anchor}">${s}</text>`;
const tick = (A, B, n = 1) => {
  const mx = (A[0] + B[0]) / 2,
    my = (A[1] + B[1]) / 2;
  const L = Math.hypot(B[0] - A[0], B[1] - A[1]);
  const ux = (B[0] - A[0]) / L,
    uy = (B[1] - A[1]) / L;
  let s = '';
  for (let i = 0; i < n; i++) {
    const o = (i - (n - 1) / 2) * 6;
    const cx = mx + ux * o,
      cy = my + uy * o;
    s += line([r1(cx - uy * 8), r1(cy + ux * 8)], [r1(cx + uy * 8), r1(cy - ux * 8)], 'l');
  }
  return s;
};
const chevron = (x, y) =>
  `<path class="l" d="M${x - 5},${y - 6} L${x + 3},${y} L${x - 5},${y + 6}"/>`;
const square = (V, ux, uy, s = 12) =>
  `<path class="l" d="M${V[0] + ux[0] * s},${V[1] + ux[1] * s} L${V[0] + (ux[0] + uy[0]) * s},${V[1] + (ux[1] + uy[1]) * s} L${V[0] + uy[0] * s},${V[1] + uy[1] * s}"/>`;
const shift = (P, dx, dy = 0) => [P[0] + dx, P[1] + dy];

// 1. Angles: Z, C, F and vertical angles.
{
  let b = '';
  const panels = [
    ['Alternate interior (Z)', 'equal'],
    ['Co-interior (C)', 'add to 180°'],
    ['Corresponding (F)', 'equal'],
  ];
  panels.forEach(([title, rule], i) => {
    const o = i * 240;
    const xAt = (y) => 70 + (y - 30) * (100 / 190);
    const T = [r1(o + xAt(85)), 85],
      Bt = [r1(o + xAt(175)), 175];
    b += text(o + 120, 22, title, 't') + text(o + 120, 40, rule, 's');
    b += line([o + 15, 85], [o + 225, 85]) + line([o + 15, 175], [o + 225, 175]);
    b += chevron(o + 205, 85) + chevron(o + 205, 175);
    b += line([r1(o + xAt(55)), 55], [r1(o + xAt(225)), 225]);
    const L1 = [o + 15, 85],
      R1 = [o + 225, 85],
      L2 = [o + 15, 175],
      R2 = [o + 225, 175];
    if (i === 0) {
      b += `<path class="h" d="M${L1} L${T} L${Bt} L${R2}"/>`;
      b += angleAt(T, L1, Bt, 20) + label(T, L1, Bt, 36, 'x');
      b += angleAt(Bt, R2, T, 20) + label(Bt, R2, T, 36, 'x');
    } else if (i === 1) {
      b += `<path class="h" d="M${L1} L${T} L${Bt} L${L2}"/>`;
      b += angleAt(T, L1, Bt, 20) + label(T, L1, Bt, 36, 'x');
      b += angleAt(Bt, L2, T, 20) + label(Bt, L2, T, 38, 'y');
      b += text(o + 70, 212, 'x + y = 180°', 'ht');
    } else {
      b += `<path class="h" d="M${R1} L${T} L${Bt} M${Bt} L${R2}"/>`;
      b += angleAt(T, R1, Bt, 20) + label(T, R1, Bt, 36, 'x');
      b +=
        angleAt(Bt, R2, [r1(o + xAt(225)), 225], 20) +
        label(Bt, R2, [r1(o + xAt(225)), 225], 36, 'x');
    }
  });
  const o = 720,
    C = [o + 120, 130];
  const P1 = [o + 30, 75],
    P2 = [o + 210, 185],
    P3 = [o + 30, 185],
    P4 = [o + 210, 75];
  b += text(o + 120, 22, 'Vertical angles', 't') + text(o + 120, 40, 'equal', 's');
  b += line(P1, P2) + line(P3, P4);
  b += angleAt(C, P1, P3, 22) + label(C, P1, P3, 40, 'x');
  b += angleAt(C, P4, P2, 22) + label(C, P4, P2, 40, 'x');
  b += angleAt(C, P1, P4, 22, 'a') + label(C, P1, P4, 40, 'y', 'at');
  b += angleAt(C, P3, P2, 22, 'a') + label(C, P3, P2, 40, 'y', 'at');
  svg(
    'angles',
    960,
    235,
    'Parallel lines cut by a transversal: Z angles equal, C angles add to 180 degrees, F angles equal; vertical angles equal',
    b,
  );
}

// 2. Triangles.
{
  let b = '';
  const tri = (o, A, B, C) => [shift(A, o), shift(B, o), shift(C, o)];
  // Equilateral
  let [A, B, C] = tri(0, [30, 190], [190, 190], [110, 51.4]);
  b +=
    text(110, 22, 'Equilateral', 't') +
    poly([A, B, C], 'l fa') +
    tick(A, B) +
    tick(B, C) +
    tick(C, A);
  b += angleAt(A, B, C, 18) + angleAt(B, C, A, 18) + angleAt(C, A, B, 18);
  b += text(110, 222, '3 equal sides, all angles 60°', 's');
  // Isosceles
  [A, B, C] = tri(220, [40, 190], [180, 190], [110, 50]);
  b += text(330, 22, 'Isosceles', 't') + poly([A, B, C], 'l fa') + tick(A, C, 2) + tick(B, C, 2);
  b += angleAt(A, B, C, 20) + angleAt(B, C, A, 20);
  b += text(330, 222, '2 equal sides, base angles equal', 's');
  // Scalene
  [A, B, C] = tri(440, [30, 190], [190, 190], [75, 70]);
  b +=
    text(550, 22, 'Scalene', 't') +
    poly([A, B, C], 'l fa') +
    tick(A, B, 1) +
    tick(B, C, 2) +
    tick(C, A, 3);
  b += text(550, 222, 'no equal sides or angles', 's');
  // Exterior angle
  [A, B, C] = tri(660, [20, 190], [150, 190], [70, 70]);
  const E = shift(B, 80);
  b += text(780, 22, 'Exterior angle', 't') + poly([A, B, C], 'l fa') + line(B, E, 'd');
  b += angleAt(A, B, C, 22, 'a') + label(A, B, C, 38, 'x', 'at');
  b += angleAt(C, A, B, 20, 'a') + label(C, A, B, 36, 'y', 'at');
  b += angleAt(B, E, C, 24) + label(B, E, C, 46, 'x + y');
  b += text(780, 222, 'outside angle = x + y', 's');
  svg(
    'triangles',
    900,
    235,
    'Equilateral, isosceles and scalene triangles, and the exterior angle equal to the sum of the two opposite interior angles',
    b,
  );
}

// 3. Congruence tests.
{
  let b = '';
  const tests = [
    ['SSS', '3 pairs of sides'],
    ['SAS', '2 sides + the angle between'],
    ['ASA', '2 angles + a side'],
    ['HL', 'right triangle: hypotenuse + leg'],
  ];
  tests.forEach(([t, cap], i) => {
    const o = i * 225;
    b += text(o + 110, 22, t, 't') + text(o + 110, 222, cap, 's');
    if (t === 'HL') {
      const P = [o + 40, 190],
        Q = [o + 190, 190],
        R = [o + 40, 60];
      b += poly([P, Q, R], 'l fa') + square(P, [1, 0], [0, -1]);
      b += line(Q, R, 'h') + line(P, Q, 'h');
      return;
    }
    const P = [o + 25, 190],
      Q = [o + 195, 190],
      R = [o + 80, 65];
    b += poly([P, Q, R], 'l fa');
    if (t === 'SSS') b += line(P, Q, 'h') + line(Q, R, 'h') + line(R, P, 'h');
    if (t === 'SAS') b += line(P, Q, 'h') + line(P, R, 'h') + angleAt(P, Q, R, 24);
    if (t === 'ASA') b += line(P, Q, 'h') + angleAt(P, Q, R, 24) + angleAt(Q, P, R, 24);
  });
  b += text(
    450,
    252,
    'Orange parts match the same parts of the other triangle. SSA (angle not between) is not a test.',
    's',
  );
  svg(
    'congruence',
    900,
    265,
    'Congruence tests SSS, SAS, ASA and HL, with the equal parts highlighted',
    b,
  );
}

// 4. Similar triangles.
{
  let b = '';
  const A = [30, 200],
    B = [110, 200],
    C = [50, 140];
  const D = [170, 200],
    E = [330, 200],
    F = [210, 80];
  b += text(180, 22, 'Same shape, sides scaled by k', 't');
  b += poly([A, B, C], 'l fa') + poly([D, E, F], 'l fa');
  b +=
    angleAt(A, B, C, 14) +
    angleAt(D, E, F, 20) +
    angleAt(B, A, C, 14, 'a') +
    angleAt(E, D, F, 20, 'a');
  b += text(70, 222, '4') + text(250, 222, '8') + text(180, 250, 'k = 8 ÷ 4 = 2', 'ht');
  b += text(40, 205, 'A', 's', 'end') + text(120, 205, 'B', 's', 'start') + text(50, 132, 'C', 's');
  b +=
    text(160, 205, 'D', 's', 'end') + text(340, 205, 'E', 's', 'start') + text(210, 72, 'F', 's');
  // Bow-tie
  const a = [430, 60],
    bb = [550, 60],
    c = [490, 120],
    d = [580, 210],
    e = [400, 210];
  b += text(490, 22, 'Bow-tie: AB parallel to DE', 't');
  b += line(a, bb) + line(e, d) + line(a, d) + line(bb, e) + chevron(490, 60) + chevron(490, 210);
  b +=
    angleAt(a, bb, c, 18) +
    angleAt(d, e, c, 18) +
    angleAt(bb, a, c, 18, 'a') +
    angleAt(e, d, c, 18, 'a');
  b += text(424, 56, 'A', '', 'end') + text(556, 56, 'B', '', 'start') + text(490, 105, 'C');
  b += text(586, 226, 'D', '', 'start') + text(394, 226, 'E', '', 'end');
  b += text(490, 250, '△ABC ~ △DEC by AA', 'ht');
  svg(
    'similar',
    640,
    265,
    'Similar triangles with scale factor 2, and the bow-tie: AB parallel to DE makes triangle ABC similar to triangle DEC',
    b,
  );
}

// 5. Pythagoras.
{
  let b = '';
  const P = [150, 230],
    Q = [270, 230],
    R = [150, 140];
  b += poly([R, P, [60, 230], [60, 140]], 'l fa') + text(105, 190, 'a² = 9', 'at');
  b += poly([P, Q, [270, 350], [150, 350]], 'l fa') + text(210, 296, 'b² = 16', 'at');
  b += poly([Q, R, [240, 20], [360, 110]], 'l fh') + text(255, 130, 'c² = 25', 'ht');
  b += poly([P, Q, R], 'l') + square(P, [1, 0], [0, -1]);
  b +=
    text(158, 200, 'a = 3', '', 'start') + text(210, 250, 'b = 4') + text(250, 168, 'c = 5', 'ht');
  b += text(400, 150, 'a² + b² = c²', 't', 'start') + text(400, 176, '9 + 16 = 25', '', 'start');
  b +=
    text(400, 210, 'c = hypotenuse,', 's', 'start') +
    text(400, 228, 'opposite the right angle', 's', 'start');
  b += text(400, 262, 'Triples: 3-4-5, 5-12-13, 8-15-17', 's', 'start');
  svg(
    'pythagoras',
    640,
    365,
    'Pythagorean theorem: squares on the legs, 9 and 16, add to the square on the hypotenuse, 25',
    b,
  );
}

// 6. Coordinates.
{
  let b = '';
  const s = 25,
    ox = 100,
    oy = 150;
  const X = (x) => ox + s * x,
    Y = (y) => oy - s * y;
  for (let x = -3; x <= 7; x++) b += line([X(x), Y(5)], [X(x), Y(-5)], x === 0 ? 'ax' : 'g');
  for (let y = -5; y <= 5; y++) b += line([X(-3), Y(y)], [X(7), Y(y)], y === 0 ? 'ax' : 'g');
  const A = [X(-2), Y(4)],
    B = [X(6), Y(-4)],
    M = [X(2), Y(0)],
    K = [X(-2), Y(-4)];
  b += line(A, K, 'h') + line(K, B, 'h') + line(A, B, 'a');
  b += text(X(-2) - 8, Y(-2) + 5, '8', 'ht', 'end') + text(X(2), Y(-4) + 20, '8', 'ht');
  for (const P of [A, B, M]) b += `<circle class="dot" cx="${P[0]}" cy="${P[1]}" r="5"/>`;
  b +=
    text(A[0] + 10, A[1] - 6, 'A(−2, 4)', 't', 'start') +
    text(B[0] + 4, B[1] - 14, 'B(6, −4)', 't', 'start');
  b += text(M[0] + 10, M[1] - 8, 'M(2, 0)', 'at', 'start');
  const tx = 300;
  b += text(tx, 60, 'Midpoint: average the coordinates', 't', 'start');
  b += text(tx, 84, 'M = ((−2 + 6)/2, (4 − 4)/2) = (2, 0)', '', 'start');
  b += text(tx, 130, 'Distance: Pythagoras on the gaps', 't', 'start');
  b += text(tx, 154, 'gaps 8 and 8 (orange legs)', '', 'start');
  b += text(tx, 178, 'AB = √(8² + 8²) = √128 = 8√2 ≈ 11.3', '', 'start');
  svg(
    'coordinates',
    640,
    300,
    'Points A(-2, 4) and B(6, -4) on a grid with midpoint M(2, 0) and the right triangle that gives the distance',
    b,
  );
}

// 7. Circles.
{
  let b = '';
  // Parts
  let O = [130, 145],
    r = 90;
  b += text(130, 22, 'Parts of a circle', 't');
  b += `<circle class="l" cx="${O[0]}" cy="${O[1]}" r="${r}"/>`;
  const top = [130, 55];
  b += line([55, 55], [215, 55], 'b') + text(222, 59, 'tangent', 'bt', 'start');
  b += line([40, 145], [220, 145], 'a') + text(178, 138, 'diameter', 'at');
  b += line(O, pt(...O, r, -40), 'h') + text(196, 122, 'radius', 'ht', 'start');
  const c1 = pt(...O, r, 110),
    c2 = pt(...O, r, 40);
  b += line(c1, c2, 'v') + text(152, 220, 'chord', 'vt');
  const s1 = pt(...O, r, 150),
    s2 = pt(...O, r, 200);
  b += `<path class="h" d="M${s1} A${r},${r} 0 0 1 ${s2}"/>` + text(30, 150, 'arc', 'ht', 'end');
  b += `<circle class="dot" cx="${O[0]}" cy="${O[1]}" r="4"/><circle class="dot" cx="${top[0]}" cy="${top[1]}" r="4"/>`;
  // Centre = 2 x circumference
  O = [450, 145];
  b += text(450, 22, 'Angle at centre = 2 × angle', 't') + text(450, 40, 'at circumference', 't');
  b += `<circle class="l" cx="${O[0]}" cy="${O[1]}" r="${r}"/>`;
  const p1 = pt(...O, r, 120),
    p2 = pt(...O, r, 60),
    T = pt(...O, r, 270);
  b += line(p1, p2, 'd') + line(T, p1) + line(T, p2) + line(O, p1, 'a') + line(O, p2, 'a');
  b += angleAt(T, p1, p2, 20) + label(T, p1, p2, 36, 'x');
  b += angleAt(O, p1, p2, 20, 'a') + label(O, p1, p2, 38, '2x', 'at');
  b += `<circle class="dot" cx="${O[0]}" cy="${O[1]}" r="4"/>`;
  // Tangent-chord
  O = [770, 135];
  b +=
    text(770, 22, 'Tangent–chord angle = angle', 't') +
    text(770, 40, 'in the opposite segment', 't');
  b += `<circle class="l" cx="${O[0]}" cy="${O[1]}" r="${r}"/>`;
  const Tp = pt(...O, r, 90),
    P = pt(...O, r, 330),
    S = pt(...O, r, 200),
    Rt = [880, Tp[1]];
  b += line([660, Tp[1]], Rt, 'b') + line(Tp, P) + line(S, Tp) + line(S, P);
  b += angleAt(Tp, Rt, P, 24) + label(Tp, Rt, P, 42, 'x');
  b += angleAt(S, Tp, P, 22) + label(S, Tp, P, 40, 'x');
  svg(
    'circles',
    900,
    250,
    'Parts of a circle; the angle at the centre is twice the angle at the circumference; the tangent-chord angle equals the angle in the opposite segment',
    b,
  );
}

// 8. Area and perimeter.
{
  let b = '';
  b += text(160, 22, 'Rectangle', 't');
  b += `<rect class="l fa" x="60" y="50" width="200" height="100"/>`;
  b += text(160, 172, '8 cm') + text(52, 105, '4 cm', '', 'end');
  b += text(160, 205, 'A = 8 × 4 = 32 cm²', 'at') + text(160, 228, 'P = 2(8) + 2(4) = 24 cm', 'ht');
  const O = [420, 110];
  b += text(420, 22, 'Circle', 't');
  b += `<circle class="l fa" cx="${O[0]}" cy="${O[1]}" r="70"/>` + line(O, [490, 110], 'h');
  b += `<circle class="dot" cx="${O[0]}" cy="${O[1]}" r="4"/>` + text(455, 102, 'r = 3 in', 'ht');
  b +=
    text(420, 205, 'A = πr² = 9π ≈ 28.3 in²', 'at') +
    text(420, 228, 'C = 2πr = 6π ≈ 18.8 in', 'ht');
  b +=
    text(560, 90, 'Area: units²', 's', 'start') + text(560, 112, 'Perimeter: units', 's', 'start');
  b += text(560, 134, 'Given d? r = d ÷ 2', 's', 'start');
  svg(
    'area',
    720,
    240,
    'Rectangle 8 by 4 centimetres with area 32 and perimeter 24; circle of radius 3 inches with area 9 pi and circumference 6 pi',
    b,
  );
}

// 9. Surface area and volume.
{
  let b = '';
  b += '<g transform="translate(30 0)">';
  b += text(125, 22, 'Rectangular prism', 't');
  const f = [
    [30, 100],
    [180, 100],
    [180, 160],
    [30, 160],
  ];
  b += poly(
    [
      [30, 100],
      [180, 100],
      [220, 70],
      [70, 70],
    ],
    'l fa',
  );
  b +=
    poly(
      [
        [180, 100],
        [220, 70],
        [220, 130],
        [180, 160],
      ],
      'l fa',
    ) + poly(f, 'l fa');
  b +=
    line([70, 70], [70, 130], 'd') +
    line([70, 130], [220, 130], 'd') +
    line([70, 130], [30, 160], 'd');
  b +=
    text(105, 180, 'l = 6') +
    text(22, 135, 'h = 2', '', 'end') +
    text(212, 160, 'w = 3', '', 'start');
  b += text(125, 210, 'SA = 2lw + 2lh + 2wh = 72', 'at') + text(125, 232, 'V = lwh = 36', 'ht');
  b += '</g>';
  // Cylinder
  b += text(360, 22, 'Cylinder', 't');
  b += `<path class="l fa" d="M310,60 L310,170 A50,14 0 0 0 410,170 L410,60"/>`;
  b += `<ellipse class="l fa" cx="360" cy="60" rx="50" ry="14"/>`;
  b += `<path class="d" d="M310,170 A50,14 0 0 1 410,170"/>`;
  b += line([360, 60], [410, 60], 'h') + text(385, 40, 'r = 5', 'ht');
  b += text(418, 120, 'h = 9', '', 'start');
  b += text(360, 210, 'SA = 2πr² + 2πrh = 140π', 'at') + text(360, 232, 'V = πr²h = 225π', 'ht');
  // Net
  b += text(600, 22, 'Its net', 't');
  b += `<circle class="l fa" cx="530" cy="62" r="22"/><circle class="l fa" cx="530" cy="178" r="22"/>`;
  b += `<rect class="l fh" x="490" y="86" width="220" height="70"/>`;
  b += text(600, 126, 'length = 2πr', 'ht') + text(718, 126, 'h', '', 'start');
  b += text(600, 232, 'two circles + a rectangle', 's');
  svg(
    'solids',
    790,
    245,
    'A 6 by 3 by 2 box with surface area 72 and volume 36; a cylinder of radius 5 and height 9; the cylinder net is two circles and a rectangle 2 pi r long',
    b,
  );
}

// 10. Transformations.
{
  let b = '';
  const s = 22,
    ox = 130,
    oy = 218;
  const X = (x) => ox + s * x,
    Y = (y) => oy - s * y;
  for (let x = -5; x <= 9; x++) b += line([X(x), Y(9)], [X(x), Y(-4)], x === 0 ? 'ax' : 'g');
  for (let y = -4; y <= 9; y++) b += line([X(-5), Y(y)], [X(9), Y(y)], y === 0 ? 'ax' : 'g');
  const T = (pts) => pts.map(([x, y]) => [X(x), Y(y)]);
  b += poly(
    T([
      [2, 2],
      [8, 2],
      [4, 8],
    ]),
    'v fv',
  );
  b += poly(
    T([
      [-1, 1],
      [-4, 1],
      [-2, 4],
    ]),
    'b fb',
  );
  b += poly(
    T([
      [2, -3],
      [5, -3],
      [3, 0],
    ]),
    'h fh',
  );
  b += poly(
    T([
      [1, 1],
      [4, 1],
      [2, 4],
    ]),
    'a fa',
  );
  const lx = 370;
  b += text(lx, 40, 'A(1, 1), B(4, 1), C(2, 4)', 't', 'start');
  const rows = [
    ['at', 'Original', '(x, y)'],
    ['ht', 'Translate by (1, −4)', '(x + 1, y − 4)'],
    ['vt', 'Dilate by 2 (origin)', '(2x, 2y)'],
    ['bt', 'Reflect in the y-axis', '(−x, y)'],
  ];
  rows.forEach(([c, n, rule], i) => {
    b += text(lx, 80 + i * 48, n, c, 'start') + text(lx, 100 + i * 48, rule, 's', 'start');
  });
  b += text(lx, 290, 'x-axis: (x, −y) · y = x: (y, x)', 's', 'start');
  svg(
    'transformations',
    640,
    320,
    'Triangle A(1,1), B(4,1), C(2,4) translated by (1, -4), dilated by 2 and reflected in the y-axis on a grid',
    b,
  );
}

console.log(fs.readdirSync(out).join(' '));
