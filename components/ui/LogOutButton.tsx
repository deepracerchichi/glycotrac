"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton({
  className = "",
  iconOnly = false,
}: {
  className?: string;
  iconOnly?: boolean;
}) {
  const router = useRouter();

  async function logout() {
    await createClient().auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      aria-label="Log out"
      className={`flex min-h-12 items-center justify-center gap-2 rounded-xl font-medium ${
        iconOnly ? "px-0" : "px-5"
      } ${className}`}
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
      </svg>
      {!iconOnly && "Log out"}
    </button>
  );
}