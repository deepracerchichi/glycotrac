"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMedications, useUpdateMedication } from "@/lib/queries/medication";
import MedForm from "@/components/meds/MedForm";

export default function EditMedicationPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const meds = useMedications();
  const update = useUpdateMedication(id);

  const med = meds.data?.find((m) => m.id === id);

  if (meds.isPending) return <p>Loading...</p>;

  if (!med) {
    return (
      <div className="mx-auto max-w-xl">
        <p className="text-xl">We couldn&apos;t find that medication.</p>
        <Link href="/dashboard/meds" className="mt-4 inline-flex min-h-12 items-center underline">
          Back to medications
        </Link>
      </div>
    );
  }

  const times = [...med.schedules]
    .sort((a: { time_of_day: string }, b: { time_of_day: string }) => a.time_of_day.localeCompare(b.time_of_day))
    .map((s: { time_of_day: string }) => ({ value: s.time_of_day.slice(0, 5) }));

  return (
    <div className="mx-auto max-w-xl">
      <Link href="/dashboard/meds" className="inline-flex min-h-12 items-center text-lg underline">
        ← Back to medications
      </Link>
      <h1 className="mt-2 text-4xl font-medium tracking-tight md:text-5xl">Edit medication</h1>

      <MedForm
        defaultValues={{
          name: med.name,
          rxcui: med.rxcui ?? undefined,
          dose: med.dose,
          pillsRemaining: med.pills_remaining,
          pillsPerDose: med.pills_per_dose,
          times,
        }}
        submitLabel="Save changes"
        busyLabel="Saving..."
        pending={update.isPending}
        failed={update.isError}
        onSubmit={(values) => update.mutate(values, { onSuccess: () => router.push("/dashboard/meds") })}
      />
    </div>
  );
}