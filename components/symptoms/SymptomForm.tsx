"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TriangleAlert } from "lucide-react";
import { symptomSchema, type SymptomValues } from "@/lib/validation/symptom";
import { useAddSymptom } from "@/lib/queries/symptoms";
import { severityLabels, symptomOptions, toLocalInput } from "@/lib/symptoms";
import { inputClass } from "@/components/meds/DrugSearch";

const fresh = () => ({ name: "", severity: 1, note: "", occurredAt: toLocalInput() });

export default function SymptomForm() {
  const add = useAddSymptom();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SymptomValues>({ resolver: zodResolver(symptomSchema), defaultValues: fresh() });

  const name = watch("name");
  const severity = watch("severity");

  return (
    <form
      onSubmit={handleSubmit((v) => add.mutate(v, { onSuccess: () => reset(fresh()) }))}
      className="grid gap-6 rounded-3xl bg-white p-6 ring-1 ring-black/5"
    >
      <div className="grid gap-3">
        <p className="text-lg font-medium">What are you feeling?</p>
        <div className="flex flex-wrap gap-2">
          {symptomOptions.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={name === option}
              onClick={() => setValue("name", option, { shouldValidate: true })}
              className={`min-h-12 rounded-full border-2 border-forest px-4 font-medium ${
                name === option ? "bg-forest text-white" : "bg-white"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <input
          aria-label="Or type your own"
          placeholder="Or type your own"
          className={inputClass}
          {...register("name")}
        />
        {errors.name && <span role="alert" className="text-danger">{errors.name.message}</span>}
      </div>

      <div className="grid gap-3">
        <p className="text-lg font-medium">How strong is it?</p>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              type="button"
              aria-pressed={severity === n}
              onClick={() => setValue("severity", n)}
              className={`min-h-14 rounded-2xl border-2 border-forest font-medium ${
                severity === n ? "bg-forest text-white" : "bg-white"
              }`}
            >
              {severityLabels[n]}
            </button>
          ))}
        </div>

        {severity === 3 && (
          <p role="alert" className="flex items-start gap-2 rounded-2xl bg-[#fbe0e0] p-4 font-medium text-[#a31515]">
            <TriangleAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            If you feel very unwell, faint or confused, or think it&apos;s an emergency, get medical help now.
          </p>
        )}
      </div>

      <label className="grid gap-2 text-lg font-medium">
        When did it start?
        <input type="datetime-local" className={inputClass} {...register("occurredAt")} />
        {errors.occurredAt && <span role="alert" className="font-normal text-danger">{errors.occurredAt.message}</span>}
      </label>

      <label className="grid gap-2 text-lg font-medium">
        Note (optional)
        <textarea rows={3} className="w-full rounded-2xl border-2 border-forest bg-white p-4 text-lg font-normal" {...register("note")} />
        {errors.note && <span role="alert" className="font-normal text-danger">{errors.note.message}</span>}
      </label>

      {add.isError && <p role="alert" className="font-medium text-danger">Couldn&apos;t save. Try again.</p>}

      <button
        type="submit"
        disabled={add.isPending}
        className="min-h-14 rounded-full bg-mint px-6 text-xl font-semibold text-forest disabled:opacity-60"
      >
        {add.isPending ? "Saving..." : "Save symptom"}
      </button>

      <p className="text-base text-ink/70">
        This app records symptoms. It can&apos;t diagnose them or tell you what they mean. Share your log with your doctor.
      </p>
    </form>
  );
}