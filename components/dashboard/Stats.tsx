"use client";

import { useMedications } from "@/lib/queries/medication";
import { useTodayLogs } from "@/lib/queries/doses";
import { buildSlots, isLowSupply } from "@/lib/today";
import StatTile from "@/components/ui/StatTile";

export default function Stats() {
  const meds = useMedications();
  const logs = useTodayLogs();

  if (meds.isPending || logs.isPending) {
    return (
      <div className="grid grid-cols-2 gap-3 md:gap-4 @5xl:ml-6 @5xl:w-[22rem] @5xl:grid-cols-1">
        {[0, 1].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-3xl bg-fog motion-reduce:animate-none" aria-hidden="true" />
        ))}
      </div>
    );
  }

  if (meds.isError || logs.isError) return null;

  const slots = buildSlots(meds.data, logs.data);
  if (slots.length === 0) return null;

  const taken = slots.filter((s) => s.status === "taken").length;
  const missed = slots.filter((s) => s.status === "missed").length;
  const low = meds.data.filter(isLowSupply).length;
  const pct = Math.round((taken / slots.length) * 100);

  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 @5xl:ml-6 @5xl:w-[22rem] @5xl:grid-cols-1">
      <StatTile label="Doses today" value={`${taken} of ${slots.length}`} hint={missed > 0 ? `${missed} not logged` : undefined}>
        <div
          role="progressbar"
          aria-label="Doses taken today"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          className="mt-3 h-2.5 overflow-hidden rounded-full bg-fog"
        >
          <div
            className="h-full rounded-full bg-forest transition-[width] duration-500 motion-reduce:transition-none"
            style={{ width: `${pct}%` }}
          />
        </div>
      </StatTile>
      <StatTile
        label="Refills needed"
        value={low === 0 ? "None" : String(low)}
        hint={low === 0 ? "Supplies look good" : "running low"}
      />
    </div>
  );
}
