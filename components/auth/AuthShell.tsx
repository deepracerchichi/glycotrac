import type { ReactNode } from "react";
import Link from "next/link";
import Wordmark from "@/components/ui/WordMark";
import { Panel, DoseRow } from "@/components/landing/mocks";
import { fontClasses } from "@/components/shared/fontClasses";

export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className={`${fontClasses} grid min-h-screen bg-paper text-ink lg:grid-cols-2`}>
      <aside className="hidden flex-col justify-between bg-forest p-14 text-white lg:flex">
        <Link href="/"><Wordmark tone="light" /></Link>
        <div>
          <p className="text-6xl leading-[1.02] tracking-tight">
            Never miss<br />a dose or<br />
            <span className="text-mint">a refill</span>
          </p>
          <Panel className="mt-10 w-80">
            <p className="mb-3 text-lg font-medium">Today</p>
            <div className="grid gap-2">
              <DoseRow time="08:00" name="Morning tablet" status="✓ Taken" tone="success" />
              <DoseRow time="13:00" name="Lunch tablet" status="⏰ Due now" tone="warning" />
            </div>
          </Panel>
        </div>
        <p className="text-base text-white/70">glycotrac is a tracking tool, not medical advice.</p>
      </aside>

      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-10 inline-block lg:hidden"><Wordmark /></Link>
          {children}
        </div>
      </section>
    </main>
  );
}