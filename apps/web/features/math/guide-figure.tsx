import type { FigLabel, Figure, FigSeg, Pt } from './guide-problem';

const W = 320;
const H = 210;
const PAD = 34;

type Mapper = (p: Pt) => Pt;

/** Fits points (y up) into the frame, keeping the shape's proportions. */
function fit(points: Pt[], pad = PAD): { map: Mapper; scale: number } {
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const x0 = Math.min(...xs);
  const y0 = Math.min(...ys);
  const dx = Math.max(Math.max(...xs) - x0, 1e-6);
  const dy = Math.max(Math.max(...ys) - y0, 1e-6);
  const scale = Math.min((W - 2 * pad) / dx, (H - 2 * pad) / dy);
  const ox = (W - scale * dx) / 2 - scale * x0;
  const oy = (H + scale * dy) / 2 + scale * y0;
  return { map: (p) => [ox + scale * p[0], oy - scale * p[1]], scale };
}

const unit = (a: Pt, b: Pt): Pt => {
  const n = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  return [(b[0] - a[0]) / n, (b[1] - a[1]) / n];
};
const away = (p: Pt, from: Pt, d: number): Pt => {
  const u = unit(from, p);
  return [p[0] + u[0] * d, p[1] + u[1] * d];
};
/** Moves a label out from the centre far enough that its text clears the line it names. */
const outside = (p: Pt, from: Pt, text: string): Pt => {
  const u = unit(from, p);
  const d = text.length * 3.6 * Math.abs(u[0]) + 8 * Math.abs(u[1]) + 5;
  return [p[0] + u[0] * d, p[1] + u[1] * d];
};
/** A label beside a segment: on the side away from `from`, or above it when the segment runs through it. */
const beside = (a: Pt, b: Pt, from: Pt, text: string): Pt => {
  const u = unit(a, b);
  let n: Pt = [-u[1], u[0]];
  const m: Pt = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const side = n[0] * (m[0] - from[0]) + n[1] * (m[1] - from[1]);
  if (Math.abs(side) > 4 ? side < 0 : n[1] > 0) n = [-n[0], -n[1]];
  const d = text.length * 3.6 * Math.abs(n[0]) + 8 * Math.abs(n[1]) + 4;
  return [m[0] + n[0] * d, m[1] + n[1] * d];
};
const rad = (deg: number) => (deg * Math.PI) / 180;
const f = (n: number) => Math.round(n * 10) / 10;

function Txt({ at, children, size = 14 }: { at: Pt; children: string; size?: number }) {
  return (
    <text
      x={f(at[0])}
      y={f(at[1])}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={size}
      fill="currentColor"
      stroke="var(--color-card, #fff)"
      strokeWidth={4}
      paintOrder="stroke"
    >
      {children}
    </text>
  );
}

function Line({ a, b, dash, bold }: { a: Pt; b: Pt; dash?: boolean; bold?: boolean }) {
  return (
    <line
      x1={f(a[0])}
      y1={f(a[1])}
      x2={f(b[0])}
      y2={f(b[1])}
      strokeWidth={bold ? 2.2 : 1.6}
      strokeDasharray={dash ? '5 4' : undefined}
    />
  );
}

/** A small square at `at` between the directions toward `a` and `b`. */
function RightMark({ at, a, b }: { at: Pt; a: Pt; b: Pt }) {
  const u = unit(at, a);
  const w = unit(at, b);
  const s = 9;
  const p1: Pt = [at[0] + u[0] * s, at[1] + u[1] * s];
  const p3: Pt = [at[0] + w[0] * s, at[1] + w[1] * s];
  const p2: Pt = [p1[0] + w[0] * s, p1[1] + w[1] * s];
  return (
    <polyline
      points={`${f(p1[0])},${f(p1[1])} ${f(p2[0])},${f(p2[1])} ${f(p3[0])},${f(p3[1])}`}
      fill="none"
      strokeWidth={1.3}
    />
  );
}

function Ticks({ a, b, n }: { a: Pt; b: Pt; n: number }) {
  const m: Pt = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const u = unit(a, b);
  const nx = -u[1];
  const ny = u[0];
  return (
    <>
      {Array.from({ length: n }, (_, k) => {
        const o = (k - (n - 1) / 2) * 5;
        const cx = m[0] + u[0] * o;
        const cy = m[1] + u[1] * o;
        return (
          <line
            key={k}
            x1={f(cx - nx * 5)}
            y1={f(cy - ny * 5)}
            x2={f(cx + nx * 5)}
            y2={f(cy + ny * 5)}
            strokeWidth={1.5}
          />
        );
      })}
    </>
  );
}

const point = (p: Pt | number, pts: Pt[]): Pt => (typeof p === 'number' ? pts[p]! : p);

function FreeLabels({ t, map }: { t?: FigLabel[]; map: Mapper }) {
  return (
    <>
      {t?.map((l, i) => (
        <Txt key={i} at={map([l[0], l[1]])}>
          {l[2]}
        </Txt>
      ))}
    </>
  );
}

function Poly({ fig }: { fig: Extract<Figure, { kind: 'poly' }> }) {
  const segPts = (fig.segs ?? []).flatMap((s: FigSeg) => [
    point(s.from, fig.pts),
    point(s.to, fig.pts),
  ]);
  const circ = fig.circ;
  const { map, scale } = fit([
    ...fig.pts,
    ...segPts,
    ...(fig.t ?? []).map((l): Pt => [l[0], l[1]]),
    ...(circ
      ? ([
          [circ.at[0] - circ.r, circ.at[1] - circ.r],
          [circ.at[0] + circ.r, circ.at[1] + circ.r],
        ] as Pt[])
      : []),
  ]);
  const P = fig.pts.map(map);
  const n = P.length;
  const c: Pt = [P.reduce((s, p) => s + p[0], 0) / n, P.reduce((s, p) => s + p[1], 0) / n];
  const edges = fig.open ? n - 1 : n;
  return (
    <>
      <g className="text-brand" stroke="currentColor" fill="none">
        {fig.open ? (
          <polyline points={P.map((p) => `${f(p[0])},${f(p[1])}`).join(' ')} strokeWidth={2.2} />
        ) : (
          <polygon
            points={P.map((p) => `${f(p[0])},${f(p[1])}`).join(' ')}
            strokeWidth={2.2}
            fill="currentColor"
            fillOpacity={0.07}
          />
        )}
        {Array.from({ length: edges }, (_, i) => {
          const t = fig.ticks?.[i];
          return t ? <Ticks key={i} a={P[i]!} b={P[(i + 1) % n]!} n={t} /> : null;
        })}
        {circ && (
          <circle
            cx={f(map(circ.at)[0])}
            cy={f(map(circ.at)[1])}
            r={f(scale * circ.r)}
            strokeWidth={2}
          />
        )}
        {fig.right?.map((i) => (
          <RightMark key={i} at={P[i]!} a={P[(i + n - 1) % n]!} b={P[(i + 1) % n]!} />
        ))}
        {fig.marks?.map((m, i) => (
          <RightMark key={i} at={map(m[0])} a={map(m[1])} b={map(m[2])} />
        ))}
      </g>
      <g stroke="currentColor" className="text-muted">
        {fig.segs?.map((s, i) => (
          <Line
            key={i}
            a={map(point(s.from, fig.pts))}
            b={map(point(s.to, fig.pts))}
            dash={s.dash}
          />
        ))}
      </g>
      {fig.segs?.map((s, i) => {
        if (!s.label) return null;
        const a = map(point(s.from, fig.pts));
        const b = map(point(s.to, fig.pts));
        return (
          <Txt key={i} at={beside(a, b, c, s.label)}>
            {s.label}
          </Txt>
        );
      })}
      {fig.s?.map((label, i) => {
        if (!label || i >= edges) return null;
        const a = P[i]!;
        const b = P[(i + 1) % n]!;
        return (
          <Txt key={i} at={outside([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], c, label)}>
            {label}
          </Txt>
        );
      })}
      {fig.v?.map((label, i) =>
        label ? (
          <Txt key={i} at={away(P[i]!, c, 14)}>
            {label}
          </Txt>
        ) : null,
      )}
      {fig.a?.map((label, i) => {
        if (!label) return null;
        const v = P[i]!;
        const u = unit(v, c);
        return (
          <Txt key={i} at={[v[0] + u[0] * 30, v[1] + u[1] * 30]} size={12}>
            {label}
          </Txt>
        );
      })}
      <FreeLabels t={fig.t} map={map} />
    </>
  );
}

function Angles({ fig }: { fig: Extract<Figure, { kind: 'angles' }> }) {
  const cx = W / 2;
  const cy = H / 2;
  const R = 84;
  const at = (deg: number, r: number): Pt => [
    cx + r * Math.cos(rad(deg)),
    cy - r * Math.sin(rad(deg)),
  ];
  return (
    <>
      <g className="text-brand" stroke="currentColor" fill="none">
        {fig.lines?.map((d, i) => (
          <Line key={`l${i}`} a={at(d, R)} b={at(d + 180, R)} bold />
        ))}
        {fig.rays?.map((d, i) => (
          <Line key={`r${i}`} a={[cx, cy]} b={at(d, R)} bold />
        ))}
        {fig.marks?.map((m, i) => {
          const r = 24 + (i % 2) * 12;
          const ext = (((m.to - m.from) % 360) + 360) % 360;
          const a = at(m.from, r);
          const b = at(m.to, r);
          return (
            <path
              key={i}
              d={`M ${f(a[0])} ${f(a[1])} A ${r} ${r} 0 ${ext > 180 ? 1 : 0} 0 ${f(b[0])} ${f(b[1])}`}
              strokeWidth={1.4}
            />
          );
        })}
      </g>
      {fig.marks?.map((m, i) => {
        const r = 24 + (i % 2) * 12;
        const ext = (((m.to - m.from) % 360) + 360) % 360;
        return (
          <Txt key={i} at={at(m.from + ext / 2, r + 16)} size={13}>
            {m.text}
          </Txt>
        );
      })}
      <FreeLabels t={fig.t} map={(p) => [cx + p[0] * R, cy - p[1] * R]} />
    </>
  );
}

function Transversal({ fig }: { fig: Extract<Figure, { kind: 'transversal' }> }) {
  const yTop = 75;
  const yBot = 140;
  const mid = (yTop + yBot) / 2;
  const tan = Math.tan(rad(fig.angle));
  const xAt = (y: number) => W / 2 + (mid - y) / tan;
  const cross = { top: [xAt(yTop), yTop] as Pt, bottom: [xAt(yBot), yBot] as Pt };
  const dirs = [fig.angle / 2, (fig.angle + 180) / 2, 180 + fig.angle / 2, (fig.angle + 540) / 2];
  return (
    <>
      <g className="text-brand" stroke="currentColor" fill="none" strokeWidth={2}>
        <Line a={[18, yTop]} b={[W - 18, yTop]} bold />
        <Line a={[18, yBot]} b={[W - 18, yBot]} bold />
        <Line a={[xAt(yTop - 40), yTop - 40]} b={[xAt(yBot + 40), yBot + 40]} bold />
        {[yTop, yBot].map((y) => (
          <polyline
            key={y}
            points={`${W - 62},${y - 5} ${W - 54},${y} ${W - 62},${y + 5}`}
            strokeWidth={1.6}
          />
        ))}
      </g>
      {fig.marks.map((m, i) => {
        const p = cross[m.line];
        const d = dirs[m.quad - 1]!;
        return (
          <Txt key={i} at={[p[0] + 28 * Math.cos(rad(d)), p[1] - 28 * Math.sin(rad(d))]}>
            {m.text}
          </Txt>
        );
      })}
    </>
  );
}

function CircleFig({ fig }: { fig: Extract<Figure, { kind: 'circle' }> }) {
  const r = fig.r ?? 1;
  const extent: Pt[] = [
    [-r, -r],
    [r, r],
    ...Object.values(fig.p),
    ...(fig.t ?? []).map((l): Pt => [l[0], l[1]]),
  ];
  const { map, scale } = fit(extent, 30);
  const C = map([0, 0]);
  const names = Object.keys(fig.p).filter((k) => !k.startsWith('_'));
  return (
    <>
      <g className="text-brand" stroke="currentColor" fill="none">
        {fig.shade &&
          (() => {
            const a = fig.shade[0];
            const b = fig.shade[1];
            const p1: Pt = [
              C[0] + scale * r * Math.cos(rad(a)),
              C[1] - scale * r * Math.sin(rad(a)),
            ];
            const p2: Pt = [
              C[0] + scale * r * Math.cos(rad(b)),
              C[1] - scale * r * Math.sin(rad(b)),
            ];
            const ext = (((b - a) % 360) + 360) % 360;
            return (
              <path
                d={`M ${f(C[0])} ${f(C[1])} L ${f(p1[0])} ${f(p1[1])} A ${scale * r} ${scale * r} 0 ${ext > 180 ? 1 : 0} 0 ${f(p2[0])} ${f(p2[1])} Z`}
                fill="currentColor"
                fillOpacity={0.15}
                stroke="none"
              />
            );
          })()}
        {!fig.noCircle && <circle cx={f(C[0])} cy={f(C[1])} r={f(scale * r)} strokeWidth={2.2} />}
        {fig.right?.map((m, i) => (
          <RightMark key={i} at={map(fig.p[m[0]]!)} a={map(fig.p[m[1]]!)} b={map(fig.p[m[2]]!)} />
        ))}
      </g>
      <g stroke="currentColor" className="text-brand">
        {fig.segs?.map((s, i) => (
          <Line key={i} a={map(fig.p[s.from]!)} b={map(fig.p[s.to]!)} dash={s.dash} bold />
        ))}
        {names.map((k) => {
          const p = map(fig.p[k]!);
          return (
            <circle key={k} cx={f(p[0])} cy={f(p[1])} r={2.6} fill="currentColor" stroke="none" />
          );
        })}
      </g>
      {fig.segs?.map((s, i) => {
        if (!s.label) return null;
        const a = map(fig.p[s.from]!);
        const b = map(fig.p[s.to]!);
        return (
          <Txt key={i} at={beside(a, b, C, s.label)}>
            {s.label}
          </Txt>
        );
      })}
      {names.map((k) => {
        const p = map(fig.p[k]!);
        const near = Math.hypot(p[0] - C[0], p[1] - C[1]) < 6;
        return (
          <Txt key={k} at={near ? [p[0] + 11, p[1] + 11] : away(p, C, 13)}>
            {k}
          </Txt>
        );
      })}
      <FreeLabels t={fig.t} map={map} />
    </>
  );
}

const nice = (span: number) => [1, 2, 5, 10, 20, 50].find((n) => span / n <= 12) ?? 100;

function Grid({ fig }: { fig: Extract<Figure, { kind: 'grid' }> }) {
  const [x0, x1] = fig.x;
  const [y0, y1] = fig.y;
  const pad = 24;
  const scX0 = (W - 2 * pad) / (x1 - x0);
  const scY0 = (H - 2 * pad) / (y1 - y0);
  const scX = fig.free ? scX0 : Math.min(scX0, scY0);
  const scY = fig.free ? scY0 : Math.min(scX0, scY0);
  const ox = (W - scX * (x1 - x0)) / 2;
  const oy = (H - scY * (y1 - y0)) / 2;
  const map: Mapper = (p) => [ox + scX * (p[0] - x0), H - oy - scY * (p[1] - y0)];
  // Grid lines and numbers every 1, 2, 5, 10… so that about a dozen fit across.
  const stepX = nice(x1 - x0);
  const stepY = nice(y1 - y0);
  const xs = Array.from({ length: Math.floor((x1 - x0) / stepX) + 1 }, (_, i) => x0 + i * stepX);
  const ys = Array.from({ length: Math.floor((y1 - y0) / stepY) + 1 }, (_, i) => y0 + i * stepY);
  const zero = map([0, 0]);
  return (
    <>
      <g stroke="currentColor" className="text-muted" opacity={0.28} strokeWidth={1}>
        {xs.map((x) => (
          <Line key={`x${x}`} a={map([x, y0])} b={map([x, y1])} />
        ))}
        {ys.map((y) => (
          <Line key={`y${y}`} a={map([x0, y])} b={map([x1, y])} />
        ))}
      </g>
      <g stroke="currentColor" strokeWidth={1.6}>
        {x0 <= 0 && x1 >= 0 && <Line a={map([0, y0])} b={map([0, y1])} />}
        {y0 <= 0 && y1 >= 0 && <Line a={map([x0, 0])} b={map([x1, 0])} />}
      </g>
      {xs
        .filter((x) => x !== 0)
        .map((x) => (
          <Txt
            key={`tx${x}`}
            at={[map([x, 0])[0], Math.min(Math.max(zero[1], 0), H - 2) + 11]}
            size={10}
          >
            {String(x)}
          </Txt>
        ))}
      {ys
        .filter((y) => y !== 0)
        .map((y) => (
          <Txt key={`ty${y}`} at={[Math.max(zero[0], 0) - 11, map([0, y])[1]]} size={10}>
            {String(y)}
          </Txt>
        ))}
      <g className="text-brand" stroke="currentColor" fill="none">
        {fig.fn?.map((l, i) => {
          // Keep the line inside the grid: the x range where y stays between y0 and y1.
          let xa = x0;
          let xb = x1;
          if (l.m !== 0) {
            const lo = Math.min((y0 - l.b) / l.m, (y1 - l.b) / l.m);
            const hi = Math.max((y0 - l.b) / l.m, (y1 - l.b) / l.m);
            xa = Math.max(x0, lo);
            xb = Math.min(x1, hi);
          }
          if (xa >= xb) return null;
          return (
            <Line key={`f${i}`} a={map([xa, l.m * xa + l.b])} b={map([xb, l.m * xb + l.b])} bold />
          );
        })}
        {fig.quad?.map((q, i) => {
          const steps = 120;
          let d = '';
          let pen = false;
          for (let k = 0; k <= steps; k++) {
            const x = x0 + ((x1 - x0) * k) / steps;
            const y = q.a * x * x + q.b * x + q.c;
            if (y < y0 || y > y1) {
              pen = false;
              continue;
            }
            const m = map([x, y]);
            d += `${pen ? 'L' : 'M'} ${f(m[0])} ${f(m[1])} `;
            pen = true;
          }
          return <path key={`q${i}`} d={d} strokeWidth={2.2} />;
        })}
        {fig.shapes?.map((s, i) => (
          <polygon
            key={`s${i}`}
            points={s.pts.map((p) => map(p).map(f).join(',')).join(' ')}
            strokeWidth={2.2}
            strokeDasharray={s.dash ? '5 4' : undefined}
            fill="currentColor"
            fillOpacity={0.08}
          />
        ))}
        {fig.lines?.map((l, i) => (
          <polyline
            key={`l${i}`}
            points={l.pts.map((p) => map(p).map(f).join(',')).join(' ')}
            strokeWidth={2.2}
            strokeDasharray={l.dash ? '5 4' : undefined}
          />
        ))}
        {fig.pts?.map((p, i) => {
          const m = map(p.at);
          return (
            <circle
              key={`p${i}`}
              cx={f(m[0])}
              cy={f(m[1])}
              r={3.4}
              fill="currentColor"
              stroke="none"
            />
          );
        })}
      </g>
      {fig.fn?.map((l, i) => {
        if (!l.label) return null;
        const xm = x1 - (x1 - x0) * 0.12 * (i + 1);
        const yv = l.m * xm + l.b;
        const m = map([xm, Math.min(Math.max(yv, y0), y1)]);
        return (
          <Txt key={`fl${i}`} at={[m[0], m[1] - 12]} size={12}>
            {l.label}
          </Txt>
        );
      })}
      {fig.quad?.map((q, i) => {
        if (!q.label) return null;
        // Label in the open space: above an upward parabola's bowl, below a downward one's cap.
        const m = map([(x0 + x1) / 2, q.a > 0 ? y1 - (y1 - y0) * 0.07 : y0 + (y1 - y0) * 0.07]);
        return (
          <Txt key={`ql${i}`} at={m} size={12}>
            {q.label}
          </Txt>
        );
      })}
      {fig.pts?.map((p, i) => {
        if (!p.label) return null;
        const m = map(p.at);
        return (
          <Txt key={`pl${i}`} at={[m[0] + 4, m[1] - 13]} size={12}>
            {p.label}
          </Txt>
        );
      })}
      {fig.shapes?.map((s, i) => {
        if (!s.label) return null;
        const m = s.pts.reduce<Pt>(
          (a, p) => [a[0] + p[0] / s.pts.length, a[1] + p[1] / s.pts.length],
          [0, 0],
        );
        return (
          <Txt key={`sl${i}`} at={map(m)} size={12}>
            {s.label}
          </Txt>
        );
      })}
      {fig.lines?.map((l, i) => {
        if (!l.label) return null;
        const a = map(l.pts[0]!);
        const b = map(l.pts[l.pts.length - 1]!);
        return (
          <Txt key={`ll${i}`} at={[(a[0] + b[0]) / 2 + 4, (a[1] + b[1]) / 2 - 12]} size={12}>
            {l.label}
          </Txt>
        );
      })}
      <FreeLabels t={fig.t} map={map} />
    </>
  );
}

function NumLine({ fig }: { fig: Extract<Figure, { kind: 'numline' }> }) {
  const y = H / 2;
  const x = (v: number) => 24 + ((W - 48) * (v - fig.min)) / (fig.max - fig.min);
  const nums = Array.from({ length: fig.max - fig.min + 1 }, (_, i) => fig.min + i);
  const stepLabel = nums.length > 14 ? 2 : 1;
  return (
    <>
      <g className="text-brand" stroke="currentColor" fill="none">
        <Line a={[14, y]} b={[W - 14, y]} bold />
        {fig.ray && (
          <rect
            x={fig.ray.dir === 1 ? x(fig.ray.from) : 14}
            y={y - 4}
            width={fig.ray.dir === 1 ? W - 14 - x(fig.ray.from) : x(fig.ray.from) - 14}
            height={8}
            fill="currentColor"
            fillOpacity={0.3}
            stroke="none"
          />
        )}
      </g>
      <g stroke="currentColor">
        {nums.map((n) => (
          <Line key={n} a={[x(n), y - 6]} b={[x(n), y + 6]} />
        ))}
      </g>
      {nums
        .filter((n) => (n - fig.min) % stepLabel === 0)
        .map((n) => (
          <Txt key={n} at={[x(n), y + 22]} size={12}>
            {String(n)}
          </Txt>
        ))}
      <g className="text-brand">
        {fig.dots?.map((d, i) => (
          <circle
            key={i}
            cx={f(x(d.at))}
            cy={y}
            r={6}
            fill={d.open ? 'var(--color-card, #fff)' : 'currentColor'}
            stroke="currentColor"
            strokeWidth={2}
          />
        ))}
      </g>
      {fig.dots?.map((d, i) =>
        d.label ? (
          <Txt key={i} at={[x(d.at), y - 24]}>
            {d.label}
          </Txt>
        ) : null,
      )}
    </>
  );
}

/** A box drawn in oblique view, with labels on length, width and height. */
function Box({ fig }: { fig: Extract<Figure, { kind: 'box' }> }) {
  const x = 60;
  const y = 70;
  const cube = fig.l === fig.w && fig.w === fig.h;
  const w = cube ? 96 : 130;
  const h = cube ? 96 : 85;
  const dx = cube ? 46 : 60;
  const dy = cube ? -30 : -38;
  const front = `${x},${y} ${x + w},${y} ${x + w},${y + h} ${x},${y + h}`;
  return (
    <>
      <g className="text-brand" stroke="currentColor" fill="none" strokeWidth={2}>
        <polygon
          points={`${x},${y} ${x + dx},${y + dy} ${x + w + dx},${y + dy} ${x + w},${y}`}
          fill="currentColor"
          fillOpacity={0.12}
        />
        <polygon
          points={`${x + w},${y} ${x + w + dx},${y + dy} ${x + w + dx},${y + h + dy} ${x + w},${y + h}`}
          fill="currentColor"
          fillOpacity={0.2}
        />
        <polygon points={front} fill="currentColor" fillOpacity={0.06} />
      </g>
      {fig.l && <Txt at={[x + w / 2, y + h + 15]}>{fig.l}</Txt>}
      {fig.h && <Txt at={[x - 14, y + h / 2]}>{fig.h}</Txt>}
      {fig.w && <Txt at={[x + w + dx / 2 + 14, y + h + dy / 2 + 14]}>{fig.w}</Txt>}
    </>
  );
}

function Cyl({ fig }: { fig: Extract<Figure, { kind: 'cyl' }> }) {
  const cx = 130;
  const rx = 60;
  const ry = 18;
  const top = 55;
  const bot = 150;
  return (
    <>
      <g className="text-brand" stroke="currentColor" fill="none" strokeWidth={2}>
        <path
          d={`M ${cx - rx} ${top} L ${cx - rx} ${bot} A ${rx} ${ry} 0 0 0 ${cx + rx} ${bot} L ${cx + rx} ${top}`}
          fill="currentColor"
          fillOpacity={0.08}
        />
        <ellipse cx={cx} cy={top} rx={rx} ry={ry} fill="currentColor" fillOpacity={0.15} />
        <path
          d={`M ${cx - rx} ${bot} A ${rx} ${ry} 0 0 1 ${cx + rx} ${bot}`}
          strokeDasharray="5 4"
          strokeWidth={1.4}
        />
        {(fig.r || fig.d) && <Line a={[cx, top]} b={[cx + (fig.d ? -rx : rx), top]} bold />}
        {fig.d && <Line a={[cx, top]} b={[cx + rx, top]} bold />}
      </g>
      {fig.r && <Txt at={[cx + rx / 2, top - 10]}>{fig.r}</Txt>}
      {fig.d && <Txt at={[cx, top - 12]}>{fig.d}</Txt>}
      {fig.h && <Txt at={[cx + rx + 18, (top + bot) / 2]}>{fig.h}</Txt>}
    </>
  );
}

/** The words an assistive reader hears for a figure: its labels. */
function altText(fig: Figure): string {
  const bits: string[] = [];
  const add = (s?: string) => s && bits.push(s);
  switch (fig.kind) {
    case 'poly':
      fig.v?.forEach(add);
      fig.s?.forEach(add);
      fig.a?.forEach(add);
      fig.segs?.forEach((s) => add(s.label));
      fig.t?.forEach((l) => add(l[2]));
      break;
    case 'angles':
      fig.marks?.forEach((m) => add(m.text));
      fig.t?.forEach((l) => add(l[2]));
      break;
    case 'transversal':
      fig.marks.forEach((m) => add(m.text));
      break;
    case 'circle':
      Object.keys(fig.p).forEach(add);
      fig.segs?.forEach((s) => add(s.label));
      fig.t?.forEach((l) => add(l[2]));
      break;
    case 'grid':
      fig.pts?.forEach((p) => add(p.label));
      fig.fn?.forEach((l) => add(l.label));
      fig.quad?.forEach((q) => add(q.label));
      fig.shapes?.forEach((s) => add(s.label));
      fig.lines?.forEach((l) => add(l.label));
      fig.t?.forEach((l) => add(l[2]));
      break;
    case 'numline':
      fig.dots?.forEach((d) => add(d.label));
      break;
    case 'box':
      add(fig.l);
      add(fig.w);
      add(fig.h);
      break;
    case 'cyl':
      add(fig.r);
      add(fig.d);
      add(fig.h);
      break;
  }
  const names: Record<Figure['kind'], string> = {
    poly: 'Shape',
    angles: 'Angles at a point',
    transversal: 'Parallel lines cut by a crossing line',
    circle: 'Circle',
    grid: 'Coordinate grid',
    numline: 'Number line',
    box: 'Box',
    cyl: 'Cylinder',
  };
  return `${names[fig.kind]}${bits.length ? `, labelled ${bits.join(', ')}` : ''}. The question gives the same facts in words.`;
}

/** A problem's picture (guide-problem.ts `Figure`), drawn as an inline SVG that follows the theme. */
export function ProblemFigure({ fig }: { fig: Figure }) {
  return (
    <figure className="mt-3 max-w-xs">
      <figcaption className="sr-only">{altText(fig)}</figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        aria-hidden="true"
        className="h-auto w-full rounded-xl border border-border bg-card"
      >
        {fig.kind === 'poly' && <Poly fig={fig} />}
        {fig.kind === 'angles' && <Angles fig={fig} />}
        {fig.kind === 'transversal' && <Transversal fig={fig} />}
        {fig.kind === 'circle' && <CircleFig fig={fig} />}
        {fig.kind === 'grid' && <Grid fig={fig} />}
        {fig.kind === 'numline' && <NumLine fig={fig} />}
        {fig.kind === 'box' && <Box fig={fig} />}
        {fig.kind === 'cyl' && <Cyl fig={fig} />}
      </svg>
    </figure>
  );
}
