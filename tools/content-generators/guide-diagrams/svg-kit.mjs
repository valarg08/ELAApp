// Generates the PSAT geometry study-guide diagrams (original drawings) into the dir given as argv[2].
import fs from 'node:fs';
import path from 'node:path';

export let out = process.argv[2];

export const STYLE = `<style>
.l{stroke:#334155;stroke-width:2;fill:none;stroke-linejoin:round}
.d{stroke:#334155;stroke-width:1.5;fill:none;stroke-dasharray:5 4}
.a{stroke:#0d9488;stroke-width:3;fill:none;stroke-linejoin:round}
.h{stroke:#ea580c;stroke-width:3.5;fill:none;stroke-linejoin:round;stroke-linecap:round}
.v{stroke:#7c3aed;stroke-width:3;fill:none;stroke-linejoin:round}
.b{stroke:#2563eb;stroke-width:3;fill:none;stroke-linejoin:round}
.g{stroke:#cbd5e1;stroke-width:1}
.ax{stroke:#64748b;stroke-width:1.5}
.fa{fill:#0d9488;fill-opacity:.14}
.fh{fill:#ea580c;fill-opacity:.16}
.fv{fill:#7c3aed;fill-opacity:.12}
.fb{fill:#2563eb;fill-opacity:.12}
.dot{fill:#334155}
text{font:15px system-ui,-apple-system,'Segoe UI',sans-serif;fill:#334155}
.t{font-weight:700;font-size:15px}
.s{font-size:13px;fill:#64748b}
.ht{fill:#c2410c;font-weight:700}
.at{fill:#0f766e;font-weight:700}
.vt{fill:#6d28d9;font-weight:700}
.bt{fill:#1d4ed8;font-weight:700}
@media (prefers-color-scheme:dark){
.l,.d{stroke:#cbd5e1}.dot{fill:#cbd5e1}text{fill:#e2e8f0}.s{fill:#94a3b8}
.a{stroke:#2dd4bf}.h{stroke:#fb923c}.v{stroke:#a78bfa}.b{stroke:#60a5fa}
.g{stroke:#334155}.ax{stroke:#94a3b8}
.ht{fill:#fb923c}.at{fill:#2dd4bf}.vt{fill:#a78bfa}.bt{fill:#60a5fa}}
</style>`;

export const svg = (name, w, h, title, body) => {
  const s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${title}">
<title>${title}</title>
${STYLE}
${body}
</svg>
`;
  fs.writeFileSync(path.join(out, `${name}.svg`), s);
};

export const r1 = (n) => Math.round(n * 10) / 10;
export const pt = (cx, cy, r, deg) => [
  r1(cx + r * Math.cos((deg * Math.PI) / 180)),
  r1(cy + r * Math.sin((deg * Math.PI) / 180)),
];
/** An angle arc at (cx, cy) from direction a1 to a2 (degrees, SVG's clockwise-from-x), the short way. */
export const arc = (cx, cy, r, a1, a2, cls = 'h') => {
  let d = a2 - a1;
  while (d > 180) d -= 360;
  while (d < -180) d += 360;
  const [x1, y1] = pt(cx, cy, r, a1);
  const [x2, y2] = pt(cx, cy, r, a1 + d);
  return `<path class="${cls}" d="M${x1},${y1} A${r},${r} 0 0 ${d > 0 ? 1 : 0} ${x2},${y2}"/>`;
};
export const dir = (x1, y1, x2, y2) => (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
/** Arc for the angle at vertex V between rays to P and Q. */
export const angleAt = (V, P, Q, r, cls = 'h') =>
  arc(V[0], V[1], r, dir(...V, ...P), dir(...V, ...Q), cls);
export const label = (V, P, Q, r, text, cls = 'ht') => {
  let a1 = dir(...V, ...P);
  let d = dir(...V, ...Q) - a1;
  while (d > 180) d -= 360;
  while (d < -180) d += 360;
  const [x, y] = pt(V[0], V[1], r, a1 + d / 2);
  return `<text class="${cls}" x="${x}" y="${y + 5}" text-anchor="middle">${text}</text>`;
};
export const poly = (pts, cls) =>
  `<polygon class="${cls}" points="${pts.map((p) => p.join(',')).join(' ')}"/>`;
export const line = (A, B, cls = 'l') =>
  `<line class="${cls}" x1="${A[0]}" y1="${A[1]}" x2="${B[0]}" y2="${B[1]}"/>`;
export const text = (x, y, s, cls = '', anchor = 'middle') =>
  `<text${cls ? ` class="${cls}"` : ''} x="${x}" y="${y}" text-anchor="${anchor}">${s}</text>`;
export const tick = (A, B, n = 1) => {
  const mx = (A[0] + B[0]) / 2,
    my = (A[1] + B[1]) / 2;
  const L = Math.hypot(B[0] - A[0], B[1] - A[1]);
  const ux = (B[0] - A[0]) / L,
    uy = (B[1] - A[1]) / L;
  let s = '';
  for (let i = 0; i < n; i++) {
    const o = (i - (n - 1) / 2) * 6;
    const cx = mx + ux * o,
      cy = my + uy * o;
    s += line([r1(cx - uy * 8), r1(cy + ux * 8)], [r1(cx + uy * 8), r1(cy - ux * 8)], 'l');
  }
  return s;
};
export const chevron = (x, y) =>
  `<path class="l" d="M${x - 5},${y - 6} L${x + 3},${y} L${x - 5},${y + 6}"/>`;
export const square = (V, ux, uy, s = 12) =>
  `<path class="l" d="M${V[0] + ux[0] * s},${V[1] + ux[1] * s} L${V[0] + (ux[0] + uy[0]) * s},${V[1] + (ux[1] + uy[1]) * s} L${V[0] + uy[0] * s},${V[1] + uy[1] * s}"/>`;
export const shift = (P, dx, dy = 0) => [P[0] + dx, P[1] + dy];
