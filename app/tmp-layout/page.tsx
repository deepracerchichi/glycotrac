"use client";
// TEMPORARY layout check. Deleted right after.
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fontClasses } from "@/components/shared/fontClasses";
import { Sidebar } from "@/components/dashboard/Nav";
import DashboardView from "@/components/dashboard/DashboardView";

const sched = (id: string, t: string) => ({ id, time_of_day: `${t}:00`, created_at: "" });
const meds = [
  { id: "m1", name: "Metformin", dose: "500mg", pills_remaining: 40, pills_per_dose: 1, refill_threshold_days: 7, schedules: [sched("s1", "08:00"), sched("s2", "13:00"), sched("s3", "20:00")] },
  { id: "m2", name: "Lisinopril", dose: "10mg", pills_remaining: 5, pills_per_dose: 1, refill_threshold_days: 7, schedules: [sched("s4", "08:00")] },
];

export default function Page() {
  const [client] = useState(() => {
    const q = new URLSearchParams(window.location.search);
    try { localStorage.setItem("sidebar-collapsed", q.get("c") === "1" ? "1" : "0"); } catch {}
    const c = new QueryClient({ defaultOptions: { queries: { staleTime: Infinity, retry: false } } });
    c.setQueryData(["medications"], q.get("m") === "1" ? meds : []);
    c.setQueryData(["dose_logs", "today"], []);
    c.setQueryData(["readings", 30], []);
    c.setQueryData(["appointments"], []);
    c.setQueryData(["settings"], { glucose_unit: "mgdl", glucose_target_low: null, glucose_target_high: null, bp_sys_max: null, bp_dia_max: null, foot_check_enabled: false });
    return c;
  });
  return (
    <QueryClientProvider client={client}>
      <div className={`${fontClasses} min-h-screen bg-paper text-ink md:flex`}>
        <Sidebar email="ada@example.com" />
        <div className="min-w-0 flex-1 px-5 pb-28 pt-8 md:px-10 md:pb-12">
          <DashboardView greeting="Good afternoon" date="Monday 16 November" />
        </div>
      </div>
    </QueryClientProvider>
  );
}
