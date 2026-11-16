"use client";

import { useState } from "react";
import { CircleCheck, Download, Trash2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { inputClass } from "@/components/ui/Field";
import { createClient } from "@/lib/supabase/client";

const gone = [
  "Your medications, dose times and the record of every dose",
  "Your blood sugar and blood pressure readings",
  "Your symptoms and appointments",
  "Your emergency card and contacts",
  "Your settings, reminders and login",
];

export default function DataControls() {
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);
  const [exportError, setExportError] = useState("");

  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  async function download() {
    setExporting(true);
    setExported(false);
    setExportError("");

    try {
      const res = await fetch("/api/account/export");
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "We couldn't prepare your download. Please try again.");
      }

      const name = res.headers.get("content-disposition")?.match(/filename="([^"]+)"/)?.[1] ?? "glycotrac-data.json";
      const url = URL.createObjectURL(await res.blob());
      const link = document.createElement("a");
      link.href = url;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setExported(true);
    } catch (e) {
      setExportError(e instanceof Error ? e.message : "We couldn't prepare your download. Please try again.");
    } finally {
      setExporting(false);
    }
  }

  function close() {
    if (deleting) return;
    setOpen(false);
    setPassword("");
    setConfirm("");
    setDeleteError("");
  }

  async function deleteAccount(e: React.FormEvent) {
    e.preventDefault();
    setDeleting(true);
    setDeleteError("");

    try {
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, confirm }),
      });
      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        setDeleteError(body?.error ?? "Something went wrong. Please try again.");
        setDeleting(false);
        return;
      }

      await createClient().auth.signOut({ scope: "local" });
      window.location.assign("/goodbye");
    } catch {
      setDeleteError("Can't reach the server. Check your internet connection and try again.");
      setDeleting(false);
    }
  }

  const ready = confirm === "DELETE" && password.length > 0 && !deleting;

  return (
    <section aria-labelledby="your-data" className="mt-14">
      <h2 id="your-data" className="text-3xl font-medium tracking-tight">
        Your data
      </h2>
      <p className="mt-1 text-lg text-ink/70">Take a copy of everything, or remove it for good.</p>

      <div className="mt-6 grid gap-5">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <h3 className="flex items-center gap-2 text-xl font-medium">
            <Download className="size-5" aria-hidden="true" />
            Download your data
          </h3>
          <p className="mt-2 text-ink/70">
            Get one file with your medications, dose history, readings, symptoms, appointments and emergency details. For a
            page to show your doctor, use Summary instead.
          </p>
          <button
            type="button"
            onClick={download}
            disabled={exporting}
            className="mt-4 min-h-12 rounded-full bg-forest px-6 font-medium text-white transition hover:bg-pine active:scale-[0.98] disabled:opacity-60"
          >
            {exporting ? "Preparing..." : "Download my data"}
          </button>
          <p role="status" aria-live="polite" className="mt-3 min-h-6 text-base">
            {exported && (
              <span className="flex items-center gap-2 font-medium text-ok">
                <CircleCheck className="size-5" aria-hidden="true" />
                Downloaded. Check your Downloads folder.
              </span>
            )}
            {exportError && (
              <span role="alert" className="font-medium text-bad">
                {exportError}
              </span>
            )}
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-bad/30">
          <h3 className="flex items-center gap-2 text-xl font-medium text-bad">
            <Trash2 className="size-5" aria-hidden="true" />
            Delete your account
          </h3>
          <p className="mt-2 text-ink/70">
            This permanently removes your account and everything in it. It can&apos;t be undone, so download your data first
            if you want a copy.
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-4 min-h-12 rounded-full border-2 border-bad px-6 font-medium text-bad transition hover:bg-bad-bg active:scale-[0.98]"
          >
            Delete my account
          </button>
        </div>
      </div>

      <Modal open={open} onClose={close} title="Delete your account?" description="This is permanent.">
        <form onSubmit={deleteAccount} className="grid gap-5">
          <div>
            <p className="font-medium">This will remove for good:</p>
            <ul className="mt-2 grid gap-1.5 text-ink/80">
              {gone.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-bad" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <label className="grid gap-2 text-lg font-medium">
            Your password
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </label>

          <label className="grid gap-2 text-lg font-medium">
            Type DELETE to confirm
            <input
              type="text"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={inputClass}
            />
          </label>

          {deleteError && (
            <p role="alert" className="rounded-2xl bg-bad-bg p-4 font-medium text-bad">
              {deleteError}
            </p>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={close}
              disabled={deleting}
              className="min-h-14 rounded-full border-2 border-forest px-6 text-lg font-medium transition hover:bg-fog disabled:opacity-60"
            >
              Keep my account
            </button>
            <button
              type="submit"
              disabled={!ready}
              className="min-h-14 rounded-full bg-bad px-6 text-lg font-semibold text-white transition active:scale-[0.99] disabled:opacity-40"
            >
              {deleting ? "Deleting..." : "Delete everything"}
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
