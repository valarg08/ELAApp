// Independent check: re-derive the answer of the common question types straight from the question text.
const fs = require('fs');
const P = {
  psat: { ...require('./psat-a.cjs'), ...require('./psat-b.cjs') },
  mid: require('./alg1.cjs'),
};

function parsePoly(s) {
  s = s.replace(/−/g, '-').replace(/\s+/g, '');
  const terms = s.match(/[+-]?[^+-]+/g) ?? [];
  let a = 0,
    b = 0,
    c = 0;
  for (const t of terms) {
    if (t.endsWith('x²')) {
      const k = t.slice(0, -2);
      a += k === '' || k === '+' ? 1 : k === '-' ? -1 : Number(k);
    } else if (t.endsWith('x')) {
      const k = t.slice(0, -1);
      b += k === '' || k === '+' ? 1 : k === '-' ? -1 : Number(k);
    } else c += Number(t);
  }
  return { a, b, c };
}
const roots = ({ a, b, c }) => {
  const D = b * b - 4 * a * c;
  if (D < -1e-9) return [];
  const s = Math.sqrt(Math.max(D, 0));
  return [
    ...new Set([(-b - s) / (2 * a), (-b + s) / (2 * a)].map((v) => Math.round(v * 1e9) / 1e9)),
  ].toSorted((x, y) => x - y);
};

async function main() {
  const { readAnswer } = await import(
    require('url').pathToFileURL(
      require('path').resolve(__dirname, '../../../packages/math-check/dist/index.js'),
    ).href
  );
  const val = (a) => Function('sqrt', 'return ' + a)(Math.sqrt);
  let checked = 0;
  const bad = [];
  const note = (where, q, a, want) =>
    bad.push(`${where}: ${q}\n    answer ${a} (${val(a)}), expected ${want}`);
  for (const [level, set] of Object.entries(P))
    for (const [id, list] of Object.entries(set))
      list.forEach((p, i) => {
        const where = `${level}.${id}#${i + 1}`;
        const q = p.q;
        const got = val(p.a);
        let m;
        const expect = (want) => {
          checked += 1;
          if (!(Math.abs(got - want) < 1e-6)) note(where, q, p.a, want);
        };
        if (
          (m = q.match(
            /^(?:Solve|Use the quadratic formula to solve) (.+?) = 0(?: by completing the square)?\. Give the (smaller|larger) solution/,
          ))
        ) {
          const rs = roots(parsePoly(m[1]));
          expect(m[2] === 'smaller' ? rs[0] : rs.at(-1));
        } else if ((m = q.match(/^Solve (.+?) = (-?[\d−]+)\. Give the (smaller|larger)/))) {
          const k = Number(m[2].replace('−', '-'));
          const poly = parsePoly(m[1]);
          const rs = roots({ ...poly, c: poly.c - k });
          expect(m[3] === 'smaller' ? rs[0] : rs.at(-1));
        } else if ((m = q.match(/^Find the discriminant b² − 4ac of (.+?) = 0\./))) {
          const { a, b, c } = parsePoly(m[1]);
          expect(b * b - 4 * a * c);
        } else if ((m = q.match(/^How many real solutions does (.+?) = 0 have/))) {
          const { a, b, c } = parsePoly(m[1]);
          const D = b * b - 4 * a * c;
          expect(D > 0 ? 2 : D === 0 ? 1 : 0);
        } else if ((m = q.match(/^Find the x-coordinate of the vertex of y = (.+?)\.$/))) {
          const { a, b } = parsePoly(m[1]);
          expect(-b / (2 * a));
        } else if (
          (m = q.match(/^Find the y-coordinate of the vertex of y = (.+?)\.$/)) &&
          !/\(/.test(m[1])
        ) {
          const { a, b, c } = parsePoly(m[1]);
          expect(a * (b / (2 * a)) ** 2 - (b * b) / (2 * a) + c);
        } else if (
          (m = q.match(/^What is the (minimum|maximum) value of y = (.+?)\?$/)) &&
          !/\(/.test(m[2])
        ) {
          const { a, b, c } = parsePoly(m[2]);
          expect(c - (b * b) / (4 * a));
        } else if ((m = q.match(/^Find y when x = (-?[\d−]+) in y = (.+?)\.$/))) {
          const x = Number(m[1].replace('−', '-'));
          const { a, b, c } = parsePoly(m[2]);
          expect(a * x * x + b * x + c);
        } else if ((m = q.match(/^Find the sum of the two solutions of (.+?) = 0\./))) {
          const rs = roots(parsePoly(m[1]));
          expect(rs.reduce((s, v) => s + v, 0));
        } else if ((m = q.match(/^Find the product of the two solutions of (.+?) = 0\./))) {
          const rs = roots(parsePoly(m[1]));
          expect(rs.reduce((s, v) => s * v, 1));
        } else if (
          (m = q.match(
            /^Complete the square to write y = (.+?) as y = a\(x − h\)² \+ k\. Find (h|k)\./,
          ))
        ) {
          const { a, b, c } = parsePoly(m[1]);
          expect(m[2] === 'h' ? -b / (2 * a) : c - (b * b) / (4 * a));
        }
      });
  console.log(`independently re-derived ${checked} answers`);
  console.log(bad.length ? bad.join('\n') : 'all agree');
}
main();
