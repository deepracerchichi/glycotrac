"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton({ className = "" }: { className?: string }) {
  const router = useRouter();

  async function logout() {
    await createClient().auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button onClick={logout} className={`min-h-12 rounded-xl px-5 font-medium ${className}`}>
      Log out
    </button>
  );
}