import { z } from "zod";

export const appointmentSchema = z.object({
  title: z.string().trim().min(1, "Enter a title, e.g. Clinic visit"),
  kind: z.enum(["doctor", "lab", "eye", "foot", "kidney", "other"]),
  scheduledAt: z.string().min(1, "Pick a date and time"),
  location: z.string().max(200).optional(),
  notes: z.string().max(500, "Keep notes under 500 characters").optional(),
});

export type AppointmentValues = z.infer<typeof appointmentSchema>;