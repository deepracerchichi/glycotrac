import type { ReactNode } from "react";

export default function StatTile({
  label,
  value,
  hint,
  children,
}: {
  label: string;
  value: string;
  hint?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-3xl bg-white p-5 ring-1 ring-black/5">
      <p className="text-base text-ink/70">{label}</p>
      <p className="mt-1 break-words text-3xl font-medium tracking-tight sm:text-4xl">{value}</p>
      {hint && <p className="mt-1 text-base text-ink/70">{hint}</p>}
      {children}
    </div>
  );
}