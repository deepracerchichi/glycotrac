import { NextResponse } from "next/server";
import webpush from "web-push";
import { createAdminClient } from "@/lib/supabase/admin";
import { lagosNow } from "@/lib/time";

export const dynamic = "force-dynamic";

type Med = { name: string; dose: string };

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

  const { data: schedules, error } = await admin
    .from("schedules")
    .select("id, user_id, medication_id, time_of_day, medications(name, dose)")
    .or(`last_notified_on.is.null,last_notified_on.lt.${date}`);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let sent = 0;

  for (const s of schedules) {
    const [h, m] = s.time_of_day.split(":").map(Number);
    const minutesLate = minutes - (h * 60 + m);
    if (minutesLate < 0 || minutesLate > 30) continue;

    const med = (Array.isArray(s.medications) ? s.medications[0] : s.medications) as
      | Med
      | undefined;

    const slot = `${date}T${s.time_of_day.slice(0, 5)}:00+01:00`;
    const { data: alreadyTaken } = await admin
      .from("dose_logs")
      .select("id")
      .eq("medication_id", s.medication_id)
      .eq("scheduled_for", slot)
      .not("taken_at", "is", null)
      .maybeSingle();

    if (!alreadyTaken) {
      const { data: subs } = await admin
        .from("push_subscriptions")
        .select("*")
        .eq("user_id", s.user_id);

      const payload = JSON.stringify({
        title: "Time for your medication",
        body: med ? `${med.name} · ${med.dose}` : "Open the app to see what's due",
        tag: s.id,
      });

      for (const sub of subs ?? []) {
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

    await admin.from("schedules").update({ last_notified_on: date }).eq("id", s.id);
  }

  return NextResponse.json({ sent });
}