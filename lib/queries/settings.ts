import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { GlucoseUnit } from "@/lib/readings";

export type Settings = {
  glucose_unit: GlucoseUnit;
  glucose_target_low: number | null;
  glucose_target_high: number | null;
  bp_sys_max: number | null;
  bp_dia_max: number | null;
  foot_check_enabled: boolean;
};

export const defaultSettings: Settings = {
  glucose_unit: "mgdl",
  glucose_target_low: null,
  glucose_target_high: null,
  bp_sys_max: null,
  bp_dia_max: null,
  foot_check_enabled: false,
};

const columns =
  "glucose_unit, glucose_target_low, glucose_target_high, bp_sys_max, bp_dia_max, foot_check_enabled";

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: async (): Promise<Settings> => {
      const { data, error } = await createClient().from("user_settings").select(columns).maybeSingle();
      if (error) throw error;
      return { ...defaultSettings, ...(data ?? {}) } as Settings;
    },
  });
}

export function useSaveSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (s: Settings) => {
      const { error } = await createClient()
        .from("user_settings")
        .upsert({ ...s, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["settings"] }),
  });
}