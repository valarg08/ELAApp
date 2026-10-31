// Plain-SVG figure builders for the SAT questions (no scripts, links or images: content:check rejects those).
const W = 360;
const H = 260;
const wrap = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial, Helvetica, sans-serif" font-size="13" fill="#000">${body}</svg>\n`;
const r1 = (n) => Math.round(n * 10) / 10;
const text = (x, y, s, extra = '') => `<text x="${r1(x)}" y="${r1(y)}" ${extra}>${s}</text>`;

/** A scatterplot or line graph: x = [min, max, tick], y = [min, max, tick]. */
function plot({
  x,
  y,
  points = [],
  line = null,
  xlabel = '',
  ylabel = '',
  connect = false,
  fn = null,
}) {
  const L = 50,
    R = 14,
    T = 14,
    B = 46;
  const pw = W - L - R;
  const ph = H - T - B;
  const X = (v) => L + ((v - x[0]) / (x[1] - x[0])) * pw;
  const Y = (v) => T + ph - ((v - y[0]) / (y[1] - y[0])) * ph;
  let s = `<rect x="0" y="0" width="${W}" height="${H}" fill="#fff"/>`;
  for (let v = x[0]; v <= x[1] + 1e-9; v += x[2]) {
    s += `<line x1="${r1(X(v))}" y1="${T}" x2="${r1(X(v))}" y2="${T + ph}" stroke="#ddd"/>`;
    s += text(X(v), T + ph + 16, String(r1(v)), 'text-anchor="middle"');
  }
  for (let v = y[0]; v <= y[1] + 1e-9; v += y[2]) {
    s += `<line x1="${L}" y1="${r1(Y(v))}" x2="${L + pw}" y2="${r1(Y(v))}" stroke="#ddd"/>`;
    s += text(L - 6, Y(v) + 4, String(r1(v)), 'text-anchor="end"');
  }
  s += `<line x1="${L}" y1="${T + ph}" x2="${L + pw}" y2="${T + ph}" stroke="#000" stroke-width="1.5"/>`;
  s += `<line x1="${L}" y1="${T}" x2="${L}" y2="${T + ph}" stroke="#000" stroke-width="1.5"/>`;
  if (xlabel) s += text(L + pw / 2, H - 6, xlabel, 'text-anchor="middle"');
  if (ylabel)
    s += text(
      14,
      T + ph / 2,
      ylabel,
      `text-anchor="middle" transform="rotate(-90 14 ${r1(T + ph / 2)})"`,
    );
  if (line)
    s += `<line x1="${r1(X(line[0][0]))}" y1="${r1(Y(line[0][1]))}" x2="${r1(X(line[1][0]))}" y2="${r1(Y(line[1][1]))}" stroke="#0a5a78" stroke-width="2.2"/>`;
  if (fn) {
    const pts = [];
    for (let v = x[0]; v <= x[1] + 1e-9; v += (x[1] - x[0]) / 100)
      pts.push(`${r1(X(v))},${r1(Y(fn(v)))}`);
    s += `<polyline fill="none" stroke="#0a5a78" stroke-width="2.2" points="${pts.join(' ')}"/>`;
  }
  if (connect && points.length > 1)
    s += `<polyline fill="none" stroke="#0a5a78" stroke-width="2.2" points="${points.map((p) => `${r1(X(p[0]))},${r1(Y(p[1]))}`).join(' ')}"/>`;
  for (const p of points)
    s += `<circle cx="${r1(X(p[0]))}" cy="${r1(Y(p[1]))}" r="4.2" fill="#c0392b"/>`;
  return wrap(W, H, s);
}

/** Two or more dot plots on one number line. */
function dotplots({ min, max, sets }) {
  const L = 40,
    R = 16;
  const pw = W - L - R;
  const X = (v) => L + ((v - min) / (max - min)) * pw;
  const rowH = 70;
  const H2 = 40 + sets.length * rowH + 40;
  let s = `<rect x="0" y="0" width="${W}" height="${H2}" fill="#fff"/>`;
  sets.forEach((set, i) => {
    const base = 30 + (i + 1) * rowH;
    s += `<line x1="${L}" y1="${base}" x2="${L + pw}" y2="${base}" stroke="#000" stroke-width="1.5"/>`;
    s += text(12, base - 18, set.label, 'font-weight="bold" font-size="16"');
    for (let v = min; v <= max; v += 1) {
      s += `<line x1="${r1(X(v))}" y1="${base}" x2="${r1(X(v))}" y2="${base + 5}" stroke="#000"/>`;
      if (i === sets.length - 1 && v % 2 === 0)
        s += text(X(v), base + 20, String(v), 'text-anchor="middle"');
    }
    for (const v of set.values)
      s += `<circle cx="${r1(X(v))}" cy="${base - 8}" r="6" fill="#c0392b"/>`;
  });
  return wrap(W, H2, s);
}

/** A triangle (or other polygon) with labels at given positions; optional dashed segments and right-angle squares. */
function shape({ w = 300, h = 220, points, labels = [], dashed = [], squares = [], ticks = [] }) {
  let s = `<rect x="0" y="0" width="${w}" height="${h}" fill="#fff"/>`;
  s += `<polygon points="${points.map((p) => p.join(',')).join(' ')}" fill="#eef6fa" stroke="#000" stroke-width="2"/>`;
  for (const d of dashed)
    s += `<line x1="${d[0]}" y1="${d[1]}" x2="${d[2]}" y2="${d[3]}" stroke="#000" stroke-width="1.6" stroke-dasharray="6 4"/>`;
  for (const q of squares)
    s += `<polyline fill="none" stroke="#000" stroke-width="1.4" points="${q.join(' ')}"/>`;
  for (const t of labels)
    s += text(t[0], t[1], t[2], t[3] ?? 'text-anchor="middle" font-size="15"');
  return wrap(w, h, s);
}

/** Two parallel horizontal lines cut by a transversal, with two labelled angles. */
function transversal({ labels }) {
  const w = 340,
    h = 230;
  let s = `<rect x="0" y="0" width="${w}" height="${h}" fill="#fff"/>`;
  s += `<line x1="20" y1="75" x2="320" y2="75" stroke="#000" stroke-width="2"/>`;
  s += `<line x1="20" y1="155" x2="320" y2="155" stroke="#000" stroke-width="2"/>`;
  s += `<line x1="95" y1="205" x2="215" y2="25" stroke="#000" stroke-width="2"/>`;
  // arrowheads showing the lines are parallel
  s += `<polyline fill="none" stroke="#000" stroke-width="1.6" points="270,69 278,75 270,81"/>`;
  s += `<polyline fill="none" stroke="#000" stroke-width="1.6" points="270,149 278,155 270,161"/>`;
  for (const t of labels) s += text(t[0], t[1], t[2], 'text-anchor="middle" font-size="14"');
  return wrap(w, h, s);
}

/** A bar graph: `bars` is [label, value] pairs; y = [min, max, tick]. */
function barchart({ bars, y, xlabel = '', ylabel = '' }) {
  const L = 50,
    R = 14,
    T = 14,
    B = 52;
  const pw = W - L - R;
  const ph = H - T - B;
  const Y = (v) => T + ph - ((v - y[0]) / (y[1] - y[0])) * ph;
  let s = `<rect x="0" y="0" width="${W}" height="${H}" fill="#fff"/>`;
  for (let v = y[0]; v <= y[1] + 1e-9; v += y[2]) {
    s += `<line x1="${L}" y1="${r1(Y(v))}" x2="${L + pw}" y2="${r1(Y(v))}" stroke="#ddd"/>`;
    s += text(L - 6, Y(v) + 4, String(r1(v)), 'text-anchor="end"');
  }
  const slot = pw / bars.length;
  bars.forEach(([label, value], i) => {
    const x = L + i * slot + slot * 0.18;
    const w = slot * 0.64;
    s += `<rect x="${r1(x)}" y="${r1(Y(value))}" width="${r1(w)}" height="${r1(Y(y[0]) - Y(value))}" fill="#4a90a8" stroke="#000"/>`;
    s += text(x + w / 2, T + ph + 16, label, 'text-anchor="middle"');
  });
  s += `<line x1="${L}" y1="${T + ph}" x2="${L + pw}" y2="${T + ph}" stroke="#000" stroke-width="1.5"/>`;
  s += `<line x1="${L}" y1="${T}" x2="${L}" y2="${T + ph}" stroke="#000" stroke-width="1.5"/>`;
  if (xlabel) s += text(L + pw / 2, H - 8, xlabel, 'text-anchor="middle"');
  if (ylabel)
    s += text(
      14,
      T + ph / 2,
      ylabel,
      `text-anchor="middle" transform="rotate(-90 14 ${r1(T + ph / 2)})"`,
    );
  return wrap(W, H, s);
}

/** A square with a quarter circle (radius = side) centered at its bottom-left corner; the rest of the square is shaded. */
function squareQuarter({ side = '6' }) {
  const w = 280,
    h = 250;
  let s = `<rect x="0" y="0" width="${w}" height="${h}" fill="#fff"/>`;
  s += `<rect x="50" y="30" width="170" height="170" fill="#9cc3d3" stroke="#000" stroke-width="2"/>`;
  s += `<path d="M 50 200 L 220 200 A 170 170 0 0 0 50 30 Z" fill="#fff" stroke="#000" stroke-width="2"/>`;
  s += text(135, 220, side, 'text-anchor="middle" font-size="15"');
  s += text(34, 120, side, 'text-anchor="middle" font-size="15"');
  return wrap(w, h, s);
}

module.exports = { plot, dotplots, shape, transversal, barchart, squareQuarter };
