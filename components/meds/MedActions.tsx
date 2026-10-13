"use client";

import { useState } from "react";
import Link from "next/link";
import { PackagePlus, Pencil, Trash2 } from "lucide-react";
import { useDeleteMedication, useRefill } from "@/lib/queries/medication";

const btn = "inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-forest px-4 font-medium";

export default function MedActions({ id, name }: { id: string; name: string }) {
  const [mode, setMode] = useState<"idle" | "refill" | "delete">("idle");
  const [pills, setPills] = useState(30);
  const refill = useRefill();
  const del = useDeleteMedication();

  const validPills = Number.isInteger(pills) && pills >= 1;

  if (mode === "refill") {
    return (
      <div className="mt-4 grid gap-3 rounded-2xl bg-paper p-4">
        <label htmlFor={`pills-${id}`} className="text-lg font-medium">Pills you added</label>
        <input
          id={`pills-${id}`}
          type="number"
          inputMode="numeric"
          min={1}
          value={Number.isNaN(pills) ? "" : pills}
          onChange={(e) => setPills(Number(e.target.value))}
          className="min-h-14 w-full rounded-2xl border-2 border-forest bg-white px-4 text-lg"
        />
        {refill.isError && <p role="alert" className="font-medium text-danger">Couldn&apos;t save. Try again.</p>}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => refill.mutate({ id, pills }, { onSuccess: () => setMode("idle") })}
            disabled={!validPills || refill.isPending}
            className="min-h-12 rounded-full bg-mint px-5 font-medium text-forest disabled:opacity-60"
          >
            {refill.isPending ? "Saving..." : "Add pills"}
          </button>
          <button onClick={() => setMode("idle")} className={btn}>Cancel</button>
        </div>
      </div>
    );
  }

  if (mode === "delete") {
    return (
      <div className="mt-4 grid gap-3 rounded-2xl bg-[#fbe0e0] p-4">
        <p className="text-lg font-medium">Delete {name}? This also removes its dose history.</p>
        {del.isError && <p role="alert" className="font-medium text-danger">Couldn&apos;t delete. Try again.</p>}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => del.mutate(id)}
            disabled={del.isPending}
            className="min-h-12 rounded-full bg-[#a31515] px-5 font-medium text-white disabled:opacity-60"
          >
            {del.isPending ? "Deleting..." : "Yes, delete"}
          </button>
          <button onClick={() => setMode("idle")} className={btn}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <button onClick={() => setMode("refill")} className={btn}>
        <PackagePlus className="size-5" aria-hidden="true" />
        Refilled
      </button>
      <Link href={`/dashboard/meds/${id}/edit`} className={btn}>
        <Pencil className="size-5" aria-hidden="true" />
        Edit
      </Link>
      <button onClick={() => setMode("delete")} className={btn}>
        <Trash2 className="size-5" aria-hidden="true" />
        Delete
      </button>
    </div>
  );
}