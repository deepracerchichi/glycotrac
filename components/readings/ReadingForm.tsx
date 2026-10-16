"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TriangleAlert } from "lucide-react";
import { readingSchema, type ReadingValues } from "@/lib/validation/reading";
import { useAddReading } from "@/lib/queries/readings";
import { defaultSettings, useSettings } from "@/lib/queries/settings";
import { alertMessage, bpLevel, contexts, glucoseLevel, toMgdl, unitLabel } from "@/lib/readings";
import { toLocalInput } from "@/lib/symptoms";
import { Field, inputClass } from "@/components/ui/Field";
import Select from "@/components/ui/Select";
import { useModalClose } from "@/components/ui/ModalTrigger";

const blank = (v: unknown) => (v === "" || v == null ? undefined : Number(v));
const fresh = (kind: "glucose" | "bp") => ({ kind, context: "fasting" as const, note: "", measuredAt: toLocalInput() });
const contextOptions = Object.entries(contexts).map(([value, label]) => ({ value, label }));

export default function ReadingForm() {
  const close = useModalClose();
  const add = useAddReading();
  const { data: s = defaultSettings } = useSettings();
  const [warning, setWarning] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, reset, setError, clearErrors, control, formState: { errors } } =
    useForm<ReadingValues>({ resolver: zodResolver(readingSchema), defaultValues: fresh("glucose") });

  const kind = watch("kind");

  function finish(k: "glucose" | "bp", message: string | null) {
    if (message) {
      setWarning(message);
      reset(fresh(k));
    } else {
      close();
    }
  }

  function onSubmit(v: ReadingValues) {
    const common = { note: v.note?.trim() ? v.note.trim() : null, measuredAt: v.measuredAt };

    if (v.kind === "glucose") {
      const mg = toMgdl(v.glucose!, s.glucose_unit);
      if (mg < 10 || mg > 1000) {
        return setError("glucose", { message: "That doesn't look right. Check the number and unit." });
      }
      const message = alertMessage("glucose", glucoseLevel(mg, s));
      add.mutate(
        { kind: "glucose", context: v.context ?? null, glucoseMgdl: mg, systolic: null, diastolic: null, ...common },
        { onSuccess: () => finish("glucose", message) }
      );
      return;
    }

    const message = alertMessage("bp", bpLevel(v.systolic!, v.diastolic!, s));
    add.mutate(
      { kind: "bp", context: null, glucoseMgdl: null, systolic: v.systolic!, diastolic: v.diastolic!, ...common },
      { onSuccess: () => finish("bp", message) }
    );
  }

  if (warning) {
    return (
      <div className="grid gap-5">
        <p className="font-medium text-[#2f7d14]">Saved.</p>
        <p role="alert" className="flex items-start gap-2 rounded-2xl bg-[#fbe0e0] p-4 text-lg font-medium text-[#a31515]">
          <TriangleAlert className="mt-1 size-5 shrink-0" aria-hidden="true" />
          {warning}
        </p>
        <button onClick={close} className="min-h-14 rounded-full bg-forest px-6 text-xl font-semibold text-white">
          I&apos;ve read this
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
      <div role="group" aria-label="Reading type" className="grid grid-cols-2 gap-2">
        {([["glucose", "Blood sugar"], ["bp", "Blood pressure"]] as const).map(([k, label]) => (
          <button
            key={k}
            type="button"
            aria-pressed={kind === k}
            onClick={() => { setValue("kind", k); clearErrors(); }}
            className={`min-h-14 rounded-2xl border-2 border-forest font-medium ${kind === k ? "bg-forest text-white" : "bg-white"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {kind === "glucose" ? (
        <>
          <Field label={`Reading (${unitLabel(s.glucose_unit)})`} error={errors.glucose?.message}>
            <input type="number" step="any" inputMode="decimal" className={inputClass} {...register("glucose", { setValueAs: blank })} />
          </Field>
          <Controller
            control={control}
            name="context"
            render={({ field }) => (
              <Select label="When was it?" value={field.value ?? "fasting"} onChange={field.onChange} options={contextOptions} />
            )}
          />
        </>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Top number (systolic)" error={errors.systolic?.message}>
            <input type="number" inputMode="numeric" className={inputClass} {...register("systolic", { setValueAs: blank })} />
          </Field>
          <Field label="Bottom number (diastolic)" error={errors.diastolic?.message}>
            <input type="number" inputMode="numeric" className={inputClass} {...register("diastolic", { setValueAs: blank })} />
          </Field>
        </div>
      )}

      <Field label="When did you measure it?" error={errors.measuredAt?.message}>
        <input type="datetime-local" className={inputClass} {...register("measuredAt")} />
      </Field>

      <Field label="Note (optional)" error={errors.note?.message}>
        <textarea rows={2} className="w-full rounded-2xl border-2 border-forest bg-white p-4 text-lg font-normal" {...register("note")} />
      </Field>

      {add.isError && <p role="alert" className="font-medium text-danger">Couldn&apos;t save. Try again.</p>}

      <button
        type="submit"
        disabled={add.isPending}
        className="min-h-14 rounded-full bg-mint px-6 text-xl font-semibold text-forest disabled:opacity-60"
      >
        {add.isPending ? "Saving..." : "Save reading"}
      </button>

      <p className="text-base text-ink/70">
        This app records your readings. It can&apos;t tell you what to do about them. Follow your doctor&apos;s advice.
      </p>
    </form>
  );
}