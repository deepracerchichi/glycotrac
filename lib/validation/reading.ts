import { z } from "zod";

export const readingSchema = z
  .object({
    kind: z.enum(["glucose", "bp"]),
    context: z.enum(["fasting", "before_meal", "after_meal", "bedtime", "other"]).optional(),
    glucose: z.number().optional(),
    systolic: z.number().int().optional(),
    diastolic: z.number().int().optional(),
    note: z.string().max(300, "Keep notes under 300 characters").optional(),
    measuredAt: z.string().min(1, "Pick when you measured it"),
  })
  .superRefine((v, ctx) => {
    if (v.kind === "glucose") {
      if (v.glucose === undefined || Number.isNaN(v.glucose) || v.glucose <= 0) {
        ctx.addIssue({ code: "custom", path: ["glucose"], message: "Enter your reading" });
      }
      return;
    }
    if (v.systolic === undefined || Number.isNaN(v.systolic) || v.systolic < 50 || v.systolic > 300) {
      ctx.addIssue({ code: "custom", path: ["systolic"], message: "Enter the top number (50 to 300)" });
    }
    if (v.diastolic === undefined || Number.isNaN(v.diastolic) || v.diastolic < 30 || v.diastolic > 200) {
      ctx.addIssue({ code: "custom", path: ["diastolic"], message: "Enter the bottom number (30 to 200)" });
    }
    if (v.systolic !== undefined && v.diastolic !== undefined && v.systolic <= v.diastolic) {
      ctx.addIssue({ code: "custom", path: ["diastolic"], message: "The top number must be higher than the bottom" });
    }
  });

export type ReadingValues = z.infer<typeof readingSchema>;