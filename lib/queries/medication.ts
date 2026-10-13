import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { MedicationValues } from "@/lib/validation/medication";

const toArgs = (v: MedicationValues) => ({
  p_name: v.name,
  p_rxcui: v.rxcui ?? null,
  p_dose: v.dose,
  p_pills: v.pillsRemaining,
  p_per_dose: v.pillsPerDose,
  p_times: v.times.map((t) => t.value),
});

function useRefresh() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["medications"] });
    queryClient.invalidateQueries({ queryKey: ["dose_logs"] });
    queryClient.invalidateQueries({ queryKey: ["history"] });
  };
}

export function useMedications() {
  return useQuery({
    queryKey: ["medications"],
    queryFn: async () => {
      const { data, error } = await createClient()
        .from("medications")
        .select("*, schedules(id, time_of_day, created_at)")
        .order("created_at");
      if (error) throw error;
      return data;
    },
  });
}

export function useAddMedication() {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: async (v: MedicationValues) => {
      const { error } = await createClient().rpc("create_medication", toArgs(v));
      if (error) throw error;
    },
    onSuccess: refresh,
  });
}

export function useUpdateMedication(id: string) {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: async (v: MedicationValues) => {
      const { error } = await createClient().rpc("update_medication", { p_id: id, ...toArgs(v) });
      if (error) throw error;
    },
    onSuccess: refresh,
  });
}

export function useDeleteMedication() {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await createClient().from("medications").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: refresh,
  });
}

export function useRefill() {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: async (v: { id: string; pills: number }) => {
      const { error } = await createClient().rpc("refill_medication", {
        p_medication_id: v.id,
        p_pills: v.pills,
      });
      if (error) throw error;
    },
    onSuccess: refresh,
  });
}