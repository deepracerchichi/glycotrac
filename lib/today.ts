export type Slot = {
  medicationId: string;
  name: string;
  dose: string;
  time: string;
  scheduledFor: string;
  taken: boolean;
};

type MedWithSchedules = {
  id: string;
  name: string;
  dose: string;
  schedules: { id: string; time_of_day: string }[];
};

export type DoseLog = {
  medication_id: string;
  scheduled_for: string;
  taken_at: string | null;
};

export type MedSupply = {
  pills_remaining: number;
  pills_per_dose: number;
  refill_threshold_days: number;
  schedules: { id: string }[];
};

export function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function buildSlots(meds: MedWithSchedules[], logs: DoseLog[]): Slot[] {
  const takenKeys = new Set(
    logs
      .filter((l) => l.taken_at)
      .map((l) => `${l.medication_id}|${new Date(l.scheduled_for).getTime()}`)
  );

  const slots: Slot[] = [];

  for (const med of meds) {
    for (const s of med.schedules) {
      const [h, m] = s.time_of_day.split(":").map(Number);
      const when = startOfToday();
      when.setHours(h, m, 0, 0);

      slots.push({
        medicationId: med.id,
        name: med.name,
        dose: med.dose,
        time: s.time_of_day.slice(0, 5),
        scheduledFor: when.toISOString(),
        taken: takenKeys.has(`${med.id}|${when.getTime()}`),
      });
    }
  }

  return slots.sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor));
}

export function daysLeft(med: MedSupply): number | null {
  const pillsPerDay = med.pills_per_dose * med.schedules.length;
  if (pillsPerDay === 0) return null;
  return Math.floor(med.pills_remaining / pillsPerDay);
}

export function isLowSupply(med: MedSupply): boolean {
  const days = daysLeft(med);
  return days !== null && days <= med.refill_threshold_days;
}