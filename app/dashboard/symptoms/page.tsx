import SymptomForm from "@/components/symptoms/SymptomForm";
import SymptomList from "@/components/symptoms/SymptomList";

export default function SymptomsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-4xl font-medium tracking-tight md:text-5xl">Symptoms</h1>
      <p className="mt-1 text-xl text-ink/70">Note how you feel, so you can spot patterns over time.</p>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[28rem_1fr]">
        <SymptomForm />
        <SymptomList />
      </div>
    </div>
  );
}