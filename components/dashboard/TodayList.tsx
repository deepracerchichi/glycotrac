"use client";

import AddMedication from "@/components/meds/AddMedication";
import { useMedications } from "@/lib/queries/medication";
import { useTodayLogs, useTakeDose } from "@/lib/queries/doses";
import { buildSlots } from "@/lib/today";
import StatusIcon, { type StatusKind } from "@/components/ui/StatusIcon";

const status: Record<string, { label: string; icon: StatusKind | null; chip: string }> = {
  taken: { label: "Taken", icon: "taken", chip: "bg-[#e3f3da] text-[#2f7d14]" },
  due: { label: "Due now", icon: "due", chip: "bg-[#fdebd3] text-[#9a4a07]" },
  missed: { label: "Missed", icon: "missed", chip: "bg-[#fbe0e0] text-[#a31515]" },
  later: { label: "Later today", icon: null, chip: "bg-fog text-ink/70" },
};

export default function TodayList() {
  const meds = useMedications();
  const logs = useTodayLogs();
  const takeDose = useTakeDose();

  let body: React.ReactNode;

  if (meds.isPending || logs.isPending) {
    body = <p>Loading...</p>;
  } else if (meds.isError || logs.isError) {
    body = <p role="alert" className="font-medium text-danger">Couldn&apos;t load. Refresh to try again.</p>;
  } else {
    const slots = buildSlots(meds.data, logs.data);

    body =
      slots.length === 0 ? (
        <div className="grid justify-items-start gap-4">
          <p className="text-xl">No medication yet. Add your first one to see today&apos;s doses here.</p>
          <AddMedication />
        </div>
      ) : (
        <ul className="grid gap-3">
          {slots.map((slot) => {
            const s = status[slot.status];

            return (
              <li key={`${slot.medicationId}-${slot.scheduledFor}`} className="flex flex-wrap items-center gap-4 rounded-2xl bg-paper p-4">
                <p className="w-20 text-2xl font-medium">{slot.time}</p>
                <div className="min-w-0 flex-1 basis-48">
                  <p className="line-clamp-2 text-xl">{slot.name}</p>
                  <p className="text-base text-ink/70">{slot.dose}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-base font-medium ${s.chip}`}>
                  {s.icon && <StatusIcon kind={s.icon} className="size-4" />}
                  {s.label}
                </span>
                {!slot.taken && (
                  <button
                    onClick={() => takeDose.mutate({ medicationId: slot.medicationId, scheduledFor: slot.scheduledFor })}
                    disabled={takeDose.isPending}
                    className="min-h-12 rounded-full bg-forest px-5 font-medium text-white disabled:opacity-60"
                  >
                    Mark as taken
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      );
  }

  return (
    <section className="rounded-3xl bg-white p-5 ring-1 ring-black/5 md:p-6">
      <h2 className="mb-4 text-2xl font-medium tracking-tight">Today&apos;s doses</h2>
      {body}
      {takeDose.isError && (
        <p role="alert" className="mt-4 font-medium text-danger">Couldn&apos;t save that. Try again.</p>
      )}
    </section>
  );
}