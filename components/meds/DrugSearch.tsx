"use client";

import { useState } from "react";
import { useDrugSearch, type DrugResult } from "@/lib/queries/drugs";

export const inputClass = "min-h-14 w-full rounded-2xl border-2 border-forest bg-white px-4 text-lg font-normal";

export default function DrugSearch({
  value,
  matched,
  error,
  onType,
  onPick,
}: {
  value: string;
  matched: boolean;
  error?: string;
  onType: (text: string) => void;
  onPick: (drug: DrugResult) => void;
}) {
  const [open, setOpen] = useState(false);
  const search = useDrugSearch(value);
  const results = search.data ?? [];
  const show = open && value.trim().length >= 3;

  return (
    <div
      className="relative grid gap-2"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <label htmlFor="drug" className="text-lg font-medium">Medication name</label>
      <input
        id="drug"
        autoComplete="off"
        placeholder="Start typing, e.g. metformin"
        value={value}
        onChange={(e) => {
          onType(e.target.value);
          setOpen(true);
        }}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        aria-invalid={!!error}
        className={inputClass}
      />

      {matched && <p className="text-base text-[#2f7d14]">✓ Found in the RxNorm drug database</p>}
      {error && <span role="alert" className="text-danger">{error}</span>}

      {show && (
        <div className="absolute inset-x-0 top-full z-20 mt-2 max-h-72 overflow-auto rounded-2xl bg-white p-2 shadow-xl ring-1 ring-black/10">
          {search.isFetching && <p className="p-3 text-ink/70">Searching...</p>}
          {!search.isFetching && results.length === 0 && (
            <p className="p-3 text-ink/70">No match. You can keep the name you typed.</p>
          )}
          {results.map((drug) => (
            <button
              key={drug.rxcui}
              type="button"
              onClick={() => {
                onPick(drug);
                setOpen(false);
              }}
              className="block min-h-12 w-full rounded-xl px-3 py-2 text-left text-lg hover:bg-fog focus:bg-fog"
            >
              {drug.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}