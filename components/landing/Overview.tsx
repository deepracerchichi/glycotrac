import Reveal from "./Reveal";
import ArrowButton from "./ArrowButton";
import { Panel, DoseRow, Progress } from "./mocks";

const cards = [
  {
    title: "Reminders",
    text: "Gentle nudges at the times you choose, so doses don't slip.",
    mock: (
      <Panel>
        <p className="text-sm text-ink/60">Today</p>
        <p className="text-3xl font-medium">3 doses</p>
        <div className="mt-3 grid gap-2">
          <DoseRow time="08:00" name="Morning tablet" status="✓ Taken" tone="success" />
          <DoseRow time="13:00" name="Lunch tablet" status="⏰ Due" tone="warning" />
        </div>
      </Panel>
    ),
  },
  {
    title: "Refill alerts",
    text: "A heads-up while there's still time to refill.",
    mock: (
      <Panel>
        <p className="text-sm text-ink/60">Morning tablet</p>
        <p className="text-3xl font-medium">5 days left</p>
        <div className="mt-3">
          <Progress percent={25} />
        </div>
        <p className="mt-2 text-sm font-medium text-warning">⚠ Time to refill</p>
      </Panel>
    ),
  },
  {
    title: "Symptom log",
    text: "Note how you feel in seconds and spot patterns over time.",
    mock: (
      <Panel>
        <p className="text-sm text-ink/60">Recent</p>
        <div className="mt-3 grid gap-2">
          <DoseRow time="10:30" name="Felt dizzy" status="2h after dose" tone="muted" />
          <DoseRow time="16:00" name="Very tired" status="After lunch" tone="muted" />
        </div>
      </Panel>
    ),
  },
  {
    title: "Doctor summary",
    soon: true,
    text: "One page of doses and symptoms to bring to your appointment.",
    mock: (
      <Panel>
        <p className="text-sm text-ink/60">Last 30 days</p>
        <p className="text-3xl font-medium">28 days logged</p>
        <div className="mt-3 grid gap-2">
          <DoseRow time="Doses" name="Taken on time" status="✓" tone="success" />
          <DoseRow time="Symptoms" name="Logged" status="6" tone="muted" />
        </div>
      </Panel>
    ),
  },
];

export default function Overview() {
  return (
    <section id="features" className="scroll-mt-28 bg-white px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-5xl font-normal tracking-tight md:text-6xl">Get to know glycotrac</h2>
          <p className="mt-5 text-xl text-ink/70">One place for your medications, refills and symptoms.</p>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, i) => (
            <Reveal
              key={card.title}
              delay={i * 0.1}
              className="flex min-h-[30rem] flex-col rounded-[2.5rem] bg-fog p-8"
            >
              <h3 className="text-3xl font-normal tracking-tight">{card.title}</h3>
              {card.soon && <p className="mt-1 text-sm font-medium text-ink/60">Coming soon</p>}
              <p className="mt-3 text-xl text-ink/70">{card.text}</p>
              <div className="mt-auto pt-10">{card.mock}</div>
            </Reveal>
          ))}
        </div>

        {/* <div className="mt-12 flex justify-center">
          <ArrowButton href="/signup">Get started</ArrowButton>
        </div> */}
      </div>
    </section>
  );
}