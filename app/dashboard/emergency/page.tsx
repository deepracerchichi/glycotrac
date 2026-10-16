import { Pencil } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import ModalTrigger, { triggerOutline } from "@/components/ui/ModalTrigger";
import EmergencyCard from "@/components/emergency/EmergencyCard";
import ProfileForm from "@/components/emergency/ProfileForm";
import ContactForm from "@/components/emergency/ContactForm";
import ContactList from "@/components/emergency/ContactList";

export default function EmergencyPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Emergency card"
        subtitle="Print it or keep it open. It's only visible when you're logged in."
        action={
          <>
            <ModalTrigger
              label="Edit details"
              title="Your details"
              icon={<Pencil className="size-5" aria-hidden="true" />}
              className={triggerOutline}
            >
              <ProfileForm />
            </ModalTrigger>
            <ModalTrigger label="Add contact" title="Add a contact" description="Someone to call in an emergency.">
              <ContactForm />
            </ModalTrigger>
          </>
        }
      />

      <div className="mt-8 grid gap-6">
        <EmergencyCard />
        <ContactList />
      </div>
    </div>
  );
}