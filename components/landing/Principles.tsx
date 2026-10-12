import Reveal from "./Reveal";
import { Panel } from "./mocks";

const cards = [
  {
    title: "Simple by design.",
    text: "Big buttons, clear words, and one screen for everything due today.",
    mock: (
      <Panel>
        <p className="text-base font-medium">13:00 · Lunch tablet</p>
        <div className="mt-3 rounded-xl bg-mint px-3 py-3 text-center font-medium text-forest">
          Mark as taken
        </div>
      </Panel>
    ),
  },
  {
    title: "Reminders that find you.",
    text: "Notifications on your phone at the times you choose.",
    mock: (
      <Panel>
        <p className="text-sm text-ink/60">glycotrac · now</p>
        <p className="mt-1 text-base font-medium">Time for your medication</p>
        <p className="text-sm text-ink/60">Lunch tablet · 500mg</p>
      </Panel>
    ),
  },
  {
    title: "Private by default.",
    text: "Your records are only visible to your own account.",
    mock: (
      <Panel>
        <p className="text-base font-medium">🔒 Only you</p>
        <p className="mt-1 text-sm text-ink/60">Doses, symptoms and meals stay in your account.</p>
      </Panel>
    ),
  },
];

export default function Principles() {
  return (
    <section className="bg-paper px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-5xl font-normal tracking-tight md:text-6xl">
            Built around your daily routine
          </h2>
          <p className="mt-5 text-xl text-ink/70">
            Less to remember, less to track, less to worry about.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {cards.map((card, i) => (
            <Reveal
              key={card.title}
              delay={i * 0.12}
              className="flex min-h-[26rem] flex-col rounded-[2.5rem] bg-fog p-8"
            >
              <h3 className="text-3xl font-normal tracking-tight">{card.title}</h3>
              <p className="mt-3 text-xl text-ink/70">{card.text}</p>
              <div className="mt-auto pt-10">{card.mock}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}