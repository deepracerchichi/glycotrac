"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Wordmark from "@/components/ui/WordMark";
import LogoutButton from "@/components/ui/LogOutButton";

const items = [
  { label: "Today", href: "/dashboard", d: "M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" },
  { label: "Medications", href: "/dashboard/meds", d: "M10.5 3.5l10 10a4.95 4.95 0 0 1-7 7l-10-10a4.95 4.95 0 0 1 7-7zM8.5 8.5l7 7" },
  { label: "Symptoms", href: null, d: "M22 12h-4l-3 9L9 3l-3 9H2" },
  { label: "Summary", href: null, d: "M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6M8 13h8M8 17h8" },
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

  return (
    <aside className="sticky top-0 hidden h-screen flex-col justify-between bg-forest p-6 text-white md:flex">
      <div>
        <Link href="/dashboard" className="block px-3 py-2"><Wordmark /></Link>
        <nav aria-label="Main" className="mt-8 grid gap-1">
          {items.map((item) =>
            item.href ? (
              <Link
                key={item.label}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`flex min-h-12 items-center gap-3 rounded-xl px-3 text-lg ${
                  isActive(item.href) ? "bg-white/15 font-medium" : "text-white/80 hover:bg-white/10"
                }`}
              >
                <Icon d={item.d} />
                {item.label}
              </Link>
            ) : (
              <div key={item.label} aria-disabled="true" className="flex min-h-12 items-center gap-3 rounded-xl px-3 text-lg text-white/40">
                <Icon d={item.d} />
                {item.label}
                <span className="ml-auto text-xs">Soon</span>
              </div>
            )
          )}
        </nav>
      </div>

      <div className="grid gap-3">
        <p className="truncate px-3 text-sm text-white/60">{email}</p>
        <LogoutButton className="border border-white/30 text-white hover:bg-white/10" />
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