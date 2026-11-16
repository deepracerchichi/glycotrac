import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import Wordmark from "@/components/ui/WordMark";
import Footer from "@/components/landing/Footer";
import { fontClasses } from "@/components/shared/fontClasses";

export type LegalSection = { id: string; title: string; body: ReactNode };

export function P({ children }: { children: ReactNode }) {
  return <p className="text-xl leading-relaxed text-ink/90">{children}</p>;
}

export function UL({ items }: { items: ReactNode[] }) {
  return (
    <ul className="grid gap-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-xl leading-relaxed text-ink/90">
          <span aria-hidden="true" className="mt-3 size-2 shrink-0 rounded-full bg-pine" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return <p className="rounded-2xl bg-sage p-5 text-lg leading-relaxed text-forest">{children}</p>;
}

type Props = {
  kicker: string;
  title: string;
  intro: string;
  updated: string;
  summary: string[];
  sections: LegalSection[];
  current: "privacy" | "terms";
};

const tabs = [
  { key: "privacy", label: "Privacy", href: "/privacy" },
  { key: "terms", label: "Terms", href: "/terms" },
] as const;

export default function LegalLayout({ kicker, title, intro, updated, summary, sections, current }: Props) {
  return (
    <div className={`${fontClasses} bg-paper text-ink`}>
      <header className="bg-gradient-to-b from-forest to-pine px-6 pb-24 pt-6 text-white md:pb-28">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" aria-label="Glycotrac home">
              <Wordmark tone="light" />
            </Link>
            <Link
              href="/"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/30 px-5 font-medium transition hover:bg-white/10"
            >
              <ArrowLeft className="size-5" aria-hidden="true" />
              Home
            </Link>
          </div>

          <p className="mt-14 text-lg font-medium text-mint md:mt-20">{kicker}</p>
          <h1 className="mt-2 text-5xl font-normal leading-[1.02] tracking-tight md:text-7xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-white/85 md:text-2xl">{intro}</p>
          <p className="mt-8 inline-flex rounded-full bg-white/10 px-4 py-2 text-base ring-1 ring-white/20">
            Last updated {updated}
          </p>
        </div>
      </header>

      <main className="px-6 pb-24">
        <div className="mx-auto -mt-14 max-w-6xl">
          <section aria-labelledby="in-short" className="rounded-[2rem] bg-white p-7 shadow-xl ring-1 ring-black/5 md:p-10">
            <h2 id="in-short" className="text-3xl font-medium tracking-tight">
              In short
            </h2>
            <ul className="mt-5 grid gap-4 md:grid-cols-2">
              {summary.map((line) => (
                <li key={line} className="flex gap-3 text-xl leading-snug">
                  <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-ok-bg text-ok" aria-hidden="true">
                    <Check className="size-4" strokeWidth={3} />
                  </span>
                  {line}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-base text-ink/70">
              This summary is a shortcut. The full text below is what applies.
            </p>
          </section>

          <div className="mt-12 grid gap-10 lg:grid-cols-[16rem_1fr] lg:gap-14">
            <aside className="lg:sticky lg:top-8 lg:self-start">
              <nav className="flex gap-2" aria-label="Legal pages">
                {tabs.map((t) => (
                  <Link
                    key={t.key}
                    href={t.href}
                    aria-current={t.key === current ? "page" : undefined}
                    className={`inline-flex min-h-12 flex-1 items-center justify-center rounded-full px-5 font-medium transition ${
                      t.key === current ? "bg-forest text-white" : "bg-white ring-1 ring-black/10 hover:bg-fog"
                    }`}
                  >
                    {t.label}
                  </Link>
                ))}
              </nav>

              <nav aria-label="On this page" className="mt-6 hidden lg:block">
                <p className="text-base font-medium text-ink/70">On this page</p>
                <ol className="mt-3 grid gap-1">
                  {sections.map((s, i) => (
                    <li key={s.id}>
                      <a href={`#${s.id}`} className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-lg text-ink/80 transition hover:bg-white hover:text-ink">
                        <span className="w-6 text-base text-ink/70 tabular-nums">{i + 1}</span>
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>

              <details className="mt-4 rounded-2xl bg-white ring-1 ring-black/10 lg:hidden">
                <summary className="flex min-h-12 cursor-pointer items-center px-5 text-lg font-medium">On this page</summary>
                <ol className="grid gap-1 px-2 pb-3">
                  {sections.map((s, i) => (
                    <li key={s.id}>
                      <a href={`#${s.id}`} className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-lg hover:bg-fog">
                        <span className="w-6 text-base text-ink/70 tabular-nums">{i + 1}</span>
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </details>
            </aside>

            <article className="grid gap-6">
              {sections.map((s, i) => (
                <section key={s.id} id={s.id} className="scroll-mt-8 rounded-[2rem] bg-white p-7 shadow-sm ring-1 ring-black/5 md:p-10">
                  <div className="flex items-start gap-4">
                    <span
                      aria-hidden="true"
                      className="grid size-11 shrink-0 place-items-center rounded-full bg-sage text-lg font-medium text-forest tabular-nums"
                    >
                      {i + 1}
                    </span>
                    <h2 className="pt-1 text-2xl font-medium tracking-tight md:text-3xl">{s.title}</h2>
                  </div>
                  <div className="mt-6 grid gap-5">{s.body}</div>
                </section>
              ))}
            </article>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
