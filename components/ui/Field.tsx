import type { ReactNode } from "react";

export const inputClass = "min-h-14 w-full rounded-2xl border-2 border-forest bg-white px-4 text-lg font-normal";

export function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-2 text-lg font-medium">
      {label}
      {children}
      {hint && <span className="text-base font-normal text-ink/70">{hint}</span>}
      {error && <span role="alert" className="font-normal text-danger">{error}</span>}
    </label>
  );
}