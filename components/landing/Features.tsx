const steps = [
  { title: "Add your medications", text: "Enter each one with its dose and the time you take it." },
  { title: "Get a reminder", text: "Linda nudges you when it's time, so you don't have to remember." },
  { title: "Tap Taken", text: "One tap logs the dose and keeps your pill count up to date." },
];

export default function Features() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-16">
      <h2 className="text-3xl font-extrabold">How it works</h2>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {steps.map((step, i) => (
          <div key={step.title} className="rounded-2xl bg-card p-6">
            <p className="text-4xl font-extrabold">{i + 1}</p>
            <h3 className="mt-2 text-xl font-extrabold">{step.title}</h3>
            <p className="mt-2">{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}