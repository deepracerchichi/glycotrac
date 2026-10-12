const cards = [
  { title: "Symptom log", text: "Note how you feel and spot patterns after doses and meals." },
  { title: "Doctor summary", text: "One page of doses and symptoms for your next appointment." },
];

export default function SoonCards() {
  return (
    <div className="grid gap-4">
      {cards.map((c) => (
        <section key={c.title} className="rounded-3xl bg-fog p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-medium">{c.title}</h2>
            <span className="rounded-full bg-white px-3 py-1 text-sm font-medium">Coming soon</span>
          </div>
          <p className="mt-2 text-ink/70">{c.text}</p>
        </section>
      ))}
    </div>
  );
}