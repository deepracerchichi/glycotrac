import { z } from "zod";

export const medicationSchema = z.object({
  name: z.string().min(1, "Enter the medication name"),
  rxcui: z.string().optional(),
  dose: z.string().min(1, "Enter the dose, e.g. 500mg"),
  pillsRemaining: z.number({ message: "Enter a number" }).int().min(0, "Can't be negative"),
  pillsPerDose: z.number({ message: "Enter a number" }).int().min(1, "At least 1"),
  time: z.string().min(1, "Pick a time"),
});

export type MedicationValues = z.infer<typeof medicationSchema>;