"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileValues } from "@/lib/validation/emergency";
import { useEmergencyProfile, useSaveProfile, type Profile } from "@/lib/queries/emergency";
import { Field, inputClass } from "@/components/ui/Field";
import { useModalClose } from "@/components/ui/ModalTrigger";

function Inner({ initial }: { initial: Profile | null }) {
  const close = useModalClose();
  const save = useSaveProfile();

  const { register, handleSubmit } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: initial?.full_name ?? "",
      conditions: initial?.conditions ?? "",
      allergies: initial?.allergies ?? "",
      doctorName: initial?.doctor_name ?? "",
      doctorPhone: initial?.doctor_phone ?? "",
      notes: initial?.notes ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit((v) => save.mutate(v, { onSuccess: close }))} className="grid gap-5">
      <Field label="Full name"><input className={inputClass} {...register("fullName")} /></Field>
      <Field label="Conditions" hint="For example: Type 2 diabetes, high blood pressure">
        <input className={inputClass} {...register("conditions")} />
      </Field>
      <Field label="Allergies"><input className={inputClass} {...register("allergies")} /></Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Doctor's name"><input className={inputClass} {...register("doctorName")} /></Field>
        <Field label="Doctor's phone"><input inputMode="tel" className={inputClass} {...register("doctorPhone")} /></Field>
      </div>
      <Field label="Notes for whoever is helping">
        <textarea rows={3} className="w-full rounded-2xl border-2 border-forest bg-white p-4 text-lg font-normal" {...register("notes")} />
      </Field>

      {save.isError && <p role="alert" className="font-medium text-danger">Couldn&apos;t save. Try again.</p>}

      <button
        type="submit"
        disabled={save.isPending}
        className="min-h-14 rounded-full bg-mint px-6 text-xl font-semibold text-forest disabled:opacity-60"
      >
        {save.isPending ? "Saving..." : "Save details"}
      </button>
    </form>
  );
}

export default function ProfileForm() {
  const profile = useEmergencyProfile();
  if (profile.isPending) return <p>Loading...</p>;
  return <Inner initial={profile.data ?? null} />;
}