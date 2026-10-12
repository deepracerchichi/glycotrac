import Image from "next/image";

const BRAND = "glycotrac";

export default function Wordmark({
  tone = "dark",
  mark = false,
}: {
  tone?: "dark" | "light";
  mark?: boolean;
}) {
  const src = `/logo-${mark ? "mark-" : ""}${tone === "light" ? "white" : "plum"}.svg`;

  return (
    <Image
      src={src}
      alt={BRAND}
      width={mark ? 22 : 150}
      height={mark ? 40 : 44}
      priority
      className="h-9 w-auto"
    />
  );
}