import Link from "next/link";
import MedList from "@/components/meds/MedList";

export default function MedsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl font-medium tracking-tight md:text-5xl">Medications</h1>
        <Link href="/dashboard/meds/new" className="inline-flex min-h-12 items-center rounded-full bg-mint px-6 font-medium text-forest">
          + Add medication
        </Link>
      </header>
      <div className="mt-8"><MedList /></div>
    </div>
  );
}