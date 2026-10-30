import type { FigLabel, Figure, FigSeg, Pt } from './guide-problem';

/** Small builders for problem figures (guide-problem.ts `Figure`), shared by the guides' figure maps. */

export type PolyFig = Extract<Figure, { kind: 'poly' }>;
export type CircleFig = Extract<Figure, { kind: 'circle' }>;
export type GridFig = Extract<Figure, { kind: 'grid' }>;

export const d = (deg: number, r = 1): Pt => [
  r * Math.cos((deg * Math.PI) / 180),
  r * Math.sin((deg * Math.PI) / 180),
];
export const minus = (n: number) => String(n).replace('-', '−');
export const at = (p: Pt) => `(${minus(p[0])}, ${minus(p[1])})`;

/** A right triangle with the right angle at the bottom left. Sides: bottom, hypotenuse, left. */
export const rt = (a: number, b: number, s: string[], more: Partial<PolyFig> = {}): Figure => ({
  kind: 'poly',
  pts: [
    [0, 0],
    [a, 0],
    [0, b],
  ],
  right: [0],
  s,
  ...more,
});
/** A rectangle. Sides: bottom, right, top, left. */
export const rect = (w: number, h: number, s: string[], more: Partial<PolyFig> = {}): Figure => ({
  kind: 'poly',
  pts: [
    [0, 0],
    [w, 0],
    [w, h],
    [0, h],
  ],
  s,
  ...more,
});
/** A triangle or any polygon from its corners. */
export const poly = (pts: Pt[], more: Partial<PolyFig> = {}): Figure => ({
  kind: 'poly',
  pts,
  ...more,
});
export const diag = (label: string, from = 0, to = 2): FigSeg => ({ from, to, dash: true, label });
export const reg = (n: number, r = 3): Pt[] =>
  Array.from({ length: n }, (_, i) => d(90 + (360 * i) / n, r));

/** A triangle whose base is horizontal with the altitude from the apex to the base. */
export const isos = (
  half: number,
  h: number,
  s: string[],
  label: string,
  more: Partial<PolyFig> = {},
): Figure =>
  poly(
    [
      [-half, 0],
      [half, 0],
      [0, h],
    ],
    {
      s,
      ticks: [0, 1, 1],
      segs: [{ from: 2, to: [0, 0], dash: true, label }],
      marks: [
        [
          [0, 0],
          [half, 0],
          [0, h],
        ],
      ],
      ...more,
    },
  );

export const ang = (
  marks: { from: number; to: number; text: string }[],
  o: { lines?: number[]; rays?: number[] } = {},
): Figure => ({
  kind: 'angles',
  ...o,
  marks,
});
export const mk = (from: number, to: number, text: string) => ({ from, to, text });
export const trans = (
  angle: number,
  marks: Extract<Figure, { kind: 'transversal' }>['marks'],
): Figure => ({ kind: 'transversal', angle, marks });

/** Points, a segment or a shape on a coordinate grid that fits them. */
export const grid = (
  points: Pt[],
  o: {
    names?: string[];
    shape?: boolean;
    join?: boolean;
    hide?: boolean[];
    extra?: Partial<GridFig>;
  } = {},
): Figure => {
  const xs = points.map((p) => p[0]).concat(0);
  const ys = points.map((p) => p[1]).concat(0);
  return {
    kind: 'grid',
    x: [Math.floor(Math.min(...xs)) - 1, Math.ceil(Math.max(...xs)) + 1],
    y: [Math.floor(Math.min(...ys)) - 1, Math.ceil(Math.max(...ys)) + 1],
    pts: points.map((p, i) => ({
      at: p,
      label: o.hide?.[i] ? undefined : (o.names?.[i] ?? at(p)),
    })),
    ...(o.shape
      ? { shapes: [{ pts: points }] }
      : o.join === false
        ? {}
        : points.length > 1
          ? { lines: [{ pts: points }] }
          : {}),
    ...o.extra,
  };
};

export const circ = (
  p: Record<string, Pt>,
  segs: CircleFig['segs'],
  more: Partial<CircleFig> = {},
): Figure => ({
  kind: 'circle',
  p: { O: [0, 0], ...p },
  segs,
  ...more,
});
/** A chord AB at the bottom with C above: the angle at the centre and at the circumference. */
export const inscribed = (
  a: number,
  b: number,
  t: FigLabel[],
  more: Partial<CircleFig> = {},
): Figure =>
  circ(
    { A: d(a), B: d(b), C: d(90) },
    [
      { from: 'O', to: 'A' },
      { from: 'O', to: 'B' },
      { from: 'C', to: 'A' },
      { from: 'C', to: 'B' },
    ],
    { t, ...more },
  );
export const radius = (label: string): Figure =>
  circ({ _A: d(0) }, [{ from: 'O', to: '_A', label }]);
export const diameter = (label: string): Figure =>
  circ({ _A: d(180), _B: d(0) }, [{ from: '_A', to: '_B', label }]);
export const solid = (kind: 'box', l: string, w: string, h: string): Figure => ({ kind, l, w, h });
export const box = (l: string, w: string, h: string) => solid('box', l, w, h);
export const cyl = (r: string | undefined, h: string, dd?: string): Figure => ({
  kind: 'cyl',
  ...(r ? { r } : {}),
  ...(dd ? { d: dd } : {}),
  h,
});
export const sq = (n: string, more: Partial<PolyFig> = {}) => rect(4, 4, [n, n, n, n], more);
