import SettingsForm from "@/components/settings/SettingsForm";

export default function SettingsPage() {
  return (
    <div className=" max-w-xl">
      <h1 className="text-4xl font-medium tracking-tight md:text-5xl">Settings</h1>
      <p className="mt-1 text-xl text-ink/70">Units, targets and reminders.</p>
      <div className="mt-8"><SettingsForm /></div>
    </div>
  );
}