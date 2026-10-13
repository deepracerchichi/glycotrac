"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthShell from "@/components/auth/AuthShell";
import { createClient } from "@/lib/supabase/client";
import { emailSchema, type EmailValues } from "@/lib/validation/auth";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailValues>({ resolver: zodResolver(emailSchema) });

  async function onSubmit({ email }: EmailValues) {
    setError("");
    const { error } = await createClient().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });
    if (error) return setError(error.message);
    setSent(true);
  }

  return (
    <AuthShell>
      <div className="grid gap-6">
        <div>
          <h1 className="text-5xl font-medium tracking-tight">Reset your password</h1>
          <p className="mt-2 text-xl text-ink/70">We&apos;ll email you a link to choose a new one.</p>
        </div>

        {sent ? (
          <p role="status" className="rounded-2xl bg-sage p-5 text-lg font-medium">
            If an account exists for that email, a reset link is on its way. Open it in this same browser.
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
            <label className="grid gap-2 text-lg font-medium">
              Email address
              <input
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                className="min-h-14 w-full rounded-2xl border-2 border-forest bg-white px-4 text-lg"
                {...register("email")}
              />
              {errors.email && <span role="alert" className="font-normal text-danger">{errors.email.message}</span>}
            </label>

            {error && <p role="alert" className="font-medium text-danger">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-14 rounded-full bg-mint px-6 text-xl font-semibold text-forest disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}

        <Link href="/login" className="text-lg font-semibold underline">Back to log in</Link>
      </div>
    </AuthShell>
  );
}