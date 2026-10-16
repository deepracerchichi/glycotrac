import EmergencyCard from "@/components/emergency/EmergencyCard";
import ProfileForm from "@/components/emergency/ProfileForm";
import ContactsManager from "@/components/emergency/ContactsManager";

export default function EmergencyPage() {
  return (
    <div className=" max-w-4xl">
      <h1 className="text-4xl font-medium tracking-tight print:hidden md:text-5xl">Emergency card</h1>
      <p className="mt-1 text-xl text-ink/70 print:hidden">
        Print it or keep it open. It&apos;s only visible when you&apos;re logged in.
      </p>

      <div className="mt-8 grid gap-6">
        <EmergencyCard />
        <ProfileForm />
        <ContactsManager />
      </div>
    </div>
  );
}