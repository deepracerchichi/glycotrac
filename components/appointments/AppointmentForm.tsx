"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appointmentSchema, type AppointmentValues } from "@/lib/validation/appointment";
import { useAddAppointment } from "@/lib/queries/appointments";
import { kinds } from "@/lib/appointments";
import { Field, inputClass } from "@/components/ui/Field";
import Select from "@/components/ui/Select";
import { useModalClose } from "@/components/ui/ModalTrigger";

const kindOptions = Object.entries(kinds).map(([value, label]) => ({ value, label }));

export default function AppointmentForm() {
  const close = useModalClose();
  const add = useAddAppointment();

  const { register, handleSubmit, control, formState: { errors } } = useForm<AppointmentValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: { title: "", kind: "doctor", scheduledAt: "", location: "", notes: "" },
  });

  return (
    <form onSubmit={handleSubmit((v) => add.mutate(v, { onSuccess: close }))} className="grid gap-6">
      <Field label="What is it?" error={errors.title?.message}>
        <input placeholder="Clinic visit" className={inputClass} {...register("title")} />
      </Field>

      <Controller
        control={control}
        name="kind"
        render={({ field }) => (
          <Select label="Type" value={field.value} onChange={field.onChange} options={kindOptions} />
        )}
      />

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