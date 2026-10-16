"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSaveSettings, useSettings, type Settings } from "@/lib/queries/settings";
import { fromMgdl, toMgdl, unitLabel, type GlucoseUnit } from "@/lib/readings";
import { Field, inputClass } from "@/components/ui/Field";

type Form = { unit: GlucoseUnit; low?: number; high?: number; sys?: number; dia?: number; foot: boolean };

const blank = (v: unknown) => (v === "" || v == null ? undefined : Number(v));

function Inner({ initial }: { initial: Settings }) {
  const save = useSaveSettings();
  const [saved, setSaved] = useState(false);
  const u = initial.glucose_unit;

  const { register, handleSubmit, watch, getValues, setValue, setError, formState: { errors } } = useForm<Form>({
    defaultValues: {
      unit: u,
      low: initial.glucose_target_low != null ? fromMgdl(initial.glucose_target_low, u) : undefined,
      high: initial.glucose_target_high != null ? fromMgdl(initial.glucose_target_high, u) : undefined,
      sys: initial.bp_sys_max ?? undefined,
      dia: initial.bp_dia_max ?? undefined,
      foot: initial.foot_check_enabled,
    },
  });

  const unit = watch("unit");

  function changeUnit(next: GlucoseUnit) {
    const prev = getValues("unit");
    if (prev === next) return;
    (["low", "high"] as const).forEach((k) => {
      const v = getValues(k);
      if (v !== undefined && !Number.isNaN(v)) setValue(k, fromMgdl(toMgdl(v, prev), next));
    });
    setValue("unit", next);
  }

  function onSubmit(v: Form) {
    setSaved(false);
    if (v.low != null && v.high != null && v.low >= v.high) {
      return setError("high", { message: "The upper target must be higher than the lower one" });
    }
    save.mutate(
      {
        glucose_unit: v.unit,
        glucose_target_low: v.low != null ? toMgdl(v.low, v.unit) : null,
        glucose_target_high: v.high != null ? toMgdl(v.high, v.unit) : null,
        bp_sys_max: v.sys ?? null,
        bp_dia_max: v.dia ?? null,
        foot_check_enabled: v.foot,
      },
      { onSuccess: () => setSaved(true) }
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 rounded-3xl bg-white p-6 ring-1 ring-black/5">
      <fieldset className="grid gap-3">
        <legend className="mb-1 text-lg font-medium">Blood sugar unit</legend>
        <div className="grid grid-cols-2 gap-2">
          {(["mgdl", "mmol"] as const).map((o) => (
            <button
              key={o}
              type="button"
              aria-pressed={unit === o}
              onClick={() => changeUnit(o)}
              className={`min-h-14 rounded-2xl border-2 border-forest font-medium ${unit === o ? "bg-forest text-white" : "bg-white"}`}
            >
              {unitLabel(o)}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4">
        <p className="text-lg font-medium">Blood sugar target ({unitLabel(unit)})</p>
        <p className="text-base text-ink/70">Ask your doctor what your targets should be. Leave blank if you don&apos;t know yet.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Lowest">
            <input type="number" step="any" inputMode="decimal" className={inputClass} {...register("low", { setValueAs: blank })} />
          </Field>
          <Field label="Highest" error={errors.high?.message}>
            <input type="number" step="any" inputMode="decimal" className={inputClass} {...register("high", { setValueAs: blank })} />
          </Field>
        </div>
      </div>

      <div className="grid gap-4">
        <p className="text-lg font-medium">Blood pressure: highest your doctor wants</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Top number (systolic)">
            <input type="number" inputMode="numeric" className={inputClass} {...register("sys", { setValueAs: blank })} />
          </Field>
          <Field label="Bottom number (diastolic)">
            <input type="number" inputMode="numeric" className={inputClass} {...register("dia", { setValueAs: blank })} />
          </Field>
        </div>
      </div>

      <label className="flex items-start gap-3 text-lg">
        <input type="checkbox" className="mt-1 size-6 shrink-0 accent-forest" {...register("foot")} />
        <span>
          <span className="font-medium">Weekly foot-check reminder</span>
          <span className="block text-base text-ink/70">A notification on Sunday evening to look at both feet.</span>
        </span>
      </label>

      {save.isError && <p role="alert" className="font-medium text-danger">Couldn&apos;t save. Try again.</p>}
      {saved && <p role="status" className="font-medium text-[#2f7d14]">Saved.</p>}

      <button
        type="submit"
        disabled={save.isPending}
        className="min-h-14 rounded-full bg-mint px-6 text-xl font-semibold text-forest disabled:opacity-60"
      >
        {save.isPending ? "Saving..." : "Save settings"}
      </button>
    </form>
  );
}

export default function SettingsForm() {
  const settings = useSettings();
  if (settings.isPending) return <p>Loading...</p>;
  if (settings.isError) return <p role="alert" className="font-medium text-danger">Couldn&apos;t load. Refresh to try again.</p>;
  return <Inner initial={settings.data} />;
}