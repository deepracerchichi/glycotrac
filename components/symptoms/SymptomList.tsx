"use client";

import { Trash2 } from "lucide-react";
import { useDeleteSymptom, useSymptoms } from "@/lib/queries/symptoms";
import { useDoseHistory } from "@/lib/queries/history";
import { doseBefore, formatGap, severityLabels, type TakenDose } from "@/lib/symptoms";

const chip: Record<number, string> = {
  1: "bg-fog text-ink/80",
  2: "bg-[#fdebd3] text-[#9a4a07]",
  3: "bg-[#fbe0e0] text-[#a31515]",
};

export default function SymptomList() {
  const symptoms = useSymptoms(30);
  const history = useDoseHistory(30);
  const del = useDeleteSymptom();

  if (symptoms.isPending) return <p>Loading...</p>;
  if (symptoms.isError) return <p role="alert" className="font-medium text-danger">Couldn&apos;t load. Refresh to try again.</p>;

  if (symptoms.data.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-6 ring-1 ring-black/5">
        <p className="text-xl">Nothing logged in the last 30 days.</p>
      </div>
    );
  }

  const taken: TakenDose[] = (history.data ?? [])
    .filter((l) => l.taken_at)
    .map((l) => ({ taken_at: l.taken_at as string, name: l.name }));

  return (
    <ul className="grid gap-3">
      {symptoms.data.map((s) => {
        const near = doseBefore(s.occurred_at, taken);

        return (
          <li key={s.id} className="flex items-start justify-between gap-3 rounded-3xl bg-white p-5 ring-1 ring-black/5">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xl font-medium">{s.name}</p>
                <span className={`rounded-full px-3 py-1 text-base font-medium ${chip[s.severity]}`}>
                  {severityLabels[s.severity]}
                </span>
              </div>
              <p className="mt-1 text-ink/70">
                {new Date(s.occurred_at).toLocaleString("en-GB", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              {near && (
                <p className="mt-1 text-base">
                  Logged {formatGap(near.minutes)} after {near.name}
                </p>
              )}
              {s.note && <p className="mt-2 text-lg">{s.note}</p>}
            </div>
            <button
              onClick={() => del.mutate(s.id)}
              disabled={del.isPending}
              aria-label={`Delete ${s.name} entry`}
              className="grid size-12 shrink-0 place-items-center rounded-full border-2 border-forest"
            >
              <Trash2 className="size-5" aria-hidden="true" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}