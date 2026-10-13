import SummaryView from "@/components/summary/SummaryView";

export default function SummaryPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-4xl font-medium tracking-tight print:hidden md:text-5xl">Doctor summary</h1>
      <p className="mt-1 text-xl text-ink/70 print:hidden">
        One page to bring to your next appointment.
      </p>
      <div className="mt-8"><SummaryView /></div>
    </div>
  );
}