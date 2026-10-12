"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { authSchema, type AuthValues } from "@/lib/validation/auth";

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

const input = "min-h-14 w-full rounded-2xl border-2 border-forest bg-white px-4 text-lg";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const c = copy[mode];
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthValues>({ resolver: zodResolver(authSchema) });

  async function onSubmit(values: AuthValues) {
    setError("");
    setNotice("");
    const supabase = createClient();

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword(values);
      if (error) return setError(error.message);
    } else {
      const { data, error } = await supabase.auth.signUp(values);
      if (error) return setError(error.message);
      if (!data.session) return setNotice("Check your email to confirm your account, then log in.");
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-5xl font-medium tracking-tight">{c.title}</h1>
        <p className="mt-2 text-xl text-ink/70">{c.sub}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
        <label className="grid gap-2 text-lg font-medium">
          Email address
          <input type="email" autoComplete="email" placeholder="name@example.com" className={input} {...register("email")} />
          {errors.email && <span role="alert" className="font-normal text-danger">{errors.email.message}</span>}
        </label>

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-lg font-medium">Password</label>
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
          {errors.password && <span role="alert" className="text-danger">{errors.password.message}</span>}
        </div>

        {error && <p role="alert" className="font-medium text-danger">{error}</p>}
        {notice && <p role="status" className="font-medium">{notice}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="min-h-14 rounded-full bg-mint px-6 text-xl font-semibold text-forest disabled:opacity-60"
        >
          {isSubmitting ? c.busy : c.button}
        </button>
      </form>

      <p className="text-lg">
        {c.alt}{" "}
        <Link href={c.altHref} className="font-semibold underline">{c.altLabel}</Link>
      </p>
    </div>
  );
}