import type { ReactNode } from "react";

const tones = {
  success: "text-success",
  warning: "text-warning",
  muted: "text-ink/60",
};

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div aria-hidden="true" className={`rounded-2xl bg-white p-4 text-ink shadow-sm ring-1 ring-black/5 ${className}`}>
      {children}
    </div>
  );
}

export function DoseRow({
  time,
  name,
  status,
  tone,
}: {
  time: string;
  name: string;
  status: string;
  tone: keyof typeof tones;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-paper px-3 py-2">
      <div>
        <p className="text-base font-medium">{time}</p>
        <p className="text-sm text-ink/60">{name}</p>
      </div>
      <p className={`text-sm font-medium ${tones[tone]}`}>{status}</p>
    </div>
  );
}

export function Progress({ percent }: { percent: number }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-fog">
      <div className="h-full rounded-full bg-warning" style={{ width: `${percent}%` }} />
    </div>
  );
}