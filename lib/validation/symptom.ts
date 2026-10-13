import { z } from "zod";

export const symptomSchema = z.object({
  name: z.string().trim().min(1, "Pick or type a symptom"),
  severity: z.number().int().min(1).max(3),
  note: z.string().max(500, "Keep notes under 500 characters").optional(),
  occurredAt: z.string().min(1, "Pick when it happened"),
});

export type SymptomValues = z.infer<typeof symptomSchema>;