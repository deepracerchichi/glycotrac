import PageHeader from "@/components/ui/PageHeader";
import ModalTrigger from "@/components/ui/ModalTrigger";
import AppointmentForm from "@/components/appointments/AppointmentForm";
import AppointmentStats from "@/components/appointments/AppointmentStats";
import AppointmentList from "@/components/appointments/AppointmentList";

export default function AppointmentsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Appointments"
        subtitle="Doctor visits, lab tests and check-ups."
        action={
          <ModalTrigger label="Add appointment" title="Add appointment" description="You'll get a reminder the day before.">
            <AppointmentForm />
          </ModalTrigger>
        }
      />

      <div className="mt-8 grid gap-6">
        <AppointmentStats />
        <AppointmentList />
      </div>
    </div>
  );
}