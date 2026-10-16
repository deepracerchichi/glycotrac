import PageHeader from "@/components/ui/PageHeader";
import AddMedication from "@/components/meds/AddMedication";
import MedStats from "@/components/meds/MedStats";
import MedList from "@/components/meds/MedList";

export default function MedsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Medications"
        subtitle="Everything you take, and how much is left."
        action={<AddMedication />}
      />
      <div className="mt-8"><MedStats /></div>
      <div className="mt-6"><MedList /></div>
    </div>
  );
}