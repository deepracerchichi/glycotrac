// CLINICIAN REVIEW REQUIRED before launch: the alert cutoffs and messages below.
export const MGDL_PER_MMOL = 18.016;
export type GlucoseUnit = "mgdl" | "mmol";

export const GLUCOSE_VERY_LOW = 54; // mg/dL
export const GLUCOSE_VERY_HIGH = 300; // mg/dL
export const BP_VERY_HIGH_SYS = 180;
export const BP_VERY_HIGH_DIA = 120;

export const toMgdl = (v: number, unit: GlucoseUnit) =>
  unit === "mmol" ? Math.round(v * MGDL_PER_MMOL * 10) / 10 : v;

export const fromMgdl = (mg: number, unit: GlucoseUnit) =>
  unit === "mmol" ? Math.round((mg / MGDL_PER_MMOL) * 10) / 10 : Math.round(mg);

export const unitLabel = (unit: GlucoseUnit) => (unit === "mmol" ? "mmol/L" : "mg/dL");

export const formatGlucose = (mg: number, unit: GlucoseUnit) =>
  `${fromMgdl(mg, unit)} ${unitLabel(unit)}`;

export const contexts: Record<string, string> = {
  fasting: "Fasting",
  before_meal: "Before a meal",
  after_meal: "After a meal",
  bedtime: "Bedtime",
  other: "Other",
};

export type Targets = {
  glucose_target_low: number | null;
  glucose_target_high: number | null;
  bp_sys_max: number | null;
  bp_dia_max: number | null;
};

export type Level = "alert-low" | "alert-high" | "below" | "above" | "in" | "none";

export function glucoseLevel(mg: number, t: Targets | null): Level {
  if (mg < GLUCOSE_VERY_LOW) return "alert-low";
  if (mg >= GLUCOSE_VERY_HIGH) return "alert-high";
  if (t?.glucose_target_low != null && mg < t.glucose_target_low) return "below";
  if (t?.glucose_target_high != null && mg > t.glucose_target_high) return "above";
  if (t?.glucose_target_low != null || t?.glucose_target_high != null) return "in";
  return "none";
}

export function bpLevel(sys: number, dia: number, t: Targets | null): Level {
  if (sys >= BP_VERY_HIGH_SYS || dia >= BP_VERY_HIGH_DIA) return "alert-high";
  if ((t?.bp_sys_max != null && sys > t.bp_sys_max) || (t?.bp_dia_max != null && dia > t.bp_dia_max)) {
    return "above";
  }
  if (t?.bp_sys_max != null || t?.bp_dia_max != null) return "in";
  return "none";
}

export const levelStyle: Record<Level, { label: string; chip: string }> = {
  "alert-low": { label: "Very low", chip: "bg-[#fbe0e0] text-[#a31515]" },
  "alert-high": { label: "Very high", chip: "bg-[#fbe0e0] text-[#a31515]" },
  below: { label: "Below target", chip: "bg-[#fdebd3] text-[#9a4a07]" },
  above: { label: "Above target", chip: "bg-[#fdebd3] text-[#9a4a07]" },
  in: { label: "In target", chip: "bg-[#e3f3da] text-[#2f7d14]" },
  none: { label: "", chip: "" },
};

export function alertMessage(kind: "glucose" | "bp", level: Level): string | null {
  if (kind === "glucose" && level === "alert-low") {
    return "This reading is very low. Follow the plan your doctor gave you. If you feel unwell or confused, or can't treat it, get medical help now.";
  }
  if (kind === "glucose" && level === "alert-high") {
    return "This reading is very high. Contact your doctor or clinic. If you feel very unwell, are vomiting or breathing fast, get medical help now.";
  }
  if (kind === "bp" && level === "alert-high") {
    return "This blood pressure is very high. Contact your doctor. If you have chest pain, a severe headache, weakness or trouble speaking, get emergency help now.";
  }
  return null;
}