"use client";

import { useReadings } from "@/lib/queries/readings";
import { defaultSettings, useSettings } from "@/lib/queries/settings";
import { bpLevel, contexts, formatGlucose, fromMgdl, glucoseLevel, levelStyle, unitLabel } from "@/lib/readings";

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

export default function ReadingsSummary({ days }: { days: number }) {
  const readings = useReadings(days);
  const { data: s = defaultSettings } = useSettings();

  if (readings.isPending) return null;
  if (readings.isError) return null;

  const glucose = readings.data.filter((r) => r.kind === "glucose" && r.glucose_mgdl != null);
  const bp = readings.data.filter((r) => r.kind === "bp");

  if (glucose.length === 0 && bp.length === 0) {
    return (
      <>
        <h3 className="mt-8 text-xl font-medium">Readings</h3>
        <p className="mt-2 text-ink/70">None logged in this period.</p>
      </>
    );
  }

  const gValues = glucose.map((r) => r.glucose_mgdl as number);
  const outside = glucose.filter((r) => {
    const l = glucoseLevel(r.glucose_mgdl as number, s);
    return l === "below" || l === "above" || l === "alert-low" || l === "alert-high";
  }).length;
  const hasTargets = s.glucose_target_low != null || s.glucose_target_high != null;

  return (
    <>
      <h3 className="mt-8 text-xl font-medium">Blood sugar readings ({unitLabel(s.glucose_unit)})</h3>
      {glucose.length === 0 ? (
        <p className="mt-2 text-ink/70">None logged.</p>
      ) : (
        <>
          <p className="mt-2 text-lg">
            {glucose.length} readings · average {fromMgdl(avg(gValues), s.glucose_unit)} · lowest{" "}
            {fromMgdl(Math.min(...gValues), s.glucose_unit)} · highest {fromMgdl(Math.max(...gValues), s.glucose_unit)}
            {hasTargets ? ` · ${outside} outside target` : ""}
          </p>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[28rem] text-left text-lg">
              <tbody>
                {glucose.slice(0, 20).map((r) => (
                  <tr key={r.id} className="border-b border-black/10">
                    <td className="py-2 pr-4">{fmt(r.measured_at)}</td>
                    <td className="py-2 pr-4 font-medium">{formatGlucose(r.glucose_mgdl as number, s.glucose_unit)}</td>
                    <td className="py-2 pr-4">{contexts[r.context ?? "other"]}</td>
                    <td className="py-2">{levelStyle[glucoseLevel(r.glucose_mgdl as number, s)].label}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {glucose.length > 20 && <p className="text-base text-ink/70">Showing the latest 20 of {glucose.length}.</p>}
        </>
      )}

      <h3 className="mt-8 text-xl font-medium">Blood pressure readings</h3>
      {bp.length === 0 ? (
        <p className="mt-2 text-ink/70">None logged.</p>
      ) : (
        <>
          <p className="mt-2 text-lg">
            {bp.length} readings · average {Math.round(avg(bp.map((r) => r.systolic as number)))}/
            {Math.round(avg(bp.map((r) => r.diastolic as number)))}
          </p>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[24rem] text-left text-lg">
              <tbody>
                {bp.slice(0, 20).map((r) => (
                  <tr key={r.id} className="border-b border-black/10">
                    <td className="py-2 pr-4">{fmt(r.measured_at)}</td>
                    <td className="py-2 pr-4 font-medium">{r.systolic}/{r.diastolic}</td>
                    <td className="py-2">{levelStyle[bpLevel(r.systolic as number, r.diastolic as number, s)].label}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}