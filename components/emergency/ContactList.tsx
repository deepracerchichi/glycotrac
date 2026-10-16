"use client";

import { Trash2 } from "lucide-react";
import { useContacts, useDeleteContact } from "@/lib/queries/emergency";
import { displayPhone } from "@/lib/phone";

export default function ContactList() {
  const contacts = useContacts();
  const del = useDeleteContact();

  return (
    <section className="rounded-3xl bg-white p-5 ring-1 ring-black/5 print:hidden">
      <h2 className="text-2xl font-medium">Your contacts</h2>

      {contacts.isPending ? (
        <p className="mt-3">Loading...</p>
      ) : contacts.data && contacts.data.length > 0 ? (
        <ul className="mt-4 grid gap-3">
          {contacts.data.map((c) => (
            <li key={c.id} className="flex items-start justify-between gap-3 rounded-2xl bg-paper p-4">
              <div className="min-w-0">
                <p className="text-lg font-medium">
                  {c.name}
                  {c.relationship ? ` (${c.relationship})` : ""}
                </p>
                <p className="text-ink/70">{displayPhone(c.phone)}</p>
                {c.notify_on_missed && <p className="mt-1 text-base font-medium">Gets a text if a dose is missed</p>}
              </div>
              <button
                onClick={() => del.mutate(c.id)}
                aria-label={`Remove ${c.name}`}
                className="grid size-12 shrink-0 place-items-center rounded-full border-2 border-forest"
              >
                <Trash2 className="size-5" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-ink/70">No contacts yet. Add someone who should be called in an emergency.</p>
      )}
    </section>
  );
}