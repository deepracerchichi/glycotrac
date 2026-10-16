"use client";

import { useAppointments } from "@/lib/queries/appointments";
import { startOfToday } from "@/lib/today";
import StatTile from "@/components/ui/StatTile";

function dayLabel(iso: string) {
  const d = new Date(iso);
  d.setHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - startOfToday().getTime()) / 86400000);
  if (diff <= 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return `In ${diff} days`;
}

export default function AppointmentStats() {
  const appts = useAppointments();
  if (appts.isPending || appts.isError) return null;

  const now = Date.now();
  const upcoming = appts.data.filter((a) => !a.done && new Date(a.scheduled_at).getTime() >= now);
  const next = upcoming[0];
  const done = appts.data.filter((a) => a.done).length;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatTile
        label="Next appointment"
        value={next ? dayLabel(next.scheduled_at) : "None booked"}
        hint={next?.title}
      />
      <StatTile label="Upcoming" value={String(upcoming.length)} />
      <StatTile label="Completed, 30 days" value={String(done)} />
    </div>
  );
}