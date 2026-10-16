import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/ui/LogOutButton";
import AddMedication from "@/components/meds/AddMedication";
import Stats from "@/components/dashboard/Stats";
import TodayList from "@/components/dashboard/TodayList";
import HealthSnapshot from "@/components/dashboard/HealthSnapshot";
import RefillWatch from "@/components/dashboard/RefillWatch";
import EnableReminders from "@/components/dashboard/EnableReminders";
import QuickActions from "@/components/dashboard/QuickActions";

function lagos(options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Lagos", ...options }).format(new Date());
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const hour = Number(lagos({ hour: "numeric", hourCycle: "h23" }));
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const raw = user?.email?.split("@")[0] ?? "there";
  const name = raw.charAt(0).toUpperCase() + raw.slice(1);
  const date = lagos({ weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="mx-auto max-w-6xl">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-4xl font-medium tracking-tight md:text-5xl">{greeting}, {name}</h1>
          <p className="mt-1 text-xl text-ink/70">{date}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="md:hidden">
            <LogoutButton className="border-2 border-forest" />
          </div>
          <AddMedication />
        </div>
      </header>

      <div className="mt-8"><Stats /></div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_22rem]">
        <TodayList />
        <div className="grid content-start gap-6">
          <HealthSnapshot />
          <RefillWatch />
          <EnableReminders />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}