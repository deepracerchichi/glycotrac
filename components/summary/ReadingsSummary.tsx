"use client";

import { useReadings } from "@/lib/queries/readings";
import { defaultSettings, useSettings } from "@/lib/queries/settings";
import { bpLevel, contexts, formatGlucose, fromMgdl, glucoseLevel, levelStyle, unitLabel } from "@/lib/readings";

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

function Row({ main, meta, status, chip }: { main: string; meta: string; status: string; chip: string }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-paper p-3 print:break-inside-avoid print:bg-white print:ring-1 print:ring-black/10">
      <div className="min-w-0">
        <p className="break-words text-lg font-medium">{main}</p>
        <p className="text-base text-ink/70">{meta}</p>
      </div>
      {status && <span className={`rounded-full px-3 py-1 text-base font-medium ${chip}`}>{status}</span>}
    </li>
  );
}

export default function ReadingsSummary({ days }: { days: number }) {
  const readings = useReadings(days);
  const { data: s = defaultSettings } = useSettings();

  if (readings.isPending || readings.isError) return null;

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
  const hasTargets = s.glucose_target_low != null || s.glucose_target_high != null;
  const outside = glucose.filter((r) => ["below", "above", "alert-low", "alert-high"].includes(glucoseLevel(r.glucose_mgdl as number, s))).length;

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
          <ul className="mt-3 grid gap-2">
            {glucose.slice(0, 20).map((r) => {
              const level = glucoseLevel(r.glucose_mgdl as number, s);
              return (
                <Row
                  key={r.id}
                  main={formatGlucose(r.glucose_mgdl as number, s.glucose_unit)}
                  meta={`${contexts[r.context ?? "other"]} · ${fmt(r.measured_at)}`}
                  status={levelStyle[level].label}
                  chip={levelStyle[level].chip}
                />
              );
            })}
          </ul>
          {glucose.length > 20 && <p className="mt-2 text-base text-ink/70">Showing the latest 20 of {glucose.length}.</p>}
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
          <ul className="mt-3 grid gap-2">
            {bp.slice(0, 20).map((r) => {
              const level = bpLevel(r.systolic as number, r.diastolic as number, s);
              return (
                <Row
                  key={r.id}
                  main={`${r.systolic}/${r.diastolic}`}
                  meta={fmt(r.measured_at)}
                  status={levelStyle[level].label}
                  chip={levelStyle[level].chip}
                />
              );
            })}
          </ul>
        </>
      )}
    </>
  );
}