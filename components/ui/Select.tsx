"use client";

import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";

export type Option = { value: string; label: string };

export default function Select({
  label,
  value,
  onChange,
  options,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  error?: string;
}) {
  const current = options.find((o) => o.value === value);

  return (
    <Listbox value={value} onChange={onChange}>
      <div className="grid gap-2">
        <Label className="text-lg font-medium">{label}</Label>

        <ListboxButton className="group flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl border-2 border-forest bg-white py-2 pl-4 pr-4 text-left text-lg data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-forest">
          <span className="truncate">{current?.label ?? "Select"}</span>
          <ChevronDown
            className="size-5 shrink-0 transition-transform duration-200 group-data-open:rotate-180 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </ListboxButton>

        <ListboxOptions
          anchor="bottom start"
          transition
          className="z-70 w-(--button-width) rounded-2xl bg-white p-2 shadow-xl ring-1 ring-black/10 transition duration-150 ease-out [--anchor-gap:8px] focus:outline-none data-closed:scale-95 data-closed:opacity-0 motion-reduce:transition-none"
        >
          {options.map((o) => (
            <ListboxOption
              key={o.value}
              value={o.value}
              className="group flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-lg data-focus:bg-fog data-selected:font-medium"
            >
              {o.label}
              <Check className="invisible size-5 shrink-0 text-forest group-data-selected:visible" aria-hidden="true" />
            </ListboxOption>
          ))}
        </ListboxOptions>

        {error && <span role="alert" className="text-danger">{error}</span>}
      </div>
    </Listbox>
  );
}