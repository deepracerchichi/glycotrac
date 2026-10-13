import Reveal from "./Reveal";

const rows = [
  { day: "Mon", doses: "3 of 3", symptom: "None", note: "All doses taken", hot: true },
  { day: "Tue", doses: "2 of 3", symptom: "Dizzy", note: "Missed evening dose, dizzy at 21:30", hot: false },
  { day: "Wed", doses: "3 of 3", symptom: "Tired", note: "Tired after lunch", hot: false },
];

const head = "font-mono-landing text-xs uppercase tracking-wider text-ink/60";

export default function WeekTable() {
  return (
    <section className="bg-paper px-6 pb-20 md:pb-28">
      <div className="mx-auto max-w-5xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-5xl font-normal tracking-tight md:text-6xl">
            See your week at a glance.
          </h2>
          <p className="mt-5 text-xl text-ink/70">
            Doses and symptoms side by side, ready to show your doctor.
          </p>
          <p className="mt-2 text-sm font-medium text-ink/60">example data</p>
        </Reveal>

        <Reveal delay={0.1} className="mt-14 overflow-x-auto">
          <div aria-hidden="true" className="min-w-[36rem] rounded-[2rem] bg-white p-6 md:p-10">
            <p className="font-mono-landing text-sm uppercase tracking-wider text-ink/60">
              Summary for this week
            </p>
            <div className="mt-6 overflow-hidden rounded-2xl ring-1 ring-black/5">
              <div className="grid grid-cols-[4rem_6rem_7rem_1fr] gap-4 bg-fog px-5 py-3">
                <span className={head}>Day</span>
                <span className={head}>Doses</span>
                <span className={head}>Symptom</span>
                <span className={head}>Note</span>
              </div>
              {rows.map((r) => (
                <div
                  key={r.day}
                  className={`grid grid-cols-[4rem_6rem_7rem_1fr] gap-4 border-t border-black/5 px-5 py-4 ${
                    r.hot ? "bg-flame/10" : ""
                  }`}
                >
                  <span className="font-medium">{r.day}</span>
                  <span>{r.doses}</span>
                  <span>{r.symptom}</span>
                  <span className="text-ink/70">{r.note}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}