"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactValues } from "@/lib/validation/emergency";
import { useAddContact } from "@/lib/queries/emergency";
import { Field, inputClass } from "@/components/ui/Field";
import { useModalClose } from "@/components/ui/ModalTrigger";

export default function ContactForm() {
  const close = useModalClose();
  const add = useAddContact();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", relationship: "", phone: "", notifyOnMissed: false, consent: false },
  });
  const notify = watch("notifyOnMissed");

  return (
    <form onSubmit={handleSubmit((v) => add.mutate(v, { onSuccess: close }))} className="grid gap-5">
      <Field label="Name" error={errors.name?.message}>
        <input className={inputClass} {...register("name")} />
      </Field>
      <Field label="Relationship">
        <input placeholder="Son, daughter, friend" className={inputClass} {...register("relationship")} />
      </Field>
      <Field label="Phone" error={errors.phone?.message}>
        <input inputMode="tel" placeholder="0801 234 5678" className={inputClass} {...register("phone")} />
      </Field>

      <label className="flex items-start gap-3 text-lg">
        <input type="checkbox" className="mt-1 size-6 shrink-0 accent-forest" {...register("notifyOnMissed")} />
        <span>
          <span className="font-medium">Text them if I miss a dose</span>
          <span className="block text-base text-ink/70">
            Sent about 2 hours after the dose time if it isn&apos;t marked taken. The text doesn&apos;t name any medication.
          </span>
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
        className="min-h-14 rounded-full bg-mint px-6 text-xl font-semibold text-forest disabled:opacity-60"
      >
        {add.isPending ? "Saving..." : "Add contact"}
      </button>
    </form>
  );
}