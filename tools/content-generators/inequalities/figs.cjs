// Our own diagrams for the Inequalities study guide (not frames from the video).
const fs = require('fs');
const path = require('path');

const out = path.resolve(__dirname, '../../../apps/web/public/guides/inequalities');
fs.mkdirSync(out, { recursive: true });

const STYLE = `<style>
.l{stroke:#334155;stroke-width:2;fill:none;stroke-linejoin:round}
.d{stroke:#334155;stroke-width:2;fill:none;stroke-dasharray:6 5}
.a{stroke:#0d9488;stroke-width:3;fill:none;stroke-linecap:round}
.h{stroke:#ea580c;stroke-width:3.5;fill:none;stroke-linecap:round}
.b{stroke:#2563eb;stroke-width:3;fill:none;stroke-linecap:round}
.v{stroke:#7c3aed;stroke-width:3;fill:none}
.g{stroke:#cbd5e1;stroke-width:1}
.ax{stroke:#64748b;stroke-width:1.5}
.fa{fill:#0d9488;fill-opacity:.18}
.fh{fill:#ea580c;fill-opacity:.16}
.fb{fill:#2563eb;fill-opacity:.14}
.fv{fill:#7c3aed;fill-opacity:.12}
.dot{fill:#334155}
.open{fill:#fff;stroke:#334155;stroke-width:2}
text{font:15px system-ui,-apple-system,'Segoe UI',sans-serif;fill:#334155}
.t{font-weight:700;font-size:16px}
.s{font-size:13px;fill:#64748b}
.at{fill:#0f766e;font-weight:700}
.ht{fill:#c2410c;font-weight:700}
.bt{fill:#1d4ed8;font-weight:700}
.vt{fill:#6d28d9;font-weight:700}
@media (prefers-color-scheme:dark){
.l,.d{stroke:#cbd5e1}.open{fill:#0f172a;stroke:#cbd5e1}.dot{fill:#cbd5e1}text{fill:#e2e8f0}.s{fill:#94a3b8}
.a{stroke:#2dd4bf}.h{stroke:#fb923c}.b{stroke:#60a5fa}.v{stroke:#a78bfa}
.g{stroke:#334155}.ax{stroke:#94a3b8}
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

const X = (v) => 80 + ((v + 8) / 16) * 500;
const nline = (y) => `<line class="l" x1="60" y1="${y}" x2="600" y2="${y}"/>
<polygon class="dot" points="600,${y} 588,${y - 6} 588,${y + 6}"/>`;
const tick = (v, y, label) =>
  `<line class="l" x1="${X(v)}" y1="${y - 8}" x2="${X(v)}" y2="${y + 8}"/><text class="s" x="${X(v)}" y="${y + 26}" text-anchor="middle">${label}</text>`;
const closed = (v, y) => `<circle class="dot" cx="${X(v)}" cy="${y}" r="7"/>`;
const open = (v, y) => `<circle class="open" cx="${X(v)}" cy="${y}" r="7"/>`;
const ray = (from, to, y, cls) =>
  `<line class="${cls}" x1="${X(from)}" y1="${y}" x2="${X(to)}" y2="${y}"/>`;

svg(
  'symbols',
  'A table of the four inequality symbols with interval notation: x > 5 is (5, ∞), x < 5 is (−∞, 5), x ≥ 5 is [5, ∞) and x ≤ 5 is (−∞, 5].',
  `<text class="t" x="20" y="28">Four symbols</text>
<text class="s" x="320" y="28" text-anchor="middle">round bracket = not included; square bracket = included</text>
<rect class="fa" x="24" y="46" width="140" height="180" rx="8"/>
<text class="at" x="94" y="78" text-anchor="middle">x &gt; 5</text>
<text x="94" y="108" text-anchor="middle">(5, ∞)</text>
<text class="s" x="94" y="138" text-anchor="middle">open at 5</text>
<text class="s" x="94" y="168" text-anchor="middle">6, 7, 8, …</text>
<rect class="fh" x="176" y="46" width="140" height="180" rx="8"/>
<text class="ht" x="246" y="78" text-anchor="middle">x &lt; 5</text>
<text x="246" y="108" text-anchor="middle">(−∞, 5)</text>
<text class="s" x="246" y="138" text-anchor="middle">open at 5</text>
<text class="s" x="246" y="168" text-anchor="middle">…, 3, 4</text>
<rect class="fb" x="328" y="46" width="140" height="180" rx="8"/>
<text class="bt" x="398" y="78" text-anchor="middle">x ≥ 5</text>
<text x="398" y="108" text-anchor="middle">[5, ∞)</text>
<text class="s" x="398" y="138" text-anchor="middle">closed at 5</text>
<text class="s" x="398" y="168" text-anchor="middle">5, 6, 7, …</text>
<rect class="fv" x="480" y="46" width="140" height="180" rx="8"/>
<text class="vt" x="550" y="78" text-anchor="middle">x ≤ 5</text>
<text x="550" y="108" text-anchor="middle">(−∞, 5]</text>
<text class="s" x="550" y="138" text-anchor="middle">closed at 5</text>
<text class="s" x="550" y="168" text-anchor="middle">…, 4, 5</text>`,
);

svg(
  'numberline',
  'Three number lines: a closed dot at 3 for x = 3, an open circle at −2 with a ray right for x > −2, and a closed circle at 3 with a ray left for x ≤ 3.',
  `<text class="t" x="20" y="24">Graph the range</text>
<text class="s" x="20" y="48">x = 3</text>
${nline(58)}
${tick(3, 58, '3')}
${closed(3, 58)}
<text class="s" x="20" y="108">x &gt; −2</text>
${nline(118)}
${tick(-2, 118, '−2')}
${open(-2, 118)}
${ray(-2, 8, 118, 'a')}
<text class="s" x="20" y="168">x ≤ 3</text>
${nline(178)}
${tick(3, 178, '3')}
${closed(3, 178)}
${ray(-8, 3, 178, 'h')}`,
);

svg(
  'linear',
  'Solving −2x + 5 ≤ 13 by dividing by −2 and reversing the inequality, then a closed circle at −4 with a ray to the right for x ≥ −4.',
  `<rect class="fh" x="20" y="40" width="220" height="180" rx="8"/>
<text class="t" x="24" y="28">Flip at a negative</text>
<text class="ht" x="130" y="72" text-anchor="middle">−2x + 5 ≤ 13</text>
<text x="130" y="104" text-anchor="middle">−2x ≤ 8</text>
<text class="s" x="130" y="132" text-anchor="middle">divide by −2, reverse</text>
<text class="ht" x="130" y="168" text-anchor="middle">x ≥ −4</text>
<text class="s" x="130" y="196" text-anchor="middle">[−4, ∞)</text>
${nline(150)}
${tick(-4, 150, '−4')}
${closed(-4, 150)}
${ray(-4, 8, 150, 'h')}
<text class="s" x="460" y="88" text-anchor="middle">closed circle: −4 is in</text>
<text class="s" x="460" y="112" text-anchor="middle">shade right, toward +∞</text>`,
);

svg(
  'or',
  'An OR compound inequality as a union: an open ray left of −8 and an open ray right of −3, with a gap between them.',
  `<text class="t" x="20" y="28">OR is a union</text>
<text class="s" x="20" y="52">x &gt; −3 or x &lt; −8</text>
<line class="l" x1="60" y1="110" x2="600" y2="110"/>
<polygon class="dot" points="600,110 588,104 588,116"/>
<line class="l" x1="205" y1="102" x2="205" y2="118"/><text class="s" x="205" y="136" text-anchor="middle">−8</text>
<line class="l" x1="361.25" y1="102" x2="361.25" y2="118"/><text class="s" x="361.25" y="136" text-anchor="middle">−3</text>
<circle class="open" cx="205" cy="110" r="7"/>
<circle class="open" cx="361.25" cy="110" r="7"/>
<line class="h" x1="70" y1="110" x2="205" y2="110"/>
<line class="a" x1="361.25" y1="110" x2="590" y2="110"/>
<text class="ht" x="140" y="88" text-anchor="middle">x &lt; −8</text>
<text class="at" x="480" y="88" text-anchor="middle">x &gt; −3</text>
<text class="s" x="320" y="176" text-anchor="middle">union (−∞, −8) ∪ (−3, ∞)</text>
<text class="s" x="320" y="204" text-anchor="middle">the gap from −8 to −3 is not in the solution</text>`,
);

svg(
  'and',
  'An AND compound inequality as an overlap: x ≥ −2 and x &lt; 2 meet on the segment from −2 (closed) to 2 (open).',
  `<text class="t" x="20" y="28">AND is an overlap</text>
<text class="s" x="20" y="52">x ≥ −2 and x &lt; 2</text>
${nline(120)}
${tick(-2, 120, '−2')}
${tick(2, 120, '2')}
${closed(-2, 120)}
${open(2, 120)}
${ray(-2, 2, 120, 'b')}
<text class="bt" x="320" y="88" text-anchor="middle">only the overlap</text>
<text class="s" x="320" y="176" text-anchor="middle">interval [−2, 2)</text>
<text class="s" x="320" y="204" text-anchor="middle">a double inequality −2 ≤ x &lt; 2 is the same AND</text>`,
);

svg(
  'abs',
  'An absolute-value inequality |x − 3| ≤ 5 as the closed segment from −2 to 8, because x is within 5 of 3.',
  `<text class="t" x="20" y="28">Distance from a point</text>
<text class="ht" x="320" y="52" text-anchor="middle">|x − 3| ≤ 5</text>
${nline(130)}
${tick(-2, 130, '−2')}
${tick(3, 130, '3')}
${tick(8, 130, '8')}
${closed(-2, 130)}
${closed(8, 130)}
${ray(-2, 8, 130, 'h')}
<line class="a" x1="${X(-2)}" y1="108" x2="${X(3)}" y2="108"/>
<line class="a" x1="${X(3)}" y1="108" x2="${X(8)}" y2="108"/>
<text class="at" x="${X(0.5)}" y="98" text-anchor="middle">5</text>
<text class="at" x="${X(5.5)}" y="98" text-anchor="middle">5</text>
<text class="s" x="320" y="186" text-anchor="middle">less than: AND, a segment. greater than: OR, two rays</text>
<text class="s" x="320" y="214" text-anchor="middle">[−2, 8]</text>`,
);

svg(
  'twovar',
  'The dashed boundary y = (2/3)x + 2 with the region above it shaded, because a test at (0, 0) makes −2x + 3y > 6 false.',
  `<text class="t" x="20" y="24">Shade one side</text>
<rect class="fa" x="300" y="36" width="310" height="190" rx="4"/>
<line class="d" x1="40" y1="210" x2="280" y2="40"/>
<text class="at" x="210" y="56">y = (2/3)x + 2</text>
<circle class="open" cx="88" cy="176" r="6"/>
<text class="s" x="104" y="180">(0, 0) false</text>
<text class="s" x="40" y="230">dashed: &gt; so the line is not in</text>
<text class="s" x="360" y="70">−2x + 3y &gt; 6</text>
<text class="s" x="360" y="98">isolate y: y &gt; (2/3)x + 2</text>
<text class="s" x="360" y="126">test (0, 0): 0 &gt; 6 is false</text>
<text class="s" x="360" y="154">shade the other side</text>
<text class="s" x="360" y="182">above the dashed line</text>`,
);

svg(
  'systems',
  'A system: the solid half-plane under y = (1/2)x + 5 overlapping the region above the dashed parabola y = x².',
  `<text class="t" x="20" y="24">The overlap of two regions</text>
<path class="fa" d="M 80,190 Q 180,40 280,190 L 280,80 Q 180,20 80,80 Z"/>
<line class="l" x1="40" y1="90" x2="320" y2="50"/>
<path class="d" d="M 70,200 Q 180,20 290,200"/>
<text class="s" x="40" y="70">y ≤ ½x + 5</text>
<text class="s" x="220" y="130">y &gt; x²</text>
<text class="s" x="360" y="90">solid line: ≤ includes the line</text>
<text class="s" x="360" y="118">dashed parabola: &gt; excludes it</text>
<text class="s" x="360" y="146">solution = points in both</text>
<text class="s" x="360" y="174">the lens under the line</text>
<text class="s" x="360" y="202">and above the parabola</text>`,
);

svg(
  'poly',
  'A cubic through x-intercepts −5, 3 and 5, positive on [−5, 3] and [5, ∞), the solution of the polynomial inequality ≥ 0.',
  `<text class="t" x="20" y="24">Sign chart from the roots</text>
<path class="a" d="M 40,200 C 90,220 120,40 200,120 C 250,180 300,40 380,80 C 430,100 500,40 600,20"/>
<line class="ax" x1="40" y1="140" x2="620" y2="140"/>
${closed(-5, 140)}
${closed(3, 140)}
${closed(5, 140)}
<text class="s" x="${X(-5)}" y="168" text-anchor="middle">−5</text>
<text class="s" x="${X(3)}" y="168" text-anchor="middle">3</text>
<text class="s" x="${X(5)}" y="168" text-anchor="middle">5</text>
<line class="h" x1="${X(-5)}" y1="128" x2="${X(3)}" y2="128"/>
<line class="h" x1="${X(5)}" y1="128" x2="600" y2="128"/>
<text class="s" x="40" y="214">odd degree, positive leading: starts down, ends up</text>
<text class="ht" x="400" y="214">[−5, 3] ∪ [5, ∞)</text>`,
);

svg(
  'rational',
  'A sign chart for a rational inequality with vertical asymptotes at −1 and 3 and a zero at 7; the negative intervals are (−∞, −1) ∪ (3, 7).',
  `<text class="t" x="20" y="24">Zeros and asymptotes</text>
<line class="l" x1="40" y1="120" x2="600" y2="120"/>
${open(-1, 120)}
${open(3, 120)}
${open(7, 120)}
<text class="s" x="${X(-1)}" y="150" text-anchor="middle">−1 VA</text>
<text class="s" x="${X(3)}" y="150" text-anchor="middle">3 VA</text>
<text class="s" x="${X(7)}" y="150" text-anchor="middle">7 zero</text>
<line class="h" x1="50" y1="100" x2="${X(-1)}" y2="100"/>
<line class="h" x1="${X(3)}" y1="100" x2="${X(7)}" y2="100"/>
<text class="ht" x="${X(-5)}" y="88" text-anchor="middle">−</text>
<text class="at" x="${X(1)}" y="88" text-anchor="middle">+</text>
<text class="ht" x="${X(5)}" y="88" text-anchor="middle">−</text>
<text class="at" x="${X(8)}" y="88" text-anchor="middle">+</text>
<text class="s" x="320" y="190" text-anchor="middle">never include a vertical asymptote</text>
<text class="s" x="320" y="218" text-anchor="middle">for &lt; 0: (−∞, −1) ∪ (3, 7)</text>`,
);

console.log('written inequality diagrams');
