"use client";

import Link from "next/link";
import { useReadings } from "@/lib/queries/readings";
import { defaultSettings, useSettings } from "@/lib/queries/settings";
import { formatGlucose, fromMgdl, glucoseLevel, unitLabel } from "@/lib/readings";
import StatTile from "@/components/ui/StatTile";

const WEEK = 7 * 24 * 3600 * 1000;
const when = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export default function ReadingStats() {
  const readings = useReadings(30);
  const { data: s = defaultSettings } = useSettings();

  if (readings.isPending || readings.isError) return null;

  const glucose = readings.data.filter((r) => r.kind === "glucose" && r.glucose_mgdl != null);
  const bp = readings.data.filter((r) => r.kind === "bp");
  const week = glucose.filter((r) => Date.now() - new Date(r.measured_at).getTime() <= WEEK);

  const latest = glucose[0];
  const latestBp = bp[0];
  const avg = week.length ? week.reduce((n, r) => n + (r.glucose_mgdl as number), 0) / week.length : null;
  const hasTargets = s.glucose_target_low != null || s.glucose_target_high != null;
  const inTarget = week.filter((r) => glucoseLevel(r.glucose_mgdl as number, s) === "in").length;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatTile
        label="Latest blood sugar"
        value={latest ? formatGlucose(latest.glucose_mgdl as number, s.glucose_unit) : "None yet"}
        hint={latest ? when(latest.measured_at) : undefined}
      />
      <StatTile
        label="7-day average"
        value={avg != null ? `${fromMgdl(avg, s.glucose_unit)} ${unitLabel(s.glucose_unit)}` : "None yet"}
        hint={week.length ? `${week.length} readings` : undefined}
      />
      <StatTile
        label="In target, 7 days"
        value={hasTargets && week.length ? `${Math.round((inTarget / week.length) * 100)}%` : "Not set"}
        hint={
          hasTargets ? undefined : (
            <Link href="/dashboard/settings" className="underline">Set your targets</Link>
          )
        }
      />
      <StatTile
        label="Latest blood pressure"
        value={latestBp ? `${latestBp.systolic}/${latestBp.diastolic}` : "None yet"}
        hint={latestBp ? when(latestBp.measured_at) : undefined}
      />
    </div>
  );
}