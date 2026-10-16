import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import ModalTrigger from "@/components/ui/ModalTrigger";
import ReadingForm from "@/components/readings/ReadingForm";
import ReadingStats from "@/components/readings/ReadingStats";
import GlucoseTrend from "@/components/readings/GlucoseTrend";
import ReadingList from "@/components/readings/ReadingList";

export default function ReadingsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Readings"
        subtitle={
          <>
            Blood sugar and blood pressure.{" "}
            <Link href="/dashboard/settings" className="underline">Targets and units</Link>
          </>
        }
        action={
          <ModalTrigger label="Log reading" title="Log a reading" description="Blood sugar or blood pressure.">
            <ReadingForm />
          </ModalTrigger>
        }
      />

      <div className="mt-8 grid gap-6">
        <ReadingStats />
        <GlucoseTrend />
        <ReadingList />
      </div>
    </div>
  );
}