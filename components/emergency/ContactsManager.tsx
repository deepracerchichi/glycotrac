"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { contactSchema, type ContactValues } from "@/lib/validation/emergency";
import { useAddContact, useContacts, useDeleteContact } from "@/lib/queries/emergency";
import { displayPhone } from "@/lib/phone";
import { Field, inputClass } from "@/components/ui/Field";

const fresh = { name: "", relationship: "", phone: "", notifyOnMissed: false, consent: false };

export default function ContactsManager() {
  const contacts = useContacts();
  const add = useAddContact();
  const del = useDeleteContact();

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: fresh,
  });
  const notify = watch("notifyOnMissed");

  return (
    <section className="grid gap-6 rounded-3xl bg-white p-6 ring-1 ring-black/5 print:hidden">
      <h2 className="text-2xl font-medium">Contacts</h2>

      {contacts.data && contacts.data.length > 0 && (
        <ul className="grid gap-3">
          {contacts.data.map((c) => (
            <li key={c.id} className="flex items-start justify-between gap-3 rounded-2xl bg-paper p-4">
              <div>
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
      )}

      <form onSubmit={handleSubmit((v) => add.mutate(v, { onSuccess: () => reset(fresh) }))} className="grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Name" error={errors.name?.message}><input className={inputClass} {...register("name")} /></Field>
          <Field label="Relationship"><input placeholder="Son, daughter, friend" className={inputClass} {...register("relationship")} /></Field>
        </div>
        <Field label="Phone" error={errors.phone?.message}>
          <input inputMode="tel" placeholder="0801 234 5678" className={inputClass} {...register("phone")} />
        </Field>

        <label className="flex items-start gap-3 text-lg">
          <input type="checkbox" className="mt-1 size-6 shrink-0 accent-forest" {...register("notifyOnMissed")} />
          <span>
            <span className="font-medium">Text them if I miss a dose</span>
            <span className="block text-base text-ink/70">Sent about 2 hours after the dose time if it isn&apos;t marked taken. The text doesn&apos;t name any medication.</span>
          </span>
        </label>

        {notify && (
          <label className="flex items-start gap-3 text-lg">
            <input type="checkbox" className="mt-1 size-6 shrink-0 accent-forest" {...register("consent")} />
            <span>
              <span className="font-medium">They&apos;ve agreed to get these texts</span>
              {errors.consent && <span role="alert" className="block text-base text-danger">{errors.consent.message}</span>}
            </span>
          </label>
        )}

        {add.isError && <p role="alert" className="font-medium text-danger">Couldn&apos;t save. Try again.</p>}

        <button
          type="submit"
          disabled={add.isPending}
          className="min-h-14 rounded-full border-2 border-forest px-6 text-xl font-semibold disabled:opacity-60"
        >
          {add.isPending ? "Saving..." : "Add contact"}
        </button>
      </form>
    </section>
  );
}