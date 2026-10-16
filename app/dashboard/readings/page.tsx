import Link from "next/link";
import ReadingForm from "@/components/readings/ReadingForm";
import GlucoseTrend from "@/components/readings/GlucoseTrend";
import ReadingList from "@/components/readings/ReadingList";

export default function ReadingsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-4xl font-medium tracking-tight md:text-5xl">Readings</h1>
      <p className="mt-1 text-xl text-ink/70">
        Blood sugar and blood pressure.{" "}
        <Link href="/dashboard/settings" className="underline">Set your targets</Link>
      </p>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[28rem_1fr]">
        <ReadingForm />
        <div className="grid gap-6">
          <GlucoseTrend />
          <ReadingList />
        </div>
      </div>
    </div>
  );
}