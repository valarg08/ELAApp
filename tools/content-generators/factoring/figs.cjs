// Our own diagrams for the Factoring study guide (not frames from the video).
const fs = require('fs');
const path = require('path');

const out = path.resolve(__dirname, '../../../apps/web/public/guides/factoring');
fs.mkdirSync(out, { recursive: true });

const STYLE = `<style>
.l{stroke:#334155;stroke-width:2;fill:none;stroke-linejoin:round}
.a{stroke:#0d9488;stroke-width:3;fill:none}
.h{stroke:#ea580c;stroke-width:3.5;fill:none;stroke-linecap:round}
.b{stroke:#2563eb;stroke-width:3;fill:none}
.fa{fill:#0d9488;fill-opacity:.14}
.fh{fill:#ea580c;fill-opacity:.16}
.fb{fill:#2563eb;fill-opacity:.12}
.dot{fill:#334155}
text{font:15px system-ui,-apple-system,'Segoe UI',sans-serif;fill:#334155}
.t{font-weight:700;font-size:16px}
.s{font-size:13px;fill:#64748b}
.at{fill:#0f766e;font-weight:700}
.ht{fill:#c2410c;font-weight:700}
.bt{fill:#1d4ed8;font-weight:700}
@media (prefers-color-scheme:dark){
.l{stroke:#cbd5e1}.dot{fill:#cbd5e1}text{fill:#e2e8f0}.s{fill:#94a3b8}
.a{stroke:#2dd4bf}.h{stroke:#fb923c}.b{stroke:#60a5fa}
.at{fill:#2dd4bf}.ht{fill:#fb923c}.bt{fill:#60a5fa}}
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

const card = (x, y, w, h, cls) => `<rect class="${cls}" x="${x}" y="${y}" width="${w}" height="${h}" rx="8"/>`;

svg(
  'average',
  'A number line for x² + 32x + 192: 8 and 24 are each 8 away from the average 16, so the factors are (x + 8)(x + 24).',
  `${card(16, 36, 200, 150, 'fa')}
<text class="t" x="20" y="28">Average 16</text>
<text class="at" x="116" y="62" text-anchor="middle">x² + 32x + 192</text>
<text class="s" x="116" y="86" text-anchor="middle">16² − k² = 192</text>
<text x="116" y="112" text-anchor="middle">k² = 64, k = 8</text>
<text class="at" x="116" y="148" text-anchor="middle">(x + 8)(x + 24)</text>
<line class="l" x1="250" y1="130" x2="610" y2="130"/>
<circle class="dot" cx="310" cy="130" r="5"/><text x="310" y="112" text-anchor="middle">8</text>
<circle class="dot" cx="430" cy="130" r="5"/><text class="ht" x="430" y="112" text-anchor="middle">16</text>
<circle class="dot" cx="550" cy="130" r="5"/><text x="550" y="112" text-anchor="middle">24</text>
<line class="h" x1="310" y1="148" x2="430" y2="148"/>
<line class="h" x1="430" y1="148" x2="550" y2="148"/>
<text class="ht" x="370" y="170" text-anchor="middle">k = 8</text>
<text class="ht" x="490" y="170" text-anchor="middle">k = 8</text>
<text class="s" x="430" y="210" text-anchor="middle">same distance either side of the average</text>`,
);

svg(
  'negatives',
  'The factor pair for x² − 6x − 91: 7 and −13 are each 10 away from the average −3, so the factors are (x + 7)(x − 13).',
  `${card(16, 36, 220, 160, 'fh')}
<text class="t" x="20" y="28">Average −3</text>
<text class="ht" x="126" y="62" text-anchor="middle">x² − 6x − 91</text>
<text class="s" x="126" y="88" text-anchor="middle">half of −6 is −3</text>
<text x="126" y="114" text-anchor="middle">(−3)² − k² = −91</text>
<text x="126" y="140" text-anchor="middle">k² = 100, k = 10</text>
<text class="ht" x="126" y="174" text-anchor="middle">(x + 7)(x − 13)</text>
<text class="s" x="400" y="80" text-anchor="middle">−3 + 10 = 7</text>
<text class="s" x="400" y="110" text-anchor="middle">−3 − 10 = −13</text>
<text x="400" y="150" text-anchor="middle">7 × −13 = −91</text>
<text class="s" x="400" y="190" text-anchor="middle">opposite signs, because the product is negative</text>`,
);

svg(
  'halves',
  'The factor pair for x² + 9x + 20: 4 and 5 are each 1/2 away from the average 9/2, so the factors are (x + 4)(x + 5).',
  `${card(16, 36, 250, 160, 'fb')}
<text class="t" x="20" y="28">Average 9/2</text>
<text class="bt" x="141" y="62" text-anchor="middle">x² + 9x + 20</text>
<text class="s" x="141" y="88" text-anchor="middle">half of 9 is 9/2</text>
<text x="141" y="114" text-anchor="middle">(9/2)² − k² = 20</text>
<text x="141" y="140" text-anchor="middle">k² = 1/4, k = 1/2</text>
<text class="bt" x="141" y="174" text-anchor="middle">(x + 4)(x + 5)</text>
<text class="s" x="450" y="90" text-anchor="middle">9/2 + 1/2 = 5</text>
<text class="s" x="450" y="120" text-anchor="middle">9/2 − 1/2 = 4</text>
<text x="450" y="160" text-anchor="middle">keep the halves as fractions</text>`,
);

svg(
  'leading',
  'Dividing 2x² − 7x − 4 by 2 gives a monic quadratic whose numbers are 1/2 and −4. Multiplying the fraction factor by 2 gives (2x + 1)(x − 4).',
  `${card(16, 40, 280, 150, 'fa')}
<text class="t" x="20" y="28">Divide by the x² coefficient</text>
<text class="at" x="156" y="68" text-anchor="middle">2x² − 7x − 4</text>
<text class="s" x="156" y="96" text-anchor="middle">÷ 2 → x² − (7/2)x − 2</text>
<text x="156" y="126" text-anchor="middle">numbers 1/2 and −4</text>
<text class="at" x="156" y="164" text-anchor="middle">2(x + 1/2)(x − 4)</text>
<text class="ht" x="470" y="100" text-anchor="middle">clear the fraction</text>
<text class="ht" x="470" y="140" text-anchor="middle">(2x + 1)(x − 4)</text>`,
);

svg(
  'irrational',
  'x² + 8x + 4 has average 4 and k² = 12, so k = 2√3 and the factors are (x + 4 + 2√3)(x + 4 − 2√3).',
  `${card(16, 40, 260, 150, 'fh')}
<text class="t" x="20" y="28">k² is not a perfect square</text>
<text class="ht" x="146" y="70" text-anchor="middle">x² + 8x + 4</text>
<text class="s" x="146" y="100" text-anchor="middle">average 4, 16 − 4 = 12</text>
<text x="146" y="130" text-anchor="middle">k = √12 = 2√3</text>
<text class="ht" x="146" y="168" text-anchor="middle">(x + 4 ± 2√3)</text>
<text class="s" x="450" y="110" text-anchor="middle">no whole-number pair</text>
<text class="s" x="450" y="140" text-anchor="middle">adds to 8 and multiplies to 4</text>`,
);

svg(
  'imaginary',
  'x² + 4x + 10 has average 2 and k² = −6, so k = i√6 and the factors are (x + 2 + i√6)(x + 2 − i√6).',
  `${card(16, 40, 280, 150, 'fb')}
<text class="t" x="20" y="28">k² is negative</text>
<text class="bt" x="156" y="70" text-anchor="middle">x² + 4x + 10</text>
<text class="s" x="156" y="100" text-anchor="middle">average 2, 4 − 10 = −6</text>
<text x="156" y="130" text-anchor="middle">k = √(−6) = i√6</text>
<text class="bt" x="156" y="168" text-anchor="middle">(x + 2 ± i√6)</text>
<text class="s" x="480" y="110" text-anchor="middle">not a real factor pair</text>
<text class="s" x="480" y="140" text-anchor="middle">the same steps still work</text>`,
);

console.log('wrote', out);
