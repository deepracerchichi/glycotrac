import Reveal from "./Reveal";
import { HeartPulse } from "lucide-react";
import { Panel } from "./mocks";

const field = "mt-1 rounded-xl border border-ink/15 px-3 py-2 text-base";

const rows = [
  {
    title: "Set it once.",
    text: "Add each medication with its dose and the times you take it. glycotrac handles the rest.",
    mock: (
      <Panel className="mx-auto max-w-sm">
        <p className="text-base text-ink/70">Medication</p>
        <div className={field}>Morning tablet</div>
        <p className="mt-3 text-base text-ink/70">Time</p>
        <div className={field}>8:00 AM</div>
        <div className="mt-4 rounded-xl bg-mint px-3 py-3 text-center font-medium text-forest">
          Save medication
        </div>
      </Panel>
    ),
  },
  {
    title: "Reminders that reach you.",
    text: "A notification on your phone at the time you set, so you don't have to keep checking.",
    mock: (
      <Panel className="mx-auto max-w-sm">
        <p className="text-base text-ink/70">glycotrac · now</p>
        <p className="mt-1 text-lg font-medium">Time for your medication</p>
        <p className="text-base text-ink/70">Morning tablet · 500mg</p>
      </Panel>
    ),
  },
  {
    title: "Ready for emergencies.",
    text: "Keep your conditions, allergies, medications and contacts on one card, with one-tap calling.",
    mock: (
      <Panel className="mx-auto max-w-sm border-2 border-bad">
        <p className="flex items-center gap-2 text-lg font-medium text-bad">
          <HeartPulse className="size-5" aria-hidden="true" />
          Emergency card
        </p>
        <p className="mt-3 text-base text-ink/70">Allergies</p>
        <p className="text-lg">Penicillin</p>
        <div className="mt-4 rounded-xl bg-bad px-3 py-3 text-center font-medium text-white">Call Ada (daughter)</div>
      </Panel>
    ),
  },
];

export default function Rows() {
  return (
    <section className="bg-white px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="text-center text-5xl font-normal tracking-tight md:text-6xl">
            Built for everyday use.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-16 md:gap-24">
          {rows.map((row, i) => (
            <Reveal
              key={row.title}
              className={`flex flex-col items-center gap-10 md:gap-16 ${
                i % 2 ? "md:flex-row-reverse" : "md:flex-row"
              }`}
            >
              <div className="md:w-1/2">
                <h3 className="text-4xl font-normal tracking-tight md:text-5xl">{row.title}</h3>
                <p className="mt-4 max-w-md text-xl text-ink/70">{row.text}</p>
              </div>
              <div className="w-full rounded-[2rem] bg-fog p-8 md:w-1/2 md:p-12">{row.mock}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}