"use client";

import { useState } from "react";
import { Printer } from "lucide-react";
import { useMedications } from "@/lib/queries/medication";
import { useSymptoms } from "@/lib/queries/symptoms";
import { useDoseHistory } from "@/lib/queries/history";
import { buildSummary } from "@/lib/summary";
import { severityLabels } from "@/lib/symptoms";

const ranges = [7, 14, 30];

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-black/10">
      <p className="text-base text-ink/70">{label}</p>
      <p className="mt-1 text-3xl font-medium">{value}</p>
    </div>
  );
}

export default function SummaryView() {
  const [days, setDays] = useState(7);
  const meds = useMedications();
  const symptoms = useSymptoms(days);
  const history = useDoseHistory(days);

  if (meds.isPending || symptoms.isPending || history.isPending) return <p>Loading...</p>;
  if (meds.isError || symptoms.isError || history.isError) {
    return <p role="alert" className="font-medium text-danger">Couldn&apos;t load. Refresh to try again.</p>;
  }

  const s = buildSummary(meds.data, history.data, symptoms.data, days);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center gap-3 print:hidden">
        <div role="group" aria-label="Time range" className="flex gap-2">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setDays(r)}
              aria-pressed={days === r}
              className={`min-h-12 rounded-full border-2 border-forest px-5 font-medium ${
                days === r ? "bg-forest text-white" : "bg-white"
              }`}
            >
              {r} days
            </button>
          ))}
        </div>
        <button
          onClick={() => window.print()}
          className="inline-flex min-h-12 items-center gap-2 rounded-full bg-mint px-5 font-medium text-forest"
        >
          <Printer className="size-5" aria-hidden="true" />
          Print or save as PDF
        </button>
      </div>

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/5 print:ring-0">
        <h2 className="text-2xl font-medium">
          Medication summary, last {days} days
        </h2>
        <p className="mt-1 text-ink/70">
          Prepared {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          <Stat label="Doses taken" value={String(s.taken)} />
          <Stat label="Doses missed" value={String(s.missed)} />
          <Stat label="On-time rate" value={s.adherence === null ? "n/a" : `${s.adherence}%`} />
          <Stat label="Symptoms logged" value={String(s.symptomCount)} />
        </div>

        <h3 className="mt-8 text-xl font-medium">Current medications</h3>
        {meds.data.length === 0 ? (
          <p className="mt-2 text-ink/70">None added.</p>
        ) : (
          <ul className="mt-2 grid gap-1 text-lg">
            {meds.data.map((m) => (
              <li key={m.id}>
                <span className="font-medium">{m.name}</span> · {m.dose} ·{" "}
                {[...m.schedules]
                  .sort((a: { time_of_day: string }, b: { time_of_day: string }) => a.time_of_day.localeCompare(b.time_of_day))
                  .map((x: { time_of_day: string }) => x.time_of_day.slice(0, 5))
                  .join(", ")}
              </li>
            ))}
          </ul>
        )}

        <h3 className="mt-8 text-xl font-medium">Day by day</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left text-lg">
            <thead>
              <tr className="border-b-2 border-forest">
                <th className="py-2 pr-4 font-medium">Day</th>
                <th className="py-2 pr-4 font-medium">Taken</th>
                <th className="py-2 pr-4 font-medium">Missed</th>
                <th className="py-2 font-medium">Symptoms</th>
              </tr>
            </thead>
            <tbody>
              {s.rows.map((r) => (
                <tr key={r.key} className="border-b border-black/10 align-top">
                  <td className="py-3 pr-4 font-medium">{r.label}</td>
                  <td className="py-3 pr-4">{r.taken}</td>
                  <td className="py-3 pr-4">{r.missed}</td>
                  <td className="py-3">
                    {r.symptoms.length === 0
                      ? "None"
                      : r.symptoms.map((x) => (
                          <p key={x.id}>
                            {x.name} ({severityLabels[x.severity].toLowerCase()}){" "}
                            {new Date(x.occurred_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                            {x.note ? `: ${x.note}` : ""}
                          </p>
                        ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-base text-ink/70">
          This summary shows what was recorded in the app. It is not medical advice.
        </p>
      </section>
    </div>
  );
}