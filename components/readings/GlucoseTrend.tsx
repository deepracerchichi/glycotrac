"use client";

import { useReadings } from "@/lib/queries/readings";
import { defaultSettings, useSettings } from "@/lib/queries/settings";
import { fromMgdl, unitLabel } from "@/lib/readings";
import TrendChart from "@/components/readings/TrendChart";

export default function GlucoseTrend() {
  const readings = useReadings(30);
  const { data: s = defaultSettings } = useSettings();

  const points = (readings.data ?? [])
    .filter((r) => r.kind === "glucose" && r.glucose_mgdl != null)
    .map((r) => ({ t: new Date(r.measured_at).getTime(), v: fromMgdl(r.glucose_mgdl as number, s.glucose_unit) }))
    .sort((a, b) => a.t - b.t);

  const low = s.glucose_target_low != null ? fromMgdl(s.glucose_target_low, s.glucose_unit) : null;
  const high = s.glucose_target_high != null ? fromMgdl(s.glucose_target_high, s.glucose_unit) : null;

  return (
    <section className="rounded-3xl bg-white p-5 ring-1 ring-black/5">
      <h2 className="text-xl font-medium">Blood sugar, last 30 days ({unitLabel(s.glucose_unit)})</h2>
      <div className="mt-4">
        <TrendChart
          points={points}
          low={low}
          high={high}
          format={(v) => String(v)}
          label={`Blood sugar readings over the last 30 days, ${points.length} entries`}
        />
      </div>
      {low != null || high != null ? (
        <p className="mt-2 text-base text-ink/70">The shaded band is your target range.</p>
      ) : (
        <p className="mt-2 text-base text-ink/70">Set your target range in Settings to see it here.</p>
      )}
    </section>
  );
}