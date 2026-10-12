import Reveal from "./Reveal";
import ArrowButton from "./ArrowButton";

const cards = [
  { tag: "Logging", big: "1 tap", small: "to log a dose" },
  { tag: "Refills", big: "7 days", small: "of warning before you run out, by default" },
  { tag: "Setup", big: "3 steps", small: "add, get reminded, tap taken" },
];

export default function Steps() {
  return (
    <section id="how" className="scroll-mt-28 bg-paper px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="text-center text-5xl font-normal tracking-tight md:text-6xl">
            How it works.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {cards.map((card, i) => (
            <Reveal
              key={card.tag}
              delay={i * 0.12}
              className="flex min-h-[26rem] flex-col justify-between rounded-[2rem] bg-gradient-to-b from-pine to-forest p-8 text-white"
            >
              <p className="text-2xl">{card.tag}</p>
              <div>
                <p className="text-6xl tracking-tight">{card.big}</p>
                <p className="mt-2 text-lg text-white/80">{card.small}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <ArrowButton href="/signup">Get started</ArrowButton>
        </div>
      </div>
    </section>
  );
}