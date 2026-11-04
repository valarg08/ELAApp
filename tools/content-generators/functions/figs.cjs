// Our own diagrams for the Functions study guide (not frames from the video).
const fs = require('fs');
const path = require('path');

const out = path.resolve(__dirname, '../../../apps/web/public/guides/functions');
fs.mkdirSync(out, { recursive: true });

const STYLE = `<style>
.l{stroke:#334155;stroke-width:2;fill:none;stroke-linejoin:round}
.d{stroke:#64748b;stroke-width:1.5;fill:none;stroke-dasharray:6 5}
.a{stroke:#0d9488;stroke-width:3;fill:none;stroke-linecap:round;stroke-linejoin:round}
.h{stroke:#ea580c;stroke-width:3;fill:none;stroke-linecap:round;stroke-linejoin:round}
.b{stroke:#2563eb;stroke-width:3;fill:none;stroke-linecap:round;stroke-linejoin:round}
.v{stroke:#7c3aed;stroke-width:3;fill:none;stroke-linecap:round;stroke-linejoin:round}
.ax{stroke:#94a3b8;stroke-width:1.5}
.fa{fill:#0d9488;fill-opacity:.18}
.fh{fill:#ea580c;fill-opacity:.16}
.fb{fill:#2563eb;fill-opacity:.14}
.fv{fill:#7c3aed;fill-opacity:.12}
.dot{fill:#334155}
.open{fill:#fff;stroke:#334155;stroke-width:2}
text{font:15px system-ui,-apple-system,'Segoe UI',sans-serif;fill:#334155}
.t{font-weight:700;font-size:16px}
.s{font-size:13px;fill:#64748b}
.big{font-size:20px}
.at{fill:#0f766e;font-weight:700}
.ht{fill:#c2410c;font-weight:700}
.bt{fill:#1d4ed8;font-weight:700}
.vt{fill:#6d28d9;font-weight:700}
@media (prefers-color-scheme:dark){
.l{stroke:#cbd5e1}.d{stroke:#94a3b8}.open{fill:#0f172a;stroke:#cbd5e1}.dot{fill:#cbd5e1}text{fill:#e2e8f0}.s{fill:#94a3b8}
.a{stroke:#2dd4bf}.h{stroke:#fb923c}.b{stroke:#60a5fa}.v{stroke:#a78bfa}
.ax{stroke:#475569}
.at{fill:#2dd4bf}.ht{fill:#fb923c}.bt{fill:#60a5fa}.vt{fill:#a78bfa}}
</style>`;

function svg(name, title, body) {
  const s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250" width="640" height="250" role="img" aria-label="${title}">
<title>${title}</title>
${STYLE}
${body}
</svg>
`;
  fs.writeFileSync(path.join(out, `${name}.svg`), s);
}
const C = 'text-anchor="middle"';

/** A plot box: maps math coordinates to the page. */
function box(x0, y0, w, h, [xl, xh], [yl, yh]) {
  const X = (x) => +(x0 + ((x - xl) / (xh - xl)) * w).toFixed(1);
  const Y = (y) => +(y0 + h - ((y - yl) / (yh - yl)) * h).toFixed(1);
  const axes = `<line class="ax" x1="${x0}" y1="${Y(0)}" x2="${x0 + w}" y2="${Y(0)}"/><line class="ax" x1="${X(0)}" y1="${y0}" x2="${X(0)}" y2="${y0 + h}"/>`;
  return { X, Y, axes, yl, yh };
}
/** A curve as one or more polylines (broken where the value is missing or out of the box). */
function curve(b, fn, x0, x1, cls, step = 0.05) {
  const parts = [];
  let cur = [];
  for (let x = x0; x <= x1 + 1e-9; x += step) {
    const y = fn(x);
    if (!Number.isFinite(y) || y < b.yl - 0.01 || y > b.yh + 0.01) {
      if (cur.length > 1) parts.push(cur);
      cur = [];
    } else cur.push(`${b.X(x)},${b.Y(y)}`);
  }
  if (cur.length > 1) parts.push(cur);
  return parts.map((p) => `<polyline class="${cls}" points="${p.join(' ')}"/>`).join('\n');
}
const dot = (b, x, y, cls = 'dot', r = 5) =>
  `<circle class="${cls}" cx="${b.X(x)}" cy="${b.Y(y)}" r="${r}"/>`;

// 1. What is a function: the vertical line test.
{
  const L = box(40, 50, 250, 150, [-3, 3], [-1, 8]);
  const Rt = box(350, 50, 250, 150, [-1, 8], [-3, 3]);
  svg(
    'whatis',
    'The vertical line test. On the left a parabola opening upward is crossed once by a vertical line, so it is a function. On the right a parabola opening sideways is crossed twice by a vertical line, so it is not a function.',
    `<text class="t" x="20" y="28">Vertical line test</text>
${L.axes}${curve(L, (x) => x * x, -2.8, 2.8, 'a')}
<line class="d" x1="${L.X(1.5)}" y1="50" x2="${L.X(1.5)}" y2="200"/>${dot(L, 1.5, 2.25)}
<text class="at" x="165" y="224" ${C}>one point: a function</text>
${Rt.axes}${curve(Rt, (x) => Math.sqrt(x), 0, 8, 'h')}${curve(Rt, (x) => -Math.sqrt(x), 0, 8, 'h')}
<line class="d" x1="${Rt.X(4)}" y1="50" x2="${Rt.X(4)}" y2="200"/>${dot(Rt, 4, 2)}${dot(Rt, 4, -2)}
<text class="ht" x="475" y="224" ${C}>two points: not a function</text>`,
  );
}

// 2. Domain and range.
{
  const B = box(50, 44, 310, 170, [-4, 4], [-2, 9]);
  svg(
    'domain',
    'Domain and range from a graph: for a parabola that opens up with its lowest point at height 2, the domain is every real x (how wide it is) and the range is y at least 2 (how high it reaches).',
    `<text class="t" x="20" y="26">Domain: how wide. Range: how high.</text>
${B.axes}${curve(B, (x) => x * x * 0.5 + 2, -4, 4, 'a')}
${dot(B, 0, 2)}
<line class="h" x1="${B.X(-4)}" y1="${B.Y(0) + 12}" x2="${B.X(4)}" y2="${B.Y(0) + 12}"/>
<line class="b" x1="${B.X(0) - 14}" y1="${B.Y(2)}" x2="${B.X(0) - 14}" y2="${B.Y(9)}"/>
<text class="ht" x="395" y="86">domain: any real number x</text>
<text class="s" x="395" y="108">(−∞, ∞)</text>
<text class="bt" x="395" y="148">range: y ≥ 2</text>
<text class="s" x="395" y="170">[2, ∞)</text>
<text class="s" x="395" y="204">round at ∞, square if reached</text>`,
  );
}

// 3. Common functions: eight small tiles.
{
  const tiles = [
    ['y = x', (x) => x, [-3, 3], [-3, 3], 'a', 0.05],
    ['y = x²', (x) => x * x, [-3, 3], [-1, 9], 'a', 0.05],
    ['y = x³', (x) => x ** 3, [-2, 2], [-8, 8], 'a', 0.05],
    ['y = √x', (x) => Math.sqrt(x), [-1, 9], [-1, 4], 'a', 0.05],
    ['y = 1/x', (x) => 1 / x, [-4, 4], [-4, 4], 'h', 0.02],
    ['y = sin x', (x) => Math.sin(x), [-4, 4], [-1.5, 1.5], 'b', 0.05],
    ['y = 2ˣ', (x) => 2 ** x, [-3, 3], [-1, 8], 'v', 0.05],
    ['y = log₂ x', (x) => Math.log2(x), [-1, 8], [-4, 4], 'v', 0.05],
  ];
  let body = '<text class="t" x="20" y="22">Eight shapes to know</text>';
  tiles.forEach(([name, fn, xr, yr, cls, step], i) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const x0 = 20 + col * 155;
    const y0 = 56 + row * 100;
    const b = box(x0, y0, 130, 66, xr, yr);
    body += `<rect class="${row ? 'fv' : 'fa'}" x="${x0 - 6}" y="${y0 - 8}" width="142" height="92" rx="8" fill-opacity=".1"/>`;
    body += b.axes + curve(b, fn, xr[0], xr[1], cls, step);
    body += `<text class="s" x="${x0 + 65}" y="${y0 + 80}" ${C}>${name}</text>`;
  });
  svg(
    'common',
    'Eight common graphs: the line y = x, the parabola y = x squared, the cubic y = x cubed, the square root curve, the reciprocal y = 1 over x with two branches, the sine wave, the exponential 2 to the x and the logarithm log base 2 of x.',
    body,
  );
}

// 4. Transformations.
{
  const B = box(330, 40, 290, 190, [-4, 8], [-5, 10]);
  svg(
    'transform',
    'Transformations of y = f(x) into g(x) = a f(x − d) + c: c moves the graph up, d moves it right, a stretches it vertically or flips it, and k inside f(kx) squeezes it sideways. On the right, y = x squared and its image y = (x − 3) squared + 1.',
    `<text class="t" x="20" y="26">g(x) = a · f( k(x − d) ) + c</text>
<text class="at" x="20" y="62">c &gt; 0: up      c &lt; 0: down</text>
<text class="ht" x="20" y="92">d &gt; 0: right   d &lt; 0: left</text>
<text class="bt" x="20" y="122">|a| &gt; 1: taller   |a| &lt; 1: flatter</text>
<text class="bt" x="20" y="146">a &lt; 0: flip over the x-axis</text>
<text class="vt" x="20" y="176">|k| &gt; 1: squeezed sideways</text>
<text class="vt" x="20" y="200">k &lt; 0: flip over the y-axis</text>
<text class="s" x="20" y="228">outside f changes y; inside f changes x (the opposite way)</text>
${B.axes}${curve(B, (x) => x * x, -3.1, 3.1, 'd')}${curve(B, (x) => (x - 3) ** 2 + 1, -0.1, 6.1, 'a')}
${dot(B, 0, 0)}${dot(B, 3, 1, 'dot', 6)}
<text class="s" x="${B.X(3) + 8}" y="${B.Y(1) + 18}">(3, 1)</text>
<text class="s" x="${B.X(-3.5)}" y="${B.Y(8)}">f</text>
<text class="at" x="${B.X(6)}" y="${B.Y(9)}">g</text>`,
  );
}

// 5. Inverse functions.
{
  const B = box(40, 30, 220, 200, [-3, 8], [-3, 8]);
  svg(
    'inverse',
    'A function and its inverse are mirror images across the line y = x. The graphs of 2 to the x and log base 2 of x are shown with the line y = x, and the point (3, 8) on one matches the point (8, 3) on the other.',
    `<text class="t" x="290" y="40">An inverse swaps x and y</text>
${B.axes}
<line class="d" x1="${B.X(-3)}" y1="${B.Y(-3)}" x2="${B.X(8)}" y2="${B.Y(8)}"/>
${curve(B, (x) => 2 ** x, -3, 3.01, 'a')}${curve(B, (x) => Math.log2(x), 0.13, 8, 'h')}
${dot(B, 3, 8)}${dot(B, 8, 3)}
<text class="s" x="${B.X(3) + 8}" y="${B.Y(8) + 2}">(3, 8)</text>
<text class="s" x="${B.X(8) - 40}" y="${B.Y(3) + 18}">(8, 3)</text>
<text class="at" x="${B.X(1.6)}" y="${B.Y(7)}">f</text>
<text class="ht" x="${B.X(6)}" y="${B.Y(1.4)}">f⁻¹</text>
<text class="s" x="${B.X(5.6)}" y="${B.Y(6.1)}">y = x</text>
<text x="290" y="84">f(a) = b  means  f⁻¹(b) = a</text>
<text x="290" y="114">f⁻¹(f(x)) = x</text>
<text class="s" x="290" y="144">f⁻¹ is not 1/f(x): the −1 is not an exponent</text>
<text class="s" x="290" y="176">to find it: swap x and y, then solve for y</text>
<text class="s" x="290" y="204">only a one-to-one function has an inverse function</text>`,
  );
}

// 6. Combining functions.
{
  const B = box(40, 40, 330, 190, [-3, 3], [-6, 10]);
  svg(
    'combine',
    'Adding two functions by adding their heights. A parabola f(x) = x squared over 2 plus 1, a line g(x) = x minus 1 and their sum, a new parabola, at x = 2 where the heights 3 and 1 add to 4.',
    `<text class="t" x="20" y="26">(f + g)(x) = f(x) + g(x)</text>
${B.axes}
${curve(B, (x) => x * x * 0.5 + 1, -3, 3, 'h')}
${curve(B, (x) => x - 1, -3, 3, 'b')}
${curve(B, (x) => x * x * 0.5 + x, -3, 3, 'a')}
<line class="d" x1="${B.X(2)}" y1="${B.Y(0)}" x2="${B.X(2)}" y2="${B.Y(4)}"/>
${dot(B, 2, 3)}${dot(B, 2, 1)}${dot(B, 2, 4, 'dot', 6)}
<text class="ht" x="${B.X(-2.6)}" y="${B.Y(6.5)}">f</text>
<text class="bt" x="${B.X(-2.6)}" y="${B.Y(-3)}">g</text>
<text class="at" x="${B.X(-1.1)}" y="${B.Y(2.2)}">f + g</text>
<text class="at" x="400" y="76">at x = 2:  3 + 1 = 4</text>
<text class="s" x="400" y="104">add the y-values point by point,</text>
<text class="s" x="400" y="126">or add the equations</text>
<text x="400" y="162">(f − g)(x)   (f · g)(x)</text>
<text x="400" y="188">(f / g)(x), with g(x) ≠ 0</text>
<text class="s" x="400" y="216">no value where g(x) = 0</text>`,
  );
}

// 7. Composite functions.
svg(
  'composite',
  'A composite function as two machines in a row: the input 4 goes into g(x) = x + 5 and comes out as 9, then 9 goes into f(x) = 3x and comes out as 27, so f of g of 4 is 27.',
  `<text class="t" x="20" y="26">f(g(x)): the output of g is the input of f</text>
<text class="big" x="50" y="120" ${C}>4</text>
<line class="l" x1="70" y1="114" x2="120" y2="114"/><polygon class="dot" points="124,114 114,109 114,119"/>
<rect class="fh" x="130" y="80" width="130" height="70" rx="10"/><rect class="l" x="130" y="80" width="130" height="70" rx="10"/>
<text class="ht" x="195" y="108" ${C}>g(x) = x + 5</text><text class="s" x="195" y="132" ${C}>runs first</text>
<line class="l" x1="262" y1="114" x2="312" y2="114"/><polygon class="dot" points="316,114 306,109 306,119"/>
<text class="big" x="338" y="120" ${C}>9</text>
<line class="l" x1="358" y1="114" x2="398" y2="114"/><polygon class="dot" points="402,114 392,109 392,119"/>
<rect class="fa" x="408" y="80" width="110" height="70" rx="10"/><rect class="l" x="408" y="80" width="110" height="70" rx="10"/>
<text class="at" x="463" y="108" ${C}>f(x) = 3x</text><text class="s" x="463" y="132" ${C}>runs second</text>
<line class="l" x1="520" y1="114" x2="560" y2="114"/><polygon class="dot" points="564,114 554,109 554,119"/>
<text class="big" x="590" y="120" ${C}>27</text>
<text class="s" x="320" y="184" ${C}>f(g(4)) = f(9) = 27</text>
<text class="s" x="320" y="208" ${C}>g(f(4)) = g(12) = 17: the order matters</text>
<text class="s" x="320" y="232" ${C}>for the algebra, replace every x in f with the whole expression g(x)</text>`,
);

// 8. Piecewise functions.
{
  const B = box(40, 40, 300, 180, [-4, 6], [-3, 7]);
  svg(
    'piecewise',
    'A piecewise function with two rules: y = x + 1 for x less than 1, ending at an open circle at (1, 2), and y = 4 minus x for x at least 1, starting at a closed circle at (1, 3).',
    `<text class="t" x="20" y="26">Different rules for different parts of the domain</text>
${B.axes}
${curve(B, (x) => x + 1, -4, 1, 'h')}${curve(B, (x) => 4 - x, 1, 6, 'a')}
<circle class="open" cx="${B.X(1)}" cy="${B.Y(2)}" r="6"/>${dot(B, 1, 3, 'dot', 6)}
<text class="ht" x="365" y="70">x + 1   for x &lt; 1</text>
<text class="at" x="365" y="98">4 − x   for x ≥ 1</text>
<text class="s" x="365" y="132">open circle: that point is not used</text>
<text class="s" x="365" y="154">closed circle: that point is used</text>
<text class="s" x="365" y="186">at x = 1 the output is 3 (second rule),</text>
<text class="s" x="365" y="208">not 2: the pieces do not meet</text>`,
  );
}

// 9. Even and odd.
{
  const L = box(40, 50, 250, 150, [-3, 3], [-3, 6]);
  const Rt = box(350, 50, 250, 150, [-3, 3], [-6, 6]);
  svg(
    'evenodd',
    'Even and odd functions. On the left an even function is mirror symmetric about the y-axis, with f(−2) = f(2). On the right an odd function has point symmetry about the origin, with f(−2) the opposite of f(2).',
    `<text class="t" x="20" y="28">Even: mirror in the y-axis. Odd: turn 180° about the origin.</text>
${L.axes}${curve(L, (x) => x ** 4 / 6 - x * x + 1.5, -3, 3, 'a')}
${dot(L, 2, 16 / 6 - 4 + 1.5)}${dot(L, -2, 16 / 6 - 4 + 1.5)}
<text class="at" x="165" y="222" ${C}>f(−x) = f(x)</text>
${Rt.axes}${curve(Rt, (x) => x ** 3 / 3 - x / 1.2, -3, 3, 'h')}
${dot(Rt, 2, 8 / 3 - 2 / 1.2)}${dot(Rt, -2, -(8 / 3 - 2 / 1.2))}
<text class="ht" x="475" y="222" ${C}>f(−x) = −f(x)</text>`,
  );
}

// 10. Asymptotes.
{
  const B = box(40, 40, 340, 180, [-2, 6], [-4, 6]);
  svg(
    'asymptotes',
    'Asymptotes of y = 1 over (x − 2) plus 1: a vertical asymptote at x = 2 where the denominator is zero, and a horizontal asymptote at y = 1 that the graph approaches as x goes to infinity.',
    `<text class="t" x="20" y="26">Lines the graph approaches but never touches</text>
${B.axes}
<line class="d" x1="${B.X(2)}" y1="40" x2="${B.X(2)}" y2="220"/>
<line class="d" x1="40" y1="${B.Y(1)}" x2="380" y2="${B.Y(1)}"/>
${curve(B, (x) => 1 / (x - 2) + 1, -2, 6, 'a', 0.01)}
<text class="s" x="${B.X(2) + 6}" y="62">x = 2</text>
<text class="s" x="330" y="${B.Y(1) - 8}">y = 1</text>
<text class="ht" x="400" y="76">vertical: denominator = 0</text>
<text class="s" x="400" y="98">the graph shoots to +∞ or −∞</text>
<text class="bt" x="400" y="138">horizontal: look at x → ±∞</text>
<text class="s" x="400" y="160">same degree: ratio of leading terms</text>
<text class="s" x="400" y="182">top degree smaller: y = 0</text>
<text class="s" x="400" y="204">a factor that cancels is a hole</text>`,
  );
}

console.log('written function diagrams');
