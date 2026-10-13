import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Use at least 8 characters"),
});

export type AuthValues = z.infer<typeof authSchema>;

export const emailSchema = authSchema.pick({ email: true });
export type EmailValues = z.infer<typeof emailSchema>;

export const resetSchema = z
  .object({
    password: z.string().min(8, "Use at least 8 characters"),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { message: "Passwords don't match", path: ["confirm"] });

export type ResetValues = z.infer<typeof resetSchema>;