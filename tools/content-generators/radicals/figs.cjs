// Our own diagrams for the Radicals study guide (not frames from the video).
const fs = require('fs');
const path = require('path');

const out = path.resolve(__dirname, '../../../apps/web/public/guides/radicals');
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
.big{font-size:20px}
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

const C = 'text-anchor="middle"';

svg(
  'whatis',
  'A root undoes a power: 7 squared is 49 so the square root of 49 is 7, and 2 cubed is 8 so the cube root of 8 is 2. The square root of a negative number is not real.',
  `<text class="t" x="20" y="28">A root undoes a power</text>
<rect class="fa" x="24" y="46" width="290" height="110" rx="8"/>
<text class="at big" x="169" y="82" ${C}>7² = 49</text>
<text class="at big" x="169" y="116" ${C}>√49 = 7</text>
<text class="s" x="169" y="142" ${C}>index 2 (not written)</text>
<rect class="fh" x="326" y="46" width="290" height="110" rx="8"/>
<text class="ht big" x="471" y="82" ${C}>2³ = 8</text>
<text class="ht big" x="471" y="116" ${C}>∛8 = 2</text>
<text class="s" x="471" y="142" ${C}>index 3 (written small)</text>
<text class="s" x="320" y="188" ${C}>√x = x^(1/2)   ∛x = x^(1/3)   ⁿ√x = x^(1/n)</text>
<text class="s" x="320" y="216" ${C}>even index: the radicand must be ≥ 0 (real numbers). odd index: any radicand.</text>`,
);

svg(
  'perfect',
  'A table of perfect squares from 1 to 15 squared and perfect cubes from 1 to 6 cubed.',
  `<text class="t" x="20" y="28">Know these cold</text>
<text class="at" x="20" y="60">Squares</text>
<text x="20" y="86">1  4  9  16  25  36  49  64  81  100</text>
<text x="20" y="112">121  144  169  196  225</text>
<text class="s" x="20" y="134">1² to 15²</text>
<text class="ht" x="20" y="170">Cubes</text>
<text x="20" y="196">1  8  27  64  125  216</text>
<text class="s" x="20" y="218">1³ to 6³</text>
<rect class="fb" x="380" y="46" width="236" height="168" rx="8"/>
<text class="bt" x="498" y="76" ${C}>Both at once</text>
<text x="498" y="106" ${C}>1 and 64</text>
<text class="s" x="498" y="130" ${C}>64 = 8² = 4³</text>
<text class="s" x="498" y="156" ${C}>sixth powers: 1⁶, 2⁶, 3⁶, …</text>
<text class="s" x="498" y="182" ${C}>1, 64, 729, …</text>`,
);

svg(
  'simplify',
  'Simplifying the square root of 50: split 50 into 25 times 2, take the square root of 25 out as 5, and leave the square root of 2, giving 5 root 2.',
  `<text class="t" x="20" y="28">Pull out the biggest perfect square</text>
<text class="big" x="320" y="76" ${C}>√50</text>
<line class="l" x1="300" y1="86" x2="250" y2="118"/>
<line class="l" x1="340" y1="86" x2="390" y2="118"/>
<text class="at big" x="240" y="146" ${C}>25</text>
<text class="ht big" x="400" y="146" ${C}>2</text>
<text class="s" x="240" y="168" ${C}>perfect square</text>
<text class="s" x="400" y="168" ${C}>stays inside</text>
<text class="big" x="320" y="146" ${C}>×</text>
<text class="t" x="320" y="204" ${C}>√25 · √2 = 5√2</text>
<text class="s" x="320" y="230" ${C}>simplest form: no perfect-square factor left under the root</text>`,
);

svg(
  'muldiv',
  'Multiplying and dividing radicals: the square root of a times the square root of b is the square root of a b, and the square root of a over the square root of b is the square root of a over b.',
  `<text class="t" x="20" y="28">Same index: combine under one root</text>
<rect class="fa" x="24" y="46" width="290" height="124" rx="8"/>
<text class="at big" x="169" y="82" ${C}>√a · √b = √(ab)</text>
<text x="169" y="116" ${C}>√2 · √8 = √16 = 4</text>
<text class="s" x="169" y="146" ${C}>multiply the radicands</text>
<rect class="fh" x="326" y="46" width="290" height="124" rx="8"/>
<text class="ht big" x="471" y="82" ${C}>√a / √b = √(a/b)</text>
<text x="471" y="116" ${C}>√50 / √2 = √25 = 5</text>
<text class="s" x="471" y="146" ${C}>divide the radicands</text>
<text class="s" x="320" y="202" ${C}>with numbers in front: multiply the outside numbers, multiply the insides</text>
<text class="s" x="320" y="228" ${C}>3√2 · 4√3 = 12√6</text>`,
);

svg(
  'addsub',
  'Adding like radicals: 3 root 2 plus 5 root 2 is 8 root 2, like adding 3 apples and 5 apples. Unlike radicals such as 3 root 2 plus 5 root 3 cannot be combined.',
  `<text class="t" x="20" y="28">Only like radicals combine</text>
<rect class="fa" x="24" y="46" width="290" height="150" rx="8"/>
<text class="at" x="169" y="74" ${C}>like radicals</text>
<text class="big" x="169" y="110" ${C}>3√2 + 5√2 = 8√2</text>
<text class="s" x="169" y="140" ${C}>add the numbers in front,</text>
<text class="s" x="169" y="162" ${C}>keep the radical</text>
<rect class="fh" x="326" y="46" width="290" height="150" rx="8"/>
<text class="ht" x="471" y="74" ${C}>unlike radicals</text>
<text class="big" x="471" y="110" ${C}>3√2 + 5√3</text>
<text class="s" x="471" y="140" ${C}>different radicands: stuck</text>
<text class="s" x="471" y="162" ${C}>unless one simplifies</text>
<text class="s" x="320" y="226" ${C}>simplify first: √50 + √18 = 5√2 + 3√2 = 8√2</text>`,
);

svg(
  'rationalize',
  'Rationalizing a denominator: 2 over root 3 times root 3 over root 3 is 2 root 3 over 3. For a binomial denominator such as 5 over 3 plus root 2, multiply by the conjugate 3 minus root 2.',
  `<text class="t" x="20" y="28">No radical left in the denominator</text>
<rect class="fa" x="24" y="46" width="290" height="150" rx="8"/>
<text class="at" x="169" y="72" ${C}>one root</text>
<text class="big" x="169" y="106" ${C}>2/√3 · √3/√3</text>
<text class="big" x="169" y="140" ${C}>= 2√3 / 3</text>
<text class="s" x="169" y="170" ${C}>√3 · √3 = 3</text>
<rect class="fh" x="326" y="46" width="290" height="150" rx="8"/>
<text class="ht" x="471" y="72" ${C}>binomial: use the conjugate</text>
<text x="471" y="106" ${C} style="font-size:13px">5/(3 + √2) · (3 − √2)/(3 − √2)</text>
<text class="s" x="471" y="136" ${C}>(3 + √2)(3 − √2) = 9 − 2 = 7</text>
<text class="big" x="471" y="168" ${C}>= 5(3 − √2)/7</text>
<text class="s" x="320" y="226" ${C}>change only the sign between the terms</text>`,
);

svg(
  'equations',
  'Solving a radical equation: isolate the radical, square both sides, solve, then check. The square root of x plus 3 equals 7 gives x equals 46. An equation like the square root of x plus 5 equals negative 3 has no solution.',
  `<text class="t" x="20" y="28">Isolate, square, solve, check</text>
<rect class="fa" x="24" y="46" width="290" height="160" rx="8"/>
<text class="at" x="169" y="72" ${C}>√(x + 3) = 7</text>
<text x="169" y="102" ${C}>x + 3 = 49</text>
<text x="169" y="130" ${C}>x = 46</text>
<text class="s" x="169" y="160" ${C}>check: √49 = 7 ✓</text>
<rect class="fh" x="326" y="46" width="290" height="160" rx="8"/>
<text class="ht" x="471" y="72" ${C}>√(x + 5) = −3</text>
<text class="s" x="471" y="102" ${C}>a square root is never negative</text>
<text x="471" y="130" ${C}>no solution</text>
<text class="s" x="471" y="160" ${C}>squaring can add fake roots,</text>
<text class="s" x="471" y="182" ${C}>so always check</text>`,
);

// The square-root curve: y = √x, scaled to the plot box.
const px = (x) => 60 + x * 40;
const py = (y) => 200 - y * 50;
const curve = [];
for (let x = 0; x <= 12.01; x += 0.25)
  curve.push(`${px(x).toFixed(1)},${py(Math.sqrt(x)).toFixed(1)}`);
svg(
  'function',
  'The graph of y equals the square root of x: it starts at the origin, passes through (1, 1), (4, 2) and (9, 3), and rises ever more slowly. The domain is x greater than or equal to 0.',
  `<text class="t" x="20" y="24">y = √x</text>
<line class="ax" x1="60" y1="200" x2="560" y2="200"/>
<line class="ax" x1="60" y1="30" x2="60" y2="210"/>
<polyline class="a" points="${curve.join(' ')}"/>
<circle class="dot" cx="${px(0)}" cy="${py(0)}" r="6"/>
<circle class="dot" cx="${px(1)}" cy="${py(1)}" r="5"/>
<circle class="dot" cx="${px(4)}" cy="${py(2)}" r="5"/>
<circle class="dot" cx="${px(9)}" cy="${py(3)}" r="5"/>
<text class="s" x="${px(0) + 8}" y="${py(0) - 8}">(0, 0)</text>
<text class="s" x="${px(1) + 6}" y="${py(1) - 8}">(1, 1)</text>
<text class="s" x="${px(4) + 6}" y="${py(2) - 8}">(4, 2)</text>
<text class="s" x="${px(9) + 6}" y="${py(3) - 8}">(9, 3)</text>
<text class="ht" x="400" y="70">domain: x ≥ 0</text>
<text class="ht" x="400" y="96">range: y ≥ 0</text>
<text class="s" x="400" y="128">y = √(x + h) + k moves the start</text>
<text class="s" x="400" y="150">to the point (−h, k)</text>`,
);

svg(
  'imaginary',
  'The powers of i repeat every four steps: i, then negative 1, then negative i, then 1, and back to i. The square root of a negative number is a multiple of i.',
  `<text class="t" x="20" y="28">i² = −1, and the powers cycle</text>
<rect class="fa" x="40" y="60" width="110" height="52" rx="8"/><text class="at big" x="95" y="94" ${C}>i¹ = i</text>
<rect class="fh" x="230" y="60" width="110" height="52" rx="8"/><text class="ht big" x="285" y="94" ${C}>i² = −1</text>
<rect class="fb" x="230" y="150" width="110" height="52" rx="8"/><text class="bt big" x="285" y="184" ${C}>i³ = −i</text>
<rect class="fv" x="40" y="150" width="110" height="52" rx="8"/><text class="vt big" x="95" y="184" ${C}>i⁴ = 1</text>
<text class="s" x="190" y="92" ${C}>→</text>
<text class="s" x="285" y="136" ${C}>↓</text>
<text class="s" x="190" y="182" ${C}>←</text>
<text class="s" x="95" y="136" ${C}>↑</text>
<text class="s" x="400" y="76">for iⁿ, divide n by 4</text>
<text class="s" x="400" y="100">and use the remainder</text>
<text class="s" x="400" y="136">√(−a) = i√a</text>
<text class="s" x="400" y="160">a + bi: real part a, imaginary part b</text>`,
);

svg(
  'uses',
  'Where radicals appear: the hypotenuse of a right triangle with legs 3 and 4 is the square root of 25, which is 5; the distance formula and the side of a square from its area are also square roots.',
  `<text class="t" x="20" y="28">Radicals show up in geometry</text>
<polygon class="fa" points="60,200 60,80 200,200" stroke="#334155" stroke-width="2"/>
<polyline class="l" points="60,184 76,184 76,200"/>
<text x="38" y="146" ${C}>3</text>
<text x="130" y="222" ${C}>4</text>
<text class="at" x="144" y="132">c</text>
<text class="s" x="240" y="84">c² = 3² + 4² = 25</text>
<text class="s" x="240" y="110">c = √25 = 5</text>
<text class="s" x="240" y="146">distance: d = √((x₂ − x₁)² + (y₂ − y₁)²)</text>
<text class="s" x="240" y="172">square of area A: side = √A</text>
<text class="s" x="240" y="198">diagonal of a square with side s: s√2</text>`,
);

console.log('written radicals diagrams');
