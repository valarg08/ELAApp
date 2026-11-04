// Our own diagrams for the Powers & Scientific Notation study guide (not frames from the video).
const fs = require('fs');
const path = require('path');

const out = path.resolve(__dirname, '../../../apps/web/public/guides/powers');
fs.mkdirSync(out, { recursive: true });

const STYLE = `<style>
.l{stroke:#334155;stroke-width:2;fill:none;stroke-linejoin:round}
.d{stroke:#64748b;stroke-width:1.5;fill:none;stroke-dasharray:6 5}
.a{stroke:#0d9488;stroke-width:3;fill:none;stroke-linecap:round;stroke-linejoin:round}
.h{stroke:#ea580c;stroke-width:3;fill:none;stroke-linecap:round;stroke-linejoin:round}
.b{stroke:#2563eb;stroke-width:3;fill:none;stroke-linecap:round;stroke-linejoin:round}
.fa{fill:#0d9488;fill-opacity:.15}
.fh{fill:#ea580c;fill-opacity:.14}
.fb{fill:#2563eb;fill-opacity:.12}
text{font:17px system-ui,-apple-system,'Segoe UI',sans-serif;fill:#334155}
.t{font-weight:700;font-size:16px}
.s{font-size:14px;fill:#64748b}
.m{font-size:22px}
.big{font-size:34px;font-weight:600}
.huge{font-size:72px;font-weight:700}
.at{fill:#0f766e;font-weight:700}
.ht{fill:#c2410c;font-weight:700}
.bt{fill:#1d4ed8;font-weight:700}
@media (prefers-color-scheme:dark){
.l{stroke:#cbd5e1}.d{stroke:#94a3b8}text{fill:#e2e8f0}.s{fill:#94a3b8}
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
const C = 'text-anchor="middle"';

// 1. A power: base, exponent, factors.
svg(
  'powers',
  'Anatomy of a power. In 5 to the power 3, the base 5 is the number being multiplied and the exponent 3 counts the factors, so it equals 5 times 5 times 5, which is 125.',
  `<text class="t" x="20" y="28">A power</text>
<text class="huge" x="70" y="150">5</text><text class="big" x="118" y="108">3</text>
<line class="d" x1="88" y1="188" x2="88" y2="160"/><text class="at" x="88" y="208" ${C}>base</text>
<line class="d" x1="140" y1="62" x2="130" y2="86"/><text class="ht" x="140" y="52" ${C}>exponent</text>
<text class="big" x="190" y="140">= 5 × 5 × 5 = 125</text>
<path class="a" d="M242 160 v8 h138 v-8"/>
<text class="s" x="311" y="192" ${C}>3 factors of 5</text>
<text class="s" x="320" y="236" ${C}>The exponent counts how many times the base is multiplied by itself.</text>`,
);

// 2. Zero and negative exponents: dividing by the base each step down.
{
  const rows = [
    ['3³', '27'],
    ['3²', '9'],
    ['3¹', '3'],
    ['3⁰', '1'],
    ['3⁻¹', '1/3'],
    ['3⁻²', '1/9'],
  ];
  const x0 = 40;
  const w = 90;
  let body = `<text class="t" x="20" y="28">Each step down divides by 3</text>`;
  rows.forEach(([p, v], i) => {
    const x = x0 + i * (w + 8);
    const cls = i === 3 ? 'fh' : i > 3 ? 'fb' : 'fa';
    body += `<rect class="${cls}" x="${x}" y="70" width="${w}" height="90" rx="8"/>`;
    body += `<text class="m" x="${x + w / 2}" y="105" ${C}>${p}</text>`;
    body += `<text class="big" x="${x + w / 2}" y="145" ${C}>${v}</text>`;
    if (i < rows.length - 1) body += `<text class="s" x="${x + w + 4}" y="62" ${C}>÷3</text>`;
  });
  body += `<text class="ht" x="${x0 + 3 * 98 + 45}" y="190" ${C}>x⁰ = 1</text>`;
  body += `<text class="bt" x="${x0 + 5 * 98 - 53}" y="190" ${C}>x⁻ⁿ = 1/xⁿ</text>`;
  body += `<text class="s" x="320" y="232" ${C}>Keep dividing by 3: the exponent drops by 1 and the value is cut to a third.</text>`;
  svg(
    'negzero',
    'A table of powers of 3 from 3 cubed down to 3 to the minus 2. Each step down divides the value by 3: 27, 9, 3, then 3 to the 0 equals 1, then 1 over 3, then 1 over 9. A zero exponent gives 1, and a negative exponent gives a reciprocal.',
    body,
  );
}

// 3. Writing a power: expanded form, power form and value.
svg(
  'writing',
  'Three ways to write the same thing: the expanded form 7 times 7 times 7 times 7, the power 7 to the 4, and the value 2401.',
  `<text class="t" x="20" y="28">Same number, three ways</text>
<rect class="fa" x="30" y="60" width="180" height="90" rx="10"/>
<text class="s" x="120" y="82" ${C}>expanded</text><text class="m" x="120" y="124" ${C}>7 × 7 × 7 × 7</text>
<rect class="fh" x="230" y="60" width="180" height="90" rx="10"/>
<text class="s" x="320" y="82" ${C}>power</text><text class="big" x="320" y="128" ${C}>7⁴</text>
<rect class="fb" x="430" y="60" width="180" height="90" rx="10"/>
<text class="s" x="520" y="82" ${C}>value</text><text class="big" x="520" y="128" ${C}>2401</text>
<text class="m" x="220" y="113" ${C}>=</text><text class="m" x="420" y="113" ${C}>=</text>
<text class="s" x="320" y="190" ${C}>Count the factors to get the exponent. Multiply them out to get the value.</text>
<text class="s" x="320" y="214" ${C}>4 factors of 7 → 7⁴</text>`,
);

// 4. Negative bases: brackets and even or odd exponents.
svg(
  'signs',
  'Brackets matter for a negative base. Negative 5, cubed, in brackets is minus 125; negative 5, squared, in brackets is positive 25; but minus 5 squared without brackets is minus 25 because the exponent is only on the 5.',
  `<text class="t" x="20" y="28">Where is the negative?</text>
<rect class="fa" x="30" y="50" width="180" height="110" rx="10"/>
<text class="m" x="120" y="88" ${C}>(−5)³</text>
<text class="s" x="120" y="112" ${C}>−5 × −5 × −5</text>
<text class="big" x="120" y="148" ${C}>−125</text>
<rect class="fh" x="230" y="50" width="180" height="110" rx="10"/>
<text class="m" x="320" y="88" ${C}>(−5)²</text>
<text class="s" x="320" y="112" ${C}>−5 × −5</text>
<text class="big" x="320" y="148" ${C}>25</text>
<rect class="fb" x="430" y="50" width="180" height="110" rx="10"/>
<text class="m" x="520" y="88" ${C}>−5²</text>
<text class="s" x="520" y="112" ${C}>−1 × (5 × 5)</text>
<text class="big" x="520" y="148" ${C}>−25</text>
<text class="at" x="120" y="186" ${C}>odd exponent</text>
<text class="ht" x="320" y="186" ${C}>even exponent</text>
<text class="bt" x="520" y="186" ${C}>no bracket</text>
<text class="s" x="320" y="226" ${C}>In brackets: even exponent gives +, odd exponent gives −.</text>`,
);

// 5. Substituting with brackets.
svg(
  'substitute',
  'Substituting a negative value. For 4x squared plus 3x when x is minus 2, replace x with minus 2 in brackets: 4 times (minus 2) squared plus 3 times (minus 2) is 16 minus 6, which is 10. Without brackets, minus 2 squared would wrongly look like minus 4.',
  `<text class="t" x="20" y="28">Substitute with brackets</text>
<text class="m" x="320" y="70" ${C}>4x² + 3x    when x = −2</text>
<rect class="fa" x="40" y="92" width="560" height="62" rx="10"/>
<text class="m" x="320" y="132" ${C}>4(−2)² + 3(−2)</text>
<text class="s" x="320" y="172" ${C}>power first: (−2)² = 4</text>
<text class="s" x="320" y="190" ${C}>then multiply: 4 × 4 = 16 and 3 × (−2) = −6</text>
<text class="big at" x="320" y="228" ${C}>16 − 6 = 10</text>
<text class="s" x="320" y="246" ${C}>Without brackets, −2² would look like −4. The bracket keeps the exponent on −2.</text>`,
);

// 6. What scientific notation is.
svg(
  'sci',
  'The rule for scientific notation a times 10 to the n: a is at least 1 and less than 10, and n is a whole number. 3.2 times 10 to the 5 is correct. 32 times 10 to the 4 has a coefficient that is too big. 0.32 times 10 to the 6 has a coefficient that is too small.',
  `<text class="t" x="20" y="28">a × 10ⁿ  with  1 ≤ a &lt; 10  and  n a whole number</text>
<rect class="fa" x="30" y="58" width="180" height="96" rx="10"/>
<text class="big" x="120" y="102" ${C}>3.2 × 10⁵</text>
<text class="at" x="120" y="136" ${C}>✔ one digit first</text>
<rect class="fh" x="230" y="58" width="180" height="96" rx="10"/>
<text class="big" x="320" y="102" ${C}>32 × 10⁴</text>
<text class="ht" x="320" y="136" ${C}>✘ 32 is 10 or more</text>
<rect class="fb" x="430" y="58" width="180" height="96" rx="10"/>
<text class="big" x="520" y="102" ${C}>0.32 × 10⁶</text>
<text class="bt" x="520" y="136" ${C}>✘ 0.32 is below 1</text>
<text class="s" x="320" y="190" ${C}>All three are the same number, 320,000. Only the first is in scientific notation.</text>
<text class="s" x="320" y="214" ${C}>Big numbers have a positive n. Numbers between 0 and 1 have a negative n.</text>`,
);

// 7. Scientific notation to standard form.
svg(
  'tostd',
  'Moving the decimal point. 6.3 times 10 to the 4 moves the decimal point 4 places right to give 63,000. 6.3 times 10 to the minus 3 moves it 3 places left to give 0.0063.',
  `<text class="t" x="20" y="28">The exponent tells you how far to move the decimal point</text>
<text class="m" x="20" y="72">6.3 × 10⁴</text>
<text class="m" x="160" y="72">→ 63000  (right 4 places)</text>
<path class="h" d="M60 94 q40 26 80 0"/><text class="ht" x="100" y="128" ${C}>×10, four times</text>
<text class="m" x="20" y="176">6.3 × 10⁻³</text>
<text class="m" x="190" y="176">→ 0.0063  (left 3 places)</text>
<path class="b" d="M160 196 q-40 26 -80 0"/><text class="bt" x="120" y="228" ${C}>÷10, three times</text>
<text class="s" x="620" y="72" text-anchor="end">positive n: right</text>
<text class="s" x="620" y="176" text-anchor="end">negative n: left</text>`,
);

// 8. Standard form to scientific notation.
svg(
  'tosci',
  'Writing in scientific notation. 52,000,000 becomes 5.2 times 10 to the 7, because the decimal point moves 7 places left. 0.00031 becomes 3.1 times 10 to the minus 4, because the decimal point moves 4 places right.',
  `<text class="t" x="20" y="28">Put the decimal point after the first non-zero digit, then count</text>
<text class="m" x="20" y="72">52,000,000</text>
<text class="m" x="190" y="72">→ 5.2 × 10⁷</text>
<text class="s" x="400" y="72">the point moved 7 places left</text>
<text class="ht" x="190" y="104">left → positive n</text>
<text class="m" x="20" y="164">0.00031</text>
<text class="m" x="190" y="164">→ 3.1 × 10⁻⁴</text>
<text class="s" x="400" y="164">the point moved 4 places right</text>
<text class="bt" x="190" y="196">right → negative n</text>
<text class="s" x="320" y="234" ${C}>Check: the coefficient a must be at least 1 and less than 10.</text>`,
);

console.log('written powers diagrams');
