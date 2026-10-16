"use client";

import { useForm, useFieldArray, type DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { medicationSchema, type MedicationValues } from "@/lib/validation/medication";
import DrugSearch, { inputClass } from "@/components/meds/DrugSearch";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-lg font-medium">
      {label}
      {children}
      {error && <span role="alert" className="font-normal text-danger">{error}</span>}
    </label>
  );
}

export default function MedForm({
  defaultValues,
  submitLabel,
  busyLabel,
  pending,
  failed,
  onSubmit,
}: {
  defaultValues: DefaultValues<MedicationValues>;
  submitLabel: string;
  busyLabel: string;
  pending: boolean;
  failed: boolean;
  onSubmit: (values: MedicationValues) => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<MedicationValues>({ resolver: zodResolver(medicationSchema), defaultValues });

  const { fields, append, remove } = useFieldArray({ control, name: "times" });

  const name = watch("name") ?? "";
  const matched = !!watch("rxcui");
  const timesError = errors.times?.root?.message ?? errors.times?.message;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className=" grid gap-6 ">
      <DrugSearch
        value={name}
        matched={matched}
        error={errors.name?.message}
        onType={(text) => {
          setValue("name", text, { shouldValidate: true });
          setValue("rxcui", undefined);
        }}
        onPick={(drug) => {
          setValue("name", drug.name, { shouldValidate: true });
          setValue("rxcui", drug.rxcui);
        }}
      />

      <Field label="Dose" error={errors.dose?.message}>
        <input placeholder="500mg" className={inputClass} {...register("dose")} />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Pills in the box now" error={errors.pillsRemaining?.message}>
          <input type="number" inputMode="numeric" className={inputClass} {...register("pillsRemaining", { valueAsNumber: true })} />
        </Field>
        <Field label="Pills per dose" error={errors.pillsPerDose?.message}>
          <input type="number" inputMode="numeric" className={inputClass} {...register("pillsPerDose", { valueAsNumber: true })} />
        </Field>
      </div>

      <fieldset className="grid gap-3">
        <legend className="mb-1 text-lg font-medium">Times to take it</legend>

        {fields.map((field, i) => (
          <div key={field.id} className="flex items-start gap-2">
            <div className="grid flex-1 gap-1">
              <input type="time" aria-label={`Time ${i + 1}`} className={inputClass} {...register(`times.${i}.value`)} />
              {errors.times?.[i]?.value && (
                <span role="alert" className="text-danger">{errors.times[i]?.value?.message}</span>
              )}
            </div>
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label={`Remove time ${i + 1}`}
                className="grid size-14 shrink-0 place-items-center rounded-2xl border-2 border-forest"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            )}
          </div>
        ))}

        {timesError && <span role="alert" className="text-danger">{timesError}</span>}

        <button
          type="button"
          onClick={() => append({ value: "" })}
          className="inline-flex min-h-12 items-center gap-2 justify-self-start rounded-full border-2 border-forest px-5 font-medium"
        >
          <Plus className="size-5" aria-hidden="true" />
          Add another time
        </button>
      </fieldset>

      {failed && <p role="alert" className="font-medium text-danger">Couldn&apos;t save. Try again.</p>}

      <button
        type="submit"
        disabled={pending}
        className="min-h-14 rounded-full bg-mint px-6 text-xl font-semibold text-forest disabled:opacity-60"
      >
        {pending ? busyLabel : submitLabel}
      </button>
    </form>
  );
}