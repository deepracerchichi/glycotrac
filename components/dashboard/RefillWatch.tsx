"use client";
import Link from "next/link";
import { useMedications } from "@/lib/queries/medication";
import { daysLeft, isLowSupply } from "@/lib/today";
import StatusIcon from "@/components/ui/StatusIcon";

export default function RefillWatch() {
  const meds = useMedications();

  const rows = (meds.data ?? [])
    .map((m) => ({ m, days: daysLeft(m) }))
    .filter((r): r is { m: (typeof r)["m"]; days: number } => r.days !== null)
    .sort((a, b) => a.days - b.days)
    .slice(0, 4);

  return (
    <section className="rounded-3xl bg-white p-5 ring-1 ring-black/5">
      <h2 className="text-xl font-medium">Refill watch</h2>

      {rows.length === 0 ? (
        <p className="mt-3 text-ink/70">Add a medication to see how many days of pills you have left.</p>
      ) : (
        <ul className="mt-4 grid gap-4">
          {rows.map(({ m, days }) => {
            const low = isLowSupply(m);
            const pct = Math.min(100, (days / Math.max(m.refill_threshold_days * 2, 1)) * 100);

            return (
              <li key={m.id}>
                <p className="line-clamp-1 text-lg">{m.name}</p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-fog">
                  <div className={`h-full rounded-full ${low ? "bg-[#b45309]" : "bg-forest"}`} style={{ width: `${pct}%` }} />
                </div>
                <p className={`mt-1 flex items-center gap-1.5 text-base ${low ? "font-medium text-[#9a4a07]" : "text-ink/70"}`}>
                  {low && <StatusIcon kind="low" />}
                  {low ? `Low: ${days} day${days === 1 ? "" : "s"} left` : `${days} days left`}
                </p>

                {low && (
                  <Link href="/dashboard/meds" className="mt-1 inline-block text-base font-medium underline">
                    Log a refill
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}