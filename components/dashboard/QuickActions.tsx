import Link from "next/link";
import { Activity, CalendarDays, Droplet, HeartPulse, Settings } from "lucide-react";

const actions = [
  { href: "/dashboard/readings", label: "Log a reading", text: "Blood sugar or blood pressure.", Icon: Droplet },
  { href: "/dashboard/symptoms", label: "Log a symptom", text: "Note how you feel right now.", Icon: Activity },
  { href: "/dashboard/appointments", label: "Appointments", text: "Visits, lab tests and check-ups.", Icon: CalendarDays },
  { href: "/dashboard/emergency", label: "Emergency card", text: "Your details, ready to print.", Icon: HeartPulse },
  { href: "/dashboard/settings", label: "Settings", text: "Units, targets and reminders.", Icon: Settings },
];

export default function QuickActions() {
  return (
    <div className="grid gap-4">
      {actions.map(({ href, label, text, Icon }) => (
        <Link key={href} href={href} className="flex items-start gap-4 rounded-3xl bg-white p-5 ring-1 ring-black/5 hover:bg-fog">
          <Icon className="mt-1 size-6 shrink-0" aria-hidden="true" />
          <div>
            <p className="text-xl font-medium">{label}</p>
            <p className="text-ink/70">{text}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}