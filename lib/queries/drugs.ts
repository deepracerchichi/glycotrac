import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

export type DrugResult = { rxcui: string; name: string };

function useDebounced<T>(value: T, ms: number) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

export function useDrugSearch(text: string) {
  const q = useDebounced(text.trim(), 300);

  return useQuery({
    queryKey: ["drugs", q],
    enabled: q.length >= 3,
    staleTime: 1000 * 60 * 60,
    queryFn: async (): Promise<DrugResult[]> => {
      const res = await fetch(`/api/drugs?q=${encodeURIComponent(q)}`);
      if (!res.ok) return [];
      return (await res.json()).results;
    },
  });
}