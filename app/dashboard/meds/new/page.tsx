"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { medicationSchema, type MedicationValues } from "@/lib/validation/medication";
import { useAddMedication } from "@/lib/queries/medication";
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

export default function NewMedicationPage() {
  const router = useRouter();
  const addMedication = useAddMedication();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MedicationValues>({
    resolver: zodResolver(medicationSchema),
    defaultValues: { name: "", dose: "", time: "" },
  });

  const name = watch("name") ?? "";
  const matched = !!watch("rxcui");

  return (
    <div className="mx-auto max-w-xl">
      <Link href="/dashboard/meds" className="inline-flex min-h-12 items-center text-lg underline">
        ← Back to medications
      </Link>
      <h1 className="mt-2 text-4xl font-medium tracking-tight md:text-5xl">Add medication</h1>

      <form
        onSubmit={handleSubmit((values) =>
          addMedication.mutate(values, { onSuccess: () => router.push("/dashboard") })
        )}
        className="mt-8 grid gap-6 rounded-3xl bg-white p-6 ring-1 ring-black/5"
      >
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

        <Field label="Time to take it" error={errors.time?.message}>
          <input type="time" className={inputClass} {...register("time")} />
        </Field>

        {addMedication.isError && (
          <p role="alert" className="font-medium text-danger">Couldn&apos;t save. Try again.</p>
        )}

        <button
          type="submit"
          disabled={addMedication.isPending}
          className="min-h-14 rounded-full bg-mint px-6 text-xl font-semibold text-forest disabled:opacity-60"
        >
          {addMedication.isPending ? "Saving..." : "Save medication"}
        </button>
      </form>
    </div>
  );
}