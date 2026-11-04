// Draws the Parallel Lines and Angles diagrams (our own): apps/web/public/guides/parallel-lines/<chapter>.svg
const fs = require('fs');
const path = require('path');

const OUT = path.resolve(__dirname, '../../../apps/web/public/guides/parallel-lines');
const STYLE = `<style>
text{font:15px system-ui,-apple-system,'Segoe UI',sans-serif;fill:#334155}
.t{font-weight:700;font-size:17px}
.s{font-size:13px;fill:#64748b}
.big{font-size:22px;font-weight:700}
.n{font-size:14px;font-weight:700}
.m{text-anchor:middle}
.a{fill:#0f766e;font-weight:700}
.o{fill:#c2410c;font-weight:700}
.b{fill:#1d4ed8;font-weight:700}
.ln{stroke:#334155;stroke-width:2.5;fill:none;stroke-linecap:round}
.th{stroke:#2563eb;stroke-width:2.5;fill:none;stroke-linecap:round}
.ar{stroke:#334155;stroke-width:1.8;fill:none}
.wa{fill:#0d9488;fill-opacity:.35}
.wo{fill:#ea580c;fill-opacity:.32}
.wb{fill:#2563eb;fill-opacity:.25}
.box{fill:none;stroke:#64748b;stroke-width:1.5}
.sh{fill:#e2e8f0;fill-opacity:.0;stroke:#334155;stroke-width:2.5;stroke-linejoin:round}
@media (prefers-color-scheme:dark){
text{fill:#e2e8f0}.s{fill:#94a3b8}.a{fill:#5eead4}.o{fill:#fdba74}.b{fill:#93c5fd}
.ln,.ar,.sh{stroke:#e2e8f0}.box{stroke:#94a3b8}.th{stroke:#93c5fd}
}
</style>`;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const tx = (x, y, s, cls = '') =>
  `<text x="${x}" y="${y}"${cls ? ` class="${cls}"` : ''}>${esc(s)}</text>`;
const svg = (
  alt,
  body,
  h = 250,
) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 ${h}" width="640" height="${h}" role="img" aria-label="${esc(alt)}">
<title>${esc(alt)}</title>
${STYLE}
${body}
</svg>
`;
const rad = (d) => (d * Math.PI) / 180;
const pt = (cx, cy, r, deg) => [cx + r * Math.cos(rad(deg)), cy - r * Math.sin(rad(deg))];

/** a filled wedge between two bearings (degrees, y up) */
function wedge(cx, cy, a1, a2, r, cls) {
  const [x1, y1] = pt(cx, cy, r, a1);
  const [x2, y2] = pt(cx, cy, r, a2);
  const large = Math.abs(a2 - a1) > 180 ? 1 : 0;
  return `<path d="M${cx} ${cy} L${x1.toFixed(1)} ${y1.toFixed(1)} A${r} ${r} 0 ${large} 0 ${x2.toFixed(1)} ${y2.toFixed(1)} Z" class="${cls}"/>`;
}

// the eight angles: [line, quadrant, bearing start, bearing end] with the transversal at theta
const SECTORS = (th) => ({
  1: ['top', [th, 180]],
  2: ['top', [0, th]],
  3: ['top', [180, 180 + th]],
  4: ['top', [180 + th, 360]],
  5: ['bottom', [th, 180]],
  6: ['bottom', [0, th]],
  7: ['bottom', [180, 180 + th]],
  8: ['bottom', [180 + th, 360]],
});

/** two parallel lines and a transversal; `hl` maps an angle number to a wedge class; `names` shows the numbers */
function transversal({ th = 62, hl = {}, names = true, label = {} }) {
  const yT = 70;
  const yB = 165;
  const cx = 320;
  const xAt = (y) => cx + (117 - y) / Math.tan(rad(th));
  const cT = [xAt(yT), yT];
  const cB = [xAt(yB), yB];
  let out = `<line x1="40" y1="${yT}" x2="470" y2="${yT}" class="ln"/><line x1="40" y1="${yB}" x2="470" y2="${yB}" class="ln"/>`;
  out += `<line x1="${xAt(yT - 38).toFixed(1)}" y1="${yT - 38}" x2="${xAt(yB + 38).toFixed(1)}" y2="${yB + 38}" class="th"/>`;
  for (const y of [yT, yB]) out += `<path d="M450 ${y - 6} L458 ${y} L450 ${y + 6}" class="ar"/>`;
  for (const [k, [line, [a1, a2]]] of Object.entries(SECTORS(th))) {
    const [x, y] = line === 'top' ? cT : cB;
    if (hl[k]) out += wedge(x, y, a1, a2, 30, hl[k]);
    if (names) {
      const [lx, ly] = pt(x, y, 44, (a1 + a2) / 2);
      out += tx(lx.toFixed(1), (ly + 5).toFixed(1), label[k] ?? String(k), 'n m');
    }
  }
  return out;
}

const FIGS = {
  parallel: {
    alt: 'Parallel lines never meet and have the same slope. Perpendicular lines meet at 90 degrees and their slopes are negative reciprocals: a slope of 2 pairs with a slope of negative one half.',
    body: () => {
      const th = (Math.atan(2) * 180) / Math.PI; // a line of slope 2
      const seg = (c, deg, r, cls) => {
        const [x1, y1] = pt(c[0], c[1], r, deg);
        const [x2, y2] = pt(c[0], c[1], r, deg + 180);
        return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" class="${cls}"/>`;
      };
      const c = [470, 135];
      const p1 = pt(c[0], c[1], 20, th);
      const p3 = pt(c[0], c[1], 20, th - 90);
      const p2 = [p1[0] + p3[0] - c[0], p1[1] + p3[1] - c[1]];
      return (
        tx(20, 30, 'Parallel and perpendicular lines', 't') +
        seg([110, 120], th, 80, 'ln') +
        seg([210, 120], th, 80, 'th') +
        tx(40, 232, 'parallel: same slope (2 and 2)', 'a') +
        seg(c, th, 90, 'ln') +
        seg(c, th - 90, 100, 'th') +
        `<path d="M${p1[0].toFixed(1)} ${p1[1].toFixed(1)} L${p2[0].toFixed(1)} ${p2[1].toFixed(1)} L${p3[0].toFixed(1)} ${p3[1].toFixed(1)}" class="ar"/>` +
        tx(500, 56, 'slope 2', 's') +
        tx(556, 190, 'slope −1/2', 's') +
        tx(330, 232, 'perpendicular: slopes 2 and −1/2', 'o')
      );
    },
  },
  transversal: {
    alt: 'A transversal crossing two parallel lines makes eight angles, numbered 1 to 8. Angles 3, 4, 5 and 6 are between the parallel lines and are interior; angles 1, 2, 7 and 8 are outside and are exterior.',
    body: () =>
      tx(20, 28, 'A transversal makes eight angles', 't') +
      transversal({ hl: { 3: 'wa', 4: 'wa', 5: 'wa', 6: 'wa' } }) +
      tx(500, 112, 'interior', 'a') +
      tx(500, 130, '3, 4, 5, 6', 's') +
      tx(500, 62, 'exterior', 'o') +
      tx(500, 80, '1, 2, 7, 8', 's') +
      tx(20, 238, 'Interior: between the parallel lines. Exterior: outside them.', 's'),
  },
  alternate: {
    alt: 'Alternate angles are on opposite sides of the transversal. Alternate interior angles 3 and 6 are equal, and so are 4 and 5. Alternate exterior angles 1 and 8 are equal, and so are 2 and 7.',
    body: () =>
      tx(20, 28, 'Alternate angles are equal', 't') +
      transversal({ hl: { 3: 'wa', 6: 'wa', 1: 'wo', 8: 'wo' } }) +
      tx(500, 112, '∠3 = ∠6', 'a') +
      tx(500, 130, '∠4 = ∠5', 'a') +
      tx(500, 62, '∠1 = ∠8', 'o') +
      tx(500, 80, '∠2 = ∠7', 'o') +
      tx(
        20,
        238,
        'Opposite sides of the transversal: alternate interior (inside) and alternate exterior (outside).',
        's',
      ),
  },
  corresponding: {
    alt: 'Corresponding angles sit in the same position at the two crossings. Angles 2 and 6 are equal, 1 and 5 are equal, 4 and 8 are equal, and 3 and 7 are equal.',
    body: () =>
      tx(20, 28, 'Corresponding angles are equal', 't') +
      transversal({ hl: { 2: 'wa', 6: 'wa', 3: 'wo', 7: 'wo' } }) +
      tx(500, 62, '∠1 = ∠5', 'b') +
      tx(500, 82, '∠2 = ∠6', 'a') +
      tx(500, 118, '∠3 = ∠7', 'o') +
      tx(500, 138, '∠4 = ∠8', 'b') +
      tx(
        20,
        238,
        'Same position at each crossing: both above the line and right of the transversal, and so on.',
        's',
      ),
  },
  consecutive: {
    alt: 'Consecutive interior angles are on the same side of the transversal between the parallel lines. Angles 4 and 6 add up to 180 degrees, and so do 3 and 5. Vertical angles, such as 1 and 4, are equal.',
    body: () =>
      tx(20, 28, 'Consecutive interior angles add up to 180°', 't') +
      transversal({ hl: { 4: 'wa', 6: 'wa', 3: 'wo', 5: 'wo' } }) +
      tx(500, 112, '∠4 + ∠6 = 180°', 'a') +
      tx(500, 132, '∠3 + ∠5 = 180°', 'o') +
      tx(500, 62, 'vertical angles equal:', 's') +
      tx(500, 80, '∠1 = ∠4, ∠2 = ∠3', 'b') +
      tx(
        20,
        238,
        'Consecutive interior: inside, same side, supplementary. Vertical angles sit across a crossing.',
        's',
      ),
  },
  compsupp: {
    alt: 'Complementary angles add up to 90 degrees, as the 30 and 60 degrees inside a right angle do. Supplementary angles add up to 180 degrees, as the 60 and 120 degrees on a straight line do.',
    body: () => {
      const a = pt(110, 190, 120, 30);
      return (
        tx(20, 28, 'Complementary and supplementary', 't') +
        `<path d="M110 190 H230 M110 190 V70" class="ln"/><line x1="110" y1="190" x2="${a[0]}" y2="${a[1]}" class="th"/>` +
        wedge(110, 190, 0, 30, 44, 'wa') +
        wedge(110, 190, 30, 90, 44, 'wo') +
        `<path d="M110 172 h18 v18" class="ar"/>` +
        tx(168, 178, '30°', 'a') +
        tx(122, 140, '60°', 'o') +
        tx(30, 228, 'complementary: add up to 90°', 'a') +
        `<line x1="340" y1="190" x2="600" y2="190" class="ln"/>` +
        `<line x1="470" y1="190" x2="${pt(470, 190, 110, 60)[0]}" y2="${pt(470, 190, 110, 60)[1]}" class="th"/>` +
        wedge(470, 190, 0, 60, 40, 'wa') +
        wedge(470, 190, 60, 180, 40, 'wo') +
        tx(500, 176, '60°', 'a') +
        tx(420, 150, '120°', 'o') +
        tx(340, 228, 'supplementary: add up to 180°', 'o')
      );
    },
  },
  solvex: {
    alt: 'Solving for x: pick the relationship, write the equation, solve it, then use x to find the angle. Vertical angles are equal, a linear pair adds up to 180, and the parts of a right angle add up to 90.',
    body: () =>
      tx(20, 28, 'Relationship → equation → solve → angle', 't') +
      [
        ['vertical angles', 'equal', '5x = 3x + 24'],
        ['linear pair / straight line', 'add to 180°', '30 + (2x + 5) = 180'],
        ['right angle', 'add to 90°', '7x + 11x = 90'],
      ]
        .map(
          ([n, r, e], i) =>
            `<rect x="20" y="${50 + i * 54}" width="600" height="44" rx="8" class="box"/>` +
            tx(34, 78 + i * 54, n, 's') +
            tx(250, 78 + i * 54, r, i === 0 ? 'a' : i === 1 ? 'o' : 'b') +
            tx(400, 78 + i * 54, e, ''),
        )
        .join('') +
      tx(
        20,
        238,
        'Find x first, then put it back into the expression for the angle you were asked for.',
        's',
      ),
  },
  allangles: {
    alt: 'With a transversal and parallel lines, the eight angles take only two values. If one angle is 50 degrees, the four angles 2, 3, 6 and 7 are 50 degrees and the other four are 130 degrees.',
    body: () =>
      tx(20, 28, 'Only two values: 50° and 130°', 't') +
      transversal({
        hl: { 2: 'wa', 3: 'wa', 6: 'wa', 7: 'wa', 1: 'wo', 4: 'wo', 5: 'wo', 8: 'wo' },
        label: {
          1: '130°',
          2: '50°',
          3: '50°',
          4: '130°',
          5: '130°',
          6: '50°',
          7: '50°',
          8: '130°',
        },
      }) +
      tx(500, 112, '50° + 130° = 180°', 'b') +
      tx(20, 238, 'Find one angle, then every other is that angle or its supplement.', 's'),
  },
  polygons: {
    alt: 'The interior angles of a polygon add up to the number of sides minus 2, times 180. A triangle (3 sides) is 180, a quadrilateral (4 sides) is 360 and a pentagon (5 sides) is 540.',
    body: () =>
      tx(20, 28, 'Sum of the interior angles = (n − 2) × 180°', 't') +
      `<polygon points="60,200 190,200 125,90" class="sh"/>` +
      tx(60, 222, 'triangle: 180°', 'a') +
      tx(60, 240, '(3 − 2) × 180', 's') +
      `<polygon points="260,200 380,200 380,100 260,100" class="sh"/>` +
      tx(252, 222, 'quadrilateral: 360°', 'o') +
      tx(252, 240, '(4 − 2) × 180', 's') +
      `<polygon points="520,200 585,200 605,135 550,90 495,135" class="sh"/>` +
      tx(480, 222, 'pentagon: 540°', 'b') +
      tx(480, 240, '(5 − 2) × 180', 's'),
  },
  words: {
    alt: 'Angle word problems: translate the words into an equation, solve for x, then find the angle that was asked for. Complementary angles add up to 90 and supplementary angles add up to 180.',
    body: () =>
      tx(20, 28, 'Translate, solve, answer the question asked', 't') +
      `<rect x="20" y="48" width="600" height="60" rx="8" class="box"/>` +
      tx(34, 74, '“R and S are complementary, R = 3x + 1, S = 9x − 7”', '') +
      tx(34, 96, '(3x + 1) + (9x − 7) = 90', 'a') +
      `<rect x="20" y="124" width="600" height="60" rx="8" class="box"/>` +
      tx(34, 150, '12x − 6 = 90, so 12x = 96 and x = 8', '') +
      tx(34, 172, 'then S = 9(8) − 7 = 65°', 'o') +
      tx(20, 218, 'Stop at x only when the question asks for x. Otherwise put x back in.', 's'),
  },
  final: {
    alt: 'The parallel line and angle facts on one page: parallel slopes are equal, perpendicular slopes are negative reciprocals, alternate and corresponding angles are equal, consecutive interior angles add to 180, complementary add to 90, supplementary add to 180, and polygon angles add to (n − 2) times 180.',
    body: () =>
      tx(20, 26, 'The facts on one page', 't') +
      [
        ['Parallel lines', 'equal slopes', 'a'],
        ['Perpendicular lines', 'slopes: negative reciprocals', 'o'],
        ['Alternate, corresponding, vertical', 'equal', 'a'],
        ['Consecutive interior, linear pair', 'add up to 180°', 'o'],
        ['Complementary', 'add up to 90°', 'b'],
        ['Supplementary', 'add up to 180°', 'o'],
        ['Polygon, n sides', '(n − 2) × 180°', 'a'],
      ]
        .map(
          ([n, r, c], i) =>
            `<rect x="20" y="${42 + i * 28}" width="600" height="24" rx="6" class="box"/>` +
            tx(32, 59 + i * 28, n, '') +
            tx(380, 59 + i * 28, r, c),
        )
        .join(''),
  },
};

fs.mkdirSync(OUT, { recursive: true });
for (const [id, f] of Object.entries(FIGS))
  fs.writeFileSync(path.join(OUT, `${id}.svg`), svg(f.alt, f.body()));
console.log('wrote', Object.keys(FIGS).length, 'figures to', OUT);
module.exports = { FIGS };
