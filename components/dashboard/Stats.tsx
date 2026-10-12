"use client";

import { useMedications } from "@/lib/queries/medication";
import { useTodayLogs } from "@/lib/queries/doses";
import { buildSlots, isLowSupply } from "@/lib/today";

function Tile({ label, value, hint, children }: { label: string; value: string; hint?: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-white p-5 ring-1 ring-black/5">
      <p className="text-base text-ink/70">{label}</p>
      <p className="mt-1 text-4xl font-medium tracking-tight">{value}</p>
      {hint && <p className="mt-1 text-base text-ink/70">{hint}</p>}
      {children}
    </div>
  );
}

export default function Stats() {
  const meds = useMedications();
  const logs = useTodayLogs();

  if (meds.isPending || logs.isPending) {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-3xl bg-fog motion-reduce:animate-none" />
        ))}
      </div>
    );
  }

  if (meds.isError || logs.isError) return null;

  const slots = buildSlots(meds.data, logs.data);
  const taken = slots.filter((s) => s.taken).length;
  const next = slots.find((s) => !s.taken);
  const low = meds.data.filter(isLowSupply).length;
  const pct = slots.length ? Math.round((taken / slots.length) * 100) : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Tile label="Doses today" value={`${taken} of ${slots.length}`}>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-fog">
          <div className="h-full rounded-full bg-forest" style={{ width: `${pct}%` }} />
        </div>
      </Tile>
      <Tile
        label="Next dose"
        value={next ? next.time : slots.length ? "All done" : "None yet"}
        hint={next?.name}
      />
      <Tile
        label="Refills needed"
        value={low === 0 ? "None" : String(low)}
        hint={low === 0 ? "Supplies look good" : low === 1 ? "medication running low" : "medications running low"}
      />
    </div>
  );
}