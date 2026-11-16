import Link from "next/link";
import { Activity, CalendarDays, Droplet, HeartPulse } from "lucide-react";

const actions = [
  { href: "/dashboard/emergency", label: "Emergency card", text: "Your details, ready to print.", Icon: HeartPulse, urgent: true },
  { href: "/dashboard/readings", label: "Log a reading", text: "Blood sugar or blood pressure.", Icon: Droplet, urgent: false },
  { href: "/dashboard/symptoms", label: "Log a symptom", text: "Note how you feel right now.", Icon: Activity, urgent: false },
  { href: "/dashboard/appointments", label: "Appointments", text: "Visits, lab tests and check-ups.", Icon: CalendarDays, urgent: false },
];

export default function QuickActions() {
  return (
    <nav aria-label="Quick actions" className="grid grid-cols-2 gap-3 xl:grid-cols-1">
      {actions.map(({ href, label, text, Icon, urgent }) => (
        <Link
          key={href}
          href={href}
          className={`flex flex-col items-start gap-3 rounded-3xl p-4 shadow-sm ring-1 transition active:scale-[0.99] xl:flex-row xl:p-5 ${
            urgent ? "bg-bad-bg text-bad ring-bad/20 hover:bg-bad-bg/70" : "bg-white ring-black/5 hover:bg-fog"
          }`}
        >
          <Icon className="size-7 shrink-0 xl:mt-1 xl:size-6" aria-hidden="true" />
          <div>
            <p className="text-lg font-medium leading-snug xl:text-xl">{label}</p>
            <p className={`hidden xl:block ${urgent ? "text-bad/80" : "text-ink/70"}`}>{text}</p>
          </div>
        </Link>
      ))}
    </nav>
  );
}
