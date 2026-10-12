import { NextResponse } from "next/server";

type Concept = { rxcui: string; name: string };
type Group = { tty?: string; conceptProperties?: Concept[] };

const order: Record<string, number> = { SCD: 0, SBD: 1 };

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 3) return NextResponse.json({ results: [] });

  try {
    const res = await fetch(
      `https://rxnav.nlm.nih.gov/REST/drugs.json?name=${encodeURIComponent(q)}`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return NextResponse.json({ results: [] });

    const json = await res.json();
    const groups: Group[] = json?.drugGroup?.conceptGroup ?? [];

    const seen = new Set<string>();
    const results = groups
      .filter((g) => g.tty === "SCD" || g.tty === "SBD")
      .sort((a, b) => order[a.tty!] - order[b.tty!])
      .flatMap((g) => g.conceptProperties ?? [])
      .filter((c) => !seen.has(c.rxcui) && seen.add(c.rxcui))
      .slice(0, 8)
      .map((c) => ({ rxcui: c.rxcui, name: c.name }));

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] });
  }
}