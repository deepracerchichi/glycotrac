import Reveal from "./Reveal";
import MockCard from "./MockCard";

type Tone = "success" | "warning" | "neutral";

const items: {
  n: string;
  title: string;
  text: string;
  soon?: boolean;
  mock: { time: string; name: string; label: string; tone: Tone };
}[] = [
  {
    n: "01",
    title: "A nudge at the right time",
    text: "Add each medication once. glucotrac reminds you when it's time, and one tap marks it taken.",
    mock: { time: "08:00", name: "Morning tablet · 500mg", label: "⏰ Due now", tone: "warning" },
  },
  {
    n: "02",
    title: "Know before you run out",
    text: "Every dose you log counts down your pills, so you get a heads-up while there's still time to refill.",
    mock: { time: "⚠ Low", name: "Morning tablet", label: "5 days left. Time to refill.", tone: "warning" },
  },
  {
    n: "03",
    title: "Notice patterns in how you feel",
    text: "Log symptoms as they happen. Over time you can see what keeps showing up, and when.",
    mock: { time: "10:30", name: "Felt dizzy", label: "2 hours after morning dose", tone: "neutral" },
  },
  {
    n: "04",
    title: "A summary for your doctor",
    text: "One page with your doses and symptoms, ready to bring to your next appointment.",
    soon: true,
    mock: { time: "Summary", name: "Last 30 days", label: "Doses and symptoms", tone: "success" },
  },
];

export default function Showcase() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-16">
      <h2 className="text-4xl font-extrabold">What glucotrac does</h2>

      <div className="mt-8 grid gap-6">
        {items.map((item, i) => (
          <Reveal
            key={item.n}
            className={`flex flex-col gap-6 rounded-3xl border-2 border-ink p-6 md:items-center md:gap-10 md:p-10 ${
              i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            }`}
          >
            <div className="md:w-1/2">
              <p className="text-lg font-extrabold">({item.n})</p>
              <h3 className="mt-2 text-3xl font-extrabold">{item.title}</h3>
              <p className="mt-3 text-xl">{item.text}</p>
              {item.soon && <p className="mt-3 font-bold">Coming soon</p>}
            </div>
            <div className="md:w-1/2">
              <MockCard {...item.mock} />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}