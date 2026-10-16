import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { normalizePhone } from "@/lib/phone";
import type { ContactValues, ProfileValues } from "@/lib/validation/emergency";

export type Profile = {
  full_name: string | null;
  conditions: string | null;
  allergies: string | null;
  doctor_name: string | null;
  doctor_phone: string | null;
  notes: string | null;
};

export type Contact = {
  id: string;
  name: string;
  relationship: string | null;
  phone: string;
  notify_on_missed: boolean;
  consent_confirmed: boolean;
};

const clean = (v?: string) => (v?.trim() ? v.trim() : null);

export function useEmergencyProfile() {
  return useQuery({
    queryKey: ["emergency_profile"],
    queryFn: async (): Promise<Profile | null> => {
      const { data, error } = await createClient()
        .from("emergency_profile")
        .select("full_name, conditions, allergies, doctor_name, doctor_phone, notes")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useSaveProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (v: ProfileValues) => {
      const { error } = await createClient().from("emergency_profile").upsert(
        {
          full_name: clean(v.fullName),
          conditions: clean(v.conditions),
          allergies: clean(v.allergies),
          doctor_name: clean(v.doctorName),
          doctor_phone: clean(v.doctorPhone),
          notes: clean(v.notes),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["emergency_profile"] }),
  });
}

export function useContacts() {
  return useQuery({
    queryKey: ["emergency_contacts"],
    queryFn: async (): Promise<Contact[]> => {
      const { data, error } = await createClient()
        .from("emergency_contacts")
        .select("id, name, relationship, phone, notify_on_missed, consent_confirmed")
        .order("created_at");
      if (error) throw error;
      return data;
    },
  });
}

export function useAddContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (v: ContactValues) => {
      const { error } = await createClient().from("emergency_contacts").insert({
        name: v.name,
        relationship: clean(v.relationship),
        phone: normalizePhone(v.phone),
        notify_on_missed: v.notifyOnMissed,
        consent_confirmed: v.consent,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["emergency_contacts"] }),
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await createClient().from("emergency_contacts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["emergency_contacts"] }),
  });
}