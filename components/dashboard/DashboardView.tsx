import Link from "next/link";
import { HeartPulse } from "lucide-react";
import AddMedication from "@/components/meds/AddMedication";
import NextDose from "@/components/dashboard/NextDose";
import Stats from "@/components/dashboard/Stats";
import TodayList from "@/components/dashboard/TodayList";
import HealthSnapshot from "@/components/dashboard/HealthSnapshot";
import RefillWatch from "@/components/dashboard/RefillWatch";
import EnableReminders from "@/components/dashboard/EnableReminders";
import QuickActions from "@/components/dashboard/QuickActions";

export default function DashboardView({ greeting, name, date }: { greeting: string; name?: string; date: string }) {
  return (
    <div className="@container mx-auto max-w-6xl">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-3xl font-medium tracking-tight md:text-5xl">
            {greeting}
            {name ? `, ${name}` : ""}
          </h1>
          <p className="mt-1 text-lg text-ink/70 md:text-xl">{date}</p>
        </div>
        <div className="flex w-full items-center gap-3 md:w-auto">
          <Link
            href="/dashboard/emergency"
            className="inline-flex min-h-12 shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-bad-bg px-4 font-medium text-bad md:hidden"
          >
            <HeartPulse className="size-5" aria-hidden="true" />
            Emergency
          </Link>
          <AddMedication className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-forest px-5 font-medium text-white transition hover:bg-pine active:scale-[0.98] md:flex-none md:px-6" />
        </div>
      </header>

      <div className="mt-6 grid gap-y-4 md:mt-8 @5xl:grid-cols-[1fr_auto]">
        <NextDose />
        <Stats />
      </div>

      <div className="mt-6 grid gap-6 @5xl:grid-cols-[1fr_22rem]">
        <TodayList />
        <div className="flex flex-col gap-6">
          <div className="order-1 @5xl:order-4">
            <QuickActions />
          </div>
          <div className="order-2 @5xl:order-1">
            <HealthSnapshot />
          </div>
          <div className="order-3 @5xl:order-2">
            <RefillWatch />
          </div>
          <div className="order-4 @5xl:order-3">
            <EnableReminders />
          </div>
        </div>
      </div>
    </div>
  );
}
