"use client";

import { useState } from "react";
import { PackagePlus, Trash2 } from "lucide-react";
import { useDeleteMedication, useRefill } from "@/lib/queries/medication";
import ModalTrigger, { triggerOutline, useModalClose } from "@/components/ui/ModalTrigger";
import EditMedication, { type EditableMed } from "@/components/meds/EditMedication";
import { inputClass } from "@/components/ui/Field";

function RefillForm({ id }: { id: string }) {
  const close = useModalClose();
  const refill = useRefill();
  const [pills, setPills] = useState(30);
  const valid = Number.isInteger(pills) && pills >= 1;

  return (
    <div className="grid gap-4">
      <label htmlFor={`pills-${id}`} className="grid gap-2 text-lg font-medium">
        Pills you added
        <input
          id={`pills-${id}`}
          type="number"
          inputMode="numeric"
          min={1}
          value={Number.isNaN(pills) ? "" : pills}
          onChange={(e) => setPills(Number(e.target.value))}
          className={inputClass}
        />
      </label>
      {refill.isError && <p role="alert" className="font-medium text-danger">Couldn&apos;t save. Try again.</p>}
      <button
        onClick={() => refill.mutate({ id, pills }, { onSuccess: close })}
        disabled={!valid || refill.isPending}
        className="min-h-14 rounded-full bg-mint px-6 text-xl font-semibold text-forest disabled:opacity-60"
      >
        {refill.isPending ? "Saving..." : "Add pills"}
      </button>
    </div>
  );
}

function DeleteConfirm({ id, name }: { id: string; name: string }) {
  const close = useModalClose();
  const del = useDeleteMedication();

  return (
    <div className="grid gap-4">
      <p className="text-lg">
        This removes <span className="font-medium">{name}</span> and all of its dose history. You can&apos;t undo it.
      </p>
      {del.isError && <p role="alert" className="font-medium text-danger">Couldn&apos;t delete. Try again.</p>}
      <div className="grid gap-3 sm:grid-cols-2">
        <button onClick={close} className="min-h-14 rounded-full border-2 border-forest px-6 text-lg font-semibold">
          Keep it
        </button>
        <button
          onClick={() => del.mutate(id, { onSuccess: close })}
          disabled={del.isPending}
          className="min-h-14 rounded-full bg-[#a31515] px-6 text-lg font-semibold text-white disabled:opacity-60"
        >
          {del.isPending ? "Deleting..." : "Yes, delete"}
        </button>
      </div>
    </div>
  );
}

export default function MedActions({ med }: { med: EditableMed }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <ModalTrigger
        label="Refilled"
        title="Log a refill"
        description={med.name}
        icon={<PackagePlus className="size-5" aria-hidden="true" />}
        className={triggerOutline}
      >
        <RefillForm id={med.id} />
      </ModalTrigger>

      <EditMedication med={med} />

      <ModalTrigger
        label="Delete"
        title="Delete medication?"
        icon={<Trash2 className="size-5" aria-hidden="true" />}
        className={triggerOutline}
      >
        <DeleteConfirm id={med.id} name={med.name} />
      </ModalTrigger>
    </div>
  );
}