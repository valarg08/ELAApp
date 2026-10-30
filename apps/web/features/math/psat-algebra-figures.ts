import { box, poly, rect } from './guide-figure-kit';
import type { Figure, FigureMap, Pt } from './guide-problem';

/**
 * Pictures for Algebra problems, by chapter and problem number (1–25), for both levels: graphs,
 * number lines and area models where a picture helps. The question always states the same facts.
 */

/** A number line with optional dots and a shaded ray. */
const nl = (
  min: number,
  max: number,
  dots: { at: number; open?: boolean; label?: string }[] = [],
  ray?: { from: number; dir: 1 | -1 },
): Figure => ({ kind: 'numline', min, max, dots, ...(ray ? { ray } : {}) });

/** An area model for (a + b)(c + e): a rectangle split by the terms. The first terms draw larger. */
const area = (a: string, b: string, c: string, e: string): Figure => {
  const wA = a.startsWith('2') ? 6 : 4;
  const wB = 1.6;
  const hA = c.startsWith('2') ? 6 : 4;
  const hB = 1.6;
  const w = wA + wB;
  const h = hA + hB;
  return poly(
    [
      [0, 0],
      [w, 0],
      [w, h],
      [0, h],
    ],
    {
      segs: [
        { from: [wA, 0], to: [wA, h] },
        { from: [0, hB], to: [w, hB] },
      ],
      t: [
        [wA / 2, h + 0.9, a],
        [wA + wB / 2, h + 0.9, b],
        [-1.1, hB + hA / 2, c],
        [-1.1, hB / 2, e],
      ],
    },
  );
};

const line = (
  pts: Pt[],
  x: [number, number],
  y: [number, number],
  more: Partial<Extract<Figure, { kind: 'grid' }>> = {},
): Figure => ({
  kind: 'grid',
  x,
  y,
  lines: [{ pts }],
  pts: pts.map((at) => ({
    at,
    label: `(${String(at[0]).replace('-', '−')}, ${String(at[1]).replace('-', '−')})`,
  })),
  ...more,
});
const fns = (
  list: { m: number; b: number; label?: string }[],
  x: [number, number],
  y: [number, number],
  more: Partial<Extract<Figure, { kind: 'grid' }>> = {},
): Figure => ({ kind: 'grid', x, y, fn: list, ...more });
const para = (
  a: number,
  b: number,
  c: number,
  x: [number, number],
  y: [number, number],
  label?: string,
  more: Partial<Extract<Figure, { kind: 'grid' }>> = {},
): Figure => ({ kind: 'grid', x, y, quad: [{ a, b, c, label }], free: true, ...more });

export const ALGEBRA_FIGS: FigureMap = {
  expressions: {
    15: rect(5, 3, ['2x + 1', 'x + 3', '2x + 1', 'x + 3']),
  },
  inequalities: {
    5: nl(4, 9, [{ at: 6.5, open: true, label: '6.5' }], { from: 6.5, dir: 1 }),
    6: nl(-6, 2, [{ at: -2, label: '−2' }], { from: -2, dir: -1 }),
    14: nl(-4, 5, [
      { at: -2, open: true, label: '−2' },
      { at: 3, label: '3' },
    ]),
  },
  functions: {
    15: line(
      [
        [1, 4],
        [2, 7],
        [3, 10],
      ],
      [-1, 5],
      [-1, 12],
      { free: true },
    ),
    21: para(1, -6, 10, [-1, 7], [0, 12], 'y = x² − 6x + 10'),
    25: para(-5, 20, 0, [-1, 5], [-2, 22], 'h(t)', { free: true }),
  },
  linear: {
    1: line(
      [
        [0, 0],
        [2, 6],
      ],
      [-1, 4],
      [-1, 8],
    ),
    4: line(
      [
        [1, 2],
        [3, 8],
      ],
      [-1, 5],
      [0, 10],
    ),
    8: fns([{ m: 2, b: -6, label: 'y = 2x − 6' }], [-2, 6], [-8, 4]),
    9: line(
      [
        [-2, 5],
        [4, -1],
      ],
      [-4, 6],
      [-3, 7],
    ),
    13: line(
      [
        [0, -1],
        [3, 1],
      ],
      [-2, 5],
      [-3, 3],
    ),
    18: line(
      [
        [2, 3],
        [6, 11],
      ],
      [-1, 8],
      [-1, 12],
    ),
    22: fns([{ m: -1, b: 6, label: 'y = −x + 6' }], [-1, 8], [-1, 8], {
      shapes: [
        {
          pts: [
            [0, 0],
            [6, 0],
            [0, 6],
          ],
        },
      ],
    }),
    24: line(
      [
        [-1, 2],
        [3, -6],
      ],
      [-3, 6],
      [-8, 4],
    ),
  },
  systems: {
    3: fns(
      [
        { m: 2, b: 0, label: 'y = 2x' },
        { m: -1, b: 9, label: 'x + y = 9' },
      ],
      [-1, 8],
      [-1, 10],
    ),
    4: fns(
      [
        { m: 1, b: 1, label: 'y = x + 1' },
        { m: 0, b: 5, label: 'y = 5' },
      ],
      [-2, 7],
      [-1, 8],
    ),
    9: fns(
      [
        { m: -1, b: 6, label: 'y = −x + 6' },
        { m: 2, b: -3, label: 'y = 2x − 3' },
      ],
      [-2, 8],
      [-4, 8],
    ),
    13: fns(
      [
        { m: 4, b: -5, label: 'y = 4x − 5' },
        { m: 1, b: 4, label: 'y = x + 4' },
      ],
      [-1, 5],
      [-6, 10],
    ),
  },
  multiplying: {
    3: area('x', '2', 'x', '3'),
    4: area('x', '2', 'x', '3'),
    6: area('x', '1', 'x', '1'),
    10: area('2x', '3', 'x', '4'),
    11: area('2x', '3', 'x', '4'),
    15: area('x', '7', 'x', '7'),
    23: rect(5, 3, ['x + 3', '2x − 1', 'x + 3', '2x − 1']),
  },
  quadratics: {
    1: para(1, 0, 0, [-4, 4], [-1, 9], 'y = x²'),
    3: para(1, 0, -4, [-4, 4], [-5, 8], 'y = x² − 4'),
    4: para(2, 0, 1, [-3, 3], [0, 12], 'y = 2x² + 1'),
    6: para(1, -6, 5, [-1, 7], [-5, 8], 'y = x² − 6x + 5'),
    7: para(-1, 0, 4, [-4, 4], [-5, 5], 'y = −x² + 4'),
    9: para(1, -4, 3, [-1, 5], [-2, 6], 'y = x² − 4x + 3'),
    10: para(1, 2, -8, [-5, 4], [-10, 6], 'y = x² + 2x − 8'),
    11: para(2, -8, 1, [-1, 5], [-8, 8], 'y = 2x² − 8x + 1'),
    12: para(2, -8, 1, [-1, 5], [-8, 8], 'y = 2x² − 8x + 1'),
    16: para(1, -8, 12, [0, 8], [-5, 12]),
    19: para(-16, 64, 0, [-1, 5], [-10, 70], 'h(t)', { free: true }),
    22: para(-2, 12, -10, [-1, 7], [-12, 10], 'y = −2x² + 12x − 10'),
    23: rect(7, 4, ['w + 4', 'w', 'w + 4', 'w']),
  },
};

export const ALGEBRA_MIDDLE_FIGS: FigureMap = {
  expressions: {
    19: rect(5, 3, ['2x + 1', 'x + 4', '2x + 1', 'x + 4']),
  },
  inequalities: {
    2: nl(44, 52, [{ at: 48, label: '48' }], { from: 48, dir: 1 }),
  },
  functions: {
    11: line(
      [
        [0, 2],
        [4, 10],
        [6, 10],
      ],
      [-1, 7],
      [-1, 11],
    ),
    21: para(1, 0, 0, [-3, 3], [-1, 9], 'f(x) = x²'),
  },
  linear: {
    3: line(
      [
        [0, 0],
        [2, 6],
      ],
      [-1, 4],
      [-1, 8],
    ),
    8: line(
      [
        [1, 2],
        [3, 8],
      ],
      [-1, 5],
      [0, 10],
    ),
    9: line(
      [
        [-2, 5],
        [2, -3],
      ],
      [-4, 4],
      [-5, 7],
    ),
    11: line(
      [
        [0, 7],
        [2, 4],
        [4, 1],
      ],
      [-1, 6],
      [-1, 9],
    ),
    13: line(
      [
        [2, 7],
        [4, 11],
      ],
      [-1, 6],
      [-1, 13],
    ),
    14: line(
      [
        [0, 0],
        [4, 10],
      ],
      [-1, 6],
      [-1, 12],
    ),
    15: fns([{ m: 3, b: -6, label: 'y = 3x − 6' }], [-2, 6], [-8, 8]),
    19: line(
      [
        [-1, 4],
        [3, -4],
      ],
      [-3, 5],
      [-6, 6],
    ),
    25: fns([{ m: -0.4, b: 4, label: '2x + 5y = 20' }], [-2, 12], [-2, 6]),
  },
  systems: {
    3: fns(
      [
        { m: 1, b: 1, label: 'y = x + 1' },
        { m: 2, b: -3, label: 'y = 2x − 3' },
      ],
      [-1, 7],
      [-4, 8],
    ),
    4: fns(
      [
        { m: 3, b: 0, label: 'y = 3x' },
        { m: -1, b: 8, label: 'x + y = 8' },
      ],
      [-1, 6],
      [-1, 10],
    ),
    5: fns(
      [
        { m: 0, b: 5, label: 'y = 5' },
        { m: 2, b: -1, label: 'y = 2x − 1' },
      ],
      [-2, 7],
      [-3, 8],
    ),
    7: fns(
      [
        { m: 2, b: 1, label: 'y = 2x + 1' },
        { m: 2, b: 5, label: 'y = 2x + 5' },
      ],
      [-4, 4],
      [-5, 12],
    ),
    8: fns(
      [
        { m: 1, b: 2, label: 'y = x + 2' },
        { m: -1, b: 4, label: 'y = −x + 4' },
      ],
      [-3, 6],
      [-2, 8],
    ),
    15: fns(
      [
        { m: -1, b: 7, label: 'y = −x + 7' },
        { m: 1, b: -1, label: 'y = x − 1' },
      ],
      [-1, 9],
      [-3, 9],
    ),
    24: fns(
      [
        { m: 2, b: -3, label: 'y = 2x − 3' },
        { m: -1, b: 6, label: 'y = −x + 6' },
      ],
      [-1, 7],
      [-5, 8],
    ),
  },
  multiplying: {
    8: rect(6, 3, ['x + 5', '6', 'x + 5', '6']),
    9: area('x', '2', 'x', '3'),
    10: area('x', '4', 'x', '5'),
    14: area('x', '6', 'x', '6'),
    20: area('x', '4', 'x', '2'),
    24: area('x', '3', 'x', '3'),
  },
  quadratics: {
    14: rect(4, 4, ['s', 's', 's', 's']),
    15: box('e', 'e', 'e'),
    21: box('e', 'e', 'e'),
  },
};
