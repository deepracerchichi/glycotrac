"use client";

import { useSymptoms } from "@/lib/queries/symptoms";
import StatTile from "@/components/ui/StatTile";

const WEEK = 7 * 24 * 3600 * 1000;

function ago(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 60) return `${Math.max(mins, 1)} min ago`;
  const h = Math.round(mins / 60);
  if (h < 48) return `${h} h ago`;
  return `${Math.round(h / 24)} days ago`;
}

export default function SymptomStats() {
  const symptoms = useSymptoms(30);
  if (symptoms.isPending || symptoms.isError) return null;

  const data = symptoms.data;
  const week = data.filter((s) => Date.now() - new Date(s.occurred_at).getTime() <= WEEK).length;

  const counts = new Map<string, number>();
  data.forEach((s) => counts.set(s.name, (counts.get(s.name) ?? 0) + 1));
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];

  const last = data[0];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatTile label="Logged this week" value={String(week)} />
      <StatTile
        label="Most common, 30 days"
        value={top ? top[0] : "None yet"}
        hint={top ? `${top[1]} time${top[1] === 1 ? "" : "s"}` : undefined}
      />
      <StatTile label="Last logged" value={last ? ago(last.occurred_at) : "None yet"} hint={last?.name} />
    </div>
  );
}