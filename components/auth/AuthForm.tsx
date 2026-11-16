"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { authSchema, type AuthValues } from "@/lib/validation/auth";
import { SITE } from "@/lib/site";

const copy = {
  login: {
    title: "Welcome back",
    sub: "Log in to see what's due today.",
    button: "Log in",
    busy: "Logging in...",
    alt: "New here?",
    altLabel: "Create an account",
    altHref: "/signup",
    autoComplete: "current-password",
  },
  signup: {
    title: "Create your account",
    sub: "Start keeping track of your medication.",
    button: "Create account",
    busy: "Creating...",
    alt: "Already have an account?",
    altLabel: "Log in",
    altHref: "/login",
    autoComplete: "new-password",
  },
} as const;

const input = "min-h-14 w-full rounded-2xl border-2 border-forest bg-white px-4 text-lg font-normal";

// Plain-language versions of the messages the sign-in service sends back.
function friendly(message: string) {
  const m = message.toLowerCase();
  if (m.includes("invalid login")) return "That email or password isn't right. Check them and try again.";
  if (m.includes("not confirmed")) return "Please confirm your email first. Check your inbox for our message.";
  if (m.includes("already registered") || m.includes("already been registered")) {
    return "That email already has an account. Try logging in instead.";
  }
  if (m.includes("rate limit") || m.includes("too many")) return "Too many tries. Please wait a minute and try again.";
  if (m.includes("fetch") || m.includes("network")) return "Can't reach the server. Check your internet connection.";
  return message;
}

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const c = copy[mode];
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const {
    register,
    handleSubmit,
    setError: setFieldError,
    formState: { errors, isSubmitting },
  } = useForm<AuthValues>({ resolver: zodResolver(authSchema) });

  async function onSubmit(values: AuthValues) {
    setError("");
    setNotice("");

    if (mode === "signup" && !values.agree) {
      return setFieldError("agree", { message: "Please tick the box to continue." });
    }

    const supabase = createClient();

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email: values.email, password: values.password });
        if (error) return setError(friendly(error.message));
      } else {
        const firstName = values.firstName?.trim();
        const { data, error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            // Keep proof of what was agreed to, and when.
            data: { ...(firstName ? { first_name: firstName } : {}), consented_at: new Date().toISOString(), terms_version: SITE.updated },
          },
        });
        if (error) return setError(friendly(error.message));
        if (!data.session) return setNotice("Check your email to confirm your account, then log in.");
      }
    } catch (e) {
      return setError(friendly(e instanceof Error ? e.message : "Something went wrong. Please try again."));
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-4xl font-medium tracking-tight md:text-5xl">{c.title}</h1>
        <p className="mt-2 text-xl text-ink/70">{c.sub}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5" noValidate>
        {mode === "signup" && (
          <label className="grid gap-2 text-lg font-medium">
            <span>
              First name <span className="font-normal text-ink/70">(optional)</span>
            </span>
            <input type="text" autoComplete="given-name" placeholder="What should we call you?" className={input} {...register("firstName")} />
            {errors.firstName && (
              <span role="alert" className="font-normal text-danger">
                {errors.firstName.message}
              </span>
            )}
          </label>
        )}

        <label className="grid gap-2 text-lg font-medium">
          Email address
          <input
            type="email"
            inputMode="email"
            autoCapitalize="none"
            autoComplete="email"
            placeholder="name@example.com"
            className={input}
            {...register("email")}
          />
          {errors.email && (
            <span role="alert" className="font-normal text-danger">
              {errors.email.message}
            </span>
          )}
        </label>

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-lg font-medium">
              Password
            </label>
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-pressed={show}
              className="min-h-11 px-1 text-lg font-medium underline"
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>
          <input
            id="password"
            type={show ? "text" : "password"}
            autoComplete={c.autoComplete}
            className={input}
            {...register("password")}
          />
          {mode === "signup" && !errors.password && <span className="text-base text-ink/70">At least 8 characters.</span>}
          {errors.password && (
            <span role="alert" className="text-danger">
              {errors.password.message}
            </span>
          )}
        </div>

        {mode === "login" && (
          <Link href="/forgot-password" className="inline-flex min-h-11 items-center justify-self-start text-lg font-medium underline">
            Forgot password?
          </Link>
        )}

        {error && (
          <p role="alert" className="rounded-2xl bg-bad-bg p-4 font-medium text-bad">
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="rounded-2xl bg-ok-bg p-4 font-medium text-ok">
            {notice}
          </p>
        )}

        {mode === "signup" && (
          <div className="grid gap-2">
            <label className="flex items-start gap-3 text-lg leading-snug">
              <input type="checkbox" className="mt-0.5 size-6 shrink-0 accent-forest" {...register("agree")} />
              <span>
                I agree to the{" "}
                <Link href="/terms" target="_blank" className="font-medium underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" target="_blank" className="font-medium underline">
                  Privacy
                </Link>
                , and I understand Glycotrac will store the health information I enter.
              </span>
            </label>
            {errors.agree && (
              <span role="alert" className="text-danger">
                {errors.agree.message}
              </span>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="min-h-14 rounded-full bg-forest px-6 text-xl font-semibold text-white transition hover:bg-pine active:scale-[0.99] disabled:opacity-60"
        >
          {isSubmitting ? c.busy : c.button}
        </button>

      </form>

      <p className="text-lg">
        {c.alt}{" "}
        <Link href={c.altHref} className="font-semibold underline">
          {c.altLabel}
        </Link>
      </p>
    </div>
  );
}
