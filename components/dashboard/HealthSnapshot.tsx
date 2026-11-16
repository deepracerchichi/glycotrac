"use client";

import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { useReadings } from "@/lib/queries/readings";
import { defaultSettings, useSettings } from "@/lib/queries/settings";
import { useAppointments } from "@/lib/queries/appointments";
import { alertMessage, bpLevel, formatGlucose, glucoseLevel, levelStyle } from "@/lib/readings";

const DAY_MS = 24 * 60 * 60 * 1000;

function when(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function HealthSnapshot() {
  const readings = useReadings(30);
  const appts = useAppointments();
  const { data: s = defaultSettings } = useSettings();

  const glucose = readings.data?.find((r) => r.kind === "glucose");
  const bp = readings.data?.find((r) => r.kind === "bp");
  const next = appts.data?.find((a) => !a.done && new Date(a.scheduled_at).getTime() >= Date.now());

  const gLevel = glucose ? glucoseLevel(glucose.glucose_mgdl as number, s) : "none";
  const bLevel = bp ? bpLevel(bp.systolic as number, bp.diastolic as number, s) : "none";

  // Only warn about a reading from the last 24 hours. An old one isn't news any more.
  const recent = (iso?: string) => !!iso && Date.now() - new Date(iso).getTime() < DAY_MS;
  const warning =
    (recent(glucose?.measured_at) ? alertMessage("glucose", gLevel) : null) ??
    (recent(bp?.measured_at) ? alertMessage("bp", bLevel) : null);

  const empty = readings.isPending ? "Loading..." : readings.isError ? "Couldn't load" : "No readings yet";

  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <h2 className="text-xl font-medium">Health snapshot</h2>

      {warning && (
        <p role="alert" className="mt-4 flex items-start gap-2 rounded-2xl bg-bad-bg p-4 font-medium text-bad">
          <TriangleAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          {warning}
        </p>
      )}

      <dl className="mt-4 grid gap-4">
        <div>
          <dt className="text-base text-ink/70">Latest blood sugar</dt>
          <dd className="flex flex-wrap items-center gap-2 text-2xl font-medium">
            {glucose ? formatGlucose(glucose.glucose_mgdl as number, s.glucose_unit) : empty}
            {levelStyle[gLevel].label && (
              <span className={`rounded-full px-3 py-1 text-base ${levelStyle[gLevel].chip}`}>{levelStyle[gLevel].label}</span>
            )}
          </dd>
          {glucose && <p className="text-base text-ink/70">{when(glucose.measured_at)}</p>}
        </div>

        <div>
          <dt className="text-base text-ink/70">Latest blood pressure</dt>
          <dd className="flex flex-wrap items-center gap-2 text-2xl font-medium">
            {bp ? `${bp.systolic}/${bp.diastolic}` : empty}
            {levelStyle[bLevel].label && (
              <span className={`rounded-full px-3 py-1 text-base ${levelStyle[bLevel].chip}`}>{levelStyle[bLevel].label}</span>
            )}
          </dd>
          {bp && <p className="text-base text-ink/70">{when(bp.measured_at)}</p>}
        </div>

        <div>
          <dt className="text-base text-ink/70">Next appointment</dt>
          <dd className="text-xl font-medium">{next ? next.title : appts.isError ? "Couldn't load" : "None booked"}</dd>
          {next && <p className="text-base text-ink/70">{when(next.scheduled_at)}</p>}
        </div>
      </dl>

      <Link
        href="/dashboard/readings"
        className="mt-4 inline-flex min-h-12 items-center rounded-full border-2 border-forest px-5 font-medium transition hover:bg-fog"
      >
        Log a reading
      </Link>
    </section>
  );
}
