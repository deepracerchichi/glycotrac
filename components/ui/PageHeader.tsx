import type { ReactNode } from "react";

export default function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4 print:hidden">
      <div className="min-w-0">
        <h1 className="text-4xl font-medium tracking-tight md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-1 text-xl text-ink/70">{subtitle}</p>}
      </div>
      {action && <div className="flex flex-wrap items-center gap-3">{action}</div>}
    </header>
  );
}