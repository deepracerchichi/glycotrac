import PageHeader from "@/components/ui/PageHeader";
import ModalTrigger from "@/components/ui/ModalTrigger";
import SymptomForm from "@/components/symptoms/SymptomForm";
import SymptomStats from "@/components/symptoms/SymptomStats";
import SymptomList from "@/components/symptoms/SymptomList";

export default function SymptomsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Symptoms"
        subtitle="Note how you feel, so you can spot patterns over time."
        action={
          <ModalTrigger label="Log symptom" title="Log a symptom" description="What are you feeling right now?">
            <SymptomForm />
          </ModalTrigger>
        }
      />

      <div className="mt-8 grid gap-6">
        <SymptomStats />
        <SymptomList />
      </div>
    </div>
  );
}