"use client";

import { Pencil } from "lucide-react";
import { useUpdateMedication } from "@/lib/queries/medication";
import MedForm from "@/components/meds/MedForm";
import ModalTrigger, { triggerOutline, useModalClose } from "@/components/ui/ModalTrigger";

export type EditableMed = {
  id: string;
  name: string;
  rxcui: string | null;
  dose: string;
  pills_remaining: number;
  pills_per_dose: number;
  schedules: { time_of_day: string }[];
};

function EditForm({ med }: { med: EditableMed }) {
  const close = useModalClose();
  const update = useUpdateMedication(med.id);

  const times = [...med.schedules]
    .sort((a, b) => a.time_of_day.localeCompare(b.time_of_day))
    .map((s) => ({ value: s.time_of_day.slice(0, 5) }));

  return (
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
      onSubmit={(values) => update.mutate(values, { onSuccess: close })}
    />
  );
}

export default function EditMedication({ med }: { med: EditableMed }) {
  return (
    <ModalTrigger
      label="Edit"
      title="Edit medication"
      icon={<Pencil className="size-5" aria-hidden="true" />}
      className={triggerOutline}
    >
      <EditForm med={med} />
    </ModalTrigger>
  );
}