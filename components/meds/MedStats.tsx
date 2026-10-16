"use client";

import { useMedications } from "@/lib/queries/medication";
import { isLowSupply } from "@/lib/today";
import StatTile from "@/components/ui/StatTile";

export default function MedStats() {
  const meds = useMedications();
  if (meds.isPending || meds.isError) return null;

  const perDay = meds.data.reduce((n, m) => n + m.schedules.length, 0);
  const low = meds.data.filter(isLowSupply).length;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatTile label="Medications" value={String(meds.data.length)} />
      <StatTile label="Doses per day" value={String(perDay)} />
      <StatTile
        label="Refills needed"
        value={low === 0 ? "None" : String(low)}
        hint={low === 0 ? "Supplies look good" : "running low"}
      />
    </div>
  );
}