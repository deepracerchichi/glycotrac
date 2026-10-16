"use client";

import AddMedication from "@/components/meds/AddMedication";
import { useMedications } from "@/lib/queries/medication";
import { daysLeft, isLowSupply } from "@/lib/today";
import StatusIcon from "@/components/ui/StatusIcon";
import MedActions from "@/components/meds/MedActions";

export default function MedList() {
  const meds = useMedications();

  if (meds.isPending) return <p>Loading...</p>;
  if (meds.isError) return <p role="alert" className="font-medium text-danger">Couldn&apos;t load. Refresh to try again.</p>;

  if (meds.data.length === 0) {
    return (
      <div className="grid justify-items-start gap-4 rounded-3xl bg-white p-6 ring-1 ring-black/5">
        <p className="text-xl">You haven&apos;t added any medication yet.</p>
        <AddMedication />
      </div>
    );
  }

  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {meds.data.map((m) => {
        const days = daysLeft(m);
        const low = isLowSupply(m);
        const times = [...m.schedules].sort((a: { time_of_day: string }, b: { time_of_day: string }) =>
          a.time_of_day.localeCompare(b.time_of_day)
        );

        return (
          <li key={m.id} className="rounded-3xl bg-white p-5 ring-1 ring-black/5">
            <p className="text-xl font-medium">{m.name}</p>
            <p className="text-ink/70">{m.dose}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {times.map((s: { id: string; time_of_day: string }) => (
                <span key={s.id} className="rounded-full bg-fog px-3 py-1 text-base">{s.time_of_day.slice(0, 5)}</span>
              ))}
            </div>
            <p className={`mt-4 flex flex-wrap items-center gap-x-2 text-lg ${low ? "font-medium text-[#9a4a07]" : ""}`}>
              <span>{m.pills_remaining} pills left</span>
              {days !== null && (
                <span className="flex items-center gap-1.5">
                  ·
                  {low && <StatusIcon kind="low" className="size-5" />}
                  {days} day{days === 1 ? "" : "s"}
                </span>
              )}
            </p>
            <MedActions med={m} />
          </li>
        );
      })}
    </ul>
  );
}