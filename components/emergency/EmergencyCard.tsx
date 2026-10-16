"use client";

import { Phone, Printer } from "lucide-react";
import { useContacts, useEmergencyProfile } from "@/lib/queries/emergency";
import { useMedications } from "@/lib/queries/medication";
import { displayPhone } from "@/lib/phone";

function Line({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-base text-ink/70">{label}</p>
      <p className="text-xl">{value}</p>
    </div>
  );
}

export default function EmergencyCard() {
  const profile = useEmergencyProfile();
  const contacts = useContacts();
  const meds = useMedications();
  const p = profile.data;

  return (
    <section className="rounded-3xl border-4 border-[#a31515] bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-3xl font-medium tracking-tight">Medical information</h2>
        <button
          onClick={() => window.print()}
          className="inline-flex min-h-12 items-center gap-2 rounded-full bg-mint px-5 font-medium text-forest print:hidden"
        >
          <Printer className="size-5" aria-hidden="true" />
          Print
        </button>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Line label="Name" value={p?.full_name} />
        <Line label="Conditions" value={p?.conditions} />
        <Line label="Allergies" value={p?.allergies} />
        <Line label="Doctor" value={[p?.doctor_name, p?.doctor_phone].filter(Boolean).join(" · ")} />
      </div>

      <h3 className="mt-8 text-xl font-medium">Medications</h3>
      {meds.data && meds.data.length > 0 ? (
        <ul className="mt-2 grid gap-1 text-lg">
          {meds.data.map((m) => (
            <li key={m.id}>
              <span className="font-medium">{m.name}</span> · {m.dose} ·{" "}
              {[...m.schedules]
                .sort((a: { time_of_day: string }, b: { time_of_day: string }) => a.time_of_day.localeCompare(b.time_of_day))
                .map((s: { time_of_day: string }) => s.time_of_day.slice(0, 5))
                .join(", ")}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-ink/70">None added.</p>
      )}

      <h3 className="mt-8 text-xl font-medium">Contacts</h3>
      {contacts.data && contacts.data.length > 0 ? (
        <ul className="mt-2 grid gap-3">
          {contacts.data.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-lg">
                <span className="font-medium">{c.name}</span>
                {c.relationship ? ` (${c.relationship})` : ""}
              </span>
              <a
                href={`tel:+${c.phone}`}
                className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-forest px-4 text-lg font-medium"
              >
                <Phone className="size-5" aria-hidden="true" />
                {displayPhone(c.phone)}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-ink/70">No contacts added.</p>
      )}

      <Line label="Notes" value={p?.notes} />
    </section>
  );
}