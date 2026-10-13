import { MISSED_AFTER_MS } from "@/lib/today";
import type { Symptom } from "@/lib/queries/symptoms";
import type { HistoryLog } from "@/lib/queries/history";

type Med = {
  id: string;
  schedules: { id: string; time_of_day: string; created_at: string }[];
};

export type DayRow = {
  key: string;
  label: string;
  taken: number;
  missed: number;
  symptoms: Symptom[];
};

export function buildSummary(
  meds: Med[],
  logs: HistoryLog[],
  symptoms: Symptom[],
  days: number,
  now = Date.now()
) {
  const takenKeys = new Set(
    logs
      .filter((l) => l.taken_at)
      .map((l) => `${l.medication_id}|${new Date(l.scheduled_for).getTime()}`)
  );

  const rows: DayRow[] = [];

  for (let i = 0; i < days; i++) {
    const day = new Date(now);
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - i);
    const dayEnd = new Date(day);
    dayEnd.setDate(dayEnd.getDate() + 1);

    let taken = 0;
    let missed = 0;

    for (const med of meds) {
      for (const s of med.schedules) {
        const [h, m] = s.time_of_day.split(":").map(Number);
        const when = new Date(day);
        when.setHours(h, m, 0, 0);
        const t = when.getTime();

        if (t > now || t < new Date(s.created_at).getTime()) continue;

        if (takenKeys.has(`${med.id}|${t}`)) taken++;
        else if (now - t > MISSED_AFTER_MS) missed++;
      }
    }

    const daySymptoms = symptoms
      .filter((s) => {
        const t = new Date(s.occurred_at).getTime();
        return t >= day.getTime() && t < dayEnd.getTime();
      })
      .sort((a, b) => a.occurred_at.localeCompare(b.occurred_at));

    rows.push({
      key: day.toISOString(),
      label: day.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }),
      taken,
      missed,
      symptoms: daySymptoms,
    });
  }

  const taken = rows.reduce((n, r) => n + r.taken, 0);
  const missed = rows.reduce((n, r) => n + r.missed, 0);
  const resolved = taken + missed;

  return {
    rows,
    taken,
    missed,
    adherence: resolved ? Math.round((taken / resolved) * 100) : null,
    symptomCount: symptoms.length,
  };
}