import AppointmentForm from "@/components/appointments/AppointmentForm";
import AppointmentList from "@/components/appointments/AppointmentList";

export default function AppointmentsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-4xl font-medium tracking-tight md:text-5xl">Appointments</h1>
      <p className="mt-1 text-xl text-ink/70">Doctor visits, lab tests and check-ups.</p>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[28rem_1fr]">
        <AppointmentForm />
        <AppointmentList />
      </div>
    </div>
  );
}