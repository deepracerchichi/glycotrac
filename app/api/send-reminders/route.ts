import { NextResponse } from "next/server";
import webpush from "web-push";
import { createAdminClient } from "@/lib/supabase/admin";
import { lagosNow } from "@/lib/time";
import { sendSms } from "@/lib/sms";

export const dynamic = "force-dynamic";

type Med = { name: string; dose: string };
type Sub = { id: string; endpoint: string; p256dh: string; auth: string };

export async function POST(request: Request) {
  if (request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );

  const admin = createAdminClient();
  const { date, minutes } = lagosNow();
  const weekday = new Date(`${date}T00:00:00Z`).getUTCDay();
  let sent = 0;
  let texted = 0;

  async function push(userId: string, title: string, body: string, tag: string) {
    const { data: subs } = await admin.from("push_subscriptions").select("*").eq("user_id", userId);
    const payload = JSON.stringify({ title, body, tag });

    for (const sub of (subs ?? []) as Sub[]) {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        );
        sent++;
      } catch (e) {
        const status = (e as { statusCode?: number }).statusCode;
        if (status === 404 || status === 410) {
          await admin.from("push_subscriptions").delete().eq("id", sub.id);
        }
      }
    }
  }

  // 1. Dose reminders: first, follow-up, then escalation
  const { data: schedules, error } = await admin
    .from("schedules")
    .select("id, user_id, medication_id, time_of_day, last_notified_on, last_followup_on, last_escalated_on, medications(name, dose)");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const stale = (d: string | null) => d !== date;

  for (const s of schedules) {
    const [h, m] = s.time_of_day.split(":").map(Number);
    const late = minutes - (h * 60 + m);
    if (late < 0 || late > 240) continue;

    const slot = `${date}T${s.time_of_day.slice(0, 5)}:00+01:00`;
    const { data: taken } = await admin
      .from("dose_logs")
      .select("id")
      .eq("medication_id", s.medication_id)
      .eq("scheduled_for", slot)
      .not("taken_at", "is", null)
      .maybeSingle();
    if (taken) continue;

    const med = (Array.isArray(s.medications) ? s.medications[0] : s.medications) as Med | undefined;
    const label = med ? `${med.name} · ${med.dose}` : "Open the app to see what's due";

    if (late <= 30 && stale(s.last_notified_on)) {
      await push(s.user_id, "Time for your medication", label, s.id);
      await admin.from("schedules").update({ last_notified_on: date }).eq("id", s.id);
    } else if (late >= 45 && late < 120 && stale(s.last_followup_on)) {
      await push(s.user_id, "Still waiting to hear from you", `${label}. Mark it as taken when you have.`, `${s.id}-f`);
      await admin.from("schedules").update({ last_followup_on: date, last_notified_on: date }).eq("id", s.id);
    } else if (late >= 120 && stale(s.last_escalated_on)) {
      await push(s.user_id, "Missed dose", `${label} hasn't been logged. Open the app to log it.`, `${s.id}-m`);

      const { data: contacts } = await admin
        .from("emergency_contacts")
        .select("name, phone")
        .eq("user_id", s.user_id)
        .eq("notify_on_missed", true)
        .eq("consent_confirmed", true);

      if (contacts?.length) {
        const { data: profile } = await admin
          .from("emergency_profile")
          .select("full_name")
          .eq("user_id", s.user_id)
          .maybeSingle();
        const who = profile?.full_name?.trim() || "Someone who listed you as a contact";

        for (const c of contacts) {
          const ok = await sendSms(c.phone, `${who} hasn't confirmed a scheduled dose in the app. Please check on them.`);
          if (ok) texted++;
        }
      }

      await admin
        .from("schedules")
        .update({ last_escalated_on: date, last_notified_on: date, last_followup_on: date })
        .eq("id", s.id);
    }
  }

  // 2. Appointments in the next 24 hours
  const { data: appts } = await admin
    .from("appointments")
    .select("id, user_id, title, scheduled_at")
    .eq("done", false)
    .is("reminded_at", null)
    .gte("scheduled_at", new Date().toISOString())
    .lte("scheduled_at", new Date(Date.now() + 24 * 3600 * 1000).toISOString());

  for (const a of appts ?? []) {
    const when = new Date(a.scheduled_at).toLocaleString("en-GB", {
      timeZone: "Africa/Lagos",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
    await push(a.user_id, "Appointment coming up", `${a.title}, ${when}`, a.id);
    await admin.from("appointments").update({ reminded_at: new Date().toISOString() }).eq("id", a.id);
  }

  // 3. Weekly foot check: Sunday 18:00 to 18:30 Lagos time
  if (weekday === 0 && minutes >= 18 * 60 && minutes <= 18 * 60 + 30) {
    const { data: due } = await admin
      .from("user_settings")
      .select("user_id")
      .eq("foot_check_enabled", true)
      .or(`foot_check_last_on.is.null,foot_check_last_on.lt.${date}`);

    for (const u of due ?? []) {
      await push(
        u.user_id,
        "Weekly foot check",
        "Look at both feet for cuts, blisters, redness or swelling. Tell your doctor about anything new.",
        `foot-${date}`
      );
      await admin.from("user_settings").update({ foot_check_last_on: date }).eq("user_id", u.user_id);
    }
  }

  return NextResponse.json({ sent, texted });
}