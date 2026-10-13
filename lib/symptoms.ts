export const symptomOptions = [
  "Dizzy",
  "Tired",
  "Thirsty",
  "Headache",
  "Shaky",
  "Blurred vision",
  "Nausea",
  "Sweating",
  "Hungry",
];

export const severityLabels: Record<number, string> = { 1: "Mild", 2: "Moderate", 3: "Severe" };

export function toLocalInput(d = new Date()) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export type TakenDose = { taken_at: string; name: string };

export function doseBefore(occurredAt: string, doses: TakenDose[], windowHours = 6) {
  const t = new Date(occurredAt).getTime();
  let best: { name: string; minutes: number } | null = null;

  for (const d of doses) {
    const diff = t - new Date(d.taken_at).getTime();
    if (diff < 0 || diff > windowHours * 3_600_000) continue;
    const minutes = Math.round(diff / 60_000);
    if (!best || minutes < best.minutes) best = { name: d.name, minutes };
  }
  return best;
}

export function formatGap(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}