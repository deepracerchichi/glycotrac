import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export type HistoryLog = {
  medication_id: string;
  scheduled_for: string;
  taken_at: string | null;
  name: string;
};

export function useDoseHistory(days: number) {
  return useQuery({
    queryKey: ["history", days],
    queryFn: async (): Promise<HistoryLog[]> => {
      const since = new Date();
      since.setDate(since.getDate() - days);
      since.setHours(0, 0, 0, 0);

      const { data, error } = await createClient()
        .from("dose_logs")
        .select("medication_id, scheduled_for, taken_at, medications(name)")
        .gte("scheduled_for", since.toISOString());
      if (error) throw error;

      return data.map((d) => {
        const med = Array.isArray(d.medications) ? d.medications[0] : d.medications;
        return {
          medication_id: d.medication_id,
          scheduled_for: d.scheduled_for,
          taken_at: d.taken_at,
          name: med?.name ?? "Medication",
        };
      });
    },
  });
}