import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { AppointmentValues } from "@/lib/validation/appointment";

export type Appointment = {
  id: string;
  title: string;
  kind: string;
  scheduled_at: string;
  location: string | null;
  notes: string | null;
  done: boolean;
};

export function useAppointments() {
  return useQuery({
    queryKey: ["appointments"],
    queryFn: async (): Promise<Appointment[]> => {
      const since = new Date();
      since.setDate(since.getDate() - 30);

      const { data, error } = await createClient()
        .from("appointments")
        .select("id, title, kind, scheduled_at, location, notes, done")
        .gte("scheduled_at", since.toISOString())
        .order("scheduled_at");
      if (error) throw error;
      return data;
    },
  });
}

function useRefresh() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["appointments"] });
}

export function useAddAppointment() {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: async (v: AppointmentValues) => {
      const { error } = await createClient().from("appointments").insert({
        title: v.title,
        kind: v.kind,
        scheduled_at: new Date(v.scheduledAt).toISOString(),
        location: v.location?.trim() ? v.location.trim() : null,
        notes: v.notes?.trim() ? v.notes.trim() : null,
      });
      if (error) throw error;
    },
    onSuccess: refresh,
  });
}

export function useSetAppointmentDone() {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: async (v: { id: string; done: boolean }) => {
      const { error } = await createClient().from("appointments").update({ done: v.done }).eq("id", v.id);
      if (error) throw error;
    },
    onSuccess: refresh,
  });
}

export function useDeleteAppointment() {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await createClient().from("appointments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: refresh,
  });
}