import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import DashboardView from "@/components/dashboard/DashboardView";

export const metadata: Metadata = { title: "Today" };

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

  // Only a name the person typed themselves. Never guess one from their email address.
  const first = String(user?.user_metadata?.first_name ?? "").trim();
  const name = first ? first.charAt(0).toUpperCase() + first.slice(1) : undefined;

  const date = lagos({ weekday: "long", day: "numeric", month: "long" });

  return <DashboardView greeting={greeting} name={name} date={date} />;
}
