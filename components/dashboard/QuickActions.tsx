import Link from "next/link";
import { Activity, FileText } from "lucide-react";

const actions = [
  { href: "/dashboard/symptoms", label: "Log a symptom", text: "Note how you feel right now.", Icon: Activity },
  { href: "/dashboard/summary", label: "Doctor summary", text: "Doses and symptoms on one page.", Icon: FileText },
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