// Draws the two scientific-notation arithmetic diagrams: apps/web/public/guides/powers/{scimul,scidiv}.svg
const fs = require('fs');
const path = require('path');

const OUT = path.resolve(__dirname, '../../../apps/web/public/guides/powers');
const STYLE = `<style>
text{font:16px system-ui,-apple-system,'Segoe UI',sans-serif;fill:#334155}
.t{font-weight:700;font-size:18px}
.s{font-size:14px;fill:#64748b}
.big{font-size:24px;font-weight:700}
.a{fill:#0f766e;font-weight:700}
.o{fill:#c2410c;font-weight:700}
.b{fill:#1d4ed8;font-weight:700}
.box{fill:none;stroke:#64748b;stroke-width:1.5;rx:8}
@media (prefers-color-scheme:dark){text{fill:#e2e8f0}.s{fill:#94a3b8}.a{fill:#5eead4}.o{fill:#fdba74}.b{fill:#93c5fd}.box{stroke:#94a3b8}}
</style>`;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const tx = (x, y, s, cls = '') => `<text x="${x}" y="${y}"${cls ? ` class="${cls}"` : ''}>${esc(s)}</text>`;
const svg = (alt, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250" width="640" height="250" role="img" aria-label="${esc(alt)}">
<title>${esc(alt)}</title>
${STYLE}
${body}
</svg>
`;

const FIGS = {
  scimul: {
    alt: 'Multiplying in scientific notation: multiply the coefficients and add the exponents of 10. 5 times 10 cubed times 4 times 10 squared gives 20 times 10 to the 5. Because 20 is 10 or more, move a power of 10 into the exponent: 2 times 10 to the 6.',
    body:
      tx(20, 32, 'Multiply the coefficients, add the exponents', 't') +
      tx(20, 82, '(5 × 10³)(4 × 10²)', 'big') +
      `<rect x="20" y="104" width="190" height="52" class="box"/>` +
      tx(34, 128, 'coefficients', 's') + tx(34, 148, '5 × 4 = 20', 'a') +
      `<rect x="230" y="104" width="190" height="52" class="box"/>` +
      tx(244, 128, 'exponents of 10', 's') + tx(244, 148, '3 + 2 = 5', 'o') +
      tx(440, 140, '= 20 × 10⁵', 'big') +
      tx(20, 188, '20 is 10 or more, so move one power of 10 into the exponent:', '') +
      tx(20, 220, '20 × 10⁵ = 2 × 10⁶', 'b'),
  },
  scidiv: {
    alt: 'Dividing in scientific notation: divide the coefficients and subtract the exponents of 10. 2 times 10 to the 8 divided by 4 times 10 cubed gives 0.5 times 10 to the 5. Because 0.5 is less than 1, make the coefficient 10 times bigger and the exponent 1 smaller: 5 times 10 to the 4.',
    body:
      tx(20, 32, 'Divide the coefficients, subtract the exponents', 't') +
      tx(20, 82, '(2 × 10⁸) ÷ (4 × 10³)', 'big') +
      `<rect x="20" y="104" width="190" height="52" class="box"/>` +
      tx(34, 128, 'coefficients', 's') + tx(34, 148, '2 ÷ 4 = 0.5', 'a') +
      `<rect x="230" y="104" width="190" height="52" class="box"/>` +
      tx(244, 128, 'exponents of 10', 's') + tx(244, 148, '8 − 3 = 5', 'o') +
      tx(440, 140, '= 0.5 × 10⁵', 'big') +
      tx(20, 188, '0.5 is less than 1, so make it 10 times bigger and the exponent 1 smaller:', '') +
      tx(20, 220, '0.5 × 10⁵ = 5 × 10⁴', 'b'),
  },
};

fs.mkdirSync(OUT, { recursive: true });
for (const [id, f] of Object.entries(FIGS)) fs.writeFileSync(path.join(OUT, `${id}.svg`), svg(f.alt, f.body));
console.log('wrote', Object.keys(FIGS).length, 'figures to', OUT);
module.exports = { FIGS };
