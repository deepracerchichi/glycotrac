"use client";

import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { useReadings } from "@/lib/queries/readings";
import { defaultSettings, useSettings } from "@/lib/queries/settings";
import { useAppointments } from "@/lib/queries/appointments";
import { alertMessage, bpLevel, formatGlucose, glucoseLevel, levelStyle } from "@/lib/readings";

function when(iso: string) {
  return new Date(iso).toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
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
  const warning = alertMessage("glucose", gLevel) ?? alertMessage("bp", bLevel);

  return (
    <section className="rounded-3xl bg-white p-5 ring-1 ring-black/5">
      <h2 className="text-xl font-medium">Health snapshot</h2>

      <dl className="mt-4 grid gap-4">
        <div>
          <dt className="text-base text-ink/70">Latest blood sugar</dt>
          <dd className="flex flex-wrap items-center gap-2 text-2xl font-medium">
            {glucose ? formatGlucose(glucose.glucose_mgdl as number, s.glucose_unit) : "No readings yet"}
            {levelStyle[gLevel].label && (
              <span className={`rounded-full px-3 py-1 text-base ${levelStyle[gLevel].chip}`}>{levelStyle[gLevel].label}</span>
            )}
          </dd>
          {glucose && <p className="text-base text-ink/70">{when(glucose.measured_at)}</p>}
        </div>

        <div>
          <dt className="text-base text-ink/70">Latest blood pressure</dt>
          <dd className="flex flex-wrap items-center gap-2 text-2xl font-medium">
            {bp ? `${bp.systolic}/${bp.diastolic}` : "No readings yet"}
            {levelStyle[bLevel].label && (
              <span className={`rounded-full px-3 py-1 text-base ${levelStyle[bLevel].chip}`}>{levelStyle[bLevel].label}</span>
            )}
          </dd>
          {bp && <p className="text-base text-ink/70">{when(bp.measured_at)}</p>}
        </div>

        <div>
          <dt className="text-base text-ink/70">Next appointment</dt>
          <dd className="text-xl font-medium">{next ? next.title : "None booked"}</dd>
          {next && <p className="text-base text-ink/70">{when(next.scheduled_at)}</p>}
        </div>
      </dl>

      {warning && (
        <p role="alert" className="mt-4 flex items-start gap-2 rounded-2xl bg-[#fbe0e0] p-4 font-medium text-[#a31515]">
          <TriangleAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          {warning}
        </p>
      )}

      <Link href="/dashboard/readings" className="mt-4 inline-block text-base font-medium underline">
        Log a reading
      </Link>
    </section>
  );
}