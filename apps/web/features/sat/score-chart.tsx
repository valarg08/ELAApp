/**
 * The estimated scores week by week as a small line chart (200–800). A drawing only: the table
 * beside it holds the same numbers for screen readers.
 */
export function ScoreChart({ points }: { points: { week: number; score: number }[] }) {
  const W = 320;
  const H = 150;
  const pad = { l: 36, r: 12, t: 12, b: 24 };
  const x = (i: number) =>
    points.length === 1
      ? (pad.l + W - pad.r) / 2
      : pad.l + ((W - pad.l - pad.r) * i) / (points.length - 1);
  const y = (score: number) => pad.t + ((800 - score) / 600) * (H - pad.t - pad.b);
  const line = points.map((p, i) => `${x(i)},${y(p.score)}`).join(' ');
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      aria-hidden="true"
      className="h-auto w-full max-w-sm rounded-xl border border-border bg-card"
    >
      {[200, 400, 600, 800].map((v) => (
        <g key={v}>
          <line
            x1={pad.l}
            x2={W - pad.r}
            y1={y(v)}
            y2={y(v)}
            stroke="currentColor"
            opacity={0.15}
          />
          <text
            x={pad.l - 6}
            y={y(v)}
            textAnchor="end"
            dominantBaseline="central"
            fontSize={10}
            fill="currentColor"
          >
            {v}
          </text>
        </g>
      ))}
      <g className="text-brand" stroke="currentColor" fill="currentColor">
        {points.length > 1 && <polyline points={line} fill="none" strokeWidth={2.2} />}
        {points.map((p, i) => (
          <circle key={p.week} cx={x(i)} cy={y(p.score)} r={3.5} stroke="none" />
        ))}
      </g>
      {points.map((p, i) => (
        <text key={p.week} x={x(i)} y={H - 8} textAnchor="middle" fontSize={10} fill="currentColor">
          {`W${p.week}`}
        </text>
      ))}
    </svg>
  );
}
