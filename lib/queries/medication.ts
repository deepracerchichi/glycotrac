import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { MedicationValues } from "@/lib/validation/medication";

export function useMedications() {
  return useQuery({
    queryKey: ["medications"],
    queryFn: async () => {
      const { data, error } = await createClient()
        .from("medications")
        .select("*, schedules(id, time_of_day)")
        .order("created_at");
      if (error) throw error;
      return data;
    },
  });
}

export function useAddMedication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (v: MedicationValues) => {
      const supabase = createClient();

      const { data: med, error } = await supabase
        .from("medications")
        .insert({
          name: v.name,
          rxcui: v.rxcui ?? null,
          dose: v.dose,
          pills_remaining: v.pillsRemaining,
          pills_per_dose: v.pillsPerDose,
        })
        .select("id")
        .single();
      if (error) throw error;

      const { error: scheduleError } = await supabase
        .from("schedules")
        .insert({ medication_id: med.id, time_of_day: v.time });
      if (scheduleError) throw scheduleError;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["medications"] }),
  });
}