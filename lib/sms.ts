export async function sendSms(to: string, sms: string): Promise<boolean> {
  const apiKey = process.env.TERMII_API_KEY;
  const from = process.env.TERMII_SENDER_ID;
  if (!apiKey || !from) return false;

  const base = process.env.TERMII_BASE_URL ?? "https://api.ng.termii.com";

  try {
    const res = await fetch(`${base}/api/sms/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to,
        from,
        sms,
        type: "plain",
        channel: process.env.TERMII_CHANNEL ?? "dnd",
        api_key: apiKey,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}