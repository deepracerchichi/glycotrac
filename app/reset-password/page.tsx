"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthShell from "@/components/auth/AuthShell";
import { createClient } from "@/lib/supabase/client";
import { resetSchema, type ResetValues } from "@/lib/validation/auth";

const input = "min-h-14 w-full rounded-2xl border-2 border-forest bg-white px-4 text-lg";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [expired, setExpired] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetValues>({ resolver: zodResolver(resetSchema) });

  async function onSubmit({ password }: ResetValues) {
    setError("");
    setExpired(false);

    const { error } = await createClient().auth.updateUser({ password });

    if (error) {
      if (error.message.toLowerCase().includes("session")) return setExpired(true);
      return setError(error.message);
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <AuthShell>
      <div className="grid gap-6">
        <h1 className="text-5xl font-medium tracking-tight">Choose a new password</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
          <label className="grid gap-2 text-lg font-medium">
            New password
            <input type="password" autoComplete="new-password" className={input} {...register("password")} />
            {errors.password && <span role="alert" className="font-normal text-danger">{errors.password.message}</span>}
          </label>

          <label className="grid gap-2 text-lg font-medium">
            Confirm new password
            <input type="password" autoComplete="new-password" className={input} {...register("confirm")} />
            {errors.confirm && <span role="alert" className="font-normal text-danger">{errors.confirm.message}</span>}
          </label>

          {error && <p role="alert" className="font-medium text-danger">{error}</p>}
          {expired && (
            <p role="alert" className="font-medium text-danger">
              This link has expired.{" "}
              <Link href="/forgot-password" className="underline">Request a new one</Link>.
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="min-h-14 rounded-full bg-mint px-6 text-xl font-semibold text-forest disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Save new password"}
          </button>
        </form>
      </div>
    </AuthShell>
  );
}