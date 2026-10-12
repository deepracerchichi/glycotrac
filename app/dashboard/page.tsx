import Link from "next/link";
import LogoutButton from "@/components/ui/LogOutButton";
import TodayList from "@/components/dashboard/TodayList";
import EnableReminders from "@/components/dashboard/EnableReminders";

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold">Today</h1>
        <LogoutButton />
      </div>

      <div className="mt-6">
        <EnableReminders />
      </div>
      <div className="mt-6">
        <TodayList />
      </div>

      <Link
        href="/dashboard/meds/new"
        className="mt-8 inline-flex min-h-12 items-center rounded-xl border-2 border-ink px-6 font-bold"
      >
        + Add medication
      </Link>
    </main>
  );
}