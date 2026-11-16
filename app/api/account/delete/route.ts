import { NextResponse } from "next/server";
import { createClient as createAnonClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { eraseUser } from "@/lib/account";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return NextResponse.json({ error: "Please log in first." }, { status: 401 });

  let body: { password?: unknown; confirm?: unknown } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Something was wrong with that request." }, { status: 400 });
  }

  if (body.confirm !== "DELETE" || typeof body.password !== "string" || body.password.length === 0) {
    return NextResponse.json({ error: "Type DELETE and enter your password." }, { status: 400 });
  }

  // Check the password again, so a stolen or left-open session can't wipe the account on its own.
  const checker = createAnonClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
  const { error: passwordError } = await checker.auth.signInWithPassword({
    email: user.email,
    password: body.password,
  });
  if (passwordError) return NextResponse.json({ error: "That password isn't right." }, { status: 403 });

  try {
    await eraseUser(createAdminClient(), user.id);
  } catch (e) {
    console.error("[account delete]", e);
    return NextResponse.json(
      { error: "We couldn't finish deleting your account. Some of your records may already be removed. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
