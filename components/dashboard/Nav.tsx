"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Wordmark from "@/components/ui/WordMark";
import LogoutButton from "@/components/ui/LogOutButton";

const KEY = "sidebar-collapsed";

const items = [
  { label: "Today", href: "/dashboard", d: "M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" },
  { label: "Medications", href: "/dashboard/meds", d: "M10.5 3.5l10 10a4.95 4.95 0 0 1-7 7l-10-10a4.95 4.95 0 0 1 7-7zM8.5 8.5l7 7" },
  { label: "Symptoms", href: "/dashboard/symptoms", d: "M22 12h-4l-3 9L9 3l-3 9H2" },
  { label: "Summary", href: "/dashboard/summary", d: "M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6M8 13h8M8 17h8" },
];

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" className="size-6 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function useIsActive() {
  const path = usePathname();
  return (href: string) => (href === "/dashboard" ? path === href : path.startsWith(href));
}

export function Sidebar({ email }: { email: string }) {
  const isActive = useIsActive();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(KEY) === "1");
    } catch {}
  }, []);

  function toggle() {
    const next = !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem(KEY, next ? "1" : "0");
    } catch {}
  }

  const row = `flex min-h-12 items-center gap-3 rounded-xl px-3 text-lg ${collapsed ? "justify-center" : ""}`;
  const label = collapsed ? "sr-only" : "";

  return (
    <aside
      className={`sticky top-0 hidden h-screen shrink-0 flex-col justify-between self-start overflow-hidden bg-forest p-4 text-white transition-[width] duration-300 motion-reduce:transition-none md:flex ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div>
        <div className={`flex items-center ${collapsed ? "flex-col gap-3" : "justify-between"}`}>
          <Link href="/dashboard" aria-label="Dashboard home" className="px-2 py-2">
            <Wordmark tone="light" mark={collapsed} />
          </Link>
          <button
            type="button"
            onClick={toggle}
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="grid size-11 place-items-center rounded-xl hover:bg-white/10"
          >
            <Icon d={collapsed ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6"} />
          </button>
        </div>

        <nav aria-label="Main" className="mt-6 grid gap-1">
          {items.map((item) =>
            item.href ? (
              <Link
                key={item.label}
                href={item.href}
                title={collapsed ? item.label : undefined}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`${row} ${isActive(item.href) ? "bg-white/15 font-medium" : "text-white/80 hover:bg-white/10"}`}
              >
                <Icon d={item.d} />
                <span className={label}>{item.label}</span>
              </Link>
            ) : (
              <div key={item.label} aria-disabled="true" title={collapsed ? `${item.label} (soon)` : undefined} className={`${row} text-white/40`}>
                <Icon d={item.d} />
                <span className={label}>{item.label}</span>
                {!collapsed && <span className="ml-auto text-xs">Soon</span>}
              </div>
            )
          )}
        </nav>
      </div>

      <div className="grid gap-3">
        {!collapsed && <p className="truncate px-3 text-sm text-white/60">{email}</p>}
        <LogoutButton iconOnly={collapsed} className="border border-white/30 text-white hover:bg-white/10" />
      </div>
    </aside>
  );
}

export function BottomNav() {
  const isActive = useIsActive();

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 bg-forest pb-[env(safe-area-inset-bottom)] text-white md:hidden"
    >
      {items.map((item) =>
        item.href ? (
          <Link
            key={item.label}
            href={item.href}
            aria-current={isActive(item.href) ? "page" : undefined}
            className={`flex min-h-16 flex-col items-center justify-center gap-1 text-sm ${
              isActive(item.href) ? "font-medium text-mint" : "text-white/80"
            }`}
          >
            <Icon d={item.d} />
            {item.label}
          </Link>
        ) : (
          <div key={item.label} aria-disabled="true" className="flex min-h-16 flex-col items-center justify-center gap-1 text-sm text-white/40">
            <Icon d={item.d} />
            {item.label}
          </div>
        )
      )}
    </nav>
  );
}