import { Bell, CircleCheck, TriangleAlert } from "lucide-react";
import { DoseRow } from "./mocks";

export default function HeroVisual() {
  return (
    <div aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-md lg:max-w-none">
      <div className="hero-orbit absolute inset-0 rounded-full border border-dashed border-white/20" />
      <div className="hero-orbit absolute inset-12 rounded-full border border-white/10" />

      <div className="hero-screen absolute inset-0 m-auto h-fit w-60 rounded-[2rem] bg-white p-4 text-ink shadow-2xl sm:w-72">
        <p className="mb-3 text-lg font-medium">Today</p>
        <div className="grid gap-2">
          <DoseRow time="08:00" name="Morning tablet · 500mg" status="Taken" icon="taken" tone="success" />
          <DoseRow time="13:00" name="Lunch tablet · 500mg" status="Due" icon="due" tone="warning" />
          <DoseRow time="20:00" name="Evening tablet · 500mg" status="Later" tone="muted" />
        </div>
      </div>

      <div className="hero-float absolute right-0 top-[10%] w-36 rounded-2xl bg-mint p-3 text-forest shadow-xl sm:w-44">
        <p className="text-sm">Morning dose</p>
        <p className="flex items-center gap-1.5 text-lg font-medium">
          <CircleCheck className="size-5" aria-hidden="true" />
          Taken 08:04
        </p>
      </div>

      <div className="hero-float absolute left-0 top-[20%] w-36 rounded-2xl bg-white/10 p-3 text-white ring-1 ring-white/20 backdrop-blur sm:w-44">
        <p className="flex items-center gap-1.5 text-sm text-white/70">
          <Bell className="size-4" aria-hidden="true" />
          Reminder
        </p>
        <p className="text-lg font-medium">13:00 tablet</p>
      </div>

      <div className="hero-float absolute bottom-[8%] left-[4%] w-40 rounded-2xl bg-white p-3 text-ink shadow-xl sm:w-48">
        <p className="text-sm text-ink/60">Morning tablet</p>
        <p className="flex items-center gap-1.5 text-lg font-medium text-warning">
          <TriangleAlert className="size-5" aria-hidden="true" />
          5 days left
        </p>
      </div>
    </div>
  );
}