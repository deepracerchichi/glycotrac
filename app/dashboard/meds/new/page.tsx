"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAddMedication } from "@/lib/queries/medication";
import MedForm from "@/components/meds/MedForm";

export default function NewMedicationPage() {
  const router = useRouter();
  const add = useAddMedication();

  return (
    <div className="mx-auto max-w-xl">
      <Link href="/dashboard/meds" className="inline-flex min-h-12 items-center text-lg underline">
        ← Back to medications
      </Link>
      <h1 className="mt-2 text-4xl font-medium tracking-tight md:text-5xl">Add medication</h1>

      <MedForm
        defaultValues={{ name: "", dose: "", times: [{ value: "" }] }}
        submitLabel="Save medication"
        busyLabel="Saving..."
        pending={add.isPending}
        failed={add.isError}
        onSubmit={(values) => add.mutate(values, { onSuccess: () => router.push("/dashboard") })}
      />
    </div>
  );
}