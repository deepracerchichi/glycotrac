"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appointmentSchema, type AppointmentValues } from "@/lib/validation/appointment";
import { useAddAppointment } from "@/lib/queries/appointments";
import { kinds } from "@/lib/appointments";
import { Field, inputClass } from "@/components/ui/Field";

const fresh = () => ({ title: "", kind: "doctor" as const, scheduledAt: "", location: "", notes: "" });

export default function AppointmentForm() {
  const add = useAddAppointment();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AppointmentValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: fresh(),
  });

  return (
    <form
      onSubmit={handleSubmit((v) => add.mutate(v, { onSuccess: () => reset(fresh()) }))}
      className="grid gap-6 rounded-3xl bg-white p-6 ring-1 ring-black/5"
    >
      <Field label="What is it?" error={errors.title?.message}>
        <input placeholder="Clinic visit" className={inputClass} {...register("title")} />
      </Field>

      <Field label="Type">
        <select className={inputClass} {...register("kind")}>
          {Object.entries(kinds).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </Field>

      <Field label="Date and time" error={errors.scheduledAt?.message}>
        <input type="datetime-local" className={inputClass} {...register("scheduledAt")} />
      </Field>

      <Field label="Where (optional)" error={errors.location?.message}>
        <input className={inputClass} {...register("location")} />
      </Field>

      <Field label="Notes (optional)" error={errors.notes?.message}>
        <textarea rows={3} className="w-full rounded-2xl border-2 border-forest bg-white p-4 text-lg font-normal" {...register("notes")} />
      </Field>

      {add.isError && <p role="alert" className="font-medium text-danger">Couldn&apos;t save. Try again.</p>}

      <button
        type="submit"
        disabled={add.isPending}
        className="min-h-14 rounded-full bg-mint px-6 text-xl font-semibold text-forest disabled:opacity-60"
      >
        {add.isPending ? "Saving..." : "Add appointment"}
      </button>

      <p className="text-base text-ink/70">You&apos;ll get a notification the day before.</p>
    </form>
  );
}