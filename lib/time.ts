// v1 assumes everyone is on Nigeria time (UTC+1, no daylight saving)
export function lagosNow() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const get = (type: string) => parts.find((p) => p.type === type)!.value;

  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

// "13:00" -> "1:00 PM". Display only; the stored value stays 24-hour.
export function formatTime12(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}
