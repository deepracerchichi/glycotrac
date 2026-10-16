"use client";

import { Trash2 } from "lucide-react";
import { useDeleteReading, useReadings } from "@/lib/queries/readings";
import { defaultSettings, useSettings } from "@/lib/queries/settings";
import { bpLevel, contexts, formatGlucose, glucoseLevel, levelStyle } from "@/lib/readings";

export default function ReadingList() {
  const readings = useReadings(30);
  const { data: s = defaultSettings } = useSettings();
  const del = useDeleteReading();

  if (readings.isPending) return <p>Loading...</p>;
  if (readings.isError) return <p role="alert" className="font-medium text-danger">Couldn&apos;t load. Refresh to try again.</p>;

  if (readings.data.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-6 ring-1 ring-black/5">
        <p className="text-xl">No readings in the last 30 days.</p>
      </div>
    );
  }

  return (
    <ul className="grid gap-3">
      {readings.data.map((r) => {
        const isGlucose = r.kind === "glucose";
        const level = isGlucose
          ? glucoseLevel(r.glucose_mgdl as number, s)
          : bpLevel(r.systolic as number, r.diastolic as number, s);
        const style = levelStyle[level];

        return (
          <li key={r.id} className="flex items-start justify-between gap-3 rounded-3xl bg-white p-5 ring-1 ring-black/5">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-2xl font-medium">
                  {isGlucose ? formatGlucose(r.glucose_mgdl as number, s.glucose_unit) : `${r.systolic}/${r.diastolic} mmHg`}
                </p>
                {style.label && (
                  <span className={`rounded-full px-3 py-1 text-base font-medium ${style.chip}`}>{style.label}</span>
                )}
              </div>
              <p className="mt-1 text-ink/70">
                {isGlucose ? `Blood sugar · ${contexts[r.context ?? "other"]}` : "Blood pressure"} ·{" "}
                {new Date(r.measured_at).toLocaleString("en-GB", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              {r.note && <p className="mt-2 text-lg">{r.note}</p>}
            </div>
            <button
              onClick={() => del.mutate(r.id)}
              disabled={del.isPending}
              aria-label="Delete this reading"
              className="grid size-12 shrink-0 place-items-center rounded-full border-2 border-forest"
            >
              <Trash2 className="size-5" aria-hidden="true" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}