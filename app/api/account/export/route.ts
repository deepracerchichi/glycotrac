import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { collectUserData } from "@/lib/account";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Please log in first." }, { status: 401 });

  try {
    const data = await collectUserData(supabase);
    const now = new Date();

    const file = {
      about: "Everything Glycotrac holds about you, as of the time below. Times are in UTC.",
      exportedAt: now.toISOString(),
      account: {
        id: user.id,
        email: user.email,
        firstName: user.user_metadata?.first_name ?? null,
        createdAt: user.created_at,
      },
      data,
    };

    return new NextResponse(JSON.stringify(file, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="glycotrac-data-${now.toISOString().slice(0, 10)}.json"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("[account export]", e);
    return NextResponse.json({ error: "We couldn't prepare your download. Please try again." }, { status: 500 });
  }
}
