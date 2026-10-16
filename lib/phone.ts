export function normalizePhone(input: string): string | null {
  const d = input.replace(/[^\d]/g, "");
  if (/^0\d{10}$/.test(d)) return `234${d.slice(1)}`;
  if (/^234\d{10}$/.test(d)) return d;
  if (/^[1-9]\d{10,14}$/.test(d)) return d;
  return null;
}

export const displayPhone = (p: string) => `+${p}`;