"use client";

import { useAddMedication } from "@/lib/queries/medication";
import MedForm from "@/components/meds/MedForm";
import ModalTrigger, { useModalClose } from "@/components/ui/ModalTrigger";

function AddForm() {
  const close = useModalClose();
  const add = useAddMedication();

  return (
    <MedForm
      defaultValues={{ name: "", dose: "", times: [{ value: "" }] }}
      submitLabel="Save medication"
      busyLabel="Saving..."
      pending={add.isPending}
      failed={add.isError}
      onSubmit={(values) => add.mutate(values, { onSuccess: close })}
    />
  );
}

export default function AddMedication({ className }: { className?: string }) {
  return (
    <ModalTrigger
      label="Add medication"
      title="Add medication"
      description="Search for the drug, then set the dose and times."
      className={className}
    >
      <AddForm />
    </ModalTrigger>
  );
}