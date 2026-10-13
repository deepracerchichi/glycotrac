import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { SymptomValues } from "@/lib/validation/symptom";

export type Symptom = {
  id: string;
  name: string;
  severity: number;
  note: string | null;
  occurred_at: string;
};

export function useSymptoms(days: number) {
  return useQuery({
    queryKey: ["symptoms", days],
    queryFn: async (): Promise<Symptom[]> => {
      const since = new Date();
      since.setDate(since.getDate() - days);
      since.setHours(0, 0, 0, 0);

      const { data, error } = await createClient()
        .from("symptoms")
        .select("id, name, severity, note, occurred_at")
        .gte("occurred_at", since.toISOString())
        .order("occurred_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useAddSymptom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (v: SymptomValues) => {
      const { error } = await createClient().from("symptoms").insert({
        name: v.name,
        severity: v.severity,
        note: v.note?.trim() ? v.note.trim() : null,
        occurred_at: new Date(v.occurredAt).toISOString(),
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["symptoms"] }),
  });
}

export function useDeleteSymptom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await createClient().from("symptoms").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["symptoms"] }),
  });
}