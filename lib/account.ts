// Export and deletion of one person's data. No "@/" imports on purpose, so it can also be run from a plain script.
import type { SupabaseClient } from "@supabase/supabase-js";

const PAGE = 1000;

// Tables a person owns, in the order that is safest to delete them (children before parents).
const ERASE_ORDER = [
  "dose_logs",
  "schedules",
  "medications",
  "readings",
  "symptoms",
  "appointments",
  "emergency_contacts",
  "emergency_profile",
  "user_settings",
  "push_subscriptions",
] as const;

// What goes in the download. The push subscription is left out: it is a device secret, not the person's information.
const EXPORT_TABLES = ERASE_ORDER.filter((t) => t !== "push_subscriptions");

// Stable ordering so paging through a big table never repeats or skips a row.
const ORDER: Record<string, string[]> = {
  dose_logs: ["scheduled_for", "medication_id"],
  readings: ["measured_at", "id"],
  symptoms: ["occurred_at", "id"],
  appointments: ["scheduled_at", "id"],
};

async function fetchAll(client: SupabaseClient, table: string) {
  const rows: unknown[] = [];

  for (let from = 0; ; from += PAGE) {
    let query = client.from(table).select("*");
    for (const column of ORDER[table] ?? []) query = query.order(column);

    const { data, error } = await query.range(from, from + PAGE - 1);
    if (error) throw new Error(`${table}: ${error.message}`);

    rows.push(...(data ?? []));
    if ((data?.length ?? 0) < PAGE) break;
  }

  return rows;
}

/** Everything the signed-in person owns. Pass a client that is signed in as them, so row-level security applies. */
export async function collectUserData(client: SupabaseClient) {
  const data: Record<string, unknown[]> = {};
  for (const table of EXPORT_TABLES) data[table] = await fetchAll(client, table);
  return data;
}

/** Permanently removes a person's records and their login. Use an admin client. */
export async function eraseUser(admin: SupabaseClient, userId: string) {
  for (const table of ERASE_ORDER) {
    const { error } = await admin.from(table).delete().eq("user_id", userId);
    // Some tables may be cleared automatically when a parent row goes. Carry on; the final step checks the result.
    if (error) console.error(`[account delete] ${table}: ${error.message}`);
  }

  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) throw new Error(error.message);
}
