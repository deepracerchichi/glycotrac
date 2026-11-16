"use client";

import { useState } from "react";
import { CircleCheck, CircleX, Clock } from "lucide-react";
import { useMedications } from "@/lib/queries/medication";
import { useTodayLogs, useTakeDose } from "@/lib/queries/doses";
import { buildSlots } from "@/lib/today";
import { formatTime12 } from "@/lib/time";
import SetupChecklist from "@/components/dashboard/SetupChecklist";

const label = {
  due: { text: "Due now", Icon: Clock },
  missed: { text: "Not logged yet", Icon: CircleX },
  later: { text: "Up next", Icon: Clock },
} as const;

export default function NextDose() {
  const meds = useMedications();
  const logs = useTodayLogs();
  const takeDose = useTakeDose();
  const [done, setDone] = useState("");

  if (meds.isPending || logs.isPending) {
    return <div className="h-48 animate-pulse rounded-[2rem] bg-fog motion-reduce:animate-none" aria-hidden="true" />;
  }
  if (meds.isError || logs.isError) return null;

  const slots = buildSlots(meds.data, logs.data);
  if (slots.length === 0) return <SetupChecklist />;

  const open = slots.filter((s) => !s.taken);
  const target = open.find((s) => s.status === "due" || s.status === "missed") ?? open[0];
  const taken = slots.length - open.length;

  if (!target) {
    return (
      <section className="rounded-[2rem] bg-gradient-to-br from-forest to-pine p-6 text-white md:p-8">
        <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-base font-medium">
          <CircleCheck className="size-5" aria-hidden="true" />
          All done
        </p>
        <h2 className="mt-4 text-3xl font-medium tracking-tight md:text-5xl">You&apos;ve taken every dose today.</h2>
        <p className="mt-2 text-lg text-white/80">
          {taken} of {slots.length} logged. Your next dose is tomorrow at {formatTime12(slots[0].time)}.
        </p>
      </section>
    );
  }

  const [time, period] = formatTime12(target.time).split(" ");
  const { text, Icon } = label[target.status as keyof typeof label];
  const rest = open.length - 1;

  return (
    <section aria-labelledby="next-dose" className="rounded-[2rem] bg-gradient-to-br from-forest to-pine p-6 text-white md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-base font-medium">
          <Icon className="size-5" aria-hidden="true" />
          {text}
        </p>
        <p className="text-base text-white/80">
          {taken} of {slots.length} taken today
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <h2 id="next-dose" className="sr-only">
            Next dose
          </h2>
          <p className="text-6xl font-medium tracking-tight tabular-nums md:text-7xl">
            {time} <span className="text-3xl text-white/70 md:text-4xl">{period}</span>
          </p>
          <p className="mt-2 line-clamp-2 text-2xl">{target.name}</p>
          <p className="text-lg text-white/75">
            {target.dose}
            {rest > 0 && ` · ${rest} more after this`}
          </p>
        </div>

        <button
          type="button"
          disabled={takeDose.isPending}
          onClick={() =>
            takeDose.mutate(
              { medicationId: target.medicationId, scheduledFor: target.scheduledFor },
              {
                onSuccess: () => {
                  setDone(target.name);
                  setTimeout(() => setDone(""), 4000);
                },
              }
            )
          }
          className="min-h-16 w-full rounded-full bg-white px-10 text-xl font-semibold text-forest transition hover:bg-mint active:scale-[0.98] disabled:opacity-60 md:w-auto"
        >
          {takeDose.isPending ? "Saving..." : "Mark as taken"}
        </button>
      </div>

      <p role="status" aria-live="polite" className="mt-4 min-h-6 text-base font-medium text-mint">
        {done && `Saved. ${done} marked as taken.`}
      </p>
      {takeDose.isError && (
        <p role="alert" className="mt-2 rounded-xl bg-white px-4 py-3 font-medium text-bad">
          Couldn&apos;t save that. Check your connection and try again.
        </p>
      )}
    </section>
  );
}
