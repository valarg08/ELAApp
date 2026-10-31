const P = {
  psat: { ...require('./psat-a.cjs'), ...require('./psat-b.cjs') },
  mid: require('./alg1.cjs'),
};
const val = (a) => Function('sqrt', 'return ' + a)(Math.sqrt);
const norm = (s) => s.replace(/−/g, '-');
// parse "a(x - m)(x - n)", "a x(x - n)" -> { a, roots }
function parseFactored(s) {
  s = norm(s).replace(/\s+/g, '');
  const lead = s.match(/^(-?\d*)(?=[(x])/);
  let a = lead && lead[1] !== '' ? (lead[1] === '-' ? -1 : Number(lead[1])) : 1;
  const roots = [];
  for (const m of s.matchAll(/\(x([+-])(\d+)\)/g))
    roots.push(m[1] === '+' ? -Number(m[2]) : Number(m[2]));
  if (/(^|[\d)-])x\(/.test(s) || /\)x$/.test(s) || /^-?\d*x\(/.test(s)) roots.push(0);
  return { a, roots };
}
let checked = 0;
const bad = [];
for (const [level, set] of Object.entries(P))
  for (const [id, list] of Object.entries(set))
    list.forEach((p, i) => {
      const where = `${level}.${id}#${i + 1}`;
      const q = norm(p.q);
      const got = val(p.a);
      const expect = (want) => {
        checked += 1;
        if (!(Math.abs(got - want) < 1e-6))
          bad.push(`${where}: ${p.q} -> ${p.a}, expected ${want}`);
      };
      let m;
      if (
        (m = q.match(
          /^The parabola y = (.+?) crosses the x-axis at two points\. What is the (smaller|larger) x-intercept\?/,
        ))
      ) {
        const { roots } = parseFactored(m[1]);
        roots.sort((x, y) => x - y);
        expect(m[2] === 'smaller' ? roots[0] : roots[1]);
      } else if (
        (m = q.match(/^Find x in the equation x = \? of the axis of symmetry of y = (.+?)\.$/))
      ) {
        const { roots } = parseFactored(m[1]);
        expect((roots[0] + roots[1]) / 2);
      } else if (
        (m = q.match(/^What is the y-coordinate of the vertex of y = (.+?)\?$/)) &&
        /\)\(|x\(/.test(m[1])
      ) {
        const { a, roots } = parseFactored(m[1]);
        const h = (roots[0] + roots[1]) / 2;
        expect(a * (h - roots[0]) * (h - roots[1]));
      } else if (
        (m = q.match(/^Expand y = (.+?) into standard form y = ax² \+ bx \+ c\. Find (b|c)\./))
      ) {
        const { a, roots } = parseFactored(m[1]);
        expect(m[2] === 'b' ? -a * (roots[0] + roots[1]) : a * roots[0] * roots[1]);
      } else if (
        (m = q.match(
          /^Factor (.+?) as \(x \+ p\)\(x \+ q\) with p < q \(or equal\)\. Find (p|q)\./,
        ))
      ) {
        const t = m[1].replace(/\s+/g, '');
        const b = Number((t.match(/x²([+-]\d*)x/) || [0, '0'])[1].replace(/^([+-])$/, '$11'));
        const c = Number(t.match(/x([+-]\d+)$/)[1]);
        const D = b * b - 4 * c;
        const r = [(-b - Math.sqrt(D)) / 2, (-b + Math.sqrt(D)) / 2];
        expect(m[2] === 'p' ? -r[1] : -r[0]);
      } else if ((m = q.match(/^(.+?) = \((\d*)x \+ p\)\((\d*)x \+ q\)\. Find p \+ q\./))) {
        const t = m[1].replace(/\s+/g, '');
        const mm = Number(m[2] || 1),
          nn = Number(m[3] || 1);
        const a = Number(
          (t.match(/^(-?\d*)x²/) || [0, '1'])[1].replace(/^-?$/, (x) => (x === '-' ? '-1' : '1')),
        );
        const bs = (t.match(/x²([+-]\d*)x/) || [0, '0'])[1];
        const b = Number(bs.replace(/^([+-])$/, '$11'));
        const c = Number(t.match(/x([+-]\d+)$/)[1]);
        const D = b * b - 4 * a * c;
        const r = [(-b - Math.sqrt(D)) / (2 * a), (-b + Math.sqrt(D)) / (2 * a)];
        let found = null;
        for (const [r1, r2] of [r, [r[1], r[0]]]) {
          const p = -mm * r1,
            qq = -nn * r2;
          if (Number.isInteger(p) && Number.isInteger(qq) && mm * qq + nn * p === b) found = p + qq;
        }
        expect(found);
      }
    });
console.log('re-derived', checked, bad.length ? '\n' + bad.join('\n') : 'all agree');
