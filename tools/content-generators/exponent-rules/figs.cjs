// Draws the Exponent Rules diagrams (our own): apps/web/public/guides/exponent-rules/<chapter>.svg
const fs = require('fs');
const path = require('path');

const OUT = path.resolve(__dirname, '../../../apps/web/public/guides/exponent-rules');
const W = 640;
const H = 250;

const STYLE = `<style>
text{font:16px system-ui,-apple-system,'Segoe UI',sans-serif;fill:#334155}
.t{font-weight:700;font-size:18px}
.s{font-size:14px;fill:#64748b}
.big{font-size:26px;font-weight:700}
.m{text-anchor:middle}
.e{text-anchor:end}
.a{fill:#0f766e;font-weight:700}
.o{fill:#c2410c;font-weight:700}
.b{fill:#1d4ed8;font-weight:700}
.chip{fill:#0d9488;fill-opacity:.2;stroke:#0d9488;stroke-width:2}
.chip2{fill:#ea580c;fill-opacity:.18;stroke:#ea580c;stroke-width:2}
.chip3{fill:#2563eb;fill-opacity:.16;stroke:#2563eb;stroke-width:2}
.gone{fill:none;stroke:#94a3b8;stroke-width:2;stroke-dasharray:4 3}
.box{fill:none;stroke:#64748b;stroke-width:1.5;rx:8}
.ln{stroke:#334155;stroke-width:2}
.ar{stroke:#64748b;stroke-width:2;fill:none}
@media (prefers-color-scheme:dark){
text{fill:#e2e8f0}.s{fill:#94a3b8}.a{fill:#5eead4}.o{fill:#fdba74}.b{fill:#93c5fd}
.ln{stroke:#e2e8f0}.box,.ar{stroke:#94a3b8}.gone{stroke:#64748b}
}
</style>`;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const tx = (x, y, s, cls = '') =>
  `<text x="${x}" y="${y}"${cls ? ` class="${cls}"` : ''}>${esc(s)}</text>`;
/** n small circles in a row starting at x, each showing `label` */
const chips = (n, x, y, label, cls = 'chip', gap = 28) =>
  Array.from(
    { length: n },
    (_, i) =>
      `<circle cx="${x + i * gap}" cy="${y}" r="11" class="${cls}"/><text x="${x + i * gap}" y="${y + 5}" class="m" style="font-size:13px">${esc(label)}</text>`,
  ).join('');

function svg(alt, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(alt)}">
<title>${esc(alt)}</title>
${STYLE}
${body}
</svg>
`;
}

const FIGS = {
  whatis: {
    alt: 'An exponent counts equal factors: the base 3 with the exponent 4 means four threes multiplied, 3 times 3 times 3 times 3, which is 81.',
    body: () =>
      tx(20, 34, 'Base and exponent', 't') +
      tx(150, 100, 'aᵐ', 'big') +
      tx(150, 130, 'base a: what is multiplied', 's') +
      tx(150, 150, 'exponent m: how many factors', 's') +
      `<line x1="132" y1="84" x2="100" y2="64" class="ar"/>` +
      tx(20, 190, '3⁴ means four factors of 3:', '') +
      chips(4, 240, 186, '3') +
      tx(370, 191, '= 3 · 3 · 3 · 3 = 81', 'a'),
  },
  product: {
    alt: 'Product of powers: three threes times four threes is seven threes, so 3 to the 3 times 3 to the 4 equals 3 to the 7. Same base: keep it and add the exponents.',
    body: () =>
      tx(20, 34, 'Same base: add the exponents', 't') +
      tx(20, 80, '3³ · 3⁴', 'big') +
      chips(3, 40, 130, '3') +
      tx(135, 135, '·', 'm') +
      chips(4, 165, 130, '3', 'chip2') +
      `<path d="M30 152 H112" class="ar"/><path d="M153 152 H258" class="ar"/>` +
      tx(40, 178, '3 factors', 's') +
      tx(160, 178, '4 factors', 's') +
      tx(300, 135, '=  seven factors of 3  =  3⁷', 'b') +
      tx(20, 224, 'aᵐ · aⁿ = aᵐ⁺ⁿ    (3 + 4 = 7 factors in all)', 'a'),
  },
  quotient: {
    alt: 'Quotient of powers: five threes on top and two threes on the bottom. Two pairs cancel and three threes are left, so 3 to the 5 over 3 squared is 3 cubed. Same base: keep it and subtract the exponents.',
    body: () =>
      tx(20, 34, 'Same base: subtract the exponents', 't') +
      tx(20, 80, '3⁵ ÷ 3²', 'big') +
      chips(2, 40, 120, '3', 'gone') +
      chips(3, 96, 120, '3', 'chip') +
      `<line x1="30" y1="140" x2="190" y2="140" class="ln"/>` +
      chips(2, 40, 164, '3', 'gone') +
      tx(205, 128, '2 pairs cancel', 's') +
      tx(205, 148, '3 factors are left', 's') +
      tx(380, 135, '=  3 · 3 · 3  =  3³', 'b') +
      tx(20, 224, 'aᵐ ÷ aⁿ = aᵐ⁻ⁿ    (5 − 2 = 3)', 'a'),
  },
  powerpower: {
    alt: 'Power of a power: 3 squared, raised to the third power, is three groups of two threes. That is six threes, so the exponents multiply: 3 to the 6.',
    body: () =>
      tx(20, 34, 'Power of a power: multiply the exponents', 't') +
      tx(20, 80, '(3²)³', 'big') +
      [0, 1, 2]
        .map(
          (g) =>
            `<rect x="${30 + g * 96}" y="104" width="82" height="44" class="box"/>` +
            chips(2, 52 + g * 96, 126, '3', ['chip', 'chip2', 'chip3'][g]),
        )
        .join('') +
      tx(30, 172, '3 groups', 's') +
      tx(126, 172, 'each group is 3²', 's') +
      tx(330, 132, '=  six factors of 3  =  3⁶', 'b') +
      tx(20, 224, '(aᵐ)ⁿ = aᵐⁿ    (2 · 3 = 6)', 'a'),
  },
  powerproduct: {
    alt: 'Power of a product: 3 times x, cubed, is 3x times 3x times 3x. Regroup the numbers and the letters: three threes and three x, which is 3 cubed times x cubed, or 27 x cubed.',
    body: () =>
      tx(20, 34, 'Power of a product: every factor gets the exponent', 't') +
      tx(20, 80, '(3x)³', 'big') +
      tx(20, 124, '(3x)(3x)(3x)', 'a') +
      tx(20, 154, '= (3 · 3 · 3)(x · x · x)', '') +
      tx(20, 184, '= 3³ · x³ = 27x³', 'b') +
      `<rect x="330" y="96" width="290" height="104" class="box"/>` +
      tx(345, 124, 'Works for any number of factors:', 's') +
      tx(345, 152, '(abc)ⁿ = aⁿ · bⁿ · cⁿ', 'o') +
      tx(345, 182, '(−2y)⁴ = 16y⁴', 's') +
      tx(20, 224, '(ab)ⁿ = aⁿbⁿ', 'a'),
  },
  powerquotient: {
    alt: 'Power of a quotient: two thirds, squared, is two thirds times two thirds. Multiply the tops and multiply the bottoms to get 2 squared over 3 squared, which is four ninths.',
    body: () =>
      tx(20, 34, 'Power of a quotient: top and bottom both get the exponent', 't') +
      tx(20, 90, '(2/3)²', 'big') +
      tx(20, 130, '= (2/3) · (2/3)', 'a') +
      tx(20, 160, '= (2 · 2)/(3 · 3)', '') +
      tx(20, 190, '= 2²/3² = 4/9', 'b') +
      `<rect x="330" y="96" width="290" height="104" class="box"/>` +
      tx(345, 124, 'Letters work the same way:', 's') +
      tx(345, 152, '(x/y)ⁿ = xⁿ/yⁿ', 'o') +
      tx(345, 182, 'y must not be 0', 's') +
      tx(20, 224, '(a/b)ⁿ = aⁿ/bⁿ', 'a'),
  },
  one: {
    alt: 'The one exponent: any number to the first power is itself, so 5 to the 1 is 5. A letter with no written exponent has exponent 1, so y cubed times y is y cubed times y to the 1, which is y to the 4.',
    body: () =>
      tx(20, 34, 'The invisible exponent 1', 't') +
      tx(20, 90, 'a¹ = a', 'big') +
      tx(20, 130, '9¹ = 9      x¹ = x', '') +
      tx(20, 170, 'No exponent written means the exponent is 1:', 's') +
      tx(20, 200, 'y³ · y = y³ · y¹ = y⁴', 'b') +
      `<rect x="380" y="60" width="240" height="120" class="box"/>` +
      tx(395, 88, 'Add the 1 when you simplify:', 's') +
      tx(395, 118, 'x · x · x', 'o') +
      tx(395, 148, '= x¹ · x¹ · x¹ = x³', 'o'),
  },
  zero: {
    alt: 'The zero exponent: powers of 3 go 27, 9, 3 as the exponent drops from 3 to 1, each step divided by 3. The next step divides 3 by 3 to get 1, so 3 to the 0 is 1.',
    body: () =>
      tx(20, 34, 'Any non-zero base to the power 0 is 1', 't') +
      [
        ['3³', '27'],
        ['3²', '9'],
        ['3¹', '3'],
        ['3⁰', '1'],
      ]
        .map(
          ([p, v], i) =>
            tx(60 + i * 140, 100, p, 'big m') +
            tx(60 + i * 140, 130, '= ' + v, `m ${i === 3 ? 'o' : ''}`),
        )
        .join('') +
      [0, 1, 2]
        .map(
          (i) =>
            `<path d="M${88 + i * 140} 82 H${112 + i * 140}" class="ar"/>` +
            tx(100 + i * 140, 72, '÷ 3', 's m'),
        )
        .join('') +
      tx(20, 190, 'Each step down divides by 3, so 3⁰ = 3 ÷ 3 = 1.', '') +
      tx(20, 224, 'a⁰ = 1    (a ≠ 0; 0⁰ is not defined)', 'a'),
  },
  negative: {
    alt: 'The negative exponent: continuing the pattern past 3 to the 0, each step divides by 3 again, so 3 to the negative 1 is one third and 3 to the negative 2 is one ninth. A negative exponent means take the reciprocal.',
    body: () =>
      tx(20, 34, 'A negative exponent means reciprocal', 't') +
      [
        ['3²', '9'],
        ['3¹', '3'],
        ['3⁰', '1'],
        ['3⁻¹', '1/3'],
        ['3⁻²', '1/9'],
      ]
        .map(
          ([p, v], i) =>
            tx(60 + i * 118, 96, p, `big m ${i > 2 ? 'o' : ''}`) +
            tx(60 + i * 118, 126, '= ' + v, 'm'),
        )
        .join('') +
      [0, 1, 2, 3]
        .map((i) => `<path d="M${84 + i * 118} 78 H${100 + i * 118}" class="ar"/>`)
        .join('') +
      tx(20, 168, 'The pattern keeps dividing by 3, so 3⁻² = 1/3² = 1/9.', '') +
      tx(20, 204, 'a⁻ⁿ = 1/aⁿ      1/a⁻ⁿ = aⁿ      (a/b)⁻ⁿ = (b/a)ⁿ', 'a'),
  },
  final: {
    alt: 'The exponent rules on one page: product, quotient, power of a power, power of a product, power of a quotient, one, zero and negative exponent rules.',
    body: () =>
      tx(20, 30, 'All the rules, one page', 't') +
      [
        ['aᵐ · aⁿ = aᵐ⁺ⁿ', 'add'],
        ['aᵐ ÷ aⁿ = aᵐ⁻ⁿ', 'subtract'],
        ['(aᵐ)ⁿ = aᵐⁿ', 'multiply'],
        ['(ab)ⁿ = aⁿbⁿ', 'spread'],
        ['(a/b)ⁿ = aⁿ/bⁿ', 'spread'],
        ['a¹ = a', 'one'],
        ['a⁰ = 1', 'zero'],
        ['a⁻ⁿ = 1/aⁿ', 'flip'],
      ]
        .map(([f, w], i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const x = 20 + col * 310;
          const y = 62 + row * 46;
          return (
            `<rect x="${x}" y="${y - 22}" width="290" height="38" class="box"/>` +
            tx(x + 14, y + 3, f, ['a', 'o', 'b', 'a'][row]) +
            tx(x + 276, y + 3, w, 's e')
          );
        })
        .join(''),
  },
};

fs.mkdirSync(OUT, { recursive: true });
for (const [id, f] of Object.entries(FIGS))
  fs.writeFileSync(path.join(OUT, `${id}.svg`), svg(f.alt, f.body()));
console.log('wrote', Object.keys(FIGS).length, 'figures to', OUT);
module.exports = { FIGS };
