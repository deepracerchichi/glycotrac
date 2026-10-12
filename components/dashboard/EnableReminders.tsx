"use client";

import { useState } from "react";
import { enableReminders } from "@/lib/push/enableReminders";

export default function EnableReminders() {
  const [status, setStatus] = useState<"idle" | "working" | "on" | "error">("idle");
  const [message, setMessage] = useState("");

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
    <section className="rounded-3xl bg-white p-5 ring-1 ring-black/5">
      <h2 className="text-xl font-medium">Reminders</h2>
      {status === "on" ? (
        <p className="mt-3 font-medium text-[#2f7d14]">✓ Reminders are on</p>
      ) : (
        <>
          <p className="mt-2 text-ink/70">Get a notification on this phone when a dose is due.</p>
          <button
            onClick={onClick}
            disabled={status === "working"}
            className="mt-4 min-h-12 rounded-full bg-mint px-6 font-medium text-forest disabled:opacity-60"
          >
            {status === "working" ? "Turning on..." : "Turn on reminders"}
          </button>
          {status === "error" && <p role="alert" className="mt-2 font-medium text-danger">{message}</p>}
        </>
      )}
    </section>
  );
}