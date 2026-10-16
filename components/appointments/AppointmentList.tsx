"use client";

import { Check, Trash2 } from "lucide-react";
import { useAppointments, useDeleteAppointment, useSetAppointmentDone, type Appointment } from "@/lib/queries/appointments";
import { kinds } from "@/lib/appointments";
import { startOfToday } from "@/lib/today";

function Row({ a }: { a: Appointment }) {
  const setDone = useSetAppointmentDone();
  const del = useDeleteAppointment();

  return (
    <li className="flex items-start justify-between gap-3 rounded-3xl bg-white p-5 ring-1 ring-black/5">
      <div className="min-w-0">
        <p className={`text-xl font-medium ${a.done ? "line-through opacity-60" : ""}`}>{a.title}</p>
        <p className="text-ink/70">
          {kinds[a.kind]} ·{" "}
          {new Date(a.scheduled_at).toLocaleString("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        {a.location && <p className="text-lg">{a.location}</p>}
        {a.notes && <p className="mt-1 text-lg">{a.notes}</p>}
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          onClick={() => setDone.mutate({ id: a.id, done: !a.done })}
          aria-label={a.done ? "Mark as not done" : "Mark as done"}
          aria-pressed={a.done}
          className={`grid size-12 place-items-center rounded-full border-2 border-forest ${a.done ? "bg-forest text-white" : ""}`}
        >
          <Check className="size-5" aria-hidden="true" />
        </button>
        <button
          onClick={() => del.mutate(a.id)}
          aria-label={`Delete ${a.title}`}
          className="grid size-12 place-items-center rounded-full border-2 border-forest"
        >
          <Trash2 className="size-5" aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}

export default function AppointmentList() {
  const appts = useAppointments();

  if (appts.isPending) return <p>Loading...</p>;
  if (appts.isError) return <p role="alert" className="font-medium text-danger">Couldn&apos;t load. Refresh to try again.</p>;

  const today = startOfToday().getTime();
  const upcoming = appts.data.filter((a) => !a.done && new Date(a.scheduled_at).getTime() >= today);
  const earlier = appts.data.filter((a) => !upcoming.includes(a)).reverse();

  return (
    <div className="grid gap-6">
      <section>
        <h2 className="mb-3 text-2xl font-medium">Upcoming</h2>
        {upcoming.length === 0 ? (
          <p className="rounded-3xl bg-white p-6 text-xl ring-1 ring-black/5">Nothing booked.</p>
        ) : (
          <ul className="grid gap-3">{upcoming.map((a) => <Row key={a.id} a={a} />)}</ul>
        )}
      </section>

      {earlier.length > 0 && (
        <section>
          <h2 className="mb-3 text-2xl font-medium">Earlier (last 30 days)</h2>
          <ul className="grid gap-3">{earlier.map((a) => <Row key={a.id} a={a} />)}</ul>
        </section>
      )}
    </div>
  );
}