"use client";

import { useEffect, useState } from "react";
import { BellRing, CircleCheck, Share } from "lucide-react";
import { enableReminders } from "@/lib/push/enableReminders";

type Status = "checking" | "idle" | "working" | "on" | "error" | "ios";

export default function EnableReminders() {
  const [status, setStatus] = useState<Status>("checking");
  const [message, setMessage] = useState("");

  // On load: already on? Or an iPhone that needs "Add to Home Screen" first?
  useEffect(() => {
    let cancelled = false;

    async function check() {
      let next: Status = "idle";
      try {
        const standalone =
          window.matchMedia("(display-mode: standalone)").matches ||
          (navigator as Navigator & { standalone?: boolean }).standalone === true;
        const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);

        if (ios && !standalone) {
          next = "ios";
        } else if ("serviceWorker" in navigator && "PushManager" in window) {
          const registration = await navigator.serviceWorker.getRegistration("/sw.js");
          const subscription = await registration?.pushManager.getSubscription();
          if (subscription && Notification.permission === "granted") next = "on";
        }
      } catch {
        next = "idle";
      }
      if (!cancelled) setStatus(next);
    }

    check();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onClick() {
    setStatus("working");
    try {
      await enableReminders();
      setStatus("on");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <section id="reminders" className="scroll-mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <h2 className="flex items-center gap-2 text-xl font-medium">
        <BellRing className="size-5" aria-hidden="true" />
        Reminders
      </h2>

      {status === "checking" && <div className="mt-3 h-12 animate-pulse rounded-xl bg-fog motion-reduce:animate-none" aria-hidden="true" />}

      {status === "on" && (
        <p className="mt-3 flex items-center gap-2 font-medium text-ok">
          <CircleCheck className="size-5" aria-hidden="true" />
          Reminders are on for this phone
        </p>
      )}

      {status === "ios" && (
        <div className="mt-3 grid gap-2 text-ink/80">
          <p className="font-medium text-ink">On iPhone, one extra step first:</p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>
              Tap the <Share className="inline size-4 align-text-bottom" aria-hidden="true" /> Share button in Safari.
            </li>
            <li>Choose &ldquo;Add to Home Screen&rdquo;.</li>
            <li>Open Glycotrac from your Home Screen and turn on reminders here.</li>
          </ol>
        </div>
      )}

      {(status === "idle" || status === "working" || status === "error") && (
        <>
          <p className="mt-2 text-ink/70">Get a notification on this phone when a dose is due.</p>
          <button
            type="button"
            onClick={onClick}
            disabled={status === "working"}
            className="mt-4 min-h-12 rounded-full bg-forest px-6 font-medium text-white transition hover:bg-pine active:scale-[0.98] disabled:opacity-60"
          >
            {status === "working" ? "Turning on..." : "Turn on reminders"}
          </button>
          {status === "error" && (
            <p role="alert" className="mt-3 font-medium text-bad">
              {message}
            </p>
          )}
        </>
      )}
    </section>
  );
}
