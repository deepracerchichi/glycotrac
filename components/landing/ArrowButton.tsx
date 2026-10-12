import Link from "next/link";
import type { ReactNode } from "react";

const styles = {
  mint: { pill: "bg-mint text-forest", dot: "bg-flame text-white" },
  flame: { pill: "bg-flame text-forest", dot: "bg-white text-forest" },
  dark: { pill: "bg-forest text-white", dot: "bg-mint text-forest" },
};

export default function ArrowButton({
  href,
  children,
  variant = "mint",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof styles;
  className?: string;
}) {
  const s = styles[variant];
  return (
    <Link
      href={href}
      className={`group inline-flex min-h-14 items-center gap-6 rounded-full py-2 pl-7 pr-2 text-lg font-medium ${s.pill} ${className}`}
    >
      {children}
      <span
        className={`grid size-10 place-items-center rounded-full transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none ${s.dot}`}
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </Link>
  );
}