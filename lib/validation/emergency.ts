import { z } from "zod";
import { normalizePhone } from "@/lib/phone";

export const profileSchema = z.object({
  fullName: z.string().max(120).optional(),
  conditions: z.string().max(300).optional(),
  allergies: z.string().max(300).optional(),
  doctorName: z.string().max(120).optional(),
  doctorPhone: z.string().max(40).optional(),
  notes: z.string().max(500).optional(),
});
export type ProfileValues = z.infer<typeof profileSchema>;

export const contactSchema = z
  .object({
    name: z.string().trim().min(1, "Enter their name"),
    relationship: z.string().max(60).optional(),
    phone: z
      .string()
      .refine((v) => normalizePhone(v) !== null, "Use a number like 0801 234 5678 or +44 7700 900123"),
    notifyOnMissed: z.boolean(),
    consent: z.boolean(),
  })
  .refine((v) => !v.notifyOnMissed || v.consent, {
    path: ["consent"],
    message: "Confirm they agreed before turning this on",
  });
export type ContactValues = z.infer<typeof contactSchema>;