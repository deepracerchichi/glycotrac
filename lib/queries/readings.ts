import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export type Reading = {
  id: string;
  kind: "glucose" | "bp";
  context: string | null;
  glucose_mgdl: number | null;
  systolic: number | null;
  diastolic: number | null;
  note: string | null;
  measured_at: string;
};

export type NewReading = {
  kind: "glucose" | "bp";
  context: string | null;
  glucoseMgdl: number | null;
  systolic: number | null;
  diastolic: number | null;
  note: string | null;
  measuredAt: string;
};

export function useReadings(days: number) {
  return useQuery({
    queryKey: ["readings", days],
    queryFn: async (): Promise<Reading[]> => {
      const since = new Date();
      since.setDate(since.getDate() - days);
      since.setHours(0, 0, 0, 0);

      const { data, error } = await createClient()
        .from("readings")
        .select("id, kind, context, glucose_mgdl, systolic, diastolic, note, measured_at")
        .gte("measured_at", since.toISOString())
        .order("measured_at", { ascending: false });
      if (error) throw error;

      return data.map((r) => ({ ...r, glucose_mgdl: r.glucose_mgdl == null ? null : Number(r.glucose_mgdl) })) as Reading[];
    },
  });
}

export function useAddReading() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (r: NewReading) => {
      const { error } = await createClient().from("readings").insert({
        kind: r.kind,
        context: r.context,
        glucose_mgdl: r.glucoseMgdl,
        systolic: r.systolic,
        diastolic: r.diastolic,
        note: r.note,
        measured_at: new Date(r.measuredAt).toISOString(),
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["readings"] }),
  });
}

export function useDeleteReading() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await createClient().from("readings").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["readings"] }),
  });
}