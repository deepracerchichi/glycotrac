import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { startOfToday, type DoseLog } from "@/lib/today";

export function useTodayLogs() {
  return useQuery({
    queryKey: ["dose_logs", "today"],
    queryFn: async () => {
      const start = startOfToday();
      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      const { data, error } = await createClient()
        .from("dose_logs")
        .select("medication_id, scheduled_for, taken_at")
        .gte("scheduled_for", start.toISOString())
        .lt("scheduled_for", end.toISOString());
      if (error) throw error;
      return data as DoseLog[];
    },
  });
}

export function useTakeDose() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (v: { medicationId: string; scheduledFor: string }) => {
      const { error } = await createClient().rpc("take_dose", {
        p_medication_id: v.medicationId,
        p_scheduled_for: v.scheduledFor,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dose_logs"] });
      queryClient.invalidateQueries({ queryKey: ["medications"] });
    },
  });
}