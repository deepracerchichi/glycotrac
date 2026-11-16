"use client";

import Link from "next/link";
import { BellRing, CircleCheck, HeartPulse, Pill } from "lucide-react";
import AddMedication from "@/components/meds/AddMedication";

const later = [
  { href: "#reminders", label: "Turn on reminders", text: "Get a nudge on this phone when a dose is due.", Icon: BellRing },
  { href: "/dashboard/emergency", label: "Add an emergency contact", text: "Someone to call, one tap away.", Icon: HeartPulse },
];

export default function SetupChecklist() {
  return (
    <section className="@container rounded-[2rem] bg-gradient-to-br from-forest to-pine p-6 text-white md:p-8">
      <p className="text-base font-medium text-mint">Welcome. Let&apos;s get you set up</p>
      <h2 className="mt-1 text-3xl font-medium tracking-tight md:text-4xl">Three quick steps</h2>

      <ol className="mt-6 grid gap-3 @3xl:grid-cols-3">
        <li className="flex flex-col gap-4 rounded-2xl bg-white p-5 text-ink">
          <span className="flex min-w-0 items-center gap-3 text-xl font-medium">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-forest text-white" aria-hidden="true">
              <Pill className="size-5" />
            </span>
            <span>
              <span className="sr-only">Step 1: </span>Add a medication
            </span>
          </span>
          <p className="text-ink/70">Its name, dose and the times you take it.</p>
          <AddMedication className="mt-auto inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-forest px-6 font-medium text-white transition hover:bg-pine active:scale-[0.98]" />
        </li>

        {later.map(({ href, label, text, Icon }, i) => (
          <li key={label}>
            <Link
              href={href}
              className="flex h-full flex-col gap-4 rounded-2xl bg-white/10 p-5 ring-1 ring-white/20 transition hover:bg-white/15"
            >
              <span className="flex min-w-0 items-center gap-3 text-xl font-medium">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/15" aria-hidden="true">
                  <Icon className="size-5" />
                </span>
                <span>
                  <span className="sr-only">Step {i + 2}: </span>
                  {label}
                </span>
              </span>
              <p className="text-white/80">{text}</p>
            </Link>
          </li>
        ))}
      </ol>

      <p className="mt-5 flex items-center gap-2 text-base text-white/70">
        <CircleCheck className="size-5 shrink-0" aria-hidden="true" />
        Your records are private to your account.
      </p>
    </section>
  );
}
