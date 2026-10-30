import type { AnswerForm } from '@storyforge/math-check';

/** A study-guide sub-module problem: a typed answer (a math-check expression) and the worked steps. */
export type Pt = [number, number];
/** A free label: x, y (in the figure's own coordinates, y up) and its text. */
export type FigLabel = [number, number, string];
/** A segment between two points (a vertex index or a coordinate pair), optionally labelled or dashed. */
export type FigSeg = { from: Pt | number; to: Pt | number; label?: string; dash?: boolean };

/**
 * A problem's picture, drawn as an SVG by `ProblemFigure` (guide-figure.tsx): a small data spec in
 * the figure's own coordinates (y up), fitted to the frame. Labels repeat what the question says.
 */
export type Figure =
  | {
      kind: 'poly';
      /** Corners in order. Edge i runs from pts[i] to pts[i + 1]. */
      pts: Pt[];
      /** Vertex names, side labels (by edge), angle labels (by vertex) and tick marks (by edge). */
      v?: string[];
      s?: string[];
      a?: string[];
      ticks?: number[];
      /** Vertices with a right-angle square. */
      right?: number[];
      /** Right-angle squares at a point: [point, toward, toward]. */
      marks?: [Pt, Pt, Pt][];
      segs?: FigSeg[];
      t?: FigLabel[];
      /** Draw the corners only (no outline). */
      open?: boolean;
      /** A circle drawn with the shape (centre and radius in the figure's coordinates). */
      circ?: { at: Pt; r: number };
    }
  | {
      kind: 'angles';
      /** Full lines and rays through the centre, as directions in degrees. */
      lines?: number[];
      rays?: number[];
      /** Angle arcs from one direction counterclockwise to another, with a label. */
      marks?: { from: number; to: number; text: string }[];
      t?: FigLabel[];
    }
  | {
      kind: 'transversal';
      /** The slope of the crossing line, in degrees. */
      angle: number;
      /** A label in one of the four angles at a crossing: quadrant 1 upper right, then counterclockwise. */
      marks: { line: 'top' | 'bottom'; quad: 1 | 2 | 3 | 4; text: string }[];
    }
  | {
      kind: 'circle';
      /** Named points in circle units (centre 0,0, radius 1). A name is drawn as a label; "_x" stays hidden. */
      p: Record<string, Pt>;
      segs?: { from: string; to: string; label?: string; dash?: boolean }[];
      /** Right-angle squares: [at, toward, toward] (point names). */
      right?: [string, string, string][];
      /** Shade the sector between two directions, in degrees. */
      shade?: [number, number];
      /** The circle's radius in circle units (default 1). */
      r?: number;
      noCircle?: boolean;
      t?: FigLabel[];
    }
  | {
      kind: 'grid';
      x: [number, number];
      y: [number, number];
      pts?: { at: Pt; label?: string }[];
      /** Closed shapes. */
      shapes?: { pts: Pt[]; label?: string; dash?: boolean }[];
      /** Open lines or segments through the points given. */
      lines?: { pts: Pt[]; dash?: boolean; label?: string }[];
      /** Lines y = m x + b across the whole grid. */
      fn?: { m: number; b: number; label?: string }[];
      /** Parabolas y = a x² + b x + c. */
      quad?: { a: number; b: number; c: number; label?: string }[];
      /** Scale x and y separately (for graphs whose two axes differ a lot). */
      free?: boolean;
      t?: FigLabel[];
    }
  | {
      kind: 'numline';
      min: number;
      max: number;
      dots?: { at: number; open?: boolean; label?: string }[];
      /** A shaded ray from a number, right (1) or left (-1). */
      ray?: { from: number; dir: 1 | -1 };
    }
  | { kind: 'box'; l?: string; w?: string; h?: string }
  | { kind: 'cyl'; r?: string; h?: string; d?: string };

/** Problems keyed by chapter, each chapter's figures keyed by problem number (1–25). */
export type FigureMap = Record<string, Record<number, Figure>>;

export type GuideProblem = {
  q: string;
  a: string;
  form?: AnswerForm;
  steps: string[];
  /** The Florida B.E.S.T. benchmark the problem practises (the middle-school sets), e.g. MA.8.GR.1.1. */
  std?: string;
  /** A picture for the problem, where one helps. */
  fig?: Figure;
};

/** One problem: the question, the accepted answer, the worked steps (ending "Answer: …"). */
export const guideProblem = (
  q: string,
  a: string,
  steps: string[],
  form?: AnswerForm,
): GuideProblem => ({ q, a, steps, ...(form ? { form } : {}) });

/** A middle-school problem tagged with its Florida B.E.S.T. benchmark (grades 6–8). */
export const bestProblem = (
  std: string,
  q: string,
  a: string,
  steps: string[],
  form?: AnswerForm,
): GuideProblem => ({ ...guideProblem(q, a, steps, form), std });

/** Adds each chapter's figures (problem numbers 1–25) to its problems. */
export const attachFigures = (
  problems: Record<string, GuideProblem[]>,
  figs: FigureMap,
): Record<string, GuideProblem[]> =>
  Object.fromEntries(
    Object.entries(problems).map(([topic, list]) => [
      topic,
      list.map((pr, i) => {
        const fig = figs[topic]?.[i + 1];
        return fig ? { ...pr, fig } : pr;
      }),
    ]),
  );
