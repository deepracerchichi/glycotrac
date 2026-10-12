import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { fontClasses } from "@/components/shared/fontClasses";
import { Sidebar, BottomNav } from "@/components/dashboard/Nav";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className={`${fontClasses} min-h-screen bg-paper text-ink md:grid md:grid-cols-[16rem_1fr]`}>
      <Sidebar email={user?.email ?? ""} />
      <div className="px-5 pb-28 pt-8 md:px-10 md:pb-12">{children}</div>
      <BottomNav />
    </div>
  );
}