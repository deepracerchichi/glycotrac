type Pt = { t: number; v: number };

export default function TrendChart({
  points,
  low,
  high,
  format,
  label,
}: {
  points: Pt[];
  low?: number | null;
  high?: number | null;
  format: (v: number) => string;
  label: string;
}) {
  if (points.length < 2) {
    return <p className="text-ink/70">Add at least two readings to see a trend.</p>;
  }

  const W = 640;
  const H = 200;
  const P = { l: 56, r: 12, t: 12, b: 28 };

  const extra = [low, high].filter((x): x is number => x != null);
  const vs = [...points.map((p) => p.v), ...extra];
  const min = Math.min(...vs);
  const max = Math.max(...vs);
  const pad = (max - min || 10) * 0.15;
  const y0 = min - pad;
  const y1 = max + pad;
  const t0 = points[0].t;
  const t1 = points[points.length - 1].t;

  const x = (t: number) => P.l + ((t - t0) / (t1 - t0 || 1)) * (W - P.l - P.r);
  const y = (v: number) => P.t + (1 - (v - y0) / (y1 - y0)) * (H - P.t - P.b);
  const path = points.map((p, i) => `${i ? "L" : "M"}${x(p.t).toFixed(1)} ${y(p.v).toFixed(1)}`).join(" ");
  const date = (t: number) => new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="h-auto w-full">
      {low != null && high != null && (
        <rect x={P.l} y={y(high)} width={W - P.l - P.r} height={y(low) - y(high)} className="fill-sage" />
      )}
      {low != null && high == null && (
        <line x1={P.l} x2={W - P.r} y1={y(low)} y2={y(low)} className="stroke-forest/40" strokeDasharray="4 4" />
      )}
      {high != null && low == null && (
        <line x1={P.l} x2={W - P.r} y1={y(high)} y2={y(high)} className="stroke-forest/40" strokeDasharray="4 4" />
      )}

      <text x={P.l - 8} y={y(max)} textAnchor="end" dominantBaseline="middle" className="fill-ink/70 text-[12px]">
        {format(max)}
      </text>
      <text x={P.l - 8} y={y(min)} textAnchor="end" dominantBaseline="middle" className="fill-ink/70 text-[12px]">
        {format(min)}
      </text>
      <text x={P.l} y={H - 6} className="fill-ink/70 text-[12px]">{date(t0)}</text>
      <text x={W - P.r} y={H - 6} textAnchor="end" className="fill-ink/70 text-[12px]">{date(t1)}</text>

      <path d={path} fill="none" className="stroke-forest" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p) => (
        <circle key={p.t} cx={x(p.t)} cy={y(p.v)} r="4" className="fill-forest" />
      ))}
    </svg>
  );
}