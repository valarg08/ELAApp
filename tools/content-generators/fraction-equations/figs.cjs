// Our own diagrams for the Equations with Fractions study guide (not frames from the video).
const fs = require('fs');
const path = require('path');

const out = path.resolve(__dirname, '../../../apps/web/public/guides/fraction-equations');
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
.big{font-size:30px;font-weight:600}
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

// 1. Least common multiple of two denominators.
svg(
  'lcm',
  'Finding the least common multiple of 6 and 9. The multiples of 6 are 6, 12, 18, 24. The multiples of 9 are 9, 18, 27. The first number in both lists is 18, so the LCM is 18.',
  `<text class="t" x="20" y="28">Smallest number that both denominators go into</text>
<text class="s" x="20" y="66">multiples of 6</text>
<rect class="fa" x="150" y="44" width="70" height="36" rx="8"/><text class="m" x="185" y="70" ${C}>6</text>
<rect class="fa" x="230" y="44" width="70" height="36" rx="8"/><text class="m" x="265" y="70" ${C}>12</text>
<rect class="fh" x="310" y="44" width="70" height="36" rx="8"/><text class="m" x="345" y="70" ${C}>18</text>
<rect class="fa" x="390" y="44" width="70" height="36" rx="8"/><text class="m" x="425" y="70" ${C}>24</text>
<text class="s" x="20" y="126">multiples of 9</text>
<rect class="fb" x="150" y="104" width="70" height="36" rx="8"/><text class="m" x="185" y="130" ${C}>9</text>
<rect class="fh" x="310" y="104" width="70" height="36" rx="8"/><text class="m" x="345" y="130" ${C}>18</text>
<rect class="fb" x="390" y="104" width="70" height="36" rx="8"/><text class="m" x="425" y="130" ${C}>27</text>
<line class="d" x1="345" y1="82" x2="345" y2="102"/>
<text class="ht" x="345" y="172" ${C}>first one in both lists: LCM = 18</text>
<text class="s" x="320" y="212" ${C}>With big numbers, use prime factors: take the highest power of each prime.</text>
<text class="s" x="320" y="234" ${C}>6 = 2 × 3 and 9 = 3², so the LCM is 2 × 3² = 18.</text>`,
);

// 2. Clear the fractions: multiply every term by the LCM.
svg(
  'clear',
  'Clearing fractions. In x over 2 plus 1 over 3 equals 5 over 6, the LCM of 2, 3 and 6 is 6. Multiply every term by 6 to get 3x plus 2 equals 5, which has no fractions.',
  `<text class="t" x="20" y="28">Multiply every term by the LCM</text>
<text class="m" x="320" y="70" ${C}>x/2 + 1/3 = 5/6</text>
<text class="ht" x="320" y="100" ${C}>LCM of 2, 3 and 6 is 6</text>
<rect class="fa" x="60" y="116" width="520" height="52" rx="10"/>
<text class="m" x="320" y="150" ${C}>6·x/2 + 6·1/3 = 6·5/6</text>
<path class="h" d="M320 172 v22"/><path class="h" d="M312 186 l8 10 l8 -10"/>
<text class="big at" x="320" y="232" ${C}>3x + 2 = 5</text>`,
);

// 3. Whole numbers are multiplied too.
svg(
  'solve',
  'Solving with fractions on both sides. For x over 3 minus 2 equals x over 2 plus 1, multiply every term by 6, including the whole numbers: 2x minus 12 equals 3x plus 6. Then x equals minus 18.',
  `<text class="t" x="20" y="28">Every term, including the whole numbers</text>
<text class="m" x="320" y="66" ${C}>x/3 − 2 = x/2 + 1</text>
<text class="ht" x="320" y="92" ${C}>× 6 on every term</text>
<rect class="fa" x="60" y="106" width="520" height="40" rx="10"/>
<text class="m" x="320" y="134" ${C}>2x − 12 = 3x + 6</text>
<text class="s" x="320" y="168" ${C}>6 × 2 = 12 and 6 × 1 = 6: do not forget the whole numbers</text>
<text class="m" x="320" y="198" ${C}>−12 − 6 = 3x − 2x</text>
<text class="big at" x="320" y="236" ${C}>x = −18</text>`,
);

// 4. One fraction equal to a number.
svg(
  'single',
  'One fraction equal to a number. In the fraction 2x plus 1, over 5, equal to 3, multiply both sides by 5 to get 2x plus 1 equals 15. Then 2x equals 14 and x equals 7.',
  `<text class="t" x="20" y="28">Undo the division: multiply both sides by the denominator</text>
<text class="big" x="320" y="76" ${C}>(2x + 1)/5 = 3</text>
<text class="ht" x="320" y="108" ${C}>× 5 on both sides</text>
<rect class="fa" x="150" y="122" width="340" height="44" rx="10"/>
<text class="m" x="320" y="152" ${C}>2x + 1 = 15</text>
<text class="m" x="320" y="192" ${C}>2x = 14</text>
<text class="big at" x="320" y="232" ${C}>x = 7</text>`,
);

// 5. Cross multiplication.
svg(
  'cross',
  'Cross multiplication. For x over 4 equal to 5 over 6, multiply across the equals sign: 6 times x equals 4 times 5, so 6x equals 20 and x equals 20 over 6, which is 10 over 3.',
  `<text class="t" x="20" y="28">One fraction = one fraction: cross multiply</text>
<text class="big bt" x="200" y="76" ${C}>x</text><line class="l" x1="180" y1="88" x2="220" y2="88"/><text class="big ht" x="200" y="120" ${C}>4</text>
<text class="big" x="320" y="102" ${C}>=</text>
<text class="big ht" x="440" y="76" ${C}>5</text><line class="l" x1="420" y1="88" x2="460" y2="88"/><text class="big bt" x="440" y="120" ${C}>6</text>
<text class="m" x="320" y="146" ${C}><tspan class="bt">6 × x</tspan> = <tspan class="ht">4 × 5</tspan></text>
<text class="m" x="320" y="180" ${C}>6x = 20</text>
<text class="big at" x="320" y="224" ${C}>x = 20/6 = 10/3</text>
<text class="s" x="320" y="246" ${C}>Each top times the bottom of the other fraction.</text>`,
);

// 6. Brackets: the multiplier goes on the whole bracket.
svg(
  'parens',
  'Brackets over denominators. For x plus 1 over 2 minus x minus 1 over 3 equals 2, multiply by 6. This gives 3 times (x plus 1) minus 2 times (x minus 1) equals 12. Distribute: 3x plus 3 minus 2x plus 2 equals 12, so x equals 7.',
  `<text class="t" x="20" y="28">The multiplier goes on the whole bracket</text>
<text class="m" x="320" y="64" ${C}>(x + 1)/2 − (x − 1)/3 = 2</text>
<text class="ht" x="320" y="92" ${C}>× 6: 6 ÷ 2 = 3 and 6 ÷ 3 = 2</text>
<rect class="fa" x="60" y="104" width="520" height="40" rx="10"/>
<text class="m" x="320" y="132" ${C}>3(x + 1) − 2(x − 1) = 12</text>
<text class="m" x="320" y="170" ${C}>3x + 3 − 2x + 2 = 12</text>
<text class="s" x="320" y="192" ${C}>the minus sign changes both signs inside the second bracket</text>
<text class="big at" x="320" y="232" ${C}>x = 7</text>`,
);

// 7. Check by plugging in.
svg(
  'check',
  'Checking a solution. For x over 4 plus 3 equals 5, the solution is x equals 8. Put 8 in both sides. The left side is 8 over 4 plus 3, which is 5, and the right side is 5. Both sides match, so 8 is correct.',
  `<text class="t" x="20" y="28">Put the answer back in both sides</text>
<text class="m" x="200" y="66" ${C}>x/4 + 3 = 5</text><text class="m" x="440" y="66" ${C}>try x = 8</text>
<rect class="fa" x="40" y="86" width="250" height="90" rx="10"/>
<text class="s" x="165" y="110" ${C}>left side</text><text class="m" x="165" y="140" ${C}>8/4 + 3</text><text class="at" x="165" y="164" ${C}>= 2 + 3 = 5</text>
<rect class="fb" x="350" y="86" width="250" height="90" rx="10"/>
<text class="s" x="475" y="110" ${C}>right side</text><text class="m" x="475" y="140" ${C}>5</text><text class="bt" x="475" y="164" ${C}>= 5</text>
<text class="m" x="320" y="136" ${C}>=</text>
<text class="at" x="320" y="212" ${C}>Both sides match, so x = 8 is correct ✔</text>
<text class="s" x="320" y="236" ${C}>If the sides differ, look for a term you forgot to multiply.</text>`,
);

console.log('written fraction-equation diagrams');
