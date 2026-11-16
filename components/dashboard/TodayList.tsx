"use client";

import { useState } from "react";
import { useMedications } from "@/lib/queries/medication";
import { useTodayLogs, useTakeDose } from "@/lib/queries/doses";
import { buildSlots } from "@/lib/today";
import { formatTime12 } from "@/lib/time";
import StatusIcon, { type StatusKind } from "@/components/ui/StatusIcon";

const status: Record<string, { label: string; icon: StatusKind | null; chip: string; bar: string }> = {
  taken: { label: "Taken", icon: "taken", chip: "bg-ok-bg text-ok", bar: "bg-success" },
  due: { label: "Due now", icon: "due", chip: "bg-warn-bg text-warn", bar: "bg-warning" },
  missed: { label: "Not logged", icon: "missed", chip: "bg-bad-bg text-bad", bar: "bg-bad" },
  later: { label: "Later today", icon: null, chip: "bg-fog text-ink/70", bar: "bg-ink/15" },
};

export default function TodayList() {
  const meds = useMedications();
  const logs = useTodayLogs();
  const takeDose = useTakeDose();
  const [done, setDone] = useState("");

  let body: React.ReactNode;
  let count = "";

  if (meds.isPending || logs.isPending) {
    body = (
      <ul className="grid gap-3" aria-label="Loading doses">
        {[0, 1, 2].map((i) => (
          <li key={i} className="h-24 animate-pulse rounded-2xl bg-fog motion-reduce:animate-none" aria-hidden="true" />
        ))}
      </ul>
    );
  } else if (meds.isError || logs.isError) {
    body = (
      <p role="alert" className="rounded-2xl bg-bad-bg p-4 font-medium text-bad">
        Couldn&apos;t load your doses. Check your connection, then refresh the page.
      </p>
    );
  } else {
    const slots = buildSlots(meds.data, logs.data);
    count = slots.length ? `${slots.filter((s) => s.taken).length} of ${slots.length} taken` : "";

    body =
      slots.length === 0 ? (
        <p className="text-xl text-ink/70">No doses yet. Once you add a medication, today&apos;s times will show up here.</p>
      ) : (
        <ul className="grid gap-3">
          {slots.map((slot) => {
            const s = status[slot.status];
            const [time, period] = formatTime12(slot.time).split(" ");

            return (
              <li
                key={`${slot.medicationId}-${slot.scheduledFor}`}
                className="relative flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl bg-paper p-4 pl-6"
              >
                <span aria-hidden="true" className={`absolute inset-y-3 left-2 w-1.5 rounded-full ${s.bar}`} />
                <p className="w-24 text-2xl font-medium tabular-nums">
                  {time} <span className="text-base text-ink/70">{period}</span>
                </p>
                <div className="min-w-0 flex-1 basis-40">
                  <p className="line-clamp-2 text-xl">{slot.name}</p>
                  <p className="text-base text-ink/70">{slot.dose}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-base font-medium ${s.chip}`}>
                  {s.icon && <StatusIcon kind={s.icon} className="size-4" />}
                  {s.label}
                </span>
                {!slot.taken && (
                  <button
                    type="button"
                    onClick={() =>
                      takeDose.mutate(
                        { medicationId: slot.medicationId, scheduledFor: slot.scheduledFor },
                        {
                          onSuccess: () => {
                            setDone(slot.name);
                            setTimeout(() => setDone(""), 4000);
                          },
                        }
                      )
                    }
                    disabled={takeDose.isPending}
                    className={`min-h-12 w-full rounded-full px-6 font-medium transition active:scale-[0.98] disabled:opacity-60 sm:w-auto ${
                      slot.status === "later"
                        ? "border-2 border-forest bg-white text-forest hover:bg-fog"
                        : "bg-forest text-white hover:bg-pine"
                    }`}
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
    <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 md:p-6">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-2xl font-medium tracking-tight">Today&apos;s doses</h2>
        {count && <p className="text-base text-ink/70">{count}</p>}
      </div>
      {body}
      <p role="status" aria-live="polite" className="mt-3 min-h-6 text-base font-medium text-ok">
        {done && `Saved. ${done} marked as taken.`}
      </p>
      {takeDose.isError && (
        <p role="alert" className="mt-2 font-medium text-bad">
          Couldn&apos;t save that. Check your connection and try again.
        </p>
      )}
    </section>
  );
}
