import type { ReactNode } from "react";
import StatusIcon, { type StatusKind } from "@/components/ui/StatusIcon";

const tones = {
  success: "text-success",
  warning: "text-warning",
  muted: "text-ink/70",
};

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div aria-hidden="true" className={`rounded-2xl bg-white p-5 text-ink shadow-sm ring-1 ring-black/5 ${className}`}>
      {children}
    </div>
  );
}

export function DoseRow({
  time,
  name,
  status,
  tone,
  icon,
}: {
  time: string;
  name: string;
  status: string;
  tone: keyof typeof tones;
  icon?: StatusKind;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-paper px-3 py-2.5">
      <div>
        <p className="text-lg font-medium">{time}</p>
        <p className="text-base text-ink/70">{name}</p>
      </div>
      <p className={`flex items-center gap-1.5 text-base font-medium ${tones[tone]}`}>
        {icon && <StatusIcon kind={icon} />}
        {status}
      </p>
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