// Independent numeric check of the symbolic answers (expressions, inequalities, equations of lines).
const eq = (name, f, g, xs = [-3, -1, 0, 1, 2, 5, 7]) => {
  const bad = xs.filter((x) => Math.abs(f(x) - g(x)) > 1e-9);
  console.log((bad.length ? 'FAIL ' : 'ok   ') + name + (bad.length ? ' at x=' + bad : ''));
};
// Equivalent expressions: the stem and the keyed choice must agree at many x, and every wrong choice must differ somewhere.
const uniq = (name, stem, correct, wrongs) => {
  eq(name + ' (keyed)', stem, correct);
  wrongs.forEach((w, i) => {
    const same = [-3, -1, 0, 1, 2, 5, 7].every((x) => Math.abs(stem(x) - w(x)) < 1e-9);
    console.log(
      (same ? 'FAIL ' : 'ok   ') +
        name +
        ' wrong choice ' +
        (i + 1) +
        (same ? ' is also equivalent!' : ' differs'),
    );
  });
};
uniq(
  'W1M1-5  2(3x-4)+5',
  (x) => 2 * (3 * x - 4) + 5,
  (x) => 6 * x - 3,
  [(x) => 6 * x + 1, (x) => 5 * x + 1, (x) => 6 * x - 13],
);
uniq(
  'W1M1-12 x^2-9',
  (x) => x * x - 9,
  (x) => (x - 3) * (x + 3),
  [(x) => (x - 3) ** 2, (x) => (x + 3) ** 2, (x) => (x - 9) * (x + 1)],
);
uniq(
  'W1M2e-5 4x+6x-3x',
  (x) => 4 * x + 6 * x - 3 * x,
  (x) => 7 * x,
  [(x) => 13 * x, (x) => 5 * x, (x) => 7 * x * x],
);
uniq(
  'W1M2h-6 (x+3)^2-9',
  (x) => (x + 3) ** 2 - 9,
  (x) => x * x + 6 * x,
  [(x) => x * x, (x) => x * x + 6 * x + 18, (x) => x * x + 3 * x],
);
uniq(
  'W2M1-3  3(x+2)-(x-4)',
  (x) => 3 * (x + 2) - (x - 4),
  (x) => 2 * x + 10,
  [(x) => 2 * x + 2, (x) => 4 * x + 10, (x) => 2 * x - 2],
);
uniq(
  'W2M2e-5 5x+2x-4x',
  (x) => 5 * x + 2 * x - 4 * x,
  (x) => 3 * x,
  [(x) => 11 * x, (x) => 7 * x, (x) => 3 * x * x],
);
uniq(
  'W2M2e-16 (x+5)(x-2)',
  (x) => (x + 5) * (x - 2),
  (x) => x * x + 3 * x - 10,
  [(x) => x * x - 10, (x) => x * x + 7 * x - 10, (x) => x * x + 3 * x + 10],
);
uniq(
  'W2M2h-5 (2x-3)^2',
  (x) => (2 * x - 3) ** 2,
  (x) => 4 * x * x - 12 * x + 9,
  [(x) => 4 * x * x + 9, (x) => 4 * x * x - 6 * x + 9, (x) => 2 * x * x - 12 * x + 9],
);
uniq(
  'W2M2h-13 (x^2-16)/(x-4)',
  (x) => (x * x - 16) / (x - 4),
  (x) => x + 4,
  [(x) => x - 4, (x) => x * x - 4, (x) => x + 16],
  [-3, -1, 0, 1, 2, 5, 7],
);
// Lines: slope 3 through (1,2) is y = 3x - 1; the wrong choices must not pass through (1,2) with slope 3.
const line = (m, b) => ({ m, b });
const through = (l, p) => Math.abs(l.m * p[0] + l.b - p[1]) < 1e-9;
console.log('line W1M2e-12 keyed passes (1,2), slope 3:', through(line(3, -1), [1, 2]));
[line(3, 2), line(1, 3), line(3, 1)].forEach((l, i) =>
  console.log('  wrong line', i + 1, 'passes (1,2) with slope 3:', l.m === 3 && through(l, [1, 2])),
);
// Inequalities: test points on each side of the boundary.
const ineq = (name, truth, keyed, wrongs) => {
  const pts = [-10, -4, -3.5, -3, -2.9, 0, 2, 4, 5, 5.1, 7, 10];
  const same = (f) => pts.every((p) => f(p) === truth(p));
  console.log((same(keyed) ? 'ok   ' : 'FAIL ') + name + ' keyed matches the true solution set');
  wrongs.forEach((w, i) =>
    console.log(
      (same(w) ? 'FAIL ' : 'ok   ') +
        name +
        ' wrong ' +
        (i + 1) +
        (same(w) ? ' is also right!' : ' differs'),
    ),
  );
};
ineq(
  'W1M1-11 5-2x>11',
  (x) => 5 - 2 * x > 11,
  (x) => x < -3,
  [(x) => x > -3, (x) => x < 3, (x) => x > 3],
);
ineq(
  'W1M2e-15 3x-4<=11',
  (x) => 3 * x - 4 <= 11,
  (x) => x <= 5,
  [(x) => x >= 5, (x) => x <= 7 / 3, (x) => x < 5],
);
// Inequality set-up: 200 + 15h <= 500
console.log(
  'W1M2h-5 keyed is "total cost at most 500":',
  [0, 10, 20, 21].map((h) => 200 + 15 * h <= 500).join(','),
);
// Function / interpretation spot checks
console.log('W1M2h-3 f(0) =', 5 - ((17 - 5) / (6 - 2)) * 2, '(keyed -1)');
console.log(
  'W2M2h-16 f(x)=12 at x = 5 and x = 1:',
  2 * (5 - 3) ** 2 + 4,
  2 * (1 - 3) ** 2 + 4,
  ' listed options 4,7,5,9 ->',
  [4, 7, 5, 9].filter((x) => 2 * (x - 3) ** 2 + 4 === 12).join(','),
);
console.log('W1M2e-16 x^2=49 solutions:', [7, -7].map((x) => x * x).join(','));
console.log(
  'W1M2h-20 data sets: means',
  [5, 7, 9, 11, 13].reduce((a, b) => a + b) / 5,
  [1, 7, 9, 11, 17].reduce((a, b) => a + b) / 5,
  'ranges',
  13 - 5,
  17 - 1,
);
console.log('W1M1-21 P(both red) =', (5 / 8) * (4 / 7), '= 5/14 =', 5 / 14);
