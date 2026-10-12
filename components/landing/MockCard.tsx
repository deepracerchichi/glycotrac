const tones = {
  success: "border-success",
  warning: "border-warning",
  neutral: "border-ink/20",
};

export default function MockCard({
  time,
  name,
  label,
  tone,
}: {
  time: string;
  name: string;
  label: string;
  tone: keyof typeof tones;
}) {
  return (
    <div className={`rounded-2xl border-l-8 bg-card p-5 ${tones[tone]}`}>
      <p className="text-2xl font-extrabold">{time}</p>
      <p className="text-xl">{name}</p>
      <p className="mt-1 font-bold">{label}</p>
    </div>
  );
}